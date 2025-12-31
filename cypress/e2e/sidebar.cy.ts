describe("Sidebar Navigation", () => {
  beforeEach(() => {
    cy.visit("/"); // Sidebar is present on all pages
  });

  it("Displays the search input", () => {
    cy.get('input[type="search"]').should("exist");
  });

  it("Displays English menu group and sub-links", () => {
    // Check the English menu group
    cy.contains("span", "English").should("exist");

    // Ensure sub-links are visible (assuming the collapsible is open by default)
    cy.contains("a", "Overview").should("be.visible");
    cy.contains("a", "Vocabulary").should("be.visible");
    cy.contains("a", "Talk with EVI").should("be.visible");
  });

  it("Navigates correctly from the Sidebar", () => {
    // Click to the English Overview link
    cy.contains("a", "Overview").click();

    // Check URL changes to /english
    cy.url().should("include", "/english");

    // Check the content of the English page (based on app/english/page.tsx)
    cy.get("h1").contains("Overview").should("be.visible");
  });

  it("Checks the active state of the link", () => {
    cy.visit("/dashboard");

    // Check that the Dashboard link is active (has specific styling classes)
    cy.contains("a", "Dashboard")
      .should("have.class", "font-medium")
      .and("have.class", "text-white");
  });
});
