describe("Sidebar Navigation", () => {
  beforeEach(() => {
    cy.visit("/"); //Sidebar is present on all pages
  });

  it("Hiển thị ô tìm kiếm", () => {
    cy.get('input[type="search"]').should("exist");
  });

  it("Hiển thị nhóm menu English và các link con", () => {
    // Check the English menu group
    cy.contains("span", "English").should("exist");

    cy.contains("a", "Overview").should("be.visible");
    cy.contains("a", "Vocabulary").should("be.visible");
    cy.contains("a", "Talk with EVI").should("be.visible");
  });

  it("Điều hướng hoạt động chính xác từ Sidebar", () => {
    // Click to the English Overview link
    cy.contains("a", "Overview").click();

    // Check URL changes to /english
    cy.url().should("include", "/english");

    // Check the content of the English page (based on app/english/page.tsx)
    cy.get("h1").contains("Overview").should("be.visible");
  });

  it("Kiểm tra trạng thái Active của link", () => {
    cy.visit("/dashboard");
    // Check that the Dashboard link is active

    cy.contains("a", "Dashboard")
      .should("have.class", "font-medium")
      .and("have.class", "text-white");
  });
});
