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


function getDate(val, uniteTemps)
{
  //annee, mois, semaine, jour, heure
  if (uniteTemps == 0) return val.getFullYear();
  else if (uniteTemps == 1) return val.getFullYear() + '-' + (val.getMonth() + 1);
  else if (uniteTemps == 2) return val.getFullYear() + '-' + val.getWeek();
  else if (uniteTemps == 3) return val.toLocaleDateString();
  else if (uniteTemps == 4) return val.toLocaleDateString() + " " + val.getHours();
}


function getMinDate(tab)
{
  var min = new Date(2999, 11, 31);
  for (var i = 0; i < tab.length; i++)
  {
    var tmpDate = tab[i][IDX_DATE]; //new Date(ConvDateFromExcel(tab[i][0]));
    if (min.getTime() > tmpDate.getTime()) min = tmpDate;
  }
  return min;
}

function getMaxDate(tab)
{
  var max = new Date(0, 0, 1);
  for (var i = 0; i < tab.length; i++)
  {
    var tmpDate = tab[i][IDX_DATE]; //new Date(ConvDateFromExcel(tab[i][0]));
    if (max.getTime() < tmpDate.getTime()) max = tmpDate;
  }
  return max;
}
