import { DeviceOrientation } from './device';
import { BoxCollider, devectCollision, SphereCollider } from './physics/colliders';
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
  collider: SphereCollider;
}

export interface Wall {
  posX: number;
  posY: number;
  width: number;
  height: number;
  collider: BoxCollider;
}

export function createGameState() {
  const gameState: GameState = {
    playerBall: createBall(),
    walls: [
      createWall(0, 0, gameWidth, 40),
      createWall(gameWidth - 40, 0, 40, gameHeight),
      createWall(0, gameHeight - 40, gameWidth, 40),
      createWall(0, 0, 40, gameHeight),
      createWall(100, 100, 40, 40),
      createWall(200, 300, 40, 40),
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
    collider: {
      type: 'sphere',
      position: {
        x: gameWidth / 2,
        y: gameHeight / 2,
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

  const collision = devectCollision(ball.collider, wall.collider);
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
