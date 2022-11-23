import type { AnyAction, Store } from 'redux';
import type { Readable } from 'svelte/store';

export interface StoreContext<T = any> {
  store: Store<T, AnyAction>;
  data: Readable<T>;
}
