import i18n from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import moment from "moment/min/moment-with-locales";
i18n
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: "en",
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
          contact: "Contact",
          introduction: "Introduction",
          im: "I'm",

          short_intro: `I am a software engineer with ${moment("2022-05").locale("en").fromNow(true)} of experience, specializing in building scalable and maintainable applications that solve real-world problems. I am passionate about software development and continuously stay updated with modern technologies and industry best practices. My goal is to deliver high-quality software that exceeds expectations, whether working independently or as part of a collaborative team. I thrive in innovative environments and am constantly improving my technical and problem-solving skills.`,

          short_contact: "Feel free to reach out for any inquiries or collaboration opportunities.",
          name: "Full Name",
          email: "Email Address",
          message: "Your Message",
          send: "Send Message",
          message_sent: "Your message has been sent successfully!"
        },
      },

      id: {
        translation: {
          home: "Beranda",
          stack: "Tech Stack",
          portfolio: "Portofolio",
          experience: "Pengalaman",
          contact: "Kontak",
          introduction: "Perkenalan",
          im: "Saya",

          short_intro: `Saya adalah seorang software engineer dengan pengalaman ${moment("2022-05").locale("id").fromNow(true)}, yang berfokus pada pengembangan aplikasi yang scalable dan mudah dipelihara untuk menyelesaikan permasalahan nyata. Saya memiliki ketertarikan besar dalam pengembangan perangkat lunak dan selalu mengikuti perkembangan teknologi serta praktik terbaik industri. Tujuan saya adalah menghasilkan perangkat lunak berkualitas tinggi yang mampu melampaui ekspektasi, baik bekerja secara mandiri maupun dalam tim. Saya berkembang di lingkungan yang inovatif dan terus meningkatkan kemampuan teknis serta pemecahan masalah saya.`,

          short_contact: "Silakan hubungi saya untuk pertanyaan atau peluang kerja sama.",
          name: "Nama Lengkap",
          email: "Alamat Email",
          message: "Pesan Anda",
          send: "Kirim Pesan",
          message_sent: "Pesan Anda berhasil dikirim!"
        },
      },
    }
  });

export default i18n;
