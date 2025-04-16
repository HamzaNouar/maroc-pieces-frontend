import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, updateUserInAuth } from "../../store/slices/authSlice";

const Header = () => {
  const { user, isAuthenticated, isAdmin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-primary text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            MAROC PIECES TETOUAN
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:text-gray-300">
              Accueil
            </Link>
            <Link to="/products" className="hover:text-gray-300">
              Produits
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/cart" className="hover:text-gray-300">
                  Panier
                </Link>
                <div className="relative group">
                  <button className="hover:text-gray-300">
                    {user?.firstName || user?.username}
                  </button>
                  <div className="absolute right-0 z-10 w-48 bg-white text-primary rounded overflow-hidden shadow-lg hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Mon Profil
                    </Link>
                    <Link
                      to="/profile/orders"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Mes Commandes
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Administration
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login" className="hover:text-gray-300">
                Connexion
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2">
            <Link to="/" className="block hover:text-gray-300">
              Accueil
            </Link>
            <Link to="/products" className="block hover:text-gray-300">
              Produits
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/cart" className="block hover:text-gray-300">
                  Panier
                </Link>
                <Link to="/profile" className="block hover:text-gray-300">
                  Mon Profil
                </Link>
                <Link to="/orders" className="block hover:text-gray-300">
                  Mes Commandes
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="block hover:text-gray-300">
                    Administration
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left hover:text-gray-300"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link to="/login" className="block hover:text-gray-300">
                Connexion
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
