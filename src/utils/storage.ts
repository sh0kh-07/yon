import { Direction, Employee, ViewMode } from '../types';
import { INITIAL_DIRECTIONS, INITIAL_EMPLOYEES } from '../data/initialData';

const STORAGE_KEYS = {
  EMPLOYEES: 'builder_crm_employees_v2',
  DIRECTIONS: 'builder_crm_directions_v2',
  VIEW_MODE: 'builder_crm_view_mode_v2',
};

// Automatically clean up old v1 keys to reset data cleanly
try {
  localStorage.removeItem('builder_crm_employees_v1');
  localStorage.removeItem('builder_crm_directions_v1');
} catch {
  // ignore
}

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
