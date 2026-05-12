import { useEffect, useState } from 'react';
import { ordersAPI } from '../services/api';
import { OrderCard } from '../components/OrderCard';
import { Order } from '../types/order';

export const CancelledOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getByStatus('CANCELLED');
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch cancelled orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Cancelled Orders</h2>
      {orders.map(order => <OrderCard key={order.orderId} order={order} />)}
    </div>
  );
};
