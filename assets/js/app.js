var map = L.map('map').setView([-7.9,110.45], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'OSM'
}).addTo(map);

// Control legend
var legend = L.control({position: 'bottomleft'}), labels;

legend.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'legend'), labels = [];
  this.update();
  return this._div;
};

legend.update = function () {
  this._div.innerHTML = '<h4>Legenda</h4><hr>' + labels.join('<hr>');
};

legend.addTo(map);

/* GeoJSON Point */
var titikkabkota = L.geoJson(null, {
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      layer.on({
        mouseover: function (e) {
          titikkabkota.bindTooltip(feature.properties.KAB_KOTA);
        }
      });
    }
  }
});
$.getJSON("data/kabupaten_kota_diy_point.geojson", function (data) {
  titikkabkota.addData(data);
  map.addLayer(titikkabkota);
});

/* GeoJSON Polyline */
map.createPane("pane_jalanutama");
map.getPane("pane_jalanutama").style.zIndex = 401;
var layerWidth = {"Jalan Arteri":3, "Jalan Kolektor":1};
var jalanutama = L.geoJson(null, {
  pane: "pane_jalanutama",
  style: function (feature) {
    return {
      color: "red",
      weight: layerWidth[feature.properties.KETERANGAN],
      opacity: 1,
      interactive: false,
    };
  }
});
$.getJSON("data/jalan_utama_line.geojson", function (data) {
  jalanutama.addData(data);
  map.addLayer(jalanutama);
});

/* GeoJSON Polygon */
map.createPane("pane_adminkecamatan");
map.getPane("pane_adminkecamatan").style.zIndex = 301;
var layerColors = {"Tinggi":"#bd0026", "Sedang":"#fd8d3c", "Rendah":"#ffffb2"};
var adminkecamatan = L.geoJson(null, {
  pane:"pane_adminkecamatan",
  style: function (feature) {
    return {
      fillColor: layerColors[feature.properties.klas_jml],
      fillOpacity: 0.7, 
      color: "black", 
      weight: 1,
      opacity: 1,
    };
  },
  onEachFeature: function (feature, layer) {
    layer.on({
      mouseover: function (e) { 
        var layer = e.target;
        layer.setStyle({
          weight: 2,
          color: "gray",
          opacity: 1,
          fillColor: "#00FFFF",
          fillOpacity: 1,
        });
        adminkecamatan.bindTooltip(feature.properties.KECAMATAN + ', ' + feature.properties.KABUPATEN); //Popup
      },
      mouseout: function (e) {
        adminkecamatan.resetStyle(e.target);
      },
      click: function (e) {
        map.fitBounds(e.target.getBounds());
      }
    });
  }
});
$.getJSON("data/penduduk_kecamatan_diy_polygon.geojson", function (data) {
  adminkecamatan.addData(data);
  map.addLayer(adminkecamatan);
});

// Control Layer
var Layers = {
  'Ibukota Kabupate/Kota': titikkabkota,
  'Jalan Utama': jalanutama,
  'Batas Kecamatan': adminkecamatan,
};
var layerControl = L.control.layers(null, Layers, {collapsed:false});
layerControl.addTo(map);

// Legend for each layer
var legend_titikkabkota = '<img src="assets/img/marker-icon.png" width="10"> Ibukota Kab/Kota',
legend_jalanutama = '<img src="assets/img/jalan.png" width="150">',
legend_adminkecamatan = '<img src="assets/img/jumlahpenduduk.png" width="150">';

map.on("overlayadd", function(e) {
  if (e.layer === titikkabkota) {
    labels.push(legend_titikkabkota);
    legend.update();
  }
  if (e.layer === jalanutama) {
    labels.push(legend_jalanutama);
    legend.update();
  }
  if (e.layer === adminkecamatan) {
    labels.push(legend_adminkecamatan);
    legend.update();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === titikkabkota) {
    for( var i = 0; i < labels.length; i++){
      if ( labels[i] === legend_titikkabkota) {
        labels.splice(i, 1);
      }
    }
    legend.update();
  }
  if (e.layer === jalanutama) {
    for( var i = 0; i < labels.length; i++){
      if ( labels[i] === legend_jalanutama) {
        labels.splice(i, 1);
      }
    }
    legend.update();
  }
  if (e.layer === adminkecamatan) {
    for( var i = 0; i < labels.length; i++){
      if ( labels[i] === legend_adminkecamatan) {
        labels.splice(i, 1);
      }
    }
    legend.update();
  }
});