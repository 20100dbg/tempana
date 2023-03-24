function dropHandler(ev)
{
  ev.preventDefault();
  if (ev.dataTransfer.items)
    importerFichier(ev.dataTransfer.files[0]);
}

function dragOverHandler(ev) { ev.preventDefault(); }


function importerFichierEvent()
{
  var fileInput = document.getElementById('fileInput');
  if (fileInput.files)
    importerFichier(fileInput.files[0]);
}

function creerNomsColonnes()
{
  var divCateg = document.getElementById('selectCateg');
  var nomCateg = 'Pas de colonne sélectionnée !';
  if (divCateg.selectedIndex > 0) nomCateg = divCateg.item(divCateg.selectedIndex).text;
  var divs = document.querySelectorAll('.nomCateg');
  for (var i = 0; i < divs.length; i++) divs[i].innerHTML = nomCateg;

  var divEltec = document.getElementById('selectEltec');
  var nomEltec = '';
  for (var i = 0; i < divEltec.options.length; i++)
    if (divEltec.options[i].selected) nomEltec += divEltec.options[i].text + ',';
  if (nomEltec == '') nomEltec = 'Pas de colonne sélectionnée !';

  var divs = document.querySelectorAll('.nomEltec');
  for (var i = 0; i < divs.length; i++) divs[i].innerHTML = nomEltec;
}

function changeColonneEltec(obj)
{
  tabColonneEltec = [];

  for (var i = 0; i < obj.options.length; i++)
    if (obj.options[i].selected)
      tabColonneEltec.push(parseInt(obj.options[i].value));
}

function remplirForm(tabCriteres)
{
  var tabCriteres = buildTabCriteres(tabCriteres);
  remplirSelectCategorie(tabCriteres);
  remplirSelectFiltreColonne(tabCriteres);
  remplirSelectEltec(tabCriteres);
  remplirSelectContient(tabCriteres);
}

function remplirSelectCategorie(tabCriteres)
{
  var div = document.getElementById('selectCateg');
  div.innerHTML = '<option value="-1">Colonne catégorie</option>';
  for (var i = 0; i < tabCriteres.length; i++)  
    div.innerHTML += '<option value="'+ (i + offsetColonne) +'">' + tabCriteres[i] + '</options>';
}

function remplirSelectFiltreColonne(tabCriteres)
{
  var div = document.getElementById('selectFiltreColonne');
  div.innerHTML = '<option value="-1">Choix filtre</option>';
  for (var i = 0; i < tabCriteres.length; i++)  
    div.innerHTML += '<option value="'+ (i + offsetColonne) +'">' + tabCriteres[i] + '</options>';
}

function remplirSelectEltec(tabCriteres)
{
  var div = document.getElementById('selectEltec');
  div.innerHTML = '';
  //div.innerHTML = '<option value="-1">Choix eltec</option>';
  for (var i = 0; i < tabCriteres.length; i++)  
    div.innerHTML += '<option value="'+ (i + offsetColonne) +'">' + tabCriteres[i] + '</options>';
}

function remplirSelectContient(tabCriteres)
{
  var div = document.getElementById('selectContient');
  div.innerHTML = '<option value="-1">Choix colonne</option>';
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

  document.getElementById("selectFiltreColonne").selectedIndex = 0;
}
