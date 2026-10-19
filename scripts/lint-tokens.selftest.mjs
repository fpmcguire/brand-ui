// Regression fixtures for the component-style rules in token-rules.mjs: every evasion category the
// Tech Lead found must be detected, and clean token-only CSS must stay clean.
import { checkStyleText, inlineStyles, templateStyles } from './token-rules.mjs';

const mustFail = {
  'unitless zero radius': '.a { border-radius: 0; }',
  'unitless zero corner radius': '.a { border-top-right-radius: 0 }',
  'unitless zero padding': '.a { padding: 0; }',
  'unitless zero gap': '.a { gap: 0; }',
  'unitless zero elevation': '.a { box-shadow: 0 0 var(--bui-color-border); }',
  'unitless zero in governed custom property': '.a { --_radius: 0; }',
  'shorthand padding': '.a { padding: 0 var(--bui-space-2); }',
  'shorthand radius': '.a { border-radius: 0 var(--bui-radius-card); }',
  'shorthand length': '.a { padding: var(--bui-space-2) 8px; }',
  'zero inside calc': '.a { border-radius: calc(var(--bui-radius-card) + 0); }',
  'length inside calc': '.a { padding: calc(var(--bui-space-2) + 4px); }',
  'unitless zero var fallback': '.a { border-radius: var(--bui-radius-card, 0); }',
  'length var fallback': '.a { padding: var(--bui-space-2, 8px); }',
  'color var fallback': '.a { color: var(--bui-color-text, #123456); }',
  'nested zero radius': '.a { &:hover { border-radius: 0; } }',
  'dot-zero radius': '.a { border-radius: .0; }',
  'exponent-zero radius': '.a { border-radius: 0e0; }',
  'dot-zero elevation shorthand': '.a { box-shadow: .0 .0 var(--bui-color-border); }',
  'signed exponent-zero padding': '.a { padding: +0e-0; }',
  // Exponent-form and uppercase dimensions: the old LENGTH rule missed all of these.
  'exponent-zero px radius': '.a { border-radius: 0e0px; }',
  'uppercase exponent-zero rem radius': '.a { border-radius: 0E0rem; }',
  'signed exponent-zero em padding': '.a { padding: +0e-0em; }',
  'negative signed exponent-zero vw margin': '.a { margin: -0e-0vw; }',
  'dot-zero exponent vh gap': '.a { gap: .0e0vh; }',
  'nonzero exponent px padding': '.a { padding: 1e1px; }',
  'fractional exponent px padding': '.a { padding: 0.5e1px; }',
  'exponent ch top': '.a { top: 2e0ch; }',
  'exponent zero px inside calc': '.a { border-radius: calc(var(--bui-radius-card) + 0e0px); }',
  'exponent zero px var fallback': '.a { border-radius: var(--bui-radius-card, 0e0px); }',
  'exponent zero px elevation': '.a { box-shadow: 0e0px 0e0px var(--bui-color-border); }',
  'exponent px in a non-governed property': '.a { min-width: 1e1px; }',
  'uppercase px padding': '.a { padding: 4PX; }',
  'uppercase unit radius': '.a { border-radius: 1.5REM; }',
  'uppercase zero px radius': '.a { border-radius: 0PX; }',
  'uppercase exponent REM radius': '.a { border-radius: 0E0REM; }',
  // Boundary fixtures: the old rule found only a partial or no match; the new rule must match the
  // whole literal. `-0e+0vw` was accidentally flagged by the old rule as its tail `0vw`.
  'signed plus-exponent vw margin': '.a { margin: -0e+0vw; }',
  'exponent form of allowlisted width is not allowlisted': '.a { width: 1e0px; }',
  'exponent form of allowlisted margin is not allowlisted': '.a { margin: -1e0px; }',
};
const inlineMustFail = {
  'inline styles array': '@Component({ styles: [`:host { border-radius: 0; }`] }) class A {}',
  'inline styles string, minified': "@Component({ styles: ':host{padding:4px}' }) class A {}",
  'inline styles second entry':
    '@Component({ styles: [":host { }", ":host { gap: 0 }"] }) class A {}',
  'inline styles var fallback':
    '@Component({ styles: `:host { margin: var(--x, 2px) }` }) class A {}',
  'inline styles exponent-zero px':
    '@Component({ styles: [`:host { border-radius: 0e0px }`] }) class A {}',
};
const templateMustFail = {
  'template unitless zero radius': '<div style="border-radius: 0">x</div>',
  'template unitless zero padding, single-quoted': "<div style='padding: 0'>x</div>",
  'template unitless zero gap, minified': '<div style="gap:0">x</div>',
  'template unitless zero elevation':
    '<div style="box-shadow: 0 0 var(--bui-color-border)">x</div>',
  'template shorthand padding': '<div style="padding: 0 var(--bui-space-2)">x</div>',
  'template shorthand radius': '<div style="border-radius: 0 var(--bui-radius-card)">x</div>',
  'template literal length': '<div style="padding: 4px">x</div>',
  'template literal length in shorthand': '<div style="margin: var(--bui-space-2) 8px">x</div>',
  'template calc length': '<div style="padding: calc(var(--bui-space-2) + 4px)">x</div>',
  'template calc zero': '<div style="border-radius: calc(var(--bui-radius-card) + 0)">x</div>',
  'template var fallback length': '<div style="padding: var(--bui-space-2, 8px)">x</div>',
  'template var fallback zero': '<div style="border-radius: var(--bui-radius-card, 0)">x</div>',
  'template literal hex color': '<div style="color: #123456">x</div>',
  'template literal color function': '<div style="background: rgb(0 0 0)">x</div>',
  'template color var fallback': '<div style="color: var(--bui-color-text, #123)">x</div>',
  'template governed custom property': '<div style="--_radius: 0">x</div>',
  'template multiline':
    '<div\n  style="\n    color: var(--bui-color-text);\n    padding: 4px;\n  "\n>x</div>',
  'template minified, no trailing semicolon': '<div style="padding:4px">x</div>',
  'template second declaration': '<div style="margin:0;gap:0">x</div>',
  'template nested element':
    '<section class="a"><p>y</p><span style="border-radius:0">x</span></section>',
  'template uppercase attribute': '<div STYLE="padding: 4px">x</div>',
  'template spaces around equals': '<div style = "padding: 4px">x</div>',
  'template after another attribute': '<a href="/x" style="border-radius: 0">x</a>',
  'template dot-zero radius': '<div style="border-radius: .0">x</div>',
  'template dot-zero radius, single-quoted': "<div style='border-radius: .0'>x</div>",
  'template exponent-zero radius': '<div style="border-radius: 0e0">x</div>',
  'template exponent-zero radius, single-quoted': "<div style='border-radius: 0e0'>x</div>",
  'template uppercase exponent-zero gap': '<div style="gap: 0E0">x</div>',
  'template signed exponent-zero padding': '<div style="padding: +0e-0">x</div>',
  'template dot-zero elevation': '<div style="box-shadow: .0 .0 var(--bui-color-border)">x</div>',
  'template dot-zero var fallback':
    '<div style="border-radius: var(--bui-radius-card, .0)">x</div>',
  'template exponent-zero in calc':
    '<div style="border-radius: calc(var(--bui-radius-card) + 0e0)">x</div>',
  'template dot-zero margin is not allowlisted': '<div style="margin: .0">x</div>',
  'template exponent-zero px radius': '<div style="border-radius: 0e0px">x</div>',
  'template exponent-zero px radius, single-quoted': "<div style='border-radius: 0e0px'>x</div>",
  'template uppercase exponent-zero rem radius': '<div style="border-radius: 0E0rem">x</div>',
  'template uppercase exponent-zero REM radius': '<div style="border-radius: 0E0REM">x</div>',
  'template signed exponent-zero em padding': '<div style="padding: +0e-0em">x</div>',
  'template signed exponent-zero vw margin': '<div style="margin: -0e-0vw">x</div>',
  'template nonzero exponent px padding': '<div style="padding: 1e1px">x</div>',
  'template uppercase px padding': '<div style="padding: 4PX">x</div>',
  'template exponent px in calc':
    '<div style="border-radius: calc(var(--bui-radius-card) + 0e0px)">x</div>',
  'template exponent px var fallback':
    '<div style="border-radius: var(--bui-radius-card, 0e0px)">x</div>',
  'template minified dot-zero exponent vh gap': '<div style="gap:.0e0vh">x</div>',
};
const templateMustPass = {
  'template tokens only':
    '<div style="border-radius: var(--bui-radius-card); padding: var(--bui-space-2)">x</div>',
  'template allowed structural margin and inset': '<div style="margin: 0; inset: 0">x</div>',
  'template allowed visually-hidden': '<span style="width:1px;height:1px;margin:-1px">x</span>',
  'template non-governed properties':
    '<div style="min-width: 0; flex: 0 0 auto; z-index: 0; opacity: 0; line-height: 1.5; width: 60%">x</div>',
  'template bindings and look-alikes':
    '<div [style.border-radius.px]="0" [attr.style]="s" data-style="padding:4px" ng-style="padding:4px">x</div>',
  'template without style attribute': '<div class="a"><p>x</p></div>',
  'template style in HTML comment': '<!-- <div style="padding:4px"> --><p>x</p>',
  'template empty style': '<div style="">x</div>',
  'template structural zero allowances, single-quoted': "<div style='margin: 0; inset: 0'>x</div>",
  'template zero-lookalikes in governed properties':
    '<div style="top: 10%; left: 100%; margin: 0; padding: var(--bui-space-0); gap: var(--bui-space-10)">x</div>',
  'template non-governed zero spellings':
    '<div style="min-width: .0; flex: 0e0 0 auto; z-index: 0.0; opacity: 0e0">x</div>',
  'template exponent and number lookalikes':
    '<div style="top: 0e0%; left: 100%; width: 100%; line-height: 1.05; z-index: 10; flex-grow: 0.5; transition: opacity 1e-1s; padding: var(--bui-space-10); margin: var(--bui-space-0)">x</div>',
};
const mustPass = {
  'tokens only':
    '.a { border-radius: var(--bui-radius-card); padding: var(--bui-space-2) var(--bui-space-4); }',
  'state variable chain': '.a { background: var(--bui-state-bg, var(--_bg)); }',
  'allowed structural constants':
    '.a { margin: 0; inset: 0; width: 1px; height: 1px; margin: -1px; width: 60%; aspect-ratio: 4 / 3; line-height: 1.5; min-width: 0; opacity: 0; }',
  'non-governed zero': '.a { min-width: 0; flex: 0 0 auto; z-index: 0; }',
  'plain numbers and percentages':
    '.a { top: 10%; left: 100%; width: 100%; line-height: 1.05; z-index: 10; flex-grow: 0.5; }',
  'exponent percentage in governed and non-governed properties':
    '.a { top: 0e0%; width: 0e0%; flex: 1e0 1e0 0e0%; aspect-ratio: 1e0 / 1; }',
  'exponent time and unitless number are not governed lengths':
    '.a { transition: opacity 1e1s; animation-duration: 1e-1s; line-height: 1e0; }',
  'token names that end in digits':
    '.a { margin: var(--bui-space-0); padding: var(--bui-space-10); gap: var(--bui-space-1e1); }',
};

const failures = [];
const expectFail = (name, css) => {
  if (checkStyleText(css).length === 0) failures.push(`not detected: ${name}`);
};
for (const [name, css] of Object.entries(mustFail)) expectFail(name, css);
for (const [name, ts] of Object.entries(inlineMustFail)) {
  const found = inlineStyles(ts);
  if (found.length === 0) failures.push(`inline styles not extracted: ${name}`);
  else expectFail(name, found.join('\n'));
}
for (const [name, html] of Object.entries(templateMustFail)) {
  const found = templateStyles(html);
  if (found.length === 0) failures.push(`template style not extracted: ${name}`);
  else expectFail(name, found.join('\n'));
}
for (const [name, css] of Object.entries(mustPass)) {
  const messages = checkStyleText(css);
  if (messages.length) failures.push(`false positive: ${name} -> ${messages.join('; ')}`);
}
for (const [name, html] of Object.entries(templateMustPass)) {
  const messages = templateStyles(html).flatMap(checkStyleText);
  if (messages.length) failures.push(`false positive: ${name} -> ${messages.join('; ')}`);
}

if (failures.length) {
  console.error(`lint:tokens self-test failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
const total =
  Object.keys(mustFail).length +
  Object.keys(inlineMustFail).length +
  Object.keys(templateMustFail).length;
const clean = Object.keys(mustPass).length + Object.keys(templateMustPass).length;
console.log(
  `lint:tokens self-test passed (${total} evasion fixtures detected; ${clean} clean fixtures accepted).`,
);
