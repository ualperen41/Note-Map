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
