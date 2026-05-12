import React, { useEffect, useState } from "react";
import { menuAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AddMenuItem = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    categoryName: "",
    ingredients: "",
    description: "",
  });

  useEffect(() => {
    menuAPI
      .getCategories()
      .then((res) => setCategories(Array.isArray(res) ? res : res.categories))
      .catch(() => {/* handle error if needed */});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(form.price);
    if (isNaN(price)) return alert("Enter a valid price.");
    try {
      await menuAPI.addMenuItem({
        name: form.name,
        price,
        image: form.image,
        categoryName: form.categoryName,
        ingredients: form.ingredients,
        description: form.description,
      });
      alert("Menu item added!");
      navigate("/menu");
    } catch {
      alert("Failed to add menu item.");
    }
  };

  return (
    <div className="mt-14 min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Add Menu Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Name */}
          <div>
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-1">
              Item Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter item name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-gray-700 dark:text-gray-300 mb-1">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="categoryName" className="block text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="categoryName"
              value={form.categoryName}
              onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-gray-700 dark:text-gray-300 mb-1">
              Image URL
            </label>
            <input
              id="image"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label htmlFor="ingredients" className="block text-gray-700 dark:text-gray-300 mb-1">
              Ingredients
            </label>
            <textarea
              id="ingredients"
              rows={2}
              placeholder="Comma-separated list"
              value={form.ingredients}
              onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
              className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Short description..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition"
          >
            Save Menu Item
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddMenuItem;
