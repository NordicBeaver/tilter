import { DeviceOrientation } from './device';
import * as Level from './level';
import { BoxCollider, detectCollision, SphereCollider } from './physics/colliders';
import { Vector2d } from './vectors';

const gameWidth = 512;
const gameHeight = 512;
const levelCellWidth = gameWidth / Level.levelWidth;
const levelCellHeight = gameHeight / Level.levelWidth;

const gravityAcceleration = 1;

const wallThickness = 8;

export interface GameState {
  playerBall: Ball;
  walls: Wall[];
  goal: Goal;
  roundWon: boolean;
}

export interface Ball {
  radius: number;
  posX: number;
  posY: number;
  speedX: number;
  speedY: number;
  collider: SphereCollider;
}

export interface Wall {
  posX: number;
  posY: number;
  width: number;
  height: number;
  collider: BoxCollider;
}

export interface Goal {
  position: Vector2d;
  radius: number;
  collider: SphereCollider;
}

export function createGameState(level: Level.Level) {
  const gameState: GameState = {
    playerBall: createBall((level.start.x + 0.5) * levelCellWidth, (level.start.y + 0.5) * levelCellHeight),
    walls: [
      createWall(0, 0, gameWidth, wallThickness),
      createWall(gameWidth - wallThickness, 0, wallThickness, gameHeight),
      createWall(0, gameHeight - wallThickness, gameWidth, wallThickness),
      createWall(0, 0, wallThickness, gameHeight),
      ...level.walls.map((wall) => createWallFromLevelData(wall)),
    ],
    goal: createGoal(400, 400),
    roundWon: false,
  };
  return gameState;
}

function createBall(posX: number, posY: number) {
  const ball: Ball = {
    radius: 20,
    posX: posX,
    posY: posY,
    speedX: 0,
    speedY: 0,
    collider: {
      type: 'sphere',
      position: {
        x: posX,
        y: posY,
      },
      radius: 20,
    },
  };
  return ball;
}

function createWall(posX: number, posY: number, width: number = 40, height: number = 40) {
  const wall: Wall = {
    posX: posX,
    posY: posY,
    width: width,
    height: height,
    collider: {
      type: 'box',
      position: {
        x: posX,
        y: posY,
      },
      width: width,
      height: height,
    },
  };
  return wall;
}

function createWallFromLevelData(wallData: Level.Wall) {
  const posX = wallData.cell.x * levelCellWidth + (wallData.side === 'right' ? levelCellWidth : 0) - wallThickness / 2;
  const posY =
    wallData.cell.y * levelCellHeight + (wallData.side === 'bottom' ? levelCellHeight : 0) - wallThickness / 2;
  const width = wallData.side === 'top' || wallData.side === 'bottom' ? levelCellWidth + wallThickness : wallThickness;
  const height =
    wallData.side === 'left' || wallData.side === 'right' ? levelCellHeight + wallThickness : wallThickness;
  const wall = createWall(posX, posY, width, height);
  return wall;
}

function createGoal(posx: number, posY: number) {
  const goal: Goal = {
    position: {
      x: posY,
      y: posY,
    },
    radius: 10,
    collider: {
      type: 'sphere',
      position: {
        x: posY,
        y: posY,
      },
      radius: 10,
    },
  };
  return goal;
}

export function nextGameState(gameState: GameState, deviceOrientation: DeviceOrientation) {
  let nBall = nextBall(gameState.playerBall, deviceOrientation);
  for (const wall of gameState.walls) {
    nBall = processWallCollisions(nBall, wall);
  }

  const roundWon = detectCollision(gameState.playerBall.collider, gameState.goal.collider) != null;

  const nGameState: GameState = {
    ...gameState,
    playerBall: nBall,
    roundWon: roundWon,
  };
  return nGameState;
}

function nextBall(ball: Ball, deviceOrientation: DeviceOrientation) {
  const accX = gravityAcceleration * Math.tan((deviceOrientation.gamma / 180) * Math.PI);
  const accY = gravityAcceleration * Math.tan((deviceOrientation.beta / 180) * Math.PI);

  const nextSpeedX = ball.speedX + accX;
  const nextSpeedY = ball.speedY + accY;
  const nextPosX = nextBallPos(ball.posX, ball.speedX, ball.radius, 0, gameWidth);
  const nextPosY = nextBallPos(ball.posY, ball.speedY, ball.radius, 0, gameHeight);

  const nBall: Ball = {
    radius: ball.radius,
    posX: nextPosX,
    posY: nextPosY,
    speedX: nextSpeedX,
    speedY: nextSpeedY,
    collider: {
      type: 'sphere',
      position: {
        x: nextPosX,
        y: nextPosY,
      },
      radius: ball.collider.radius,
    },
  };

  return nBall;
}

function nextBallPos(currentPos: number, speed: number, radius: number, lowerBound: number, upperBound: number) {
  let newPos = currentPos + speed;
  if (currentPos - radius < lowerBound) {
    newPos = radius;
  }
  if (newPos + radius > upperBound) {
    newPos = upperBound - radius;
  }
  return newPos;
}

function processWallCollisions(ball: Ball, wall: Wall) {
  let newPosX = ball.posX;
  let newPosY = ball.posY;
  let newSpeedX = ball.speedX;
  let newSpeedY = ball.speedY;

  const collision = detectCollision(ball.collider, wall.collider);
  if (collision != null) {
    if (collision.x !== 0) {
      newPosX = newPosX - collision.x;
      if ((newSpeedX > 0 && collision.x > 0) || (newSpeedX < 0 && collision.x < 0)) {
        newSpeedX = 0;
      }
    }
    if (collision.y !== 0) {
      newPosY = newPosY - collision.y;
      if ((newSpeedY > 0 && collision.y > 0) || (newSpeedY < 0 && collision.y < 0)) {
        newSpeedY = 0;
      }
    }
  }

  const nBall: Ball = {
    radius: ball.radius,
    posX: newPosX,
    posY: newPosY,
    speedX: newSpeedX,
    speedY: newSpeedY,
    collider: {
      type: 'sphere',
      position: {
        x: newPosX,
        y: newPosY,
      },
      radius: ball.collider.radius,
    },
  };

  return nBall;
}
