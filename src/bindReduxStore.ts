import { readable, type Subscriber, type Unsubscriber } from 'svelte/store';
import type { Action as BaseAction, AnyAction, Store } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { createSelector } from './createSelector';

declare type Invalidator<T> = (value?: T) => void;

export type TypedDispatch<T> = ThunkDispatch<T, any, AnyAction>;

export function createBindReduxStore<T>(useDispatch: () => TypedDispatch<T>) {
  return function bindReduxStore<TState, Action extends BaseAction>(
    store: Store<TState, Action>
  ) {
    const data = readable(store.getState(), (set) => {
      let currentState: TState;

      const unsubscribe = store.subscribe(() => {
        let nextState = store.getState();
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

    function TypedUseSelector<TState>(): <TState, Selected>(
      selector: (values: TState) => Selected
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
    const selector = TypedUseSelector<T>();

    return {
      subscribe: newSubscribe,
      dispatch,
      selector,
    };
  };
}
