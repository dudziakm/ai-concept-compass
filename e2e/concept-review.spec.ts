// risk: context/testing/test-plan.md — auth → starter pack → CRUD → review → recommendation breaks across boundaries
// seed: e2e/seed.spec.ts
import { expect, test } from "@playwright/test";

test.describe("Główny przepływ nauki", () => {
  test("pakiet, edycja, review i rekomendacja działają przez prawdziwe API i bazę", async ({ page }) => {
    const editedTitle = `Embeddings i RAG — E2E ${Date.now()}`;

    try {
      // Załaduj idempotentny pakiet na pustym koncie.
      await page.goto("/dashboard");
      const starterResponse = page.waitForResponse(
        (response) => response.url().endsWith("/api/starter-pack") && response.request().method() === "POST",
      );
      await page.getByRole("button", { name: "Załaduj pakiet startowy" }).click();
      expect((await starterResponse).status()).toBe(200);
      await expect(page.getByText("Wszystkie pojęcia")).toBeVisible();

      // Edytuj jedno pojęcie i sprawdź, że wynik przetrwał granicę UI/API/DB.
      const originalTitle = "Embeddings, wyszukiwanie wektorowe i RAG";
      await page.getByRole("button", { name: `Edytuj ${originalTitle}` }).click();
      await page.getByLabel("Nazwa pojęcia").fill(editedTitle);
      const editResponse = page.waitForResponse(
        (response) => response.url().includes("/api/concepts/") && response.request().method() === "PATCH",
      );
      await page.getByRole("button", { name: "Zapisz zmiany" }).click();
      expect((await editResponse).status()).toBe(200);
      await expect(page.getByText(editedTitle, { exact: true })).toBeVisible();

      // Wykonaj review i zweryfikuj biznesowy wynik mastery.
      await page.getByRole("button", { name: new RegExp(editedTitle) }).click();
      await page.getByRole("button", { name: "5", exact: true }).click();
      await page.getByRole("button", { name: "Pokaż wzorzec odpowiedzi" }).click();
      const reviewResponse = page.waitForResponse(
        (response) => response.url().endsWith("/reviews") && response.request().method() === "POST",
      );
      await page.getByRole("button", { name: "Częściowo" }).click();
      expect((await reviewResponse).status()).toBe(201);
      await expect(page.getByLabel("Średnie mastery: 5%")).toBeVisible();

      // Usuń pojęcie wraz z historią i potwierdź skutek widoczny dla użytkownika.
      page.once("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: `Usuń ${editedTitle}` }).click();
      await expect(page.getByText(editedTitle, { exact: true })).not.toBeVisible();
    } finally {
      const response = await page.request.get("/api/concepts");
      if (response.ok()) {
        const payload = (await response.json()) as { concepts: { id: string }[] };
        await Promise.all(payload.concepts.map((concept) => page.request.delete(`/api/concepts/${concept.id}`)));
      }
    }
  });
});
