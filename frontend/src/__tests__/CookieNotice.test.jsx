import { render, screen, fireEvent } from "@testing-library/react";
import CookieNotice from "../components/CookieNotice";
import "../i18n";

describe("CookieNotice Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders when cookie notice has not been acknowledged", () => {
    render(<CookieNotice />);

    expect(
      screen.getByRole("region", { name: /Storage & Cookie Notice/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/This site uses local storage only to remember your theme and language preferences/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Learn more/i })).toHaveAttribute(
      "href",
      "/cookie-policy",
    );
  });

  test("clicking accept button saves to localStorage and dismisses the notice", () => {
    render(<CookieNotice />);

    const acceptBtn = screen.getByRole("button", { name: /Got it/i });
    fireEvent.click(acceptBtn);

    expect(localStorage.getItem("cookie_notice_accepted")).toBe("true");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  test("does not render when cookie notice was previously acknowledged", () => {
    localStorage.setItem("cookie_notice_accepted", "true");

    render(<CookieNotice />);

    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
});
