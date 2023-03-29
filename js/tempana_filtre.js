
//ok
//applique les filtres
//doit partir des données importées
function appliquerFiltres()
{
  workingData = [...importedData];
  workingData = FiltreColonnes(workingData);
  workingData = FiltreCoord(workingData);
  workingData = FiltreContient(workingData);
  workingData = FiltreDoublon(workingData);
  workingData = FiltrePeriode(workingData);
  importedData2 = [...workingData];
}


function FiltreContient(data)
{
  var idxColonneContient = parseInt(document.getElementById('selectContient').value);
  if (idxColonneContient == -1) return data;

  var inverserContient = document.getElementById('inverserContient').checked;
  var strFiltre = document.getElementById('texteContient').value;
  strFiltre = strFiltre.toLocaleLowerCase();
  var filteredData = [];

  for (var i = 0; i < data.length; i++)
  {
    var str = data[i][idxColonneContient].toLocaleLowerCase();
    var found = str.indexOf(strFiltre) !== -1;

    if ((found && !inverserContient) || (!found && inverserContient))
    {
      filteredData.push(data[i]);
    }
  }

  return filteredData;
}


function FiltreDoublon(data)
{
  var tabEltec = [];
  var filteredData = [];

  if (!document.getElementById('supprimerDoublons').checked ||
    tabColonneEltec.length == 0) return data;

  for (var i = 0; i < data.length; i++)
  {
    var flag = true;
    var str = '';

    for (var j = 0; j < tabColonneEltec.length; j++)
      str += data[i][tabColonneEltec[j]] + '|';

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