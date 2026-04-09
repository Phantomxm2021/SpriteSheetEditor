export type TileId = number; // -1 for empty

export interface TileLayer {
  id: string;
  name: string;
  visible: boolean;
  tiles: TileId[]; // 1D array: y * width + x
}

export interface Tileset {
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
  tileWidth: number;
  tileHeight: number;
  columns: number;
}

export interface TileMapProject {
  width: number; // in tiles
  height: number; // in tiles
  tileSize: number; // display size
  tileset: Tileset;
  layers: TileLayer[];
}

export type ToolType = 'brush' | 'eraser' | 'hand';
