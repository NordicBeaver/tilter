import { deviceOrientation, requestDeviceOrientationTracking, startDeviceOrientationTracking } from './device';
import { createGameState, GameState, nextGameState } from './game';
import { generateRandomLevel } from './randomLevelGenerator';
import { render } from './render';

const startScreen = document.getElementById('startScreen')!;
const startButton = document.getElementById('startButton')!;

const gameScreen = document.getElementById('gameScreen')!;
gameScreen.style.display = 'none';

const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

const gameWidth = 512;
const gameHeight = 512;

let lastFrameTime: number | null = null;
let gameState: GameState | null = null;

startButton.addEventListener('click', async () => {
  try {
    const trackingRequestResult = await requestDeviceOrientationTracking();
    if (trackingRequestResult == true) {
      startScreen.style.display = 'none';
      gameScreen.style.display = 'flex';
      startDeviceOrientationTracking();
      const level = generateRandomLevel(8, 8);
      gameState = createGameState(level);
      startGame();
    }
  } catch (e) {
    console.log(e);
  }
});

function startGame() {
  window.requestAnimationFrame(onFrameRequest);
}

const onFrameRequest: FrameRequestCallback = (time) => {
  if (gameState == null) {
    window.requestAnimationFrame(onFrameRequest);
    return;
  }
  if (lastFrameTime == null) {
    lastFrameTime = time;
    window.requestAnimationFrame(onFrameRequest);
    return;
  }

  const deltaTime = time - lastFrameTime;
  lastFrameTime = time;

  gameState = nextGameState(gameState, deviceOrientation, deltaTime);

  const gameCanvasContext = gameCanvas.getContext('2d')!;
  render(gameCanvasContext, gameState, gameWidth, gameHeight);

  if (gameState.roundWon) {
    gameScreen.style.display = 'none';
    startScreen.style.display = 'flex';
    return;
  }

  window.requestAnimationFrame(onFrameRequest);
};
