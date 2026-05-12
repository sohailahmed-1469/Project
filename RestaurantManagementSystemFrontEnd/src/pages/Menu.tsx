// src/components/Menu.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { menuAPI } from "../services/api";
import { useAuthStore } from "../store/authStore";

const Menu = () => {
  useAuthStore((state) => state);
  const [categories, setCategories] = useState<{ id: string; name: string; categoryImage?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    menuAPI
      .getCategories()
      .then((response) => {
        const data = Array.isArray(response) ? response : response.categories || [];
        setCategories(data);
      })
      .catch(() => setError("Failed to load categories."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 pt-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Menu</h1>
      {loading && <p className="text-gray-500">Loading categories...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/menu/category/${category.id}`}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition flex flex-col items-center"
            >
              {category.categoryImage ? (
                <img
                  src={category.categoryImage}
                  alt={category.name}
                  className="w-32 h-32 object-cover rounded-lg mb-2"
                  onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                />
              ) : (
                <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{category.name}</h2>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Menu;