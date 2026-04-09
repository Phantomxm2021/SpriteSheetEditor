import React, { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '../core/store';

export function MapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    project, currentLayerId, selectedTileId, currentTool, 
    zoom, pan, showGrid, setTile, setPan, setZoom,
    isDrawing, setIsDrawing
  } = useEditorStore();

  const [tilesetImage, setTilesetImage] = useState<HTMLImageElement | null>(null);

  // Load tileset image
  useEffect(() => {
    if (project.tileset.imageSrc) {
      const img = new Image();
      img.onload = () => setTilesetImage(img);
      img.src = project.tileset.imageSrc;
    } else {
      setTilesetImage(null);
    }
  }, [project.tileset.imageSrc]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw layers
    for (let i = project.layers.length - 1; i >= 0; i--) {
      const layer = project.layers[i];
      if (!layer.visible) continue;

      // Dim inactive layers slightly for better visibility of current layer
      ctx.globalAlpha = (layer.id === currentLayerId) ? 1.0 : 0.7;

      for (let y = 0; y < project.height; y++) {
        for (let x = 0; x < project.width; x++) {
          const tileId = layer.tiles[y * project.width + x];
          if (tileId < 0) continue;

          if (tilesetImage) {
            const sx = (tileId % project.tileset.columns) * project.tileset.tileWidth;
            const sy = Math.floor(tileId / project.tileset.columns) * project.tileset.tileHeight;

            ctx.drawImage(
              tilesetImage,
              sx, sy, project.tileset.tileWidth, project.tileset.tileHeight,
              x * project.tileSize, y * project.tileSize, project.tileSize, project.tileSize
            );
          } else {
            // Fallback if no image
            ctx.fillStyle = `hsl(${(tileId * 40) % 360}, 70%, 50%)`;
            ctx.fillRect(x * project.tileSize, y * project.tileSize, project.tileSize, project.tileSize);
          }
        }
      }
    }
    ctx.globalAlpha = 1.0;

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1 / zoom; // Keep grid line thin regardless of zoom
      ctx.beginPath();
      for (let x = 0; x <= project.width; x++) {
        ctx.moveTo(x * project.tileSize, 0);
        ctx.lineTo(x * project.tileSize, project.height * project.tileSize);
      }
      for (let y = 0; y <= project.height; y++) {
        ctx.moveTo(0, y * project.tileSize);
        ctx.lineTo(project.width * project.tileSize, y * project.tileSize);
      }
      ctx.stroke();
    }
  }, [project, currentLayerId, showGrid, tilesetImage, zoom]);

  // Interaction handlers
  const getMouseCoords = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // Adjust for pan and zoom
    const x = (clientX - rect.left - pan.x) / zoom;
    const y = (clientY - rect.top - pan.y) / zoom;
    
    return {
      tileX: Math.floor(x / project.tileSize),
      tileY: Math.floor(y / project.tileSize)
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (currentTool === 'hand' || (e as React.MouseEvent).button === 1) { // Middle click or hand tool
      setIsDrawing(true);
      return;
    }

    if ((e as React.MouseEvent).button === 0) { // Left click
      setIsDrawing(true);
      applyTool(e);
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    if (currentTool === 'hand' || (e as React.MouseEvent).buttons === 4) {
      // Panning
      const dx = 'movementX' in e ? (e as React.MouseEvent).movementX : 0;
      const dy = 'movementY' in e ? (e as React.MouseEvent).movementY : 0;
      setPan({ x: pan.x + dx, y: pan.y + dy });
      return;
    }

    applyTool(e);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
  };

  const applyTool = (e: React.MouseEvent | React.TouchEvent) => {
    const { tileX, tileY } = getMouseCoords(e);
    
    if (currentTool === 'brush') {
      setTile(tileX, tileY, selectedTileId);
    } else if (currentTool === 'eraser') {
      setTile(tileX, tileY, -1);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, zoom * zoomFactor));
      
      // Zoom towards mouse pointer
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
        const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom);
        
        setZoom(newZoom);
        setPan({ x: newPanX, y: newPanY });
      }
    } else {
      // Pan
      setPan({ x: pan.x - e.deltaX, y: pan.y - e.deltaY });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 bg-zinc-900 overflow-hidden relative"
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      onWheel={handleWheel}
      style={{ cursor: currentTool === 'hand' ? (isDrawing ? 'grabbing' : 'grab') : 'crosshair' }}
    >
      <div 
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          width: project.width * project.tileSize,
          height: project.height * project.tileSize,
          position: 'absolute',
          left: 0,
          top: 0,
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
          backgroundColor: '#18181b' // zinc-950
        }}
      >
        <canvas
          ref={canvasRef}
          width={project.width * project.tileSize}
          height={project.height * project.tileSize}
          style={{ display: 'block', imageRendering: 'pixelated' }}
        />
      </div>
    </div>
  );
}
