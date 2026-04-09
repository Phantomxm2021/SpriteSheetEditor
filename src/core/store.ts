import { create } from 'zustand';
import { TileMapProject, TileLayer, ToolType } from './types';

// Default empty project
const createEmptyLayer = (width: number, height: number, name: string): TileLayer => ({
  id: Math.random().toString(36).substr(2, 9),
  name,
  visible: true,
  tiles: Array(width * height).fill(-1),
});

const defaultProject: TileMapProject = {
  width: 20,
  height: 15,
  tileSize: 32,
  tileset: {
    imageSrc: '', // Will be populated
    imageWidth: 0,
    imageHeight: 0,
    tileWidth: 32,
    tileHeight: 32,
    columns: 0,
  },
  layers: [createEmptyLayer(20, 15, 'Layer 1')],
};

interface EditorState {
  project: TileMapProject;
  currentLayerId: string;
  selectedTileId: number;
  currentTool: ToolType;
  zoom: number;
  pan: { x: number; y: number };
  showGrid: boolean;
  isDrawing: boolean;

  // Actions
  setTool: (tool: ToolType) => void;
  setSelectedTile: (id: number) => void;
  setCurrentLayer: (id: string) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  setShowGrid: (show: boolean) => void;
  setIsDrawing: (isDrawing: boolean) => void;

  // Map Actions
  setTile: (x: number, y: number, tileId: number) => void;
  addLayer: (name: string) => void;
  toggleLayerVisibility: (id: string) => void;
  deleteLayer: (id: string) => void;
  reorderLayers: (startIndex: number, endIndex: number) => void;

  // Project Actions
  loadProject: (project: TileMapProject) => void;
  setTilesetImage: (src: string, width: number, height: number, tileWidth: number, tileHeight: number) => void;
  createNewProject: (width: number, height: number, tileSize: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  project: defaultProject,
  currentLayerId: defaultProject.layers[0].id,
  selectedTileId: 0,
  currentTool: 'brush',
  zoom: 1,
  pan: { x: 0, y: 0 },
  showGrid: true,
  isDrawing: false,

  setTool: (tool) => set({ currentTool: tool }),
  setSelectedTile: (id) => set({ selectedTileId: id }),
  setCurrentLayer: (id) => set({ currentLayerId: id }),
  setZoom: (zoom) => set({ zoom }),
  setPan: (pan) => set({ pan }),
  setShowGrid: (showGrid) => set({ showGrid }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),

  setTile: (x, y, tileId) =>
    set((state) => {
      if (x < 0 || x >= state.project.width || y < 0 || y >= state.project.height) return state;
      
      const newLayers = state.project.layers.map((layer) => {
        if (layer.id === state.currentLayerId) {
          const newTiles = [...layer.tiles];
          newTiles[y * state.project.width + x] = tileId;
          return { ...layer, tiles: newTiles };
        }
        return layer;
      });
      return { project: { ...state.project, layers: newLayers } };
    }),

  addLayer: (name) =>
    set((state) => {
      const newLayer = createEmptyLayer(state.project.width, state.project.height, name);
      return {
        project: { ...state.project, layers: [newLayer, ...state.project.layers] },
        currentLayerId: newLayer.id,
      };
    }),

  toggleLayerVisibility: (id) =>
    set((state) => ({
      project: {
        ...state.project,
        layers: state.project.layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)),
      },
    })),

  deleteLayer: (id) =>
    set((state) => {
      if (state.project.layers.length <= 1) return state; // Don't delete last layer
      const newLayers = state.project.layers.filter((l) => l.id !== id);
      return {
        project: { ...state.project, layers: newLayers },
        currentLayerId: state.currentLayerId === id ? newLayers[0].id : state.currentLayerId,
      };
    }),

  reorderLayers: (startIndex, endIndex) =>
    set((state) => {
      const result = Array.from(state.project.layers);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { project: { ...state.project, layers: result } };
    }),

  loadProject: (project) =>
    set({
      project,
      currentLayerId: project.layers[0]?.id || '',
      pan: { x: 0, y: 0 },
      zoom: 1,
    }),

  setTilesetImage: (src, width, height, tileWidth, tileHeight) =>
    set((state) => ({
      project: {
        ...state.project,
        tileset: {
          imageSrc: src,
          imageWidth: width,
          imageHeight: height,
          tileWidth,
          tileHeight,
          columns: Math.floor(width / tileWidth),
        },
      },
    })),

  createNewProject: (width, height, tileSize) =>
    set((state) => {
      const newLayer = createEmptyLayer(width, height, 'Layer 1');
      return {
        project: {
          ...state.project,
          width,
          height,
          tileSize,
          layers: [newLayer],
        },
        currentLayerId: newLayer.id,
        pan: { x: 0, y: 0 },
        zoom: 1,
      };
    }),
}));
