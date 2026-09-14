import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Calendar,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedContent from "../components/react-bits/AnimatedContent";

export default function CookiePolicyPage({
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
                {isId ? "Transparansi Penyimpanan" : "Storage & Telemetry"}
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-cloud sm:text-5xl">
                {isId
                  ? "Pemberitahuan Cookie & Penyimpanan Lokal"
                  : "Cookie & Local Storage Disclosure"}
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
                  <EyeOff className="h-3.5 w-3.5 text-emerald-500" />
                  {isId
                    ? "Tanpa Cookie Pelacak Pihak Ketiga"
                    : "Zero Third-Party Tracking Cookies"}
                </span>
              </div>
            </div>

            {/* Overview Box */}
            <div className="my-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 dark:border-emerald-400/30 dark:bg-emerald-400/10">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white dark:bg-emerald-400 dark:text-slate-950">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold text-slate-900 dark:text-cloud">
                    {isId
                      ? "Pemberitahuan Transparansi Privasi"
                      : "Privacy-First Architecture"}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {isId
                      ? "Situs ini beroperasi tanpa piksel pelacak iklan (seperti Meta Pixel atau Google Ads) dan tanpa cookie profil pihak ketiga. Kami hanya menggunakan penyimpanan lokal browser (localStorage & sessionStorage) serta cookie sesi aman (HttpOnly) untuk fungsionalitas murni situs."
                      : "This site operates without third-party advertising pixels (such as Meta Pixel or Google Ads) and without invasive profiling cookies. We only use client browser storage (localStorage and sessionStorage) and secure session cookies (HttpOnly) strictly to deliver expected site functionality."}
                  </p>
                </div>
              </div>
            </div>

            {/* Storage Keys Table */}
            <article className="space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <section className="space-y-4">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "1. Item Penyimpanan Browser yang Digunakan"
                    : "1. Browser Storage Items in Use"}
                </h2>
                <p>
                  {isId
                    ? "Tabel berikut merinci seluruh item data lokal yang disimpan di peramban Anda saat menjelajahi situs ini:"
                    : "The table below provides a complete breakdown of all local data keys utilized by this application:"}
                </p>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="border-b border-slate-200 bg-slate-100/70 font-mono text-[0.68rem] uppercase tracking-wider text-slate-600 dark:border-white/10 dark:bg-panel dark:text-slate-300">
                      <tr>
                        <th className="px-4 py-3 sm:px-6">
                          {isId ? "Kunci Penyimpanan" : "Storage Key"}
                        </th>
                        <th className="px-4 py-3 sm:px-6">
                          {isId ? "Mekanisme" : "Mechanism"}
                        </th>
                        <th className="px-4 py-3 sm:px-6">
                          {isId ? "Tujuan & Kegunaan" : "Purpose & Utility"}
                        </th>
                        <th className="px-4 py-3 sm:px-6">
                          {isId ? "Masa Simpan" : "Retention"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                      <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-mono font-semibold text-primary sm:px-6">
                          theme
                        </td>
                        <td className="px-4 py-3 font-mono text-xs sm:px-6">
                          localStorage
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          {isId
                            ? "Menyimpan preferensi mode tampilan (Light atau Dark) agar antarmuka tidak berkedip saat dimuat."
                            : "Stores your visual theme preference (Light or Dark) to avoid theme flicker on reload."}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs sm:px-6">
                          {isId ? "Permanen lokal" : "Persistent"}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-mono font-semibold text-primary sm:px-6">
                          i18nextLng
                        </td>
                        <td className="px-4 py-3 font-mono text-xs sm:px-6">
                          localStorage
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          {isId
                            ? "Menyimpan pilihan bahasa pengguna (en untuk English atau id untuk Indonesia)."
                            : "Stores your selected interface language (en for English or id for Indonesian)."}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs sm:px-6">
                          {isId ? "Permanen lokal" : "Persistent"}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-mono font-semibold text-primary sm:px-6">
                          cookie_notice_accepted
                        </td>
                        <td className="px-4 py-3 font-mono text-xs sm:px-6">
                          localStorage
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          {isId
                            ? "Mengingat bahwa Anda telah melihat dan menutup pemberitahuan penyimpanan lokal ini."
                            : "Remembers that you have acknowledged and dismissed the floating storage notification."}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs sm:px-6">
                          {isId ? "Permanen lokal" : "Persistent"}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-mono font-semibold text-amber-600 dark:text-amber-400 sm:px-6">
                          admin_token
                        </td>
                        <td className="px-4 py-3 font-mono text-xs sm:px-6">
                          HttpOnly Cookie
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          {isId
                            ? "Cookie sesi terenkripsi (HttpOnly, Secure, SameSite) yang HANYA digunakan oleh pemilik situs untuk manajemen dashboard /admin/*. Terlindungi dari akses JavaScript (proteksi XSS) dan tidak pernah dipasang pada pengunjung umum."
                            : "Cryptographically signed session cookie (HttpOnly, Secure, SameSite) used EXCLUSIVELY by the site administrator for /admin/* dashboard management. Protected against JavaScript access/XSS and never set for public visitors."}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs sm:px-6">
                          {isId ? "1 jam / Hingga logout" : "1 hour / Until logout"}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-mono font-semibold text-sky-600 dark:text-sky-400 sm:px-6">
                          portfolio_current_focus_categories_v2
                        </td>
                        <td className="px-4 py-3 font-mono text-xs sm:px-6">
                          sessionStorage
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          {isId
                            ? "Cache memori sementara untuk kategori fokus aktif agar transisi navigasi lebih cepat."
                            : "In-memory transient cache for hero section technical focus tags to ensure zero latency."}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs sm:px-6">
                          {isId ? "Hingga tab ditutup" : "Session (tab close)"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "2. Telemetri & Analitik Web Cloudflare"
                    : "2. Telemetry & Cloudflare Web Analytics"}
                </h2>
                <p>
                  {isId
                    ? "Kami menggunakan Cloudflare Web Analytics untuk memantau metrik performa situs (waktu muat halaman, Core Web Vitals, dan volume lalu lintas agregat). Layanan ini dirancang khusus untuk memprioritaskan privasi:"
                    : "We incorporate Cloudflare Web Analytics to evaluate infrastructure responsiveness (page load durations, Core Web Vitals, and aggregate traffic volumes). This service is privacy-first by design:"}
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>
                      {isId ? "Tanpa Cookie:" : "Cookieless Operations:"}
                    </strong>{" "}
                    {isId
                      ? "Tidak ada cookie yang dibuat atau disimpan di komputer Anda untuk keperluan analitik ini."
                      : "No client cookies or device fingerprints are placed or accessed on your machine."}
                  </li>
                  <li>
                    <strong>
                      {isId ? "Tanpa Profiling:" : "No Cross-Site Tracking:"}
                    </strong>{" "}
                    {isId
                      ? "Data yang dicatat berupa statistik agregat tanpa mengidentifikasi identitas pribadi atau riwayat penjelajahan Anda di situs lain."
                      : "Data collected is purely aggregate and cannot identify individual visitor personas or monitor behavior across other web domains."}
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId
                    ? "3. Cara Mengelola atau Menghapus Penyimpanan Lokal"
                    : "3. How to Manage or Clear Browser Storage"}
                </h2>
                <p>
                  {isId
                    ? "Anda memiliki kendali penuh atas data yang disimpan di peramban Anda. Anda dapat memeriksa, membersihkan, atau menghapus item localStorage kapan saja:"
                    : "You retain full agency over data stored on your device. You can inspect, clear, or restrict localStorage at any moment:"}
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Chrome / Edge / Brave:</strong>{" "}
                    {isId
                      ? "Tekan F12 -> Buka tab 'Application' -> Pilih 'Local Storage' -> Klik kanan dan pilih 'Clear'."
                      : "Press F12 -> Open 'Application' tab -> Navigate to 'Local Storage' under Storage -> Right-click and choose 'Clear'."}
                  </li>
                  <li>
                    <strong>Firefox:</strong>{" "}
                    {isId
                      ? "Tekan F12 -> Buka tab 'Storage' -> Pilih 'Local Storage' -> Klik kanan dan pilih 'Delete All'."
                      : "Press F12 -> Open 'Storage' tab -> Expand 'Local Storage' -> Right-click and select 'Delete All'."}
                  </li>
                  <li>
                    <strong>Safari:</strong>{" "}
                    {isId
                      ? "Buka Pengaturan -> Tab 'Privacy' -> Klik 'Manage Website Data' -> Cari domain ini dan klik 'Remove'."
                      : "Open Settings -> 'Privacy' -> 'Manage Website Data' -> Locate this domain and click 'Remove'."}
                  </li>
                </ul>
                <p className="pt-2">
                  {isId
                    ? "Menghapus localStorage situs ini hanya akan mengembalikan tema dan pilihan bahasa Anda ke pengaturan bawaan (default)."
                    : "Clearing local storage will simply restore default interface theme and language settings on your next visit without degrading core functionality."}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-cloud sm:text-2xl">
                  {isId ? "4. Pertanyaan" : "4. Inquiries"}
                </h2>
                <p>
                  {isId ? (
                    <>
                      Jika Anda memiliki pertanyaan tentang kebijakan penyimpanan
                      ini, silakan hubungi kami di:{" "}
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
                      If you have questions regarding this storage disclosure,
                      reach out directly via:{" "}
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
