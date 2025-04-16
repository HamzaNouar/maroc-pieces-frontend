import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import SalesChart from "../../components/admin/SalesChart";
import {
  fetchSalesReport,
  fetchTopProducts,
  fetchTopCustomers,
  fetchSalesByCategory,
  fetchSalesTimeline,
} from "../../store/slices/reportSlice";

const ReportsPage = () => {
  const dispatch = useDispatch();
  const {
    salesData,
    topProducts,
    topCustomers,
    categoryData,
    timelineData,
    isLoading,
    error,
  } = useSelector((state) => state.reports);
  const [dateRange, setDateRange] = useState("month");

  useEffect(() => {
    dispatch(fetchSalesReport(dateRange));
    dispatch(fetchTopProducts(dateRange));
    dispatch(fetchTopCustomers(dateRange));
    dispatch(fetchSalesByCategory(dateRange));
    dispatch(fetchSalesTimeline(dateRange));
  }, [dispatch, dateRange]);


  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleExportCSV = () => {
    try {
      // Create arrays for each report type
      const salesReportData = [
        [
          "Rapport de ventes",
          `Période: ${
            dateRange === "week"
              ? "Semaine"
              : dateRange === "month"
              ? "Mois"
              : dateRange === "quarter"
              ? "Trimestre"
              : "Année"
          }`,
        ],
        ["Métrique", "Valeur", "Période précédente", "Croissance (%)"],
        [
          "Ventes totales",
          salesData?.totalSales || 0,
          salesData?.previousTotalSales || 0,
          calculateGrowth(
            salesData?.totalSales || 0,
            salesData?.previousTotalSales || 0
          ).toFixed(2),
        ],
        [
          "Nombre de commandes",
          salesData?.orderCount || 0,
          salesData?.previousOrderCount || 0,
          calculateGrowth(
            salesData?.orderCount || 0,
            salesData?.previousOrderCount || 0
          ).toFixed(2),
        ],
        [
          "Panier moyen",
          salesData?.averageOrderValue || 0,
          salesData?.previousAverageOrderValue || 0,
          calculateGrowth(
            salesData?.averageOrderValue || 0,
            salesData?.previousAverageOrderValue || 0
          ).toFixed(2),
        ],
        [
          "Nouveaux clients",
          salesData?.newCustomers || 0,
          salesData?.previousNewCustomers || 0,
          calculateGrowth(
            salesData?.newCustomers || 0,
            salesData?.previousNewCustomers || 0
          ).toFixed(2),
        ],
        [""], // Empty row for separation
      ];

      // Top products data
      const topProductsData = [
        ["Produits les plus vendus"],
        ["Rang", "Nom du produit", "Quantité vendue", "Chiffre d'affaires"],
      ];

      if (topProducts?.length > 0) {
        topProducts.forEach((product, index) => {
          topProductsData.push([
            index + 1,
            product.name,
            product.quantity,
            product.revenue,
          ]);
        });
      }
      topProductsData.push([""]); // Empty row for separation

      // Top customers data
      const topCustomersData = [
        ["Meilleurs clients"],
        ["Nom", "Email", "Nombre de commandes", "Total dépensé"],
      ];

      if (topCustomers?.length > 0) {
        topCustomers.forEach((customer) => {
          topCustomersData.push([
            `${customer.firstName} ${customer.lastName}`,
            customer.email,
            customer.orderCount,
            customer.totalSpent,
          ]);
        });
      }
      topCustomersData.push([""]); // Empty row for separation

      // Category sales data
      const categorySalesData = [
        ["Ventes par catégorie"],
        ["Catégorie", "Articles vendus", "Chiffre d'affaires"],
      ];

      if (categoryData?.length > 0) {
        categoryData.forEach((category) => {
          categorySalesData.push([
            category.categoryName,
            category.itemCount,
            category.totalSales,
          ]);
        });
      }

      // Combine all data
      const allData = [
        ...salesReportData,
        ...topProductsData,
        ...topCustomersData,
        ...categorySalesData,
      ];

      // Convert to CSV
      let csvContent = "data:text/csv;charset=utf-8,";

      allData.forEach((row) => {
        const csvRow = row.join(",");
        csvContent += csvRow + "\r\n";
      });

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `rapport_ventes_${dateRange}_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      document.body.appendChild(link);

      // Trigger download
      link.click();
      document.body.removeChild(link);

      toast.success("Rapport exporté avec succès");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Erreur lors de l'exportation du rapport");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
    }).format(amount);
  };

  const calculateGrowth = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const renderGrowthIndicator = (growth) => {
    if (growth > 0) {
      return (
        <div className="flex items-center text-green-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>+{growth.toFixed(2)}%</span>
        </div>
      );
    } else if (growth < 0) {
      return (
        <div className="flex items-center text-red-600">
          <TrendingDown className="h-4 w-4 mr-1" />
          <span>{growth.toFixed(2)}%</span>
        </div>
      );
    } else {
      return <span className="text-gray-500">0%</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rapports et Analyses</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2">Chargement des données...</p>
        </div>
      ) : (
        <>
          {/* Sales Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Ventes totales</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(salesData?.totalSales || 0)}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-2">
                {renderGrowthIndicator(
                  calculateGrowth(
                    salesData?.totalSales || 0,
                    salesData?.previousTotalSales || 0
                  )
                )}
                <p className="text-xs text-gray-500">vs période précédente</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Commandes</p>
                  <p className="text-2xl font-bold">
                    {salesData?.orderCount || 0}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-2">
                {renderGrowthIndicator(
                  calculateGrowth(
                    salesData?.orderCount || 0,
                    salesData?.previousOrderCount || 0
                  )
                )}
                <p className="text-xs text-gray-500">vs période précédente</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Panier moyen</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(salesData?.averageOrderValue || 0)}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-2">
                {renderGrowthIndicator(
                  calculateGrowth(
                    salesData?.averageOrderValue || 0,
                    salesData?.previousAverageOrderValue || 0
                  )
                )}
                <p className="text-xs text-gray-500">vs période précédente</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Nouveaux clients</p>
                  <p className="text-2xl font-bold">
                    {salesData?.newCustomers || 0}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-2">
                {renderGrowthIndicator(
                  calculateGrowth(
                    salesData?.newCustomers || 0,
                    salesData?.previousNewCustomers || 0
                  )
                )}
                <p className="text-xs text-gray-500">vs période précédente</p>
              </div>
            </div>
          </div>

          {/* Sales Chart and Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b">
                <h2 className="font-semibold">Évolution des ventes</h2>
              </div>
              <div className="p-4 h-80">
                {timelineData && timelineData.length > 0 ? (
                  <SalesChart data={timelineData} dateRange={dateRange} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">Aucune donnée disponible</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b">
                <h2 className="font-semibold">Produits les plus vendus</h2>
              </div>
              <div className="p-4">
                {topProducts?.length > 0 ? (
                  <ul className="space-y-4">
                    {topProducts.map((product, index) => (
                      <li key={product.id} className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {index + 1}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {product.quantity} vendus
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(product.revenue)}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Aucune donnée disponible
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Top Customers and Sales by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b">
                <h2 className="font-semibold">Meilleurs clients</h2>
              </div>
              <div className="p-4">
                {topCustomers?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Client
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Commandes
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Total dépensé
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {topCustomers.map((customer) => (
                          <tr key={customer.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-700">
                                    {customer.firstName?.charAt(0)}
                                    {customer.lastName?.charAt(0)}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{`${customer.firstName} ${customer.lastName}`}</div>
                                  <div className="text-sm text-gray-500">
                                    {customer.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {customer.orderCount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatCurrency(customer.totalSpent)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Aucune donnée disponible
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b">
                <h2 className="font-semibold">Ventes par catégorie</h2>
              </div>
              <div className="p-4">
                {categoryData?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Catégorie
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Articles vendus
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Chiffre d'affaires
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {categoryData.map((category) => (
                          <tr key={category.categoryId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {category.categoryName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {category.itemCount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatCurrency(category.totalSales)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Aucune donnée disponible
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default ReportsPage;
