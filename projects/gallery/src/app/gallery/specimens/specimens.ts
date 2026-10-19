import { ButtonVariant } from 'ui';
import { GalleryScopeId } from '../gallery-state';

/** Specimen metadata: states, Design IDs and sample content. No token values live here. */
export type ButtonState = 'default' | 'hover' | 'active' | 'focus' | 'disabled' | 'loading';

export interface ButtonSpecimen {
  readonly designId: string;
  readonly state: ButtonState;
  /** Hover, active and focus are shown persistently through gallery-owned state variables. */
  readonly forced: boolean;
}

export const BUTTON_VARIANTS: readonly ButtonVariant[] = ['primary', 'secondary'];

export const BUTTON_SPECIMENS: readonly ButtonSpecimen[] = [
  { designId: 'DS-010', state: 'default', forced: false },
  { designId: 'DS-011', state: 'hover', forced: true },
  { designId: 'DS-012', state: 'active', forced: true },
  { designId: 'DS-013', state: 'focus', forced: true },
  { designId: 'DS-014', state: 'disabled', forced: false },
  { designId: 'DS-015', state: 'loading', forced: false },
];

export type CardState = 'static' | 'interactive' | 'hover' | 'focus' | 'active' | 'loading';

export interface CardSpecimen {
  readonly designId: string;
  readonly state: CardState;
  readonly label: string;
  readonly forced: boolean;
  readonly linked: boolean;
  readonly loading: boolean;
}

export const CARD_SPECIMENS: readonly CardSpecimen[] = [
  {
    designId: 'DS-030',
    state: 'static',
    label: 'Static',
    forced: false,
    linked: false,
    loading: false,
  },
  {
    designId: 'DS-031',
    state: 'interactive',
    label: 'Interactive',
    forced: false,
    linked: true,
    loading: false,
  },
  {
    designId: 'DS-032',
    state: 'hover',
    label: 'Interactive hover',
    forced: true,
    linked: true,
    loading: false,
  },
  {
    designId: 'DS-033',
    state: 'focus',
    label: 'Interactive focus',
    forced: true,
    linked: true,
    loading: false,
  },
  {
    designId: 'DS-034',
    state: 'active',
    label: 'Interactive active',
    forced: true,
    linked: true,
    loading: false,
  },
  {
    designId: 'DS-035',
    state: 'loading',
    label: 'Loading',
    forced: false,
    linked: false,
    loading: true,
  },
];

export interface CardContent {
  readonly title: string;
  readonly description: string;
  readonly meta: string;
  readonly tag: string;
  readonly mediaLabel: string;
  readonly codeSample?: string;
}

/**
 * Neutral sample content per scope. The optional code sample is explicit specimen data handed to
 * the card; the card never decides to show one because of the active brand.
 */
export const CARD_CONTENT: Readonly<Record<GalleryScopeId, CardContent>> = {
  artanon: {
    title: 'Sample artwork title',
    description: 'Sample description of a print, shown only to exercise the card layout.',
    meta: '[SKU] · [SIZE] · [PRICE]',
    tag: 'Sample',
    mediaLabel: 'Image placeholder',
  },
  mentor: {
    title: 'Sample lesson title',
    description: 'Sample description of a lesson, shown only to exercise the card layout.',
    meta: '[LEVEL] · [DURATION]',
    tag: 'Sample',
    mediaLabel: 'Image placeholder',
  },
  'codecraft-light': codecraftContent(),
  'codecraft-dark': codecraftContent(),
};

function codecraftContent(): CardContent {
  return {
    title: 'Sample code example',
    description: 'Sample description of an example, shown only to exercise the card layout.',
    meta: '[LANGUAGE] · [LEVEL]',
    tag: 'Sample',
    mediaLabel: 'Image placeholder',
    codeSample: 'const total = items.length;',
  };
}
