import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from "./en.json";
import esJSON from "./es.json";
import itJSON from "./it.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enJSON,
    },
    es: {
      translation: esJSON,
    },
    it: {
      translation: itJSON,
    },
  },
  lng: localStorage.getItem("i18nextLng") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
