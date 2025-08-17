import React, { useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Star } from "lucide-react";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const FundamentalsView = ({ ipo, onClose }) => {
  const [activeTab, setActiveTab] = useState("Key Stats");
  const [revenueTab, setRevenueTab] = useState("Latest");

  const {
    name,
    sector,
    description,
    peRatio,
    pbRatio,
    sectorPE,
    sectorPB,
    ipoSize,
    ofsSize,
    financials,
    symbol,
    marketCap,
  } = ipo;

  const hasValidFinancials = Array.isArray(financials) && financials.length > 0;

  const tabs = ["Key Stats", "Revenue Mix", "Peers", "Shareholding"];

  const barData = {
    labels: ["Mar 2023", "Mar 2024", "Mar 2025"],
    datasets: hasValidFinancials
      ? [
          {
            label: "Revenue (Cr)",
            data: financials.map((f) => f.revenue),
            backgroundColor: "#22c55e",
          },
          {
            label: "Profit (Cr)",
            data: financials.map((f) => f.profit),
            backgroundColor: "#3b82f6",
          },
          {
            label: "Debt (Cr)",
            data: financials.map((f) => f.debt),
            backgroundColor: "#facc15",
          },
        ]
      : [],
  };

  const barOptions = {
    plugins: {
      legend: {
        labels: { font: { size: 12 } },
      },
    },
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + " Cr";
          },
        },
      },
    },
  };

  const sampleHistoricRevenueMix = [
    { year: "2021", "Product Revenue": 60, "Service Revenue": 40 },
    { year: "2022", "Product Revenue": 55, "Service Revenue": 45 },
    { year: "2023", "Product Revenue": 50, "Service Revenue": 50 },
    { year: "2024", "Product Revenue": 48, "Service Revenue": 52 },
    { year: "2025", "Product Revenue": 46, "Service Revenue": 54 },
  ];

  const latestRevenueData = {
    labels: ["Part1", "Part2"],
    datasets: [
      {
        data: [76.96, 23.04],
        backgroundColor: ["#2563eb", "#93c5fd"],
        hoverOffset: 8,
      },
    ],
  };

  const revenueChartOptions = {
    cutout: "60%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed.toFixed(2)}%`,
        },
      },
    },
  };

//   const peerData = [
//     { name: "Peer 1 Ltd", pe: 25.3, pb: 4.5 },
//     { name: "Peer 2 Corp", pe: 30.1, pb: 3.9 },
//     { name: "Peer 3 Pvt", pe: 22.6, pb: 5.1 },
//   ];

  const shareholdingData = [
    { category: "Promoters", percent: 60 },
    { category: "Retail", percent: 15 },
    { category: "QIB", percent: 20 },
    { category: "Others", percent: 5 },
  ];

  const shareholdingChartData = {
    labels: shareholdingData.map((s) => s.category),
    datasets: [
      {
        data: shareholdingData.map((s) => s.percent),
        backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#a78bfa"],
        hoverOffset: 4,
      },
    ],
  };
  const peerData = [
  { name: "FLYSBS", marketCap: 389, sales: 193, netProfit: 28.41, pe: 13.69 },
  { name: "GLOBALVECT", marketCap: 313, sales: 502, netProfit: 1.21, pe: 0.0 },
];

// Max value helper
const getMaxValues = (data) => {
  const keys = ["marketCap", "sales", "netProfit", "pe"];
  const max = {};
  keys.forEach((key) => {
    max[key] = Math.max(...data.map((item) => item[key]));
  });
  return max;
};

const maxValues = getMaxValues(peerData);

// Cell render helper
const renderCell = (value, maxValue) => (
  <div className="flex items-center gap-1">
    {value === maxValue && <Star size={14} color="#facc15" fill="#facc15" />}
    <span>{value}</span>
  </div>
);
  // Helper: Generate mock peers based on selected stock
// const generateMockPeers = (stock, count = 5) => {
//   const getRandom = (base, variation = 0.2) => {
//     const factor = 1 + (Math.random() * 2 - 1) * variation;
//     return Math.round(base * factor * 100) / 100;
//   };

//   return Array.from({ length: count }, (_, i) => ({
//     name: `${stock.symbol}-PEER${i + 1}`,
//     marketCap: getRandom(stock.price * 10),
//     sales: getRandom(stock.price * 2),
//     netProfit: getRandom(stock.price * 0.5),
//     pe: getRandom(stock.price / 10),
//   }));
// };

  return (
    <div className="relative p-1.5 bg-white rounded-md shadow-sm max-w-xl mx-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
      >
        Close
      </button>

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{symbol}</h2>
          <p className="text-gray-500 text-sm">{name}</p>
        </div>
        <div className="text-sm font-medium text-gray-600">
          ₹{marketCap} Cr. M.Cap
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 border-b pb-3">{description}</p>

      {/* Tabs */}
      <div className="flex space-x-6 border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium transition ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Key Stats" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-6">
            <div className="bg-gray-50 p-2 rounded">
              <strong>PE Ratio:</strong> {peRatio}
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <strong>P/B:</strong> {pbRatio}
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <strong>Sector PE:</strong> {sectorPE}
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <strong>Sector P/B:</strong> {sectorPB}
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <strong>IPO Size:</strong> {ipoSize} Cr
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <strong>OFS:</strong> {ofsSize}%
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Financial Summary</h3>
            {hasValidFinancials && barData.datasets.length > 0 ? (
  <Bar data={barData} options={barOptions} />
) : (
  <p className="text-sm text-red-500">No financial data available.</p>
)}

          </div>
        </>
      )}

      {activeTab === "Revenue Mix" && (
        <div className="px-4">
          <div className="flex space-x-4 mb-4 border-b border-gray-300">
            <button
              onClick={() => setRevenueTab("Latest")}
              className={`pb-1 border-b-2 ${
                revenueTab === "Latest"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setRevenueTab("Historic")}
              className={`pb-1 border-b-2 ${
                revenueTab === "Historic"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              Historic
            </button>
          </div>

          {revenueTab === "Latest" ? (
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="w-72 h-72">
                <Doughnut data={latestRevenueData} options={revenueChartOptions} />
              </div>

              <div className="space-y-4">
                {latestRevenueData.labels.map((label, index) => (
                  <div key={index} className="flex items-center justify-between w-80">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{
                          backgroundColor:
                            latestRevenueData.datasets[0].backgroundColor[index],
                        }}
                      ></div>
                      <span className="text-sm">{label}</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {latestRevenueData.datasets[0].data[index].toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : sampleHistoricRevenueMix.length > 0 ? (
            <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-xl mx-auto">
              <h3 className="text-lg font-semibold mb-2">Revenue over Years</h3>
              <Line
                data={{
                  labels: sampleHistoricRevenueMix.map((entry) => entry.year),
                  datasets: [
                    {
                      label: "Product Revenue",
                      data: sampleHistoricRevenueMix.map(
                        (entry) => entry["Product Revenue"]
                      ),
                      fill: false,
                      backgroundColor: "#3b82f6",
                      borderColor: "#3b82f6",
                      tension: 0.3,
                    },
                    {
                      label: "Service Revenue",
                      data: sampleHistoricRevenueMix.map(
                        (entry) => entry["Service Revenue"]
                      ),
                      fill: false,
                      backgroundColor: "#f59e0b",
                      borderColor: "#f59e0b",
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "% of Revenue",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Year",
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500">No historic revenue data available.</p>
          )}
        </div>
      )}

      {activeTab === "Peers" && (
  <div className="p-4 text-sm">
    <h3 className="font-semibold mb-3">Peers</h3>
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b text-gray-500">
          <th className="py-2">Peer Name</th>
          <th className="py-2">M.Cap (Cr.)</th>
          <th className="py-2">Sales</th>
          <th className="py-2">Net Profit</th>
          <th className="py-2">PE</th>
        </tr>
      </thead>
      <tbody>
        {peerData.map((peer, idx) => (
          <tr key={idx} className="border-b">
            <td className="py-2">{peer.name}</td>
            <td className="py-2">{renderCell(peer.marketCap, maxValues.marketCap)}</td>
            <td className="py-2">{renderCell(peer.sales, maxValues.sales)}</td>
            <td className="py-2">{renderCell(peer.netProfit, maxValues.netProfit)}</td>
            <td className="py-2">{renderCell(peer.pe, maxValues.pe)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      {activeTab === "Shareholding" && (
  <div className="text-sm text-center">
    <h3 className="font-semibold mb-4">Shareholding Pattern</h3>
    <div className="max-w-xl mx-auto">
      <Bar
        data={{
          labels: ["Promoter Holding", "Public Holding"],
          datasets: [
            {
              label: "Pre - IPO",
              data: [95, 5],
              backgroundColor: "#3366CC",
              barThickness: 30,
            },
            {
              label: "Post - IPO",
              data: [70, 30],
              backgroundColor: "#DDE5F1",
              barThickness: 30,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%`,
              },
            },
          },
          scales: {
            x: {
              stacked: false,
              ticks: {
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
            },
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: (value) => `${value}%`,
              },
            },
          },
        }}
      />
    </div>
  </div>
)}

    </div>
  );
};

export default FundamentalsView;
