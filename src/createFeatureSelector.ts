import { derived, type Readable } from 'svelte/store';
import type { State$ } from './types';

export function createFeatureSelector<TState = unknown>(
  store: Readable<TState>
) {
  return function useFeatureSelector(
    featureName: keyof TState
  ): State$<TState[keyof TState]> {
    const { subscribe } = derived<Readable<TState>, TState[keyof TState]>(
      store,
      ($store) => $store[featureName]
    );

    return {
      subscribe,
    };
  };
}
