import { deviceOrientation, requestDeviceOrientationTracking, startDeviceOrientationTracking } from './device';
import { createGameState, nextGameState } from './game';
import { render } from './render';

const gameWidth = 512;
const gameHeight = 512;

const startScreen = document.getElementById('startScreen')!;
const startButton = document.getElementById('startButton')!;

const gameScreen = document.getElementById('gameScreen')!;
gameScreen.style.display = 'none';

const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

let gameState = createGameState();

startButton.addEventListener('click', async () => {
  try {
    const trackingRequestResult = await requestDeviceOrientationTracking();
    if (trackingRequestResult == true) {
      startScreen.style.display = 'none';
      gameScreen.style.display = 'flex';
      startDeviceOrientationTracking();
      startGame();
    }
  } catch (e) {
    console.log(e);
  }
});

function startGame() {
  const onFrameRequest: FrameRequestCallback = (time) => {
    console.log(time);

    gameState = nextGameState(gameState, deviceOrientation);

    const gameCanvasContext = gameCanvas.getContext('2d')!;
    render(gameCanvasContext, gameState, gameWidth, gameHeight);

    if (gameState.roundWon) {
      gameScreen.style.display = 'none';
      startScreen.style.display = 'flex';
      return;
    }

    window.requestAnimationFrame(onFrameRequest);
  };
  window.requestAnimationFrame(onFrameRequest);
}
