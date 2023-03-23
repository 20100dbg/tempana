function GraphEvolutionGlobale(data)
{
  var container = document.getElementById("chart1");
  var root = am5.Root.new(container);
  root.setThemes([am5themes_Animated.new(root)]);

  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      columnWidth: 0.5
    })
  );

  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "zoomX" }));
  cursor.lineY.set("visible", false);

  var xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      baseInterval: { timeUnit: uniteTemps, count: nbUniteTemps },
      renderer: am5xy.AxisRendererX.new(root, { })
    })
  );
/*
  xAxis.get("periodChangeDateFormats")["day"] = "MMM";
  xAxis.get("dateFormats")["day"] = "dd";
*/
  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) })
  );

  xAxis.set("tooltip", am5.Tooltip.new(root, {}));

  var series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date"
      })
    );


  var tooltip = series.set("tooltip", am5.Tooltip.new(root, {}));
  tooltip.label.set("text", "{valueY}");

  data = buildEvolutionGlobale(data);
  
  series.data.setAll(data);

  series.appear();
  chart.appear();
}


function GraphEvolutionGlobaleCumulative(data)
{
  var container = document.getElementById("chart9");
  var root = am5.Root.new(container);
  root.setThemes([am5themes_Animated.new(root)]);

  root.dateFormatter.setAll({ dateFields: ["valueX"] });

  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX"
  }));

  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "zoomX" }));
  cursor.lineY.set("visible", false);

  var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
    maxDeviation: 0.5,
    baseInterval: {
      timeUnit: uniteTemps,
      count: nbUniteTemps
    },
    renderer: am5xy.AxisRendererX.new(root, { pan:"zoom" }),
    tooltip: am5.Tooltip.new(root, {})
  }));

  var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    maxDeviation:1,
    renderer: am5xy.AxisRendererY.new(root, { pan:"zoom" })
  }));

  var series = chart.series.push(am5xy.LineSeries.new(root, {
    name: "Series",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    valueXField: "date",
    tooltip: am5.Tooltip.new(root, { labelText: "{valueX}: {valueY}" })
  }));

  data = buildEvolutionGlobaleCumulative(data);

  series.data.setAll(data);
  
  series.appear();
  chart.appear();
}

function GraphEvolutionPeriodeCateg(data)
{
  if (idxColonneCateg == -1) return;

  var container = document.getElementById("chart2");
  var root = am5.Root.new(container);
  root.setThemes([ am5themes_Kelly.new(root) ]);

  data = buildEvolutionCateg(data, idxColonneCateg, idxUnitePeriode);

  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
    layout: root.verticalLayout
  }));

  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "zoomX" }));
  cursor.lineY.set("visible", false);

  var legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    })
  );

  var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    categoryField: "date",
    renderer: am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9
    }),
    tooltip: am5.Tooltip.new(root, {})
  }));

  xAxis.data.setAll(data);

  var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
  }));

  function makeSeries(name, fieldName) {
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: name,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: fieldName,
      categoryXField: "date"
    }));

  series.columns.template.setAll({
    tooltipText: "{name}, {categoryX}:{valueY}",
    width: am5.percent(90),
    tooltipY: 0
  });

  series.data.setAll(data);
  series.appear();

  series.bullets.push(function () {
    return am5.Bullet.new(root, {
      locationY: 0,
      sprite: am5.Label.new(root, {
        text: "{valueY}",
        fill: root.interfaceColors.get("alternativeText"),
        centerY: 0,
        centerX: am5.p50,
        populateText: true
      })
    });
  });

  legend.data.push(series);
  }

  for (var i = 0; i < tabSerie.length; i++)
    makeSeries(tabSerie[i], tabSerie[i])

  chart.appear();
}


function GraphEvolutionGlobaleCateg(data)
{
  if (idxColonneCateg == -1) return;

  var container = document.getElementById("chart3");
  var root = am5.Root.new(container);
  root.setThemes([ am5themes_Kelly.new(root) ]);

  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      maxTooltipDistance: 0
    })
  );

  var xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      maxDeviation: 0,
      baseInterval: {
        timeUnit: uniteTemps,
        count: nbUniteTemps
      },
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    })
  );

  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    })
  );

  data = buildEvolutionGlobaleCateg(data, idxColonneCateg);


  for (var serie in data)
  {
    var series = chart.series.push(am5xy.LineSeries.new(root, {
      name: serie,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      valueXField: "date",
      legendValueText: "{valueY}",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}",
        pointerOrientation: "horizontal"
      })
    }));
    
    series.data.setAll(data[serie]);
    series.appear();
  }

  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    behavior: "zoomX"
  }));
  cursor.lineY.set("visible", false);


  var legend = chart.rightAxesContainer.children.push(
    am5.Legend.new(root, {
      width: 200,
      paddingLeft: 15,
      height: am5.percent(100)
    })
  );

  legend.itemContainers.template.events.on("pointerover", function(e) {
    var itemContainer = e.target;

    var series = itemContainer.dataItem.dataContext;

    chart.series.each(function(chartSeries) {
      if (chartSeries != series) {
        chartSeries.strokes.template.setAll({
          strokeOpacity: 0.15,
          stroke: am5.color(0x000000)
        });
      } else {
        chartSeries.strokes.template.setAll({
          strokeWidth: 3
        });
      }
    })
  })

  legend.itemContainers.template.events.on("pointerout", function(e) {
    var itemContainer = e.target;
    var series = itemContainer.dataItem.dataContext;

    chart.series.each(function(chartSeries) {
      chartSeries.strokes.template.setAll({
        strokeOpacity: 1,
        strokeWidth: 1,
        stroke: chartSeries.get("fill")
      });
    });
  })

  legend.itemContainers.template.set("width", am5.p100);
  legend.valueLabels.template.setAll({
    width: am5.p100,
    textAlign: "right"
  });

  legend.data.setAll(chart.series.values);

  chart.appear();
}


function GraphEvolutionGlobaleCumulativeCateg(data)
{
  if (idxColonneCateg == -1) return;

  var container = document.getElementById("chart10");
  var root = am5.Root.new(container);
  root.setThemes([ am5themes_Kelly.new(root) ]);

  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      maxTooltipDistance: 0
    })
  );

  var xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      maxDeviation: 0,
      baseInterval: {
        timeUnit: uniteTemps,
        count: nbUniteTemps
      },
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {})
    })
  );

  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    })
  );

  data = buildEvolutionGlobaleCumulativeCateg(data, idxColonneCateg);

  for (var serie in data)
  {
    var series = chart.series.push(am5xy.LineSeries.new(root, {
      name: serie,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      valueXField: "date",
      legendValueText: "{valueY}",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}",
        pointerOrientation: "horizontal"
      })
    }));
    
    series.data.setAll(data[serie]);
    series.appear();
  }

  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    behavior: "zoomX"
  }));
  cursor.lineY.set("visible", false);

  var legend = chart.rightAxesContainer.children.push(
    am5.Legend.new(root, {
      width: 200,
      paddingLeft: 15,
      height: am5.percent(100)
    })
  );

  legend.itemContainers.template.events.on("pointerover", function(e) {
    var itemContainer = e.target;

    var series = itemContainer.dataItem.dataContext;

    chart.series.each(function(chartSeries) {
      if (chartSeries != series) {
        chartSeries.strokes.template.setAll({
          strokeOpacity: 0.15,
          stroke: am5.color(0x000000)
        });
      } else {
        chartSeries.strokes.template.setAll({
          strokeWidth: 3
        });
      }
    })
  })

  legend.itemContainers.template.events.on("pointerout", function(e) {
    var itemContainer = e.target;
    var series = itemContainer.dataItem.dataContext;

    chart.series.each(function(chartSeries) {
      chartSeries.strokes.template.setAll({
        strokeOpacity: 1,
        strokeWidth: 1,
        stroke: chartSeries.get("fill")
      });
    });
  })

  legend.itemContainers.template.set("width", am5.p100);
  legend.valueLabels.template.setAll({
    width: am5.p100,
    textAlign: "right"
  });

  legend.data.setAll(chart.series.values);

  chart.appear();
}


function GraphElementsActifs(data)
{
  var container = document.getElementById("chart4");
  var root = am5.Root.new(container);
  root.setThemes([ am5themes_Animated.new(root) ]);

  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
  }));

  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "zoomX" }));
  cursor.lineY.set("visible", false);

  var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
  xRenderer.labels.template.setAll({
    rotation: -90,
    centerY: am5.p50,
    centerX: am5.p100,
    paddingRight: 15
  });

  xRenderer.grid.template.setAll({ location: 1 });

  var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    maxDeviation: 0.3,
    categoryField: "eltec",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  }));

  var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    maxDeviation: 0.3,
    renderer: am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1
    })
  }));

  var series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "Series 1",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    sequencedInterpolation: true,
    categoryXField: "eltec",
    tooltip: am5.Tooltip.new(root, {
      labelText: "{valueY}"
    })
  }));

  series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
  series.columns.template.adapters.add("fill", function(fill, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
  });

  series.columns.template.adapters.add("stroke", function(stroke, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
  });

  data = buildElementsActifs(data);

  xAxis.data.setAll(data);
  series.data.setAll(data);

  series.appear();
  chart.appear();
}


function GraphRecurrenceHeureJour(data)
{
  var container = document.getElementById("chart5");
  var root = am5.Root.new(container);
  root.setThemes([ am5themes_Animated.new(root) ]);

  var chart = root.container.children.push(
    am5radar.RadarChart.new(root, {
    innerRadius: am5.percent(30),
    maxTooltipDistance: 0,
    layout: root.verticalLayout
  }));


var yRenderer = am5radar.AxisRendererRadial.new(root, {
  visible: false,
  axisAngle: 90,
  minGridDistance: 10,
  inversed: true
});

yRenderer.labels.template.setAll({
  textType: "circular",
  textAlign: "center",
  radius: -8
});

  var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
    renderer: yRenderer,
    categoryField: "weekday"
  }));

  var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    renderer: am5radar.AxisRendererCircular.new(root, {
      visible: false,
      minGridDistance: 30
    }),
    categoryField: "hour"
  }));

  var series = chart.series.push(am5radar.RadarColumnSeries.new(root, {
    calculateAggregates: true,
    stroke: am5.color(0xffffff),
    clustered: false,
    xAxis: xAxis,
    yAxis: yAxis,
    categoryXField: "hour",
    categoryYField: "weekday",
    valueField: "value"
  }));

  series.columns.template.setAll({
    tooltipText: "{value}",
  });

  series.set("heatRules", [{
    target: series.columns.template,
    min: am5.color(0xffffff),
    max: am5.color(0xfe535a), //0xfe131a),
    dataField: "value",
    key: "fill"
  }]);

  data = BuildRecurrenceHeureJour(data);

  series.data.setAll(data);
  yAxis.data.setAll([{ weekday: "Lundi" },{ weekday: "Mardi" },{ weekday: "Mercredi" },
    { weekday: "Jeudi" },{ weekday: "Vendredi" },{ weekday: "Samedi" },{ weekday: "Dimanche" }]);
  xAxis.data.setAll([{ hour: "00h" },{ hour: "01h" },{ hour: "02h" },{ hour: "03h" },{ hour: "04h" },
    { hour: "05h" },{ hour: "06h" },{ hour: "07h" },{ hour: "08h" },{ hour: "09h" },{ hour: "10h" },
    { hour: "11h" },{ hour: "12h" },{ hour: "13h" },{ hour: "14h" },{ hour: "15h" },{ hour: "16h" },
    { hour: "17h" },{ hour: "18h" },{ hour: "19h" },{ hour: "20h" },{ hour: "21h" },{ hour: "22h" },
    { hour: "23h" }]);

  chart.appear(1000, 100);
}


function GraphRecurrenceHeureMois(data)
{
  var container = document.getElementById("chart6");
  var root = am5.Root.new(container);
  root.setThemes([ am5themes_Animated.new(root) ]);

  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "none",
    wheelY: "none",
    layout: root.verticalLayout
  }));

  var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
    maxDeviation: 0,
    categoryField: "heure",
    renderer: am5xy.AxisRendererY.new(root, {
      visible: false,
      minGridDistance: 20,
      inversed: true
    })
  }));

  var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    categoryField: "jour",
    renderer: am5xy.AxisRendererX.new(root, {
      visible: false,
      minGridDistance: 30,
      opposite:false
    })
  }));

  var series = chart.series.push(am5xy.ColumnSeries.new(root, {
    calculateAggregates: true,
    stroke: am5.color(0xffffff),
    clustered: false,
    xAxis: xAxis,
    yAxis: yAxis,
    categoryXField: "jour",
    categoryYField: "heure",
    valueField: "value"
  }));

  series.columns.template.setAll({
    tooltipText: "{value}",
    strokeOpacity: 1,
    strokeWidth: 2,
    width: am5.percent(100),
    height: am5.percent(100)
  });

  series.set("heatRules", [{
    target: series.columns.template,
    min: am5.color(0xfffb77),
    max: am5.color(0xfe131a),
    dataField: "value",
    key: "fill"
  }]);

  var data = BuildRecurrenceHeureMois(data);

  series.data.setAll(data);

  yAxis.data.setAll([{ heure: "00h" },{ heure: "01h" },{ heure: "02h" },{ heure: "03h" },{ heure: "04h" },{ heure: "05h" },
    { heure: "06h" },{ heure: "07h" },{ heure: "08h" },{ heure: "09h" },{ heure: "10h" },{ heure: "11h" },{ heure: "12h" },
    { heure: "13h" },{ heure: "14h" },{ heure: "15h" },{ heure: "16h" },{ heure: "17h" },{ heure: "18h" },{ heure: "19h" },
    { heure: "20h" },{ heure: "21h" },{ heure: "22h" },{ heure: "23h" }]);

  xAxis.data.setAll([{ jour: "01" },{ jour: "02" },{ jour: "03" },{ jour: "04" },{ jour: "05" },{ jour: "06" },
    { jour: "07" },{ jour: "08" },{ jour: "09" },{ jour: "10" },{ jour: "11" },{ jour: "12" },{ jour: "13" },
    { jour: "14" },{ jour: "15" },{ jour: "16" },{ jour: "17" },{ jour: "18" },{ jour: "19" },{ jour: "20" },
    { jour: "21" },{ jour: "22" },{ jour: "23" },{ jour: "24" },{ jour: "25" },{ jour: "26" },{ jour: "27" },
    { jour: "28" },{ jour: "29" },{ jour: "30" },{ jour: "31" }]);

  chart.appear();
}


function GraphRecurrenceSemaine(data)
{
  var container = document.getElementById("chart7");
  var root = am5.Root.new(container);
  root.setThemes([ am5themes_Animated.new(root) ]);

  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
  }));

  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "zoomX" }));
  cursor.lineY.set("visible", false);

  var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
  xRenderer.labels.template.setAll({
    rotation: -90,
    centerY: am5.p50,
    centerX: am5.p100,
    paddingRight: 15
  });

  xRenderer.grid.template.setAll({ location: 1 });

  var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    maxDeviation: 0.3,
    categoryField: "date",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  }));

  var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    maxDeviation: 0.3,
    renderer: am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1
    })
  }));

  var series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "Series 1",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    sequencedInterpolation: true,
    categoryXField: "date",
    tooltip: am5.Tooltip.new(root, {
      labelText: "{valueY}"
    })
  }));

  data = BuildRecurrenceSemaine(data);

  xAxis.data.setAll(data);
  series.data.setAll(data);

  series.appear();
  chart.appear();
}



function GraphRecurrenceJourMois(data)
{
  var container = document.getElementById("chart8");
  var root = am5.Root.new(container);
  root.setThemes([ am5themes_Animated.new(root) ]);

  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
  }));

  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "zoomX" }));
  cursor.lineY.set("visible", false);

  var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
  xRenderer.labels.template.setAll({
    rotation: -90,
    centerY: am5.p50,
    centerX: am5.p100,
    paddingRight: 15
  });

  xRenderer.grid.template.setAll({ location: 1 });

  var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    maxDeviation: 0.3,
    categoryField: "date",
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  }));

  var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    maxDeviation: 0.3,
    renderer: am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1
    })
  }));

  var series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "Series 1",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "value",
    sequencedInterpolation: true,
    categoryXField: "date",
    tooltip: am5.Tooltip.new(root, {
      labelText: "{valueY}"
    })
  }));

  data = BuildRecurrenceJourMois(data);

  xAxis.data.setAll(data);
  series.data.setAll(data);

  series.appear();
  chart.appear();
}

function GraphRepartitionCateg(data)
{
  if (idxColonneCateg == -1) return;

  var container = document.getElementById("chart11");
  var root = am5.Root.new(container);
  root.setThemes([ am5themes_Kelly.new(root) ]);

  var chart = root.container.children.push(am5percent.PieChart.new(root, { layout: root.verticalLayout }));

  var series = chart.series.push(am5percent.PieSeries.new(root, {
    valueField: "value",
    categoryField: "category"
  }));

  data = buildRepartitionCateg(data, idxColonneCateg);

  series.data.setAll(data);

  series.appear();
}




function GraphGanttCateg(data)
{
  if (idxColonneCateg == -1) return;

  var container = document.getElementById("chart12");
  var root = am5.Root.new(container);
  root.setThemes([ am5themes_Kelly.new(root) ]);
  
  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: false,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
    layout: root.verticalLayout
  }));

  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "zoomX" }));
  cursor.lineY.set("visible", false);

  var legend = chart.children.push(am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  }))

  var colors = chart.get("colors");

  var tmptabCateg = buildTabValeurs(data, idxColonneCateg);
  var tabCateg = [];
  for (var i = 0; i < tmptabCateg.length; i++) tabCateg.push({category:tmptabCateg[i]});

  data = buildGanttCateg(data, idxColonneCateg);

  for (var i = 0; i < data.length; i++)
  {
    var idxCateg = tmptabCateg.indexOf(data[i].category);
    data[i].columnSettings = {
      fill: am5.Color.brighten(colors.getIndex(idxCateg), 0)
    }
  }

  var yAxis = chart.yAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: am5xy.AxisRendererY.new(root, { inversed: true }),
      tooltip: am5.Tooltip.new(root, {
        themeTags: ["axis"],
        animationDuration: 200
      })
    })
  );


  yAxis.data.setAll(tabCateg);

  var xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      baseInterval: { timeUnit: "second", count: 1 },
      renderer: am5xy.AxisRendererX.new(root, {strokeOpacity: 0.1})
    })
  );

  var series = chart.series.push(am5xy.ColumnSeries.new(root, {
    xAxis: xAxis,
    yAxis: yAxis,
    openValueXField: "fromDate",
    valueXField: "toDate",
    categoryYField: "category",
    sequencedInterpolation: true
  }));

  series.columns.template.setAll({
    templateField: "columnSettings",
    strokeOpacity: 0,
    tooltipText: "{category}: {fromDate.formatDate('yyyy-MM-dd HH:mm')} - {toDate.formatDate('yyyy-MM-dd HH:mm')}"
  });

  series.data.processor = am5.DataProcessor.new(root, {
    dateFields: ["fromDate", "toDate"],
    dateFormat: "yyyy-MM-dd HH:mm:ss"
  });
  series.data.setAll(data);

  series.appear();
  chart.appear();
}