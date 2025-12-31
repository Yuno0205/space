describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Hiển thị đúng tiêu đề Hero section", () => {
    // Check the Hero section title and subtitle
    cy.contains("Welcome to Space v1.0.0").should("be.visible");
    cy.contains("Initiate your learning warp drive today").should("be.visible");
  });

  it("Điều hướng đúng khi click nút chính", () => {
    // Check the main call-to-action button
    cy.contains("a", "Visit the English planet")
      .should("have.attr", "href", "/english/dialogue")
      .click();

    cy.url().should("include", "/english/dialogue");
  });

  it("Hiển thị các thẻ Explore Card", () => {
    // Scroll down to Explore section
    cy.contains("Explore the Universe").scrollIntoView().should("be.visible");

    // Check the presence of Explore Cards
    cy.contains("Empathic Voice Interface (EVI)").should("be.visible");
    cy.contains("Learn English with Flashcards").should("be.visible");
    cy.contains("Speaking Practice").should("be.visible");
  });

  it("Hiển thị section Missions", () => {
    cy.contains("Current Missions").scrollIntoView().should("be.visible");
    // Check the presence of Missions
    cy.contains("Word Voyager: Your Expedition Log").should("be.visible");
  });
});
