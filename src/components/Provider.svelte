<script lang="ts">
  import type { Store } from 'redux';
  import { setContext } from 'svelte';
  import { readableFromReduxStore } from '../createBindReduxStore';
  import type { StoreContext } from '../interfaces/StoreContext';
  import { storeKey } from '../key';

  export let store: Store;

  const data = readableFromReduxStore(store);

  setContext<StoreContext>(storeKey, { store, data });
</script>

<slot {store} {data} />
