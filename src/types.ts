export interface Direction {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
}

export interface Employee {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  phone?: string;
  description?: string;
  avatarColor: string;
  directionIds: string[];
  order: number;
}

export const getEmployeeName = (emp: { name?: string; firstName?: string; lastName?: string }): string => {
  if (emp.name && emp.name.trim()) return emp.name.trim();
  const combined = `${emp.firstName || ''} ${emp.lastName || ''}`.trim();
  return combined || 'Сотрудник';
};

export type ViewMode = 'connections' | 'employees' | 'directions' | 'matrix';

export interface FilterState {
  search: string;
  directionId: string | 'all' | 'unassigned';
  employeeStatus: 'all' | 'with-directions' | 'without-directions';
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export type DragItemType = 'direction' | 'employee' | 'direction-order';

export interface DragData {
  type: DragItemType;
  id: string;
  name?: string;
  fromEmployeeId?: string;
}
