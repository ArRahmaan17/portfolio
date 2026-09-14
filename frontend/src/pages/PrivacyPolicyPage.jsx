import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Lock,
  Scale,
  Shield,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedContent from "../components/react-bits/AnimatedContent";

export default function PrivacyPolicyPage({
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
                {isId ? "Kepatuhan & Privasi Data" : "Legal & Data Privacy"}
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-cloud sm:text-5xl">
                {isId ? "Kebijakan Privasi" : "Privacy Policy"}
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
                    ? "Sesuai UU PDP No. 27/2022 & GDPR"
                    : "Compliant with Indonesian PDP Law & GDPR principles"}
                </span>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="my-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 dark:border-primary/30 dark:bg-primary/10">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-contrast">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold text-slate-900 dark:text-cloud">
                    {isId ? "Ringkasan Singkat" : "Key Privacy Commitments"}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {isId
                      ? "Website ini adalah portofolio rekayasa perangkat lunak profesional. Kami menghargai privasi Anda sepenuhnya:"
                      : "This website serves as a professional software engineering showcase. Your data privacy is respected:"}
                  </p>
                  <ul className="mt-3 grid gap-2 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span>
                        {isId
                          ? "Hanya memproses data form kontak yang Anda kirimkan"
                          : "Only processes contact form data you voluntarily submit"}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span>
                        {isId
                          ? "Tanpa piksel pelacak iklan atau penjualan data"
                          : "Zero ad tracking pixels or data monetization"}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span>
                        {isId
                          ? "Penyimpanan lokal hanya untuk tema dan bahasa"
                          : "Local storage used only for theme and language"}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span>
                        {isId
                          ? "Hak penuh untuk menghapus data Anda kapan saja"
                          : "Full right to request deletion of your messages anytime"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Legal Document Content */}
            <article className="space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "1. Pengendali Data (Data Controller)"
                    : "1. Data Controller Identity"}
                </h2>
                <p>
                  {isId ? (
                    <>
                      Pengendali data pribadi untuk situs web ini adalah{" "}
                      <strong className="text-slate-900 dark:text-cloud">
                        Ardhi Rahmaan
                      </strong>{" "}
                      (Backend Engineer & System Architect), berkedudukan di
                      Indonesia. Jika Anda memiliki pertanyaan tentang
                      pemrosesan data atau ingin menggunakan hak privasi Anda,
                      silakan hubungi kami melalui email:{" "}
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
                      The data controller responsible for personal data processed
                      through this website is{" "}
                      <strong className="text-slate-900 dark:text-cloud">
                        Ardhi Rahmaan
                      </strong>{" "}
                      (Backend Engineer & System Architect), located in
                      Indonesia. For any questions regarding your data privacy or
                      to exercise your legal rights, please contact:{" "}
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

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "2. Data Pribadi yang Kami Kumpulkan"
                    : "2. Personal Data We Collect"}
                </h2>
                <p>
                  {isId
                    ? "Kami hanya mengumpulkan informasi yang Anda berikan secara sukarela dan data teknis mendasar untuk keamanan server:"
                    : "We only collect data voluntarily submitted by you or strictly necessary for infrastructure security:"}
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>
                      {isId ? "Formulir Kontak:" : "Contact Form Inquiries:"}
                    </strong>{" "}
                    {isId
                      ? "Nama lengkap, alamat email, dan isi pesan atau rincian pertanyaan proyek yang Anda kirimkan."
                      : "Full name, email address, and inquiry message content submitted via the contact form."}
                  </li>
                  <li>
                    <strong>
                      {isId
                        ? "Log Teknis & Keamanan:" : "Technical & Security Logs:"}
                    </strong>{" "}
                    {isId
                      ? "Alamat IP, jenis browser (User-Agent), dan timestamp akses yang secara otomatis dicatat oleh server/reverse-proxy untuk perlindungan terhadap serangan denial-of-service (DDoS) dan pencegahan penyalahgunaan."
                      : "Internet Protocol (IP) address, User-Agent header, and request timestamps automatically logged by edge infrastructure to prevent denial-of-service (DDoS) attacks and abusive automated spam."}
                  </li>
                  <li>
                    <strong>
                      {isId ? "Preferensi Lokal:" : "Client Preferences:"}
                    </strong>{" "}
                    {isId
                      ? "Pilihan tema visual (Light / Dark) dan bahasa (English / Indonesia) disimpan langsung di browser Anda melalui localStorage."
                      : "Visual theme choice (Light / Dark) and language code (en / id) persisted in your browser's localStorage."}
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "3. Dasar Hukum & Tujuan Pemrosesan"
                    : "3. Legal Basis & Purposes of Processing"}
                </h2>
                <p>
                  {isId
                    ? "Pemrosesan data pribadi dilakukan berdasarkan Undang-Undang Republik Indonesia No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) serta prinsip GDPR untuk pengunjung internasional:"
                    : "Processing is conducted under the legal grounds established by Indonesian Law No. 27/2022 on Personal Data Protection (UU PDP) and General Data Protection Regulation (GDPR) Article 6:"}
                </p>
                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <div className="rounded-xl border border-slate-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-panel/60">
                    <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-cloud flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      {isId ? "Tujuan Komunikasi & RFQ" : "Communication & RFQ"}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {isId
                        ? "Membalas pesan, menindaklanjuti permintaan penawaran proyek (Request for Quote), dan berdiskusi seputar peluang kerja sama teknis."
                        : "Responding to professional inquiries, discussing Request for Quote (RFQ) project scopes, and engineering collaborations."}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-panel/60">
                    <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-cloud flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      {isId ? "Keamanan Sistem" : "Infrastructure Integrity"}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {isId
                        ? "Menjaga stabilitas infrastruktur server, memitigasi serangan siber, dan mencegah spam."
                        : "Maintaining server uptime, mitigating malicious traffic, and preventing spam exploitation."}
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "4. Penyedia Layanan Pihak Ketiga"
                    : "4. Third-Party Service Providers"}
                </h2>
                <p>
                  {isId
                    ? "Data Anda tidak pernah dijual atau disewakan kepada pihak ketiga mana pun. Kami hanya menggunakan layanan infrastruktur terpercaya:"
                    : "We do not sell, rent, or trade your personal data. We utilize selected trusted infrastructure partners:"}
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Cloudflare Web Analytics:</strong>{" "}
                    {isId
                      ? "Layanan analitik kinerja web yang ramah privasi (cookieless), tidak mengumpulkan IP pengunjung, dan tidak melakukan profiling lintas situs."
                      : "Privacy-first web performance analytics that operates without cookies, does not collect personal identifiers, and does not perform cross-site tracking."}
                  </li>
                  <li>
                    <strong>Hosting & Cloud Database:</strong>{" "}
                    {isId
                      ? "Server API dan basis data yang diamankan dengan enkripsi lalu lintas (TLS/HTTPS) dan kontrol akses terautentikasi."
                      : "Secure API hosting and encrypted database storage with strict token authentication."}
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "5. Retensi & Penyimpanan Data"
                    : "5. Data Retention Period"}
                </h2>
                <p>
                  {isId
                    ? "Pesan yang Anda kirimkan melalui formulir kontak disimpan hanya selama diperlukan untuk menyelesaikan diskusi proyek atau komunikasi profesional terkait. Data tidak disimpan lebih lama dari yang dibutuhkan tanpa dasar hukum yang sah."
                    : "Inquiry messages submitted through the contact form are retained only for as long as necessary to facilitate ongoing communication or until project discussions conclude. We do not store contact details indefinitely without legitimate need."}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "6. Hak-Hak Anda sebagai Subjek Data"
                    : "6. Your Rights as a Data Subject"}
                </h2>
                <p>
                  {isId
                    ? "Sesuai dengan UU PDP Indonesia dan regulasi privasi global, Anda berhak untuk:"
                    : "Under the Indonesian PDP Law and global privacy standards, you are entitled to:"}
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    {isId
                      ? "Meminta salinan data pribadi yang pernah Anda kirimkan kepada kami."
                      : "Request access to personal data you have submitted."}
                  </li>
                  <li>
                    {isId
                      ? "Meminta perbaikan atau pembaharuan terhadap data yang tidak akurat."
                      : "Request rectification of incomplete or inaccurate data."}
                  </li>
                  <li>
                    {isId
                      ? "Meminta penghapusan (hak untuk dilupakan) atas riwayat pesan Anda dari sistem kami."
                      : "Request permanent deletion of your inquiry messages from our database."}
                  </li>
                  <li>
                    {isId
                      ? "Menarik kembali persetujuan yang telah Anda berikan kapan saja."
                      : "Withdraw your consent for further communication at any time."}
                  </li>
                </ul>
                <p className="pt-2">
                  {isId
                    ? "Untuk mengajukan permohonan hak subjek data, silakan kirimkan email ke "
                    : "To exercise any of these rights, please email "}
                  <a
                    href="mailto:ardhirahmaan17@gmail.com"
                    className="text-primary underline font-medium hover:text-primary-hover"
                  >
                    ardhirahmaan17@gmail.com
                  </a>
                  {isId
                    ? " dengan subjek 'Permohonan Data Pribadi'."
                    : " with the subject 'Data Privacy Request'."}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "7. Keamanan Data (Security Measures)"
                    : "7. Security Safeguards"}
                </h2>
                <p>
                  {isId
                    ? "Kami menerapkan langkah-langkah teknis dan organisasional yang memadai untuk melindungi data pribadi dari akses tanpa izin, kehilangan, atau pengubahan, termasuk enkripsi data saat transit (TLS/HTTPS), pembatasan akses database hanya untuk administrator terverifikasi, dan penanganan token sesi yang aman."
                    : "We implement rigorous technical and organizational measures to safeguard personal data against unauthorized access, loss, or alteration. These include TLS/HTTPS transport layer encryption, parameterized database queries, and credential isolation for administrative access."}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "8. Perubahan atas Kebijakan Ini"
                    : "8. Amendments to this Policy"}
                </h2>
                <p>
                  {isId
                    ? "Kebijakan Privasi ini dapat diperbarui sewaktu-waktu untuk mencerminkan perubahan pada infrastruktur atau kepatuhan regulasi hukum. Setiap pembaruan akan dicantumkan dengan tanggal 'Terakhir diperbarui' di bagian atas halaman ini."
                    : "We may update this Privacy Policy periodically to reflect technological adjustments or legal compliance requirements. The date of the most recent revision will always be displayed at the top of this page."}
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
