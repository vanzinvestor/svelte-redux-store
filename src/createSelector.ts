import { derived, type Readable } from 'svelte/store';
import type { State$ } from './types';

export function createSelector<TState = unknown>(store: Readable<TState>) {
  return function useSelector<TState, TSelected extends unknown>(
    selector: (state: TState) => TSelected
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

    const { subscribe } = derived<
      Readable<TState>,
      TSelected
      // @ts-ignore
    >(store, selector);

    return {
      subscribe,
    };
  };
}
