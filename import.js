function importerFichier()
{
  var fileInput = document.getElementById('fileInput');
  var fileReader = new FileReader();

  fileReader.onload = function (e) {
    var filename = fileInput.files[0].name;
    importedData = importerCSV(fileReader.result);
    workingData = importedData;
  }
  
  fileReader.readAsText(fileInput.files[0]);
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
  else if (s.match(/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:?[0-9]{0,2}/)) //format universel
  {
    retour = new Date(s);
  }

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