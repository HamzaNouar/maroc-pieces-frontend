import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import Layout from "../components/layout/Layout";
import { toast } from "react-toastify";
import { Lock } from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, isLoading, error } = useSelector(
    (state) => state.products
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number.parseInt(id)));
    }

    // Cleanup
    return () => {
      // Reset product when component unmounts
    };
  }, [dispatch, id]);

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value);
    if (value > 0 && value <= (selectedProduct?.stockQuantity || 1)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info("Veuillez vous connecter pour ajouter des produits au panier");
      return;
    }

    if (selectedProduct && selectedProduct.stockQuantity >= quantity) {
      dispatch(
        addToCart({
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          imageUrl: selectedProduct.imageUrl,
          quantity: quantity,
          stockQuantity: selectedProduct.stockQuantity,
        })
      );
      toast.success(`${selectedProduct.name} ajouté au panier`);
    } else {
      toast.error("Quantité non disponible en stock");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2">Chargement du produit...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
          <div className="mt-4">
            <Link to="/products" className="text-primary hover:underline">
              &larr; Retour aux produits
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!selectedProduct) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p>Produit non trouvé.</p>
          <div className="mt-4">
            <Link to="/products" className="text-primary hover:underline">
              &larr; Retour aux produits
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link to="/products" className="text-primary hover:underline">
            &larr; Retour aux produits
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="h-64 md:h-full bg-gray-200 flex items-center justify-center">
                {selectedProduct.imageUrl ? (
                  <img
                    src={`${
                      import.meta.env.VITE_BACKEND_IMG ||
                      "https://localhost:7263"
                    }${selectedProduct.imageUrl}`}
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="text-6xl text-gray-500">
                    {selectedProduct.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 p-6">
              <div className="mb-2">
                <span className="inline-block bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded">
                  {selectedProduct.categoryName}
                </span>
              </div>

              <h1 className="text-2xl font-bold mb-2">
                {selectedProduct.name}
              </h1>

              {isAuthenticated ? (
                <div className="text-2xl font-bold text-primary mb-4">
                  {selectedProduct.price.toFixed(2)} DH
                </div>
              ) : (
                <div className="mb-4">
                  <Link
                    to="/login"
                    className="flex items-center justify-center bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    <span>Connectez-vous pour voir le prix</span>
                  </Link>
                </div>
              )}

              <div className="mb-4">
                <span
                  className={`inline-block px-2 py-1 rounded text-sm ${
                    selectedProduct.stockQuantity > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedProduct.stockQuantity > 0
                    ? `En stock (${selectedProduct.stockQuantity} disponibles)`
                    : "Rupture de stock"}
                </span>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700">
                  {selectedProduct.description ||
                    "Aucune description disponible."}
                </p>
              </div>

              {selectedProduct.stockQuantity > 0 && (
                <div className="mb-6">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Quantité
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="bg-gray-200 px-3 py-1 rounded-l"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={selectedProduct.stockQuantity}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 text-center border-t border-b border-gray-300 py-1"
                    />
                    <button
                      onClick={() =>
                        quantity < selectedProduct.stockQuantity &&
                        setQuantity(quantity + 1)
                      }
                      className="bg-gray-200 px-3 py-1 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={selectedProduct.stockQuantity <= 0}
                className={`w-full py-3 rounded-lg font-medium ${
                  selectedProduct.stockQuantity > 0
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {!isAuthenticated
                  ? "Connectez-vous pour commander"
                  : selectedProduct.stockQuantity > 0
                  ? "Ajouter au panier"
                  : "Indisponible"}
              </button>

              {/* Additional Product Info */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">SKU:</span>
                  <span>{selectedProduct.sku || "N/A"}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Disponibilité:</span>
                  <span>
                    {selectedProduct.isAvailable
                      ? "Disponible"
                      : "Non disponible"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
