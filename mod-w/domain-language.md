# Domain Language

**Project:** brand-ui  
**Status:** Approved with Architecture Definition, 2026-10-18

---

## Ownership and enforcement

The Tech Lead owns this vocabulary. Code, tests, documentation, Steps, and reviews must use it consistently.

## Terms

| Term                     | Definition                                                                                                                       | Code form                 | Avoid                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------- |
| Brand                    | One client visual identity. There are exactly three.                                                                             | `BrandId`                 | Calling CodeCraft Dark a brand        |
| ArtAnon Shop             | Real third-party business represented only by an unofficial concept, palette values, and text wordmark.                          | `'artanon'`               | Client rollout, official rebrand      |
| IT English Mentor        | New brand for the Moderator's venture.                                                                                           | `'mentor'`                | User-facing shorthand                 |
| CodeCraft Academy        | Placeholder brand with two styling modes.                                                                                        | `'codecraft'`             | Treating each mode as a brand         |
| Styling mode             | A value set within one brand. Only CodeCraft has Light and Dark.                                                                 | `CodeCraftMode`           | General dark mode                     |
| Theme selection          | A valid brand plus its required styling mode.                                                                                    | `ThemeSelection`          | Skin, brand key                       |
| Gallery scope            | One themed host subtree. Four may render simultaneously.                                                                         | gallery-local scope type  | Brand when referring to a panel       |
| Semantic token           | A named design role filled by every resolved scope.                                                                              | `--bui-*`                 | Brand variable                        |
| Token contract           | Complete required set of semantic token names.                                                                                   | token-name list           | Palette contract                      |
| On-color token           | Foreground token intended for content on a named fill.                                                                           | `on-primary`, `on-accent` | Inverse color                         |
| Theme service            | Service owning application selection and attachment rules.                                                                       | `ThemeService`            | Brand service                         |
| Theme scope              | Directive attaching one theme selection to its host subtree.                                                                     | `ThemeScopeDirective`     | Theme provider component              |
| Component state          | Approved default, hover, active, focus, disabled, loading, empty, or error state.                                                | native/input state        | Mode                                  |
| Forced state             | Gallery-owned persistent visual specimen using inherited internal variables.                                                     | `data-specimen-state`     | Public preview state, `.is-*`         |
| Long-label case          | Constrained-width test of button wrapping and navigation clamping.                                                               | specimen/test data        | Stress text                           |
| Interactive card         | Card with one stretched native title link and one tab stop.                                                                      | card with `href`          | Clickable div                         |
| Static card              | Card with no link or activation.                                                                                                 | card without `href`       | Disabled card                         |
| Current navigation item  | Enabled destination representing the current page.                                                                               | `current: true`           | Selected item                         |
| Disabled navigation item | Non-link item that cannot focus or activate.                                                                                     | `disabled: true`          | Disabled link                         |
| Design ID                | Stable `DS-nnn` identifier for approved design behavior.                                                                         | specimen metadata         | Component ID                          |
| About panel              | Gallery-owned modal explanation of the project, brands, library, gallery relationship, and gallery use; not a library component. | `AboutPanel`              | About component in `ui`, page, drawer |
| About trigger            | Top-bar library button that opens the About panel and receives restored focus when it closes.                                    | `aboutTrigger`            | Navigation item, About link           |
| First visit              | Browser profile in which the versioned About-seen key is absent; storage failure falls back to once per page load.               | `ABOUT_SEEN_STORAGE_KEY`  | First route, first session            |
| Reference spike          | Exploratory implementation, not production delivery.                                                                             | README wording            | Production library                    |
| Reference Implementation | Prototype code explicitly granted a Step disposition. None exists here.                                                          | Step disposition          | Visual reference                      |

## Ratification of design proposals

| Proposed term   | Disposition | Rationale                                         |
| --------------- | ----------- | ------------------------------------------------- |
| Brand           | Modified    | CodeCraft modes are excluded from the brand count |
| Semantic token  | Ratified    | Matches AC-1 and the CSS contract                 |
| On-color token  | Ratified    | Makes contrast relationships explicit             |
| Long-label case | Ratified    | Matches S-5 and AC-10                             |
| Design ID       | Ratified    | Required traceability term                        |
| Forced state    | Modified    | Gallery-owned, not a public component-state API   |

## Rules

- Say “three brands across four gallery scopes,” never “four brands.”
- `ThemeSelection` is the canonical brand/mode choice.
- “Dark” never implies a cross-brand dark-mode feature.
- Disabled and loading differ: a loading button remains focusable but suppresses activation.
- Full DOM text is the accessible name; `title` is supplemental only.
- Prototype files are visual evidence, not a Reference Implementation.
- The About panel carries no Design ID; trace it through AC-17 and show no placeholder badge.

---

MOD-W v5.0.1
