import React, { useRef, useState } from 'react';
import { useEditorStore } from '../core/store';
import { Download, Upload, Image as ImageIcon, FileJson, Plus, Grid, MousePointer2, Eraser, Move } from 'lucide-react';
import { exportMapAsPNG, downloadDataURL, downloadJSON } from '../utils/export';

export function Toolbar() {
  const { project, currentTool, setTool, showGrid, setShowGrid, loadProject } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showNewModal, setShowNewModal] = useState(false);
  const [newWidth, setNewWidth] = useState(20);
  const [newHeight, setNewHeight] = useState(15);
  const [newTileSize, setNewTileSize] = useState(32);

  const handleExportPNG = () => {
    const img = new Image();
    img.onload = () => {
      const dataUrl = exportMapAsPNG(project, img);
      downloadDataURL(dataUrl, 'map.png');
    };
    img.src = project.tileset.imageSrc;
  };

  const handleExportJSON = () => {
    downloadJSON(project, 'map.json');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        loadProject(data);
      } catch (err) {
        console.error('Failed to parse JSON', err);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreateNew = () => {
    useEditorStore.getState().createNewProject(newWidth, newHeight, newTileSize);
    setShowNewModal(false);
  };

  return (
    <>
      <div className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center px-4 justify-between text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-white mr-4">TileMap Editor</div>
          
          <div className="flex bg-zinc-900 rounded-md p-1 border border-zinc-800">
            <button
              className={`p-1.5 rounded ${currentTool === 'brush' ? 'bg-zinc-700 text-white' : 'hover:bg-zinc-800'}`}
              onClick={() => setTool('brush')}
              title="Brush (B)"
            >
              <MousePointer2 size={18} />
            </button>
            <button
              className={`p-1.5 rounded ${currentTool === 'eraser' ? 'bg-zinc-700 text-white' : 'hover:bg-zinc-800'}`}
              onClick={() => setTool('eraser')}
              title="Eraser (E)"
            >
              <Eraser size={18} />
            </button>
            <button
              className={`p-1.5 rounded ${currentTool === 'hand' ? 'bg-zinc-700 text-white' : 'hover:bg-zinc-800'}`}
              onClick={() => setTool('hand')}
              title="Pan (H)"
            >
              <Move size={18} />
            </button>
          </div>

          <div className="w-px h-6 bg-zinc-800 mx-2"></div>

          <button
            className={`p-1.5 rounded border ${showGrid ? 'bg-zinc-800 border-zinc-700 text-white' : 'border-transparent hover:bg-zinc-800'}`}
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Grid (G)"
          >
            <Grid size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-zinc-800"
            onClick={() => setShowNewModal(true)}
          >
            <Plus size={16} /> New
          </button>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImportJSON}
          />
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-zinc-800"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} /> Import
          </button>
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-zinc-800"
            onClick={handleExportJSON}
          >
            <FileJson size={16} /> JSON
          </button>
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white font-medium"
            onClick={handleExportPNG}
          >
            <ImageIcon size={16} /> Export PNG
          </button>
        </div>
      </div>

      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 w-80 text-zinc-200 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-4">Create New Map</h2>
            <p className="text-xs text-red-400 mb-4">Warning: Unsaved changes will be lost.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-zinc-400">Map Width (tiles)</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={newWidth}
                  onChange={(e) => setNewWidth(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-zinc-400">Map Height (tiles)</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={newHeight}
                  onChange={(e) => setNewHeight(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-zinc-400">Tile Size (px)</label>
                <input
                  type="number"
                  min="8"
                  max="256"
                  value={newTileSize}
                  onChange={(e) => setNewTileSize(Math.max(8, Number(e.target.value)))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 text-sm rounded hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
              >
                Create Map
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
