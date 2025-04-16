import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../store/slices/productSlice";
import { fetchCategories } from "../store/slices/categorySlice";
import Layout from "../components/layout/Layout";
import { Lock } from "lucide-react";

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, pageSize: 5 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Get first 4 products as featured
  const featuredProducts = products.slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            MAROC PIECES TETOUAN
          </h1>
          <p className="text-xl mb-8">
            Votre fournisseur de pièces auto de confiance à Tétouan
          </p>
          <Link to="/products" className="btn btn-primary text-lg px-8 py-3">
            Voir nos produits
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Catégories</h2>

          {isLoading ? (
            <div className="text-center">Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories?.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?categoryId=${category.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-40 bg-gray-300 flex items-center justify-center">
                    {category.imageUrl ? (
                      <img
                        src={`${
                          import.meta.env.VITE_BACKEND_IMG ||
                          "https://localhost:7263"
                        }${category.imageUrl}`}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-4xl text-gray-500">
                        {category.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                    <p className="text-gray-600 mt-2">{category.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Produits Populaires
          </h2>

          {isLoading ? (
            <div className="text-center">Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img
                        src={`${
                          import.meta.env.VITE_BACKEND_IMG ||
                          "https://localhost:7263"
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
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      {product.categoryName}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      {isAuthenticated ? (
                        <span className="text-primary font-bold">
                          {product.price.toFixed(2)} DH
                        </span>
                      ) : (
                        <div className="flex items-center text-sm text-gray-600">
                          <Lock className="h-3 w-3 mr-1" />
                          <span>Connectez-vous pour voir le prix</span>
                        </div>
                      )}
                      <span
                        className={`text-xs ${
                          product.stockQuantity > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.stockQuantity > 0
                          ? "En stock"
                          : "Rupture de stock"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/products" className="btn btn-primary">
              Voir tous les produits
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Pourquoi Nous Choisir
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary text-4xl mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualité Garantie</h3>
              <p className="text-gray-600">
                Nous proposons uniquement des pièces de qualité supérieure avec
                garantie.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary text-4xl mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Service Rapide</h3>
              <p className="text-gray-600">
                Livraison rapide et service client réactif pour répondre à vos
                besoins.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary text-4xl mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Prix Compétitifs</h3>
              <p className="text-gray-600">
                Nous offrons les meilleurs prix du marché sans compromettre la
                qualité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Besoin d'aide pour trouver la bonne pièce?
          </h2>
          <p className="text-xl mb-8">
            Contactez-nous dès aujourd'hui et notre équipe d'experts vous
            aidera.
          </p>
          <div className="flex justify-center items-center">
            <div className="bg-secondary p-2 rounded-full mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <a
              href="https://wa.me/062840xxxx"
              className="text-white text-xl hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              062840xxxx
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
