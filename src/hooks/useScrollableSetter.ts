import type React from 'react';
import type { MutableRefObject } from 'react';
import { useCallback, useEffect } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { SCROLLABLE_TYPE } from '../constants';
import type { Scrollable } from '../types';
import { findNodeHandle } from '../utilities';
import { useBottomSheetInternal } from './useBottomSheetInternal';

export const useScrollableSetter = (
  ref: React.RefObject<Scrollable>,
  type: SCROLLABLE_TYPE,
  contentOffsetY: SharedValue<number>,
  lastContentHeightRef: MutableRefObject<number | undefined>,
  refreshable: boolean,
  useFocusHook = useEffect
) => {
  // hooks
  const {
    animatedLayoutState,
    animatedScrollableState,
    setScrollableRef,
    removeScrollableRef,
  } = useBottomSheetInternal();

  // callbacks
  const handleSettingScrollable = useCallback(() => {
    // set current content offset
    animatedScrollableState.set(state => ({
      ...state,
      contentOffsetY: contentOffsetY.value,
      type,
      refreshable,
    }));

    const lastContentHeight = lastContentHeightRef.current;

    if (lastContentHeight !== undefined) {
      animatedLayoutState.set(state => ({
        ...state,
        contentHeight: lastContentHeight,
      }));
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
    contentOffsetY,
    animatedLayoutState,
    animatedScrollableState,
    lastContentHeightRef,
    setScrollableRef,
    removeScrollableRef,
  ]);

  // effects
  useFocusHook(handleSettingScrollable);
};
