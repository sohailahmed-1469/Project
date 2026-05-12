// OrderCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types/order';
import { OrderStatusTag } from '../components/OrderStatusTag';

type Props = {
  order: Order;
};

export const OrderCard: React.FC<Props> = ({ order }) => {
  const customerName = order.customer?.name || 'N/A';
  const formattedTotalAmount = typeof order.totalAmount === 'number'
    ? order.totalAmount.toFixed(2)
    : 'N/A';

  return (
    <div className="border p-6 mb-4 rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-gray-800">Order #{order.orderId}</h3>
        <OrderStatusTag status={order.status} />
      </div>
      <div className="text-gray-600 mb-1">
        <span className="font-medium">Customer:</span> {customerName}
      </div>
      <div className="text-gray-600 mb-4">
        <span className="font-medium">Total Amount:</span> ₹{formattedTotalAmount}
      </div>
      <Link
        to={`/orders/${order.orderId}`}
        className="inline-block text-blue-600 hover:underline font-medium"
        aria-label={`View details for order ${order.orderId}`}
      >
        View Details →
      </Link>
    </div>
  );
};

export default OrderCard;
