import { onMount, beforeUpdate, afterUpdate } from "svelte";
import type { Readable } from "svelte/store";

export function createUseEffect() {
  return function useEffect(fn: () => void | undefined | (() => void), deps?: Readable<unknown>[]) {
    const depsVal = deps ? ([] as unknown[]) : undefined; // Save values of readable dependency stores

    let isMounted = false;

    let unsub: void | undefined | (() => void); // Effect's cleanup callback

    let previousDepsVal: unknown[] | undefined; // Snapshot of values of readable dependency stores

    onMount(() => {
      isMounted = true;
      const unsubscribeDeps = deps?.map((d, i) =>
        d.subscribe(v => {
          if (depsVal) depsVal[i] = v;
        })
      ) // listen changes of readable dependency stores
      checkDepsChange();
      unsub = fn(); // initial run of effect happens when mounted, just like React
      return () => {
        unsub?.();
        unsubscribeDeps?.forEach(u => u());
      }
    });

    beforeUpdate(() => {
      if (!isMounted) return; // This makes sure the first effect runs when onMount, like React
      if (checkDepsChange()) unsub?.();
    });

    afterUpdate(() => {
      if (checkDepsChange()) unsub = fn();
    });

    function checkDepsChange(): boolean {
      if (!depsVal) return true; // No deps mean always change

      const currentDepsVal = [...depsVal];
      if (currentDepsVal.length !== previousDepsVal?.length) true;
      for (let i = 0; i < currentDepsVal.length; i++) {
        const curr = currentDepsVal[i];
        const last = previousDepsVal?.[i];
        if (!Object.is(curr, last)) return true; // Detects change
      }
      previousDepsVal = currentDepsVal;
      return false; // no change
    }
  }
}
