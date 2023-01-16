import { beforeUpdate, onDestroy } from "svelte";
import type { Readable } from "svelte/store";
import { compareEffectDeps } from "./createUseEffect";

export function createUseLayoutEffect() {
  return function useLayoutEffect(fn: () => void | undefined | (() => void), deps?: Readable<unknown>[]) {
    const depsVal = deps ? ([] as unknown[]) : undefined;

    let unsub: void | undefined | (() => void);

    let previousDepsVal: unknown[] | undefined;

    const unsubscribeDeps = deps?.map((d, i) =>
      d.subscribe(v => {
        if (depsVal) depsVal[i] = v;
      })
    ); // listen changes of readable dependency stores

    beforeUpdate(() => {
      if (compareEffectDeps(depsVal, previousDepsVal)) {
        unsub = fn()
        previousDepsVal = depsVal ? [...depsVal] : undefined
      };
    });

    onDestroy(() => {
      unsub?.();
      unsubscribeDeps?.forEach(u => u());
    })
  }
}
