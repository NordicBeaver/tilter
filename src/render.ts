import { Ball, GameState, Wall } from './game';

export function render(context: CanvasRenderingContext2D, gameState: GameState, width: number, height: number) {
  context.clearRect(0, 0, width, height);
  drawBall(context, gameState.playerBall);
  for (const wall of gameState.walls) {
    drawWall(context, wall);
  }
}

function drawBall(context: CanvasRenderingContext2D, ball: Ball) {
  context.save();
  context.beginPath();
  context.arc(ball.posX, ball.posY, ball.radius, 0, Math.PI * 2);
  context.fillStyle = '#008a0e';
  context.fill();
  context.restore();
}

function drawWall(context: CanvasRenderingContext2D, wall: Wall) {
  context.save();
  context.beginPath();
  context.rect(wall.posX, wall.posY, wall.width, wall.height);
  context.fillStyle = '#382117';
  context.fill();
  context.restore();
}
