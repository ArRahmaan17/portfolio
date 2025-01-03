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
          stack: "Stack",
          portfolio: "Portfolio",
          experience: "Experience",
          contact: "Contact",
          introduction: "Introduction",
          im: "I'm",
          short_intro: `As a software engineer with ${moment("2022-05").locale("en").fromNow(true)} experience, I focus on creating user-friendly solutions for complex challenges. I'm passionate about coding and staying updated on new tech trends. My goal is to deliver top-notch software that exceeds expectations, whether I'm working solo or with a team. I thrive in innovative environments, always looking to enhance my skills.`,
          short_contact:
            "Feel free to contact me for a discussion or just some casual chit-chat and i'm open to work! You can reach me at",
        },
      },
      id: {
        translation: {
          home: "Home",
          stack: "Teknologi",
          portfolio: "Portofolio",
          contact: "Kontak",
          introduction: "Perkenalkan",
          experience: "Pengalaman",
          im: "Saya",
          short_intro: `Sebagai pengembang aplikasi dengan pengalaman ${moment("2022-05").locale("id").fromNow(true)}, Saya fokus untuk menciptakan solusi yang ramah pengguna dari perkerjaan yang kompleks, Saya antusias tentang pemrograman dan mempelajari teknologi baru. Tujuan saya adalah menghadirkan perangkat lunak terbaik yang melebihi ekspektasi. saya dapat bekerja sendiri atau dengan tim. Saya berkembang dalam lingkungan yang inovatif, selalu berupaya meningkatkan keterampilan saya.`,
          short_contact:
            "Jangan ragu untuk menghubungi saya jika ingin berdiskusi atau sekedar ngobrol santai dan saya siap menjadi bagian dari tim anda! Anda dapat menghubungi saya di",
        },
      },
    },
  });

export default i18n;
