export const defaultCamera = {
  x: 0,
  y: 0,
  zoom: 4,
  viewportWidth: 100,
  viewportHeight: 100,
};

export function clampCamera(camera, world) {
  const maxX = Math.max(0, world.width - camera.viewportWidth / camera.zoom);
  const maxY = Math.max(0, world.height - camera.viewportHeight / camera.zoom);
  return {
    ...camera,
    x: Math.max(0, Math.min(maxX, camera.x)),
    y: Math.max(0, Math.min(maxY, camera.y)),
    zoom: Math.max(0.2, Math.min(30, camera.zoom)),
  };
}
