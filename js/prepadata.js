function buildEvolutionGlobale(tab)
{
  var data = [];
  var tmpdata = {};

  for (var i = 0; i < tab.length; i++)
  {
    var tmpDate = new Date(GetStringDate(tab[i][IDX_DATE], uniteTemps));
    tmpDate = tmpDate.getTime();

    if (!(tmpDate in tmpdata)) tmpdata[tmpDate] = 0;
    tmpdata[tmpDate] += 1;
  }

  for (var tmpDate in tmpdata)
  {
    data.push({ date: parseInt(tmpDate), value: tmpdata[tmpDate] });
  }

  return data;
}



function buildEvolutionGlobaleCumulative(tab)
{
  var data = [];
  var nbEvent = 0;
  var lastDate = 0;

  for (var i = 0; i < tab.length; i++)
  {
    var tmpDate = new Date(GetStringDate(tab[i][IDX_DATE], uniteTemps));
    tmpDate = tmpDate.getTime();
    
    if (i == 0) lastDate = tmpDate;
    nbEvent += 1;

    if (lastDate != tmpDate || i == tab.length - 1)
    {
      data.push({ date: tmpDate, value: nbEvent });
      lastDate = tmpDate;
    }
  }

  return data;
}


function buildEvolutionCateg(tab, colonneSerie, unitePeriode)
{
  tabSerie = buildTabValeurs(tab, colonneSerie)
  var data = [];

  for (var i = 0; i < tab.length; i++)
  {
    var tmpDate = GetStringDate(tab[i][IDX_DATE], unitePeriode, true);
    
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

  data.sort(function(a,b) { return a.date > b.date });

  return data;
}


function buildEvolutionGlobaleCumulativeCateg(tab, colonneSerie)
{
  var data = {};
  var tabNbEvent = {};

  tabSerie = buildTabValeurs(tab, colonneSerie);
  for (var i = 0; i < tabSerie.length; i++) data[tabSerie[i]] = [{date: startDatePeriode.getTime(), value:0}];

  for (var i = 0; i < tab.length; i++)
  {
    var tmpDate = new Date(tab[i][IDX_DATE].getTime());
    var maSerie = tab[i][colonneSerie];

    if (!(maSerie in tabNbEvent)) tabNbEvent[maSerie] = 0;
    tabNbEvent[maSerie] += 1;

    data[maSerie].push({date: tmpDate.getTime(), value: tabNbEvent[maSerie]});
  }

  for (var i = 0; i < tabSerie.length; i++)
    data[tabSerie[i]].push({date: endDatePeriode.getTime(), value:tabNbEvent[tabSerie[i]]});

  return data;
}


function buildEvolutionGlobaleCateg(tab, colonneSerie)
{
  var data = {};
  tabSerie = buildTabValeurs(tab, colonneSerie);

  var startDate = new Date(GetStringDate(tab[0][IDX_DATE], uniteTemps, true)).getTime();
  var endDate = new Date(GetStringDate(tab[tab.length - 1][IDX_DATE], uniteTemps, true)).getTime();

  var ecartTemps = GetEcartTemps(uniteTemps);


  for (var i = 0; i < tabSerie.length; i++)
  {
    var date = startDate;
    var maSerie = tabSerie[i];
    data[maSerie] = [];

    while (date <= endDate)
    {
      data[maSerie].push({date: date, value: 0});
      date += ecartTemps;
    }
  }

  for (var i = 0; i < tab.length; i++)
  {
    var tmpDate = new Date(GetStringDate(tab[i][IDX_DATE], uniteTemps, true)).getTime();
    var maSerie = tab[i][colonneSerie];

    var found = false;
    for (var j = 0; j < data[maSerie].length && !found; j++)
    {
      if (data[maSerie][j]["date"] == tmpDate)
      {
        data[maSerie][j].value += 1;
        found = true;
      }
    }
  }

  return data;
}


function buildElementsActifs(tab)
{
  var tmpdata = {};
  var data = [];

  for (var i = 0; i < tab.length; i++)
  {
    for (var j = 0; j < tabColonneEltec.length; j++)
    {
      var col = tab[i][tabColonneEltec[j]];
      if (!(col in tmpdata)) tmpdata[col] = 1;
      else tmpdata[col] += 1;
    }
  }

  for (var eltec in tmpdata)
    data.push({"eltec": eltec, "value": tmpdata[eltec]});

  data.sort(function(a,b) { //décroissant
    if (a.value < b.value) return 1;
    if (a.value > b.value) return -1;
    return 0;
  });

  data = data.slice(0,10);
  return data;
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
    var date = tab[i][IDX_DATE];

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
  var tmpdata = {}

  for (var i = 0; i < tab.length; i++)
  {
    var date = tab[i][IDX_DATE];    
    var jour = (date.getDate() < 10) ? '0'+date.getDate():date.getDate();
    var heure = (date.getHours() < 10) ? '0'+date.getHours():date.getHours() + 'h';

    if (!(jour in tmpdata)) tmpdata[jour] = {};
    if (!(heure in tmpdata[jour])) tmpdata[jour][heure] = 0;

    tmpdata[jour][heure] += 1;
  }

  var data = [];

  for (var jour in tmpdata)
  {
    for (var heure in tmpdata[jour])
    {
      data.push({
        "heure": heure,
        "jour": jour,
        "value": parseInt(tmpdata[jour][heure])
      });
    }
  }

  return data;
}


function BuildRecurrenceSemaine(tab)
{
  var tmpdata = {}

  for (var i = 1; i < 54; i++) tmpdata[i] = 0;

  for (var i = 0; i < tab.length; i++)
  {
    tmpdata[tab[i][IDX_DATE].getWeek()] += 1;
  }

  var data = [];
  for (var semaine in tmpdata)
  {
    data.push({ date: semaine, value: tmpdata[semaine] });
  }

  return data;
}


function BuildRecurrenceJourMois(tab)
{
  var tmpdata = {}

  for (var i = 1; i < 32; i++) tmpdata[i] = 0;

  for (var i = 0; i < tab.length; i++)
  {
    tmpdata[tab[i][IDX_DATE].getDate()] += 1;
  }

  var data = [];
  for (var jour in tmpdata)
  {
    data.push({ date: jour, value: tmpdata[jour] });
  }

  return data;
}


function buildRepartitionCateg(tab, idxColonneCateg)
{
  var tmpdata = [];
  var data = [];

  for (var i = 0; i < tab.length; i++)
  {
    var tmp = tab[i][idxColonneCateg];
    if (!(tmp in tmpdata)) tmpdata[tmp] = 0;
    tmpdata[tmp] += 1;
  }

  for (var tmp in tmpdata)
  {
    data.push({category:tmp, value: tmpdata[tmp]});
  }

  return data;
}


function buildGanttCateg(tab, idxColonneCateg)
{
  var data = [];
  var diff = endDatePeriode - startDatePeriode;
  diff = diff / 1000 / 360;

  for (var i = 0; i < tab.length; i++)
  {
    var categ = tab[i][idxColonneCateg];

    var dateDebut = getYMD(tab[i][IDX_DATE]);
    var dateFin = new Date(tab[i][IDX_DATE]);
    dateFin = getYMD(addSeconds(dateFin, diff));

    data.push({
      category:categ, 
      fromDate: dateDebut,
      toDate: dateFin
    });
  }

  return data;
}