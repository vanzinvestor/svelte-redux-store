import {
  derived,
  type Readable,
  type Subscriber,
  type Unsubscriber,
} from 'svelte/store';

declare type Invalidator<T> = (value?: T) => void;

export function createSelector<TState = unknown>(store: Readable<TState>) {
  return function useSelector<TState, Selected extends unknown>(
    selector: (values: TState) => Selected
  ): {
    subscribe: (
      this: void,
      run: Subscriber<Selected>,
      invalidate?: Invalidator<Selected>
    ) => Unsubscriber;
  } {
    const { subscribe } = derived<
      Readable<TState>,
      Selected
      // @ts-ignore
    >(store, selector);

    return {
      subscribe,
    };
  };
}
