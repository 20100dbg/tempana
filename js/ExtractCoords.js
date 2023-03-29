var distanceNWSE = 0;


function dessiner(data)
{
  var tmp = GetHeatDataObject(data);
  heatmapLayer.setData(tmp);
  DessinerPoints(data);
}

function DessinerPoints(tabPoints)
{
    for (var i = 0; i < layersPoints.length; i++) layersPoints[i].remove();
    layersPoints = [];

    for (var i = 0; i < tabPoints.length; i++)
    {
        var pointObj = getPointObj(tabPoints[i]);
        layersPoints.push(L.circleMarker([pointObj.lat, pointObj.lng], {radius: 3, stroke:true, color: '#000000', weight:1,
                        fill: true, fillOpacity: 1}).addTo(map));
        //fillColor: color
    }
}


function SupprimerZonesFiltres()
{
    var tab = map.pm.getGeomanDrawLayers();
    for (var i = 0; i < tab.length; i++) tab[i].remove();
}

function FiltreCoord(tabPoints)
{
    var tabPolygons = map.pm.getGeomanDrawLayers();
    if (tabPolygons.length == 0) return tabPoints;

    var garderEnDehors = document.getElementById('outsidePoints').checked;
    var tabFiltre = [];

    for (var i = 0; i < tabPoints.length; i++)
    {
        var isInside = false;
        var pointObj = getPointObj(tabPoints[i]);

        for (var j = 0; j < tabPolygons.length; j++)
        {
            if ("_mRadius" in tabPolygons[j])
            {
                if (IsInsideCircle(pointObj, tabPolygons[j]._latlng, tabPolygons[j]._mRadius))
                    isInside = true;
            }
            else
            {
                if (IsInsidePolygon(pointObj, tabPolygons[j]._latlngs[0]))
                    isInside = true;
            }
        }
        if (isInside && !garderEnDehors) tabFiltre.push(tabPoints[i]);
        else if (!isInside && garderEnDehors) tabFiltre.push(tabPoints[i]);
    }

    return tabFiltre;
}


function IsInsidePolygon(posPoint, polyPoints)
{
    var inside = false;
    for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++)
    {
        var xi = polyPoints[i].lng, yi = polyPoints[i].lat;
        var xj = polyPoints[j].lng, yj = polyPoints[j].lat;

        var intersect = ((yi > posPoint.lat) != (yj > posPoint.lat))
            && (posPoint.lng < (xj - xi) * (posPoint.lat - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

function IsInsideCircle(posPoint, posCircle, radius)
{
    posPoint = new L.LatLng(posPoint.lat, posPoint.lng);
    posCircle = new L.LatLng(posCircle.lat, posCircle.lng);
    var dist = posPoint.distanceTo(posCircle);
    return (dist <= radius);
}


function getPointObj(tabLine)
{
    return {lat: tabLine[IDX_LAT], lng: tabLine[IDX_LNG]};
}

function GetHeatDataObject(tab)
{
  var max = 0;
  var data = [];

  for (var i = 0; i < tab.length; i++)
  {
    var c = (IDX_COUNT > -1) ? tab[i][IDX_COUNT] : 1;
    if (max < c) max = c;
    data.push(getPointObj(tab[i]));
  }

  return { max: max + 1, data: data };
}

function findBounds(tabPoints)
{
    var pointObj = getPointObj(tabPoints[0]);
    var N = pointObj.lat, S = pointObj.lat, E = pointObj.lng, W = pointObj.lng;

    for (var i = 1; i < tabPoints.length; i++)
    {
        var pointObj = getPointObj(tabPoints[i]);

        if (N > pointObj.lat) N = pointObj.lat;
        else if (S < pointObj.lat) S = pointObj.lat;
        
        if (E > pointObj.lng) E = pointObj.lng;
        else if (W < pointObj.lng) W = pointObj.lng;
    }

    return [[N, W], [S, E]];
}

function centrerVue(tabPoints)
{
    var bounds = findBounds(tabPoints);

    var pointNW = new  L.LatLng(bounds[0][0], bounds[0][1]); 
    var pointSE = new  L.LatLng(bounds[1][0], bounds[1][1]); 
    distanceNWSE = pointNW.distanceTo(pointSE);

    map.flyToBounds(bounds, {animate:false});
}


function initHeatmap()
{
  var radius = 1;
  var tmp = distanceNWSE / 10000;
  //console.log('dist : ' + tmp);

  radius = radius * tmp / 2000;
  //console.log('radius : ' + radius);

  majRadiusHeatmap(radius);
}

function majRadiusHeatmap(radius)
{
  map.removeLayer(heatmapLayer);
  var facteurRadius = 4;
  radius = facteurRadius * radius;
  //console.log('radius : ' + radius);

  heatmapcfg.radius = radius;
  map.addLayer(heatmapLayer);
}
