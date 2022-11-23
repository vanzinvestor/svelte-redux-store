import { getContext, onDestroy } from 'svelte';
import type { StoreContext } from './interfaces/StoreContext';
import { storeKey } from './key';

export function createSubscribeFromContext() {
  function dataSubscribe<TState>(fn: (value: TState) => void) {
    const ctx = getContext<StoreContext<TState>>(storeKey);

    if (process.env.NODE_ENV !== 'production') {
      if (!ctx) {
        throw new Error(
          'could not find svelte-redux-store context value; please ensure the component is wrapped in a <Provider {store}></Provider>'
        );
      }
    }

    const unsubscribe = ctx.data.subscribe(fn);

    onDestroy(unsubscribe);
  }

  return function useSubscribe<TState>(fn: (value: TState) => void) {
    if (process.env.NODE_ENV !== 'production') {
      if (!fn) {
        throw new Error(`You must pass a fn to useSubscribe`);
      }
      if (typeof fn !== 'function') {
        throw new Error(`You must pass a function as a fn to useSubscribe`);
      }
    }

    return dataSubscribe<TState>(fn);
  };
}
