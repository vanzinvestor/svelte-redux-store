import { writable, type Writable } from 'svelte/store';
import type { SetState, State$ } from './types';

function createGetState<TState>(store: Writable<TState>): State$<TState> {
  const { subscribe } = store;
  return { subscribe };
}

export function createUseState() {
  return function useState<TState = any>(
    init: TState
  ): [State$<TState>, SetState<TState>] {
    const store = writable<TState>(init);

    const $state = createGetState<TState>(store);

    const setState = store.set;

    return [$state, setState];
  };
}
