import { Card as Installed } from '@brand-ui/atomic/organisms';
import { Card } from '../../public-api';

describe('Card export', () => {
  it('is the installed class itself, not a wrapper or a copy', () => {
    expect(Card).toBe(Installed);
  });
});
