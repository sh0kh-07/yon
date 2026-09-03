import { Direction, Employee, ViewMode } from '../types';
import { INITIAL_DIRECTIONS, INITIAL_EMPLOYEES } from '../data/initialData';

const STORAGE_KEYS = {
  EMPLOYEES: 'builder_crm_employees_v2',
  DIRECTIONS: 'builder_crm_directions_v2',
  VIEW_MODE: 'builder_crm_view_mode_v2',
};

export function loadEmployees(): Employee[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    if (!raw) {
      saveEmployees(INITIAL_EMPLOYEES);
      return INITIAL_EMPLOYEES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Enforce strictly unique directions (one direction cannot belong to 2 employees)
      const claimedDirections = new Set<string>();
      return parsed
        .map((e) => {
          const uniqueDirectionIds = (e.directionIds || []).filter((dirId: string) => {
            if (claimedDirections.has(dirId)) return false;
            claimedDirections.add(dirId);
            return true;
          });
          return {
            ...e,
            name: e.name || `${e.firstName || ''} ${e.lastName || ''}`.trim() || 'Сотрудник',
            directionIds: uniqueDirectionIds,
          };
        })
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
  } catch (error) {
    console.error('Failed to load employees from localStorage:', error);
  }
  return INITIAL_EMPLOYEES;
}

export function saveEmployees(employees: Employee[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  } catch (error) {
    console.error('Failed to save employees to localStorage:', error);
  }
}

export function loadDirections(): Direction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DIRECTIONS);
    if (!raw) {
      saveDirections(INITIAL_DIRECTIONS);
      return INITIAL_DIRECTIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
  } catch (error) {
    console.error('Failed to load directions from localStorage:', error);
  }
  return INITIAL_DIRECTIONS;
}

export function saveDirections(directions: Direction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DIRECTIONS, JSON.stringify(directions));
  } catch (error) {
    console.error('Failed to save directions to localStorage:', error);
  }
}

export function loadViewMode(): ViewMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    if (raw && ['connections', 'employees', 'directions', 'matrix'].includes(raw)) {
      return raw as ViewMode;
    }
  } catch {
    // ignore
  }
  return 'connections';
}

export function saveViewMode(mode: ViewMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
  } catch {
    // ignore
  }
}

export function resetToDemoData(): { employees: Employee[]; directions: Direction[] } {
  saveEmployees(INITIAL_EMPLOYEES);
  saveDirections(INITIAL_DIRECTIONS);
  return {
    employees: [...INITIAL_EMPLOYEES],
    directions: [...INITIAL_DIRECTIONS],
  };
}

export function clearAllData(): { employees: Employee[]; directions: Direction[] } {
  saveEmployees([]);
  saveDirections([]);
  return { employees: [], directions: [] };
}

export function generateId(prefix: string = 'item'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

export interface AppBackupData {
  version: string;
  exportedAt: string;
  appName: string;
  employees: Employee[];
  directions: Direction[];
}

export function exportDataToJson(employees: Employee[], directions: Direction[]): string {
  const data: AppBackupData = {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    appName: 'Управление строительными направлениями',
    employees,
    directions,
  };
  return JSON.stringify(data, null, 2);
}

export function importDataFromJson(
  rawJson: string,
  currentDirections: Direction[] = []
): {
  success: boolean;
  employees?: Employee[];
  directions?: Direction[];
  error?: string;
} {
  try {
    const trimmed = rawJson.trim();
    if (!trimmed) {
      return { success: false, error: 'Вставленный текст пуст.' };
    }

    const parsed = JSON.parse(trimmed);

    let parsedEmployees: any[] = [];
    let parsedDirections: any[] = [];

    if (Array.isArray(parsed)) {
      // Direct array of employees
      parsedEmployees = parsed;
      parsedDirections = currentDirections;
    } else if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.employees)) {
        parsedEmployees = parsed.employees;
      }
      if (Array.isArray(parsed.directions)) {
        parsedDirections = parsed.directions;
      } else if (currentDirections.length > 0) {
        parsedDirections = currentDirections;
      }
    }

    if (parsedEmployees.length === 0 && parsedDirections.length === 0) {
      return {
        success: false,
        error: 'В JSON не найдены массивы сотрудников (employees) или направлений (directions).',
      };
    }

    // Validate and normalize directions
    const sanitizedDirections: Direction[] = parsedDirections.map((dir: any, index: number) => ({
      id: String(dir.id || generateId('dir')),
      name: String(dir.name || 'Без названия').trim(),
      description: String(dir.description || ''),
      icon: String(dir.icon || dir.iconName || 'Building2'),
      color: String(dir.color || '#F27D26'),
      order: typeof dir.order === 'number' ? dir.order : index,
    }));

    // Available direction IDs set
    const validDirIds = new Set(sanitizedDirections.map((d) => d.id));

    // Claimed directions to enforce strictly 1 direction = 1 employee
    const claimedDirections = new Set<string>();

    const sanitizedEmployees: Employee[] = parsedEmployees.map((emp: any, index: number) => {
      const id = String(emp.id || generateId('emp'));
      const rawDirectionIds: string[] = Array.isArray(emp.directionIds)
        ? emp.directionIds.map(String)
        : [];

      // Filter to only existing directions and ensure no double assignments
      const uniqueDirIds = rawDirectionIds.filter((dirId) => {
        if (sanitizedDirections.length > 0 && !validDirIds.has(dirId)) {
          return false;
        }
        if (claimedDirections.has(dirId)) {
          return false;
        }
        claimedDirections.add(dirId);
        return true;
      });

      return {
        id,
        name: emp.name ? String(emp.name).trim() : `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || `Сотрудник ${index + 1}`,
        firstName: emp.firstName ? String(emp.firstName) : undefined,
        lastName: emp.lastName ? String(emp.lastName) : undefined,
        position: emp.position || emp.role ? String(emp.position || emp.role) : 'Специалист',
        phone: emp.phone ? String(emp.phone) : undefined,
        description: emp.description ? String(emp.description) : undefined,
        avatarColor: String(emp.avatarColor || emp.color || '#F27D26'),
        order: typeof emp.order === 'number' ? emp.order : index,
        directionIds: uniqueDirIds,
      };
    });

    // Save to localStorage simultaneously!
    if (sanitizedEmployees.length > 0) {
      saveEmployees(sanitizedEmployees);
    }
    if (sanitizedDirections.length > 0) {
      saveDirections(sanitizedDirections);
    }

    return {
      success: true,
      employees: sanitizedEmployees,
      directions: sanitizedDirections.length > 0 ? sanitizedDirections : undefined,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Ошибка парсинга JSON: ${err?.message || 'Некорректный синтаксис файла'}`,
    };
  }
}
