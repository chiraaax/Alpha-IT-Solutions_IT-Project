// src/components/InventoryAnalytics.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from "recharts";

// Color palette
const COLORS = ["#4ade80", "#facc15", "#f87171"]; // Pie chart colors
const BAR_COLORS = ["#60a5fa", "#f87171"];       // Bar chart colors
const LINE_COLOR = "#10b981";                    // Line chart color

// Helpers
const computePieData = (products) => {
  let inStock = 0, low = 0, out = 0;
  products.forEach(p => {
    if (p.displayedStock <= 0) out++;
    else if (p.displayedStock <= p.threshold) low++;
    else inStock++;
  });
  return [
    { name: "In Stock", value: inStock },
    { name: "Low Stock", value: low },
    { name: "Out of Stock", value: out }
  ];
};

const aggregateOrders = (orders) => {
  const perProduct = {};
  const perDay = {};

  orders.forEach(o => {
    const day = new Date(o.createdAt).toISOString().slice(0, 10);
    perDay[day] = (perDay[day] || 0) + o.totalAmount;

    o.items?.forEach(it => {
      if (it.itemType !== "Product") return;
      const id = typeof it.itemId === "object" ? it.itemId._id : it.itemId;
      if (!perProduct[id]) perProduct[id] = { sold: 0, revenue: 0 };
      perProduct[id].sold += it.quantity || 0;
      perProduct[id].revenue += (it.quantity || 0) * (it.priceAtSale || 0);
    });
  });

  return { perProduct, perDay };
};

// Component
export default function InventoryAnalytics() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Fetch products and orders
  useEffect(() => {
    (async () => {
      try {
        const [prodRes, ordRes] = await Promise.all([
          axios.get("http://localhost:5000/api/products"),
          axios.get("http://localhost:5000/api/successOrder/admin/all", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);

        setProducts(
          prodRes.data.map(p => ({
            ...p,
            displayedStock: p.displayedStock ?? 0,
            threshold: p.threshold ?? 3
          }))
        );

        setOrders(Array.isArray(ordRes.data) ? ordRes.data : ordRes.data.orders);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      }
    })();
  }, []);

  // Heavy computation with useMemo
  const { pieData, barData, lineData } = useMemo(() => {
    const pie = computePieData(products);
    const { perProduct, perDay } = aggregateOrders(orders);

    const bars = products
      .map(p => ({
        name: p.description?.slice(0, 18) || p._id,
        inStock: p.displayedStock,
        sold: perProduct[p._id]?.sold || 0
      }))
      .filter(r => r.inStock > 0 || r.sold > 0);

    const today = new Date();
    const line = [...Array(30).keys()].map(i => {
      const d = new Date(today);
      d.setDate(d.getDate() - (29 - i));
      const key = d.toISOString().slice(0, 10);
      return { day: key.slice(5), revenue: perDay[key] || 0 }; // “MM-DD”
    });

    return { pieData: pie, barData: bars, lineData: line };
  }, [products, orders]);

  // UI
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mt-8 w-full">

      <h2 className="text-2xl font-bold mb-6 text-center">Inventory & Sales Analytics</h2>
      <div className="space-y-10">
        {/* Pie Chart */}
        <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={500}>

            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={200}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="top" height={50} />
            </PieChart>
          </ResponsiveContainer>
        </div>
  
        {/* Bar Chart */}
        <div className="flex justify-center">
          <ResponsiveContainer width="90%" height={500}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="inStock" stackId="a" fill={BAR_COLORS[0]} />
              <Bar dataKey="sold" stackId="a" fill={BAR_COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
  
        {/* Line Chart */}
        <div className="flex justify-center">
          <ResponsiveContainer width="90%" height={500}>
            <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke={LINE_COLOR} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}