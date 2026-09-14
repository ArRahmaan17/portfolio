import { render, screen } from "@testing-library/react";
import App from "../App";
import "../i18n";

describe("App Legal Routing", () => {
  const originalLocation = window.location;

  afterEach(() => {
    delete window.location;
    window.location = originalLocation;
  });

  const setPathname = (path) => {
    delete window.location;
    window.location = new URL(`https://example.com${path}`);
  };

  test("renders PrivacyPolicyPage when pathname is /privacy", () => {
    setPathname("/privacy");
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Privacy Policy/i }),
    ).toBeInTheDocument();
  });

  test("renders TermsPage when pathname is /terms", () => {
    setPathname("/terms");
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Terms of Service/i }),
    ).toBeInTheDocument();
  });

  test("renders CookiePolicyPage when pathname is /cookie-policy", () => {
    setPathname("/cookie-policy");
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Cookie & Local Storage Disclosure/i }),
    ).toBeInTheDocument();
  });
});
