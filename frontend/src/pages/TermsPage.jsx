import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Calendar,
  Code2,
  FileCheck,
  Globe,
  Scale,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedContent from "../components/react-bits/AnimatedContent";

export default function TermsPage({
  theme,
  changeTheme,
  lang,
  changeLanguage,
}) {
  const { t, i18n } = useTranslation();
  const [classNavbar, setClassNavbar] = useState("bg-transparent");
  const isId = (lang || i18n.language || "en").startsWith("id");

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 25) {
        setClassNavbar(
          "rounded-full bg-white dark:bg-slate-800 bg-opacity-40 backdrop-blur-2xl",
        );
      } else {
        setClassNavbar("bg-transparent");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navProps = { classNavbar, changeTheme, theme, lang, changeLanguage };

  return (
    <div className="min-h-screen bg-cloud/20 font-body transition-colors duration-300 dark:bg-void">
      <Navbar {...navProps} />

      <main className="px-5 pb-24 pt-36 sm:px-8 lg:px-12 lg:pt-44">
        <div className="mx-auto max-w-4xl">
          <AnimatedContent>
            <a
              href="/"
              className="secondary-action mb-8 !px-4 !py-2.5 inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("legal.back_to_home", { defaultValue: "Back to Home" })}
            </a>

            <div className="border-b border-slate-200 pb-8 dark:border-white/10">
              <span className="section-kicker">
                {isId ? "Syarat & Ketentuan Layanan" : "Terms & Conditions"}
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-cloud sm:text-5xl">
                {isId
                  ? "Ketentuan Layanan & Permintaan Penawaran (RFQ)"
                  : "Terms of Service & RFQ Terms"}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {isId
                    ? "Terakhir diperbarui: 14 September 2026"
                    : "Last updated: September 14, 2026"}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5" />
                  {isId
                    ? "Hukum Negara Republik Indonesia"
                    : "Governed by Laws of Indonesia"}
                </span>
              </div>
            </div>

            {/* Key Notice Box */}
            <div className="my-10 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 dark:border-amber-400/30 dark:bg-amber-400/10">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white dark:bg-amber-400 dark:text-slate-950">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold text-slate-900 dark:text-cloud">
                    {isId
                      ? "Penting: Status Permintaan Penawaran (RFQ)"
                      : "Important: Request for Quote (RFQ) Status"}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {isId
                      ? "Pengiriman pesan melalui situs web ini berstatus sebagai permintaan penawaran awal atau eksplorasi kerja sama teknis. Tidak ada kesepakatan komersial yang mengikat sampai adanya kontrak formal (Statement of Work) yang disepakati bersama secara tertulis."
                      : "Inquiries submitted through this portfolio website operate as preliminary Requests for Quote (RFQ) or exploratory discussions. No binding commercial contract, fixed-price commitment, or service agreement is created until formal written terms of engagement are mutually signed."}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Terms */}
            <article className="space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "1. Penerimaan Ketentuan (Acceptance of Terms)"
                    : "1. Acceptance of Terms"}
                </h2>
                <p>
                  {isId
                    ? "Dengan mengakses dan menggunakan situs portofolio ini (termasuk mengirimkan pesan melalui formulir kontak), Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat oleh Ketentuan Layanan ini. Jika Anda tidak menyetujui ketentuan ini, Anda disarankan untuk tidak melanjutkan penggunaan situs ini."
                    : "By accessing and navigating this portfolio website (including submitting information through the contact form), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of this site."}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "2. Sifat Diskusi Proyek & Permintaan Penawaran (RFQ)"
                    : "2. B2B Inquiries & Request for Quote (RFQ) Policy"}
                </h2>
                <p>
                  {isId
                    ? "Semua komunikasi melalui formulir kontak situs ini tunduk pada aturan berikut:"
                    : "All project inquiries, messages, and communications via this website are governed by the following provisions:"}
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>
                      {isId ? "Bukan Penawaran Mengikat:" : "Non-Binding Nature:"}
                    </strong>{" "}
                    {isId
                      ? "Pengiriman formulir kontak tidak mewajibkan kami untuk menyetujui proyek, menyediakan jadwal pengerjaan tertentu, atau menetapkan harga tetap sebelum adanya diskusi teknis yang mendalam."
                      : "Submission of an inquiry does not constitute a legally binding agreement, tender acceptance, or fixed price guarantee until a dedicated Statement of Work (SOW) or commercial contract is executed."}
                  </li>
                  <li>
                    <strong>
                      {isId ? "Kerahasiaan Awal:" : "Preliminary Confidentiality:"}
                    </strong>{" "}
                    {isId
                      ? "Meskipun kami menjaga pesan Anda dengan aman, kami menyarankan agar informasi rahasia tingkat tinggi (seperti rahasia dagang mendalam atau kekayaan intelektual paten yang belum diajukan) baru dibagikan setelah adanya penandatanganan Perjanjian Kerahasiaan (Non-Disclosure Agreement / NDA)."
                      : "While reasonable care is taken to secure your submitted inquiry details, highly sensitive proprietary trade secrets should only be disclosed after executing a formal Non-Disclosure Agreement (NDA)."}
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "3. Hak Kekayaan Intelektual (Intellectual Property)"
                    : "3. Intellectual Property Rights"}
                </h2>
                <p>
                  {isId
                    ? "Seluruh konten pada situs ini—termasuk namun tidak terbatas pada desain antarmuka, tata letak grafis, teks artikel, dokumentasi sistem, dan logo—adalah milik eksklusif Ardhi Rahmaan kecuali dinyatakan lain:"
                    : "All content on this website—including but not limited to interface designs, graphic elements, field note articles, architectural blueprints, and logos—is the exclusive intellectual property of Ardhi Rahmaan unless otherwise attributed:"}
                </p>
                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <div className="rounded-xl border border-slate-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-panel/60">
                    <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-cloud flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-primary" />
                      {isId ? "Proyek Open Source" : "Open Source Repositories"}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {isId
                        ? "Kode sumber yang ditautkan ke repositori publik GitHub tunduk pada lisensi open source masing-masing (misalnya Lisensi MIT)."
                        : "Source code repositories linked to public GitHub repos remain governed by their respective open-source licenses (e.g., MIT License)."}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-panel/60">
                    <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-cloud flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      {isId ? "Portofolio & Hak Cipta Klien" : "Client Work & Trademarks"}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {isId
                        ? "Nama merek dagang atau produk klien yang disebutkan dalam portofolio merupakan hak cipta dan merek dagang milik entitas masing-masing."
                        : "Trademarks, product names, and company emblems displayed in portfolio case studies belong to their respective corporate owners."}
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "4. Penggunaan yang Dilarang (Prohibited Activities)"
                    : "4. Prohibited Uses"}
                </h2>
                <p>
                  {isId
                    ? "Pengunjung dilarang keras melakukan hal-hal berikut saat menggunakan situs ini:"
                    : "You agree not to engage in any of the following restricted activities:"}
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    {isId
                      ? "Melakukan pengujian kerentanan (penetration test), pemindaian port, atau eksploitasi keamanan tanpa izin tertulis."
                      : "Conducting automated vulnerability scanning, port probing, or penetration testing against site servers without explicit authorization."}
                  </li>
                  <li>
                    {isId
                      ? "Mengirimkan pesan spam, muatan berbahaya (malware / XSS / SQL injection), atau konten otomatis ke formulir kontak."
                      : "Submitting malicious payloads, automated spam, SQL injections, or cross-site scripting (XSS) vectors through contact endpoints."}
                  </li>
                  <li>
                    {isId
                      ? "Melakukan scraping data massal atau merekayasa balik (reverse-engineering) endpoint API privat secara tidak wajar."
                      : "Executing unauthorized scraping scripts or abusive high-volume requests targeting private backend APIs."}
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "5. Pelepasan Tanggung Jawab (Disclaimer of Warranties)"
                    : "5. Disclaimer of Warranties"}
                </h2>
                <p>
                  {isId
                    ? "Situs web dan seluruh materi di dalamnya disediakan 'sebagaimana adanya' (as is) dan 'sebagaimana tersedia' (as available). Kami tidak memberikan jaminan tersurat maupun tersirat mengenai ketiadaan kesalahan teknis atau keandalan tanpa henti dari tautan demo pihak ketiga."
                    : "This website, its live demos, and related materials are provided on an 'as is' and 'as available' basis without warranties of any kind, whether express or implied. We do not warrant that external third-party demonstration links will remain permanently uninterrupted or error-free."}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "6. Batasan Tanggung Jawab (Limitation of Liability)"
                    : "6. Limitation of Liability"}
                </h2>
                <p>
                  {isId
                    ? "Sepanjang diizinkan oleh hukum yang berlaku, pemilik situs tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial yang timbul dari akses atau ketidakmampuan Anda mengakses situs web ini."
                    : "To the maximum extent permitted by applicable law, in no event shall the author be liable for any indirect, punitive, incidental, or consequential damages resulting from the use or inability to use this showcase website."}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "7. Hukum yang Berlaku & Yurisdiksi (Governing Law)"
                    : "7. Governing Law & Dispute Resolution"}
                </h2>
                <p>
                  {isId
                    ? "Ketentuan Layanan ini diatur oleh dan ditafsirkan sesuai dengan Hukum Negara Republik Indonesia. Setiap perselisihan yang timbul sehubungan dengan ketentuan ini akan diselesaikan terlebih dahulu melalui musyawarah untuk mufakat. Apabila tidak tercapai mufakat, perselisihan akan diselesaikan melalui yurisdiksi pengadilan negeri yang berwenang di Indonesia."
                    : "These Terms of Service are governed by and construed in accordance with the substantive laws of the Republic of Indonesia. Any disputes arising in connection with these terms shall first be addressed through good-faith amicable consultation. Failing mutual agreement, disputes shall be submitted to the exclusive jurisdiction of the competent courts in Indonesia."}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId ? "8. Kontak Hukum" : "8. Contact for Legal Inquiries"}
                </h2>
                <p>
                  {isId ? (
                    <>
                      Pertanyaan terkait Ketentuan Layanan ini dapat dikirimkan
                      ke alamat email:{" "}
                      <a
                        href="mailto:ardhirahmaan17@gmail.com"
                        className="text-primary underline font-medium hover:text-primary-hover"
                      >
                        ardhirahmaan17@gmail.com
                      </a>
                      .
                    </>
                  ) : (
                    <>
                      Questions regarding these Terms of Service may be directed
                      to:{" "}
                      <a
                        href="mailto:ardhirahmaan17@gmail.com"
                        className="text-primary underline font-medium hover:text-primary-hover"
                      >
                        ardhirahmaan17@gmail.com
                      </a>
                      .
                    </>
                  )}
                </p>
              </section>
            </article>
          </AnimatedContent>
        </div>
      </main>

      <Footer />
    </div>
  );
}
