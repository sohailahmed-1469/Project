import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { menuAPI } from "../services/api";

export const MenuCategory = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const [category, setCategory] = useState<{ id: string; name: string; items: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!categoryId) {
      setError("Invalid category ID.");
      setLoading(false);
      return;
    }

    console.log("Fetching category with ID:", categoryId); // Debugging

    setLoading(true);
    menuAPI
      .getCategoryItems(categoryId)
      .then((response) => {
        console.log("Category Data:", response); // Debugging
        setCategory(response);
      })
      .catch((err) => {
        console.error("Error fetching category:", err);
        setError("Failed to load category items.");
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <div className="p-6 pt-20">
      {loading && <p className="text-gray-500 dark:text-gray-400">Loading category...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && category && (
        <>
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">{category.name}</h1>
          {category.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item) => (
                <Link
                  key={item.id}
                  to={`/menu/item/${item.id}`}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition"
                >
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{item.name}</h2>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No items available.</p>
          )}
        </>
      )}
    </div>
  );
};
