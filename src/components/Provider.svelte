<script lang="ts">
  import type { Store } from 'redux';
  import { setContext } from 'svelte';
  import { readable } from 'svelte/store';
  import type { StoreContext } from '../interfaces/StoreContext';
  import { storeKey } from '../key';

  export let store: Store;

  const data = readable(store.getState(), (set) => {
    let currentState: any;

    const unsubscribe = store.subscribe(() => {
      const nextState = store.getState();
      if (nextState !== currentState) {
        currentState = nextState;
        set(store.getState());
      }
    });

    return unsubscribe;
  });

  setContext<StoreContext>(storeKey, { store, data });
</script>

<div {...$$restProps}>
  <slot {store} {data} />
</div>
