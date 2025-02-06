"use strict";

import React, { memo, useEffect, useCallback, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { SCROLLABLE_TYPE } from '../../constants';
import { useBottomSheetInternal } from '../../hooks';
import { print } from '../../utilities';
import { jsx as _jsx } from "react/jsx-runtime";
function BottomSheetViewComponent({
  focusHook: useFocusHook = useEffect,
  enableFooterMarginAdjustment = false,
  onLayout,
  style,
  children,
  ...rest
}) {
  const lastLayoutRef = useRef();

  //#region hooks
  const {
    animatedScrollableContentOffsetY,
    animatedScrollableType,
    animatedFooterHeight,
    enableDynamicSizing,
    animatedContentHeight
  } = useBottomSheetInternal();
  //#endregion

  //#region styles
  const flattenStyle = useMemo(() => StyleSheet.flatten(style), [style]);
  const containerStyle = useAnimatedStyle(() => {
    if (!enableFooterMarginAdjustment) {
      return flattenStyle ?? {};
    }
    const marginBottom = typeof flattenStyle?.marginBottom === 'number' ? flattenStyle.marginBottom : 0;
    return {
      ...(flattenStyle ?? {}),
      marginBottom: marginBottom + animatedFooterHeight.value
    };
  }, [flattenStyle, enableFooterMarginAdjustment, animatedFooterHeight]);
  //#endregion

  //#region callbacks
  const handleSettingScrollable = useCallback(() => {
    animatedScrollableContentOffsetY.value = 0;
    animatedScrollableType.value = SCROLLABLE_TYPE.VIEW;
    if (enableDynamicSizing && lastLayoutRef.current) {
      animatedContentHeight.value = lastLayoutRef.current.height;
    }
  }, [animatedScrollableContentOffsetY, animatedScrollableType, animatedContentHeight, enableDynamicSizing]);
  const handleLayout = useCallback(event => {
    if (enableDynamicSizing) {
      lastLayoutRef.current = event.nativeEvent.layout;
      animatedContentHeight.value = event.nativeEvent.layout.height;
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
          height: event.nativeEvent.layout.height
        }
      });
    }
  }, [onLayout, animatedContentHeight, enableDynamicSizing]);
  //#endregion

  // effects
  useFocusHook(handleSettingScrollable);

  //render
  return /*#__PURE__*/_jsx(Animated.View, {
    ...rest,
    onLayout: handleLayout,
    style: containerStyle,
    children: children
  });
}
const BottomSheetView = /*#__PURE__*/memo(BottomSheetViewComponent);
BottomSheetView.displayName = 'BottomSheetView';
export default BottomSheetView;
//# sourceMappingURL=BottomSheetView.js.map