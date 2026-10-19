import { Component, inject } from '@angular/core';
import { Button, Card, Navigation, TextInput, ThemeScopeDirective } from 'ui';
import { GalleryState } from './gallery-state';
import { ButtonFormFixtureComponent } from './specimens/button-form-fixture.component';
import { ContrastEvidenceComponent } from './specimens/contrast-evidence.component';
import { InputSampleComponent } from './specimens/input-sample.component';
import { INPUT_CONTENT, INPUT_SPECIMENS } from './specimens/input-specimens';
import { LONG_BUTTON_LABEL, LONG_LABEL_CASES } from './specimens/long-label';
import { NAV_CONTENT, NAV_SPECIMENS, longLabelItems, navItems } from './specimens/nav-specimens';
import {
  BUTTON_SPECIMENS,
  BUTTON_VARIANTS,
  CARD_CONTENT,
  CARD_SPECIMENS,
} from './specimens/specimens';
import { TokenGroupComponent } from './token-group.component';
import { TOKEN_GROUPS } from './token-inspector';

@Component({
  imports: [
    Button,
    ButtonFormFixtureComponent,
    Card,
    ContrastEvidenceComponent,
    InputSampleComponent,
    Navigation,
    TextInput,
    ThemeScopeDirective,
    TokenGroupComponent,
  ],
  providers: [GalleryState],
  templateUrl: './gallery-page.component.html',
  styleUrl: './gallery-page.component.scss',
})
export class GalleryPage {
  protected readonly state = inject(GalleryState);

  protected readonly tokenGroups = TOKEN_GROUPS;
  protected readonly buttonVariants = BUTTON_VARIANTS;
  protected readonly buttonSpecimens = BUTTON_SPECIMENS;
  protected readonly inputSpecimens = INPUT_SPECIMENS;
  protected readonly inputContent = INPUT_CONTENT;
  protected readonly cardSpecimens = CARD_SPECIMENS;
  protected readonly cardContent = CARD_CONTENT;
  protected readonly navSpecimens = NAV_SPECIMENS;
  protected readonly navContent = NAV_CONTENT;
  protected readonly navItems = navItems;
  protected readonly longLabelItems = longLabelItems;
  protected readonly longLabelCases = LONG_LABEL_CASES;
  protected readonly longButtonLabel = LONG_BUTTON_LABEL;

  /** Sample card and navigation links go nowhere; keep the review surface on the page. */
  protected keepOnPage(event: Event): void {
    if (event.target instanceof Element && event.target.closest('a')) {
      event.preventDefault();
    }
  }
}
