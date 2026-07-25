// Strongly-typed re-export of design tokens.
// Source of truth: src/theme/tokens.json (also drives src/styles/tokens.generated.css).
// MUI receives literal hex values from here so alpha()/lighten()/darken() work.

import tokensJson from "./tokens.json";

export const tokens = tokensJson;

export type Tokens = typeof tokensJson;
export type ColorToken = keyof Tokens["colors"];
export type RadiusToken = keyof Tokens["radius"];
export type ShadowToken = keyof Tokens["shadow"];
