import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileModal = ({ show, onClose }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (show) {
      setIsLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          setUser(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [show]);

  const handleUpdate = () => {
    setIsLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/auth/update-profile`,
        {
          profileDetails: user.profileDetails,
          panDetails: user.panDetails,
          bankDetails: user.bankDetails,
        },
        { headers: { Authorization: token } }
      )
      .then(() => {
        alert("Profile updated successfully!");
        onClose();
      })
      .catch((err) => {
        alert("Update failed. Please try again.");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-2 sm:p-4">
      {/* Modal container */}
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-2xl rounded-none sm:rounded-xl shadow-xl flex flex-col">
        
        {/* Header */}
        <div className="bg-orange-600 p-4 text-white flex justify-between items-center sticky top-0">
          <h2 className="text-lg sm:text-xl font-bold">Your Profile</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-orange-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {isLoading && !user ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : user ? (
            <div className="space-y-6">
              {/* Profile Details */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <h3 className="font-semibold text-orange-700 mb-3">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(user.profileDetails).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-sm font-medium text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <input
                        type="text"
                        value={value}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        onChange={(e) =>
                          setUser({
                            ...user,
                            profileDetails: {
                              ...user.profileDetails,
                              [key]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* PAN Details */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <h3 className="font-semibold text-orange-700 mb-3">PAN Details</h3>
                <input
                  type="text"
                  value={user.panDetails.panNumber}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  onChange={(e) =>
                    setUser({
                      ...user,
                      panDetails: { panNumber: e.target.value },
                    })
                  }
                />
              </div>

              {/* Bank Details */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <h3 className="font-semibold text-orange-700 mb-3">Bank Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(user.bankDetails).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-sm font-medium text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <input
                        type="text"
                        value={value}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        onChange={(e) =>
                          setUser({
                            ...user,
                            bankDetails: {
                              ...user.bankDetails,
                              [key]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center py-8 text-red-500">
              Failed to load profile data.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 flex justify-end gap-3 border-t">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {isLoading && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
