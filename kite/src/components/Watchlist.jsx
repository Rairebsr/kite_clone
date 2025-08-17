import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';

const Watchlist = () => {
  const [watchlists, setWatchlists] = useState([
    { name: 'Watchlist 1', stocks: [], isDefault: true },
  ]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');

  const handleAddGroup = () => {
    const newGroup = {
      name: `Watchlist ${watchlists.length + 1}`,
      stocks: [],
      isDefault: false,
    };
    setWatchlists([...watchlists, newGroup]);
  };

  const handleRename = (index, newName) => {
    const updated = [...watchlists];
    updated[index].name = newName;
    setWatchlists(updated);
    setEditingIndex(null);
  };

  const handleDeleteGroup = (index) => {
    if (watchlists[index].isDefault) return;
    const updated = watchlists.filter((_, i) => i !== index);
    setWatchlists(updated);
  };

  const handleAddStock = (index) => {
    const stockName = prompt('Enter stock name:');
    if (!stockName) return;
    const updated = [...watchlists];
    updated[index].stocks.push(stockName);
    setWatchlists(updated);
  };

  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };

  const handleDrop = (index) => {
    if (draggingIndex === null || draggingIndex === index) return;

    const updated = [...watchlists];
    const draggedItem = updated[draggingIndex];
    updated.splice(draggingIndex, 1);
    updated.splice(index, 0, draggedItem);

    setWatchlists(updated);
    setDraggingIndex(null);
  };

  return (
    <div className="p-4 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Watchlists</h2>
        <button
          onClick={handleAddGroup}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <FaPlus className="inline mr-1" /> Add Group
        </button>
      </div>

      <div className="space-y-4">
        {watchlists.map((group, index) => (
          <div
            key={index}
            className="p-4 border rounded shadow bg-white cursor-move"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
          >
            <div className="flex justify-between items-center">
              {editingIndex === index ? (
                <input
                  autoFocus
                  className="text-lg font-semibold border px-2 py-1 rounded w-1/2"
                  value={group.name}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onBlur={() => handleRename(index, newGroupName)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename(index, newGroupName);
                  }}
                />
              ) : (
                <h3
                  className="text-lg font-semibold text-gray-700 hover:text-blue-600 cursor-pointer"
                  onDoubleClick={() => {
                    setEditingIndex(index);
                    setNewGroupName(group.name);
                  }}
                >
                  {group.name}
                </h3>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAddStock(index)}
                  className="text-sm text-green-600 hover:text-green-800"
                >
                  Add Stock
                </button>
                {!group.isDefault && (
                  <button
                    onClick={() => handleDeleteGroup(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>

            <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
              {group.stocks.map((stock, i) => (
                <li key={i}>{stock}</li>
              ))}
              {group.stocks.length === 0 && (
                <li className="italic text-gray-400">No stocks added.</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;