import { Component, inject } from '@angular/core';
import { Button, Card, ThemeScopeDirective } from 'ui';
import { GalleryState } from './gallery-state';
import {
  BUTTON_SPECIMENS,
  BUTTON_VARIANTS,
  CARD_CONTENT,
  CARD_SPECIMENS,
} from './specimens/specimens';
import { TokenGroupComponent } from './token-group.component';
import { TOKEN_GROUPS } from './token-inspector';

@Component({
  imports: [Button, Card, ThemeScopeDirective, TokenGroupComponent],
  providers: [GalleryState],
  templateUrl: './gallery-page.component.html',
  styleUrl: './gallery-page.component.scss',
})
export class GalleryPage {
  protected readonly state = inject(GalleryState);

  protected readonly tokenGroups = TOKEN_GROUPS;
  protected readonly buttonVariants = BUTTON_VARIANTS;
  protected readonly buttonSpecimens = BUTTON_SPECIMENS;
  protected readonly cardSpecimens = CARD_SPECIMENS;
  protected readonly cardContent = CARD_CONTENT;

  /** Sample card links go nowhere; keep the review surface on the page. */
  protected keepOnPage(event: Event): void {
    if (event.target instanceof Element && event.target.closest('a')) {
      event.preventDefault();
    }
  }
}
