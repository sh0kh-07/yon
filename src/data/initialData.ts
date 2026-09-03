import { Direction, Employee } from '../types';

export const INITIAL_DIRECTIONS: Direction[] = [
  {
    id: 'dir-1',
    name: 'Металлы',
    description: 'Строительный металлопрокат, балки, каркасы и арматура',
    icon: '🔩',
    color: '#f59e0b', // amber
    order: 0,
  },
  {
    id: 'dir-2',
    name: 'Чиллерные системы',
    description: 'Промышленное холодоснабжение и климатические установки',
    icon: '❄️',
    color: '#38bdf8', // sky
    order: 1,
  },
  {
    id: 'dir-3',
    name: 'Блоки',
    description: 'Газобетонные, керамзитные и керамические стеновые блоки',
    icon: '🧱',
    color: '#fb923c', // orange
    order: 2,
  },
  {
    id: 'dir-4',
    name: 'Травертин',
    description: 'Фасадный натуральный камень, плитка и элементы облицовки',
    icon: '🪨',
    color: '#eab308', // yellow
    order: 3,
  },
  {
    id: 'dir-5',
    name: 'Электрика',
    description: 'Силовые кабели, трансформаторы, щитовые и автоматика',
    icon: '⚡',
    color: '#10b981', // emerald
    order: 4,
  },
  {
    id: 'dir-6',
    name: 'Сантехника',
    description: 'Водоснабжение, водоотведение и насосные группы',
    icon: '🚰',
    color: '#06b6d4', // cyan
    order: 5,
  },
  {
    id: 'dir-7',
    name: 'Утеплитель',
    description: 'Минеральная вата, пенополистирол и гидроизоляция',
    icon: '🛡️',
    color: '#8b5cf6', // violet
    order: 6,
  },
  {
    id: 'dir-8',
    name: 'Краска',
    description: 'Фасадные и интерьерные покрытия, грунты и колеровка',
    icon: '🎨',
    color: '#ec4899', // pink
    order: 7,
  },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Александр Иванов',
    description: 'Курирует закупки тяжелого металлопроката, арматуры и несущих балок.',
    avatarColor: '#3b82f6',
    directionIds: ['dir-1'],
    order: 0,
  },
  {
    id: 'emp-2',
    name: 'Дмитрий Петров',
    description: 'Отвечает за стеновые блоки, керамзит и конструктивную кладку.',
    avatarColor: '#10b981',
    directionIds: ['dir-3'],
    order: 1,
  },
  {
    id: 'emp-3',
    name: 'Елена Смирнова',
    description: 'Управляет поставками сантехнического оборудования и насосных станций.',
    avatarColor: '#ec4899',
    directionIds: ['dir-6'],
    order: 2,
  },
  {
    id: 'emp-4',
    name: 'Сергей Васильев',
    description: 'Монтаж, пусконаладка чиллеров и промышленного холодоснабжения.',
    avatarColor: '#6366f1',
    directionIds: ['dir-2'],
    order: 3,
  },
  {
    id: 'emp-5',
    name: 'Анна Соколова',
    description: 'Согласование поставок натурального травертина и облицовки фасадов.',
    avatarColor: '#eab308',
    directionIds: ['dir-4'],
    order: 4,
  },
  {
    id: 'emp-6',
    name: 'Михаил Кузнецов',
    description: 'Курирует прокладку силовых кабелей, трансформаторы и щитовые 0.4-10 кВ.',
    avatarColor: '#14b8a6',
    directionIds: ['dir-5'],
    order: 5,
  },
  {
    id: 'emp-7',
    name: 'Роман Ковалев',
    description: 'Новый специалист по снабжению. Готов принять в работу свободные направления.',
    avatarColor: '#f97316',
    directionIds: [],
    order: 6,
  },
];
