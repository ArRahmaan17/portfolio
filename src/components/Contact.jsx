import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function Contact() {
  let { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const contacts = [
    {
      name: "Email",
      description: "ardrah17@gmail.com",
      link: "mailto:ardrah17@gmail.com",
    },
    {
      name: "Github",
      description: "github.com/ArRahmaan17",
      link: "https://github.com/ArRahmaan17/",
    },
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess(false);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="dark:bg-black" id="contact">
      <div className="relative isolate px-6 py-16 lg:px-8 lg:py-56">
        <div className="mx-auto max-w-4xl lg:text-center">
          <h2 className="pt-8 text-2xl md:text-4xl lg:text-6xl dark:text-gray-100">
            {t("contact")}
          </h2>

          <p className="mt-6 text-lg dark:text-gray-100">
            {t("short_contact")}
          </p>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col gap-4 max-w-xl mx-auto"
          >
            <input
              type="text"
              name="name"
              placeholder={t("name")}
              value={form.name}
              onChange={handleChange}
              required
              className="p-3 rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
            />

            <input
              type="email"
              name="email"
              placeholder={t("email")}
              value={form.email}
              onChange={handleChange}
              required
              className="p-3 rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
            />

            <textarea
              name="message"
              placeholder={t("message")}
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
              className="p-3 rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white dark:bg-white dark:text-black p-3 rounded hover:opacity-80"
            >
              {loading ? "Sending..." : t("send")}
            </button>

            {success && (
              <p className="text-green-500">
                {t("message_sent") || "Message sent!"}
              </p>
            )}
          </form>
          <p className="mt-12 text-center text-sm text-gray-500">Since 2022</p>
        </div>
      </div>
    </div>
  );
}