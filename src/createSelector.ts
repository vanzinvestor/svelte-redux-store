import {
  derived,
  type Readable,
  type Subscriber,
  type Unsubscriber,
} from 'svelte/store';

declare type Invalidator<T> = (value?: T) => void;

export function createSelector<TState = unknown>(store: Readable<TState>) {
  return function useSelector<TState, TSelected extends unknown>(
    selector: (values: TState) => TSelected
  ): {
    subscribe: (
      this: void,
      run: Subscriber<TSelected>,
      invalidate?: Invalidator<TSelected>
    ) => Unsubscriber;
  } {
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
