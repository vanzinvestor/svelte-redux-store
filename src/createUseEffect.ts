export function createUseEffect(onMount: (fn: () => any) => void) {
  return function useEffect(fn: () => void, params: any[]) {
    function onChange(...params: any[]): void {
      fn();
    }

    if (!params.length) {
      return onMount(fn);
    }

    return onChange(...params);
  };
}
