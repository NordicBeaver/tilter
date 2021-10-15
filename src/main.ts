const gameWidth = 512;
const gameHeight = 512;

const startScreen = document.getElementById('startScreen')!;
const startButton = document.getElementById('startButton')!;

const gameScreen = document.getElementById('gameScreen')!;
gameScreen.style.display = 'none';

const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

const deviceOrientation = {
  alpha: 0,
  beta: 0,
  gamma: 0,
};

startButton.addEventListener('click', async () => {
  try {
    const requestPermission = (DeviceOrientationEvent as any).requestPermission as () => Promise<string> | undefined;
    if (requestPermission !== undefined) {
      const permission = await (DeviceOrientationEvent as any).requestPermission();
      if (permission === 'denied') {
        return;
      }
    }
    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
  } catch (e) {
    console.log(e);
  }
});

window.addEventListener('deviceorientation', (event) => {
  if (event.alpha != null && event.beta != null && event.gamma != null) {
    deviceOrientation.alpha = event.alpha;
    deviceOrientation.beta = event.beta;
    deviceOrientation.gamma = event.gamma;
  }
});

const onFrameRequest: FrameRequestCallback = (time) => {
  console.log(time);

  const gameCanvasContext = gameCanvas.getContext('2d')!;

  const circleSize = 20;
  const circeX = gameWidth / 2 + deviceOrientation.gamma * 10;
  const circeY = gameWidth / 2 + deviceOrientation.beta * 10;

  gameCanvasContext.clearRect(0, 0, gameWidth, gameHeight);
  gameCanvasContext.beginPath();
  gameCanvasContext.arc(circeX, circeY, circleSize, 0, Math.PI * 2);
  gameCanvasContext.fill();

  window.requestAnimationFrame(onFrameRequest);
};
window.requestAnimationFrame(onFrameRequest);
