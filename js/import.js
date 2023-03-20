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


function importerFichier(file)
{
  resetCriteres();
  var fileReader = new FileReader();

  fileReader.onload = function (e)
  {
    var filename = file.name;
    var ext = filename.substring(filename.lastIndexOf('.'));

    if (filename.indexOf('CITHARE') > -1) importedData = importerCITHARE(fileReader.result);
    else if (filename.indexOf('wireshark') > -1) importedData = importerWIRESHARK(fileReader.result);
    else if (ext == ".csv") importedData = importerCSV(fileReader.result);
    else
    {
      alert("Format inconnu");
      importedData = [];
    }

    importedData.sort(function(a,b) { return a[IDX_DATE] > b[IDX_DATE] });
    //startDateGlobal = getMinDate(importedData);
    //endDateGlobal = getMaxDate(importedData);
    
    startDateGlobal = importedData[0][IDX_DATE];
    endDateGlobal = importedData[importedData.length - 1][IDX_DATE];

    const fromSlider = document.querySelector('#fromSlider');
    const toSlider = document.querySelector('#toSlider');
    updatePeriode(fromSlider, toSlider);
    AfficherPeriode();

    buildBandeau(importedData);
    workingData = importedData;
  }
  fileReader.readAsText(file);
  
}


function importerWIRESHARK(txt)
{
  var d = new Date().toJSON().replace('T', ' ').substring(0, 19);
  var s = prompt('Indiquer la date/heure de début de la capture.\nFormat : yyyy-mm-dd hh:mm:ss', d);
  
  if (s == null) dateDebut = new Date(d);
  else dateDebut = new Date(s);
  if (dateDebut == "Invalid Date") dateDebut = new Date();
  

  var lines = txt.split('\n');
  var data = [];
  var tabPad = ["",""];

  tabCriteres = lines[0].trim().split(',');
  for (var j = 0; j < tabCriteres.length; j++) tabCriteres[j] = tabCriteres[j].replace(/^"+|"+$/g, '');
  tabCriteres = tabPad.concat(tabCriteres.slice(1));
  tabCriteres = buildTabCriteres(tabCriteres);

  remplirSelectCriteres(tabCriteres);
  remplirSelectFiltre(tabCriteres);
  remplirSelectEltec(tabCriteres);

  for (var i = 1; i < lines.length; i++)
  {
    if (lines[i] == "") continue;

    var tab = lines[i].trim().split(',');
    tab = tabPad.concat(tab.slice(1));

    for (var j = 0; j < tab.length; j++) tab[j] = tab[j].replace(/^"+|"+$/g, '');

    var tmp = parseFloat(tab[IDX_DATE]);
    var time = dateDebut.getTime() + (tmp * 1000);
    tab[IDX_DATE] = new Date(time);
    data.push(tab);
  }

  return data;
}


function importerCITHARE(txt)
{
  var lines = txt.split('\n');
  var data = [];

  tabCriteres = lines[0].trim().split(';');
  tabCriteres = tabCriteres.slice(0,2).concat(tabCriteres.slice(4));  
  tabCriteres = buildTabCriteres(tabCriteres);
  remplirSelectCriteres(tabCriteres);
  remplirSelectFiltre(tabCriteres);
  remplirSelectEltec(tabCriteres);

  for (var i = 1; i < lines.length; i++)
  {
    if (lines[i] == "") continue;

    var tab = lines[i].trim().split(';');
    tab = tab.slice(0,2).concat(tab.slice(4));

    for (var j = 0; j < tab.length; j++) tab[j] = tab[j].replace(/^"+|"+$/g, '');

    tab[IDX_DATE] = convertirDate(tab[IDX_DATE]);
    var x = tab[IDX_LAT];
    tab[IDX_LAT] = tab[IDX_LNG];
    tab[IDX_LNG] = x;
    data.push(tab);
  }

  return data;
}

function convertirDate(s)
{
  var retour = null;

  if (s.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4} [0-9]{2}:[0-9]{2}:?[0-9]{0,2}/)) //format excel 31/01/2023 10:30
  {
    var tab1 = s.split(' ');
    var tab2 = tab1[0].split('/');
    s = tab2[2] + '-' + tab2[1] + '-' + tab2[0] + ' ' + tab1[1];
    retour = new Date(s);
  }
  else// if (s.match(/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:?[0-9]{0,2}/)) //format universel
  {
    retour = new Date(s);
  }
  if (retour == "Invalid Date") retour = null;

  return retour;
}

function nettoyerLigne(tab)
{
  for (var i = 0; i < tab.length; i++)
  {
    tab[i] = tab[i].replace(/^[\s"]+/, '').replace(/[\s"]+$/, '');
  }

  return tab;
}

function importerCSV(txt)
{
  var nbTotalLine = 0;
  var nbLineOk = 0;
  var data = [];
  var lines = txt.split('\n');

  tabCriteres = buildTabCriteres(lines[0].trim().split(';'));
  remplirSelectCriteres(tabCriteres);
  remplirSelectFiltre(tabCriteres);
  remplirSelectEltec(tabCriteres);

  //saute la première ligne
  for (var i = 1; i < lines.length; i++)
  {
    if (lines[i].trim() == '') continue;

    var tab = lines[i].trim().split(';');
    tab = nettoyerLigne(tab);

    var date = convertirDate(tab[IDX_DATE]);
    if (date != null)
    {
      tab[IDX_DATE] = date;
      data.push(tab);
      nbLineOk += 1;
    }
    nbTotalLine += 1;
  }

  return data;
}