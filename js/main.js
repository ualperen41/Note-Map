

function loadMap (position) {
    // haritanın kurulumu
    var map =L.map("map").setView(position, 13);
}
// fonksiyonu çalıştır
loadMap([51.505, -0.09]);