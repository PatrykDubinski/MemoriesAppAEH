import { Dimensions, ScaledSize, Platform } from 'react-native';
import { useEffect, useState } from 'react';

interface ScreenDimensions extends ScaledSize {
  isLandscape: boolean;
  isPortrait: boolean;
  isTablet: boolean;
}

const TABLET_MIN_WIDTH = 600;

export const useScreenDimensions = (): ScreenDimensions => {
  const [screenData, setScreenData] = useState(Dimensions.get('screen'));

  useEffect(() => {
    const onChange = (result: { window: ScaledSize; screen: ScaledSize }) => {
      setScreenData(result.screen);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription.remove();
  }, []);

  const isLandscape = screenData.width > screenData.height;
  const isPortrait = !isLandscape;
  const isTablet = screenData.width >= TABLET_MIN_WIDTH || screenData.height >= TABLET_MIN_WIDTH;


  return {
    ...screenData,
    isLandscape,
    isPortrait,
    isTablet,
  };
};

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

const guidelineBaseWidth = 375;
export const scaleFont = (size: number) => {
    const { width } = Dimensions.get('window');
    return size * (width / guidelineBaseWidth);
}