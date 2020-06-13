/* 
 *
 * FINANZEN
 *  
 * Author: Suat Ekinci
 * Copyright (c) 2020 Suat Ekinci
 *
 * All rights reserved
 * 
 * PATCHES:
 * 
 */

Page.setTitle("PECUNIA NON OLET");
// kein Autodraw für ALLE          
isc.setAutoDraw(false);
/*
 * ********************** Variablen ********************************************
 * =============================================================================
 */


//Calendar
_view = "dayGridMonth";
var jetzt = new Date();
var jahr = jetzt.getFullYear();
var monat = jetzt.getMonth() + 1;
var tag = jetzt.getDate();
var _tag = "";
var _Monat = "";
var monat_ = "";
if (monat.toString().length <= 1)
{
    _Monat = '0' + monat + jahr;
    monat_ = '0' + monat;
} else
{
    _Monat = monat + '' + jahr;
    monat_ = monat;
}
if (tag.toString().length <= 1)
{
    _tag = '0' + tag;
} else
{
    _tag = tag;
}

var _Time = jetzt.getTime();
var _Heute = jahr + "-" + monat_ + "-" + _tag; //2018-09-03
var _heute_ = jahr + "" + monat_ + "" + _tag; //20180903
var _Heute_ger = tag + "." + monat + "." + jahr; //3.9.2018
var _Heute_Ger = _tag + "." + monat_ + "." + jahr; // 09.09.2020
/*
 * *********************** GoTo: STYLES ****************************************
 * =============================================================================
 */


// Farben
titleLableColor = "#3F4F6E";
suchFelderColor = "#000000";
keinBildColor = "#209B20";
userFontColor = "000000";
anzahlLabelColor = "#D91D15";
suchFelderDropDownColor = "#000000";
gridComponentsLabelColor = "#005491";
fixKosten = "#FFB6C1";
varKosten = "#F9E7E7";
fixEinnahme = "#B3DBD4";
varEinnahme = "#C1FFC1";
// Schriftgrößen
titleLableFontSize = "30px";
keinBildFontSize = "19px";
suchFelderFontSize = "19px";
anzahlLabelFontSize = "19px";
userFontSize = "12px";
suchFelderDropDownFontSize = "12px";
gridComponentsLabelFontSize = "15px";
// Schriftarten
titleLableFontFamily = "Cambria, 'Times new Roman', '18thCentury'";
suchFelderFontFamily = "Calibri,brandisch, Tahoma, Verdana";
keinBildFontFamily = "Tahoma, Verdana, Calibri";
anzahlLabelFontFamily = "Calibri,brandisch, Tahoma, Verdana";
userFontFamily = "Tahoma, Verdana, Calibri, crandall,brandisch";
suchFelderDropDownFontFamily = "Tahoma, Verdana, Calibri, crandall,brandisch";
gridComponentsLabelFontFamily = "calibri";

mainHeaderColor = "#ffcc00";
mainHeaderFontFamily = "Cambria, 'Times new Roman', '18thCentury', Helvetica, sans-serif";
mainHeaderFontSize = "30px";
mainHeaderFontStyle = " line-height: 24px; vertical-align: baseline; letter-spacing: normal; word-spacing: 0px; font-weight: 700; text-align: start; text-decoration: none; text-indent: 0px; ";


// Benutzeroberflächen Farbe
guiColor = "welcome.jpg";
timerCount = 0;
myInterval = "";

imgFolder = apiFolder + "images/";
docPath = "/Docs/";
pdfPath = "/PDFs/";
prot = 'http://';
domain = location.host;
dropCnt = 0;
counterDashboard = 0;
pages = {
    "noAdminPane": {
        "name": "noAdminPane"
    },
    "welcomeSite": {
        "name": "welcomeSite"
    },
    "VLayoutDashboard": {
        "name": "VLayoutDashboard",
        "onOpen": function ()
        {
            clearCharts("htmlPaneDashboardKosten");
            amChartsDashboardKosten();
            amChartsFinanzStatus();
            amChartsDashboardEinnahmen();
            amChartsDashboardAusgKat();
            amChartsDashboardEinKat();
            amChartsDashboardVorgang();
            amChartsDashboardHerkunft();
            amChartsDashboardEinAusgaben("A", htmlPaneDashboardEinAusgabenA, "divGrafikDashboardEinAusgabenA", "Ausgaben seit 2020 (bis einschl: "+_Heute_Ger+")", fixKosten, varKosten);
            amChartsDashboardEinAusgaben("E", htmlPaneDashboardEinAusgabenE, "divGrafikDashboardEinAusgabenE", "Einnahmen seit 2020 (bis einschl: "+_Heute_Ger+")", fixEinnahme, varEinnahme);
        },
        cat: "Dashboard",
        treenode: {
            icon: "web/16/chart_stock.png",
            title: "Dashboard",
            Name: "VLayoutDashboard"
        }, reflow: false
    }
};


chartClean = {
    0: "PaneKredite",
    1: "htmlPaneVergleichsGrafikKreditKarten",
    2: "htmlPaneDashboardKosten",
    3: "htmlPaneDashboardEinnahmen",
    4: "htmlPaneDashboardEinKat",
    5: "htmlPaneDashboardAusgKat",
    6: "htmlPaneDashboardVorgang",
    7: "htmlPaneDashboardEinAusgabenA",
    7: "htmlPaneDashboardEinAusgabenE",
    8: "htmlPaneDashboardHerkunft"
};



/*
 * ************************** GoTo: HILITES ************************************
 * =============================================================================
 */


/*
 * *********************** GoTo: FUNKTIONEN ************************************
 * =============================================================================
 */

function doUpdate(type_)
{
    RPCManager.send("", function (rpcResponse, data, rpcRequest)
    {
        var _data = isc.JSON.decode(data);
        if (_data.response.status === 0)
        {
            var rueckmeldung = _data.response.data;

            isc.say(rueckmeldung, function (value)
            {
                if (value)
                {
                    if (rueckmeldung != "Keine neuen Updates vorhanden!") // Es gab tatsächlich ein Update!
                    {
                        window.location.reload(true);
                    }
                }
            });
        } else if (_data.response.status === 4)
        {
            var _errors = _data.response.errors;
            isc.say(_errors);
        }
    }, {// Übergabe der Parameter
        actionURL: "update/update.php",
        httpMethod: "POST",
        contentType: "application/x-www-form-urlencoded",
        useSimpleHttp: true,
        params: {type: type_}
    }); //Ende RPC
}
;

function changeFunction(btnSave, btnRst, btnCls)
{
    btnSave.setDisabled(false);
    btnRst.setDisabled(false);
    btnCls.setTitle("Abbrechen");
    btnCls.setIcon("famfam/cancel.png");
}

function setValue2Field(form_, field_, value_)
{
    form_.getField(field_).setValue(value_);
    form_.getField(field_).changed(form_, //Form         changed (form, item, value)
      form_.getField(field_), //Item
      form_.getField(field_).getValue()); //Value
}

function resetButtons(btnSave, btnReset, btnClose)
{
    btnClose.setTitle("Schließen");
    btnClose.setIcon("famfam/door_in.png");
    btnReset.setDisabled(true);
    btnSave.setDisabled(true);
}

function amChartsFinanzStatus()
{
    RPCManager.send("", function (rpcResponse, data, rpcRequest)
    {
        var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
        if (_data.response.status === 0)
        {
            var res = _data.response.data;
            var summeToday = 0;
            var summeLastMonth = 0;
            var colorToday = "";
            var colorLastMonth = "";
            var fsTableToday = '<div class="dvFinanzStatus">' +
              '<h2>Finanzstatus</h2>' +
              '<table>'
              + '<tr><th colspan="2">Stand: ' + res[0]['today']['stand'] + '</th></tr>';

            var fsTableLastMonth = '<div class="dvFinanzStatus">' +
              '<table>'
              + '<tr><th colspan="2">Stand: ' + res[0]['lastmonth']['stand'] + '</th></tr>';
            for (i = 0; i < res.length; i++)
            {
                colorToday = (parseFloat(res[i]['today']['summeCount']) > 0) ? "green" : "red";
                colorLastMonth = (parseFloat(res[i]['lastmonth']['summeCount']) > 0) ? "green" : "red";
                summeToday += parseFloat(res[i]['today']['summeCount']);
                fsTableToday += "<tr><td width='220px'>" + res[i]['today']['title'] + "</td><td align='right' style='color:" + colorToday + "'>" + res[i]['today']['summe'] + "</td></tr>";
                summeLastMonth += parseFloat(res[i]['lastmonth']['summeCount']);
                fsTableLastMonth += "<tr><td width='220px'>" + res[i]['lastmonth']['title'] + "</td><td align='right' style='color:" + colorLastMonth + "'>" + res[i]['lastmonth']['summe'] + "</td></tr>";
            }
            colorToday = (summeToday > 0) ? "green" : "red";
            colorLastMonth = (summeLastMonth > 0) ? "green" : "red";
            fsTableToday += "<tr><td width='220px'></td><td align='right' style='color:" + colorToday + "'><b>" + summeToday.toLocalizedString(2, ',', '.', '-') + "</b></td></tr>";
            fsTableLastMonth += "<tr><td width='220px'></td><td align='right' style='color:" + colorLastMonth + "'><b>" + summeLastMonth.toLocalizedString(2, ',', '.', '-') + "</b></td></tr>";
            fsTableToday += "</table></div>";
            fsTableLastMonth += "</table></div>";
            htmlPaneFinanzStatus.setContents(fsTableToday + "<br>" + fsTableLastMonth);

        } else
        { // Wenn die Validierungen Fehler aufweisen dann:                            
            var _errors = _data.response.errors;
            console.log("<b>Fehler! </br>" + _errors + "</b>");
        }

    }, {
        actionURL: "api/ds/dashboard_finanzstatus.php",
        httpMethod: "GET",
        contentType: "application/x-www-form-urlencoded",
        useSimpleHttp: true,
        params: {count: ++counterDashboard}
    }); // Ende RPC
}
;

function amChartsDashboardKosten()
{

    htmlPaneDashboardKosten.setContents("");
    htmlPaneDashboardKosten.setContents("<div id='divGrafikDashboardKosten' style='width: 100%; height: 90%; padding-top: 5px;' ; ></div>");
    RPCManager.send("", function (rpcResponse, data, rpcRequest)
    {
        _data = isc.JSON.decode(data);
        var chartData = _data.response.data;


        // SERIAL CHART
        chartKosten = new AmCharts.AmSerialChart();
        chartKosten.dataProvider = chartData;
        chartKosten.categoryField = "stand";
        chartKosten.plotAreaBorderAlpha = 0.2;
        chartKosten.titles = [{"text": "Kostenübersicht",
                "size": 20,
                "color": "#808080",
                "bold": true
            }];
        // AXES
        // category
        var categoryAxisKosten = chartKosten.categoryAxis;
        categoryAxisKosten.gridAlpha = 0.1;
        categoryAxisKosten.axisAlpha = 0;
        categoryAxisKosten.gridPosition = "start";

        // value
        var valueAxis = new AmCharts.ValueAxis();
        valueAxis.stackType = "regular";
        valueAxis.gridAlpha = 0.1;
        valueAxis.axisAlpha = 0;
        chartKosten.addValueAxis(valueAxis);

        // GRAPHS
        // first graphKosten     
        graphKostenFix = new AmCharts.AmGraph();
        graphKostenFix.title = "Fixkosten";
        graphKostenFix.labelText = "[[value]]";
        graphKostenFix.valueField = "fixkosten";
        graphKostenFix.type = "column";
        graphKostenFix.lineAlpha = 0;
        graphKostenFix.fillAlphas = 1;
        graphKostenFix.lineColor = fixKosten;
        graphKostenFix.balloonText = "[[title]]: [[value]]";
        chartKosten.addGraph(graphKostenFix);

        // second graphKosten                            
        graphKostenVar = new AmCharts.AmGraph();
        graphKostenVar.title = "Variable Kosten";
        graphKostenVar.labelText = "[[value]]";
        graphKostenVar.valueField = "variable_kosten";
        graphKostenVar.type = "column";
        graphKostenVar.lineAlpha = 0;
        graphKostenVar.fillAlphas = 1;
        graphKostenVar.lineColor = varKosten;
        graphKostenVar.balloonText = "[[title]]: [[value]]";
        chartKosten.addGraph(graphKostenVar);


        // LEGEND                  
        var legend = new AmCharts.AmLegend();
        legend.borderAlpha = 0.2;
        legend.horizontalGap = 10;
        chartKosten.addLegend(legend);
        chartKosten.startDuration = 1;
        chartKosten.startEffect = "elastic";

        chartKosten.write('divGrafikDashboardKosten');

    }, {
        actionURL: "api/ds/dashboard_kosten.php",
        httpMethod: "GET",
        contentType: "application/x-www-form-urlencoded",
        useSimpleHttp: true,
        params: {count: ++counterDashboard}
    }); // Ende RPC
}
;

function amChartsDashboardEinnahmen()
{

    htmlPaneDashboardEinnahmen.setContents("");
    htmlPaneDashboardEinnahmen.setContents("<div id='divGrafikDashboardEinnahmen' style='width: 100%; height: 90%; padding-top: 5px;' ; ></div>");
    RPCManager.send("", function (rpcResponse, data, rpcRequest)
    {
        _data = isc.JSON.decode(data);
        var chartData = _data.response.data;


        // SERIAL CHART
        chartEinnahmen = new AmCharts.AmSerialChart();
        chartEinnahmen.dataProvider = chartData;
        chartEinnahmen.categoryField = "stand";
        chartEinnahmen.plotAreaBorderAlpha = 0.2;
        chartEinnahmen.titles = [{"text": "Einnahmen-Übersicht",
                "size": 20,
                "color": "#808080",
                "bold": true
            }];
        // AXES
        // category
        var categoryAxisEinnahmen = chartEinnahmen.categoryAxis;
        categoryAxisEinnahmen.gridAlpha = 0.1;
        categoryAxisEinnahmen.axisAlpha = 0;
        categoryAxisEinnahmen.gridPosition = "start";

        // value
        var valueAxis = new AmCharts.ValueAxis();
        valueAxis.stackType = "regular";
        valueAxis.gridAlpha = 0.1;
        valueAxis.axisAlpha = 0;
        chartEinnahmen.addValueAxis(valueAxis);

        // GRAPHS
        // first graphEinnahmen     
        graphEinnahmenFix = new AmCharts.AmGraph();
        graphEinnahmenFix.title = "Fix-Einnahmen";
        graphEinnahmenFix.labelText = "[[value]]";
        graphEinnahmenFix.valueField = "fixeinnahmen";
        graphEinnahmenFix.type = "column";
        graphEinnahmenFix.lineAlpha = 0;
        graphEinnahmenFix.fillAlphas = 1;
        graphEinnahmenFix.lineColor = fixEinnahme;
        graphEinnahmenFix.balloonText = "[[title]]: [[value]]";
        chartEinnahmen.addGraph(graphEinnahmenFix);

        // second graphEinnahmen                            
        graphEinnahmenVar = new AmCharts.AmGraph();
        graphEinnahmenVar.title = "Variable Einnahmen";
        graphEinnahmenVar.labelText = "[[value]]";
        graphEinnahmenVar.valueField = "variable_einnahmen";
        graphEinnahmenVar.type = "column";
        graphEinnahmenVar.lineAlpha = 0;
        graphEinnahmenVar.fillAlphas = 1;
        graphEinnahmenVar.lineColor = varEinnahme;
        graphEinnahmenVar.balloonText = "[[title]]: [[value]]";
        chartEinnahmen.addGraph(graphEinnahmenVar);


        // LEGEND                  
        var legend = new AmCharts.AmLegend();
        legend.borderAlpha = 0.2;
        legend.horizontalGap = 10;
        chartEinnahmen.addLegend(legend);
        chartEinnahmen.startDuration = 1;
        chartEinnahmen.startEffect = "elastic";
        chartEinnahmen.write('divGrafikDashboardEinnahmen');

    }, {
        actionURL: "api/ds/dashboard_einnahmen.php",
        httpMethod: "GET",
        contentType: "application/x-www-form-urlencoded",
        useSimpleHttp: true,
        params: {count: ++counterDashboard}
    }); // Ende RPC
}
;

var amChartsDashboardAusgKat = function ()
{

    htmlPaneDashboardAusgKat.setContents("");
    htmlPaneDashboardAusgKat.setContents("<div id='divGrafikDashboardAusgKat' style='width: 100%; height: 90%; padding-top: 1px;' ; ></div>");
    RPCManager.send("", function (rpcResponse, data, rpcRequest)
    {
        _data = isc.JSON.decode(data);
        var chartData = _data.response.data;


        // SERIAL CHART
        chartAusgKat = new AmCharts.AmPieChart();
        chartAusgKat.dataProvider = chartData;
        chartAusgKat.titles = [{"text": "Ausgaben nach Kategorien (Stand: "+_Heute_Ger+")",
                "size": 20,
                "color": "#808080",
                "bold": true
            }];
        chartAusgKat.titleField = "kategorie";
        chartAusgKat.colorField = "color";
        chartAusgKat.valueField = "summe";
        chartAusgKat.outlineColor = "#FFFFFF";
        chartAusgKat.outlineAlpha = 0.8;
        chartAusgKat.outlineThickness = 2;
        chartAusgKat.balloonText = "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>";
        chartAusgKat.labelText = "[[title]]: [[summe]] €";
        // this makes the chartAusgKat 3D
//        chartAusgKat.depth3D = 15;
//        chartAusgKat.angle = 30;
        chartAusgKat.innerRadius = "10%";
        chartAusgKat.labelRadius = 10;

        chartAusgKat.startDuration = 1;
        chartAusgKat.startEffect = "bounce";
        chartAusgKat.write('divGrafikDashboardAusgKat');

    }, {
        actionURL: "api/ds/dashboard_ausg_kat.php",
        httpMethod: "GET",
        contentType: "application/x-www-form-urlencoded",
        useSimpleHttp: true,
        params: {count: ++counterDashboard}
    }); // Ende RPC
};

var amChartsDashboardEinKat = function ()
{

    htmlPaneDashboardEinKat.setContents("");
    htmlPaneDashboardEinKat.setContents("<div id='divGrafikDashboardEinKat' style='width: 100%; height: 90%; padding-top: 1px;' ; ></div>");
    RPCManager.send("", function (rpcResponse, data, rpcRequest)
    {
        _data = isc.JSON.decode(data);
        var chartData = _data.response.data;


        // SERIAL CHART
        chartEinKat = new AmCharts.AmPieChart();
        chartEinKat.dataProvider = chartData;
        chartEinKat.amLink = "";
        chartEinKat.titles = [{"text": "Einnahmen nach Kategorien (Stand: "+_Heute_Ger+")",
                "size": 20,
                "color": "#808080",
                "bold": true
            }];
        chartEinKat.titleField = "kategorie";
        chartEinKat.colorField = "color";
        chartEinKat.valueField = "summe";
        chartEinKat.outlineColor = "#FFFFFF";
        chartEinKat.outlineAlpha = 0.8;
        chartEinKat.outlineThickness = 2;
        chartEinKat.balloonText = "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>";
        chartEinKat.labelText = "[[title]]: [[summe]] €";
        // this makes the chartAusgKat 3D
//        chartAusgKat.depth3D = 15;
//        chartAusgKat.angle = 30;
        chartEinKat.innerRadius = "10%";
        chartEinKat.labelRadius = 10;

        chartEinKat.startDuration = 1;
        chartEinKat.startEffect = "bounce";
        chartEinKat.write('divGrafikDashboardEinKat');

    }, {
        actionURL: "api/ds/dashboard_ein_kat.php",
        httpMethod: "GET",
        contentType: "application/x-www-form-urlencoded",
        useSimpleHttp: true,
        params: {count: ++counterDashboard}
    }); // Ende RPC
};

var amChartsDashboardVorgang = function ()
{

    htmlPaneDashboardVorgang.setContents("");
    htmlPaneDashboardVorgang.setContents("<div id='divGrafikDashboardVorgang' style='width: 100%; height: 90%; padding-top: 1px;' ; ></div>");
    RPCManager.send("", function (rpcResponse, data, rpcRequest)
    {
        _data = isc.JSON.decode(data);
        var chartData = _data.response.data;


        // SERIAL CHART
        chartVorgang = new AmCharts.AmPieChart();
        chartVorgang.dataProvider = chartData;
        chartVorgang.amLink = "";
        chartVorgang.titles = [{"text": "Ausgaben nach Vorgängen (Stand: "+_Heute_Ger+")",
                "size": 20,
                "color": "#808080",
                "bold": true
            }];
        chartVorgang.titleField = "vorgang";
        chartVorgang.colorField = "color";
        chartVorgang.valueField = "summe";
        chartVorgang.outlineColor = "#FFFFFF";
        chartVorgang.outlineAlpha = 0.8;
        chartVorgang.outlineThickness = 2;
        chartVorgang.balloonText = "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>";
        chartVorgang.labelText = "[[title]] ([[count]]): [[summe]] €";
        // this makes the chartAusgKat 3D
//        chartAusgKat.depth3D = 15;
//        chartAusgKat.angle = 30;
        chartVorgang.innerRadius = "10%";
        chartVorgang.labelRadius = 10;

        chartVorgang.startDuration = 1;
        chartVorgang.startEffect = "bounce";
        chartVorgang.write('divGrafikDashboardVorgang');

    }, {
        actionURL: "api/ds/dashboard_vorgang.php",
        httpMethod: "GET",
        contentType: "application/x-www-form-urlencoded",
        useSimpleHttp: true,
        params: {count: ++counterDashboard}
    }); // Ende RPC
};

var amChartsDashboardHerkunft = function ()
{
    htmlPaneDashboardHerkunft.setContents("");
    htmlPaneDashboardHerkunft.setContents("<div id='divGrafikDashboardHerkunft' style='width: 100%; height: 90%; padding-top: 1px;' ; ></div>");
    RPCManager.send("", function (rpcResponse, data, rpcRequest)
    {
        _data = isc.JSON.decode(data);
        var chartData = _data.response.data;


        // SERIAL CHART
        chartHerkunft = new AmCharts.AmPieChart();
        chartHerkunft.dataProvider = chartData;
        chartHerkunft.amLink = "";
        chartHerkunft.titles = [{"text": "Ausgaben nach Herkunft (Stand: "+_Heute_Ger+")",
                "size": 20,
                "color": "#808080",
                "bold": true
            }];
        chartHerkunft.titleField = "herkunft";
        chartHerkunft.colorField = "color";
        chartHerkunft.valueField = "summe";
        chartHerkunft.outlineColor = "#FFFFFF";
        chartHerkunft.outlineAlpha = 0.8;
        chartHerkunft.outlineThickness = 2;
        chartHerkunft.balloonText = "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>";
        chartHerkunft.labelText = "[[title]] ([[count]]): [[summe]] €";
        // this makes the chartAusgKat 3D
//        chartAusgKat.depth3D = 15;
//        chartAusgKat.angle = 30;
        chartHerkunft.innerRadius = "10%";
        chartHerkunft.labelRadius = 10;

        chartHerkunft.startDuration = 1;
        chartHerkunft.startEffect = "bounce";
        chartHerkunft.write('divGrafikDashboardHerkunft');

    }, {
        actionURL: "api/ds/dashboard_herkunft.php",
        httpMethod: "GET",
        contentType: "application/x-www-form-urlencoded",
        useSimpleHttp: true,
        params: {count: ++counterDashboard}
    }); // Ende RPC
};


var amChartsDashboardEinAusgaben = function (art_, htmlPane, div_, title_, colFix, colVar)
{

    htmlPane.setContents("");
    htmlPane.setContents("<div id='"+div_+"' style='width: 100%; height: 90%; padding-top: 10px;'></div>");
    RPCManager.send("", function (rpcResponse, data, rpcRequest)
    {
        _data = isc.JSON.decode(data);        
        var chartData = _data.response.data;

        // SERIAL CHART
        chartAusg = new AmCharts.AmSerialChart();
        chartAusg.dataProvider = chartData;
        chartAusg.categoryField = "stand";
        chartAusg.plotAreaBorderAlpha = 0.2;
        // SERIAL CHART
        chartAusg.pathToImages = "js/images/";
        chartAusg.titles = [{"text": title_,
                "size": 20,
                "color": "#808080",
                "bold": true
            }];

        // AXES
        // category
        var categoryAxis = chartAusg.categoryAxis;
        categoryAxis.gridAlpha = 0.1;
        categoryAxis.axisAlpha = 0;
        categoryAxis.gridPosition = "start";

        // value
        var valueAxis = new AmCharts.ValueAxis();
        valueAxis.stackType = "regular";
        valueAxis.gridAlpha = 0.1;
        valueAxis.axisAlpha = 0;
        chartAusg.addValueAxis(valueAxis);

        // GRAPHS
        // Saldo    
        graph = new AmCharts.AmGraph();
        graph.title = "Fix";
        graph.labelText = "[[value]]";
        graph.valueField = "fix";
        graph.type = "column";
        graph.lineAlpha = 0;
        graph.fillAlphas = 1;
        graph.lineColor = colFix;
        graph.balloonText = "[[title]]: [[value]]";
        chartAusg.addGraph(graph);

        // Sparbetrag                           
        graph = new AmCharts.AmGraph();
        graph.title = "Variabel";
        graph.labelText = "[[value]]";
        graph.valueField = "variabel";
        graph.type = "column";
        graph.lineAlpha = 0;
        graph.fillAlphas = 1;
        graph.lineColor = colVar;
        graph.balloonText = "[[title]]: [[value]]";
        chartAusg.addGraph(graph);
        chartAusg.startDuration = 1;
        chartAusg.startEffect = "bounce";


        // LEGEND                  
        var legend = new AmCharts.AmLegend();
        legend.borderAlpha = 0.2;
        legend.horizontalGap = 10;
        chartAusg.addLegend(legend);

        // WRITE
        chartAusg.write(div_);
    }, {
        actionURL: "api/ds/dashboard_einAusgaben.php",
        httpMethod: "GET",
        contentType: "application/x-www-form-urlencoded",
        useSimpleHttp: true,
        params: {count: ++counterDashboard,
        art: art_}
    }); // Ende RPC 
};

function clearCharts(_chartId)
{
    for (var chart in chartClean)
    {
        if (chartClean[chart] != _chartId)
        {
            if (typeof window[chartClean[chart]] !== "undefined")
            {
                window[chartClean[chart]].clear();
            }
        }
    }
//    var newPage = pages[_id];
}

/*
 * Verhalten der angeklickten Nodes
 * @param string _admin
 * @param string _id
 * @returns void
 */
function openNode(_admin, _id)
{
    for (var page in pages)
    {
        window[page].hide();

    }
    var newPage = pages[_id];

    // rechte prüfen!?

//    if (_admin == admin)
//    {

    if ("onOpen" in newPage)
    {
        newPage["onOpen"]();
    }
    window[_id].show();
//    } else
//    {
//        noAdminPane.show();
//        return;
//    }
}

/*
 * Ergänzt um einen neuen Node
 * @param string name
 * @param array options
 * @returns void
 */
function addNode(name, options)
{
    pages[name] = options;
    // form eintragen in layout
    mainLayout.addMember(window[name]);
    if (options["reflow"] != false)
    {
        mainLayout.reflowNow();
    }
    window[name].hide();
    // Seite eintragen in tree
    mainTree.add(options["treenode"], options["cat"]);

}
/*
 * **************************** GoTo: DataSources ******************************
 -------------------------------------------------------------------------------
 */

isc.DataSource.create({
    ID: "backupDataDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/backupDataDS.php"
        }
    ],
    titleField: "text",
    fields: [{
            name: "dateiname",
            type: "text"
        }, {
            name: "size",
            type: "text"
        }, {
            name: "date",
            type: "text"
        }]
});




/*
 * ****************************** GoTo: TreeGrid *******************************
 -------------------------------------------------------------------------------
 */
var CatTree_LogoutUserLabelWidth = 231;
mainTree = isc.Tree.create({
    modelType: "parent",
    nameProperty: "Name",
    idField: "Id",
    parentIdField: "parentId",
    data: [
        {
            Id: "11",
            parentId: "1",
            icon: "web/16/columnchart.png",
            title: "Dashboard",
            isFolder: false,
            Name: "VLayoutDashboard"
        },
        {
            Id: "10",
            parentId: "1",
            Name: "Finanzen",
            isFolder: true
        }, {
            Id: "15",
            parentId: "1",
            Name: "Stammdaten",
            isFolder: true
        }, {
            Id: "16",
            parentId: "1",
            Name: "Verwaltung",
            isFolder: true
        }
    ]
});
isc.TreeGrid.create({
    ID: "CategoryTree",
    // customize appearance
    width: CatTree_LogoutUserLabelWidth,
    height: "100%",
    showHeader: false,
    //                    showResizeBar: true,
    nodeIcon: "famfam/money_euro.png",
    folderIcon: "famfam/money_euro.png",
    showOpenIcons: false,
    showDropIcons: false,
    closedIconSuffix: "",
    data: mainTree,
    leafClick: function (_viewer, _node, _recordNum)
    {
        openNode(sidAdmin, _node.Name);
        VLayoutLogoutLabel.hide();
    }
});
mainTree.openAll();
/*
 ***************** GoTo: ANFANG RIBBONBAR USER LOGOUT ************************** 
 */


/*
 ***************** Logout Button (nur indirekt gebraucht -> Ribbon) ************
 */
isc.ToolStripButton.create({
    ID: "tsbLogout",
    title: '<text style="color:' + userFontColor + '; font-size:' + userFontSize + '; font-family:' + userFontFamily + '; text-decoration:none;">Logout</text>',
    width: 32,
    height: 32,
    margin: 0,
    align: "left",
//    showDisabledIcon: false,
    icon: "icons/new/logout.png",
    prompt: "Beendet die aktuelle Session",
    hoverWidth: 100,
    hoverDelay: 1000,
    action: function ()
    {
        window.open(prot + domain + '/' + appFolder + '/logout.php', '_self', false); // ToDo: evtl. muss appFolder wieder aktiviert werden
    }
});
/*
 ***************** User Label ************
 */
isc.Label.create({
    ID: "lblUserName",
    width: 200,
    height: 32,
    border: 0,
    align: "right",
    padding: 10,
    contents: '<text style="color:' + userFontColor + '; font-size:' + userFontSize + '; font-family:' + userFontFamily + ' ">User: ' + user + '</text>',
});
/*
 ***************** NoAdmin Pane ************************** 
 */

isc.HTMLPane.create({
    width: "100%",
    height: "100%",
    padding: 10,
    ID: "noAdminPane",
    backgroundColor: "#E1E5EB",
    contentsType: "page",
    styleName: "exampleTextBlock",
//    contentsURL: prot + domain + '/' + /*+ appFolder*/  +'error403.html' // ToDo: evtl. muss appFolder wieder aktiviert werden
});
/*
 ***************** Welcome Site ************************** 
 */

//isc.Img.create({
isc.HTMLPane.create({
    ID: "welcomeSite",
    width: "80%", height: "100%",
    align: "center",
    backgroundImage: "backgrounds/leaves.jpg"/*,
     appImgDir: "",
     src: "welcome.png"*/
});
var typeMenu = {
    _constructor: "Menu",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    data: [
        {title: "Document", keyTitle: "Ctrl+D", icon: "icons/16/document_plain_new.png"},
        {title: "Picture", keyTitle: "Ctrl+P", icon: "icons/16/folder_out.png"},
        {title: "Email", keyTitle: "Ctrl+E", icon: "icons/16/disk_blue.png"}
    ]
};
function getIconButton(title, props)
{
    return isc.IconButton.create(isc.addProperties({
        title: title,
        icon: "pieces/16/cube_blue.png",
        largeIcon: "pieces/48/cube_blue.png",
        click: "isc.say(this.title + ' button clicked');"
    }, props)
      );
}

function getIconMenuButton(title, props)
{
    return isc.IconMenuButton.create(isc.addProperties({
        title: title,
        icon: "pieces/16/piece_blue.png",
        largeIcon: "pieces/48/piece_blue.png",
        click: "isc.say(this.title + ' button clicked');"
    }, props)
      );
}

isc.RibbonGroup.create({
    ID: "logoutGroup",
    title: "Logout",
    numRows: 1,
    rowHeight: 26,
//    colWidths: [10, 10, "*"],
    controls: [
        getIconButton('<text style="color:' + userFontColor + '; font-size:' + userFontSize + '; font-family:' + userFontFamily + '; text-decoration:none;">Logout</text>',
          {orientation: "vertical", align: "center", colSpan: 2, largeIcon: "icons/new/logout.png", click: "tsbLogout.action()"})

    ],
    autoDraw: false
});
isc.RibbonGroup.create({
    ID: "userGroup",
    title: "User",
    numRows: 1,
    rowHeight: 26,
//    colWidths: [10, 10, "*"],
    controls: [
        getIconButton('<text style="color:' + userFontColor + '; font-size:' + userFontSize + '; font-family:' + userFontFamily + '; text-decoration:none;"><center>User: ' + user + '</center></text> ',
          {orientation: "vertical", align: "center", colSpan: 2, largeIcon: "web/32/user_suit.png", click: function ()
              {}
          })
    ],
    autoDraw: false
});

isc.RibbonGroup.create({
    ID: "saveGroup",
    title: "Sichern",
    numRows: 1,
    rowHeight: 26,
//    colWidths: [10, 10, "*"],
    controls: [
        getIconButton('<text style="color:' + userFontColor + '; font-size:' + userFontSize + '; font-family:' + userFontFamily + '; text-decoration:none;">Sichern</text>',
          {orientation: "vertical", align: "center", colSpan: 2, largeIcon: "icons/new/save.png",
              prompt: "Erstellt ein Backup der gesamten Datenbank workflow_wf und workflow_rb.",
              click: function ()
              {
                  RPCManager.send("", function (rpcResponse, data, rpcRequest)
                  {
                      var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                      var rueckmeldung = _data.response.data["rueckmeldung"];
                      var _errors = _data.response.errors;
                      if (_data.response.status === 0)
                      {  // Status 0 bedeutet Keine Fehler

                          isc.say("Ihre Daten wurden erfolgreich gesichert und im Verzeichnis Backups, unter dem Dateinamen " + rueckmeldung + " abgespeichert.");
                      }
                      // Wenn Datei schon existiert
                      else
                      { // Wenn die Validierungen Fehler aufweisen dann:

                          isc.say("Ihre Daten konnten nicht gesichert werden!</br></br>" + _errors);
                      }
                  }, {// Übergabe der Parameter
                      actionURL: "api/backup.php",
                      httpMethod: "POST",
                      contentType: "application/x-www-form-urlencoded",
                      useSimpleHttp: true
                  }); //Ende RPC
              }})

    ],
    autoDraw: false
});

isc.RibbonGroup.create({
    ID: "loadGroup",
    title: "Laden",
    numRows: 1,
    count: 0,
    rowHeight: 26,
//    colWidths: [10, 10, "*"],
    controls: [
        getIconButton('<text style="color:' + userFontColor + '; font-size:' + userFontSize + '; font-family:' + userFontFamily + '; text-decoration:none;">Laden</text>',
          {orientation: "vertical", align: "center", colSpan: 2, largeIcon: "web/32/folder_database.png", click: function ()
              {
                  loadGroup.count++;
                  wdLoadBackup.show();
                  lgBackupData.fetchData({counter: loadGroup.count});
              }})

    ],
    autoDraw: false
});

isc.RibbonGroup.create({
    ID: "updateGroup",
    title: "Update",
    numRows: 1,
    count: 0,
    rowHeight: 26,
//    colWidths: [10, 10, "*"],
    controls: [
        getIconButton('<text style="color:' + userFontColor + '; font-size:' + userFontSize + '; font-family:' + userFontFamily + '; text-decoration:none;">Update</text>',
          {orientation: "vertical", align: "center", colSpan: 2, largeIcon: "web/32/update.png", click: function ()
              {
                  doUpdate("menu");
              }})

    ],
    autoDraw: false
});

isc.RibbonBar.create({
    ID: "ribbonBar",
    top: 30,
    width: 150,
    height: 50,
    align: "right",
    backgroundImage: "backgrounds/black.jpg",
    showGroupTitle: false,
    border: 0,
    backgroundColor: "#1A4154",
    groupTitleAlign: "center",
    groupTitleOrientation: "top",
    membersMargin: 0,
    layoutMargin: 0
});
ribbonBar.addGroup(logoutGroup, 2);
ribbonBar.addGroup(userGroup, 3);
ribbonBar.addGroup(saveGroup, 0);
ribbonBar.addGroup(loadGroup, 0);
ribbonBar.addGroup(updateGroup, 0);
/*
 ***************** ENDE RIBBONBAR USER LOGOUT ************************** 
 */


/*
 ***************** GoTo: TOOLSTRIP USER LOGOUT ************************** 
 */

isc.Label.create({
    ID: "lblFinanzen",
    width: "100%",
    height: "100%",
    border: 0,
    padding: 10,
//    backgroundColor: "#1A4154",
//    backgroundImage: "backgrounds/intricate.jpg",
    contents: '<text style="color:' + mainHeaderColor + '; font-size:' + mainHeaderFontSize + '; font-family:' + mainHeaderFontFamily + ';' + mainHeaderFontStyle + ' ">PECUNIA NON OLET</text>',
});
isc.HLayout.create({
    ID: "HLayoutMainHeader",
    width: "100%",
    border: 0,
    showResizeBar: true,
//    backgroundColor: "#1A4154",
    backgroundImage: "backgrounds/black.jpg",
    height: 50,
    members: [lblFinanzen, ribbonBar /*lblUserName, tsbLogout*/]
});
isc.VLayout.create({
    ID: "VLayoutLogoutLabel",
    width: CatTree_LogoutUserLabelWidth,
    showResizeBar: true,
    height: "100%",
    members: [CategoryTree]
});
/*
 * ************************ GoTo: ANFANG Backup ******************************
 * ===========================================================================
 * ***************************************************************************
 */


isc.ListGrid.create({
    ID: "lgBackupData",
    //   header: "Daten bearbeiten",
    width: "100%", height: "100%",
    alternateRecordStyles: false,
    showHeader: false,
    dataSource: backupDataDS,
    autoFetchData: false,
    showFilterEditor: false,
    filterOnKeypress: true,
    selectionType: "single",
    canExpandRecords: false,
    expansionMode: "single",
    baseStyle: "simpleCell",
    emptyMessage: "<br><br>Enthält keine Daten zum Laden",
    margin: 3,
    fields: [
        {name: "dateiname",
            width: "*"
        },
        {name: "size",
            width: "*",
            align: "center"
        },
        {name: "date",
            width: "*"
        }
    ], showSelectionCanvas: true,
    animateSelectionUnder: true,
    selectionUnderCanvasProperties: {
        animateShowEffect: "fade",
        animateFadeTime: 1000,
        backgroundColor: "#ffff40"
    },
    showRollOverCanvas: true,
    animateRollUnder: true,
    rollUnderCanvasProperties: {
        animateShowEffect: "fade",
        animateFadeTime: 1000,
        backgroundColor: "#00ffff",
        opacity: 50
    },
    recordDoubleClick: function (record, state)
    {
        wdLoadBackupStatus.show();
        wdLoadBackup.hide();
        wdLoadBackupStatus.LoadingStatusProgFoo();
        RPCManager.send("", function (rpcResponse, data, rpcRequest)
        {
            var _data = isc.JSON.decode(data);
            var _errors = _data.response.errors;
            if (_data.response.status === 0)
            {
                wdLoadBackupStatus.LoadingStatusProgFoo2();

            } else
            {
                wdLoadBackupStatus.hide();
                prBarLabelLoadingStatus.setPercentDone(0);
                isc.say("Die Daten konnten nicht wiederhergestellt werden!</br></br>" + _errors);
            }
        }, {// Übergabe der Parameter
            actionURL: "api/LoadBackup.php",
            httpMethod: "POST",
            contentType: "application/x-www-form-urlencoded",
            useSimpleHttp: true,
            params: {dateiname: lgBackupData.getSelectedRecord().dateiname}
        }); // Ende RPC
    }

});

isc.Progressbar.create({
    percentDone: 0,
    ID: "prBarLabelLoadingStatus",
    showTitle: true,
    title: "",
    height: 13,
    length: "100%"});



// Label
isc.Label.create({// Label welches im Toolstrip den selektierten Mandanten und Verlag anzeigt
    ID: "lblLoadingStatus",
    height: "100%",
    padding: 0,
    width: "100%",
    align: "center",
    icon: "icons/new/backup.png",
    iconSize: 48,
    valign: "center",
    wrap: false,
    //     icon: "icons/16/close.png",
    showEdges: false,
    contents: "<b>Ihre Datenbank wird gerade neugeladen, </br>dies kann je nach Größe der Datenbank, einige</br> Minuten in Anspruch nehmen.</br> Bitte haben Sie einen Augenblick Geduld.</b>"
});

currentIcon = "icons/new/loading.png";
isc.Window.create({
    ID: "wdLoadBackupStatus",
    title: "Datenbank wird wiederhergestellt...",
    // autoSize: true,
    width: 380,
    height: 150,
    count: 1,
    autoCenter: true,
    showFooter: false,
    headerIconDefaults: {width: 16, height: 16, src: currentIcon},
    showMinimizeButton: false,
    showCloseButton: false,
    canDragReposition: true,
    canDragResize: true,
    showShadow: true,
    showModalMask: true,
    modalMaskOpacity: 10,
    isModal: true,
    items: [lblLoadingStatus, prBarLabelLoadingStatus],
    LoadingStatusProgFoo: function ()
    {
        if (prBarLabelLoadingStatus.percentDone < 87)
        {
            var _percent = prBarLabelLoadingStatus.percentDone + parseInt(2 + (7 * Math.random()));
            prBarLabelLoadingStatus.setPercentDone(_percent); // Zufallswert wird berechnet

            if (_percent <= 100)
            {
                prBarLabelLoadingStatus.setTitle(_percent + "%");
            } //Bis 100 wird mitgezählt
            else
            {
                prBarLabelLoadingStatus.setTitle("100%"); // ab 100 darf nicht mehr gezählt werden, da 100 leicht überstiegen wird.
            }

            isc.Timer.setTimeout("wdLoadBackupStatus.LoadingStatusProgFoo()", 1000);
        }
    },
    LoadingStatusProgFoo2: function ()
    {
        if (prBarLabelLoadingStatus.percentDone < 100)
        {
            var _percent = prBarLabelLoadingStatus.percentDone + parseInt(2 + (7 * Math.random()));
            prBarLabelLoadingStatus.setPercentDone(_percent); // Zufallswert wird berechnet

            if (_percent <= 100)
            {
                prBarLabelLoadingStatus.setTitle(_percent + "%");
            } //Bis 100 wird mitgezählt
            else
            {
                prBarLabelLoadingStatus.setTitle("100%"); // ab 100 darf nicht mehr gezählt werden, da 100 leicht überstiegen wird.
            }

            isc.Timer.setTimeout("wdLoadBackupStatus.LoadingStatusProgFoo2()", 500);
        } else
        {
            wdLoadBackupStatus.hide();
            isc.say("Ihre Daten wurden erfolgreich wiederhergestellt.");
            prBarLabelLoadingStatus.setTitle("");
            prBarLabelLoadingStatus.setPercentDone(0);
        }
    }
});

isc.IButton.create({
    ID: "btnLoadBackup",
    //                    top: 250,
    align: "center",
    icon: "icons/new/load.png",
    title: "Laden",
    click: function ()
    {
        if (lgBackupData.getSelection().length == 1)
        {
            isc.ask("Wollen Sie wirklich die aktuellen Daten mit der Backup-Datei " + lgBackupData.getSelectedRecord().dateiname + " überschreiben?", function (value)
            {
                if (value)
                {
                    wdLoadBackupStatus.show();
                    wdLoadBackup.hide();
                    wdLoadBackupStatus.LoadingStatusProgFoo();
                    RPCManager.send("", function (rpcResponse, data, rpcRequest)
                    {
                        var _data = isc.JSON.decode(data);
                        var _errors = _data.response.errors;
                        if (_data.response.status === 0)
                        {
                            wdLoadBackupStatus.LoadingStatusProgFoo2();
                        } else
                        {
                            isc.say("Die Datenbank konnte nicht wiederhergestellt werden!</br></br>" + _errors);
                            wdLoadBackupStatus.hide();
                            prBarLabelLoadingStatus.setPercentDone(0);
                        }
                    }, {// Übergabe der Parameter
                        actionURL: "api/LoadBackup.php",
                        httpMethod: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        useSimpleHttp: true,
                        params: {dateiname: lgBackupData.getSelectedRecord().dateiname}
                    }); // Ende RPC                
                }
            });
        } else
        {
            isc.say("Bitte erst eine Backup-Datei wählen.");
        }
    }});
currentIcon = "icons/new/load.png";
isc.Window.create({
    ID: "wdLoadBackup",
    title: "Datenbank Wiederherstellen",
    // autoSize: true,
    width: 450,
    height: 300,
    autoCenter: true,
    showFooter: false,
    headerIconDefaults: {width: 16, height: 16, src: currentIcon},
    showMinimizeButton: false,
    showCloseButton: true,
    canDragReposition: true,
    canDragResize: true,
    showShadow: true,
    showModalMask: true,
    modalMaskOpacity: 10,
    isModal: true,
    items: [lgBackupData, btnLoadBackup]
});

/*
 ******************************* Update Dumps **********************************
 */


isc.ListGrid.create({
    ID: "lgUpdateDump",
    //   header: "Daten bearbeiten",
    width: "100%", height: "100%",
    alternateRecordStyles: false,
    showHeader: false,
    dataSource: backupDataDS,
    autoFetchData: false,
    showFilterEditor: false,
    filterOnKeypress: true,
    selectionType: "single",
    canExpandRecords: false,
    expansionMode: "single",
    baseStyle: "simpleCell",
    emptyMessage: "<br><br>Enthält keine Daten zum Laden",
    margin: 3,
    fields: [
        {name: "dateiname",
            width: "*"
        },
        {name: "size",
            width: "*",
            align: "center"
        },
        {name: "date",
            width: "*"
        }
    ], showSelectionCanvas: true,
    animateSelectionUnder: true,
    selectionUnderCanvasProperties: {
        animateShowEffect: "fade",
        animateFadeTime: 1000,
        backgroundColor: "#ffff40"
    },
    showRollOverCanvas: true,
    animateRollUnder: true,
    rollUnderCanvasProperties: {
        animateShowEffect: "fade",
        animateFadeTime: 1000,
        backgroundColor: "#00ffff",
        opacity: 50
    }
});

/*
 * ****************************** Update Dump **********************************
 */

isc.ToolStripButton.create({
    icon: "web/32/database_save.png",
    ID: "tsbCreateDump",
    iconWidth: 32,
    iconHeight: 32,
    count: 0,
    showDisabledIcon: false,
    prompt: "Dumpdata",
    click: function ()
    {

        RPCManager.send("", function (rpcResponse, data, rpcRequest)
        {

            var _data = isc.JSON.decode(data);
            var _errors = _data.response.errors;
            var rueckmeldung = _data.response.data["rueckmeldung"];
            if (_data.response.status === 0)
            {
                isc.say(rueckmeldung);
                tsbCreateDump.counter++;
                lgUpdateDump.fetchData({counter: tsbCreateDump.counter, mode: "dumps"});
            } else
            {
                isc.say(_errors);

            }
        }, {
            actionURL: "updatePrepare.php",
            httpMethod: "POST",
            contentType: "application/x-www-form-urlencoded",
            useSimpleHttp: true,
            params: {task: "dump"}
        }); // Ende RPC                


    }});

isc.ToolStripButton.create({
    icon: "web/32/database_delete.png",
    ID: "tsbClearData",
    iconWidth: 32,
    iconHeight: 32,
    count: 0,
    showDisabledIcon: false,
    prompt: "Leerdaten",
    click: function ()
    {
        isc.ask("Wollen Sie wirklich die Daten des Workflows leeren?", function (value)
        {
            if (value)
            {
                anzahlDumps = lgUpdateDump.getTotalRows();
                if (anzahlDumps >= 29)
                {
                    RPCManager.send("", function (rpcResponse, data, rpcRequest)
                    {
                        var _data = isc.JSON.decode(data);
                        var _errors = _data.response.errors;
                        var rueckmeldung = _data.response.data["rueckmeldung"];
                        if (_data.response.status === 0)
                        {
                            isc.say(rueckmeldung);
                        } else
                        {
                            isc.say("Leeren der Daten hat nicht geklappt");

                        }
                    }, {
                        actionURL: "updatePrepare.php",
                        httpMethod: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        useSimpleHttp: true,
                        params: {task: "clear"}
                    }); // Ende RPC 
                } else
                {
                    isc.ask("Es sind evtl. nicht alle Sicherungen vorhanden. Wollen Sie wirklich alle Daten löschen?", function (value)
                    {
                        if (value)
                        {
                            RPCManager.send("", function (rpcResponse, data, rpcRequest)
                            {
                                var _data = isc.JSON.decode(data);
                                var _errors = _data.response.errors;
                                var rueckmeldung = _data.response.data["rueckmeldung"];
                                if (_data.response.status === 0)
                                {
                                    isc.say(rueckmeldung);
                                } else
                                {
                                    isc.say("Leeren der Daten hat nicht geklappt");

                                }
                            }, {
                                actionURL: "updatePrepare.php",
                                httpMethod: "POST",
                                contentType: "application/x-www-form-urlencoded",
                                useSimpleHttp: true,
                                params: {task: "clear"}
                            }); // Ende RPC 
                        }
                    });
                }

            }
        });
    }});

isc.ToolStripButton.create({
    icon: "web/32/database_refresh.png",
    ID: "tsbRestoreData",
    iconWidth: 32,
    iconHeight: 32,
    count: 0,
    showDisabledIcon: false,
    prompt: "Restore Data",
    click: function ()
    {
        isc.ask("Wollen Sie die Daten des Workflows wieder herstellen?", function (value)
        {
            if (value)
            {
                RPCManager.send("", function (rpcResponse, data, rpcRequest)
                {
                    var _data = isc.JSON.decode(data);
                    var _errors = _data.response.errors;
                    var rueckmeldung = _data.response.data["rueckmeldung"];
                    if (_data.response.status === 0)
                    {
                        isc.say(rueckmeldung);
                    } else
                    {
                        isc.say("Wiederherstellung hat nicht geklappt");

                    }
                }, {
                    actionURL: "updatePrepare.php",
                    httpMethod: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    useSimpleHttp: true,
                    params: {task: "restore"}
                }); // Ende RPC                
            }
        });
    }});

isc.ToolStrip.create({
    ID: "tsUpdateDump",
    width: "100%",
//    backgroundImage: "../bilder/" + guiColor,
    height: 40,
    members: [isc.LayoutSpacer.create({width: "*"}), tsbCreateDump,
        isc.LayoutSpacer.create({width: 15}), tsbClearData,
        isc.LayoutSpacer.create({width: 15}), tsbRestoreData,
        isc.LayoutSpacer.create({width: "*"})]
});

isc.Window.create({
    ID: "wdUpdateDump",
    title: "Dumps",
    // autoSize: true,
    width: 500,
    height: 700,
    autoCenter: true,
    showFooter: false,
    headerIconDefaults: {width: 16, height: 16, src: currentIcon},
    showMinimizeButton: false,
    showCloseButton: true,
    canDragReposition: true,
    canDragResize: true,
    showShadow: true,
    showModalMask: true,
    modalMaskOpacity: 10,
    isModal: true,
    items: [tsUpdateDump, lgUpdateDump]
});

isc.ToolStripButton.create({
    icon: "web/32/folder_database.png",
    ID: "tsbUpdateDump",
    iconWidth: 32,
    iconHeight: 32,
    count: 0,
    showDisabledIcon: false,
    prompt: "Zeigt die Dumps aus der Datenbank an",
    click: function ()
    {
        tsbUpdateDump.counter++;
        wdUpdateDump.show();
        lgUpdateDump.fetchData({counter: tsbUpdateDump.counter, mode: "dumps"});
    }});



/*
 * ************************ENDE Backup *****************************************
 * =============================================================================
 * *****************************************************************************
 */



/*
 * ************************ GoTo: HiddenForms **********************************
 * =============================================================================
 */

isc.DynamicForm.create({
    ID: "hiddenForm",
    width: 1,
    height: 1,
    fields: [{
            name: "Ergebnis",
            type: "hidden"
        }, {
            name: "Errors",
            type: "hidden"
        }, {
            name: "ID",
            type: "hidden"
        }]});



/*
 * **************************** HTMLPane ***************************************
 * =============================================================================
 */

isc.HTMLPane.create({
    width: 400,
    height: 400,
    padding: 5,
    ID: "htmlPaneFinanzStatus",
    styleName: "exampleTextBlock",
    contents: ""});

isc.HTMLPane.create({
    width: 400,
    height: 450,
    padding: 5,
    ID: "htmlPaneDashboardKosten",
    styleName: "exampleTextBlock",
    contents: ""});

isc.HTMLPane.create({
    width: 400,
    height: 450,
    padding: 5,
    ID: "htmlPaneDashboardEinnahmen",
    styleName: "exampleTextBlock",
    contents: ""});

isc.HTMLPane.create({
    width: 900,
    height: 600,
    padding: 5,
    ID: "htmlPaneDashboardAusgKat",
    styleName: "exampleTextBlock",
    contents: ""});

isc.HTMLPane.create({
    width: 900,
    height: 600,
    padding: 5,
    ID: "htmlPaneDashboardEinKat",
    styleName: "exampleTextBlock",
    contents: ""});

isc.HTMLPane.create({
    width: 900,
    height: 600,
    padding: 5,
    ID: "htmlPaneDashboardVorgang",
    styleName: "exampleTextBlock",
    contents: ""});

isc.HTMLPane.create({
    width: 900,
    height: 600,
    padding: 5,
    ID: "htmlPaneDashboardHerkunft",
    styleName: "exampleTextBlock",
    contents: ""});

isc.HTMLPane.create({
    width: 900,
    height: 600,
    padding: 5,
    ID: "htmlPaneDashboardEinAusgabenA",
    styleName: "exampleTextBlock",
    contents: ""});

isc.HTMLPane.create({
    width: 900,
    height: 600,
    padding: 5,
    ID: "htmlPaneDashboardEinAusgabenE",
    styleName: "exampleTextBlock",
    contents: ""});



/*
 * *************************** Layouts *****************************************
 * =============================================================================
 */


isc.Label.create({
    padding: 0,
    ID: "lblDashboard",
    width: 300,
    height: "100%",
    align: "center",
    contents: '<text style="color:' + titleLableColor + '; font-size:' + titleLableFontSize + '; font-family:' + titleLableFontFamily + '; text-decoration:none;">Dashboard</text>'
});


isc.ToolStrip.create({
    ID: "tsDashboard",
    width: "100%",
    backgroundImage: "backgrounds/leaves.jpg",
    height: 40,
    members: [isc.LayoutSpacer.create({width: 10}), isc.LayoutSpacer.create({width: "*"}),
        lblDashboard, isc.LayoutSpacer.create({width: 5})]
});

isc.HLayout.create({
    ID: "HLayoutDashboard",
    height: "100%",
    width: "100%",
    members: [htmlPaneFinanzStatus, htmlPaneDashboardKosten, htmlPaneDashboardEinnahmen]
});

isc.HLayout.create({
    ID: "HLayoutDashboardPie",
    height: "100%",
    width: "100%",
    members: [htmlPaneDashboardAusgKat, htmlPaneDashboardEinKat]
});

isc.HLayout.create({
    ID: "HLayoutDashboardHerkunftVorgangPie",
    height: "100%",
    width: "100%",
    members: [htmlPaneDashboardVorgang, htmlPaneDashboardHerkunft]
});

isc.HLayout.create({
    ID: "HLayoutDashboardEinAusgaben",
    height: "100%",
    width: "100%",
    members: [htmlPaneDashboardEinAusgabenA, htmlPaneDashboardEinAusgabenE]
});

isc.VLayout.create({
    ID: "VLayoutDashboardGraphics",
    height: "100%",
    overflow: "scroll",
    width: "100%",
    members: [HLayoutDashboard, HLayoutDashboardPie, HLayoutDashboardHerkunftVorgangPie, HLayoutDashboardEinAusgaben]
});

isc.VLayout.create({
    ID: "VLayoutDashboard",
    height: "100%",
    width: "100%",
    members: [tsDashboard, VLayoutDashboardGraphics]
});


/*
 * ************************ GoTo: Main-Layout **********************************
 -------------------------------------------------------------------------------
 */

mainLayout = isc.HLayout.create({
    ID: "HLayoutMainView",
    width: "100%",
    height: "100%",
    border: "1px solid black",
    members: [VLayoutLogoutLabel, welcomeSite, noAdminPane]
});
// nachträglich hinzufügbar!
mainLayout.addMember(VLayoutDashboard);

isc.VLayout.create({
    ID: "VLayoutMainView",
    overflow: "auto",
    height: "100%",
    width: "100%",
    members: [HLayoutMainHeader, HLayoutMainView]});
/*
 * ************ Nur das Hauptfenster soll angezeigt werden beim Start **********
 */

(function ()
{

    VLayoutMainView.show();
    doUpdate("auto");
    if (modul != "")
    {
        openNode(sidAdmin, modul);
    } else
    {
        openNode(sidAdmin, "VLayoutDashboard");
    }

})();

//htmlPaneDropZone.hide(); // Soll beim Start ausgeblendet bleiben
