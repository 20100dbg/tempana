var splitcsv = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/

function importerFichier(file)
{
  resetForm();
  resetFiltresEtSelect();
  var fileReader = new FileReader();

  fileReader.onload = function (e)
  {
    var filename = file.name;
    var ext = filename.substring(filename.lastIndexOf('.'));
    var divFilename = document.getElementById('nomFichierImport');
    divFilename.innerHTML = filename;

    if (filename.indexOf('CITHARE') > -1) importedData = importerCITHARE(fileReader.result);
    else if (filename.indexOf('wireshark') > -1) importedData = importerWIRESHARK(fileReader.result);
    else if (ext == ".csv") importedData = importerCSV(fileReader.result);
    else
    {
      importedData = [];
      workingData = [];
    }

    if (importedData.length == 0)
    {
      divFilename.classList.add("error");
      divFilename.innerHTML = "format non reconnu ! Faut-il spécifier 'cithare' ou 'wireshark' dans le nom de fichier ?";
      return;
    }
    else
      divFilename.classList.remove("error");


    importedData.sort(function(a,b) { return a[IDX_DATE] > b[IDX_DATE] });
    startDateGlobal = importedData[0][IDX_DATE];
    endDateGlobal = importedData[importedData.length - 1][IDX_DATE];

    updatePeriode(fromSlider, toSlider);
    AfficherPeriode();

    DessinerPoints(importedData);
    centrerVue(importedData);

    AffichierPrevisualisation(importedData);
    buildBandeau(importedData);

    workingData = [...importedData];
    afficherStats();
  }

  fileReader.readAsText(file);
}

function AffichierPrevisualisation(importedData)
{
  var obj = document.getElementById('previsualisation');
  //.table-responsive-sm
  var str = '<table class="table table-sm"><thead><tr>';

  for (var i = 0; i < tabHeaders.length; i++)
  {
    str += '<th scope="col">'+ tabHeaders[i] +'</th>';
  }
  str += '</tr></thead><tbody>';

  for (var i = 0; i < 4; i++)
  {
    str += '<tr>';
    var tabtmp = importedData[i].slice(offsetColonne);

    for (var j = 0; j < tabtmp.length; j++)
      str += '<td>'+ tabtmp[j].substring(0,15) +'</td>';

    str += '</tr>';
  }

  str += '</tbody></table>';
  obj.innerHTML = str;
}


function importerWIRESHARK(txt)
{
  var data = [];
  var tabPad = ["",""];
  var lines = txt.split('\n');

  var tabHeaders = lines[0].trim().split(',');
  for (var j = 0; j < tabHeaders.length; j++) tabHeaders[j] = tabHeaders[j].replace(/^"+|"+$/g, '');
  tabHeaders = tabPad.concat(tabHeaders.slice(1));
  remplirForm(tabHeaders);

  //détection du format du fichier wireshark
  //la colonne time contient soit le nombre de secondes depuis le début de la capture
  //soit un datetime complet avec millisecondes
  var tmpTest = lines[1].trim().split('","');
  tmpTest = tmpTest[1].replace(',','.');
  tmpTest = new Date(tmpTest);
  var colonneSeconds = (tmpTest  == "Invalid Date");

  if (colonneSeconds)
  {  
    var d = new Date().toJSON().replace('T', ' ').substring(0, 19);
    var s = prompt('Indiquer la date/heure de début de la capture.\nFormat : yyyy-mm-dd hh:mm:ss', d);
    
    if (s == null) dateDebut = new Date(d);
    else dateDebut = new Date(s);
    if (dateDebut == "Invalid Date") dateDebut = new Date();
  }


  for (var i = 1; i < lines.length; i++)
  {
    if (lines[i] == "") continue;

    var tab = lines[i].trim().split('","');
    tab = tabPad.concat(tab.slice(1));

    for (var j = 0; j < tab.length; j++) tab[j] = tab[j].replace(/^"+|"+$/g, '');

    if (colonneSeconds)
    {
      var tmp = parseFloat(tab[IDX_DATE]);
      var time = dateDebut.getTime() + (tmp * 1000);
      tab[IDX_DATE] = new Date(time);
    }
    else
    {
      tab[IDX_DATE] = new Date(tab[IDX_DATE].replace(',','.'));
    }

    data.push(tab);
  }


  return data;
}


function importerCITHARE(txt)
{
  var lines = txt.split('\n');
  var data = [];

  var tabHeaders = lines[0].trim().split(';');
  tabHeaders = tabHeaders.slice(0,2).concat(tabHeaders.slice(4));  
  remplirForm(tabHeaders);

  for (var i = 1; i < lines.length; i++)
  {
    if (lines[i] == "") continue;

    var tab = lines[i].trim().split(splitcsv);
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


function importerCSV(txt)
{
  var nbTotalLine = 0;
  var nbLineOk = 0;
  var data = [];
  var lines = txt.split('\n');

  var tabHeaders = lines[0].trim().split(';');
  remplirForm(tabHeaders);

  //saute la première ligne
  for (var i = 1; i < lines.length; i++)
  {
    if (lines[i].trim() == '') continue;

    var tab = lines[i].trim().split(';');
    tab = nettoyerLigne(tab);

    var date = convertirDate(tab[IDX_DATE]);
    //var dateFin = convertirDate(tab[IDX_DATE_FIN]);
    
    if (date != null)
    {
      tab[IDX_DATE] = date;
      //if (dateFin == null) dateFin = date;
      //tab[IDX_DATE_FIN] = dateFin;

      data.push(tab);
      nbLineOk += 1;
    }
    nbTotalLine += 1;
  }

  return data;
}


function convertirDate(s)
{
  var retour = null;
  if (s == null) return retour;

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
