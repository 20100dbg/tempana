
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
      wheelY: "zoomX"
    })
  );

  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "zoomX" }));
  cursor.lineY.set("visible", false);

  var xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      maxDeviation: 0,
      baseInterval: { timeUnit: uniteTemps, count: 1 },
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 30
      })
    })
  );

  xAxis.get("periodChangeDateFormats")["day"] = "MMM";
  xAxis.get("dateFormats")["day"] = "dd";

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
      count: 1
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
  if (idxColonne == -1) return;

  var container = document.getElementById("chart2");
  var root = am5.Root.new(container);
  root.setThemes([ am5themes_Kelly.new(root) ]);

  data = buildEvolutionCateg(data, idxColonne, idxUnitePeriode);

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
  if (idxColonne == -1) return;

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
        count: 1
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

  data = buildEvolutionGlobaleCateg(data, idxColonne);


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
  if (idxColonne == -1) return;

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
        count: 1
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

  data = buildEvolutionGlobaleCumulativeCateg(data, idxColonne);

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
  if (idxColonne == -1) return;

  var container = document.getElementById("chart6");
  var root = am5.Root.new(container);
  root.setThemes([ am5themes_Animated.new(root) ]);

  var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelY: "zoomXY"
  }));

  var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
    maxDeviation:1,
    renderer: am5xy.AxisRendererX.new(root, {
      pan:"zoom"
    }),
    tooltip: am5.Tooltip.new(root, {})
  }));

  xAxis.children.moveValue(am5.Label.new(root, {
    text: "Jour du mois",
    x: am5.p50,
    centerX: am5.p50
  }), xAxis.children.length - 1);

  var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    maxDeviation:1,
    renderer: am5xy.AxisRendererY.new(root, {
      pan:"zoom"
    }),
    tooltip: am5.Tooltip.new(root, {})
  }));

  yAxis.children.moveValue(am5.Label.new(root, {
    rotation: -90,
    text: "Heure",
    y: am5.p50,
    centerX: am5.p50
  }), 0);


  var series = chart.series.push(am5xy.LineSeries.new(root, {
    calculateAggregates: true,
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "y",
    valueXField: "x",
    valueField: "value",
    tooltip: am5.Tooltip.new(root, {
      pointerOrientation: "horizontal",
      labelText: "[bold]{title}[/]\n{value}"
    })
  }));

  series.strokes.template.set("visible", false);

  var circleTemplate = am5.Template.new({});
  circleTemplate.adapters.add("fill", function (fill, target) {
    var dataItem = target.dataItem;
    if (dataItem) {
      return am5.Color.fromString(dataItem.dataContext.color);
    }
    return fill
  });

  series.bullets.push(function () {
    var bulletCircle = am5.Circle.new(root, {
      radius: 5,
      fill: series.get("fill"),
      fillOpacity: 0.8
    }, circleTemplate);
    return am5.Bullet.new(root, {
      sprite: bulletCircle
    });
  });

  series.set("heatRules", [{
    target: circleTemplate,
    min: 3,
    max: 60,
    dataField: "value",
    key: "radius"
  }]);


  data = BuildRecurrenceHeureMois(data, idxColonne);
  series.data.setAll(data);

  var background = series.get("tooltip").get("background");
  background.set("stroke", root.interfaceColors.get("alternativeBackground"));
  background.adapters.add("fill", function (fill, target) {
    var dataItem = target.dataItem;
    if (dataItem && dataItem.dataContext) {
      return am5.Color.fromString(dataItem.dataContext.color);
    }
    return fill
  });


  chart.set("cursor", am5xy.XYCursor.new(root, {
    xAxis: xAxis,
    yAxis: yAxis,
    snapToSeries: [series]
  }));


  series.appear();
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
