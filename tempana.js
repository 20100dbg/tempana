var tabUniteTemps = ["annee", "mois", "semaine", "jour", "heure" ];
var tabCouleur = [ "#ff0000", "#ffff00", "#00ff00", "#0080ff", "#ff80c0", "#00ffff", "#004080", "#008000", "#ff8000", "#804000", "#acac59", "#950095", "#c0c0c0"];
var tabValeursCriteres = [];
var tabCriteres = [];
var offsetColonne = 3;
var idxColonne = offsetColonne;
var idxColonneEltec = offsetColonne;
var idxUniteTemps = 0;

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

function appliquerFiltre()
{
  workingData = importedData;
}

function remplirSelectCriteres(tabCriteres)
{
  //div.innerHTML = '<select onchange="xxxx(this);">';
  //div.innerHTML += '</select>';
  
  var div = document.getElementById('criteres');
  div.innerHTML = '';
  for (var i = 0; i < tabCriteres.length; i++)  
    div.innerHTML += '<option value="'+ (i + offsetColonne) +'">' + tabCriteres[i] + '</options>';
}


function remplirSelectFiltre(tabCriteres)
{
  var div = document.getElementById('selectFiltre');
  div.innerHTML = '';
  for (var i = 0; i < tabCriteres.length; i++)  
    div.innerHTML += '<option value="'+ (i + offsetColonne) +'">' + tabCriteres[i] + '</options>';
}

function remplirSelectEltec(tabCriteres)
{
  var div = document.getElementById('eltec');
  div.innerHTML = '';
  for (var i = 0; i < tabCriteres.length; i++)  
    div.innerHTML += '<option value="'+ (i + offsetColonne) +'">' + tabCriteres[i] + '</options>';
}


function ajouterFormFiltre(obj)
{
  if (obj.value == "-1") return;
  var div = document.getElementById('filtres');
  div.innerHTML += '<div id="div-'+ obj.value +'"></div>';

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

function supprimerFiltre(id)
{
  document.getElementById('div-' + id).outerHTML = '';
  appliquerFiltre();
}
