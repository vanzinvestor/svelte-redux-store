import { getContext } from 'svelte';
import { derived, type Readable } from 'svelte/store';
import type { StoreContext } from './interfaces/StoreContext';
import { storeKey } from './key';
import type { State$ } from './types';

export function createSelectorFromContext() {
  return function useSelector<TState, TSelected extends unknown>(
    selector: (values: TState) => TSelected
  ): State$<TSelected> {
    if (process.env.NODE_ENV !== 'production') {
      if (!selector) {
        throw new Error(`You must pass a selector to useSelector`);
      }
      if (typeof selector !== 'function') {
        throw new Error(
          `You must pass a function as a selector to useSelector`
        );
      }
    }

    const ctx = getContext<StoreContext>(storeKey);

    if (process.env.NODE_ENV !== 'production') {
      if (!ctx) {
        throw new Error(
          'could not find svelte-redux-store context value; please ensure the component is wrapped in a <Provider {store}></Provider>'
        );
      }
    }

    const { subscribe } = derived<
      Readable<TState>,
      TSelected
      // @ts-ignore
    >(ctx.data, selector);

    return {
      subscribe,
    };
  };
}
