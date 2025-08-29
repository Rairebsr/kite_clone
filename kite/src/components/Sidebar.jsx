import React, { useState, useEffect, useContext } from 'react';
import { FaSearch, FaPlus, FaChevronLeft, FaChevronRight, FaChartLine, FaTrash } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';
import stockData from '../assets/mock_stock_data_50.json';
import { mockMarketDepth } from '../assets/depth';
import MarketDepthTable from './MarketDepthTable';
import StockChart from './StockChart';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import OrderModal from './OrderModel';
import Dashboard from '../pages/Dashboard';
import { userContext } from '../context/userContext';



const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [watchlists, setWatchlists] = useState({
    'Watchlist 1': {
      groups: {
        Default: []
      }
    }
  });


  const [userId, setUserId] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded = jwtDecode(token);
    console.log(decoded)
    setUserId(decoded.id); // fallback to id
    
  }
  
}, []);

  const [holdings, setHoldings] = useState([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState('Watchlist 1');
  const [selectedGroup, setSelectedGroup] = useState('Default');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newWatchlist, setNewWatchlist] = useState('');
  const [showGroupInput, setShowGroupInput] = useState(false);
  const [addingType, setAddingType] = useState('');
  const [selectedChartStock, setSelectedChartStock] = useState(null);
  const [state,setState] = useState('');
  const [editingWatchlist, setEditingWatchlist] = useState(null);
  const [newWatchlistName, setNewWatchlistName] = useState('');



  const {showBuyModal, setShowBuyModal,showChartModal,setShowChartModal,showDepth,setShowDepth} = useContext(userContext)
  

useEffect(() => {
    if (userId) fetchHoldings();
  }, [userId]);

  const fetchHoldings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/getorder/${userId}`);
      setHoldings(res.data);
    } catch (error) {
      console.error("Error fetching holdings:", error);
    }
  };



  const filteredStocks = stockData.filter(stock =>
  stock.name.toLowerCase().startsWith(searchTerm.toLowerCase())
);


  const allWatchlistKeys = Object.keys(watchlists || {});
  const currentWatchlistName = selectedWatchlist;
const currentWatchlist = watchlists[selectedWatchlist] || { groups: {} };

  const syncWithServer = async (watchlists) => {
  try {
     await axios.post(`${import.meta.env.VITE_API_URL}/api/watchlist/save`, { userId,watchlists },{
          headers: {
            Authorization: 'application/json',
          },
        });

  } catch (err) {
    console.error('Failed to sync with server:', err.message);
  }
};



  const addStockToGroup = (stock) => {
  setSearchTerm('');
  
  setWatchlists(prev => {
  const prevWatchlist = prev[selectedWatchlist];
  if (!prevWatchlist) return prev;

  const prevGroups = prevWatchlist.groups || {};
  const prevGroupStocks = prevGroups[selectedGroup] || [];

  if (prevGroupStocks.some(s => s.symbol === stock.symbol)) {
    return prev;
  }

  const newGroups = {
    ...prevGroups,
    [selectedGroup]: [...prevGroupStocks, stock],
  };

  const newWatchlist = {
    ...prevWatchlist,
    groups: newGroups,
  };

  const updated = {
    ...prev,
    [selectedWatchlist]: newWatchlist,
  };

  if (userId) syncWithServer(updated);
  console.log('Adding to:', selectedWatchlist, '->', selectedGroup);

  return updated;
});

};



  const removeStockFromGroup = () => {
  if (!stockToDelete) return;

  const { watchlistName, groupName } = stockToDelete;

  setWatchlists(prev => {
    const updated = { ...prev };

    const watchlist = updated[watchlistName];
    if (!watchlist || !watchlist.groups || !watchlist.groups[groupName]) {
      console.warn('Watchlist or group not found');
      return prev;
    }

    watchlist.groups[groupName] = watchlist.groups[groupName].filter(
      s => s.symbol !== stockToDelete.symbol
    );

    // Sync after state update
    setTimeout(() => {
      if (userId) syncWithServer(updated);
    }, 0);

    return updated;
  });

  setShowDeleteModal(false);
  setStockToDelete(null);
};

  const createNewGroup = () => {
  if (!watchlists[selectedWatchlist]) return;

  const groupList = watchlists[selectedWatchlist].groups || {};
  const newGroup = newGroupName.trim() || `Group ${Object.keys(groupList).length + 1}`;

  setWatchlists(prev => {
    const updated = { ...prev };
    updated[selectedWatchlist].groups[newGroup] = [];
    if (userId) syncWithServer(updated);
    return updated;
  });

  setSelectedGroup(newGroup);
  setNewGroupName('');
  setNewWatchlist('');
  setShowGroupInput(false);
};


  const createNewWatchlist = () => {
  const name = newWatchlist.trim() || `Watchlist ${Object.keys(watchlists).length + 1}`;

  setWatchlists(prev => {
    if (prev[name]) return prev;

    const updated = {
      ...prev,
      [name]: { groups: { Default: [] } }
    };

    if (userId) syncWithServer(updated);
    return updated;
  });

  setSelectedWatchlist(name);
  setSelectedGroup('Default');
  setNewGroupName('');
  setNewWatchlist('');
  setShowGroupInput(false);

  // Only update after new list is created
  setTimeout(() => {
    setCurrentPage(Object.keys(watchlists).length + 1);
  }, 100);
};


const handleOrderClick = (stock, action) => {
  
  
  setSelectedChartStock(stock);
  setState(action);
  setShowBuyModal(true); // Open modal after setting everything
};


  const totalPages = allWatchlistKeys.length;

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/watchlist/view`, {
        params: { userId },
      });

      const data = res.data;

      // Defensive check for structure
      if (data?.watchlists?.length) {
  const mapped = {};

  data.watchlists.forEach((wl, index) => {
    const watchlistName = wl.watchlistName || `Watchlist ${index + 1}`;
    const groups = (wl.groups || []).reduce((acc, group) => {
      acc[group.groupName || 'Default'] = group.stocks || [];
      return acc;
    }, {});

    mapped[watchlistName] = { groups };
  });

  setWatchlists(mapped);
} else {
  // Do not overwrite existing local state — keep what's already there
  console.warn('No watchlists returned from backend — keeping local defaults');
}

    } catch (err) {
      console.error('Failed to load watchlists:', err.message);
    }
  };

  if (userId) fetchData();
}, [userId]);


useEffect(() => {
  const allKeys = Object.keys(watchlists || {});
  const selected = allKeys[currentPage - 1];
  if (selected) setSelectedWatchlist(selected);
}, [currentPage, watchlists]);


{isSidebarOpen && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-40 lg:hidden z-30"
    onClick={() => setIsSidebarOpen(false)}
  />
)}

  return (
    
<aside
  className={`fixed lg:static top-[56px] left-0 h-[calc(100vh-56px)] w-[80%] sm:w-[280px]
 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}
>
      {/* Search */}
      <div className="sticky px-4 py-4 top-0 bg-gray-50 z-10 pb-2 border-b">
        <div className="flex items-center border rounded px-2 py-1 mb-3 bg-white">
          <input
            type="text"
            className="flex-grow outline-none bg-transparent text-sm"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="text-gray-500 text-sm" />
        </div>

        

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-600">{currentWatchlistName} ({Object.values(currentWatchlist.groups).flat().length} / 250)</div>
          <button
            className="text-sm text-blue-500 hover:text-orange-500"
            onClick={() => {
              setAddingType('group');
              setShowGroupInput(true);
            }}
          >
            + New group
          </button>
        </div>

        {searchTerm && (
          <ul className="border rounded bg-white max-h-32 overflow-y-auto shadow">
            {filteredStocks.map(stock => (
              <li
                key={stock.symbol}
                className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm flex justify-between items-center"
                onClick={() => addStockToGroup(stock)}
              >
                <span>{stock.name}</span>
                <span className="text-xs text-gray-500">{stock.symbol}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Watchlist Groups */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        
        {Object.keys(watchlists).map((wl) => (
  <div key={wl} className="flex items-center justify-between mb-2 gap-1">
    {editingWatchlist === wl ? (
      <input
        autoFocus
        type="text"
        value={newWatchlistName}
        onChange={(e) => setNewWatchlistName(e.target.value)}
        onBlur={() => {
          const trimmed = newWatchlistName.trim();
          if (trimmed && trimmed !== wl) {
            const updated = { ...watchlists };
            updated[trimmed] = updated[wl];
            delete updated[wl];
            setWatchlists(updated);
            setSelectedWatchlist(trimmed);
            setEditingWatchlist(null);

            if (userId) {
              axios.post(`${import.meta.env.VITE_API_URL}/api/watchlist/rename`, {
                userId,
                oldName: wl,
                newName: trimmed
              });
              syncWithServer(updated);
            }
          } else {
            setEditingWatchlist(null);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.target.blur();
        }}
        className="text-sm border border-gray-300 rounded px-2 py-1 flex-1"
      />
    ) : (
      <div
        onClick={() => setSelectedWatchlist(wl)}
        onDoubleClick={() => {
          setEditingWatchlist(wl);
          setNewWatchlistName(wl);
        }}
        className={`text-sm cursor-pointer flex-1 truncate ${
          selectedWatchlist === wl ? 'font-bold text-blue-600' : 'text-gray-800'
        }`}
        title="Double-click to rename"
      >
        {wl}
      </div>
    )}

    {/* Delete Button */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        const confirmed = window.confirm(`Delete "${wl}"?`);
        if (!confirmed) return;

        const updated = { ...watchlists };
        delete updated[wl];

        const keys = Object.keys(updated);
        const fallback = keys.length ? keys[0] : '';
        setSelectedWatchlist(fallback);
        setWatchlists(updated);

        if (userId) {
          axios.post(`${import.meta.env.VITE_API_URL}/api/watchlist/delete`, {
            userId,
            watchlistName: wl
          });
          syncWithServer(updated);
        }
      }}
      className="text-xs text-red-500 hover:text-red-700 px-2"
      title="Delete Watchlist"
    >
      ✕
    </button>
  </div>
))}


        {Object.entries(currentWatchlist.groups).map(([groupName, stocks]) => (
          <div 
            key={groupName} 
            className={`mb-4 border rounded p-2 bg-white ${
              selectedGroup === groupName ? 'border-gray-300' : ''
            }`}
            onClick={() => setSelectedGroup(groupName)}
          >
            <h4
              className={`text-sm font-semibold cursor-pointer hover:text-orange-600 ${
                selectedGroup === groupName ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {groupName}
              
            </h4>
            <ul className="mt-1">
              {stocks.map((stock) => (
                <li 
                  key={stock.symbol} 
                  className="text-xs py-2 border-b flex justify-between items-center group relative hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className={`font-bold ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stock.name}</div>
                    
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹{stock.price}
                    </div>
                    <div className={`text-[15px] ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.change >= 0 ? '▲' : '▼'} {stock.change}%
                    </div>
                  </div>
                  
                  {/* Hover buttons */}
                  <div className="absolute flex right-0 top-1/2 transform -translate-y-1/2 hidden group-hover:flex bg-white shadow rounded px-1 gap-1">
                    <button
                      onClick={() => handleOrderClick(stock, 'B')}
                      className="p-1 text-green-600 hover:bg-green-100 rounded"
                      title="Buy"
                    >
                      B
                    </button>

                    <button
                      onClick={() => handleOrderClick(stock, 'S')}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                      title="Sell"
                    >
                      S
                    </button>

                    <button
                    className="ml-2 text-blue-500 hover:text-blue-700"
                    title="Chart"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedChartStock(stock);
                        setShowChartModal(true);
                    }}
                    >
                    <FaChartLine size={14} />
                    </button>
                    <button 
                      className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                      title="Depth"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDepth(true);
                      }}
                    >
                      <BsGraphUp size={12} />
                    </button>
                    <button 
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setStockToDelete({
                          ...stock,
                          watchlistName: currentWatchlistName,
                          groupName: groupName,
                        });
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash size={12} />
                    </button>

                  </div>
                </li>
              ))}
              {stocks.length === 0 && (
                <li className="text-xs text-gray-400 py-2 text-center">No stocks in this group</li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t p-3 bg-white">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
          >
            <FaChevronLeft />
          </button>

          <div className="text-xs text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
          >
            <FaChevronRight />
          </button>
        </div>

        {showGroupInput && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={addingType === 'watchlist' ? 'Watchlist Name' : 'Group Name'}
              className="flex-1 border rounded px-2 py-1 text-sm"
              value={addingType === 'watchlist' ? newWatchlist : newGroupName}
              onChange={(e) => {
                addingType === 'watchlist'
                  ? setNewWatchlist(e.target.value)
                  : setNewGroupName(e.target.value);
              }}
            />
            <button
              onClick={addingType === 'watchlist' ? createNewWatchlist : createNewGroup}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowGroupInput(false);
                setNewGroupName('');
                setAddingType('');
              }}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        )}

        {!showGroupInput && (
          <button
            onClick={() => {
              setAddingType('watchlist');
              setShowGroupInput(true);
              setCurrentPage(totalPages + 1);
            }}
            className="w-full flex items-center justify-center gap-2 text-sm bg-orange-600 text-white py-2 rounded hover:bg-blue-600"
          >
            <FaPlus /> Add Watchlist
          </button>
        )}
      </div>

      {/* Depth Modal */}
      {showDepth && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md w-full max-w-3xl shadow-lg relative">
            <button
              onClick={() => setShowDepth(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <MarketDepthTable depth={mockMarketDepth} />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md w-80 shadow-lg relative">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setStockToDelete(null);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">Confirm Removal</h3>
            <p className="mb-4">
              Remove <span className="font-medium">{stockToDelete?.name}</span> from {selectedGroup}?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setStockToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={removeStockFromGroup}
                className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showBuyModal && selectedChartStock&& (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm'>
            
            <OrderModal closeModal={() => {setShowBuyModal(false); fetchHoldings()}} stock={selectedChartStock} st = {state} userHoldings={holdings}  />
          </div>
      )}
      {showChartModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-4 rounded-md w-full max-w-3xl shadow-lg relative">
            <button
                onClick={() => setShowChartModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
                &times;
            </button>
            <StockChart stock={selectedChartStock} />
            </div>
        </div>
      )}
      

    </aside>
    
  );
};

export default Sidebar;