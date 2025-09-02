export function useClickToggleIgnoreSelection() {
  const open = ref(false);
  const click = () => {
    if (!document.getSelection()?.isCollapsed === true) {
      return;
    }
    open.value = !open.value;
  };
  return {
    open,
    click,
  };
}
