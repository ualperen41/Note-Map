import { defaultIcon, visitIcon, homeIcon, jobIcon, parkIcon } from "./ui.js";

//* Note'un status değerine göre icon belirler
export function getNoteIcon(status) {
  switch (status) {
    case "visit":
      return visitIcon;
    case "home":
      return homeIcon;
    case "job":
      return jobIcon;
    case "park":
      return parkIcon;
    default:
      return defaultIcon;
  }
}
//* Tarih verisini ƒormatlayan fonksiyon
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("tr", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};
//* Status değerine göre ekrana basılacak metni belirle
export const getStatus = (status) => {
  switch (status) {
    case "visit":
      return "Ziyaret";
    case "park":
      return "Park yeri";
    case "home":
      return "Ev";
    case "job":
      return "İş";

    default:
      "Tanımsız";
  }
};

// aynı sorun farklı çözüm
export const statusObj = {
  visit: "Ziyaret",
  park: "Park yeri",
  home: "Ev",
  job: "İş",
};
