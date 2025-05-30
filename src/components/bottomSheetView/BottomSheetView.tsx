import React, { memo, useEffect, useCallback, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../../constants';
import {
  useBottomSheetContentContainerStyle,
  useBottomSheetInternal,
} from '../../hooks';
import { print } from '../../utilities';
import type { BottomSheetViewProps } from './types';

function BottomSheetViewComponent({
  focusHook: useFocusHook = useEffect,
  enableFooterMarginAdjustment = false,
  onLayout,
  style,
  children,
  ...rest
}: BottomSheetViewProps) {
  const lastLayoutRef = useRef<LayoutChangeEvent['nativeEvent']['layout']>();

  //#region hooks
  const {
    animatedScrollableContentOffsetY,
    animatedScrollableType,
    enableDynamicSizing,
    animatedContentHeight,
  } = useBottomSheetInternal();
  //#endregion

  //#region styles
  const containerStyle = useBottomSheetContentContainerStyle(
    enableFooterMarginAdjustment,
    style
  );
  //#endregion

  //#region callbacks
  const handleSettingScrollable = useCallback(() => {
    animatedScrollableContentOffsetY.value = 0;
    animatedScrollableType.value = SCROLLABLE_TYPE.VIEW;
    if (enableDynamicSizing && lastLayoutRef.current) {
      animatedContentHeight.value = lastLayoutRef.current.height;
    }
  }, [
    animatedScrollableContentOffsetY,
    animatedScrollableType,
    animatedContentHeight,
    enableDynamicSizing,
  ]);
  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (enableDynamicSizing) {
        lastLayoutRef.current = event.nativeEvent.layout;
        animatedContentHeight.set(event.nativeEvent.layout.height);
      }

      if (onLayout) {
        onLayout(event);
      }

      if (__DEV__) {
        print({
          component: BottomSheetView.displayName,
          method: 'handleLayout',
          category: 'layout',
          params: {
            height: event.nativeEvent.layout.height,
          },
        });
      }
    },
    [onLayout, animatedContentHeight, enableDynamicSizing]
  );
  //#endregion

  //#region effects
  useFocusHook(handleSettingScrollable);
  //#endregion

  //render
  return (
    <Animated.View {...rest} onLayout={handleLayout} style={containerStyle}>
      {children}
    </Animated.View>
  );
}

const BottomSheetView = memo(BottomSheetViewComponent);
BottomSheetView.displayName = 'BottomSheetView';

export default BottomSheetView;
