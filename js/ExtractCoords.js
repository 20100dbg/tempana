function DessinerPoints(tab)
{
    for (var i = 0; i < layersPoints.length; i++) layersPoints[i].remove();
    layersPoints = [];

    for (var i = 0; i < tab.length; i++)
    {
        var pointObj = getPointObj(tab[i]);
        layersPoints.push(L.circle([pointObj.lat, pointObj.lng], {radius: 100, fill: true}).addTo(map));
    }
}

function FiltreCoord(tabPoints)
{
    var tabPolygons = map.pm.getGeomanDrawLayers();
    var tabFiltre = [];

    for (var i = 0; i < tabPoints.length; i++)
    {
        var flagAdded = false;
        var pointObj = getPointObj(tabPoints[i]);

        for (var j = 0; j < tabPolygons.length && !flagAdded; j++)
        {
            if ("_mRadius" in tabPolygons[j])
            {
                if (IsInsideCircle(pointObj, tabPolygons[j]._latlng, tabPolygons[j]._mRadius))
                {
                    tabFiltre.push(tabPoints[i])
                    flagAdded = true;
                }
            }
            else
            {
                if (IsInsidePolygon(pointObj, tabPolygons[j]._latlngs[0]))
                {
                    tabFiltre.push(tabPoints[i])
                    flagAdded = true;
                }
            }
        }
    }

    if (tabPolygons.length == 0)
        tabFiltre = tabPoints;

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
    map.flyToBounds(findBounds(tabPoints), {animate:false});
    map.zoomOut();
}