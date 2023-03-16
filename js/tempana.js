var tabUniteTemps = ["annee", "mois", "semaine", "jour", "heure" ];
var tabCouleur = [ "#ff0000", "#ffff00", "#00ff00", "#0080ff", "#ff80c0", "#00ffff", "#004080", "#008000", "#ff8000", "#804000", "#acac59", "#950095", "#c0c0c0"];
var tabValeursCriteres = [];
var tabCriteres = [];

var offsetColonne = 3;
var idxColonne = -1;
var idxColonneEltec = -1;
var idxUniteTemps = 0;

var startDateGlobal = 0;
var endDateGlobal = 0;
var startDatePeriode = 0;
var endDatePeriode = 0;

var coordLatNO = 0;
var coordLngNO = 0;
var coordLatSE = 0;
var coordLngSE = 0;

var IDX_LAT = 0;
var IDX_LNG = 1;
var IDX_DATE = 2;

function changeCritere(obj)
{
  idxColonne = obj.value;
}

function changeUniteTemps(obj)
{
  idxUniteTemps = obj.value;
}

function selectColonneEltec(obj)
{
  idxColonneEltec = obj.value;
}


function remplirSelectCriteres(tabCriteres)
{
  var div = document.getElementById('categ');
  div.innerHTML = '<option value="-1">Choix critère</option>';
  for (var i = 0; i < tabCriteres.length; i++)  
    div.innerHTML += '<option value="'+ (i + offsetColonne) +'">' + tabCriteres[i] + '</options>';
}


function remplirSelectFiltre(tabCriteres)
{
  var div = document.getElementById('selectFiltre');
  div.innerHTML = '<option value="-1">Choix filtre</option>';
  for (var i = 0; i < tabCriteres.length; i++)  
    div.innerHTML += '<option value="'+ (i + offsetColonne) +'">' + tabCriteres[i] + '</options>';
}

function remplirSelectEltec(tabCriteres)
{
  var div = document.getElementById('eltec');
  div.innerHTML = '<option value="-1">Choix eltec</option>';
  for (var i = 0; i < tabCriteres.length; i++)  
    div.innerHTML += '<option value="'+ (i + offsetColonne) +'">' + tabCriteres[i] + '</options>';
}


function ajouterFormFiltre(obj)
{
  if (obj.value == "-1") return;
  var div = document.getElementById('filtres');
  div.innerHTML += '<div id="div-'+ obj.value +'" class="col-sm"></div>';

  div = document.getElementById("div-"+ obj.value);
  div.innerHTML = '<b>' + obj.item(obj.selectedIndex).text + '</b><br>' +
                  '<select id="values-'+ obj.value +'" multiple></select><br>' +
                  '<button onclick="supprimerFiltre(\''+ obj.value +'\')">Supprimer filtre</button>';

  div = document.getElementById("values-"+ obj.value);

  var tabValAttribut = [];
  for (var i = 0; i < importedData.length; i++)
  {
    var valAttribut = importedData[i][obj.value];
    if (!tabValAttribut.includes(valAttribut)) tabValAttribut.push(valAttribut);
  }

  tabValAttribut.sort()
  for (var i = 0; i < tabValAttribut.length; i++)
      div.innerHTML += "<option value='"+ i +"'>"+ tabValAttribut[i] +"</option>";

  document.getElementById("selectFiltre").selectedIndex = 0;
}


function appliquerFiltre()
{
  workingData = FiltresColonnes(workingData);
  workingData = FiltrePeriode(workingData);
  workingData = FiltreCoord(workingData);
}

function FiltrePeriode(data)
{
  const [startPeriode, endPeriode] = ExtrairePeriode();
  startDatePeriode = startPeriode;
  endDatePeriode = endPeriode;

  var filteredData = [];

  for (var i = 0; i < data.length; i++)
  {
    if (data[i][IDX_DATE] >= startPeriode && data[i][IDX_DATE] <= endPeriode)
      filteredData.push(data[i]);
  }

  return filteredData;
}

function FiltresColonnes(data)
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

    //if ((config.filterAllCriteria && !tabFlag.includes(false)) || (!config.filterAllCriteria && tabFlag.includes(true)))
    if (!tabFlag.includes(false))
    {
      filteredData.push(data[i]);  
    }
  }
  return filteredData; 
}

function supprimerFiltre()
{
  var divFiltres = document.getElementById('filtres');

  for (var i = divFiltres.childNodes.length - 1; i >= 0; i--)
    divFiltres.childNodes[i].remove();

  document.getElementById('fromSlider').value = 0;
  document.getElementById('toSlider').value = 100;
  
  document.getElementById('filtreCoord').value = '';

  workingData = importedData;
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


function updatePeriode(fromSlider, toSlider)
{
  const [startPeriode, endPeriode] = ExtrairePeriode();
  startDatePeriode = startPeriode;
  endDatePeriode = endPeriode;

  document.getElementById('infoSlider').innerHTML = 
  'Global : ' + startDateGlobal.toUTCString() + ' - ' + endDateGlobal.toUTCString() + '<br>' +
  'Periode : ' + startDatePeriode.toUTCString() + ' - ' +  endDatePeriode.toUTCString();
}


function ExtrairePeriode()
{
  const fromSlider = document.querySelector('#fromSlider');
  const toSlider = document.querySelector('#toSlider');
  const [from, to] = getParsed(fromSlider, toSlider);

  var diff = endDateGlobal - startDateGlobal;
  var startDatePeriode = startDateGlobal.getTime() + (from * diff / 100);
  var endDatePeriode = startDateGlobal.getTime() + (to * diff / 100);

  return [new Date(startDatePeriode), new Date(endDatePeriode)];
}

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


function buildBandeau(data)
{
  var diff = endDateGlobal - startDateGlobal;
  var largeur = 400;

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