import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MAROC PIECES TETOUAN</h3>
            <p className="mb-4">
              Votre fournisseur de pièces auto de confiance à Tétouan.
            </p>
            <div className="flex items-center">
              <div className="bg-secondary p-2 rounded-full mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <a
                href="https://wa.me/062840xxxx"
                className="text-white hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                062840xxxx
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:underline">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  Produits
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline">
                  À Propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Horaires d'Ouverture</h3>
            <ul className="space-y-2">
              <li>Lundi - Vendredi: 8h30 - 18h30</li>
              <li>Samedi: 9h00 - 17h00</li>
              <li>Dimanche: Fermé</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>
            &copy; {new Date().getFullYear()} MAROC PIECES TETOUAN. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
