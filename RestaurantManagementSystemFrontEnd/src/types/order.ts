export type Order = {
  orderId: number;
  orderDate: string;
  status: 'Open' | 'Received' | 'Cancelled';
  totalAmount: number;  // Ensure it's a number here
  paymentStatus: string;
  orderItems: any[];
  deliveryAddress: string;
  deliveryDate: string;
  discount: number;
  tax: number;
};
