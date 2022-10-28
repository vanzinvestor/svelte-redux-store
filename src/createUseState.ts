import {
  writable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
} from 'svelte/store';

declare type Invalidator<T> = (value?: T) => void;

declare type $State<T> = {
  subscribe: (
    this: void,
    run: Subscriber<T>,
    invalidate?: Invalidator<T>
  ) => Unsubscriber;
};

declare type SetState<T> = (this: void, value: T) => void;

function createGetState<TState>(store: Writable<TState>) {
  const { subscribe } = store;
  return { subscribe };
}

export function createUseState() {
  return function useState<TState = any>(
    init: TState
  ): [$State<TState>, SetState<TState>] {
    const store = writable<TState>(init);

    const $state = createGetState<TState>(store);

    const setState = store.set;

    return [$state, setState];
  };
}
