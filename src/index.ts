import type { Store } from 'redux';
import { createDispatch } from './createDispatch';
import { createSelector } from './createSelector';
import { createFeatureSelector } from './createFeatureSelector';
import { createSubscribe } from './createSubscribe';
import { createBindReduxStore, TypedDispatch } from './bindReduxStore';

export function creatReduxStore<T>(store: Store) {
  const useDefaultDispatch = createDispatch(store);

  const useDispatch = () => useDefaultDispatch<TypedDispatch<T>>();

  const bindReduxStore = createBindReduxStore<T>(useDispatch);

  const appStore = bindReduxStore(store);

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
