import type { Action as BaseAction, AnyAction, Dispatch, Store } from 'redux';

export function createDispatch<A extends BaseAction = AnyAction>(store: Store) {
  return function <
    AppDispatch extends Dispatch<A> = Dispatch<A>
  >(): AppDispatch {
    // @ts-ignore
    return store.dispatch;
  };
}
