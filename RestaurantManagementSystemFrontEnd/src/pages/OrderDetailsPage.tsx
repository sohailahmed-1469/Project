import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ordersAPI } from '../services/api';

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'REJECTED';

export interface OrderItem {
  orderItemId: string;
  itemName: string;
  quantity: number;
  totalPrice: number;
}

export interface Customer {
  name: string;
}

export interface Order {
  orderId: string;
  orderDate: string;
  deliveryDate: string;
  deliveryAddress: string;
  status: OrderStatus;
  totalAmount: number;
  tax: number;
  discount: number;
  paymentStatus: string;
  customer?: Customer;
  orderItems: OrderItem[];
}

export const OrderDetailsPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [popupType, setPopupType] = useState<'success' | 'error' | null>(null);

  const showPopup = (message: string, type: 'success' | 'error') => {
    setPopupMessage(message);
    setPopupType(type);
    setTimeout(() => {
      setPopupMessage(null);
      setPopupType(null);
    }, 3000);
  };

  const fetchOrder = async () => {
    if (!orderId) return;
    try {
      const data = await ordersAPI.getById(orderId);
      setOrder(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: OrderStatus) => {
    if (!orderId) return;
    try {
      const result = await ordersAPI.updateOrderStatus(orderId, status);
      if (result === 'SUCCESS') {
        await fetchOrder(); // Fetch the updated order details
        const message = status === 'REJECTED' ? 'Order rejected successfully!' : `Order ${status.toLowerCase().replace('_', ' ')} successfully!`;
        showPopup(message, 'success');
      } else {
        showPopup(`Failed to update order to ${status}`, 'error');
      }
    } catch (err) {
      showPopup(`Error updating order to ${status}`, 'error');
    }
  };

  const renderNextActions = () => {
    if (!order) return null;

    switch (order.status) {
      case 'PLACED':
        return (
          <>
            <button onClick={() => updateStatus('CONFIRMED')} className="bg-green-500 text-white px-4 py-2 rounded-lg">Confirm</button>
            <button onClick={() => updateStatus('REJECTED')} className="bg-red-500 text-white px-4 py-2 rounded-lg">Reject</button>
          </>
        );
      case 'CONFIRMED':
        return <button onClick={() => updateStatus('PREPARING')} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Start Preparing</button>;
      case 'PREPARING':
        return <button onClick={() => updateStatus('READY_FOR_PICKUP')} className="bg-yellow-500 text-white px-4 py-2 rounded-lg">Ready for Pickup</button>;
      case 'READY_FOR_PICKUP':
        return <button onClick={() => updateStatus('OUT_FOR_DELIVERY')} className="bg-indigo-500 text-white px-4 py-2 rounded-lg">Out for Delivery</button>;
      case 'OUT_FOR_DELIVERY':
        return <button onClick={() => updateStatus('DELIVERED')} className="bg-purple-500 text-white px-4 py-2 rounded-lg">Mark as Delivered</button>;
      case 'DELIVERED':
      case 'REJECTED':
        return <p className="text-gray-500">No further actions allowed.</p>;
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!order) return <div className="p-8">No order found.</div>;

  return (
    <div className="p-8 space-y-8">
      {popupMessage && (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 ${popupType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {popupMessage}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-16">
        {renderNextActions()}
      </div>

      {/* Order Info */}
      <div className="text-3xl font-bold">
        Order ID: <span className="text-xl text-gray-600">{order.orderId}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">Customer Info</h2>
          <p className="mt-4 text-lg"><strong>Name:</strong> {order.customer?.name || 'N/A'}</p>
          <p className="text-lg"><strong>Address:</strong> {order.deliveryAddress}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">Order Info</h2>
          <p className="mt-4 text-lg"><strong>Status:</strong> {order.status === 'REJECTED' ? 'Rejected' : order.status}</p>
          <p className="text-lg"><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
          <p className="text-lg"><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">Payment Info</h2>
          <p className="mt-4 text-lg"><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
          <p className="text-lg"><strong>Tax:</strong> ₹{order.tax.toFixed(2)}</p>
          <p className="text-lg"><strong>Discount:</strong> ₹{order.discount.toFixed(2)}</p>
          <p className="text-lg"><strong>Payment Status:</strong> {order.paymentStatus}</p>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold">Order Items</h2>
        <ul className="mt-4 space-y-2">
          {order.orderItems.map(item => (
            <li key={item.orderItemId} className="flex justify-between">
              <span>{item.quantity} x {item.itemName}</span>
              <span>₹{item.totalPrice.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
