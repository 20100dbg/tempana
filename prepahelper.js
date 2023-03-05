
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