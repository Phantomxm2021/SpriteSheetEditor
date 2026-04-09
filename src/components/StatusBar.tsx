import React from 'react';
import { useEditorStore } from '../core/store';

export function StatusBar() {
  const { project, zoom, pan } = useEditorStore();

  return (
    <div className="h-8 border-t border-zinc-800 bg-zinc-950 flex items-center px-4 text-xs text-zinc-500 justify-between">
      <div className="flex gap-4">
        <span>Map Size: {project.width}x{project.height}</span>
        <span>Tile Size: {project.tileSize}px</span>
      </div>
      <div className="flex gap-4">
        <span>Zoom: {Math.round(zoom * 100)}%</span>
        <span>Pan: {Math.round(pan.x)}, {Math.round(pan.y)}</span>
      </div>
    </div>
  );
}
