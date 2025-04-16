import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/login-form";
import WhatsAppContact from "../components/whatsapp-contact";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
      <h1 className="text-center text-white text-3xl md:text-4xl font-bold mb-8">
        MAROC PIECES TETOUAN
      </h1>

      {/* WhatsApp Contact */}
      <WhatsAppContact phoneNumber="0628408111" />

      {/* Login Form */}
      <div className="w-full max-w-md mt-8">
        <LoginForm />

        <div className="mt-4 text-center">
          <Link to="/register" className="text-white hover:underline">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
