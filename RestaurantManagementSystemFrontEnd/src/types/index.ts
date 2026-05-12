export interface User {
  id: string;
  username: string;
  email: string;
  profilePic: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  totalOrders: number;
  rating: number;
  favoriteItems: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  allergens: string[];
  isAvailable: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: {
    menuItem: MenuItem;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderDate: string;
  specialInstructions?: string;
}

export interface DashboardMetrics {
  totalOrders: number;
  totalCustomers: number;
  averageRating: number;
  totalRevenue: number;
  popularItems: MenuItem[];
  recentOrders: Order[];
}