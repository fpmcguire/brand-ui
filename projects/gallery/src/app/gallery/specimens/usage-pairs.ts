/**
 * DS-060: the explicit semantic usage pairs. Each is a combination of two tokens that a component
 * actually paints, one on the other. Names only: the colours are read from the computed style of
 * the scope being checked, so nothing here can drift from the token CSS.
 *
 * `text` is normal text (4.5:1). `large-text` (3:1) is available but no component pair relies on
 * it: every text pair is held to the stricter 4.5:1. `non-text` (3:1) covers borders, indicators,
 * icons and the focus ring. Disabled text is exempt from contrast and is not listed.
 */
export type PairKind = 'text' | 'large-text' | 'non-text';

export const REQUIRED_RATIO: Readonly<Record<PairKind, number>> = {
  text: 4.5,
  'large-text': 3,
  'non-text': 3,
};

export interface UsagePair {
  readonly id: string;
  readonly label: string;
  readonly kind: PairKind;
  readonly foreground: string;
  readonly background: string;
  readonly usedBy: string;
}

export const USAGE_PAIRS: readonly UsagePair[] = [
  {
    id: 'text-on-bg',
    label: 'Text on page background',
    kind: 'text',
    foreground: '--bui-color-text',
    background: '--bui-color-bg',
    usedBy: 'Input label, card code sample',
  },
  {
    id: 'text-on-surface',
    label: 'Text on surface',
    kind: 'text',
    foreground: '--bui-color-text',
    background: '--bui-color-surface',
    usedBy: 'Card text, input value, navigation labels and wordmark',
  },
  {
    id: 'text-on-tint',
    label: 'Navigation label on hover tint',
    kind: 'text',
    foreground: '--bui-color-text',
    background: '--bui-color-primary-tint',
    usedBy: 'Navigation item hover',
  },
  {
    id: 'muted-on-surface',
    label: 'Muted text on surface',
    kind: 'text',
    foreground: '--bui-color-text-muted',
    background: '--bui-color-surface',
    usedBy: 'Input placeholder, card meta',
  },
  {
    id: 'muted-on-bg',
    label: 'Muted text on page background',
    kind: 'text',
    foreground: '--bui-color-text-muted',
    background: '--bui-color-bg',
    usedBy: 'Input helper text',
  },
  {
    id: 'muted-on-sunken',
    label: 'Muted text on sunken surface',
    kind: 'text',
    foreground: '--bui-color-text-muted',
    background: '--bui-color-surface-sunken',
    usedBy: 'Card media label',
  },
  {
    id: 'on-primary',
    label: 'Primary button label',
    kind: 'text',
    foreground: '--bui-color-on-primary',
    background: '--bui-color-primary',
    usedBy: 'Primary button',
  },
  {
    id: 'on-primary-hover',
    label: 'Primary button label, hover',
    kind: 'text',
    foreground: '--bui-color-on-primary',
    background: '--bui-color-primary-hover',
    usedBy: 'Primary button hover',
  },
  {
    id: 'on-primary-active',
    label: 'Primary button label, active',
    kind: 'text',
    foreground: '--bui-color-on-primary',
    background: '--bui-color-primary-active',
    usedBy: 'Primary button active',
  },
  {
    id: 'secondary-on-bg',
    label: 'Secondary button text on background',
    kind: 'text',
    foreground: '--bui-color-primary',
    background: '--bui-color-bg',
    usedBy: 'Secondary button',
  },
  {
    id: 'secondary-on-tint',
    label: 'Secondary button text on hover tint',
    kind: 'text',
    foreground: '--bui-color-primary',
    background: '--bui-color-primary-tint',
    usedBy: 'Secondary button hover and active',
  },
  {
    id: 'on-accent',
    label: 'Card tag label on accent',
    kind: 'text',
    foreground: '--bui-color-on-accent',
    background: '--bui-color-accent',
    usedBy: 'Card tag',
  },
  {
    id: 'error-text-on-surface',
    label: 'Error text on surface',
    kind: 'text',
    foreground: '--bui-color-danger',
    background: '--bui-color-surface',
    usedBy: 'Input error message inside a surface',
  },
  {
    id: 'error-text-on-bg',
    label: 'Error text on page background',
    kind: 'text',
    foreground: '--bui-color-danger',
    background: '--bui-color-bg',
    usedBy: 'Input error message',
  },
  {
    id: 'input-border-on-surface',
    label: 'Input border on surface',
    kind: 'non-text',
    foreground: '--bui-color-border-strong',
    background: '--bui-color-surface',
    usedBy: 'Input boundary inside a surface',
  },
  {
    id: 'input-border-on-bg',
    label: 'Input border on page background',
    kind: 'non-text',
    foreground: '--bui-color-border-strong',
    background: '--bui-color-bg',
    usedBy: 'Input boundary',
  },
  {
    id: 'secondary-border-on-bg',
    label: 'Secondary button border on background',
    kind: 'non-text',
    foreground: '--bui-color-primary',
    background: '--bui-color-bg',
    usedBy: 'Secondary button boundary',
  },
  {
    id: 'focus-on-bg',
    label: 'Focus ring on page background',
    kind: 'non-text',
    foreground: '--bui-color-focus',
    background: '--bui-color-bg',
    usedBy: 'Button, input and card focus ring',
  },
  {
    id: 'focus-on-surface',
    label: 'Focus ring on surface',
    kind: 'non-text',
    foreground: '--bui-color-focus',
    background: '--bui-color-surface',
    usedBy: 'Navigation focus ring, input focus border',
  },
  {
    id: 'focus-on-tint',
    label: 'Focus ring on hover tint',
    kind: 'non-text',
    foreground: '--bui-color-focus',
    background: '--bui-color-primary-tint',
    usedBy: 'Navigation item that is both hovered and focused',
  },
  {
    id: 'error-border-on-surface',
    label: 'Error border and icon on surface',
    kind: 'non-text',
    foreground: '--bui-color-danger',
    background: '--bui-color-surface',
    usedBy: 'Input error border and icon inside a surface',
  },
  {
    id: 'error-border-on-bg',
    label: 'Error border and icon on page background',
    kind: 'non-text',
    foreground: '--bui-color-danger',
    background: '--bui-color-bg',
    usedBy: 'Input error border and icon',
  },
  {
    id: 'current-indicator-on-surface',
    label: 'Navigation current indicator on surface',
    kind: 'non-text',
    foreground: '--bui-color-primary',
    background: '--bui-color-surface',
    usedBy: 'Navigation current page bar',
  },
];
