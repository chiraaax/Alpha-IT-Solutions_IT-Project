import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { Bar, Line, Pie, Radar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement, Filler, RadialLinearScale } from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, RadialLinearScale, Title, Tooltip, Legend, Filler);

const PreBuildAnalytics = () => {
  const [builds, setBuilds] = useState([]);
  const [productsLookup, setProductsLookup] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // References for chart components
  const pieRef = useRef();
  const barRef = useRef();
  const lineRef = useRef();
  const radarRef = useRef();

  // Fetch pre-builds and all products concurrently
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch builds
        const buildsResponse = await axios.get("http://localhost:5000/api/prebuilds");
        setBuilds(buildsResponse.data.data);

        // Fetch all products and create a lookup by _id
        const productsResponse = await axios.get("http://localhost:5000/api/products");
        const lookup = {};
        productsResponse.data.forEach((product) => {
          lookup[product._id] = product;
        });
        setProductsLookup(lookup);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute data for charts
  const {
    categoryDistribution,
    priceRanges,
    componentUsage,
    priceByCategory,
    topBuilds,
    componentComparison
  } = useMemo(() => {
    if (builds.length === 0) {
      return {
        categoryDistribution: {},
        priceRanges: {},
        componentUsage: {},
        priceByCategory: [],
        topBuilds: [],
        componentComparison: []
      };
    }

    // Category distribution
    const categoryDist = builds.reduce((acc, build) => {
      acc[build.category] = (acc[build.category] || 0) + 1;
      return acc;
    }, {});

    // Price ranges
    const priceRanges = {
      "0-50000": 0,
      "50001-100000": 0,
      "100001-150000": 0,
      "150001-200000": 0,
      "200001+": 0
    };

    builds.forEach(build => {
      if (build.price <= 50000) priceRanges["0-50000"]++;
      else if (build.price <= 100000) priceRanges["50001-100000"]++;
      else if (build.price <= 150000) priceRanges["100001-150000"]++;
      else if (build.price <= 200000) priceRanges["150001-200000"]++;
      else priceRanges["200001+"]++;
    });

    // Component usage
    const components = {
      processor: {},
      gpu: {},
      ram: {},
      storage: {},
      powerSupply: {},
      casings: {}
    };

    builds.forEach(build => {
      // Count processor usage
      const processorId = build.processor;
      const processorName = productsLookup[processorId]?.description || processorId;
      components.processor[processorName] = (components.processor[processorName] || 0) + 1;

      // Count GPU usage
      const gpuId = build.gpu;
      const gpuName = productsLookup[gpuId]?.description || gpuId;
      components.gpu[gpuName] = (components.gpu[gpuName] || 0) + 1;

      // Same for other components...
      const ramId = build.ram;
      const ramName = productsLookup[ramId]?.description || ramId;
      components.ram[ramName] = (components.ram[ramName] || 0) + 1;

      const storageId = build.storage;
      const storageName = productsLookup[storageId]?.description || storageId;
      components.storage[storageName] = (components.storage[storageName] || 0) + 1;

      const powerSupplyId = build.powerSupply;
      const powerSupplyName = productsLookup[powerSupplyId]?.description || powerSupplyId;
      components.powerSupply[powerSupplyName] = (components.powerSupply[powerSupplyName] || 0) + 1;

      const casingsId = build.casings;
      const casingsName = productsLookup[casingsId]?.description || casingsId;
      components.casings[casingsName] = (components.casings[casingsName] || 0) + 1;
    });

    // Price by category
    const priceByCategory = Object.entries(categoryDist).map(([category, count]) => {
      const categoryBuilds = builds.filter(b => b.category === category);
      const totalPrice = categoryBuilds.reduce((sum, b) => sum + b.price, 0);
      const avgPrice = totalPrice / count;
      
      return {
        category,
        count,
        totalPrice,
        avgPrice
      };
    });

    // Top 5 most expensive builds
    const topBuilds = [...builds]
      .sort((a, b) => b.price - a.price)
      .slice(0, 5)
      .map(build => ({
        category: build.category,
        price: build.price,
        processor: productsLookup[build.processor]?.description || build.processor,
        gpu: productsLookup[build.gpu]?.description || build.gpu
      }));

    // Component comparison for radar chart (top categories)
    const categories = Object.keys(categoryDist);
    const componentComparison = categories.map(category => {
      const categoryBuilds = builds.filter(b => b.category === category);
      const avgPrice = categoryBuilds.reduce((sum, b) => sum + b.price, 0) / categoryBuilds.length;
      
      // Find most common components in this category
      let mostCommonProcessor = "";
      let mostCommonGpu = "";
      
      const processorCount = {};
      const gpuCount = {};
      
      categoryBuilds.forEach(build => {
        const processorName = productsLookup[build.processor]?.description || build.processor;
        processorCount[processorName] = (processorCount[processorName] || 0) + 1;
        
        const gpuName = productsLookup[build.gpu]?.description || build.gpu;
        gpuCount[gpuName] = (gpuCount[gpuName] || 0) + 1;
      });
      
      mostCommonProcessor = Object.entries(processorCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
      mostCommonGpu = Object.entries(gpuCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
      
      return {
        category,
        avgPrice,
        count: categoryBuilds.length,
        mostCommonProcessor,
        mostCommonGpu
      };
    });

    return {
      categoryDistribution: categoryDist,
      priceRanges,
      componentUsage: components,
      priceByCategory,
      topBuilds,
      componentComparison
    };
  }, [builds, productsLookup]);

  // Chart data
  const pieChartData = {
    labels: Object.keys(categoryDistribution),
    datasets: [
      {
        label: "Category Distribution",
        data: Object.values(categoryDistribution),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(priceRanges),
    datasets: [
      {
        label: "Price Distribution",
        data: Object.values(priceRanges),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
    ],
  };

  const lineChartData = {
    labels: priceByCategory.map(item => item.category),
    datasets: [
      {
        label: "Average Price by Category",
        data: priceByCategory.map(item => item.avgPrice),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Build Count by Category",
        data: priceByCategory.map(item => item.count * 10000), // Scaling for visibility
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  // Most used processors
  const topProcessors = Object.entries(componentUsage.processor || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topGpus = Object.entries(componentUsage.gpu || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const radarData = {
    labels: componentComparison.map(item => item.category),
    datasets: [
      {
        label: "Average Price (scaled 1:10000)",
        data: componentComparison.map(item => item.avgPrice / 10000),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
      },
      {
        label: "Build Count",
        data: componentComparison.map(item => item.count),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  const handleGenerateReport = async () => {
    const doc = new jsPDF("p", "mm", "a4");

    const primaryColor = "#2c3e50";
    const accentColor = "#10b981";

    // Add company header
    doc.setFontSize(10);
    doc.setTextColor(primaryColor);
    doc.text("Alpha IT Solutions", 190, 12, { align: "right" });
    doc.text("26/C/3 Biyagama Road, Talwatta", 190, 17, { align: "right" });
    doc.text("Kelaniya 11600", 190, 22, { align: "right" });
    doc.text("Tel: 077 625 2822", 190, 27, { align: "right" });

    doc.setFontSize(18);
    doc.setTextColor(accentColor);
    doc.setFont(undefined, "bold");
    doc.text("Pre-Built PC Analytics Report", 105, 45, { align: "center" });

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.setTextColor(primaryColor);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 55);

    const addFooter = () => {
      doc.setFontSize(8);
      doc.setTextColor("#999999");
      doc.text("Generated by Alpha IT Solutions | Confidential", 105, 290, { align: "center" });
    };

    // Add charts to PDF
    if (pieRef.current) {
      const pieCanvasEl = pieRef.current.querySelector("canvas");
      const pieCanvas = await html2canvas(pieCanvasEl, { backgroundColor: "#ffffff", useCORS: true });
      const pieImg = pieCanvas.toDataURL("image/png");
      doc.addImage(pieImg, "PNG", 10, 65, 190, 100);
    }
    
    addFooter();
    doc.addPage();

    if (barRef.current) {
      const barCanvasEl = barRef.current.querySelector("canvas");
      const barCanvas = await html2canvas(barCanvasEl, { backgroundColor: "#ffffff", useCORS: true });
      const barImg = barCanvas.toDataURL("image/png");
      doc.addImage(barImg, "PNG", 10, 20, 190, 100);
    }
    
    addFooter();
    doc.addPage();

    if (lineRef.current) {
      const lineCanvasEl = lineRef.current.querySelector("canvas");
      const lineCanvas = await html2canvas(lineCanvasEl, { backgroundColor: "#ffffff", useCORS: true });
      const lineImg = lineCanvas.toDataURL("image/png");
      doc.addImage(lineImg, "PNG", 10, 20, 190, 100);
    }
    
    addFooter();
    doc.addPage();

    if (radarRef.current) {
      const radarCanvasEl = radarRef.current.querySelector("canvas");
      const radarCanvas = await html2canvas(radarCanvasEl, { backgroundColor: "#ffffff", useCORS: true });
      const radarImg = radarCanvas.toDataURL("image/png");
      doc.addImage(radarImg, "PNG", 10, 20, 190, 100);
    }
    
    addFooter();
    doc.addPage();

    // Summary Tables
    doc.setFontSize(16);
    doc.setTextColor(accentColor);
    doc.text("Summary Tables", 105, 20, { align: "center" });

    // Category distribution
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text("Category Distribution", 15, 30);

    const categoryRows = Object.entries(categoryDistribution).map(([category, count]) => [category, count]);

    doc.autoTable({
      startY: 35,
      head: [["Category", "Count"]],
      body: categoryRows,
      theme: "striped",
      headStyles: { fillColor: accentColor },
      styles: { fontSize: 10 },
      margin: { left: 15, right: 15 },
    });

    // Price ranges
    doc.setFontSize(14);
    doc.text("Price Range Distribution", 15, doc.lastAutoTable.finalY + 15);

    const priceRangeRows = Object.entries(priceRanges).map(([range, count]) => [range, count]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Price Range (LKR)", "Count"]],
      body: priceRangeRows,
      theme: "striped",
      headStyles: { fillColor: accentColor },
      styles: { fontSize: 10 },
      margin: { left: 15, right: 15 },
    });

    // Top builds
    doc.setFontSize(14);
    doc.text("Top 5 Most Expensive Builds", 15, doc.lastAutoTable.finalY + 15);

    const topBuildRows = topBuilds.map(build => [
      build.category,
      `LKR ${build.price.toFixed(2)}`,
      build.processor,
      build.gpu
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Category", "Price", "Processor", "GPU"]],
      body: topBuildRows,
      theme: "striped",
      headStyles: { fillColor: accentColor },
      styles: { fontSize: 10 },
      margin: { left: 15, right: 15 },
    });

    // Component usage
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(accentColor);
    doc.text("Component Analysis", 105, 20, { align: "center" });

    // Top processors
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text("Top 5 Most Used Processors", 15, 30);

    const processorRows = topProcessors.map(([proc, count]) => [proc, count]);

    doc.autoTable({
      startY: 35,
      head: [["Processor", "Count"]],
      body: processorRows,
      theme: "striped",
      headStyles: { fillColor: accentColor },
      styles: { fontSize: 10 },
      margin: { left: 15, right: 15 },
    });

    // Top GPUs
    doc.setFontSize(14);
    doc.text("Top 5 Most Used GPUs", 15, doc.lastAutoTable.finalY + 15);

    const gpuRows = topGpus.map(([gpu, count]) => [gpu, count]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [["GPU", "Count"]],
      body: gpuRows,
      theme: "striped",
      headStyles: { fillColor: accentColor },
      styles: { fontSize: 10 },
      margin: { left: 15, right: 15 },
    });

    addFooter();
    doc.save(`PreBuild_Analytics_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-t-4 border-r-4 border-blue-500 border-solid rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="text-cyan-400 text-xl font-bold">LOADING ANALYTICS...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center bg-gray-800 border-2 border-red-500 p-8 rounded-lg shadow-lg max-w-md">
        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-red-500 text-xl font-bold mb-2">SYSTEM ERROR</p>
        <p className="text-gray-300">{error}</p>
      </div>
    </div>
  );

  if (builds.length === 0) return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center bg-gray-800 border-2 border-cyan-500 p-8 rounded-lg shadow-lg max-w-md">
        <svg className="w-16 h-16 text-cyan-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="text-cyan-400 text-xl font-bold mb-2">NO BUILDS FOUND</p>
        <p className="text-gray-300">Create some builds to see analytics.</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white w-auto bg-[url('/images/circuit-bg.png')] bg-fixed bg-opacity-10">
      {/* Header with gradient and glow effect */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-lg opacity-20"></div>
        <div className="relative">
          <h2 className="text-4xl font-bold py-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            PREBUILD ANALYTICS DASHBOARD
          </h2>
          <div className="h-1 w-105 bg-gradient-to-r from-cyan-400 to-purple-500 rounded"></div>
        </div>
      </div>
      
      {/* Generate Report Button */}
      <div className="flex justify-center mb-12">
        <button
          onClick={handleGenerateReport}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/30"
        >
          📄 Generate Complete Analytics Report
        </button>
      </div>
      
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution Pie Chart */}
        <div ref={pieRef} className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-cyan-400 text-center">Category Distribution</h3>
          <div className="bg-white rounded-lg p-4">
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        {/* Price Distribution Bar Chart */}
        <div ref={barRef} className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-cyan-400 text-center">Price Distribution</h3>
          <div className="bg-white rounded-lg p-4">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `Count: ${context.raw}`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        {/* Price vs Count by Category Line Chart */}
        <div ref={lineRef} className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-2xl lg:col-span-2">
          <h3 className="text-2xl font-bold mb-6 text-cyan-400 text-center">Average Price & Count by Category</h3>
          <div className="bg-white rounded-lg p-4">
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'Average Price (LKR)'
                    }
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Build Count (scaled)'
                    },
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                }
              }}
            />
          </div>
        </div>
        
        {/* Radar Chart for Category Comparison */}
        <div ref={radarRef} className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-cyan-400 text-center">Category Comparison</h3>
          <div className="bg-white rounded-lg p-4">
            <Radar
              data={radarData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  }
                },
                scales: {
                  r: {
                    angleLines: {
                      display: true,
                      color: 'rgba(0, 0, 0, 0.1)'
                    },
                    suggestedMin: 0
                  }
                }
              }}
            />
          </div>
        </div>
        
        {/* Top 5 Most Expensive Builds */}
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-cyan-400 text-center">Top 5 Most Expensive Builds</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-700/50 border-b border-gray-600">
                  <th className="p-3 rounded-tl-lg">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Processor</th>
                  <th className="p-3 rounded-tr-lg">GPU</th>
                </tr>
              </thead>
              <tbody>
                {topBuilds.map((build, index) => (
                  <tr key={index} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                    <td className="p-3">
                      <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full font-medium">
                        {build.category}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-lime-400 font-bold">
                      LKR {build.price.toFixed(2)}
                    </td>
                    <td className="p-3 text-gray-300">{build.processor}</td>
                    <td className="p-3 text-gray-300">{build.gpu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Component Analysis Section */}
      <div className="mt-12">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 blur-lg opacity-20"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold py-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              COMPONENT USAGE ANALYSIS
            </h2>
            <div className="h-1 w-80 bg-gradient-to-r from-green-400 to-blue-500 rounded"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Processor Usage */}
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-green-400 text-center">Top 5 Most Used Processors</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-700/50 border-b border-gray-600">
                    <th className="p-3 rounded-tl-lg">Processor</th>
                    <th className="p-3 rounded-tr-lg">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {topProcessors.map(([processor, count], index) => (
                    <tr key={index} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                      <td className="p-3 text-gray-300">{processor}</td>
                      <td className="p-3 font-mono text-green-400 font-bold">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
                    {/* GPU Usage */}
                    <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-blue-400 text-center">Top 5 Most Used GPUs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-700/50 border-b border-gray-600">
                    <th className="p-3 rounded-tl-lg">GPU</th>
                    <th className="p-3 rounded-tr-lg">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {topGpus.map(([gpu, count], index) => (
                    <tr key={index} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                      <td className="p-3 text-gray-300">{gpu}</td>
                      <td className="p-3 font-mono text-blue-400 font-bold">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreBuildAnalytics;