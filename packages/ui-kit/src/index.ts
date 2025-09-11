// Minimal UI kit placeholder
export type ButtonProps = { label: string };
export function renderButton(props: ButtonProps): string {
  return `<button>${props.label}</button>`;
}

