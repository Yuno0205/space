describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Displays correct Hero section titles", () => {
    // Check the Hero section title and subtitle
    cy.contains("Welcome to Space v1.0.0").should("be.visible");
    cy.contains("Initiate your learning warp drive today").should("be.visible");
  });

  it("Navigates correctly when clicking the main button", () => {
    // Check the main call-to-action button
    cy.contains("a", "Visit the English planet")
      .should("have.attr", "href", "/english/dialogue")
      .click();

    cy.url().should("include", "/english/dialogue");
  });

  it("Displays the Explore Cards", () => {
    // Scroll down to Explore section
    cy.contains("Explore the Universe").scrollIntoView().should("be.visible");

    // Check the presence of Explore Cards
    cy.contains("Empathic Voice Interface (EVI)").should("be.visible");
    cy.contains("Learn English with Flashcards").should("be.visible");
    cy.contains("Speaking Practice").should("be.visible");
  });

  it("Displays the Missions section", () => {
    cy.contains("Current Missions").scrollIntoView().should("be.visible");
    // Check the presence of Missions
    cy.contains("Word Voyager: Your Expedition Log").should("be.visible");
  });
});
