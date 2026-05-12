// src/components/AddCategory.tsx
import React, { useState } from "react";
import { menuAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AddCategory = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", categoryImage: "", description: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await menuAPI.addCategory(form);
      alert("Category added!");
      navigate("/menu");
    } catch {
      alert("Failed to add category.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Add New Category
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Name */}
          <div>
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-1">
              Category Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter category name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="categoryImage" className="block text-gray-700 dark:text-gray-300 mb-1">
              Image URL
            </label>
            <input
              id="categoryImage"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={form.categoryImage}
              onChange={(e) => setForm({ ...form, categoryImage: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Short description..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition"
          >
            Save Category
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddCategory;
