import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { OrderCard } from '../components/OrderCard';
import { Order } from '../types/order';
import { Loader2, PackageOpen, SlidersHorizontal } from 'lucide-react';

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const statusTabs = [
    'All',
    'Placed',
    'Confirmed',
    'Ready-For-Pickup',
    'Out-For-Delivery',
    'Delivered',
    'Cancelled',
  ];

  const queryStatus = searchParams.get('status') || 'All';
  const activeStatus = statusTabs.find(
    (s) => s.toLowerCase() === queryStatus.toLowerCase()
  ) || 'All';

  const [activeTab, setActiveTab] = useState(activeStatus);

  const [filters, setFilters] = useState({
    orderId: '',
    customerName: '',
    fromDate: '',
    toDate: '',
    status: '',
    productName: '',
  });

  const fetchOrders = async (status: string, applyFilters = false) => {
    try {
      setLoading(true);
      setError(null);

      const finalStatus = filters.status || (status !== 'All' ? status : '');
      const response = applyFilters
        ? await ordersAPI.filterOrders({ ...filters, status: finalStatus })
        : status === 'All'
        ? await ordersAPI.getAll()
        : await ordersAPI.getByStatus(status);

      setOrders(response);
    } catch {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setActiveTab(activeStatus);
    fetchOrders(activeStatus);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStatus]);

  useEffect(() => {
    const closeOnClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', closeOnClickOutside);
    return () => document.removeEventListener('mousedown', closeOnClickOutside);
  }, []);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const handleTabClick = (status: string) => setSearchParams({ status });

  const handleFilterChange = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(activeTab, true);
    setFilterPanelOpen(false);
  };

  return (
    <div className="px-6 py-10 max-w-screen-2xl mx-auto relative">
      {/* Header and Search */}
      <div className="mt-12 flex justify-between items-center mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <h2 className="text-4xl font-bold text-gray-900">🧾 Orders</h2>
          <input
            type="text"
            placeholder="Search by Order ID"
            className="border rounded px-4 py-2 w-72 shadow-sm"
            value={filters.orderId}
            onChange={(e) => handleFilterChange('orderId', e.target.value)}
          />
        </div>
        <button
          onClick={() => setFilterPanelOpen((prev) => !prev)}
          className="text-gray-600 hover:text-blue-600 p-2"
          title="Toggle Filters"
        >
          <SlidersHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200 mb-6 overflow-x-auto">
        {statusTabs.map((status) => (
          <button
            key={status}
            onClick={() => handleTabClick(status)}
            className={`relative pb-2 font-medium text-base transition-colors ${
              activeTab === status
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            {capitalize(status)}
            {activeTab === status && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Order List & Filters */}
      <div className="flex relative">
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 font-semibold">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500 py-20 flex flex-col items-center gap-2">
              <PackageOpen className="w-16 h-16 text-gray-400" />
              <p className="text-lg font-medium">
                {filters.orderId
                  ? `Order with ID "${filters.orderId}" not found.`
                  : 'No orders found.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {orders.map((order) => (
                <OrderCard key={order.orderId} order={order} />
              ))}
            </div>
          )}
        </div>

        {/* Filter Panel */}
        {filterPanelOpen && (
          <div
            ref={filterRef}
            className="absolute right-0 top-0 bg-white shadow-lg border rounded-lg p-6 w-80 z-50"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Search Filters</h3>
            <form onSubmit={handleFilterSubmit} className="flex flex-col gap-4">
              {[
                { label: 'Order ID', key: 'orderId', type: 'text' },
                { label: 'Customer Name', key: 'customerName', type: 'text' },
                { label: 'From Date', key: 'fromDate', type: 'date' },
                { label: 'To Date', key: 'toDate', type: 'date' },
                { label: 'Product Name', key: 'productName', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="text-sm text-gray-600 mb-1">{label}</label>
                  <input
                    type={type}
                    className="border rounded p-2 w-full"
                    value={(filters as any)[key]}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                  />
                </div>
              ))}

              <div>
                <label className="text-sm text-gray-600 mb-1">Status</label>
                <select
                  className="border rounded p-2 w-full"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">Select Status</option>
                  {statusTabs
                    .filter((s) => s !== 'All')
                    .map((status) => (
                      <option key={status} value={status}>
                        {capitalize(status)}
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
