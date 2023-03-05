var tabUniteTemps = ["annee", "mois", "semaine", "jour", "heure" ];
var tabSerie = [];

function importFile()
{
  var fileInput = document.getElementById('fileInput');
  var fileReader = new FileReader();
  var importedData;

  fileReader.onload = function (e) {
    
    var filename = fileInput.files[0].name;
    //var ext = filename.substring(filename.lastIndexOf('.'));

    importedData = importCSV(fileReader.result);
  }
  
  fileReader.readAsText(fileInput.files[0]);
}


function importCSV(txt)
{
  var lines = txt.split('\n');
  var data = [];

  //var headerLine = lines[0].trim().split(';');

  //saute la première ligne
  for (var i = 1; i < lines.length; i++)
  {
    var tab = lines[i].trim().split(';');
    data.push(tab);
  }

  //data.sort((a, b) => a.gdh > b.gdh);
  return data;
}


function addSelect(divId)
{
  var div = document.getElementById(divId);
  div.innerHTML = '<select onchange="xxxx(this);">';
  for (var i = 0; i < tabSerie.length; i++)  
    div.innerHTML += '<option value="'+ i +'">' + tabSerie[i] + '</options>';
  div.innerHTML += '</select>';
}

function buildTabSerie(data, idxColonne)
{
  var tabSerie = [];
  for (var i = 0; i < data.length; i++)
    if (!tabSerie.includes(data[i][idxColonne]))
      tabSerie.push(data[i][idxColonne]);
  return tabSerie;
}




function buildData(tab)
{
  var data = [];

  for (var i = 0; i < tab.length; i++)
  {
    //var tmpDate = Date.parse(ConvDateFromExcel(tab[i][0]));
    var tmpDate = new Date(ConvDateFromExcel(tab[i][0]));
    tmpDate.setHours(0,0,0,0);

    var flag = false;
    for (var j = 0; j < data.length && !flag; j++) {
      if (data[j].date == tmpDate.getTime()) {
        flag = true;
        data[j].value += 1;
      }
    }

    if (!flag) data.push({ date: tmpDate.getTime(), value: 1 });

  }

  return data;
}


function buildData2(tab, colonneSerie, uniteTemps)
{
  tabSerie = buildTabSerie(tab, colonneSerie)
  var data = [];

  for (var i = 0; i < tab.length; i++)
  {
    var x = tab[i][0];
    x = ConvDateFromExcel(x);
    var tmpDate = new Date(x);
    tmpDate = getDate(tmpDate, uniteTemps);
    
    var flag = false;
    for (var j = 0; j < data.length && !flag; j++) {
      if (data[j]["date"] == tmpDate) {
        data[j][tab[i][colonneSerie]] += 1;
        flag = true;
      }
    }

    if (!flag)
    {
      var tmpObj = { };
      for (var i = 0; i < tabSerie.length; i++) tmpObj[tabSerie[i]] = 0;
      tmpObj["date"] = tmpDate;
      tmpObj[tab[i][colonneSerie]] += 1;
      data.push(tmpObj);
    }
  }

  return data;
}


function buildData3(tab, colonneSerie)
{
  var data = {};
  tabSerie = buildTabSerie(tab, colonneSerie);

  var startDate = getMinDate(tab);
  startDate = startDate.setHours(0,0,0,0);
  var endDate = getMaxDate(tab);
  endDate = endDate.setHours(0,0,0,0);

  for (var i = 0; i < tabSerie.length; i++)
  {
    var date = startDate;
    var maSerie = tabSerie[i];
    data[maSerie] = [];

    while (date < endDate)
    {
      data[maSerie].push({date: date, value: 0});
      date += 86400000;
    }
  }

  for (var i = 0; i < tab.length; i++)
  {
    var tmpDate = new Date(ConvDateFromExcel(tab[i][0]));
    tmpDate.setHours(0,0,0,0);
    var maSerie = tab[i][colonneSerie];

    var found = false;
    for (var j = 0; j < data[maSerie].length && !found; j++)
    {
      if (data[maSerie][j]["date"] == tmpDate.getTime())
      {
        data[maSerie][j].value += 1;
        found = true;
      }
    }

  }

  return data;
}


function getMinDate(tab)
{
  var min = new Date(2999, 11, 31);
  for (var i = 0; i < tab.length; i++)
  {
    var tmpDate = new Date(ConvDateFromExcel(tab[i][0]));
    if (min.getTime() > tmpDate.getTime()) min = tmpDate;
  }
  return min;
}

function getMaxDate(tab)
{
  var max = new Date(0, 0, 1);
  for (var i = 0; i < tab.length; i++)
  {
    var tmpDate = new Date(ConvDateFromExcel(tab[i][0]));
    if (max.getTime() < tmpDate.getTime()) max = tmpDate;
  }
  return max;
}


function buildData4(tab)
{
  var tmpdata = {};
  var data = [];

  for (var i = 0; i < tab.length; i++)
  {
    var col = tab[i][1];
    if (!(col in tmpdata)) tmpdata[col] = 1;
    else tmpdata[col] += 1;
  }

  for (var mac in tmpdata)
    data.push({"mac": mac, "value": tmpdata[mac]});

  data.sort(function(a,b) { //décroissant
    if (a.value < b.value) return 1;
    if (a.value > b.value) return -1;
    return 0;
  });

  data = data.slice(0,10);

  return data;
}


function PreremplirTab(tab)
{
  var startDate = getMinDate(tab);
  var endDate = getMaxDate(tab);
  //TODO : mettre en dur de 00:00 à 23:59


  var tabSerie = buildTabSerie(tab, colonneSerie);

  for (var i = 0; i < tabSerie.length; i++)
  {
    var date = startDate;
    var maSerie = tabSerie[i];
    data[maSerie] = [];

    while (date < endDate)
    {
      data[maSerie].push({date: date, value: 0});
      date += 86400000;
    }
  }
  return data;
}

function BuildRecurrenceHeure(tab)
{

}

function BuildRecurrenceHeureJour(tab)
{
  var tmpdata = {};

  for (var i = 1; i < 8; i++)
  {
    var jour = DayNumberToDayString(i);

    for (var j = 0; j < 24; j++)
    {
      var heure = ((j < 10) ? "0":"") + j + 'h';
      tmpdata[jour + '-' + heure] = 0;
    }
  }


  for (var i = 0; i < tab.length; i++)
  {
    var x = tab[i][0];
    x = ConvDateFromExcel(x);

    var date = new Date(x);
    
    var jour = DayNumberToDayString(date.getUTCDay());
    var heure = date.getHours();
    heure = ((heure < 10) ? "0":"") + heure;

    var key = jour + '-' + heure + 'h';
    if (key in tmpdata) tmpdata[key] += 1;
    else tmpdata[key] = 1;
  }

  var data = [];

  for (var key in tmpdata)
  {
    var tmp = key.split("-");
    data.push({weekday: tmp[0], hour: tmp[1], value: tmpdata[key]});
  }

  return data;
}


function BuildRecurrenceHeureMois(tab)
{
  var tmpdata = {};

  for (var i = 1; i < 32; i++)
  {
    var jour = ((jour < 10) ? "0":"") + jour;

    for (var j = 0; j < 24; j++)
    {
      var heure = ((j < 10) ? "0":"") + j + 'h';
      tmpdata[jour + '-' + heure] = 0;
    }
  }


  for (var i = 0; i < tab.length; i++)
  {
    var x = tab[i][0];
    x = ConvDateFromExcel(x);

    var date = new Date(x);
    
    var jour = date.getDate();
    jour = ((jour < 10) ? "0":"") + jour;

    var heure = date.getHours();
    heure = ((heure < 10) ? "0":"") + heure;

    var key = jour + '-' + heure + 'h';
    if (key in tmpdata) tmpdata[key] += 1;
    else tmpdata[key] = 1;
  }

  var data = [];

  for (var key in tmpdata)
  {
    var tmp = key.split("-");
    data.push({weekday: tmp[0], hour: tmp[1], value: tmpdata[key]});
  }

  return data;
}

function BuildRecurrenceHeureMois2(tab)
{
  var tmpdata = {};
/*
  {
    "title": "Zimbabwe",
    "id": "ZW",
    "color": "#de4c4f",
    "continent": "africa",
    "x": 545.344601005788,
    "y": 58.142,
    "value": 13013678
  }
*/

  for (var i = 1; i < 32; i++)
  {
    var jour = ((jour < 10) ? "0":"") + jour;

    for (var j = 0; j < 24; j++)
    {
      var heure = ((j < 10) ? "0":"") + j + 'h';
      tmpdata[jour + '-' + heure] = 0;
    }
  }


  for (var i = 0; i < tab.length; i++)
  {
    var x = tab[i][0];
    x = ConvDateFromExcel(x);

    var date = new Date(x);
    
    var jour = date.getDate();
    jour = ((jour < 10) ? "0":"") + jour;

    var heure = date.getHours();
    heure = ((heure < 10) ? "0":"") + heure;

    var key = jour + '-' + heure + 'h';
    if (key in tmpdata) tmpdata[key] += 1;
    else tmpdata[key] = 1;
  }

  var data = [];

  for (var key in tmpdata)
  {
    var tmp = key.split("-");
    data.push({weekday: tmp[0], hour: tmp[1], value: tmpdata[key]});
  }

  return data;
}

