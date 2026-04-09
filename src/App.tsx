/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { TilesetPanel } from './components/TilesetPanel';
import { LayerPanel } from './components/LayerPanel';
import { MapCanvas } from './components/MapCanvas';
import { StatusBar } from './components/StatusBar';
import { useEditorStore } from './core/store';
import { createDefaultTileset } from './utils/image';

export default function App() {
  const { setTilesetImage } = useEditorStore();

  useEffect(() => {
    // Load a default tileset on startup
    const defaultTilesetSrc = createDefaultTileset();
    setTilesetImage(defaultTilesetSrc, 64, 64, 32, 32);
  }, [setTilesetImage]);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-300 font-sans overflow-hidden">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <TilesetPanel />
        <MapCanvas />
        <LayerPanel />
      </div>
      <StatusBar />
    </div>
  );
}
