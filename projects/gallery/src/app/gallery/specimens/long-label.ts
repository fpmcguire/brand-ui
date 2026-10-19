import { GalleryScopeId } from '../gallery-state';

/** DS-050 and DS-051 are shown at these container widths in every scope. */
export type LongLabelWidth = '180' | '280' | '360' | 'full';

export interface LongLabelCase {
  readonly width: LongLabelWidth;
  readonly caption: string;
}

export const LONG_LABEL_CASES: readonly LongLabelCase[] = [
  { width: '180', caption: '180px' },
  { width: '280', caption: '280px' },
  { width: '360', caption: '360px' },
  { width: 'full', caption: 'Full width' },
];

/** Long button labels per scope. The navigation long labels live with the navigation content. */
export const LONG_BUTTON_LABEL: Readonly<Record<GalleryScopeId, string>> = {
  artanon: 'Add this original artwork to my collection and arrange insured delivery',
  mentor: 'Book a one-to-one session to practise explaining architecture decisions to my team',
  'codecraft-light':
    'Open this annotated example in the playground and fork it to my own workspace',
  'codecraft-dark': 'Open this annotated example in the playground and fork it to my own workspace',
};
