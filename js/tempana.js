var map;
var layersPoints = [];
var importedData = [], workingData = [];
var tabUniteTemps = ["year", "month", "week", "day", "hour", "minute", "second", "millisecond"];

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
var offsetColonne = 3;

//ok
//initialise la carte utilisée pour prévisualiser et filtrer les évènements
window.onload = function() {

    remplirSelectUniteTemps();

    //'carto/{z}/{x}/{y}.png'
    //'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    var baseLayer = L.tileLayer('carto/{z}/{x}/{y}.png', { });
    
    map = new L.Map('map', {
      editable: true,
      center: {lat:48.89, lng:7.8},
      zoom: 10,
      layers: [baseLayer]
    });
    L.control.scale({imperial:false}).addTo(map);

    map.pm.addControls({ position: 'topleft', drawMarker: false,drawCircleMarker: false,
      drawPolyline: false,drawText: false,cutPolygon: false,rotateMode: false });
};


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
  GraphRecurrenceSemaine(workingData);
  GraphRecurrenceJourMois(workingData);
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


//ok
//applique les filtres
//doit partir des données importées
function appliquerFiltres()
{
  workingData = [...importedData];
  workingData = FiltreColonnes(workingData);
  workingData = FiltrePeriode(workingData);
  workingData = FiltreCoord(workingData);
  workingData = FiltreContient(workingData);
  workingData = FiltreDoublon(workingData);
}


function FiltreContient(data)
{
  var idxColonneContient = parseInt(document.getElementById('selectContient').value);
  if (idxColonneContient == -1) return data;

  var strFiltre = document.getElementById('texteContient').value;
  strFiltre = strFiltre.toLocaleLowerCase();
  var filteredData = [];

  for (var i = 0; i < data.length; i++)
  {
    var str = data[i][idxColonneContient].toLocaleLowerCase();

    if (str.indexOf(strFiltre) !== -1)
      filteredData.push(data[i]);
  }

  return filteredData;
}


function FiltreDoublon(data)
{
  var tabEltec = [];
  var filteredData = [];

  if (!document.getElementById('supprimerDoublons').checked) return data;

  for (var i = 0; i < data.length; i++)
  {
    var flag = true;
    var str = '';

    for (var j = 0; j < tabColonneEltec.length; j++)
      str += data[i][tabColonneEltec[j]];

    if (!tabEltec.includes(str)) 
    {
      tabEltec.push(str);
      filteredData.push(data[i]);
    }
  }

  return filteredData;
}


function FiltrePeriode(data)
{
  var filteredData = [];

  for (var i = 0; i < data.length; i++)
  {
    if (data[i][IDX_DATE] >= startDatePeriode && data[i][IDX_DATE] <= endDatePeriode)
      filteredData.push(data[i]);
  }

  return filteredData;
}


function FiltreColonnes(data)
{
  var tabFilter = creerTabFiltres();
  var filteredData = [];

  for (var i = 0; i < data.length; i++)
  {
    var tabFlag = [];
    for (var j = 0; j < tabFilter.length; j++)
    {
      var idxCol = tabFilter[j].idxCol;
      var tmp = data[i][idxCol];
      tabFlag.push(tabFilter[j].values.indexOf(tmp) > -1);
    }

    if (!tabFlag.includes(false))
    {
      filteredData.push(data[i]);  
    }
  }
  return filteredData; 
}



//reinitialise les filtres et autres éléments du form
function supprimerFiltre()
{
  var divFiltres = document.getElementById('filtres');

  for (var i = divFiltres.childNodes.length - 1; i >= 0; i--)
    divFiltres.childNodes[i].remove();

  document.getElementById('selectCateg').innerHTML = '';
  document.getElementById('selectEltec').innerHTML = '';
  document.getElementById('selectContient').innerHTML = '';
  document.getElementById('texteContient').value = '';

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

  workingData = [...importedData];

  AfficherPeriode();
  afficherStats();
}


function creerTabFiltres()
{
  var div = document.getElementById("filtres");
  var tabFiltres = [];

  for (var i = 0; i < div.childNodes.length; i++)
  {
    var id = parseInt(div.childNodes[i].id.split('-')[1]);
    var tmpVals = document.querySelectorAll("#values-"+ id +" option:checked");
    var valeursFiltres = [];
    for (var j = 0; j < tmpVals.length; j++) valeursFiltres.push(tmpVals[j].text);
    tabFiltres.push({"idxCol": id, "values" : valeursFiltres });
  }

  return tabFiltres;
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
  'nbLignesImportees : ' + importedData.length + ' - nbLignesAffichees : ' + workingData.length;
}


function updatePeriode(fromSlider, toSlider)
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

/*
function FiltreCoord(data)
{
  if (coordLatNO == 0 && coordLatSE == 0 &&
      coordLngNO == 0 && coordLngSE == 0)
    return data;

  var filteredData = [];

  for (var i = 0; i < data.length; i++)
  {
    var lat = data[i][IDX_LAT];
    var lng = data[i][IDX_LNG];

    if (lat >= coordLatNO && lat <= coordLatSE && 
        lng >= coordLngNO && lng <= coordLngSE)
    {
      filteredData.push(data[i]);
    }
  }

  return filteredData;
}
*/

function buildBandeau(data)
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

