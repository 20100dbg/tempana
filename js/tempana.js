var modeImportLeger = false;

var map, heatmapLayer;
var layersPoints = [];
var importedData = [], workingData = [];
var tabUniteTemps = ["year", "month", "week", "day", "hour", "minute", "second", "millisecond"];
var tabHeaders = [];

var uniteTemps = "day";
var nbUniteTemps = 1;
var unitePeriode = 'month';

var idxColonneCateg = -1;
var idxColonneContient = -1;
var tabColonneEltec = [];

var startDateGlobal = 0;
var endDateGlobal = 0;
var startDatePeriode = 0;
var endDatePeriode = 0;

var IDX_LAT = 0;
var IDX_LNG = 1;
var IDX_DATE = 2;
var IDX_DATE_FIN = 3;
var IDX_COUNT = -1;
var offsetColonne = 3;

//ok
//initialise la carte utilisée pour prévisualiser et filtrer les évènements
var heatmapcfg = {
  "radius": 0.6,
  "maxOpacity": .8,
  "scaleRadius": true,
  "useLocalExtrema": false,
  latField: 'lat', lngField: 'lng', valueField: 'count'
};

window.onload = function() {

    $('#BasculerMode').hide();
    remplirSelectUniteTemps();
    //letzgo();

    //'carto/{z}/{x}/{y}.png'
    //'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    var baseLayer = L.tileLayer('carto/{z}/{x}/{y}.png', { });
    heatmapLayer = new HeatmapOverlay(heatmapcfg);
    
    map = new L.Map('map', {
      editable: true,
      center: {lat:48.89, lng:7.8},
      zoom: 10,
      layers: [baseLayer, heatmapLayer]
    });
    L.control.scale({imperial:false}).addTo(map);

    MapAddControls();
};

function MapAddControls()
{
  map.pm.addControls({ position: 'topleft', drawMarker: false,drawCircleMarker: false,
      drawPolyline: false,drawText: false,cutPolygon: false,rotateMode: false });
}


//ok
//appelé par le bouton utilisateur.
//doit vider les graphiques, réappliquer les filtres qui ont pu changer
//créer les graphiques et afficher le noms des colonnes et le nombre de lignes
function creerFiltreEtGraphiques()
{
  viderGraphiques();
  creerSelectColonne();
  appliquerFiltres();
  creerNomsColonnes();
  creerGraphiques();
  afficherStats();
 
  //SupprimerZonesFiltres(); 
  dessiner(workingData);
  BasculerMode();
  document.documentElement.scrollTop = 0;
}

function creerSelectColonne()
{
  idxColonneCateg = document.getElementById('selectCateg').value;
  idxColonneContient = document.getElementById('selectContient').value;
  unitePeriode = document.getElementById('selectUnitePeriode').value;
  uniteTemps = document.getElementById('selectUniteTemps').value;
  nbUniteTemps = document.getElementById('nbUniteTemps').value;
}


//ok
//génère les graphiques avec les données filtrées en amont
function creerGraphiques()
{
  GraphEvolutionGlobale(workingData);
  GraphEvolutionGlobaleCumulative(workingData);
  
  GraphRecurrenceHeureJour(workingData);
  GraphRecurrenceJourMois(workingData);
  GraphRecurrenceSemaine(workingData);

  GraphRecurrenceHeureJourSemaine(workingData);
  GraphRecurrenceHeureMois(workingData);

  GraphEvolutionPeriodeCateg(workingData);
  GraphEvolutionGlobaleCateg(workingData);
  GraphEvolutionGlobaleCumulativeCateg(workingData);
  GraphRepartitionCateg(workingData);

  GraphElementsActifs(workingData);
  GraphGanttCateg(workingData);
}

//ok
//Vide tous les graphiques générés. Le html retrouve sont format d'origine
function viderGraphiques()
{
  for (var i = am5.registry.rootElements.length - 1; i >= 0; i--)
    am5.registry.rootElements[i].dispose();
}

//ok
//Vide le bandeau temporel représentant la totalité évènements
function viderBandeau()
{
  var c = document.getElementById("bandeau");
  var ctx = c.getContext("2d");
  ctx.clearRect(0,0,c.width,c.height);
}


function resetForm()
{
  var divFiltres = document.getElementById('filtres');

  for (var i = divFiltres.childNodes.length - 1; i >= 0; i--)
    divFiltres.childNodes[i].remove();

  document.getElementById('selectCateg').innerHTML = '';
  document.getElementById('selectEltec').innerHTML = '';
  document.getElementById('selectContient').innerHTML = '';
  document.getElementById('texteContient').value = '';
  document.getElementById('previsualisation').innerHTML = '';

  workingData = [...importedData];
  afficherStats();
}

function resetFiltresEtSelect()
{
  idxColonneCateg = -1;
  tabColonneEltec = [];

  uniteTemps = "day";
  nbUniteTemps = 1;
  unitePeriode = 'month';

  idxColonneCateg = -1;
  idxColonneContient = -1;
  tabColonneEltec = [];

  startDateGlobal = 0;
  endDateGlobal = 0;
  startDatePeriode = 0;
  endDatePeriode = 0;

  fromSlider.value = 0;
  toSlider.value = 100;
  viderBandeau();
  AfficherPeriode();
}


function AfficherPeriode()
{
  document.getElementById('infoSlider').innerHTML = 
  'Global : ' + startDateGlobal.toLocaleString() + ' - ' + endDateGlobal.toLocaleString() + '<br>' +
  'Periode : ' + startDatePeriode.toLocaleString() + ' - ' +  endDatePeriode.toLocaleString();
}


function afficherStats()
{
  document.getElementById('stats').innerHTML = 
            'Lignes importées : ' + importedData.length +
            ' - Après filtres : ' + importedData2.length +
            ' - Sur la carte : ' + workingData.length;
}


function majPeriode()
{
  const [from, to] = getParsed(fromSlider, toSlider);
  const [startPeriode, endPeriode] = ExtrairePeriode(from, to);
  startDatePeriode = startPeriode;
  endDatePeriode = endPeriode;

  AfficherPeriode();
}


function ExtrairePeriode(from, to)
{
  var diff = endDateGlobal - startDateGlobal;
  var startDatePeriode = startDateGlobal.getTime() + (from * diff / 100);
  var endDatePeriode = startDateGlobal.getTime() + (to * diff / 100);

  return [new Date(startDatePeriode), new Date(endDatePeriode)];
}


function creerBandeau(data)
{
  viderBandeau();
  var diff = endDateGlobal - startDateGlobal;
  var largeur = 800;

  for (var i = 0; i < data.length; i++)
  {
    var madate = endDateGlobal - data[i][IDX_DATE];
    drawLine(madate * largeur / diff);
  }
}

function drawLine(x)
{
  var c = document.getElementById("bandeau");
  var ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, 20);
  ctx.stroke();
}

function resetSlider()
{
  fromSlider.value = 0;
  toSlider.value = 100;
}


var carteModeConsultation = false;
var importedData2 = [];

function BasculerMode()
{
  carteModeConsultation = !carteModeConsultation;

  if (carteModeConsultation)
  {
    map.pm.removeControls();
    setDateGlobal(importedData2);

    majPeriode();
    resetSlider();

    centrerVue(importedData2);
    initHeatmap();

    dessiner(importedData2);
    creerBandeau(importedData2);

    $('#divFiltres').hide();
    $('#BasculerMode').show();
    $('#boutonGraphiques').hide();
  }
  else
  {
    MapAddControls();
    setDateGlobal(importedData);

    majPeriode();
    resetSlider();

    centrerVue(importedData);
    initHeatmap();

    dessiner(importedData);
    creerBandeau(importedData);
    
    $('#divFiltres').show();
    $('#BasculerMode').hide();
    $('#boutonGraphiques').show();
  }
  

}
