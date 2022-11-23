import type { Action } from 'redux';
import { getContext } from 'svelte';
import type { Subscriber, Unsubscriber } from 'svelte/store';
import { createBindReduxStore } from './createBindReduxStore';
import { createDispatchFromContext } from './createDispatchFromContext';
import type { StoreContext } from './interfaces/StoreContext';
import { storeKey } from './key';
import type { Invalidator, State$, TypedDispatch } from './types';

export function createStoreFromContext() {
  return function useStore<TState = unknown>(): {
    subscribe: (
      this: void,
      run: Subscriber<TState>,
      invalidate?: Invalidator<TState> | undefined
    ) => Unsubscriber;
    dispatch: TypedDispatch<TState>;
    selector: <TState, TSelected>(
      selector: (state: TState) => TSelected
    ) => State$<TSelected>;
  } {
    const ctx = getContext<StoreContext>(storeKey);

    if (process.env.NODE_ENV !== 'production') {
      if (!ctx) {
        throw new Error(
          'could not find svelte-redux-store context value; please ensure the component is wrapped in a <Provider {store}></Provider>'
        );
      }
    }

    const useDefaultDispatch = createDispatchFromContext();

    const useDispatch = () => useDefaultDispatch<TypedDispatch<TState>>();

    const bindReduxStore = createBindReduxStore<TState>(useDispatch);

    const appStore = bindReduxStore<TState, Action>(ctx.store);

    return appStore;
  };
}
