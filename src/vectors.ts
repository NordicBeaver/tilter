export interface Vector2d {
  x: number;
  y: number;
}

export function addVectors(a: Vector2d, b: Vector2d) {
  const result: Vector2d = {
    x: a.x + b.x,
    y: a.y + b.y,
  };
  return result;
}

export function substractVectors(a: Vector2d, b: Vector2d) {
  const result: Vector2d = {
    x: a.x - b.x,
    y: a.y - b.y,
  };
  return result;
}

export function vectorLength(v: Vector2d) {
  const length = Math.sqrt(v.x * v.x + v.y * v.y);
  return length;
}
