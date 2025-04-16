import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Save,
  Globe,
  Building,
  Truck,
  CreditCard,
  Mail,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  fetchSettings,
  updateSettings,
} from "../../store/slices/settingsSlice";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { settings, isLoading, error } = useSelector((state) => state.settings);

  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    // General settings
    siteName: "",
    siteDescription: "",
    logoUrl: "",
    faviconUrl: "",
    primaryColor: "#1a2642",

    // Company information
    companyName: "",
    companyAddress: "",
    companyCity: "",
    companyPostalCode: "",
    companyCountry: "",
    companyPhone: "",
    companyEmail: "",
    companyVAT: "",

    // Shipping settings
    enableShipping: true,
    shippingFlatRate: 0,
    freeShippingThreshold: 0,

    // Payment settings
    enableCashOnDelivery: true,
    enableBankTransfer: true,
    bankAccountName: "",
    bankAccountNumber: "",
    bankName: "",

    // Email settings
    emailSender: "",
    emailReplyTo: "",
    emailHost: "",
    emailPort: "",
    emailUsername: "",
    emailPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  // Load settings on component mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Update form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        ...formData,
        ...settings,
      });
    }
  }, [settings]);

  // Display error if any
  useEffect(() => {
    if (error) {
      if (typeof error === "object" && error !== null) {
        // Handle validation errors
        setValidationErrors(error);
      } else {
        toast.error(error);
      }
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: undefined,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationErrors({});

    dispatch(updateSettings(formData))
      .unwrap()
      .then(() => {
        toast.success("Paramètres mis à jour avec succès");
      })
      .catch((err) => {
        if (typeof err === "object" && err !== null) {
          setValidationErrors(err);
          toast.error("Veuillez corriger les erreurs dans le formulaire");
        } else {
          toast.error(`Erreur: ${err}`);
        }
      });
  };

  const tabs = [
    { id: "general", label: "Général", icon: Globe },
    { id: "company", label: "Entreprise", icon: Building },
    { id: "shipping", label: "Livraison", icon: Truck },
    { id: "payment", label: "Paiement", icon: CreditCard },
    { id: "email", label: "Email", icon: Mail },
  ];

  // Helper function to render form field with validation
  const renderField = ({
    name,
    label,
    type = "text",
    placeholder = "",
    min,
    max,
    step,
  }) => {
    const error = validationErrors[name];

    return (
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <div>
          <input
            type={type}
            id={name}
            name={name}
            value={formData[name] ?? ""}
            onChange={handleChange}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            className={`w-full px-3 py-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-2">Chargement des paramètres...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            {/* Tabs */}
            <div className="border-b">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-medium">Paramètres généraux</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderField({ name: "siteName", label: "Nom du site" })}
                    {renderField({
                      name: "siteDescription",
                      label: "Description du site",
                    })}
                    {renderField({ name: "logoUrl", label: "URL du logo" })}
                    {renderField({
                      name: "faviconUrl",
                      label: "URL du favicon",
                    })}

                    <div>
                      <label
                        htmlFor="primaryColor"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Couleur principale
                      </label>
                      <div className="flex items-center">
                        <input
                          type="color"
                          id="primaryColor"
                          name="primaryColor"
                          value={formData.primaryColor}
                          onChange={handleChange}
                          className="h-10 w-10 border border-gray-300 rounded-md mr-2"
                        />
                        <input
                          type="text"
                          value={formData.primaryColor}
                          onChange={handleChange}
                          name="primaryColor"
                          className={`w-full px-3 py-2 border ${
                            validationErrors.primaryColor
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                      </div>
                      {validationErrors.primaryColor && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {validationErrors.primaryColor}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Company Information */}
              {activeTab === "company" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-medium">
                    Informations de l'entreprise
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderField({
                      name: "companyName",
                      label: "Nom de l'entreprise",
                    })}
                    {renderField({ name: "companyAddress", label: "Adresse" })}
                    {renderField({ name: "companyCity", label: "Ville" })}
                    {renderField({
                      name: "companyPostalCode",
                      label: "Code postal",
                    })}
                    {renderField({ name: "companyCountry", label: "Pays" })}
                    {renderField({ name: "companyPhone", label: "Téléphone" })}
                    {renderField({
                      name: "companyEmail",
                      label: "Email",
                      type: "email",
                    })}
                    {renderField({
                      name: "companyVAT",
                      label: "Numéro de TVA",
                    })}
                  </div>
                </div>
              )}

              {/* Shipping Settings */}
              {activeTab === "shipping" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-medium">
                    Paramètres de livraison
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableShipping"
                        name="enableShipping"
                        checked={formData.enableShipping}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="enableShipping"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Activer la livraison
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {renderField({
                        name: "shippingFlatRate",
                        label: "Frais de livraison (MAD)",
                        type: "number",
                        min: "0",
                        step: "0.01",
                      })}

                      {renderField({
                        name: "freeShippingThreshold",
                        label: "Seuil pour livraison gratuite (MAD)",
                        type: "number",
                        min: "0",
                        step: "0.01",
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === "payment" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-medium">
                    Paramètres de paiement
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableCashOnDelivery"
                        name="enableCashOnDelivery"
                        checked={formData.enableCashOnDelivery}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="enableCashOnDelivery"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Activer le paiement à la livraison
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="enableBankTransfer"
                        name="enableBankTransfer"
                        checked={formData.enableBankTransfer}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="enableBankTransfer"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Activer le virement bancaire
                      </label>
                    </div>

                    {formData.enableBankTransfer && (
                      <div className="mt-4 pl-6 border-l-2 border-gray-200">
                        <h3 className="text-sm font-medium mb-3">
                          Détails du compte bancaire
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderField({
                            name: "bankName",
                            label: "Nom de la banque",
                          })}
                          {renderField({
                            name: "bankAccountName",
                            label: "Titulaire du compte",
                          })}
                          {renderField({
                            name: "bankAccountNumber",
                            label: "Numéro de compte",
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === "email" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-medium">Paramètres d'email</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderField({
                      name: "emailSender",
                      label: "Email expéditeur",
                      type: "email",
                    })}
                    {renderField({
                      name: "emailReplyTo",
                      label: "Email de réponse",
                      type: "email",
                    })}
                    {renderField({ name: "emailHost", label: "Serveur SMTP" })}
                    {renderField({ name: "emailPort", label: "Port SMTP" })}
                    {renderField({
                      name: "emailUsername",
                      label: "Nom d'utilisateur SMTP",
                    })}
                    {renderField({
                      name: "emailPassword",
                      label: "Mot de passe SMTP",
                      type: "password",
                    })}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
