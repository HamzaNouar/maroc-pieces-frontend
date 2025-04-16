// src/pages/ContactPage.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import Layout from "../components/layout/Layout";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would normally send the data to your API
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Votre message a été envoyé avec succès!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Contactez-nous</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Téléphone</h3>
            <p className="text-gray-600 mb-4">
              Nous sommes disponibles du lundi au samedi de 9h à 18h
            </p>
            <a
              href="tel:+21262840xxxx"
              className="text-primary font-medium hover:underline"
            >
              +212 628 40x xxx
            </a>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="text-gray-600 mb-4">
              Notre équipe vous répondra dans les plus brefs délais
            </p>
            <a
              href="mailto:contact@marocpieces.com"
              className="text-primary font-medium hover:underline"
            >
              contact@marocpieces.com
            </a>
          </div>

          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Adresse</h3>
            <p className="text-gray-600 mb-4">
              Venez nous rendre visite à notre magasin
            </p>
            <address className="not-italic text-primary font-medium">
              123 Rue Mohammed V<br />
              Tetouan, 93000
              <br />
              Maroc
            </address>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Envoyez-nous un message
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Envoi en cours...</span>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden h-[400px] lg:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51874.91389289542!2d-5.4026383!3d35.5889274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0b425aa2dfd0dd%3A0x5f77239fb0c3342b!2sTetouan%2C%20Morocco!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Maroc Pieces Tetouan Location"
            ></iframe>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">Foire aux questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">
                Quels sont vos horaires d'ouverture?
              </h3>
              <p className="text-gray-600">
                Nous sommes ouverts du lundi au vendredi de 9h à 18h et le
                samedi de 9h à 13h. Nous sommes fermés le dimanche.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                Proposez-vous la livraison?
              </h3>
              <p className="text-gray-600">
                Oui, nous proposons la livraison dans tout le Maroc. Les frais
                de livraison varient en fonction de la destination et du poids
                de la commande.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                Comment puis-je suivre ma commande?
              </h3>
              <p className="text-gray-600">
                Vous pouvez suivre votre commande en vous connectant à votre
                compte et en accédant à la section "Mes commandes".
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                Quelle est votre politique de retour?
              </h3>
              <p className="text-gray-600">
                Nous acceptons les retours dans les 14 jours suivant la
                réception de votre commande, à condition que les produits soient
                dans leur état d'origine et non utilisés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
