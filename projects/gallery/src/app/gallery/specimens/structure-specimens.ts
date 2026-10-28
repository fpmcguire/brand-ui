export type StructureBody =
  'tag' | 'skeleton-block' | 'code-well' | 'media-area' | 'loading-skeleton' | 'card';
export type StructureLevel = 'atom' | 'molecule' | 'organism';

export interface StructureSpecimen {
  readonly designId: string;
  readonly testId: string;
  /** The part name shown as the first caption line, before the level. */
  readonly part: string;
  readonly level: StructureLevel;
  readonly body: StructureBody;
  /** The "Built from:" caption. Absent on atoms. */
  readonly builtFrom?: string;
  /** Organisms only: the "Shows the state of DS-0xx" caption, shown while Design IDs are on. */
  readonly showsState: boolean;
  /** Card only: the title is the single native link (DS-031). */
  readonly linked?: boolean;
  /** Card only: the card is in its loading state (DS-035). */
  readonly loading?: boolean;
}

export interface StructureGroup {
  readonly id: 'atoms' | 'molecules' | 'organism';
  readonly label: string;
  readonly specimens: readonly StructureSpecimen[];
}

export const STRUCTURE_GROUPS: readonly StructureGroup[] = [
  {
    id: 'atoms',
    label: 'Atoms',
    specimens: [
      {
        designId: 'DS-062',
        testId: 'gallery-structure-tag-default',
        part: 'Tag',
        level: 'atom',
        body: 'tag',
        showsState: false,
      },
      {
        designId: 'DS-063',
        testId: 'gallery-structure-skeleton-block-loading',
        part: 'Skeleton block',
        level: 'atom',
        body: 'skeleton-block',
        showsState: false,
      },
      {
        designId: 'DS-064',
        testId: 'gallery-structure-code-well-default',
        part: 'Code well',
        level: 'atom',
        body: 'code-well',
        showsState: false,
      },
    ],
  },
  {
    id: 'molecules',
    label: 'Molecules',
    specimens: [
      {
        designId: 'DS-065',
        testId: 'gallery-structure-media-area-default',
        part: 'Media area',
        level: 'molecule',
        body: 'media-area',
        builtFrom: 'Tag (atom), media label text',
        showsState: false,
      },
      {
        designId: 'DS-066',
        testId: 'gallery-structure-loading-skeleton-loading',
        part: 'Loading skeleton',
        level: 'molecule',
        body: 'loading-skeleton',
        builtFrom: 'Skeleton block, four times (atom)',
        showsState: false,
      },
    ],
  },
  {
    id: 'organism',
    label: 'Organism',
    specimens: [
      {
        designId: 'DS-030',
        testId: 'gallery-structure-card-static',
        part: 'Card, static',
        level: 'organism',
        body: 'card',
        builtFrom:
          'Media area (molecule), title, description, meta line, code well (atom, where the sample data supplies one)',
        showsState: true,
        linked: false,
        loading: false,
      },
      {
        designId: 'DS-031',
        testId: 'gallery-structure-card-interactive-default',
        part: 'Card, interactive default',
        level: 'organism',
        body: 'card',
        builtFrom: 'Same parts as the static card',
        showsState: true,
        linked: true,
        loading: false,
      },
      {
        designId: 'DS-035',
        testId: 'gallery-structure-card-loading',
        part: 'Card, loading',
        level: 'organism',
        body: 'card',
        builtFrom: 'Loading skeleton (molecule)',
        showsState: true,
        linked: false,
        loading: true,
      },
    ],
  },
];
