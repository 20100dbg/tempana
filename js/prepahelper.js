function buildTabValeurs(data, idxColonne)
{
  var tabValeurs = [];
  for (var i = 0; i < data.length; i++)
    if (!tabValeurs.includes(data[i][idxColonne]))
      tabValeurs.push(data[i][idxColonne]);
  return tabValeurs;
}


function buildTabCriteres(ligneEntetes)
{
  var tabCriteres = [];
  for (var i = offsetColonne; i < ligneEntetes.length; i++)
      tabCriteres.push(ligneEntetes[i]);
  return tabCriteres;
}


function DayNumberToDayString(val)
{
  switch(val)
  {
  case 0: return "Dimanche";
  case 1: return "Lundi";
  case 2: return "Mardi";
  case 3: return "Mercredi";
  case 4: return "Jeudi";
  case 5: return "Vendredi";
  case 6: return "Samedi";
  case 7: return "Dimanche";
  }
}


Date.prototype.getWeek = function()
{
  var date = new Date(this.getTime());
  date.setHours(0,0,0,0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  var week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + 
    (week1.getDay() + 6) % 7) / 7);
}


function ConvDateFromExcel(val)
{
  var tab = val.split(' ');
  var date = tab[0].split('/');
  return date[2] + "-" + date[1] + "-" + date[0] + " " + tab[1]; 
}


function getMinDate(tab)
{
  var min = new Date(2999, 11, 31).getTime();
  for (var i = 0; i < tab.length; i++)
  {
    var tmpDate = tab[i][IDX_DATE].getTime();
    if (min > tmpDate) min = tmpDate;
  }
  return new Date(min);
}


function getMaxDate(tab)
{
  var max = new Date(0, 0, 1).getTime();
  for (var i = 0; i < tab.length; i++)
  {
    var tmpDate = tab[i][IDX_DATE].getTime();
    if (max < tmpDate) max = tmpDate;
  }
  return new Date(max);
}


function addSeconds(date, seconds)
{
  date.setSeconds(date.getSeconds() + seconds);
  return date;
}


function getYMD(date)
{
  return date.toISOString().replace('T', ' ').substring(0,19);
}


function GetStringDate(date, type = 'second', fillDefault = false)
{
  //var template = '%year%-%month%-%day% %hour%:%minute%:%second%.%millisecond%';
  //var template_week = '%year%-%week%';
  var template_defaut = '0001-01-01 00:00:00.0';
  var sdate = date.toISOString().replace('T', ' ');

  var year = date.getFullYear();
  var month = (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  var day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
  var hour = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
  var minute = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
  var time = date.getTime();
  var week = date.getWeek();

  var idx = 0;
  if (type == 'year') idx = 4;
  else if (type == 'month') idx = 7;
  else if (type == 'day') idx = 10;
  else if (type == 'hour') idx = 13;
  else if (type == 'minute') idx = 16;
  else if (type == 'second') idx = 19;
  else if (type == 'millisecond') idx = sdate.length - 1;
  else if (type == 'week') idx = 4;
  sdate = sdate.substring(0, idx);
  
  if (type == 'week') sdate += '-' + week;
  else if (type == 'time') sdate = date.getTime();
  else if (fillDefault) sdate += template_defaut.substring(idx);

  return sdate;
}


function GetEcartTemps(uniteTemps)
{
  var ecartTemps = 0;
  if (uniteTemps == 'year') ecartTemps = 31536000000;
  else if (uniteTemps == 'month') ecartTemps = 2592000000;
  else if (uniteTemps == 'week') ecartTemps = 604800000;
  else if (uniteTemps == 'day') ecartTemps = 86400000;
  else if (uniteTemps == 'hour') ecartTemps = 3600000;
  else if (uniteTemps == 'minute') ecartTemps = 60000;
  else if (uniteTemps == 'second') ecartTemps = 1000;
  else if (uniteTemps == 'millisecond') ecartTemps = 0;
  return ecartTemps;
}