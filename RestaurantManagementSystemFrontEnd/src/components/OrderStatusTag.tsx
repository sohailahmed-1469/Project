// OrderStatusTag.tsx
import React from 'react';

type Props = {
  status: string;
};

export const OrderStatusTag: React.FC<Props> = ({ status }) => {
  const statusColorMap: Record<string, string> = {
    Placed: 'bg-yellow-100 text-yellow-800',
    Confirmed: 'bg-blue-100 text-blue-800',
    'Ready-For-Pickup': 'bg-indigo-100 text-indigo-800',
    'Out-For-Delivery': 'bg-orange-100 text-orange-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
    Default: 'bg-gray-100 text-gray-800',
  };

  const colorClass = statusColorMap[status] || statusColorMap.Default;

  return (
    <span className={`text-sm px-3 py-1 rounded-full font-semibold ${colorClass}`}>
      {status}
    </span>
  );
};
