/**
 * Token names for display only. Values are never stored here: they are read from the computed
 * style of an element inside a themed scope. `npm run lint:tokens` keeps this list in step with
 * the library's token contract.
 */
export interface TokenGroup {
  readonly id: 'color' | 'type' | 'metrics';
  readonly label: string;
  readonly designId: string;
  readonly names: readonly string[];
}

export const TOKEN_GROUPS: readonly TokenGroup[] = [
  {
    id: 'color',
    label: 'Color',
    designId: 'DS-001',
    names: [
      '--bui-color-bg',
      '--bui-color-surface',
      '--bui-color-surface-sunken',
      '--bui-color-text',
      '--bui-color-text-muted',
      '--bui-color-border',
      '--bui-color-border-strong',
      '--bui-color-primary',
      '--bui-color-on-primary',
      '--bui-color-primary-hover',
      '--bui-color-primary-active',
      '--bui-color-primary-tint',
      '--bui-color-accent',
      '--bui-color-on-accent',
      '--bui-color-focus',
      '--bui-color-danger',
      '--bui-color-disabled-bg',
      '--bui-color-disabled-text',
    ],
  },
  {
    id: 'type',
    label: 'Type',
    designId: 'DS-002',
    names: [
      '--bui-font-display',
      '--bui-font-body',
      '--bui-font-ui',
      '--bui-font-mono',
      '--bui-weight-display',
      '--bui-weight-ui',
      '--bui-letter-spacing-ui',
      '--bui-size-body',
      '--bui-size-ui',
      '--bui-size-small',
      '--bui-size-title',
      '--bui-line-height-ui',
      '--bui-line-height-title',
    ],
  },
  {
    id: 'metrics',
    label: 'Space, radius, elevation',
    designId: 'DS-003',
    names: [
      '--bui-space-1',
      '--bui-space-2',
      '--bui-space-3',
      '--bui-space-4',
      '--bui-space-5',
      '--bui-space-6',
      '--bui-radius-control',
      '--bui-radius-card',
      '--bui-radius-round',
      '--bui-radius-tr-control',
      '--bui-radius-tr-card',
      '--bui-radius-tr-panel',
      '--bui-corner-shape-card',
      '--bui-border-width',
      '--bui-indicator-width',
      '--bui-focus-width',
      '--bui-focus-offset',
      '--bui-control-height',
      '--bui-elevation-card',
      '--bui-elevation-raised',
    ],
  },
];

export type TokenPreview = 'color' | 'font' | 'space' | 'radius' | 'elevation' | 'none';

export function previewKind(name: string): TokenPreview {
  if (name.startsWith('--bui-color-')) return 'color';
  if (name.startsWith('--bui-font-')) return 'font';
  if (name.startsWith('--bui-space-')) return 'space';
  if (name.startsWith('--bui-radius-')) return 'radius';
  if (name.startsWith('--bui-elevation-')) return 'elevation';
  return 'none';
}

/** Reads the resolved value of each custom property from `element`'s computed style. */
export function readTokens(
  element: Element,
  names: readonly string[],
): Readonly<Record<string, string>> {
  const style = getComputedStyle(element);
  return Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name).trim()]));
}
