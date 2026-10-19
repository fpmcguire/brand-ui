/** Versioned, gallery-owned key. Present means this browser has already been shown the About panel. */
export const ABOUT_SEEN_STORAGE_KEY = 'brand-ui:gallery:about-seen:v1';

type SeenStorage = Pick<Storage, 'getItem' | 'setItem'>;

/**
 * Decides whether the About panel opens by itself. Every storage access is guarded, and an
 * in-memory flag keeps the automatic opening to once per page load when storage is unavailable.
 */
export class AboutFirstVisit {
  private readonly storage: () => SeenStorage;
  private openedThisLoad = false;

  /** `storage` is a function so that even obtaining `localStorage` is inside the guards. */
  constructor(storage: () => SeenStorage = () => localStorage) {
    this.storage = storage;
  }

  /**
   * True when the panel should open now. The seen value is written here, when the automatic
   * opening is initiated, not when the visitor closes the panel.
   */
  claimAutoOpen(): boolean {
    if (this.openedThisLoad) {
      return false;
    }
    try {
      if (this.storage().getItem(ABOUT_SEEN_STORAGE_KEY) !== null) {
        return false;
      }
    } catch {
      // Storage is unavailable: fall through to the page-lifetime flag.
    }
    this.openedThisLoad = true;
    try {
      this.storage().setItem(ABOUT_SEEN_STORAGE_KEY, '1');
    } catch {
      // A failed write is not an error; the flag above still limits this page load to one opening.
    }
    return true;
  }
}
