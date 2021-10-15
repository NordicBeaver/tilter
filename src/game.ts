import { DeviceOrientation } from './device';
import { isBetween } from './util';

const gameWidth = 512;
const gameHeight = 512;

export interface GameState {
  playerBall: Ball;
  walls: Wall[];
}

export interface Ball {
  radius: number;
  posX: number;
  posY: number;
  speedX: number;
  speedY: number;
}

export interface Wall {
  posX: number;
  posY: number;
  width: number;
  height: number;
}

export function createGameState() {
  const gameState: GameState = {
    playerBall: createBall(),
    walls: [
      createWall(0, 0, gameWidth, 40),
      createWall(gameWidth - 40, 0, 40, gameHeight),
      createWall(0, gameHeight - 40, gameWidth, 40),
      createWall(0, 0, 40, gameHeight),
    ],
  };
  return gameState;
}

function createBall() {
  const ball: Ball = {
    radius: 20,
    posX: gameWidth / 2,
    posY: gameHeight / 2,
    speedX: 0,
    speedY: 0,
  };
  return ball;
}

function createWall(posX: number, posY: number, width: number = 40, height: number = 40) {
  const wall: Wall = {
    posX: posX,
    posY: posY,
    width: width,
    height: height,
  };
  return wall;
}

export function nextGameState(gameState: GameState, deviceOrientation: DeviceOrientation) {
  let nBall = nextBall(gameState.playerBall, deviceOrientation);
  for (const wall of gameState.walls) {
    nBall = processWallCollisions(nBall, wall);
  }
  const nGameState: GameState = {
    playerBall: nBall,
    walls: gameState.walls,
  };
  return nGameState;
}

function nextBall(ball: Ball, deviceOrientation: DeviceOrientation) {
  const accX = deviceOrientation.gamma / 100;
  const accY = deviceOrientation.beta / 100;

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

  if (isBetween(ball.posX, wall.posX, wall.posX + wall.width)) {
    if (isBetween(ball.posY + ball.radius, wall.posY, wall.posY + wall.height)) {
      // Ball hit wall's top side.
      newPosY = wall.posY - ball.radius;
      newSpeedY = 0;
    }
    if (isBetween(ball.posY - ball.radius, wall.posY, wall.posY + wall.height)) {
      // Ball hit wall's bottom side.
      newPosY = wall.posY + wall.height + ball.radius;
      newSpeedY = 0;
    }
  }

  if (isBetween(ball.posY, wall.posY, wall.posY + wall.height)) {
    if (isBetween(ball.posX + ball.radius, wall.posX, wall.posX + wall.width)) {
      // Ball hit wall's left side.
      newPosX = wall.posX - ball.radius;
      newSpeedX = 0;
    }
    if (isBetween(ball.posX - ball.radius, wall.posX, wall.posX + wall.width)) {
      // Ball hit wall's right side.
      newPosX = wall.posX + wall.width + ball.radius;
      newSpeedX = 0;
    }
  }

  const nBall: Ball = {
    radius: ball.radius,
    posX: newPosX,
    posY: newPosY,
    speedX: newSpeedX,
    speedY: newSpeedY,
  };

  return nBall;
}
