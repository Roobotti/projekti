import { Easing } from 'react-native';

function makeZoomInTranslation(translationType, pivotPoint) {
  const modifier = Math.min(1, Math.max(-1, pivotPoint));
  return {
    easing: Easing.bezier(0.175, 0.885, 0.32, 1),
    0: {
      opacity: 0,
      scale: 0.1,
      [translationType]: modifier * -1000,
    },
    0.6: {
      opacity: 0.5,
      scale: 0.1,
      [translationType]: pivotPoint,
    },
    1: {
      opacity: 1,
      scale: 1,
      [translationType]: 0,
    },
  };
}

export const zoomInUpBig = makeZoomInTranslation('translateY', -500);