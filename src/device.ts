export interface DeviceOrientation {
  alpha: number;
  beta: number;
  gamma: number;
}

export const deviceOrientation: DeviceOrientation = {
  alpha: 0,
  beta: 0,
  gamma: 0,
};

export async function requestDeviceOrientationTracking() {
  const requestPermission = (DeviceOrientationEvent as any).requestPermission as () => Promise<string> | undefined;
  if (requestPermission !== undefined) {
    const permission = await (DeviceOrientationEvent as any).requestPermission();
    if (permission === 'denied') {
      return false;
    }
  }
  return true;
}

export function startDeviceOrientationTracking() {
  window.addEventListener('deviceorientation', (event) => {
    if (event.alpha != null && event.beta != null && event.gamma != null) {
      deviceOrientation.alpha = event.alpha;
      deviceOrientation.beta = event.beta;
      deviceOrientation.gamma = event.gamma;
    }
  });
}
