import { Level } from './level';
import { isEqual, shuffle } from 'lodash';

export function generateRandomLevel(rows: number, columns: number) {
  const cells: boolean[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: boolean[] = [];
    for (let j = 0; j < columns; j++) {
      row.push(false);
    }
    cells.push(row);
  }

  const paths = generateRandomLevelIteration(cells, [], [0, 0]);

  const level: Level = {
    start: { x: 0, y: 0 },
    finish: { x: 7, y: 7 },
    walls: [],
  };
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (!isConnected(paths, [i, j], [i + 1, j])) {
        level.walls.push({ cell: { x: j, y: i }, side: 'bottom' });
      }
      if (!isConnected(paths, [i, j], [i, j + 1])) {
        level.walls.push({ cell: { x: j, y: i }, side: 'right' });
      }
    }
  }

  return level;
}

export function generateRandomLevelIteration(
  cells: boolean[][],
  paths: [[number, number], [number, number]][],
  current: [number, number]
): [[number, number], [number, number]][] {
  cells[current[0]][current[1]] = true;

  const possibleDirections: [number, number][] = shuffle([
    [current[0], current[1] - 1],
    [current[0] + 1, current[1]],
    [current[0], current[1] + 1],
    [current[0] - 1, current[1]],
  ]);

  for (const direction of possibleDirections) {
    if (cells[direction[0]] !== undefined && cells[direction[0]][direction[1]] === false) {
      paths.push([current, direction]);
      generateRandomLevelIteration(cells, paths, direction);
    }
  }

  return paths;
}

function isConnected(paths: [[number, number], [number, number]][], cell1: [number, number], cell2: [number, number]) {
  if (paths.some((path) => isEqual(path, [cell1, cell2]))) {
    return true;
  }
  if (paths.some((path) => isEqual(path, [cell2, cell1]))) {
    return true;
  }
  return false;
}
