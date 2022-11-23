import { readable, type Subscriber, type Unsubscriber } from 'svelte/store';
import type { Action as BaseAction, Store } from 'redux';
import { createSelector } from './createSelector';
import type { Invalidator, TypedDispatch } from './types';

export function createBindReduxStore<T>(useDispatch: () => TypedDispatch<T>) {
  return function bindReduxStore<TState, Action extends BaseAction>(
    store: Store<TState, Action>
  ) {
    const data = readable(store.getState(), (set) => {
      let currentState: TState;

      const unsubscribe = store.subscribe(() => {
        const nextState = store.getState();
        if (nextState !== currentState) {
          currentState = nextState;
          set(store.getState());
        }
      });

      return unsubscribe;
    });

    function TypedSubscribe<TState>(): (
      this: void,
      run: Subscriber<TState>,
      invalidate?: Invalidator<TState>
    ) => Unsubscriber {
      // @ts-ignore
      return data.subscribe;
    }

    const useSelector = createSelector(data);

    function TypedUseSelector(): <TState, Selected>(
      selector: (state: TState) => Selected
    ) => {
      subscribe: (
        this: void,
        run: Subscriber<Selected>,
        invalidate?: Invalidator<Selected>
      ) => Unsubscriber;
    } {
      return useSelector;
    }

    const newSubscribe = TypedSubscribe<T>();
    const dispatch = useDispatch();
    const selector = TypedUseSelector();

    return {
      subscribe: newSubscribe,
      dispatch,
      selector,
    };
  };
}
