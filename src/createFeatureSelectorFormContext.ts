import { getContext } from 'svelte';
import { derived, type Readable } from 'svelte/store';
import type { StoreContext } from './interfaces/StoreContext';
import { storeKey } from './key';
import type { State$ } from './types';

export function createFeatureSelectorFromContext() {
  return function useFeatureSelector<TState = unknown>(
    featureName: keyof TState
  ): State$<TState[keyof TState]> {
    const ctx = getContext<StoreContext<TState>>(storeKey);

    if (process.env.NODE_ENV !== 'production') {
      if (!ctx) {
        throw new Error(
          'could not find svelte-redux-store context value; please ensure the component is wrapped in a <Provider {store}></Provider>'
        );
      }
    }

    const data = ctx.data;

    const { subscribe } = derived<Readable<TState>, TState[keyof TState]>(
      data,
      ($data) => $data[featureName]
    );

    return {
      subscribe,
    };
  };
}
