import type React from 'react';
import type { MutableRefObject } from 'react';
import { useCallback, useEffect } from 'react';
import { findNodeHandle } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { SCROLLABLE_TYPE } from '../constants';
import type { Scrollable } from '../types';
import { useBottomSheetInternal } from './useBottomSheetInternal';

export const useScrollableSetter = (
  ref: React.RefObject<Scrollable>,
  type: SCROLLABLE_TYPE,
  contentOffsetY: Animated.SharedValue<number>,
  lastContentHeightRef: MutableRefObject<number | undefined>,
  refreshable: boolean,
  useFocusHook = useEffect
) => {
  // hooks
  const {
    animatedScrollableType,
    animatedScrollableContentOffsetY: rootScrollableContentOffsetY,
    animatedContentHeight,
    isContentHeightFixed,
    isScrollableRefreshable,
    setScrollableRef,
    removeScrollableRef,
  } = useBottomSheetInternal();

  // callbacks
  const handleSettingScrollable = useCallback(() => {
    // set current content offset
    rootScrollableContentOffsetY.value = contentOffsetY.value;
    animatedScrollableType.value = type;
    isScrollableRefreshable.value = refreshable;
    isContentHeightFixed.value = false;

    if (lastContentHeightRef.current !== undefined) {
      animatedContentHeight.value = lastContentHeightRef.current;
    }

    // set current scrollable ref
    const id = findNodeHandle(ref.current);
    if (id) {
      setScrollableRef({
        id: id,
        node: ref,
      });
    } else {
      console.warn(`Couldn't find the scrollable node handle id!`);
    }

    return () => {
      removeScrollableRef(ref);
    };
  }, [
    ref,
    type,
    refreshable,
    animatedScrollableType,
    animatedContentHeight,
    rootScrollableContentOffsetY,
    contentOffsetY,
    lastContentHeightRef,
    isScrollableRefreshable,
    isContentHeightFixed,
    setScrollableRef,
    removeScrollableRef,
  ]);

  // effects
  useFocusHook(handleSettingScrollable);
};
