import { DeviceOrientation } from './device';

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
    walls: [createWall(20, 20), createWall(120, 120)],
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

function createWall(posX: number, posY: number) {
  const wall: Wall = {
    posX: posX,
    posY: posY,
    width: 40,
    height: 40,
  };
  return wall;
}

export function nextGameState(gameState: GameState, deviceOrientation: DeviceOrientation) {
  const nGameState: GameState = {
    playerBall: nextBall(gameState.playerBall, deviceOrientation),
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
