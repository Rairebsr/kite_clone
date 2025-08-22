import React from "react";
import { FileText } from "lucide-react"; // icon
import notebook from '../../assets/notebook.jpeg';
const CorporateActions = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
      {/* Icon */}
      <img
                src={notebook}
                alt="Orders notebook"
                className="mx-auto mb-4 w-12 opacity-80"
              />

      {/* Message */}
      <p className="text-gray-500 text-lg">
        There are no open corporate actions right now.{" "}
        <div
                  onClick={() => window.open('https://support.zerodha.com/category/console/corporate-actions/ca-others/articles/apply-for-corporate-actions', '_blank')}
                  className="text-blue-600 cursor-pointer"
                >
                  Read more
                </div>
      </p>
    </div>
  );
};

export default CorporateActions;
