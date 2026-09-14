import { render, screen } from "@testing-library/react";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsPage from "../pages/TermsPage";
import CookiePolicyPage from "../pages/CookiePolicyPage";
import "../i18n";

describe("Legal Pages Component Rendering", () => {
  const defaultProps = {
    theme: "Dark",
    changeTheme: jest.fn(),
    lang: "en",
    changeLanguage: jest.fn(),
  };

  test("renders PrivacyPolicyPage with GDPR and Indonesian PDP Law references", () => {
    render(<PrivacyPolicyPage {...defaultProps} />);

    expect(
      screen.getByRole("heading", { level: 1, name: /Privacy Policy/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Ardhi Rahmaan/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PDP Law/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", { level: 2, name: /1\. Data Controller Identity/i }),
    ).toBeInTheDocument();
  });

  test("renders PrivacyPolicyPage in Indonesian when lang is id", () => {
    render(<PrivacyPolicyPage {...defaultProps} lang="id" />);

    expect(
      screen.getByRole("heading", { level: 1, name: /Kebijakan Privasi/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Pengendali Data/i).length).toBeGreaterThan(0);
  });

  test("renders TermsPage with RFQ rules and Indonesian governing law", () => {
    render(<TermsPage {...defaultProps} />);

    expect(
      screen.getByRole("heading", { level: 1, name: /Terms of Service & RFQ Terms/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Request for Quote \(RFQ\)/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(/Governed by Laws of Indonesia/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /3\. Intellectual Property Rights/i }),
    ).toBeInTheDocument();
  });

  test("renders TermsPage in Indonesian when lang is id", () => {
    render(<TermsPage {...defaultProps} lang="id" />);

    expect(
      screen.getByRole("heading", { level: 1, name: /Ketentuan Layanan/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Status Permintaan Penawaran \(RFQ\)/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Hukum Negara Republik Indonesia/i).length,
    ).toBeGreaterThan(0);
  });

  test("renders CookiePolicyPage with storage items breakdown and cookieless telemetry", () => {
    render(<CookiePolicyPage {...defaultProps} />);

    expect(
      screen.getByRole("heading", { level: 1, name: /Cookie & Local Storage Disclosure/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Zero Third-Party Tracking Cookies/i),
    ).toBeInTheDocument();
    expect(screen.getByText("theme")).toBeInTheDocument();
    expect(screen.getByText("i18nextLng")).toBeInTheDocument();
    expect(screen.getByText("admin_token")).toBeInTheDocument();
    expect(
      screen.getAllByText(/Cloudflare Web Analytics/i).length,
    ).toBeGreaterThan(0);
  });

  test("renders CookiePolicyPage in Indonesian when lang is id", () => {
    render(<CookiePolicyPage {...defaultProps} lang="id" />);

    expect(
      screen.getByRole("heading", { level: 1, name: /Pemberitahuan Cookie & Penyimpanan Lokal/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Tanpa Cookie Pelacak Pihak Ketiga/i),
    ).toBeInTheDocument();
    expect(screen.getByText("theme")).toBeInTheDocument();
  });
});
