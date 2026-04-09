import React, { useRef } from 'react';
import { useEditorStore } from '../core/store';

export function TilesetPanel() {
  const { project, selectedTileId, setSelectedTile, setTilesetImage } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Assume 32x32 tiles for now, could add UI to configure this
        setTilesetImage(img.src, img.width, img.height, 32, 32);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const { tileset } = project;
  const numTiles = tileset.columns > 0 ? tileset.columns * Math.floor(tileset.imageHeight / tileset.tileHeight) : 0;

  return (
    <div className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col text-zinc-300">
      <div className="p-3 border-b border-zinc-800 font-medium text-sm text-white flex justify-between items-center">
        <span>Tileset</span>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageUpload}
        />
        <button 
          className="text-xs bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded"
          onClick={() => fileInputRef.current?.click()}
        >
          Load Image
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-2">
        {tileset.imageSrc ? (
          <div 
            className="relative select-none"
            style={{ 
              width: tileset.imageWidth, 
              height: tileset.imageHeight,
              backgroundImage: `url(${tileset.imageSrc})`,
              backgroundSize: '100% 100%',
              imageRendering: 'pixelated'
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.floor((e.clientX - rect.left) / tileset.tileWidth);
              const y = Math.floor((e.clientY - rect.top) / tileset.tileHeight);
              if (x >= 0 && x < tileset.columns && y >= 0) {
                setSelectedTile(y * tileset.columns + x);
              }
            }}
          >
            {/* Selection Highlight */}
            {selectedTileId >= 0 && (
              <div 
                className="absolute border-2 border-blue-500 pointer-events-none"
                style={{
                  left: (selectedTileId % tileset.columns) * tileset.tileWidth,
                  top: Math.floor(selectedTileId / tileset.columns) * tileset.tileHeight,
                  width: tileset.tileWidth,
                  height: tileset.tileHeight,
                }}
              />
            )}
            
            {/* Grid */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
                backgroundSize: `${tileset.tileWidth}px ${tileset.tileHeight}px`
              }}
            />
          </div>
        ) : (
          <div className="text-center text-zinc-500 text-sm mt-10">
            No tileset loaded.
          </div>
        )}
      </div>
    </div>
  );
}
