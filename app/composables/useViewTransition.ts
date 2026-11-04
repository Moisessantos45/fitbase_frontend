export function useViewTransition() {
  const transition = (callback: () => unknown | Promise<unknown>) => {
    if (!document.startViewTransition) {
      callback();
      return;
    }
    document.startViewTransition(async () => {
      await callback();
      await nextTick();
    });
  };

  return { transition };
}
