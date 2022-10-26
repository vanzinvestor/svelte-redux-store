import { onDestroy } from 'svelte';
import { type Readable } from 'svelte/store';

export function createSubscribe<TState = unknown>(store: Readable<TState>) {
  function dataSubscribe<TState, TSelected extends unknown>(
    selector: (values: TState) => TSelected
  ) {
    // @ts-ignore
    const unsubscribe = store.subscribe(selector);

    onDestroy(unsubscribe);
  }

  return function <TState, TSelected extends unknown>(
    selector: (values: TState) => TSelected
  ) {
    return dataSubscribe(selector);
  };
}
