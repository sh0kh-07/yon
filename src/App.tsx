import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Direction,
  Employee,
  ViewMode,
  FilterState,
  ToastMessage,
  getEmployeeName,
} from './types';
import {
  loadEmployees,
  saveEmployees,
  loadDirections,
  saveDirections,
  loadViewMode,
  saveViewMode,
  resetToDemoData,
  clearAllData,
  generateId,
  exportDataToJson,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { SearchAndFilter } from './components/SearchAndFilter';
import { ConnectionsBoard } from './components/ConnectionsBoard';
import { ResponsibilityMatrix } from './components/ResponsibilityMatrix';
import { EmployeesView } from './components/EmployeesView';
import { DirectionsView } from './components/DirectionsView';
import { EmployeeModal } from './components/EmployeeModal';
import { DirectionModal } from './components/DirectionModal';
import { ConfirmModal } from './components/ConfirmModal';
import { QuickAssignModal } from './components/QuickAssignModal';
import { DataBackupModal } from './components/DataBackupModal';
import { Toast } from './components/Toast';

export default function App() {
  // Primary persistent state
  const [employees, setEmployees] = useState<Employee[]>(() => loadEmployees());
  const [directions, setDirections] = useState<Direction[]>(() => loadDirections());
  const [viewMode, setViewMode] = useState<ViewMode>(() => loadViewMode());

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    directionId: 'all',
    employeeStatus: 'all',
  });

  // Selected direction filter on connections board
  const [selectedDirectionFilter, setSelectedDirectionFilter] = useState<string | null>(null);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Modals state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [isDirectionModalOpen, setIsDirectionModalOpen] = useState(false);
  const [editingDirection, setEditingDirection] = useState<Direction | null>(null);

  const [quickAssignEmployee, setQuickAssignEmployee] = useState<Employee | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDangerous?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (title: string, description?: string, type: ToastMessage['type'] = 'success') => {
      const id = generateId('toast');
      setToasts((prev) => [...prev, { id, title, description, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3800);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Save employees whenever updated
  const updateEmployees = useCallback(
    (newEmployees: Employee[] | ((prev: Employee[]) => Employee[])) => {
      setEmployees((prev) => {
        const next = typeof newEmployees === 'function' ? newEmployees(prev) : newEmployees;
        saveEmployees(next);
        return next;
      });
    },
    []
  );

  // Save directions whenever updated
  const updateDirections = useCallback(
    (newDirections: Direction[] | ((prev: Direction[]) => Direction[])) => {
      setDirections((prev) => {
        const next = typeof newDirections === 'function' ? newDirections(prev) : newDirections;
        saveDirections(next);
        return next;
      });
    },
    []
  );

  // Save view mode
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    saveViewMode(mode);
  };

  // Maps for fast lookups
  const directionsMap = useMemo(() => {
    const map = new Map<string, Direction>();
    directions.forEach((d) => map.set(d.id, d));
    return map;
  }, [directions]);

  const employeesMap = useMemo(() => {
    const map = new Map<string, Employee>();
    employees.forEach((e) => map.set(e.id, e));
    return map;
  }, [employees]);

  // Synchronize quickAssignEmployee state if employees list changes
  useEffect(() => {
    if (quickAssignEmployee) {
      const updated = employees.find((e) => e.id === quickAssignEmployee.id);
      if (updated) setQuickAssignEmployee(updated);
    }
  }, [employees]);

  // DRAG & DROP & RELATIONSHIP ACTIONS:
  // 1. Add Direction to Employee (1 Direction = 1 Employee exclusivity enforced)
  const handleAddDirectionToEmployee = useCallback(
    (employeeId: string, directionId: string) => {
      const employee = employeesMap.get(employeeId);
      const direction = directionsMap.get(directionId);

      if (!employee || !direction) return;

      const empName = getEmployeeName(employee);
      if ((employee.directionIds || []).includes(directionId)) {
        addToast(
          `Направление уже назначено`,
          `«${direction.name}» уже есть в списке направлений у ${empName}`,
          'warning'
        );
        return;
      }

      // Check if another employee already has this direction
      const otherHolder = employees.find(
        (e) => e.id !== employeeId && (e.directionIds || []).includes(directionId)
      );
      if (otherHolder) {
        const otherName = getEmployeeName(otherHolder);
        addToast(
          `Направление уже занято!`,
          `«${direction.name}» уже закреплено за сотрудником ${otherName}. Одно направление закрепляется строго за одним сотрудником.`,
          'warning'
        );
        return;
      }

      updateEmployees((prev) =>
        prev.map((emp) => {
          if (emp.id === employeeId) {
            return {
              ...emp,
              directionIds: [...(emp.directionIds || []), directionId],
            };
          }
          return emp;
        })
      );

      addToast(
        `Направление «${direction.name}» закреплено`,
        `Сотрудник: ${empName}`,
        'success'
      );
    },
    [employees, employeesMap, directionsMap, updateEmployees, addToast]
  );

  // 2. Remove Direction from Employee
  const handleRemoveDirectionFromEmployee = useCallback(
    (employeeId: string, directionId: string) => {
      const employee = employeesMap.get(employeeId);
      const direction = directionsMap.get(directionId);

      updateEmployees((prev) =>
        prev.map((emp) => {
          if (emp.id === employeeId) {
            return {
              ...emp,
              directionIds: (emp.directionIds || []).filter((id) => id !== directionId),
            };
          }
          return emp;
        })
      );

      const empName = employee ? getEmployeeName(employee) : 'сотрудника';
      const dirName = direction ? `«${direction.name}»` : 'направлением';
      addToast('Связь удалена', `Отвязано от ${empName} ${dirName}`, 'info');
    },
    [employeesMap, directionsMap, updateEmployees, addToast]
  );

  // 3. Toggle Connection (used by matrix & quick assigns)
  const handleToggleConnection = useCallback(
    (employeeId: string, directionId: string) => {
      const employee = employeesMap.get(employeeId);
      if (!employee) return;

      const isConnected = (employee.directionIds || []).includes(directionId);
      if (isConnected) {
        handleRemoveDirectionFromEmployee(employeeId, directionId);
      } else {
        // Exclusivity check before adding
        const otherHolder = employees.find(
          (e) => e.id !== employeeId && (e.directionIds || []).includes(directionId)
        );
        if (otherHolder) {
          const otherName = getEmployeeName(otherHolder);
          const direction = directionsMap.get(directionId);
          const dirName = direction ? `«${direction.name}»` : 'это направление';
          addToast(
            `Направление уже занято!`,
            `${dirName} уже закреплено за ${otherName}. Одно направление может иметь только одного ответственного.`,
            'warning'
          );
          return;
        }
        handleAddDirectionToEmployee(employeeId, directionId);
      }
    },
    [employees, employeesMap, directionsMap, handleAddDirectionToEmployee, handleRemoveDirectionFromEmployee, addToast]
  );

  // EMPLOYEE CRUD:
  const handleSaveEmployee = (empData: Omit<Employee, 'id' | 'order'>) => {
    // Filter out any direction that belongs to another employee to prevent conflicts
    const sanitizedDirectionIds = (empData.directionIds || []).filter((dirId) => {
      const otherHolder = employees.find(
        (e) => e.id !== editingEmployee?.id && (e.directionIds || []).includes(dirId)
      );
      return !otherHolder;
    });

    const sanitizedData = {
      ...empData,
      directionIds: sanitizedDirectionIds,
    };

    if (editingEmployee) {
      // Update
      updateEmployees((prev) =>
        prev.map((e) => (e.id === editingEmployee.id ? { ...e, ...sanitizedData } : e))
      );
      const savedName = sanitizedData.name || `${sanitizedData.firstName || ''} ${sanitizedData.lastName || ''}`.trim() || 'Сотрудник';
      addToast('Сотрудник обновлен', savedName, 'success');
    } else {
      // Create
      const newEmp: Employee = {
        ...sanitizedData,
        id: generateId('emp'),
        order: employees.length,
      };
      updateEmployees((prev) => [...prev, newEmp]);
      const savedName = newEmp.name || `${newEmp.firstName || ''} ${newEmp.lastName || ''}`.trim() || 'Сотрудник';
      addToast('Сотрудник создан', savedName, 'success');
    }
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    const empName = getEmployeeName(employee);
    const linkedCount = employee.directionIds?.length || 0;
    const message =
      linkedCount > 0
        ? `Вы действительно хотите удалить сотрудника «${empName}»?\nБудет удалено ${linkedCount} связей с направлениями.`
        : `Вы действительно хотите удалить сотрудника «${empName}»?`;

    setConfirmModalConfig({
      isOpen: true,
      title: 'Удаление сотрудника',
      message,
      onConfirm: () => {
        updateEmployees((prev) => prev.filter((e) => e.id !== employee.id));
        setConfirmModalConfig((c) => ({ ...c, isOpen: false }));
        addToast('Сотрудник удален', empName, 'info');
      },
    });
  };

  // DIRECTION CRUD:
  const handleSaveDirection = (dirData: Omit<Direction, 'id' | 'order'>) => {
    if (editingDirection) {
      // Update
      updateDirections((prev) =>
        prev.map((d) => (d.id === editingDirection.id ? { ...d, ...dirData } : d))
      );
      addToast('Направление обновлено', `«${dirData.name}»`, 'success');
    } else {
      // Create
      const newDir: Direction = {
        ...dirData,
        id: generateId('dir'),
        order: directions.length,
      };
      updateDirections((prev) => [...prev, newDir]);
      addToast('Направление создано', `«${newDir.name}» добавлено в систему`, 'success');
    }
    setEditingDirection(null);
  };

  const handleDeleteDirection = (direction: Direction) => {
    const linkedEmployees = employees.filter((e) => e.directionIds?.includes(direction.id));
    const linkedCount = linkedEmployees.length;

    const message =
      linkedCount > 0
        ? `Это направление связано с ${linkedCount} сотрудниками.\n\nУдалить направление «${direction.name}» и все связанные связи?`
        : `Вы уверены, что хотите удалить направление «${direction.name}»?`;

    setConfirmModalConfig({
      isOpen: true,
      title: 'Удаление направления',
      message,
      onConfirm: () => {
        // Remove direction from list
        updateDirections((prev) => prev.filter((d) => d.id !== direction.id));
        // Remove direction ID from all employees
        updateEmployees((prev) =>
          prev.map((emp) => ({
            ...emp,
            directionIds: (emp.directionIds || []).filter((id) => id !== direction.id),
          }))
        );
        if (selectedDirectionFilter === direction.id) {
          setSelectedDirectionFilter(null);
        }
        setConfirmModalConfig((c) => ({ ...c, isOpen: false }));
        addToast('Направление удалено', `«${direction.name}» и все связи очищены`, 'info');
      },
    });
  };

  // Reset to demo data
  const handleResetToDemo = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Сбросить к демонстрационным данным?',
      message: 'Текущие изменения будут заменены стандартным набором строительных направлений и сотрудников.',
      isDangerous: false,
      onConfirm: () => {
        const { employees: demoEmp, directions: demoDir } = resetToDemoData();
        setEmployees(demoEmp);
        setDirections(demoDir);
        setSelectedDirectionFilter(null);
        setConfirmModalConfig((c) => ({ ...c, isOpen: false }));
        addToast('Демо-данные восстановлены', 'Загружен стандартный набор строительных направлений', 'info');
      },
    });
  };

  // Clear all data
  const handleClearAll = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Очистить все данные?',
      message: 'Все сотрудники, направления и связи будут безвозвратно удалены из хранилища.',
      isDangerous: true,
      onConfirm: () => {
        const { employees: emptyEmp, directions: emptyDir } = clearAllData();
        setEmployees(emptyEmp);
        setDirections(emptyDir);
        setSelectedDirectionFilter(null);
        setConfirmModalConfig((c) => ({ ...c, isOpen: false }));
        addToast('Все данные очищены', 'Хранилище пусто', 'info');
      },
    });
  };

  // Reorder handlers
  const handleReorderEmployees = (newOrder: Employee[]) => {
    updateEmployees(newOrder);
    addToast('Порядок сохранен', 'Новый порядок сотрудников записан', 'info');
  };

  const handleReorderDirections = (newOrder: Direction[]) => {
    updateDirections(newOrder);
    addToast('Порядок сохранен', 'Новый порядок направлений записан', 'info');
  };

  // Data Copy & Backup Handlers
  const handleCopyDataToClipboard = useCallback(async () => {
    try {
      const jsonString = exportDataToJson(employees, directions);
      await navigator.clipboard.writeText(jsonString);
      addToast(
        'Данные скопированы!',
        'Все сотрудники и строительные направления скопированы в буфер обмена.',
        'success'
      );
    } catch {
      try {
        const jsonString = exportDataToJson(employees, directions);
        const textArea = document.createElement('textarea');
        textArea.value = jsonString;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        addToast(
          'Данные скопированы!',
          'Все сотрудники и строительные направления скопированы в буфер обмена.',
          'success'
        );
      } catch {
        setIsBackupModalOpen(true);
      }
    }
  }, [employees, directions, addToast]);

  const handleDownloadJsonFile = useCallback(() => {
    const jsonString = exportDataToJson(employees, directions);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `construction_data_${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('Файл скачан', `Файл construction_data_${timestamp}.json успешно сохранен.`, 'info');
  }, [employees, directions, addToast]);

  const handleApplyImportedData = useCallback(
    (newEmployees: Employee[], newDirections: Direction[]) => {
      setEmployees(newEmployees);
      setDirections(newDirections);
      saveEmployees(newEmployees);
      saveDirections(newDirections);
      setSelectedDirectionFilter(null);
    },
    []
  );

  // Filtered employees for SearchAndFilter
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // 1. Search text
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const empName = getEmployeeName(emp).toLowerCase();
        const desc = (emp.description || '').toLowerCase();
        const empDirections = (emp.directionIds || [])
          .map((id) => directionsMap.get(id)?.name || '')
          .join(' ')
          .toLowerCase();

        if (!empName.includes(query) && !desc.includes(query) && !empDirections.includes(query)) {
          return false;
        }
      }

      // 2. Direction filter
      if (filters.directionId !== 'all') {
        if (filters.directionId === 'unassigned') {
          // Check if employee has any direction that is unassigned? Or directions without employees?
          // unassigned here means employee without directions
          if (emp.directionIds && emp.directionIds.length > 0) return false;
        } else {
          if (!emp.directionIds?.includes(filters.directionId)) return false;
        }
      }

      // 3. Employee status filter
      if (filters.employeeStatus === 'with-directions') {
        if (!emp.directionIds || emp.directionIds.length === 0) return false;
      } else if (filters.employeeStatus === 'without-directions') {
        if (emp.directionIds && emp.directionIds.length > 0) return false;
      }

      return true;
    });
  }, [employees, filters, directionsMap]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col font-sans bg-grid-pattern">
      {/* Top sticky Navbar */}
      <Navbar
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onAddEmployee={() => {
          setEditingEmployee(null);
          setIsEmployeeModalOpen(true);
        }}
        onAddDirection={() => {
          setEditingDirection(null);
          setIsDirectionModalOpen(true);
        }}
        onCopyData={handleCopyDataToClipboard}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onDownloadJson={handleDownloadJsonFile}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Main Container: Expands to full screen width when in fullscreen mode */}
      <main
        className={`flex-1 w-full mx-auto px-3 sm:px-5 lg:px-6 py-5 space-y-5 transition-all ${
          isFullscreen ? 'max-w-none' : 'max-w-7xl'
        }`}
      >
        {/* Top Info / KPI Stats Cards */}
        <StatsCards
          employees={employees}
          directions={directions}
          filters={filters}
          onFilterChange={(newFilters) =>
            setFilters((prev) => ({ ...prev, ...newFilters }))
          }
        />

        {/* Global Search and Filter Bar */}
        <SearchAndFilter
          filters={filters}
          onFilterChange={(newFilters) =>
            setFilters((prev) => ({ ...prev, ...newFilters }))
          }
          directions={directions}
          employees={employees}
          filteredCount={filteredEmployees.length}
          totalCount={employees.length}
        />

        {/* Content View Switcher */}
        {viewMode === 'connections' && (
          <ConnectionsBoard
            directions={directions}
            employees={filteredEmployees}
            directionsMap={directionsMap}
            onAddDirectionToEmployee={handleAddDirectionToEmployee}
            onRemoveDirectionFromEmployee={handleRemoveDirectionFromEmployee}
            onOpenAddEmployee={() => {
              setEditingEmployee(null);
              setIsEmployeeModalOpen(true);
            }}
            onOpenAddDirection={() => {
              setEditingDirection(null);
              setIsDirectionModalOpen(true);
            }}
            onEditEmployee={(emp) => {
              setEditingEmployee(emp);
              setIsEmployeeModalOpen(true);
            }}
            onDeleteEmployee={handleDeleteEmployee}
            onOpenQuickAssign={(emp) => setQuickAssignEmployee(emp)}
            onReorderEmployees={handleReorderEmployees}
            onReorderDirections={handleReorderDirections}
            selectedDirectionFilter={selectedDirectionFilter}
            onSelectDirectionFilter={setSelectedDirectionFilter}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
          />
        )}

        {viewMode === 'matrix' && (
          <ResponsibilityMatrix
            employees={filteredEmployees}
            directions={directions}
            onToggleConnection={handleToggleConnection}
            onOpenAddEmployee={() => {
              setEditingEmployee(null);
              setIsEmployeeModalOpen(true);
            }}
            onOpenAddDirection={() => {
              setEditingDirection(null);
              setIsDirectionModalOpen(true);
            }}
          />
        )}

        {viewMode === 'employees' && (
          <EmployeesView
            employees={employees}
            directions={directions}
            directionsMap={directionsMap}
            onOpenAddEmployee={() => {
              setEditingEmployee(null);
              setIsEmployeeModalOpen(true);
            }}
            onEditEmployee={(emp) => {
              setEditingEmployee(emp);
              setIsEmployeeModalOpen(true);
            }}
            onDeleteEmployee={handleDeleteEmployee}
            onOpenQuickAssign={(emp) => setQuickAssignEmployee(emp)}
            onAddDirectionToEmployee={handleAddDirectionToEmployee}
            onRemoveDirectionFromEmployee={handleRemoveDirectionFromEmployee}
            onReorderEmployees={handleReorderEmployees}
          />
        )}

        {viewMode === 'directions' && (
          <DirectionsView
            directions={directions}
            employees={employees}
            onOpenAddDirection={() => {
              setEditingDirection(null);
              setIsDirectionModalOpen(true);
            }}
            onEditDirection={(dir) => {
              setEditingDirection(dir);
              setIsDirectionModalOpen(true);
            }}
            onDeleteDirection={handleDeleteDirection}
            onReorderDirections={handleReorderDirections}
            onToggleConnection={handleToggleConnection}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#080808] py-3.5 mt-auto text-[11px] text-white/40">
        <div
          className={`mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 transition-all ${
            isFullscreen ? 'max-w-none' : 'max-w-7xl'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white/60 tracking-wider uppercase text-[10px]">КОНСТРУКТ-МЕНЕДЖЕР</span>
            <span>•</span>
            <span>Система управления строительными направлениями и персоналом</span>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
              Хранилище: Локальное (Active)
            </span>
            <span className="text-white/20">|</span>
            <span>Версия 2.1.0-dark</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
        allDirections={directions}
        allEmployees={employees}
      />

      <DirectionModal
        isOpen={isDirectionModalOpen}
        onClose={() => {
          setIsDirectionModalOpen(false);
          setEditingDirection(null);
        }}
        onSave={handleSaveDirection}
        initialData={editingDirection}
      />

      <QuickAssignModal
        isOpen={Boolean(quickAssignEmployee)}
        onClose={() => setQuickAssignEmployee(null)}
        employee={quickAssignEmployee}
        allDirections={directions}
        allEmployees={employees}
        onToggleDirection={handleToggleConnection}
      />

      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
        isDangerous={confirmModalConfig.isDangerous}
      />

      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        employees={employees}
        directions={directions}
        onApplyImportedData={handleApplyImportedData}
        onShowToast={(title, msg, type) => addToast(title, msg, type)}
      />

      {/* Floating Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
