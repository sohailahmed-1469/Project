import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { menuAPI, cartAPI } from "../services/api";
import { Star } from "lucide-react";

export const MenuItemDetails = () => {
  const { itemId } = useParams() as { itemId: string };
  const [item, setItem] = useState<{
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category?: string;
    categoryName?: string;
    rating?: number;
    ingredients?: string[] | string;
    available?: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    setLoading(true);
    menuAPI
      .getMenuItemDetails(itemId)
      .then((data) => {
        if (typeof data.ingredients === "string") {
          data.ingredients = data.ingredients.split(",").map((s: string) => s.trim());
        }
        setItem(data);
      })
      .catch((err) => {
        console.error("Error loading item:", err.message);
        setError("Failed to load item details.");
      })
      .finally(() => setLoading(false));
  }, [itemId]);

  const addToCart = async () => {
    if (!item) return;
    try {
      await cartAPI.addItemToCart(item.id, quantity);
      alert("Item added to cart successfully!");
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add item to cart.");
    }
  };

  return (
    <div className="p-8 pt-20 max-w-5xl mx-auto">
      <Link to="/menu" className="text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block">
        ← Back to Menu
      </Link>

      {loading && <p className="text-gray-500 dark:text-gray-400 text-center">Loading item details...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && item && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-1/3">
            <img
              src={item.image || "https://via.placeholder.com/250"}
              alt={item.name}
              className="w-full h-56 object-cover rounded-lg shadow-md"
            />
            {item.available !== undefined && (
              <span className={`block text-center mt-3 px-4 py-2 text-sm font-semibold rounded-lg ${item.available ? "bg-green-600 text-white" : "bg-red-600 text-white"
                }`}>
                {item.available ? "Available" : "Out of Stock"}
              </span>
            )}
          </div>

          <div className="w-2/3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{item.name}</h1>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Category :</span>
                <span className="text-gray-600 dark:text-gray-400">{item.categoryName || "N/A"}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Price :</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">${item.price.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Rating :</span>
                <span className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} size={18} className={index < (item.rating || 0) ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                </span>
              </div>

              <div className="border-b pb-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Description :</span>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>

              {item.ingredients && (
                <div className="border-b pb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Ingredients :</span>
                  <p className="text-gray-600 dark:text-gray-300">
                    {Array.isArray(item.ingredients) ? item.ingredients.join(", ") : "N/A"}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <div className="px-4 py-2 bg-white dark:bg-gray-800 text-center min-w-[40px]">{quantity}</div>
                <button
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>

              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-lg font-semibold transition"
                onClick={addToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};