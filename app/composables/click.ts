export function useClickOpenIgnoreSelection() {
  const open = ref(false);
  const click = () => {
    const selection = document.getSelection();
    if (selection === null) {
      return;
    }
    if (!selection.isCollapsed) {
      return;
    }
    open.value = true;
  };
  const close = () => {
    open.value = false;
  };
  return {
    open,
    click,
    close,
  };
}
