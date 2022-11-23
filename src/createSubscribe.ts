import { onDestroy } from 'svelte';
import type { Readable } from 'svelte/store';

export function createSubscribe<TState = unknown>(store: Readable<TState>) {
  function dataSubscribe<TState>(fn: (value: TState) => void) {
    // @ts-ignore
    const unsubscribe = store.subscribe(fn);

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

    return dataSubscribe(fn);
  };
}
