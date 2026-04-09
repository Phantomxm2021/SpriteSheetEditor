import { TileMapProject } from '../core/types';

export function exportMapAsPNG(project: TileMapProject, tilesetImage: HTMLImageElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = project.width * project.tileSize;
  canvas.height = project.height * project.tileSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Draw layers from bottom to top
  for (let i = project.layers.length - 1; i >= 0; i--) {
    const layer = project.layers[i];
    if (!layer.visible) continue;

    for (let y = 0; y < project.height; y++) {
      for (let x = 0; x < project.width; x++) {
        const tileId = layer.tiles[y * project.width + x];
        if (tileId < 0) continue;

        const sx = (tileId % project.tileset.columns) * project.tileset.tileWidth;
        const sy = Math.floor(tileId / project.tileset.columns) * project.tileset.tileHeight;

        ctx.drawImage(
          tilesetImage,
          sx,
          sy,
          project.tileset.tileWidth,
          project.tileset.tileHeight,
          x * project.tileSize,
          y * project.tileSize,
          project.tileSize,
          project.tileSize
        );
      }
    }
  }

  return canvas.toDataURL('image/png');
}

export function downloadDataURL(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  downloadDataURL(url, filename);
  URL.revokeObjectURL(url);
}
