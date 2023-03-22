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
  for (var i = 3; i < ligneEntetes.length; i++)
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


function getDate(val, unitePeriode)
{
  var months = (val.getMonth() + 1 < 10) ? '0' + (val.getMonth() + 1) : val.getMonth() + 1;
  var hours = (val.getHours() + 1 < 10) ? '0' + (val.getHours() + 1) : val.getHours() + 1;
  var minutes = (val.getMinutes() + 1 < 10) ? '0' + (val.getMinutes() + 1) : val.getMinutes() + 1;

  if (unitePeriode == 0) return ''+val.getFullYear();
  else if (unitePeriode == 1) return ''+val.getFullYear() + '-' + months
  else if (unitePeriode == 2) return ''+val.getFullYear() + '-' + val.getWeek();
  else if (unitePeriode == 3) return ''+val.toLocaleDateString();
  else if (unitePeriode == 4) return ''+val.toLocaleDateString() + " " + hours;
  else if (unitePeriode == 5) return ''+val.toLocaleDateString() + " " + hours + ":" + minutes;
  else if (unitePeriode == 6) return ''+val.toLocaleString();
  else if (unitePeriode == 7) return ''+val.toISOString();
}

function getYMD(date)
{
  return date.toISOString().replace('T', ' ').substring(0,19);
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

function getTruncatedDate(date)
{
  var sdate = '';
  if (uniteTemps == 'year') sdate += date.getFullYear() + '-01-01 00:00:00';
  else if (uniteTemps == 'month') sdate += date.getFullYear() + '-' + (date.getMonth()+1) + '-01 00:00:00';
  else if (uniteTemps == 'week')
  {
    date = new Date(date.setDate(date.getDate() - date.getDay()));
    sdate += date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() +' 00:00:00';
  }
  else if (uniteTemps == 'day') sdate += date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() +' 00:00:00';
  else if (uniteTemps == 'hour') sdate += date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() +' ' + date.getHours() + ':00:00';
  else if (uniteTemps == 'minute') sdate += date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() +' ' + date.getHours() + ':'+ date.getMinutes() +':00';
  else if (uniteTemps == 'second') sdate += date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() +' ' + date.getHours() + ':'+ date.getMinutes() +':' + date.getSeconds();
  else sdate = date.getTime();

  return new Date(sdate);
}

function addSeconds(date, seconds)
{
  date.setSeconds(date.getSeconds() + seconds);
  return date;
}

function finalGetDate(date, type, fillDefault)
{

}