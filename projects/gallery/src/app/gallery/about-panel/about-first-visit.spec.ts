import { ABOUT_SEEN_STORAGE_KEY, AboutFirstVisit } from './about-first-visit';

function memoryStorage(initial: Record<string, string> = {}) {
  const items = new Map(Object.entries(initial));
  return {
    items,
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, value),
  };
}

const denied = () => {
  throw new DOMException('denied', 'SecurityError');
};

describe('AboutFirstVisit', () => {
  it('uses a versioned, gallery-owned key', () => {
    expect(ABOUT_SEEN_STORAGE_KEY).toBe('brand-ui:gallery:about-seen:v1');
  });

  it('opens when the key is absent, and records it at once', () => {
    const storage = memoryStorage();
    expect(new AboutFirstVisit(() => storage).claimAutoOpen()).toBe(true);
    expect(storage.items.get(ABOUT_SEEN_STORAGE_KEY)).toBe('1');
  });

  it('does not open, or write, when the key is present', () => {
    const storage = memoryStorage({ [ABOUT_SEEN_STORAGE_KEY]: '1' });
    const setItem = vi.spyOn(storage, 'setItem');
    expect(new AboutFirstVisit(() => storage).claimAutoOpen()).toBe(false);
    expect(setItem).not.toHaveBeenCalled();
  });

  it('opens only once per instance even when the key is written', () => {
    const storage = memoryStorage();
    const visit = new AboutFirstVisit(() => storage);
    expect(visit.claimAutoOpen()).toBe(true);
    storage.items.clear();
    expect(visit.claimAutoOpen()).toBe(false);
  });

  it('a later page load opens again when nothing could be stored', () => {
    const broken = { getItem: denied, setItem: denied };
    expect(new AboutFirstVisit(() => broken).claimAutoOpen()).toBe(true);
    expect(new AboutFirstVisit(() => broken).claimAutoOpen()).toBe(true);
  });

  it('opens once when the read throws, and tries to record it', () => {
    const storage = memoryStorage();
    const setItem = vi.spyOn(storage, 'setItem');
    const visit = new AboutFirstVisit(() => ({ getItem: denied, setItem: storage.setItem }));
    expect(visit.claimAutoOpen()).toBe(true);
    expect(setItem).toHaveBeenCalledExactlyOnceWith(ABOUT_SEEN_STORAGE_KEY, '1');
    expect(storage.items.get(ABOUT_SEEN_STORAGE_KEY)).toBe('1');
    expect(visit.claimAutoOpen()).toBe(false);
  });

  it('opens once when the write throws, without an error', () => {
    const visit = new AboutFirstVisit(() => ({ getItem: () => null, setItem: denied }));
    expect(visit.claimAutoOpen()).toBe(true);
    expect(visit.claimAutoOpen()).toBe(false);
  });

  it('opens once when obtaining storage itself throws', () => {
    const visit = new AboutFirstVisit(denied);
    expect(visit.claimAutoOpen()).toBe(true);
    expect(visit.claimAutoOpen()).toBe(false);
  });
});
