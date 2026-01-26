
export type TabType = 'itinerary' | 'planning' | 'info' | 'shopping' | 'expenses';

export type ItineraryCategory = 'sightseeing' | 'food' | 'shopping' | 'transport' | 'accommodation' | 'ticket' | 'stay' | 'other';

export type TransportType = 'car' | 'flight' | 'transport' | 'walk';

export type PlanningCategory = 'todo' | 'luggage' | 'documents';

export type Assignee = 'All' | string; // 簡化型別，允許任意字串以配合動態成員

export interface WeatherInfo {
  condition: 'sunny' | 'cloudy' | 'rain';
  temp: string;
}

export interface DayInfo {
  date: string;
  weekday: string;
  hasCar: boolean;
}

export interface ItineraryItem {
  id: number;
  name: string;
  category: ItineraryCategory;
  startTime: string;
  hours?: string;
  address?: string;
  price?: string;
  note?: string;
  transportType?: TransportType;
  travelTime?: string;
  isNoteExpanded?: boolean;
}

export interface ShoppingItem {
  id: number;
  name: string;
  note: string;
  image?: string; 
}

export interface ExpenseSplit {
    memberId: string;
    amount: number;
}

export interface ExpenseItem {
  id: number;
  name: string;
  amount: number;
  category: ItineraryCategory;
  date: string;
  payment: 'Cash' | 'Card';
  payerId: string; // 改用 ID 對應 Member
  splits: ExpenseSplit[]; // 分帳細節
}

export interface PlanningItem {
  id: number;
  title: string;
  category: PlanningCategory;
  completed: boolean;
  assignedTo: Assignee;
}

export interface Member {
  id: string;
  name: string;
  email: string; // 新增 Email 欄位用於白名單驗證
  avatarUrl?: string; // Base64 string from client-side resize
  role?: 'Admin' | 'Member';
}

export interface AppData {
  itinerary: ItineraryItem[][];
  shopping: ShoppingItem[];
  expenses: ExpenseItem[];
  planning: PlanningItem[];
  members?: Member[];
}
