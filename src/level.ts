export const levelWidth = 8;
export const levelHeight = 8;

type CellIndexX = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type CellIndexY = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type CellSide = 'top' | 'right' | 'bottom' | 'left';

interface Cell {
  x: CellIndexX;
  y: CellIndexY;
}

export interface Wall {
  cell: Cell;
  side: CellSide;
}

export interface Level {
  walls: Wall[];
  start: Cell;
  finish: Cell;
}

export function createLevel() {
  const level: Level = {
    start: { x: 0, y: 0 },
    finish: { x: 7, y: 7 },
    walls: [
      { cell: { x: 0, y: 0 }, side: 'right' },
      { cell: { x: 0, y: 1 }, side: 'right' },
      { cell: { x: 0, y: 2 }, side: 'bottom' },
      { cell: { x: 1, y: 0 }, side: 'right' },
    ],
  };
  return level;
}
