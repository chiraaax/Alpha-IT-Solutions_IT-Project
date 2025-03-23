import { useState } from "react";
import LowStockModal from "./LowStockModal";

const NotificationBell = ({ products, onSaveProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine low-stock products.
  const lowStockProducts = products.filter(
    (p) => (p.stockCount || 10) <= (p.threshold || 1)
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsModalOpen(true)}
        className="relative focus:outline-none"
      >
        <svg
          className="w-8 h-8 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.163 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {lowStockProducts.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {lowStockProducts.length}
          </span>
        )}
      </button>
      {isModalOpen && (
        <LowStockModal
          lowStockProducts={lowStockProducts}
          onClose={() => setIsModalOpen(false)}
          onSaveProducts={onSaveProducts}
        />
      )}
    </div>
  );
};

export default NotificationBell;
