
describe("CyberSage — Page and Routing Tests", () => {
  const protectedPages = [
    { name: "Home", path: "/#/Home" },
    { name: "Shop", path: "/#/Shop" },
    { name: "About", path: "/#/about" },
    { name: "System Analyzer", path: "/#/SystemAnalyzer" },
    { name: "Security", path: "/#/security" },
    { name: "Build", path: "/#/build" },
    { name: "Support", path: "/#/support" },
    { name: "Status", path: "/#/status" },
    { name: "Admin Orders", path: "/#/admin/orders" },
    { name: "Order Status", path: "/#/OrderStatus" },
  ];

  const publicPages = [
    { name: "Sign Up", path: "/#/SignUp" },
    { name: "Checkout", path: "/#/checkout" },
    { name: "Product Details", path: "/#/product/test-product" },
    { name: "Orders", path: "/#/orders" },
  ];

  function checkApplicationRendered() {
    cy.get("body").should("be.visible");
    cy.get("#root").should("exist");

    cy.get("#root").should(($root) => {
      expect(
        $root.text().trim().length,
        "The application should render visible text"
      ).to.be.greaterThan(0);
    });
  }

  describe("Protected routes", () => {
    protectedPages.forEach(({ name, path }) => {
      it(`${name} route loads or redirects safely`, () => {
        cy.visit(path);
        checkApplicationRendered();
      });
    });
  });

  describe("Public routes", () => {
    publicPages.forEach(({ name, path }) => {
      it(`${name} route renders without a blank screen`, () => {
        cy.visit(path);
        checkApplicationRendered();
      });
    });
  });

  it("redirects the root route to the application", () => {
    cy.visit("/#/");

    checkApplicationRendered();
  });

  it("renders the Not Found page for an unknown route", () => {
    cy.visit("/#/this-page-does-not-exist");

    cy.contains(/not found|404|page doesn't exist/i).should("be.visible");
  });

  it("loads the CyberSage application shell", () => {
    cy.visit("/#/SignUp");

    cy.get("#root").should("be.visible");
    cy.get("#root").should("not.be.empty");
  });
});
