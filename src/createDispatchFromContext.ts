import type { Action as BaseAction, AnyAction, Dispatch } from 'redux';
import { getContext } from 'svelte';
import type { StoreContext } from './interfaces/StoreContext';
import { storeKey } from './key';

export function createDispatchFromContext<A extends BaseAction = AnyAction>() {
  return function <
    AppDispatch extends Dispatch<A> = Dispatch<A>
  >(): AppDispatch {
    const ctx = getContext<StoreContext>(storeKey);

    if (process.env.NODE_ENV !== 'production') {
      if (!ctx) {
        throw new Error(
          'could not find svelte-redux-store context value; please ensure the component is wrapped in a <Provider {store}></Provider>'
        );
      }
    }

    // @ts-ignore
    return ctx.store.dispatch;
  };
}
