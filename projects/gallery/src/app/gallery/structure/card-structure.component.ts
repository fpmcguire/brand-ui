import { Component, computed, input } from '@angular/core';
import { CodeWell, SkeletonBlock, Tag } from '@brand-ui/atomic/atoms';
import { LoadingSkeleton, MediaArea } from '@brand-ui/atomic/molecules';
import { Card } from '@brand-ui/atomic/organisms';
import { GalleryScopeId } from '../gallery-state';
import { CARD_CONTENT } from '../specimens/specimens';
import { STRUCTURE_GROUPS } from '../specimens/structure-specimens';

/**
 * The gallery-owned Card structure view (S-17, DS-061 to DS-066). It composes installed atomic parts
 * and the Card organism. It is never exported by `ui` or by the atomic package.
 */
@Component({
  selector: 'gal-card-structure',
  imports: [Card, CodeWell, LoadingSkeleton, MediaArea, SkeletonBlock, Tag],
  templateUrl: './card-structure.component.html',
  styleUrl: './card-structure.component.scss',
})
export class CardStructure {
  readonly scopeId = input.required<GalleryScopeId>();
  readonly showDesignIds = input.required<boolean>();

  protected readonly groups = STRUCTURE_GROUPS;
  protected readonly content = computed(() => CARD_CONTENT[this.scopeId()]);

  /** Sample links go nowhere: keep the review surface on the page, as the gallery page does. */
  protected keepOnPage(event: Event): void {
    if (event.target instanceof Element && event.target.closest('a')) {
      event.preventDefault();
    }
  }
}
