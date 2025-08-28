import { ui, personIcon } from "./ui.js";
import { getNoteIcon, formatDate, getStatus, statusObj } from "./helpers.js";
//* Global Değişkenler
const STATE = {
  map: null,
  layer: null,
  clickedCoords: null,
  notes: JSON.parse(localStorage.getItem("notes") || "[]"),
};
console.log(STATE);
// Kullanıcının konumuna göre hatirayı yükle
window.navigator.geolocation.getCurrentPosition(
  // kullanıcı izin verirse onun olduğu konumda yükle

  (e) => loadMap([e.coords.latitude, e.coords.longitude]),
  () =>
    // izin vermezse varsayılan olarak istanbul odaklı yükle
    loadMap([41.104187, 29.051014])
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

  //notları ekrana bas
  renderNoteCards(STATE.notes);
  renderMarker(STATE.notes);
}

// Haritaya tıklanınca çalıştır
function onMapClick(e) {
  // son tıklanılan konumu kaydet
  STATE.clickedCoords = [e.latlng.lat, e.latlng.lng];

  // aside alanındaki formu aktif et
  ui.aside.classList.add("add");
  // aside alanındaki başlığı güncelle
  ui.asideTitle.textContent = "Yeni Not";
}

// İptal butonuna basınca aside alanını ekleme modundan çıkart
ui.cancelButton.addEventListener("click", () => {
  // aside alanını ekleme modundan çıkar
  ui.aside.classList.remove("add");

  // title eski haline getir
  ui.asideTitle.textContent = "Notlar";
});

//* Ok'a tıklanınca aside alanını aç/kapa
ui.arrow.addEventListener("click", () => {
  ui.aside.classList.toggle("hide");
});

// * Form Gönderilince
ui.form.addEventListener("submit", (e) => {
  // sayfa yenilemeyi engelle
  e.preventDefault();
  // formdaki verilere eriş
  const title = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;

  // eğer form doldurulmadıysa kullanıcıya uyarı ver
  if (!title || !date || !status) {
    return alert("Lütfen formu doldurunuz!");
  }

  // kaydedilecek nesneyi oluştur
  const newNote = {
    id: new Date().getTime(),
    title,
    date,
    status,
    coords: STATE.clickedCoords,
  };

  // notes dizisine yeni notu ekle
  STATE.notes.push(newNote);

  // localStorage'ı güncelle
  localStorage.setItem("notes", JSON.stringify(STATE.notes));

  // ekleme modunu kapat
  ui.aside.classList.remove("add");
  ui.asideTitle.textContent = "Notlar";

  // notları ekrana bas
  renderNoteCards(STATE.notes);
  renderMarker(STATE.notes);
});

//* note marker'larını ekrana bas
function renderMarker(notes) {
  // haritadaki katmana daha önceden eklenmiş marker'ları temizle
  STATE.layer.clearLayers();

  // notes dizisindeki her bir not için ekrana bir marker bas
  notes.forEach((note) => {
    // note'un icon'ını belirle
    const icon = getNoteIcon(note.status);

    // marker oluştur
    const marker = L.marker(note.coords, { icon }).addTo(STATE.layer);
    // note'ların başlığını popup olarak marker'a ekle
    marker.bindPopup(`<p class="popup">${note.title}<p>`);
  });
}

//* note card'larını ekrana bas
function renderNoteCards(notes) {
  // notes dizisindeki her nesneyi dönerek bir li elemanı oluştur
  const notesHtml = notes
    .map(
      (note) => `<li>
          <div>
            <h3>${note.title}</h3>
            <p>${formatDate(note.date)}</p>
            <p class="status">${getStatus(note.status)}</p>
          </div>
          <div class="icons">
            <i  data-id="${
              note.id
            }" id="fly-btn" class="bi bi-airplane-fill"></i>
            <i data-id="${note.id}" id="trash-btn" class="bi bi-trash"></i>
          </div>
        </li>`
    )
    .join("");
  //oluşturulan note elemanlarını ekrana bas
  ui.noteList.innerHTML = notesHtml;

  // delete btn'lara eriş
  document.querySelectorAll("#trash-btn").forEach((btn) => {
    // butonun bağlı olduğu note'un id'sine eriş
    const id = +btn.dataset.id;
    // butona tıklanma olayını izle
    btn.addEventListener("click", () => deleteNote(id));
  });
  // fly btn'lara eriş
  document.querySelectorAll("#fly-btn").forEach((btn) => {
    // butonun bağlı olduğu note'un id'sine eriş
    const id = +btn.dataset.id;
    //butona tıklanma olayını izle
    btn.addEventListener("click", () => flyToNote(id));
  });
}

const deleteNote = (id) => {
  // kullanıcadan onay vermzse dur
  if (!confirm("Notu silmek istediğinizden emin misiniz?")) return;
  // id'si bilinen note'u diziden kaldır
  STATE.notes = STATE.notes.filter((note) => note.id !== id);
  // localstrage'ı güncelle
  localStorage.setItem("notes", JSON.stringify(STATE.notes));
  // arayüzü güncelle
  renderMarker(STATE.notes);
  renderNoteCards(STATE.notes);
};
const flyToNote = (id) => {
  //tıklanılan notun verilerine eriş
  const note = STATE.notes.find((note) => note.id === id);
  // haritada göster
  STATE.map.flyTo(note.coords, 15);
};
