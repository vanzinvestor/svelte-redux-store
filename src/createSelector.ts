import {
  derived,
  type Readable,
  type Subscriber,
  type Unsubscriber,
} from 'svelte/store';

declare type Invalidator<T> = (value?: T) => void;

declare type $State<T> = {
  subscribe: (
    this: void,
    run: Subscriber<T>,
    invalidate?: Invalidator<T>
  ) => Unsubscriber;
};

export function createSelector<TState = unknown>(store: Readable<TState>) {
  return function useSelector<TState, TSelected extends unknown>(
    selector: (values: TState) => TSelected
  ): $State<TSelected> {
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
