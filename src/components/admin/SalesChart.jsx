import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SalesChart = ({ data, dateRange }) => {
  const [dataKey, setDataKey] = useState("Sales");

  // Format date labels based on date range
  const formatXAxis = (tickItem) => {
    if (!tickItem) return "";

    const date = new Date(tickItem);

    switch (dateRange) {
      case "week":
        // For week view, show day of week
        return new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(
          date
        );
      case "month":
        // For month view, show day of month
        return date.getDate();
      case "quarter":
        // For quarter view, show abbreviated month and day
        return new Intl.DateTimeFormat("fr-FR", {
          month: "short",
          day: "numeric",
        }).format(date);
      case "year":
        // For year view, show abbreviated month
        return new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(
          date
        );
      default:
        return tickItem;
    }
  };

  // Format tooltip labels
  const formatTooltipDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Format currency for tooltip
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
    }).format(value);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{formatTooltipDate(label)}</p>
          <p className="text-blue-600">
            Ventes: {formatCurrency(payload[0].value)}
          </p>
          {dataKey === "OrderCount" && (
            <p className="text-green-600">Commandes: {payload[0].value}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setDataKey("Sales")}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              dataKey === "Sales"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Ventes
          </button>
          <button
            type="button"
            onClick={() => setDataKey("OrderCount")}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              dataKey === "OrderCount"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Commandes
          </button>
        </div>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="Date"
              tickFormatter={formatXAxis}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={dataKey === "Sales" ? "#2563eb" : "#10b981"}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
