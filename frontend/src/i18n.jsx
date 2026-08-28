import i18n from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import moment from "moment";
import "moment/locale/id";
import { LOCALIZATIONS_URL } from "./constants/api";
i18n
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "id"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          home: "Home",
          stack: "Tech Stack",
          portfolio: "Portfolio",
          experience: "Experience",
          all_rights_reserved: "All rights reserved",
          contact: "Contact",
          introduction: "Introduction",
          im: "I'm",
          short_intro: `I am a software engineer with ${moment("2022-05").locale("en").fromNow(true)} of experience, specializing in building scalable and maintainable applications that solve real-world problems. I am passionate about software development and continuously stay updated with modern technologies and industry best practices. My goal is to deliver high-quality software that exceeds expectations, whether working independently or as part of a collaborative team. I thrive in innovative environments and am constantly improving my technical and problem-solving skills.`,
          short_contact:
            "Feel free to reach out for any inquiries or collaboration opportunities.",
          hero: {
            available: "Available for thoughtful work",
            eyebrow: "Full-stack software engineer",
            summary:
              "I design and build dependable web products—from the interface people use to the systems that keep them running.",
            view_work: "Explore selected work",
            start_conversation: "Start a conversation",
            current_focus: "Current focus",
            building: "Building across the stack",
            activity_board: "Active threads",
            programming: "Programming",
            focuses: [
              "Product interfaces",
              "Reliable APIs",
              "Maintainable systems",
            ],
            focuses_empty: "Exploring the next useful problem",
          },
          stack_section: {
            title: "Tools are useful. Judgment makes them matter.",
            description:
              "I work across product interfaces, backend services, and delivery—choosing technology around the problem, not the trend.",
            empty: "The live technology list is temporarily unavailable.",
            capabilities: {
              interfaces: [
                "Interfaces",
                "Responsive React experiences with clear interaction and accessible states.",
              ],
              applications: [
                "Applications",
                "Maintainable backends, data flows, authentication, and integrations.",
              ],
              delivery: [
                "Delivery",
                "Practical architecture, containers, and release-minded engineering.",
              ],
            },
          },
          portfolio_section: {
            title: "Work shaped around real constraints.",
            description:
              "Selected products and experiments spanning operations, communication, commerce, and developer tooling.",
          },
          contact_section: {
            title: "Let’s make the next useful thing.",
            name_placeholder: "How should I address you?",
            message_placeholder:
              "Tell me about the problem, the people using it, and what success looks like.",
            sending: "Starting the conversation…",
            error: "The message could not be sent. Please try again.",
            validation: {
              name_required: "Please enter your name.",
              name_short: "Your name must contain at least 2 characters.",
              name_long: "Your name must contain 100 characters or fewer.",
              email_required: "Please enter your email address.",
              email_invalid: "Enter a valid email address.",
              email_long: "Your email must contain 254 characters or fewer.",
              message_required:
                "Please tell me what you would like to discuss.",
              message_short:
                "Please add a little more detail—at least 10 characters.",
              message_long:
                "Your message must contain 2,000 characters or fewer.",
            },
          },
          name: "Full Name",
          email: "Email Address",
          message: "Your Message",
          send: "Start a conversation",
          message_sent: "Conversation started—I’ll get back to you soon.",
          admin: {
            common: {
              refresh: "Refresh",
              name: "Name",
              description: "Description",
              stacks: "Stacks",
              selected_count: "{{count}} selected",
              search_stacks: "Search stacks",
              selected: "Selected",
              add: "Add",
              cancel: "Cancel",
              edit: "Edit",
              delete: "Delete",
            },
            portfolios: {
              manager: "Portfolio manager",
              title: "Portfolios",
              subtitle:
                "Present your projects with a strong visual card, linked stack tags, and one-click editing.",
              new: "New portfolio",
              edit: "Edit portfolio",
              create: "Create portfolio",
              update: "Update portfolio",
              add_card: "Add a new project card",
              placeholder_name: "Project name",
              placeholder_description: "Short project description",
              project_link: "Project link",
              placeholder_link: "https://example.com/project",
              project_image: "Project image",
              image_hint: "The image must be `1200x630` for optimal display.",
              all: "All portfolios",
              published_count: "{{count}} published",
              search: "Search portfolios",
              loading: "Loading portfolios...",
              no_match: "No matching portfolios",
              no_match_hint: "Clear the search or create a new project card.",
              confirm_delete: 'Delete portfolio "{{name}}"?',
              error_load: "Failed to load portfolios",
              error_save: "Failed to save portfolio",
              error_delete: "Failed to delete portfolio",
            },
          },
          blog: {
            back: "Back to Blog",
            heading_prefix: "Thoughts &",
            heading_highlight: "Insights",
            subtitle:
              "Explore my latest articles on software engineering, technology trends, and personal project updates.",
            empty: "No blog posts found yet.",
            read_more: "Read More",
            read_time_one: "{{count}} min read",
            read_time_other: "{{count}} mins read",
            error_fetch: "Failed to fetch blogs",
          },
        },
      },

      id: {
        translation: {
          home: "Beranda",
          stack: "Tech Stack",
          portfolio: "Portofolio",
          experience: "Pengalaman",
          all_rights_reserved: "Hak cipta dilindungi",
          contact: "Kontak",
          introduction: "Perkenalkan",
          im: "Saya",
          short_intro: `Saya adalah seorang software engineer dengan pengalaman ${moment("2022-05").locale("id").fromNow(true)}, yang berfokus pada pengembangan aplikasi yang scalable dan mudah dipelihara untuk menyelesaikan permasalahan nyata. Saya memiliki ketertarikan besar dalam pengembangan perangkat lunak dan selalu mengikuti perkembangan teknologi serta praktik terbaik industri. Tujuan saya adalah menghasilkan perangkat lunak berkualitas tinggi yang mampu melampaui ekspektasi, baik bekerja secara mandiri maupun dalam tim. Saya berkembang di lingkungan yang inovatif dan terus meningkatkan kemampuan teknis serta pemecahan masalah saya.`,
          short_contact:
            "Silakan hubungi saya untuk pertanyaan atau peluang kerja sama.",
          hero: {
            available: "Terbuka untuk proyek yang bermakna",
            eyebrow: "Software engineer full-stack",
            summary:
              "Saya merancang dan membangun produk web yang andal—dari antarmuka yang digunakan orang hingga sistem yang menjaganya tetap berjalan.",
            view_work: "Lihat karya pilihan",
            start_conversation: "Mulai percakapan",
            current_focus: "Fokus saat ini",
            building: "Membangun di seluruh stack",
            activity_board: "Aktivitas terkini",
            programming: "Pemrograman",
            focuses: [
              "Antarmuka produk",
              "API yang andal",
              "Sistem terpelihara",
            ],
            focuses_empty: "Mengeksplorasi masalah berguna berikutnya",
          },
          stack_section: {
            title: "Teknologi itu berguna. Pertimbangan membuatnya berarti.",
            description:
              "Saya bekerja pada antarmuka produk, layanan backend, dan delivery—memilih teknologi berdasarkan masalah, bukan tren.",
            empty: "Daftar teknologi langsung sedang tidak tersedia.",
            capabilities: {
              interfaces: [
                "Antarmuka",
                "Pengalaman React responsif dengan interaksi jelas dan state yang aksesibel.",
              ],
              applications: [
                "Aplikasi",
                "Backend, alur data, autentikasi, dan integrasi yang mudah dipelihara.",
              ],
              delivery: [
                "Delivery",
                "Arsitektur praktis, container, dan engineering yang siap dirilis.",
              ],
            },
          },
          portfolio_section: {
            title: "Karya yang dibentuk oleh kebutuhan nyata.",
            description:
              "Pilihan produk dan eksperimen untuk operasional, komunikasi, perdagangan, dan alat pengembang.",
          },
          contact_section: {
            title: "Mari membuat hal berguna berikutnya.",
            name_placeholder: "Bagaimana saya sebaiknya menyapa Anda?",
            message_placeholder:
              "Ceritakan masalahnya, siapa penggunanya, dan seperti apa hasil yang diharapkan.",
            sending: "Memulai percakapan…",
            error: "Pesan tidak dapat dikirim. Silakan coba lagi.",
            validation: {
              name_required: "Silakan masukkan nama Anda.",
              name_short: "Nama harus terdiri dari minimal 2 karakter.",
              name_long: "Nama harus terdiri dari maksimal 100 karakter.",
              email_required: "Silakan masukkan alamat email Anda.",
              email_invalid: "Masukkan alamat email yang valid.",
              email_long: "Email harus terdiri dari maksimal 254 karakter.",
              message_required: "Ceritakan hal yang ingin Anda diskusikan.",
              message_short: "Tambahkan sedikit detail, minimal 10 karakter.",
              message_long: "Pesan harus terdiri dari maksimal 2.000 karakter.",
            },
          },
          name: "Nama Lengkap",
          email: "Alamat Email",
          message: "Pesan Anda",
          send: "Mulai percakapan",
          message_sent: "Percakapan dimulai—saya akan segera menghubungi Anda.",
          admin: {
            common: {
              refresh: "Muat ulang",
              name: "Nama",
              description: "Deskripsi",
              stacks: "Tumpukan",
              selected_count: "{{count}} dipilih",
              search_stacks: "Cari stack",
              selected: "Dipilih",
              add: "Tambah",
              cancel: "Batal",
              edit: "Ubah",
              delete: "Hapus",
            },
            portfolios: {
              manager: "Pengelola portofolio",
              title: "Portofolio",
              subtitle:
                "Tampilkan proyekmu dengan kartu visual yang kuat, tag stack terhubung, dan edit sekali klik.",
              new: "Portofolio baru",
              edit: "Ubah portofolio",
              create: "Buat portofolio",
              update: "Perbarui portofolio",
              add_card: "Tambah kartu proyek baru",
              placeholder_name: "Nama proyek",
              placeholder_description: "Deskripsi singkat proyek",
              project_link: "Link proyek",
              placeholder_link: "https://contoh.com/proyek",
              project_image: "Gambar proyek",
              image_hint: "Ukuran gambar harus `1200x630` agar tampil optimal.",
              all: "Semua portofolio",
              published_count: "{{count}} dipublikasikan",
              search: "Cari portofolio",
              loading: "Memuat portofolio...",
              no_match: "Tidak ada portofolio yang cocok",
              no_match_hint: "Kosongkan pencarian atau buat kartu proyek baru.",
              confirm_delete: 'Hapus portofolio "{{name}}"?',
              error_load: "Gagal memuat portofolio",
              error_save: "Gagal menyimpan portofolio",
              error_delete: "Gagal menghapus portofolio",
            },
          },
          blog: {
            back: "Kembali ke Blog",
            heading_prefix: "Pemikiran &",
            heading_highlight: "Wawasan",
            subtitle:
              "Jelajahi artikel terbaru saya tentang rekayasa perangkat lunak, tren teknologi, dan pembaruan proyek pribadi.",
            empty: "Belum ada postingan blog.",
            read_more: "Baca Selengkapnya",
            read_time_one: "Waktu baca {{count}} menit",
            read_time_other: "Waktu baca {{count}} menit",
            error_fetch: "Gagal mengambil blog",
          },
        },
      },
    },
  });

async function hydrateLocalizationsFromDatabase() {
  try {
    const response = await fetch(LOCALIZATIONS_URL);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        payload.message || `Failed to fetch localizations (${response.status})`,
      );
    }

    const tables = payload.localizations || {};
    Object.entries(tables).forEach(([locale, translation]) => {
      if (!translation || typeof translation !== "object") {
        return;
      }

      i18n.addResourceBundle(locale, "translation", translation, true, true);
    });
  } catch (error) {
    // Keep local fallback resources when DB translations are unavailable.
    console.error(error);
  }
}

i18n.on("initialized", () => {
  hydrateLocalizationsFromDatabase();
});

export default i18n;
