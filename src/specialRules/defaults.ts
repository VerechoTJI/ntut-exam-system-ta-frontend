import type { SpecialRule } from "./types";

export function createDefaultSpecialRule(overrides?: Partial<SpecialRule>): SpecialRule {
  const base: SpecialRule = {
    id: crypto.randomUUID(),
    type: "regex",
    constraint: "MUST_NOT_HAVE",
    message: "",
    severity: "warn",
    params: {
      pattern: "",
      flags: "",
    },
  };

  return { ...base, ...(overrides ?? {}) };
}
