import { Ball, GameState } from './game';

export function render(context: CanvasRenderingContext2D, gameState: GameState, width: number, height: number) {
  context.clearRect(0, 0, width, height);
  drawBall(context, gameState.playerBall);
}

function drawBall(context: CanvasRenderingContext2D, ball: Ball) {
  context.beginPath();
  context.arc(ball.posX, ball.posY, ball.radius, 0, Math.PI * 2);
  context.fill();
}
