import { describe, expect, it } from "vitest";

import { SYSTEM_PROMPT } from "./prompts.js";

describe("dependency update review policy", () => {
  it("does not require latest-version selection from a clean bump", () => {
    expect(SYSTEM_PROMPT).toContain("nie oceniaj świeżości wersji");
    expect(SYSTEM_PROMPT).toContain("Kwarantanna wydania");
    expect(SYSTEM_PROMPT).toContain("minimumReleaseAge");
    expect(SYSTEM_PROMPT).toContain("testów/dokumentacji za sam bump");
  });
});
