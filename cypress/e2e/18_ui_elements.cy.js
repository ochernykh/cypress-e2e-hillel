describe("Basic UI elements check on qauto.forstudy.space", () => {
  beforeEach(() => {
    cy.visit("https://qauto.forstudy.space", {
      auth: {
        username: "guest",
        password: "welcome2qauto",
      },
    });
  });

  describe("Header section", () => {
    it("should display navigation buttons", () => {
      cy.get('a[href="/"]').contains("Home").should("be.visible");
      cy.get('button[appscrollto="aboutSection"]').should("be.visible");
      cy.get('button[appscrollto="contactsSection"]').should("be.visible");
    });

    it("should display authentication buttons", () => {
      cy.contains("button", "Guest log in").should("be.visible");
      cy.get("button.btn-outline-white")
        .contains("Sign In")
        .should("be.visible");
    });
  });

  describe("Hero section", () => {
    it("should contain main title and description", () => {
      cy.get("h1.hero-descriptor_title").should("contain.text", "Do more!");
      cy.get(".hero-descriptor_descr").should(
        "contain.text",
        "With the help of the Hillel auto project"
      );
    });

    it("should have Sign up button and embedded video", () => {
      cy.get("button.btn-primary").contains("Sign up").should("be.visible");
      cy.get('iframe[src*="youtube.com/embed"]').should("exist");
    });
  });

  describe("About section", () => {
    beforeEach(() => {
      cy.get("#aboutSection").scrollIntoView().should("exist");
    });

    it("should contain Log fuel expenses block", () => {
      cy.get("#aboutSection").within(() => {
        cy.contains("p.h2", "Log fuel expenses").should("be.visible");
        cy.contains("p.lead", "Keep track of your replacement schedule").should(
          "be.visible"
        );
      });
    });

    it("should contain Instructions and manuals block", () => {
      cy.get("#aboutSection").within(() => {
        cy.contains("p.h2", "Instructions and manuals").should("be.visible");
        cy.contains("p.lead", "Watch over 100 instructions").should(
          "be.visible"
        );
      });
    });

    it("should display exactly two images", () => {
      cy.get("#aboutSection img").should("have.length", 2);
    });
  });

  describe("Contacts section", () => {
    it("should contain ithillel.ua link", () => {
      cy.get("#contactsSection").within(() => {
        cy.get("a")
          .contains("ithillel.ua")
          .should("have.attr", "href")
          .and("include", "ithillel.ua");
      });
    });

    it("should contain support email", () => {
      cy.get("#contactsSection").within(() => {
        cy.get("a")
          .contains("support@ithillel.ua")
          .should("have.attr", "href")
          .and("include", "mailto:developer@ithillel.ua");
      });
    });

    it("should contain all social media links", () => {
      cy.get("#contactsSection").within(() => {
        [
          "facebook.com",
          "t.me",
          "youtube.com",
          "instagram.com",
          "linkedin.com",
        ].forEach((domain) => {
          cy.get(`a[href*="${domain}"]`).should("exist");
        });
      });
    });
  });

  describe("Footer section", () => {
    it("should display copyright", () => {
      cy.get("footer").within(() => {
        cy.contains("© 2021 Hillel IT school").should("be.visible");
      });
    });
  });
});
