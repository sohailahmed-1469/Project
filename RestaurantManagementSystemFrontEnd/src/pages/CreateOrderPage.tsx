import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateOrderRequestDto, OrderItemRequestDto } from '../types/auth';
import { ordersAPI, menuAPI } from '../services/api';

export const CreateOrderPage = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<OrderItemRequestDto[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [discount, setDiscount] = useState('0');
  const [tax, setTax] = useState('0');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hoveredItem, setHoveredItem] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    menuAPI
      .getAllMenuItems()
      .then(setMenuItems)
      .catch(() => setError('Failed to fetch menu items'));
  }, []);

  const handleQuantityChange = (menuItemId: number, quantity: number, price: number) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.menuItemId === menuItemId);
      if (existing) {
        if (quantity === 0) {
          return prev.filter((item) => item.menuItemId !== menuItemId);
        }
        return prev.map((item) =>
          item.menuItemId === menuItemId ? { ...item, quantity, price } : item
        );
      } else {
        return [...prev, { menuItemId, quantity, price }];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryAddress || !deliveryDate || selectedItems.length === 0) {
      setError('Please fill all fields and select at least one item.');
      return;
    }

    const orderData: CreateOrderRequestDto = {
      orderDate: new Date().toISOString(),
      deliveryAddress,
      deliveryDate,
      discount,
      tax,
      orderItems: selectedItems,
    };

    try {
      await ordersAPI.createOrder(orderData);
      setSuccess('Order created successfully!');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setError('Failed to create order');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 relative">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 mt-16 text-center">🧾 Create New Order</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-white p-6 rounded-2xl shadow-lg">
          {/* Delivery Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🏠 Delivery Address</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📅 Delivery Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">🔻 Discount (%)</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">📈 Tax (%)</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-xl px-4 py-2"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
              />
            </div>
          </div>

          {/* Menu Items */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">🍽️ Select Items</h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto border rounded-xl p-4 bg-gray-50 relative">
              {menuItems.map((item) => {
                const selected = selectedItems.find((i) => i.menuItemId === item.id)?.quantity || 0;
                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center px-4 py-2 rounded-xl hover:bg-white transition relative"
                    onMouseEnter={() => setHoveredItem(item)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div>
                      <p className="font-medium text-gray-700">{item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
                    </div>
                    <input
                      type="number"
                      min={0}
                      className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-right"
                      value={selected}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value) || 0, item.price)
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
             Place Order
          </button>
        </form>

        {/* Right: Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-20">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">🧮 Order Summary</h3>
          {selectedItems.length === 0 ? (
            <p className="text-gray-500">No items selected</p>
          ) : (
            <ul className="space-y-3 mb-4">
              {selectedItems.map((item) => {
                const menuItem = menuItems.find((m) => m.id === item.menuItemId);
                return (
                  <li key={item.menuItemId} className="flex justify-between text-sm">
                    <span>{menuItem?.name} × {item.quantity}</span>
                    <span>₹{(item.quantity * item.price).toFixed(2)}</span>
                  </li>
                );
              })}
            </ul>
          )}
          <hr className="my-3" />
          <p className="flex justify-between text-sm font-medium">
            <span>Discount</span>
            <span>{discount}%</span>
          </p>
          <p className="flex justify-between text-sm font-medium">
            <span>Tax</span>
            <span>{tax}%</span>
          </p>
        </div>
      </div>

      {/* Hover Preview Card (Floating Right Side) */}
      {hoveredItem && (
        <div className="absolute right-[70px] top-[55%] w-72 bg-white shadow-xl border rounded-2xl p-4 z-50 animate-fade-in">
          <img
            src={hoveredItem.image}
            alt={hoveredItem.name}
            className="w-full h-40 object-cover rounded-md mb-3"
          />
          <h4 className="text-lg font-bold text-gray-800">{hoveredItem.name}</h4>
          <p className="text-sm text-gray-600 mt-1">{hoveredItem.description}</p>
          <p className="text-md font-semibold text-gray-700 mt-3">₹{hoveredItem.price.toFixed(2)}</p>
        </div>
      )}

    </div>
  );
};
