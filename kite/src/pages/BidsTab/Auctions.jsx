import React from "react";
import { Bell } from "lucide-react"; // You can use any bell icon or SVG

const Auctions = () => {
  return (
    <div className="p-6 flex flex-col items-center justify-center text-center text-gray-600 min-h-[300px]">
      <div className="mb-4">
        <Bell size={60} className="text-gray-300" />
      </div>
      <p className="text-base">There are no stocks for auctions yet.</p>
      <p className="text-sm mt-1">
        The auction market opens at <span className="font-medium">2.30 PM</span>. Stocks eligible to be <br />
        sold in the auction will be listed here.{" "}
        <div
                  onClick={() => window.open('https://support.zerodha.com/category/trading-and-markets/kite-features/auctions', '_blank')}
                  className="text-blue-600 cursor-pointer"
                >
                  Read more
                </div>
      </p>
    </div>
  );
};

export default Auctions;
