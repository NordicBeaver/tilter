console.log('Hi');

const myConsole = document.getElementById('console');
const orientationElement = document.getElementById('orientation');

const button = document.getElementById('btn');
button.addEventListener('click', async () => {
  try {
    const permission = await (DeviceOrientationEvent as any).requestPermission();
    myConsole.innerText = permission;
  } catch (e) {
    myConsole.innerText = e;
  }
});

window.addEventListener('deviceorientation', (event) => {
  orientationElement.innerText = `${event.alpha} ${event.beta}, ${event.gamma}`;
});
