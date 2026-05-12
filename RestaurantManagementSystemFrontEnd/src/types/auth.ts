export interface User {
  id: string;
  userName:string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER' ;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (email: string, password: string, name: string) => void;
  refreshAccessToken: () => Promise<void>;
}

export interface OrderItemRequestDto {
  menuItemId: number;
  quantity: number;
}

export interface CreateOrderRequestDto {
  orderDate: string;
  deliveryAddress: string;
  deliveryDate: string;
  discount: string;
  tax: string;
  orderItems: OrderItemRequestDto[];
}
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface ReservationPayload {
  customerName: string;
  contactNumber: string;
  email: string;
  reservationDate: string; 
  reservationTime: string; 
  numberOfGuests: number;
  specialRequests: string;
  status: ReservationStatus;
}

export interface Reservation extends ReservationPayload {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}




