// src/components/products/ProductCard.jsx
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { toast } from "react-toastify";
import { Lock, ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation to product detail
    e.stopPropagation(); // Stop event propagation

    if (!isAuthenticated) {
      toast.info("Veuillez vous connecter pour ajouter des produits au panier");
      navigate("/login");
      return;
    }

    if (product.stockQuantity > 0) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
          stockQuantity: product.stockQuantity,
        })
      );
      toast.success(`${product.name} ajouté au panier`);
    } else {
      toast.error("Ce produit est en rupture de stock");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.id}`} className="block">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={`${
                import.meta.env.VITE_BACKEND_IMG || "https://localhost:7263"
              }${product.imageUrl}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-4xl text-gray-500">
              {product.name.charAt(0)}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="text-lg font-semibold hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 mt-1 text-sm">{product.categoryName}</p>
        </Link>

        <div className="mt-2 flex justify-between items-center">
          {isAuthenticated ? (
            <span className="text-primary font-bold">
              {product.price.toFixed(2)} DH
            </span>
          ) : (
            <Link
              to="/login"
              className="flex items-center text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <Lock className="h-3 w-3 mr-1" />
              <span>Voir le prix</span>
            </Link>
          )}
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              product.stockQuantity > 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.stockQuantity > 0 ? "En stock" : "Rupture"}
          </span>
        </div>

        {product.stockQuantity > 0 && (
          <button
            onClick={handleAddToCart}
            className={`mt-3 w-full py-2 px-4 rounded text-white font-medium flex items-center justify-center ${
              product.stockQuantity > 0
                ? "bg-primary hover:bg-primary-dark"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={product.stockQuantity <= 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isAuthenticated
              ? "Ajouter au panier"
              : "Connectez-vous pour commander"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
