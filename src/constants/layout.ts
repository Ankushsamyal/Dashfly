import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const LAYOUT = {
  width,
  height,
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 414,
  isLargeDevice: width >= 414,
};

export const BREAKPOINTS = {
  small: 375,
  medium: 414,
  large: 768,
};

export const TAB_BAR_HEIGHT = 80;
export const HEADER_HEIGHT = 56;
export const FAB_SIZE = 56;
