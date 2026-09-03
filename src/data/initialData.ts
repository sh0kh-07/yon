import { Direction, Employee } from '../types';

export const INITIAL_DIRECTIONS: Direction[] = [
  {
    id: "dir-mtl2j6bl-dfihw",
    name: "Металы",
    description: "",
    icon: "⛓️",
    color: "#6366f1",
    order: 0
  },
  {
    id: "dir-mtl2jnb3-5b3v8",
    name: "Метал трубы",
    description: "",
    icon: "⛓️",
    color: "#fb923c",
    order: 1
  },
  {
    id: "dir-mtl2k6xk-n3jq8",
    name: "Базальт",
    description: "",
    icon: "📦",
    color: "#fb923c",
    order: 2
  },
  {
    id: "dir-mtl2m22o-zommq",
    name: "Асфальт",
    description: "",
    icon: "🪨",
    color: "#f59e0b",
    order: 3
  },
  {
    id: "dir-mtl2mlpo-joskb",
    name: "Битум",
    description: "",
    icon: "🚰",
    color: "#f43f5e",
    order: 4
  },
  {
    id: "dir-mtl2n963-hooa4",
    name: "Железные опоры",
    description: "",
    icon: "🏗️",
    color: "#6366f1",
    order: 5
  },
  {
    id: "dir-mtl2nuim-o8tl0",
    name: "Светильник (Прожектор)",
    description: "",
    icon: "⚡",
    color: "#38bdf8",
    order: 6
  },
  {
    id: "dir-mtl2ohm3-wma7a",
    name: "Дорожные знаки",
    description: "",
    icon: "🦺",
    color: "#10b981",
    order: 7
  },
  {
    id: "dir-mtl2p1uc-ylf26",
    name: "Краска",
    description: "",
    icon: "🎨",
    color: "#10b981",
    order: 8
  },
  {
    id: "dir-mtl2ptwx-sihlg",
    name: "Сетка",
    description: "",
    icon: "⛓️",
    color: "#38bdf8",
    order: 9
  },
  {
    id: "dir-mtl2q2br-lm165",
    name: "Фитинг",
    description: "",
    icon: "🚰",
    color: "#eab308",
    order: 10
  },
  {
    id: "dir-mtl2qhpg-6bfgx",
    name: "Насос",
    description: "",
    icon: "🚰",
    color: "#8b5cf6",
    order: 11
  },
  {
    id: "dir-mtl2qx96-ptalf",
    name: "Чилер",
    description: "",
    icon: "❄️",
    color: "#38bdf8",
    order: 12
  },
  {
    id: "dir-mtl2rwlc-v2myv",
    name: "Солнечный панель",
    description: "",
    icon: "🔥",
    color: "#f43f5e",
    order: 13
  },
  {
    id: "dir-mtl2s862-gs23g",
    name: "Трансформатор",
    description: "",
    icon: "⚡",
    color: "#fb923c",
    order: 14
  },
  {
    id: "dir-mtl2siiq-pq0bz",
    name: "Генератор",
    description: "",
    icon: "⚡",
    color: "#fb923c",
    order: 15
  },
  {
    id: "dir-mtl2suaa-8pv5p",
    name: "Топлос",
    description: "",
    icon: "📦",
    color: "#10b981",
    order: 16
  },
  {
    id: "dir-mtl2t894-gvxm6",
    name: "Фиброцементный панель",
    description: "",
    icon: "🪨",
    color: "#10b981",
    order: 17
  },
  {
    id: "dir-mtl2v5qg-b2ur6",
    name: "Керпич",
    description: "",
    icon: "🧱",
    color: "#eab308",
    order: 18
  },
  {
    id: "dir-mtl2vhqw-kmhth",
    name: "Газаблок",
    description: "",
    icon: "🧱",
    color: "#f59e0b",
    order: 19
  },
  {
    id: "dir-mtl2vry1-9dfvm",
    name: "ЖБИ",
    description: "",
    icon: "🪨",
    color: "#6366f1",
    order: 20
  },
  {
    id: "dir-mtl2w7gs-3ig7a",
    name: "Бетон",
    description: "",
    icon: "🪨",
    color: "#38bdf8",
    order: 21
  },
  {
    id: "dir-mtl2tmdg-ekr0z",
    name: "Кабель",
    description: "",
    icon: "🔌",
    color: "#fb923c",
    order: 22
  },
  {
    id: "dir-mtl2wkip-rujkx",
    name: "Кафель",
    description: "",
    icon: "🪨",
    color: "#10b981",
    order: 23
  },
  {
    id: "dir-mtl2x6ny-l5489",
    name: "Котёл",
    description: "",
    icon: "🔥",
    color: "#f59e0b",
    order: 24
  },
  {
    id: "dir-mtl2xukl-4h5b9",
    name: "Релин",
    description: "",
    icon: "📦",
    color: "#fb923c",
    order: 25
  },
  {
    id: "dir-mtl2ykl6-r7iwd",
    name: "Мебель",
    description: "",
    icon: "🚪",
    color: "#eab308",
    order: 26
  },
  {
    id: "dir-mtl2za6e-zxf8t",
    name: "Буферный бочки",
    description: "",
    icon: "🚰",
    color: "#38bdf8",
    order: 27
  },
  {
    id: "dir-mtl306qm-kf9l1",
    name: "Электрот",
    description: "",
    icon: "🔥",
    color: "#f59e0b",
    order: 28
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "emp-mtl31w08-9argh",
    name: "Абдуллох",
    avatarColor: "#3b82f6",
    directionIds: [
      "dir-mtl2vhqw-kmhth",
      "dir-mtl2x6ny-l5489",
      "dir-mtl2xukl-4h5b9",
      "dir-mtl2vry1-9dfvm",
      "dir-mtl2ykl6-r7iwd",
      "dir-mtl2w7gs-3ig7a",
      "dir-mtl2v5qg-b2ur6",
      "dir-mtl2wkip-rujkx"
    ],
    order: 0
  },
  {
    id: "emp-mtl322du-5np5d",
    name: "Хайрулла",
    avatarColor: "#10b981",
    directionIds: [
      "dir-mtl2qx96-ptalf",
      "dir-mtl2suaa-8pv5p",
      "dir-mtl2rwlc-v2myv",
      "dir-mtl2t894-gvxm6",
      "dir-mtl2s862-gs23g",
      "dir-mtl2tmdg-ekr0z"
    ],
    order: 1
  },
  {
    id: "emp-mtl32d21-5evbz",
    name: "Jasur",
    avatarColor: "#f97316",
    directionIds: [
      "dir-mtl2q2br-lm165",
      "dir-mtl2ptwx-sihlg",
      "dir-mtl2za6e-zxf8t",
      "dir-mtl2qhpg-6bfgx",
      "dir-mtl306qm-kf9l1"
    ],
    order: 2
  },
  {
    id: "emp-mtl32vbw-7ksqh",
    name: "Sadoqat",
    avatarColor: "#ec4899",
    directionIds: [
      "dir-mtl2mlpo-joskb",
      "dir-mtl2jnb3-5b3v8",
      "dir-mtl2j6bl-dfihw",
      "dir-mtl2k6xk-n3jq8",
      "dir-mtl2m22o-zommq"
    ],
    order: 3
  },
  {
    id: "emp-mtl33ase-dzw7c",
    name: "Лайло",
    avatarColor: "#06b6d4",
    directionIds: [
      "dir-mtl2ohm3-wma7a",
      "dir-mtl2nuim-o8tl0",
      "dir-mtl2p1uc-ylf26",
      "dir-mtl2n963-hooa4",
      "dir-mtl2siiq-pq0bz"
    ],
    order: 4
  }
];