import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Contact from "../components/Contact";
import "../i18n";

describe("Contact Form Accessibility & Consent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test("form controls have explicit htmlFor and matching ids", () => {
    const { container } = render(<Contact />);

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    expect(nameInput).toHaveAttribute("id", "contact-name");
    const nameLabel = container.querySelector('label[for="contact-name"]');
    expect(nameLabel).toBeInTheDocument();

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    expect(emailInput).toHaveAttribute("id", "contact-email");
    const emailLabel = container.querySelector('label[for="contact-email"]');
    expect(emailLabel).toBeInTheDocument();

    const messageInput = screen.getByRole("textbox", { name: /message/i });
    expect(messageInput).toHaveAttribute("id", "contact-message");
    const messageLabel = container.querySelector('label[for="contact-message"]');
    expect(messageLabel).toBeInTheDocument();

    const consentCheckbox = screen.getByRole("checkbox");
    expect(consentCheckbox).toHaveAttribute("id", "contact-consent");
    const consentLabel = container.querySelector('label[for="contact-consent"]');
    expect(consentLabel).toBeInTheDocument();
    expect(consentLabel).toHaveTextContent(/Privacy Policy/i);
  });

  test("shows validation error when submitted without checking consent", async () => {
    render(<Contact />);

    // Fill name, email, message
    fireEvent.change(screen.getByRole("textbox", { name: /name/i }), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /message/i }), {
      target: { value: "Hello, I would like to discuss a software project." },
    });

    const submitButton = screen.getByRole("button", { name: /start a conversation/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const consentError = screen.getByText(/Please agree to the privacy policy/i);
      expect(consentError).toBeInTheDocument();
      expect(consentError).toHaveAttribute("id", "contact-consent-error");
    });

    // Ensure fetch was NOT called
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("submits successfully when consent is checked and fields are valid", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ message: "Success" }),
    });

    render(<Contact />);

    fireEvent.change(screen.getByRole("textbox", { name: /name/i }), {
      target: { value: "Jane Smith" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /message/i }), {
      target: { value: "Inquiring about engineering services for a scalable web backend." },
    });

    const consentCheckbox = screen.getByRole("checkbox");
    fireEvent.click(consentCheckbox);
    expect(consentCheckbox).toBeChecked();

    const submitButton = screen.getByRole("button", { name: /start a conversation/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/Conversation started/i)).toBeInTheDocument();
    });
  });
});
