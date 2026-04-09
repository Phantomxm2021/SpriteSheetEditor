import React, { useState } from 'react';
import { useEditorStore } from '../core/store';
import { Eye, EyeOff, Plus, Trash2, GripVertical } from 'lucide-react';

export function LayerPanel() {
  const { project, currentLayerId, setCurrentLayer, addLayer, toggleLayerVisibility, deleteLayer } = useEditorStore();
  const [newLayerName, setNewLayerName] = useState('');

  const handleAddLayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLayerName.trim()) {
      addLayer(newLayerName.trim());
      setNewLayerName('');
    }
  };

  return (
    <div className="w-64 border-l border-zinc-800 bg-zinc-950 flex flex-col text-zinc-300">
      <div className="p-3 border-b border-zinc-800 font-medium text-sm text-white flex justify-between items-center">
        <span>Layers</span>
      </div>
      
      <div className="flex-1 overflow-auto p-2">
        <div className="flex flex-col gap-1">
          {project.layers.map((layer) => (
            <div 
              key={layer.id}
              className={`group flex items-center p-2 rounded cursor-pointer ${currentLayerId === layer.id ? 'bg-blue-900/30 border border-blue-800/50 text-white' : 'hover:bg-zinc-900 border border-transparent'}`}
              onClick={() => setCurrentLayer(layer.id)}
            >
              <button 
                className="text-zinc-500 hover:text-zinc-300 mr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLayerVisibility(layer.id);
                }}
              >
                {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <span className="flex-1 truncate text-sm">{layer.name}</span>
              <button 
                className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteLayer(layer.id);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-zinc-800">
        <form onSubmit={handleAddLayer} className="flex gap-2">
          <input
            type="text"
            value={newLayerName}
            onChange={(e) => setNewLayerName(e.target.value)}
            placeholder="New layer name..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm text-white outline-none focus:border-blue-500"
          />
          <button 
            type="submit"
            disabled={!newLayerName.trim()}
            className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 p-1.5 rounded text-white"
          >
            <Plus size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
