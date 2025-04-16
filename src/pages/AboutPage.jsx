// src/pages/AboutPage.jsx
import React from "react";
import {
  Shield,
  Truck,
  Clock,
  Users,
  Award,
  PenToolIcon as Tool,
} from "lucide-react";
import Layout from "../components/layout/Layout";

const AboutPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <section className="mb-16">
          <h1 className="text-3xl font-bold mb-8 text-center">
            À propos de Maroc Pieces Tetouan
          </h1>

          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8">
                <h2 className="text-2xl font-semibold mb-4">Notre histoire</h2>
                <p className="text-gray-600 mb-4">
                  Fondée en 2005, Maroc Pieces Tetouan est devenue l'une des
                  principales entreprises de pièces automobiles à Tetouan et
                  dans la région du nord du Maroc. Notre voyage a commencé avec
                  un petit magasin et une vision claire : fournir des pièces
                  automobiles de qualité à des prix abordables.
                </p>
                <p className="text-gray-600 mb-4">
                  Au fil des années, nous avons élargi notre gamme de produits
                  et amélioré nos services pour répondre aux besoins changeants
                  de nos clients. Aujourd'hui, nous sommes fiers de proposer une
                  vaste sélection de pièces automobiles pour presque toutes les
                  marques et tous les modèles de véhicules.
                </p>
                <p className="text-gray-600">
                  Notre engagement envers l'excellence et la satisfaction client
                  nous a permis de nous développer et de devenir un nom de
                  confiance dans l'industrie des pièces automobiles au Maroc.
                </p>
              </div>
              <div className="bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?height=400&width=600"
                  alt="Maroc Pieces Tetouan Store"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Notre mission</h3>
              </div>
              <p className="text-gray-600">
                Fournir des pièces automobiles de haute qualité à des prix
                compétitifs, tout en offrant un service client exceptionnel pour
                garantir la satisfaction totale de nos clients.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Notre vision</h3>
              </div>
              <p className="text-gray-600">
                Devenir le premier choix des automobilistes marocains pour
                l'achat de pièces automobiles, en étant reconnus pour notre
                qualité, notre fiabilité et notre service client exceptionnel.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Nos valeurs</h3>
              </div>
              <p className="text-gray-600">
                Intégrité, qualité, service client, innovation et respect. Ces
                valeurs fondamentales guident toutes nos actions et décisions
                commerciales au quotidien.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Pourquoi nous choisir?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Tool className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Pièces de qualité
                </h3>
                <p className="text-gray-600">
                  Nous proposons uniquement des pièces de qualité, qu'elles
                  soient d'origine ou de rechange, pour garantir la performance
                  et la durabilité de votre véhicule.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Livraison rapide</h3>
                <p className="text-gray-600">
                  Nous offrons une livraison rapide dans tout le Maroc, avec un
                  suivi en temps réel pour que vous puissiez savoir exactement
                  quand vos pièces arriveront.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Service client 24/7
                </h3>
                <p className="text-gray-600">
                  Notre équipe de service client est disponible 24/7 pour
                  répondre à vos questions et vous aider à trouver les pièces
                  dont vous avez besoin.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutPage;
