import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  { id: '1', name: 'Emma Thompson', rating: 5, comment: 'Amazing food and service!', date: '2024-03-15' },
  { id: '2', name: 'David Chen', rating: 4, comment: 'Great atmosphere, slightly slow service', date: '2024-03-14' },
  { id: '3', name: 'Sarah Miller', rating: 5, comment: 'Best Italian food in the city!', date: '2024-03-13' },
];

export const Reviews = () => {
  return (
    <div className="p-6 pt-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Customer Reviews</h1>
      
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {review.name}
              </h3>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {review.date}
              </span>
            </div>
            
            <div className="flex items-center mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};