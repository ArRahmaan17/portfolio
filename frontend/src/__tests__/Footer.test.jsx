import { render, screen } from "@testing-library/react";
import Footer from "../components/Footer";
import "../i18n";

describe("Footer Component", () => {
  test("renders legal links and copyright information", () => {
    render(<Footer />);

    expect(screen.getByText("Ardhi Rahmaan")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    const privacyLink = screen.getByRole("link", { name: /Privacy Policy/i });
    expect(privacyLink).toHaveAttribute("href", "/privacy");

    const termsLink = screen.getByRole("link", { name: /Terms of Service/i });
    expect(termsLink).toHaveAttribute("href", "/terms");

    const cookieLink = screen.getByRole("link", { name: /Cookie Notice/i });
    expect(cookieLink).toHaveAttribute("href", "/cookie-policy");

    const githubLink = screen.getByRole("link", { name: /GitHub profile/i });
    expect(githubLink).toHaveAttribute("href", "https://github.com/ArRahmaan17");

    const topButton = screen.getByRole("button", { name: /Back to top/i });
    expect(topButton).toBeInTheDocument();
  });
});
