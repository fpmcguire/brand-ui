import { GalleryScopeId } from '../gallery-state';

/** Specimen metadata for the text input: states, Design IDs and sample content. No token values. */
export type InputState = 'default' | 'hover' | 'focus' | 'filled' | 'error' | 'disabled';

export interface InputSpecimen {
  readonly designId: string;
  readonly state: InputState;
  readonly label: string;
  /** Hover and focus are shown persistently through gallery-owned state variables. */
  readonly forced: boolean;
  readonly filled: boolean;
  readonly error: boolean;
  readonly disabled: boolean;
}

export const INPUT_SPECIMENS: readonly InputSpecimen[] = [
  {
    designId: 'DS-020',
    state: 'default',
    label: 'Default, empty (working sample)',
    forced: false,
    filled: false,
    error: false,
    disabled: false,
  },
  {
    designId: 'DS-021',
    state: 'hover',
    label: 'Hover',
    forced: true,
    filled: false,
    error: false,
    disabled: false,
  },
  {
    designId: 'DS-022',
    state: 'focus',
    label: 'Focus',
    forced: true,
    filled: false,
    error: false,
    disabled: false,
  },
  {
    designId: 'DS-023',
    state: 'filled',
    label: 'Filled',
    forced: false,
    filled: true,
    error: false,
    disabled: false,
  },
  {
    designId: 'DS-024',
    state: 'error',
    label: 'Error',
    forced: false,
    filled: true,
    error: true,
    disabled: false,
  },
  {
    designId: 'DS-025',
    state: 'disabled',
    label: 'Disabled',
    forced: false,
    filled: true,
    error: false,
    disabled: true,
  },
];

export interface InputContent {
  readonly label: string;
  readonly placeholder: string;
  readonly helper: string;
  readonly value: string;
  readonly invalidValue: string;
  readonly error: string;
}

const HELPER = 'Sample helper text.';

const EMAIL: InputContent = {
  label: 'Email address',
  placeholder: 'name@example.com',
  helper: HELPER,
  value: 'person@example.com',
  invalidValue: 'not-an-email',
  error: 'Enter an email address in the format name@example.com.',
};

function codecraftContent(): InputContent {
  return {
    label: 'Repository URL',
    placeholder: 'https://example.com/repo',
    helper: HELPER,
    value: 'https://example.com/repo',
    invalidValue: 'example',
    error: 'Enter a URL that starts with https://',
  };
}

/** Neutral sample content per scope. Only the words differ; the component is the same everywhere. */
export const INPUT_CONTENT: Readonly<Record<GalleryScopeId, InputContent>> = {
  artanon: EMAIL,
  mentor: EMAIL,
  'codecraft-light': codecraftContent(),
  'codecraft-dark': codecraftContent(),
};
