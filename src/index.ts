import type { Action, Store } from 'redux';
import { createDispatch } from './createDispatch';
import { createSelector } from './createSelector';
import { createFeatureSelector } from './createFeatureSelector';
import { createSubscribe } from './createSubscribe';
import { createBindReduxStore } from './createBindReduxStore';
import { createUseState as createNewUseState } from './createUseState';
import { createUseEffect as createNewUseEffect } from './createUseEffect';
import { createSelectorFromContext } from './createSelectorFormContext';
import { createDispatchFromContext } from './createDispatchFromContext';
import { createStoreFromContext } from './createStoreFromContext';
import { createFeatureSelectorFromContext } from './createFeatureSelectorFormContext';
import { createSubscribeFromContext } from './createSubscribeFromContext';
import type { TypedDispatch } from './types';

export * from './types';

export function creatSvelteReduxStore<T = any>(store: Store<T>) {
  const useDefaultDispatch = createDispatch(store);

  const useDispatch = () => useDefaultDispatch<TypedDispatch<T>>();

  const bindReduxStore = createBindReduxStore<T>(useDispatch);

  const appStore = bindReduxStore<T, Action>(store);

  const useStore = () => appStore;

  const useFeatureSelector = createFeatureSelector<T>(appStore);

  const useSelector = createSelector<T>(appStore);

  const useSubscribe = createSubscribe<T>(appStore);

  return {
    useStore,
    useDispatch,
    useSelector,
    useFeatureSelector,
    useSubscribe,
  };
}

export { default as Provider } from './components/Provider.svelte';

export const useStore = createStoreFromContext();

const useDefaultDispatchContext = createDispatchFromContext();

export const useDispatch = () =>
  useDefaultDispatchContext<TypedDispatch<any>>();

export const useSelector = createSelectorFromContext();

export const useFeatureSelector = createFeatureSelectorFromContext();

export const useSubscribe = createSubscribeFromContext();

export function createUseState() {
  const useState = createNewUseState();
  return { useState };
}

export const { useState } = createUseState();

export function createUseEffect(onMount: (fn: () => any) => void) {
  const useEffect = createNewUseEffect(onMount);
  return { useEffect };
}
