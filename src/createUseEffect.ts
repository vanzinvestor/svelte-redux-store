import { onMount, beforeUpdate, afterUpdate } from "svelte";
import type { Readable } from "svelte/store";

export function createUseEffect() {
  return function useEffect(fn: () => void | undefined | (() => void), deps?: Readable<unknown>[]) {
    const depsVal = deps ? ([] as unknown[]) : undefined; // Save values of readable dependency stores

    let unsub: void | undefined | (() => void); // Effect's cleanup callback

    let previousDepsVal: unknown[] | undefined; // Snapshot of values of readable dependency stores

    onMount(() => {
      const unsubscribeDeps = deps?.map((d, i) =>
        d.subscribe(v => {
          if (depsVal) depsVal[i] = v;
        })
      ) // listen changes of readable dependency stores
      return () => {
        unsub?.();
        unsubscribeDeps?.forEach(u => u());
      }
    });

    beforeUpdate(() => {
      if (compareEffectDeps(depsVal, previousDepsVal)) unsub?.();
    });

    afterUpdate(() => {
      if (compareEffectDeps(depsVal, previousDepsVal)) {
        unsub = fn()
        previousDepsVal = depsVal ? [...depsVal] : undefined
      };
    });

  }
}

export function compareEffectDeps(current?: unknown[], previous?: unknown[]): boolean {
  if (!current) return true; // No deps mean always change

  const currentDepsVal = [...current];
  const doCompare = () => {
    if (currentDepsVal.length !== previous?.length) return true;
    for (let i = 0; i < currentDepsVal.length; i++) {
      const curr = currentDepsVal[i];
      const last = previous?.[i];
      if (!Object.is(curr, last)) return true; // Detects change using same algorithm `Object.is` as React
    }
    return false; // no change
  }
  const result = doCompare()
  return result
}