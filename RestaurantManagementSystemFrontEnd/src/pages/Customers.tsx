import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, Package } from 'lucide-react';
import { customersAPI } from '../services/api';
import { useStore } from '../store/useStore';

const Customers: React.FC = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const { data: customers, isLoading } = useQuery(['customers'], customersAPI.getAll);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Customers
      </h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {customers?.map((customer) => (
          <div
            key={customer.id}
            className={`rounded-lg p-6 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-2xl">{customer.name[0]}</span>
              </div>
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {customer.name}
                </h3>
                <p className="text-gray-500">{customer.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Joined</span>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {new Date(customer.joinedDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Orders</span>
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-indigo-500" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {customer.totalOrders}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Rating</span>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {customer.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className={`font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Favorite Items
              </h4>
              <div className="space-y-2">
                {customer.favoriteItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                          {item.name}
                        </p>
                        <p className="text-gray-500">${item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customers;