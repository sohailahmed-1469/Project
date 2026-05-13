import api from './axios';

import { Order } from '../types/order';

import {
  CreateOrderRequestDto,
  ReservationPayload,
  Reservation
} from '../types/auth';

const API_BASE_URL = 'https://restaurant-user-service.onrender.com';
const API_BASE_URL_1 = 'http://localhost:8082/api';
const API_BASE_URL_2 = 'http://localhost:8083/api/order';
const API_BASE_URL_3 = 'http://localhost:8084/api/reservations';


// ======================
// AUTH APIs
// ======================

export const authAPI = {

  login: async ({
    email,
    password
  }: {
    email: string;
    password: string;
  }) => {

    const response = await api.post(
      `${API_BASE_URL}/auth/login`,
      { email, password }
    );

    return response.data;
  },

  register: async ({
    email,
    password,
    userName,
    role
  }: {
    email: string;
    password: string;
    userName: string;
    role: string;
  }) => {

    const response = await api.post(
      `${API_BASE_URL}/auth/register`,
      {
        userName,
        email,
        password,
        role
      }
    );

    return response.data;
  },

  refreshToken: async ({
    refreshToken
  }: {
    refreshToken: string;
  }) => {

    const response = await api.post(
      `${API_BASE_URL}/auth/refresh-token`,
      {
        refreshToken
      }
    );

    return response.data;
  },
};


// ======================
// MENU APIs
// ======================

export const menuAPI = {

  getCategories: async () => {

    const response = await api.get(
      `${API_BASE_URL_1}/menu/categories`
    );

    return response.data;
  },

  getCategoryItems: async (
    categoryId: string
  ) => {

    const response = await api.get(
      `${API_BASE_URL_1}/menu/category/${categoryId}`
    );

    return response.data;
  },

  getMenuItemDetails: async (
    itemId: string
  ) => {

    const response = await api.get(
      `${API_BASE_URL_1}/menu/item/${itemId}`
    );

    return response.data;
  },

  getAllMenuItems: async () => {

    const response = await api.get(
      `${API_BASE_URL_1}/menu/getAllMenuItems`
    );

    return response.data;
  },

  addCategory: async (
    categoryData: {
      name: string;
      categoryImage?: string;
    }
  ) => {

    const response = await api.post(
      `${API_BASE_URL_1}/menu/addCategory`,
      categoryData
    );

    return response.data;
  },

  addMenuItem: async (
    itemData: {
      name: string;
      price: number;
      image: string;
      categoryName: string;
      ingredients?: string;
      description?: string;
    }
  ) => {

    const response = await api.post(
      `${API_BASE_URL_1}/menu/addItemToCategory`,
      itemData
    );

    return response.data;
  },
};


// ======================
// ORDER APIs
// ======================

export const ordersAPI = {

  getAll: async (): Promise<Order[]> => {

    const response = await api.get(
      `${API_BASE_URL_2}/viewAllOrders`
    );

    return response.data;
  },

  getByStatus: async (
    status: string
  ) => {

    const encodedStatus =
      encodeURIComponent(status.toUpperCase());

    const response = await api.get(
      `${API_BASE_URL_2}/status?status=${encodedStatus}`
    );

    return response.data;
  },

  getById: async (
    id: string
  ) => {

    const response = await api.get(
      `${API_BASE_URL_2}/viewOrderById/${id}`
    );

    return response.data;
  },

  createOrder: async (
    orderData: CreateOrderRequestDto
  ): Promise<Order> => {

    const response = await api.post(
      `${API_BASE_URL_2}/createOrder`,
      orderData
    );

    return response.data;
  },

  updateOrderStatus: async (
    orderId: string,
    newStatus: string
  ): Promise<string> => {

    const response = await api.put(
      `${API_BASE_URL_2}/${orderId}/status`,
      {
        status: newStatus
      }
    );

    return response.data;
  },

  filterOrders: async (
    filters: {
      orderId?: string;
      customerName?: string;
      fromDate?: string;
      toDate?: string;
      status?: string;
      productName?: string;
    }
  ) => {

    const response = await api.post(
      `${API_BASE_URL_2}/filter`,
      filters
    );

    return response.data;
  },
};


// ======================
// RESERVATION APIs
// ======================

export const reservationApi = {

  createReservation: async (
    reservationData: ReservationPayload
  ): Promise<Reservation> => {

    const response = await api.post(
      `${API_BASE_URL_3}/createReservation`,
      reservationData
    );

    return response.data;
  },

  getAllReservations: async (): Promise<Reservation[]> => {

    const response = await api.get(
      `${API_BASE_URL_3}/getAllReservations`
    );

    return response.data;
  },
};


// ======================
// CART APIs
// ======================

export const cartAPI = {

  addItemToCart: async (
    productId: string,
    quantity: number
  ) => {

    const response = await api.post(
      '/api/cart/add',
      {
        productId,
        quantity
      }
    );

    return response.data;
  },
};


export type { ReservationPayload };
