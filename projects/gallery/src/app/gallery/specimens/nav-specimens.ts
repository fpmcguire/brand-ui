import { NavigationItem } from 'ui';
import { GalleryScopeId } from '../gallery-state';

/** Specimen metadata for the navigation bar: states, Design IDs and sample content. */
export type NavState = 'default' | 'hover' | 'current' | 'focus' | 'disabled' | 'narrow';

export interface NavSpecimen {
  readonly designId: string;
  readonly state: NavState;
  readonly label: string;
  /** Hover and focus are shown persistently through gallery-owned state variables. */
  readonly forced: boolean;
  /** Shown in a narrow container so the bar has to wrap. */
  readonly narrow: boolean;
}

export const NAV_SPECIMENS: readonly NavSpecimen[] = [
  {
    designId: 'DS-040',
    state: 'default',
    label: 'Default (working sample)',
    forced: false,
    narrow: false,
  },
  { designId: 'DS-041', state: 'hover', label: 'Item hover', forced: true, narrow: false },
  {
    designId: 'DS-042',
    state: 'current',
    label: 'Item current page',
    forced: false,
    narrow: false,
  },
  { designId: 'DS-043', state: 'focus', label: 'Item focus', forced: true, narrow: false },
  { designId: 'DS-044', state: 'disabled', label: 'Item disabled', forced: false, narrow: false },
  {
    designId: 'DS-045',
    state: 'narrow',
    label: 'Narrow width (wraps, no menu)',
    forced: false,
    narrow: true,
  },
];

export interface NavContent {
  readonly wordmark: string;
  readonly labels: readonly [string, string, string, string];
  readonly longLabel: string;
}

function codecraftContent(): NavContent {
  return {
    wordmark: 'CodeCraft',
    labels: ['Examples', 'Patterns', 'About', 'Contribute'],
    longLabel: 'Contribution guidelines for new code examples and reviews',
  };
}

/** Neutral sample content per scope. ArtAnon appears as a text wordmark only. */
export const NAV_CONTENT: Readonly<Record<GalleryScopeId, NavContent>> = {
  artanon: {
    wordmark: 'ArtAnon',
    labels: ['Shop', 'Collections', 'About', 'Contact'],
    longLabel: 'Commissions, framing and insured delivery information',
  },
  mentor: {
    wordmark: 'IT English Mentor',
    labels: ['Lessons', 'Approach', 'About', 'Contact'],
    longLabel: 'Frequently asked questions about lesson formats and scheduling',
  },
  'codecraft-light': codecraftContent(),
  'codecraft-dark': codecraftContent(),
};

const HREF = '#sample';

/** The items one specimen shows. Single-state specimens carry one item named for the state. */
export function navItems(state: NavState, content: NavContent): readonly NavigationItem[] {
  switch (state) {
    case 'hover':
      return [{ id: 'hover', label: 'Hover', href: HREF }];
    case 'current':
      return [{ id: 'current', label: 'Current', href: HREF, current: true }];
    case 'focus':
      return [{ id: 'focus', label: 'Focus', href: HREF }];
    case 'disabled':
      return [{ id: 'disabled', label: 'Disabled', href: HREF, disabled: true }];
    case 'default':
    case 'narrow':
      return workingSample(content);
  }
}

export function workingSample(content: NavContent): readonly NavigationItem[] {
  return content.labels.map((label, index) => ({
    id: `item-${index}`,
    label,
    href: HREF,
    current: index === 0,
  }));
}

/** Short items around one item whose label is long; the long one carries the full text as title. */
export function longLabelItems(content: NavContent): readonly NavigationItem[] {
  const [first, , , last] = content.labels;
  return [
    { id: 'first', label: first, href: HREF, current: true },
    { id: 'long', label: content.longLabel, href: HREF, title: content.longLabel },
    { id: 'last', label: last, href: HREF },
  ];
}
