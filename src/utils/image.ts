export function createDefaultTileset(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Grass (0)
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(0, 0, 32, 32);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(4, 4, 8, 8);
  ctx.fillRect(20, 16, 6, 6);

  // Dirt (1)
  ctx.fillStyle = '#a16207';
  ctx.fillRect(32, 0, 32, 32);
  ctx.fillStyle = '#854d0e';
  ctx.fillRect(36, 8, 6, 6);
  ctx.fillRect(50, 20, 8, 4);

  // Water (2)
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(0, 32, 32, 32);
  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(8, 40, 16, 4);
  ctx.fillRect(4, 50, 12, 4);

  // Stone (3)
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(32, 32, 32, 32);
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.arc(48, 48, 10, 0, Math.PI * 2);
  ctx.fill();

  return canvas.toDataURL('image/png');
}
