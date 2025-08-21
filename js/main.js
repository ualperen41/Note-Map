import { ui , personIcon } from "./ui.js";

//* Global Değişkenler
const STATE = {
  map: null,
  layer: null,
  clickedCoords:null
};

// Kullanıcının konumuna göre hatirayı yükle
window.navigator.geolocation.getCurrentPosition(
  // kullanıcı izin verirse onun olduğu konumda yükle
  
  (e) => loadMap([e.coords.latitude, e.coords.longitude]),
  () =>

    // izin vermezse varsayılan olarak istanbul odaklı yükle
    loadMap(
      [41.104187, 29.051014]
      
    )
);

//! Leflet hartiasına kurulumu yapar
function loadMap(position) {
  // haritanın kurulumu
  STATE.map = L.map("map", { zoomControl: false }).setView(position, 11);

  // haritaya arayüz ekle
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(STATE.map);

  // kontrolcüyü sağ alta taşı
  L.control.zoom({ position: "bottomright" }).addTo(STATE.map);

  // harita üzerinde bir layer oluştur
  STATE.layer = L.layerGroup().addTo(STATE.map);

  // ekrana imleç bas
  const marker = L.marker(position, { icon: personIcon }).addTo(STATE.map);

  // marker'a popup ekle
  marker.bindPopup("<b>Buradasın</b>").openPopup();

  // haritaya tıklanma olayı için izleyici ekle
  STATE.map.on("click", onMapClick);
}


// Haritaya tıklanınca çalıştır
function onMapClick(e) {
  // son tıklanılan konumu kaydet
STATE.clickedCoords =[e.latlng.lat, e.latlng.lng];

// aside alanındaki formu aktif et
ui.aside.classList.add("add");
// aside alanındaki başlığı güncelle

}
