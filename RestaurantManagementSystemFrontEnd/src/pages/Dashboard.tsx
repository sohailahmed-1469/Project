import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, Star } from 'lucide-react';

const stats = [
  { icon: TrendingUp, label: 'Revenue', value: '$12,345', change: '+15%' },
  { icon: Users, label: 'Customers', value: '1,234', change: '+8%' },
  { icon: ShoppingBag, label: 'Orders', value: '456', change: '+12%' },
  { icon: Star, label: 'Rating', value: '4.8', change: '+0.2' },
];

export const Dashboard = () => {
  return (
    <div className="p-6 w-full relative">

      {/* Header */}
      <div className="flex items-center mb-8 mt-14">
        <img 
          src="https://img.freepik.com/premium-vector/restaurant-logo-design-concept_661182-426.jpg" 
          alt="Logo" 
          className="w-16 h-16 mr-4"
        />
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-start justify-between"
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-full">
                <stat.icon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-500 text-sm font-medium">
                {stat.change}
              </span>
              <span className="text-gray-600 text-sm ml-2">vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};