/* 
 *
 * FINANZEN KREDITKARTEN
 *  
 * Author: Suat Ekinci 
 * Copyright (c) 2020 Suat Ekinci 
 *
 * All rights reserved
 * 
 * PATCHES:
 * 
 */


/*
 * *********************** GoTo: FUNKTIONEN ************************************
 * =============================================================================
 */

/*
 * ***************** LIVE WÄHRUNG *****************************
 */
var xhr = new XMLHttpRequest();
function getLiveCurrency()
{

    
    xhr.open("GET", "api/ds/liveWaehrungEur.php", true);
    xhr.responseType = "json";
    xhr.onreadystatechange = handleResponse;

    xhr.send(null);
}

function handleResponse()
{
    var eur;
    eur = xhr.response;
    lblWaehrungEur.setContents(eur);
}


function chartMonatVorMonatkKreditKarten()
{

    htmlPaneVergleichsGrafikKreditKarten.setContents("");
    htmlPaneVergleichsGrafikKreditKarten.setContents("<div id='divVergleichsGrafikKreditKarten' style='width: 100%; height: 90%; padding-top: 5px;'></div>");
    RPCManager.send("", function (rpcResponse, data, rpcRequest)
    {

        _data = isc.JSON.decode(data);
        dfMonateKreditKarten.monCnt++;
        var chartData = _data.response.data;
        chart = new AmCharts.AmSerialChart();
        chart.dataProvider = chartData;

        chart.categoryField = "bezeichnung";
        chart.color = "#000000";
        chart.fontSize = 14;
        chart.startDuration = 1;
        chart.plotAreaFillAlphas = 0.2;
        chart.colorField = "color";
        // the following two lines makes chart 3D
        chart.angle = 30;
        chart.depth3D = 60;
        chart.labelText = "[[title]]: [[percents]]%";

        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.gridAlpha = 0.2;
        categoryAxis.gridPosition = "start";
        categoryAxis.gridColor = "#000000";
        categoryAxis.axisColor = "#000000";
        categoryAxis.axisAlpha = 0.5;
        categoryAxis.dashLength = 5;

        // value
        var valueAxis = new AmCharts.ValueAxis();
        valueAxis.stackType = "3d"; // This line makes chart 3D stacked (columns are placed one behind another)
        valueAxis.gridAlpha = 0.5;
        valueAxis.gridColor = "#000000";
        valueAxis.axisColor = "#000000";
        valueAxis.axisAlpha = 0.8;
        valueAxis.dashLength = 5;
        valueAxis.title = "Kreditkarten-Abrechnung";
        valueAxis.titleColor = "#000000";
        valueAxis.unit = "TL";
        chart.addValueAxis(valueAxis);

        // GRAPHS
        // first graph
        var graph1 = new AmCharts.AmGraph();
        graph1.title = dfMonateKreditKarten.getField('monat').getValue();
        graph1.valueField = "betrag_";
        graph1.type = "column";
        graph1.lineAlpha = 0;
        graph1.lineColor = "#00d297";
        graph1.fillAlphas = 1;
        graph1.balloonText = "[[category]] (" + dfMonateKreditKarten.getField('monat').getValue() + "): <b>[[value]]</b>";
        chart.addGraph(graph1);

        // second graph
        var graph2 = new AmCharts.AmGraph();
        graph2.title = "Vormonat";
        graph2.valueField = "vor_monat_";
        graph2.type = "column";
        graph2.lineAlpha = 0;
        graph2.lineColor = "#f5bacf";
        graph2.fillAlphas = 1;
        graph2.balloonText = "[[category]] (Vormonat): <b>[[value]]</b>";
        chart.addGraph(graph2);

        // LEGEND
        legend = new AmCharts.AmLegend();
        legend.align = "center";
        legend.markerType = "circle";
        chart.addLegend(legend);
        legend.switchType = "x";
        legend.validateNow();

        // WRITE
        chart.write("divVergleichsGrafikKreditKarten");
//            chart.validateNow(); // sorgt dafür das es sofort aufgebaut wird

    }, {
        actionURL: "api/ds/kreditKartenDS.php",
        httpMethod: "GET",
        contentType: "application/x-www-form-urlencoded",
        useSimpleHttp: true,
        params: {monat: dfMonateKreditKarten.getField("monat").getValue(),
            count: dfMonateKreditKarten.monCnt}
    }); // Ende RPC
}
;

function chartGesamtMonatKreditKarten(auswahl)
{

    htmlPaneLinienGrafikKreditKarten.setContents("");
    htmlPaneLinienGrafikKreditKarten.setContents("<div id='chartdiv' style='width: 100%; height: 90%; padding-top: 10px;'></div>");
    RPCManager.send("", function (rpcResponse, data, rpcRequest)
    {
        _data = isc.JSON.decode(data);
        dfMonateKreditKarten.monCnt++;
        var chartData = _data.response.data;
        // SERIAL CHART
        chart = new AmCharts.AmSerialChart();
        chart.pathToImages = "js/images/";
        chart.autoMarginOffset = 0;
        chart.marginRight = 0;
        chart.dataProvider = chartData;
        chart.categoryField = "monat";
        chart.startDuration = 1;
        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.gridPosition = "start";
        // value
        // in case you don't want to change default settings of value axis,
        // you don't need to create it, as one value axis is created automatically.
        // GRAPHS
        // column graph
        var graph1 = new AmCharts.AmGraph();
        graph1.type = "column";
        graph1.lineColor = "#5475d3";
        graph1.title = "Ay";
        graph1.valueField = "gesamt";
        graph1.lineAlpha = 0;
        graph1.fillAlphas = 0.85;
        chart.addGraph(graph1);
        // line
        var graph2 = new AmCharts.AmGraph();
        graph2.type = "line";
        graph2.title = "Dönem Borcu";
        graph2.valueField = "gesamt";
        graph2.lineThickness = 2;
        graph2.bullet = "round";
        chart.addGraph(graph2);

        var graph3 = new AmCharts.AmGraph();
        graph2.type = "line";
        graph2.title = "Ödeme";
        graph2.valueField = "zahlung";
        graph2.lineThickness = 2;
        graph2.bullet = "round";
        chart.addGraph(graph3);
        // LEGEND                
        //  var legend = new AmCharts.AmLegend();
        // chart.addLegend(legend);

        // WRITE
        chart.write("chartdiv");
    }, {
        actionURL: "api/ds/kreditKartenGrafikDS.php",
        httpMethod: "GET",
        contentType: "application/x-www-form-urlencoded",
        useSimpleHttp: true,
        params: {
            count: dfMonateKreditKarten.monCnt,
            jahr: dfLinienGrafikKreditKarten.getField("jahr").getValue(),
            auswahl: auswahl}
    }); // Ende RPC 
}


function uploadDocKreditKarten(_this, id)
{ // Dokument in der Dropzone wird hochgeladen

    _this.on("success", function (file, res)
    {
//        var dateiname = file.name.replace(/.csv/gi, ".UEB");
//        response = JSON.parse(res);
        response = res;
        console.log(response);
        try {
            if (!Array.isArray(response) && response.substr(0, 6) == "Error:")
            {
                isc.say(response);
                _this.removeFile(file);
            } else
            {
                response = JSON.parse(res);
                lgKreditKarten.invalidateCache();
                var metadaten = response.metadaten;
                isc.say(response.newrates, function (value)
                {
                    if (value)
                    {
                        var ds = lgKreditKarten.data.find("ID", id);
                        var index = lgKreditKarten.getRecordIndex(ds);
                        lgKreditKarten.deselectAllRecords();
                        lgKreditKarten.selectRecord(index);
                        lgKreditKarten.scrollToRow(index);
                    }
                });

                if (metadaten.asgari != 0)
                {
                    dfKreditKartenEdit.getField("mind_zahlung").setValue(metadaten.asgari);
                }
                if (metadaten.doenemborcu != 0)
                {
                    dfKreditKartenEdit.getField("betrag").setValue(metadaten.doenemborcu);
                }
                if (metadaten.hesaptarih != "")
                {
                    dfKreditKartenEdit.getField("datum").setValue(metadaten.hesaptarih);
                }
                if (metadaten.oedeme != 0)
                {
                    dfKreditKartenEdit.getField("zahlung").setValue(metadaten.oedeme);
                }
            }
        } catch (err) {
            isc.say(err.message);
        }
        // Add the button to the file preview element.
        file.previewElement.appendChild(removeButtonKK);
    });
}
;


function initDropZoneKreditKarten()
{

    this.on("sending", function (file, xhr, formData)
    { // zusätzlich die ID mitschicken
        var ID = lgKreditKarten.getSelectedRecord().ID;
        formData.append("ID", ID);
        formData.append("karten_nr", lgKreditKarten.getSelectedRecord().karten_nr);
        formData.append("monat", lgKreditKarten.getSelectedRecord().monat);
    });
    removeButtonKK = Dropzone.createElement("<button class='remove-button'>Leeren</button>");
    this.on("drop", function (e)
    {
        var ID = lgKreditKarten.getSelectedRecord().ID;
        e.preventDefault();
        e.stopPropagation();
        uploadDocKreditKarten(this, ID);
    });
    this.on("addedfile", function (file)
    {
        var ID = lgKreditKarten.getSelectedRecord().ID;
        uploadDocKreditKarten(this, ID);
    });

    // Maximal nur 1 Datei erlaubt (maxFiles: 1 - dropzone.js) - Alles andere wird automatisch entfernt (Thumbnails)
    this.on("maxfilesexceeded", function (file)
    {
        this.removeFile(file);
        // Add the button to the file preview element.
        file.previewElement.appendChild(removeButtonKK); // instance 2
    });

    _thisKK = this;
    // Listen to the click event
    removeButtonKK.addEventListener("click", function (e)
    {

        // Make sure the button click doesn't submit the form:
        e.preventDefault();
        e.stopPropagation();

        // Remove the file preview.        

        _thisKK.removeFile(dropZoneKreditKarten.dropzone.files[0]); // instance 2
        // If you want to the delete the file on the server as well,
        // you can do the AJAX request here.


//            delDocument("input_" + pdf_timestamp + ".pdf");

    });

    this.on("error", function (file, res)
    {
        isc.say(res);
        // Add the button to the file preview element.
        file.previewElement.appendChild(removeButtonKK);
    });

}

/*
 * ************************ GoTo: DataSources ************************
 */

isc.DataSource.create({
    ID: "kreditKartenDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/kreditKartenDS.php"
        }
    ], transformResponse: function (dsResponse, dsRequest, jsonData)
    {
        var status = isc.XMLTools.selectObjects(jsonData, "/response/status");
        var data = isc.XMLTools.selectObjects(jsonData, "/response/data");
        dsResponse.data = data;
        if (status != 0)
        {
            dsResponse.status = isc.RPCResponse.STATUS_VALIDATION_ERROR; // setzt das Format {[feld] : '[fehlermeldung]'} voraus!
            var errors = isc.XMLTools.selectObjects(jsonData, "/response/errors");
            dsResponse.errors = errors;
        } else
        {
            dsResponse.startRow = 0; // bei Datasource immer von 1 bis n
            dsResponse.endRow = data.length - 1; // -- kÃ¶nnte auch in der Response stehen!
            dsResponse.totalRows = data.length; // Anzahl der Zeilen
        }
        //<< [1] Antwort umbauen
    },
    titleField: "text",
    fields: [{
            name: "ID",
            title: "ID",
            type: "text",
            primaryKey: true
        }, {
            name: "bezeichnung",
            title: "Kart",
            type: "text"
        }, {
            name: "karten_nr",
            title: "Kartenkürzel",
            type: "text"
        },
        {
            name: "vor_monat",
            title: "Dönem Borcu önceki Ay",
            type: "text"
        },
        {
            name: "betrag",
            title: "Dönem Borcu (TL)",
            type: "text"
        },
        {
            name: "differenz",
            title: "Fark (TL)",
            type: "text"
        },
        {
            name: "datum",
            title: "Tarih",
            type: "text"
        },
        {
            name: "mind_zahlung",
            title: "Asgari",
            type: "text"
        },
        {
            name: "monat",
            title: "Ay",
            type: "text"
        },
        {
            name: "pdf",
            title: "Ekstre",
            type: "text"
        }, {
            name: "zahlung",
            title: "Ödeme",
            type: "text"
        },
        {
            name: "differenz_noNumber",
            type: "text"
        }

    ]
});

isc.DataSource.create({
    ID: "monatDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/monatDS.php"
        }
    ], transformResponse: function (dsResponse, dsRequest, jsonData)
    {
        var status = isc.XMLTools.selectObjects(jsonData, "/response/status");
        var data = isc.XMLTools.selectObjects(jsonData, "/response/data");
        dsResponse.data = data;
        if (status != 0)
        {
            dsResponse.status = isc.RPCResponse.STATUS_VALIDATION_ERROR; // setzt das Format {[feld] : '[fehlermeldung]'} voraus!
            var errors = isc.XMLTools.selectObjects(jsonData, "/response/errors");
            dsResponse.errors = errors;
        } else
        {
            dsResponse.startRow = 0; // bei Datasource immer von 1 bis n
            dsResponse.endRow = data.length - 1; // -- kÃ¶nnte auch in der Response stehen!
            dsResponse.totalRows = data.length; // Anzahl der Zeilen
        }
        //<< [1] Antwort umbauen
    },
    titleField: "text",
    fields: [
        {
            name: "monat",
            title: "Monat",
            type: "text"
        }

    ]
});

isc.DataSource.create({
    ID: "jahresDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/jahresDS.php"
        }
    ], transformResponse: function (dsResponse, dsRequest, jsonData)
    {
        var status = isc.XMLTools.selectObjects(jsonData, "/response/status");
        var data = isc.XMLTools.selectObjects(jsonData, "/response/data");
        dsResponse.data = data;
        if (status != 0)
        {
            dsResponse.status = isc.RPCResponse.STATUS_VALIDATION_ERROR; // setzt das Format {[feld] : '[fehlermeldung]'} voraus!
            var errors = isc.XMLTools.selectObjects(jsonData, "/response/errors");
            dsResponse.errors = errors;
        } else
        {
            dsResponse.startRow = 0; // bei Datasource immer von 1 bis n
            dsResponse.endRow = data.length - 1; // -- kÃ¶nnte auch in der Response stehen!
            dsResponse.totalRows = data.length; // Anzahl der Zeilen
        }
        //<< [1] Antwort umbauen
    },
    titleField: "text",
    fields: [{
            name: "jahr",
            title: "Jahr",
            type: "text",
            primaryKey: true
        }
    ]
});


isc.DataSource.create({
    ID: "zahlmittelKreditKartenDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/zahlmittelDS.php"
        }
    ], transformResponse: function (dsResponse, dsRequest, jsonData)
    {
        var status = isc.XMLTools.selectObjects(jsonData, "/response/status");
        var data = isc.XMLTools.selectObjects(jsonData, "/response/data");
        dsResponse.data = data;
        if (status != 0)
        {
            dsResponse.status = isc.RPCResponse.STATUS_VALIDATION_ERROR; // setzt das Format {[feld] : '[fehlermeldung]'} voraus!
            var errors = isc.XMLTools.selectObjects(jsonData, "/response/errors");
            dsResponse.errors = errors;
        } else
        {
            dsResponse.startRow = 0; // bei Datasource immer von 1 bis n
            dsResponse.endRow = data.length - 1; // -- kÃ¶nnte auch in der Response stehen!
            dsResponse.totalRows = data.length; // Anzahl der Zeilen
        }
        //<< [1] Antwort umbauen
    },
    titleField: "text",
    fields: [
        {
            name: "ID",
            primaryKey: true
        },
        {
            name: "bezeichnung",
            title: "Bezeichnung",
            type: "text"
        },
        {
            name: "karten_nr",
            title: "Karten-Nr.",
            type: "text"
        }
    ]});


isc.DataSource.create({
    ID: "jahresSummeDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/jahresSummeDS.php"
        }
    ], transformResponse: function (dsResponse, dsRequest, jsonData)
    {
        var status = isc.XMLTools.selectObjects(jsonData, "/response/status");
        var data = isc.XMLTools.selectObjects(jsonData, "/response/data");
        dsResponse.data = data;
        if (status != 0)
        {
            dsResponse.status = isc.RPCResponse.STATUS_VALIDATION_ERROR; // setzt das Format {[feld] : '[fehlermeldung]'} voraus!
            var errors = isc.XMLTools.selectObjects(jsonData, "/response/errors");
            dsResponse.errors = errors;
        } else
        {
            dsResponse.startRow = 0; // bei Datasource immer von 1 bis n
            dsResponse.endRow = data.length - 1; // -- kÃ¶nnte auch in der Response stehen!
            dsResponse.totalRows = data.length; // Anzahl der Zeilen
        }
        //<< [1] Antwort umbauen
    },
    titleField: "text",
    fields: [{
            name: "karte",
            title: "Karte",
            type: "text",
            primaryKey: true
        }, {
            name: "summe",
            title: "Summe",
            type: "float"
        }, {
            name: "summeEuro",
            title: "Euro",
            type: "float"
        }
    ]
});

/*
 * ******************** GoTo: DropZone *************************
 * -------------------------------------------------------------
 */

isc.HTMLPane.create({
    width: "100%",
    height: 250,
    margin: 1,
    ID: "htmlPaneDropZoneKreditKarten",
    styleName: "exampleTextBlock",
    contents: '<div id="dropzone"><form class="dropzone needsclick" id="dropZoneKreditKarten"> ' +
      '</form></div>'
});

Dropzone.options.dropZoneKreditKarten = {
//    acceptedFiles: "application/vnd.ms-excel",
    url: "api/upload_ekstre.php",
    method: "post",
    init: initDropZoneKreditKarten
};

isc.Window.create({
    ID: "wdDropZoneKreditKarten",
    title: "Upload Ekstre",
    // autoSize: true,
    width: 400,
    height: 450,
    autoCenter: true,
    showFooter: false,
    headerIconDefaults: {width: 16, height: 16, src: "famfam/picture_add.png"},
    showMinimizeButton: false,
    showCloseButton: false,
    canDragReposition: true,
    canDragResize: true,
    showShadow: true,
    showModalMask: true,
    modalMaskOpacity: 10,
    isModal: true,
    items: [htmlPaneDropZoneKreditKarten]
});

/*
 * ****************** ENDE DropZone *****************************
 * --------------------------------------------------------------
 */

/*
 * ***************************** GoTo: Summen-Rechner **************************
 -------------------------------------------------------------------------------
 */


isc.IButton.create({
    ID: "btnSummenCloseKreditKarten",
    //                top: 250,
    width: 100,
    title: "Beenden",
    click: function ()
    {
        wdSummenKreditKarten.hide();
        dfSummenKreditKarten.getField("jahr").setValue(_Monat.substr(2, 4));
    }
});

isc.HLayout.create({
    ID: "HLayoutJahresSummenButtons",
    height: 24,
    width: "100%",
    align: "center",
    margin: 5,
    members: [btnSummenCloseKreditKarten, isc.LayoutSpacer.create({
            width: 20
        })]
});

isc.DynamicForm.create({
    ID: "dfSummenKreditKarten",
    width: "100%",
    height: 30,
    count: 0,
    numCols: 2,
    colWidths: [60, "*"],
    titleOrientation: "left",
    margin: 5,
    fields: [{name: "jahr",
            title: "Jahr",
            optionDataSource: "jahresDS",
            align: "left",
            defaultValue: _Monat.substr(2, 4),
            type: "select",
            changed: function (form, item, value)
            {
                //                                dfSummenKreditKarten.count++;
                lgSummen.fetchData({jahr: value});
            }
        }
    ]});

isc.ListGrid.create({
    ID: "lgSummen",
    //   header: "Daten bearbeiten",
    width: "100%", height: "100%",
    alternateRecordStyles: true,
    dataSource: jahresSummeDS,
    autoFetchData: false,
    taksit_count: 0,
    showFilterEditor: false,
    filterOnKeypress: false,
    selectionType: "multiple",
    showAllRecords: true,
    canExpandRecords: false,
    leaveScrollbarGap: false,
    showGridSummary: true,
    showGroupSummary: true,
    expansionMode: "details",
    margin: 0,
    fields: [{name: "karte",
            width: 150,
            type: "text"},
        {name: "summe",
            width: "*",
            type: "float",
            recordSummaryFunction: "multiplier",
            summaryFunction: "sum",
            showGridSummary: true, showGroupSummary: true,
            align: "right",
            formatCellValue: function (value)
            {
                if (isc.isA.Number(value))
                {
                    return value.toCurrencyString("TL ");
                }
                return value;
            }},
        {name: "summeEuro",
            width: "*",
            type: "float",
            recordSummaryFunction: "multiplier",
            summaryFunction: "sum",
            showGridSummary: true, showGroupSummary: true,
            align: "right",
            formatCellValue: function (value)
            {
                if (isc.isA.Number(value))
                {
                    return value.toCurrencyString("€ ");
                }
                return value;
            }}]

});

isc.VLayout.create({
    ID: "VLayoutJahresSummen",
    height: "100%",
    width: "100%",
    members: [dfSummenKreditKarten, lgSummen, HLayoutJahresSummenButtons]
});

currentIcon = "famfam/sum.png";
isc.Window.create({
    ID: "wdSummenKreditKarten",
    width: 320,
    height: 300,
    title: "Jahres-Summen",
    //     autoSize: true,
    autoCenter: true,
    headerIconDefaults: {width: 16, height: 16, src: currentIcon},
    showFooter: false,
    showMinimizeButton: false,
    showCloseButton: true,
    canDragReposition: true,
    canDragResize: true,
    showShadow: false,
    showModalMask: false,
    modalMaskOpacity: 10,
    isModal: false,
    items: [VLayoutJahresSummen]});



/*
 * ***************************** GoTo: Listen ************************************
 ---------------------------------------------------------------------------------
 */

/*
 * ********************************* LABEL *************************************
 */

isc.Label.create({
    padding: 5,
    ID: "lblGesamtKreditKarten", // gesamtpreis
    width: 300,
    align: "center"
});

isc.Label.create({
    padding: 5,
    ID: "lblDifferenzKreditKarten", // Differenz
    width: 200,
    align: "center"
});

isc.Label.create({
    padding: 5,
    ID: "lblMindestZahlung", // Mindest-Zahlung
    width: 200,
    align: "center"
});
isc.Label.create({
    padding: 5,
    ID: "lblZahlungKreditKarten", // Gezahlt
    width: 200,
    align: "center"
});

isc.Label.create({
    padding: 5,
    ID: "lblWaehrungEur", // Wechselkurs Euro
    width: 200,
    align: "center"
});


isc.ToolStrip.create({// GridControl
    ID: "gridEditControlsKreditKarten",
    width: "100%",
    height: 24,
    members: [isc.LayoutSpacer.create({
            width: "50%"
        }), lblMindestZahlung, lblDifferenzKreditKarten, lblZahlungKreditKarten, lblGesamtKreditKarten]})

/*
 * ************************** GoTo:  HTMLPane **********************************
 */


isc.HTMLPane.create({
    width: "50%",
    height: "100%",
    ID: "htmlPaneVergleichsGrafikKreditKarten",
    styleName: "exampleTextBlock",
    contents: ""});

isc.HLayout.create({
    ID: "HLayoutListGridChartsKreditKarten",
    height: "100%",
    width: "100%",
    members: [htmlPaneVergleichsGrafikKreditKarten/*, Flow_Pie_vorMonat*/]
});

isc.VLayout.create({
    ID: "VLayoutListGridChartsKreditKarten",
    backgroundColor: "#FFFFFF",
    height: "100%",
    width: "100%",
    members: [HLayoutListGridChartsKreditKarten/*, statistikFormatLayout*/]
});

/*
 * ************************** GoTo:  LISTGRID **********************************
 */
isc.ListGrid.create({
    ID: "lgKreditKarten",
    //   header: "Daten bearbeiten",
    width: "100%", height: "35%",
    alternateRecordStyles: true,
    dataSource: kreditKartenDS,
    autoFetchData: true,
    showFilterEditor: false,
    filterOnKeypress: false,
    selectionType: "multiple",
    showAllRecords: true,
    canExpandRecords: false,
    expansionMode: "details",
    margin: 0,
    fields: [
        {
            name: "ID",
            showIf: "false",
            width: 40
        }, {
            name: "karten_nr",
            width: 50,
            showIf: "false"
        }, {
            name: "bezeichnung",
            width: "*"
        },
        {
            name: "betrag",
            width: 200
        }, {
            name: "vor_monat",
            width: 200
        }, {
            name: "differenz",
            width: 150
        },
        {
            name: "mind_zahlung",
            width: 150
        },
        {
            name: "zahlung",
            width: 150
        },
        {
            name: "datum",
            width: 80
        },
        {
            name: "monat",
            width: 80,
            showIf: "false"
        },
        {
            name: "pdf",
            width: 80,
            showIf: "true",
            type: "link",
            linkText: isc.Canvas.imgHTML("famfam/pdf.png", 16, 16),
            linkURLPrefix: pdfPath
        }
    ], gridComponents: ["header", /* "filterEditor", */"body", gridEditControlsKreditKarten], // Eine Art HLayout
    hilites: [
        {cssText: "color:#FFFFFF;background-color:#16ADC7;",
            id: 0 //ASYA
        },
        {cssText: "color:#000000;background-color:#FF7256;",
            id: 1 // AXCE
        },
        {
            cssText: "color:#000000;background-color:#90EE90;",
            id: 2 // BONU
        },
        {
            cssText: "color:#FFFFFF;background-color:#B8860B;",
            id: 3 //CAFI
        },
        {
            cssText: "color:#FFFFFF;background-color:#8A2BE2;",
            id: 4 // YPWO
        },
        {
            cssText: "color:#FFFFFF;background-color:#5CADD6;",
            id: 5 // CITI
        }
    ], recordClick: function (viewer, record, recordNum, field, fieldNum, value, rawValue)
    {
        if (record.pdf != "")
        {
            htmlPaneDocKreditKarten.setContentsURL(pdfPath + record.pdf);
        } else
        {
            htmlPaneDocKreditKarten.setContentsURL(pdfPath + "noPDF.PDF");
        }
    },
    selectionChanged: function (record, state)
    {
        if (state)
        {
            tsbKreditKartenEdit.setDisabled(false);
            tsbUploadDocKreditKarten.setDisabled(false);
        } else
        {
            tsbKreditKartenEdit.setDisabled(true);
            tsbUploadDocKreditKarten.setDisabled(true);
        }
    }, dataChanged: function ()
    {
        lgKreditKarten.dataChangedFeTimer();
        if (VLayoutKreditKarten.isVisible())
        {
            chartMonatVorMonatkKreditKarten();
        }
    },
    dataChangedFeTimer: function ()
    {

        this.Super("dataChanged", arguments);
        var totalRows = lgKreditKarten.data.getLength();
        var summe = 0;
        var zwSumme = 0;
        var zwSumme2 = 0;
        //----------------------------------------------------------


        if (totalRows > 0 && lgKreditKarten.data.lengthIsKnown())
        {

            for (var i = 0; i < totalRows; i++)
            {

                zwSumme = lgKreditKarten.data.localData[i].betrag.replace(/\./g, ''); // Erst alle Punkte weg
                zwSumme2 = parseFloat(zwSumme.replace(/,/g, ".")); // Komma wird mit Punkt getauscht

                summe = summe + zwSumme2;
            }

            lblGesamtKreditKarten.setContents("<b> Toplam Borc: " + summe.toLocalizedString(2, ',', '.', '-') + " TL");
            //---------------------------------------------------------------------------------------------------

            var summe_diff = 0;
            var zwSumme_diff = 0;
            var zwSumme2_diff = 0;

            for (var ii = 0; ii < totalRows; ii++)
            {

                zwSumme_diff = lgKreditKarten.data.localData[ii].differenz_noNumber; // Erst alle Punkte weg
                zwSumme2_diff = parseFloat(zwSumme_diff); // Komma wird mit Punkt getauscht

                summe_diff = summe_diff + zwSumme2_diff;
            }

            lblDifferenzKreditKarten.setContents("<b> Toplam Fark: " + summe_diff.toLocalizedString(2, ',', '.', '-') + " TL");

            //---------------------------------------------------------------------------------------------------

            var summe_mind_zahlung = 0;
            var zwSumme_mind_zahlung = 0;
            var zwSumme2_mind_zahlung = 0;

            for (var ii = 0; ii < totalRows; ii++)
            {

                zwSumme_mind_zahlung = lgKreditKarten.data.localData[ii].mind_zahlung.replace(/\./g, ''); // Erst alle Punkte weg
                zwSumme2_mind_zahlung = parseFloat(zwSumme_mind_zahlung.replace(/,/g, ".")); // Komma wird mit Punkt getauscht

                summe_mind_zahlung = summe_mind_zahlung + zwSumme2_mind_zahlung;
            }

            lblMindestZahlung.setContents("<b> Toplam Asgari: " + summe_mind_zahlung.toLocalizedString(2, ',', '.', '-') + " TL");

            //---------------------------------------------------------------------------------------------------

            var summe_betrag = 0;
            var zwSumme_betrag = 0;
            var zwSumme2_betrag = 0;

            for (var ii = 0; ii < totalRows; ii++)
            {

                zwSumme_betrag = lgKreditKarten.data.localData[ii].zahlung.replace(/\./g, ''); // Erst alle Punkte weg
                zwSumme2_betrag = parseFloat(zwSumme_betrag.replace(/,/g, ".")); // Komma wird mit Punkt getauscht

                summe_betrag = summe_betrag + zwSumme2_betrag;
            }

            lblZahlungKreditKarten.setContents("<b> Toplam Ödemeler: " + summe_betrag.toLocalizedString(2, ',', '.', '-') + " TL");

        } else
        {
            lblKreditKarten.setContents("&nbsp;");
            lblDifferenzKreditKarten.setContents("&nbsp;");
            lblMindestZahlung.setContents("&nbsp;");
            lblZahlungKreditKarten.setContents("&nbsp;");
        }
    },
    recordDoubleClick: function (viewer, record, recordNum, field, fieldNum, value, rawValue)
    {
        //                        var recordIndex = lgKreditKarten.getRecordIndex(lgKreditKarten.getSelectedRecord());
        //                        chart.clickSlice(recordIndex);
        wdKreditKartenEdit.show();
        pgbKreditKartenEdit.setPercentDone(0);
        pgbKreditKartenEdit.setHeight(13);
        pgbKreditKartenEdit.setTitle("");
        //                                    var record = lgKreditKarten.getSelectedRecord();
        dfKreditKartenEdit.editRecord(record);
    }

});


/*
 * ************************* GoTo:  UPLOAD DOC *********************************
 * =============================================================================
 */

isc.VLayout.create({width: "100%", height: "100%",
    ID: "VLayoutDocKreditKarten", members: [
        isc.HTMLPane.create({
            ID: "htmlPaneDocKreditKarten",
            showEdges: true,
            contentsURL: pdfPath + "noPDF.PDF",
            contentsType: "page"
        })

    ]});

/*
 * ************************* GoTo:  SectionStack *******************************
 * =============================================================================
 */

isc.SectionStack.create({
    ID: "StackKreditKarten",
    visibilityMode: "multiple",
    width: "100%", height: "100%",
    sections: [
        {title: "Karten-Übersicht", expanded: true, items: [
                lgKreditKarten
            ]},
        {title: "Grafik", expanded: true, items: [
                VLayoutListGridChartsKreditKarten
            ]},
        {title: "Ekstreler", expanded: false, items: [
                VLayoutDocKreditKarten
            ]}
    ]
});

/*
 * ***************************** GoTo: DynaForm ********************************
 -------------------------------------------------------------------------------
 */

isc.DynamicForm.create({
    ID: "dfMonateKreditKarten",
    monCnt: 0,
    width: 10,
    height: 10,
    dataSource: monatDS,
    // numCols: 2,
    titleOrientation: "left",
    validateOnExit: true,
    validateOnChange: false,
    margin: 0,
    fields: [{name: "monat",
            type: "select",
            animatePickList: false,
            width: 100,
            changed: function ()
            {
                /*  dfMonateKreditKarten.monCnt++;
                 onRefresh("lgKreditKarten", dfMonateKreditKarten.getField("monat").getValue(), dfMonateKreditKarten.monCnt);*/

                lgKreditKarten.fetchData({monat: dfMonateKreditKarten.getField("monat").getValue(), count: ++dfMonateKreditKarten.monCnt});
                //   chartGesamtMonatKreditKarten(dfLinienGrafikKreditKarten.getField("auswahl").getValue());

            },
            defaultValue: _Monat,
            getPickListFilterCriteria: function ()
            {
                dfMonateKreditKarten.monCnt++;
                var filter = {
                    count: dfMonateKreditKarten.monCnt
                };

                return filter;
            }
        }]
});



/*
 * ******************************* ADD KREDITKARTEN ****************************
 */


isc.Progressbar.create({
    percentDone: 0, // pgbKreditKartenAdd fÃ¤ngt bei 0% an
    ID: "pgbKreditKartenAdd",
    showTitle: true,
    title: "",
    length: "100%"});
isc.DynamicForm.create({
    ID: "dfKreditKartenAdd",
    width: "100%",
    height: "100%",
    kartCount: 0,
    colWidths: [150, "*"],
    numCols: 1,
    titleOrientation: "top",
    validateOnExit: true,
    validateOnChange: false,
    margin: 10,
    fields: [
        {
            name: "monat",
            title: "Ay",
            type: "text", required: true,
            changed: function (form, item, value)
            {
                wdKreditKartenAdd.addFormChanged();
            }

        }, {
            name: "bezeichnung",
            required: true,
            optionDataSource: zahlmittelKreditKartenDS,
            title: "Kart",
            type: "text",
            changed: function (form, item, value)
            {
                wdKreditKartenAdd.addFormChanged();
            },
            valueField: "karten_nr",
            displayField: "bezeichnung",
            width: 250,
            pickListProperties: {showShadow: true, showFilterEditor: false, showHeader: true},
            pickListWidth: 245,
            pickListFields: [
                {name: "karten_nr", width: 50}, {name: "bezeichnung", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                dfKreditKartenAdd.kartCount++;
                var filter = {
                    count: dfKreditKartenAdd.kartCount, form: "dfKreditKartenAdd", monat: dfKreditKartenAdd.getField("monat").getValue()};
                return filter;
            }
        },
        {
            name: "betrag",
            defaultValue: 0,
            title: "Dönem Borcu",
            type: "text", required: true,
            keyPressFilter: "[-0-9,]",
            changed: function (form, item, value)
            {
                wdKreditKartenAdd.addFormChanged();
            }
        },
        {
            name: "datum",
            title: "Tarih", required: true,
            type: "date",
            startDate: "01/01/2010",
            changed: function (form, item, value)
            {
                wdKreditKartenAdd.addFormChanged();
            }
        },
        {
            name: "mind_zahlung",
            title: "Asgari (%25)",
            type: "hidden", required: true,
            keyPressFilter: "[0-9,]",
            changed: function (form, item, value)
            {
                wdKreditKartenAdd.addFormChanged();
            }
        }],
    addTimer: function ()
    {
        if (pgbKreditKartenAdd.percentDone < 100)
        {
            var _percent = pgbKreditKartenAdd.percentDone + parseInt(10 + (50 * Math.random()));
            pgbKreditKartenAdd.setPercentDone(_percent); // Zufallswert wird berechnet

            if (_percent <= 100)
            {
                pgbKreditKartenAdd.setTitle(_percent + "%");
            } //Bis 100 wird mitgezählt
            else
            {
                pgbKreditKartenAdd.setTitle("100%"); // ab 100 darf nicht mehr gezählt werden, da 100 leicht überstiegen wird.
            }

            isc.Timer.setTimeout("dfKreditKartenAdd.addTimer()", 200);
        } else
        {
            if (!dfKreditKartenAdd.validate() && dfKreditKartenAdd.hasErrors())
            {
                dfKreditKartenAdd.setErrors(_data.response.errors, true);
                var _errors = dfKreditKartenAdd.getErrors();
                for (var i in _errors)
                {
                    isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>", function (value)
                    {
                        if (value)
                        {
                            pgbKreditKartenAdd.setTitle(""); // blendet den Titel aus
                            pgbKreditKartenAdd.setPercentDone(0);
                        }
                    }); // Hier wird jeder Wert des Array-Schlüssel angezeigt und das Feld oder die Feld-Bezeichnung ist irrelevant.
                }
            } else
            {
                wdKreditKartenAdd.hide();
                //                                isc.say(hiddenForm.getField("Ergebnis").getValue());
            }
        }
    }
});
isc.HLayout.create({
    ID: "HLayoutButtonKreditKartenAdd",
    regiCnt_add: 0,
    width: "100%",
    height: 30,
    align: "center",
    layoutMargin: 10,
    members: [
        isc.IButton.create({
            ID: "btnSaveKreditKartenAdd", // Borc add
            type: "button",
            name: "btnSaveData",
            title: "Speichern", width: 100,
            click: function ()
            {
                if (!dfKreditKartenAdd.validate())
                {
                    isc.say("Alle Felder müssen korrekt ausgefüllt werden.");
                    //  isc.Timer.setTimeout("dfKreditKartenAdd.ValidateTimerwdKreditKartenAdd()", 3000);
                } else
                {

                    pgbKreditKartenAdd.setTitle("Lädt...");
                    RPCManager.send("", function (rpcResponse, data, rpcRequest)
                    {
                        var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                        if (_data.response.status === 0)
                        {  // Status 0 bedeutet Keine Fehler

                            var Ergebnis = _data.response.data["Ergebnis"];
                            hiddenForm.getField("Ergebnis").setValue(Ergebnis);
                            dfKreditKartenAdd.addTimer();
                            btnCanceKreditKartenAdd.setTitle("Schließen");
                            btnCanceKreditKartenAdd.setIcon("web/32/door_in.png");
                            btnSaveKreditKartenAdd.setDisabled(true);

                            dfMonateKreditKarten.monCnt++;
                            setValue2Field(dfMonateKreditKarten, "monat", dfKreditKartenAdd.getField("monat").getValue());

                            //   lgKreditKarten.statistikFunktion(LinienDiagrammJahresPicker.getField("auswahl").getValue());

                            isc.Timer.setTimeout("lgKreditKarten.dataChangedFeTimer()", 500);
                            btnSaveKreditKartenAdd.findDonemBorcu();
                        } else
                        { // Wenn die Validierungen Fehler aufweisen dann:

                            dfKreditKartenAdd.setErrors(_data.response.errors, true);
                            var _errors = dfKreditKartenAdd.getErrors();
                            for (var i in _errors)
                            {
                                isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>", function (value)
                                {
                                    if (value)
                                    {
                                        pgbKreditKartenAdd.setTitle(""); // blendet den Titel aus
                                        pgbKreditKartenAdd.setPercentDone(0);
                                    }
                                });
                            }

                        }
                    }, {// Übergabe der Parameter
                        actionURL: "api/kreditKarte_add.php",
                        httpMethod: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        useSimpleHttp: true,
                        params: {karten_nr: dfKreditKartenAdd.getField("bezeichnung").getValue(),
                            datum: dfKreditKartenAdd.getField("datum").getValue(),
                            betrag: dfKreditKartenAdd.getField("betrag").getValue(),
                            monat: dfKreditKartenAdd.getField("monat").getValue()}

                    }); //Ende RPC    

                }
            }, findDonemBorcu: function ()
            {
                if (!Array.isLoading(lgKreditKarten.getRecord(0)))
                {
                    var _Kart = dfKreditKartenAdd.getField("bezeichnung").getValue();
                    var record = lgKreditKarten.data.find("karten_nr", _Kart);
                    var index = lgKreditKarten.getRecordIndex(record);
                    lgKreditKarten.selectRecord(record);
                    lgKreditKarten.scrollToRow(index);

                    wdKreditKartenEdit.show();
                    pgbKreditKartenEdit.setPercentDone(0);
                    pgbKreditKartenEdit.setHeight(13);
                    pgbKreditKartenEdit.setTitle("");
                    var record = lgKreditKarten.getSelectedRecord();
                    dfKreditKartenEdit.editRecord(record);
                } else
                {
                    isc.Timer.setTimeout("btnSaveKreditKartenAdd.findDonemBorcu()", 200);
                }
            }
        }), isc.LayoutSpacer.create({
            width: 20
        }),
        isc.IButton.create({
            ID: "btnCanceKreditKartenAdd",
            top: 250,
            title: "Schließen",
            icon: "web/32/door_in.png",
            click: function ()
            {
                var ButtonTitle = btnCanceKreditKartenAdd.getTitle();
                if (ButtonTitle == "Abbrechen")
                {

                    isc.ask("<b>Wollen Sie wirklich beenden?<br>Daten könnten verloren gehen.</b>",
                      function (value)
                      {
                          if (value)
                          {
                              dfKreditKartenAdd.reset();
                              wdKreditKartenAdd.hide();
                              btnSaveKreditKartenAdd.setDisabled(true);
                              btnCanceKreditKartenAdd.setTitle("Schließen");
                              btnCanceKreditKartenAdd.setIcon("web/32/door_in.png");
                              dfKreditKartenAdd.clearErrors(true);
                              pgbKreditKartenAdd.setTitle(""); // blendet den Titel aus
                              pgbKreditKartenAdd.setPercentDone(0); // Setzt den Ladebalken zurÃ¼ck
                          }
                      }, {title: "Hinzufügen abbrechen?"});
                } else
                {
                    wdKreditKartenAdd.hide();
                    dfKreditKartenAdd.reset();
                    btnSaveKreditKartenAdd.setDisabled(true);
                    dfKreditKartenAdd.clearErrors(true);
                    pgbKreditKartenAdd.setTitle(""); // blendet den Titel aus
                    pgbKreditKartenAdd.setPercentDone(0); // Setzt den Ladebalken zurÃ¼ck
                }
            }
        })
    ]});
isc.VLayout.create({
    ID: "VLayoutKreditKartenAdd",
    height: "100%",
    width: "100%",
    align: "center",
    layoutMargin: 0,
    members: [dfKreditKartenAdd, HLayoutButtonKreditKartenAdd, pgbKreditKartenAdd]});

currentIcon = "famfam/application_form_edit.png";
isc.Window.create({
    ID: "wdKreditKartenAdd",
    width: 300,
    height: 300,
    title: "Yeni Dönem Borcu ekle",
    //     autoSize: true,
    autoCenter: true,
    headerIconDefaults: {width: 16, height: 16, src: currentIcon},
    showFooter: true,
    showMinimizeButton: false,
    showCloseButton: true,
    canDragReposition: true,
    canDragResize: true,
    showShadow: false,
    showModalMask: false,
    modalMaskOpacity: 10,
    isModal: false,
    items: [VLayoutKreditKartenAdd],
    addFormChanged: function ()
    {
        btnCanceKreditKartenAdd.setTitle("Abbrechen");
        btnCanceKreditKartenAdd.setIcon("icons/16/close.png");
        btnSaveKreditKartenAdd.setDisabled(false);
    }});
/*
 * HiddenForms
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
 * ******************************* EDIT KREDITKARTEN ***************************
 */


isc.Progressbar.create({
    percentDone: 0, // pgbKreditKartenEdit fÃ¤ngt bei 0% an
    ID: "pgbKreditKartenEdit",
    showTitle: true,
    title: "",
    length: "100%"});
isc.DynamicForm.create({
    ID: "dfKreditKartenEdit",
    width: "100%",
    height: "100%",
    kartCount: 0,
    ekstreCnt: 0,
    colWidths: [150, "*"],
    numCols: 1,
    titleOrientation: "top",
    validateOnExit: true,
    validateOnChange: false,
    margin: 10,
    fields: [{
            name: "ID",
            type: "hidden"
        }, {
            name: "karten_nr",
            required: true,
            optionDataSource: zahlmittelKreditKartenDS,
            title: "Kart",
            type: "text",
            autoFetchData: true,
            changed: function (form, item, value)
            {
                wdKreditKartenEdit.dfKreditKartenEditChanged();
            },
            valueField: "karten_nr",
            displayField: "bezeichnung",
            width: 250,
            pickListProperties: {showShadow: true, showFilterEditor: false, showHeader: true},
            pickListWidth: 245,
            pickListFields: [
                {name: "karten_nr", width: 50}, {name: "bezeichnung", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                dfKreditKartenEdit.kartCount++;
                var filter = {
                    count: dfKreditKartenEdit.kartCount, form: "dfKreditKartenEdit", monat: dfMonateKreditKarten.getField("monat").getValue()};
                return filter;
            }
        },
        {
            name: "betrag",
            title: "Dönem Borcu",
            type: "text", required: true,
            keyPressFilter: "[-0-9,]",
            changed: function (form, item, value)
            {
                wdKreditKartenEdit.dfKreditKartenEditChanged();
            }
        },
        {
            name: "datum",
            title: "Tarih", required: true,
            type: "date",
            startDate: "01/01/2010",
            changed: function (form, item, value)
            {
                wdKreditKartenEdit.dfKreditKartenEditChanged();
            }
        },
        {
            name: "mind_zahlung",
            title: "Asgari",
            type: "text", required: false,
            keyPressFilter: "[0-9,]",
            changed: function (form, item, value)
            {
                wdKreditKartenEdit.dfKreditKartenEditChanged();
            }
        }, {
            name: "zahlung",
            title: "Ödeme",
            type: "text",
            required: false,
            keyPressFilter: "[0-9,]",
            changed: function (form, item, value)
            {
                wdKreditKartenEdit.dfKreditKartenEditChanged();
            }
        },
        {
            name: "monat",
            title: "Ay",
            type: "text", required: true,
            changed: function (form, item, value)
            {
                wdKreditKartenEdit.dfKreditKartenEditChanged();
            }

        }
        , {
            icon: "famfam/pdf.png",
            type: "button",
            title: "PDF",
            click: function ()
            {
                tsbUploadDocKreditKarten.click();
            }
        }
    ], editTimer: function ()
    {
        if (pgbKreditKartenEdit.percentDone < 100)
        {
            var _percent = pgbKreditKartenEdit.percentDone + parseInt(10 + (50 * Math.random()));
            pgbKreditKartenEdit.setPercentDone(_percent); // Zufallswert wird berechnet

            if (_percent <= 100)
            {
                pgbKreditKartenEdit.setTitle(_percent + "%");
            } //Bis 100 wird mitgezählt
            else
            {
                pgbKreditKartenEdit.setTitle("100%"); // ab 100 darf nicht mehr gezählt werden, da 100 leicht überstiegen wird.
            }

            isc.Timer.setTimeout("dfKreditKartenEdit.editTimer()", 200);
        } else
        {
            if (!dfKreditKartenEdit.validate() && dfKreditKartenEdit.hasErrors())
            {
                dfKreditKartenEdit.setErrors(_data.response.errors, true);
                var _errors = dfKreditKartenEdit.getErrors();
                for (var i in _errors)
                {
                    isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>", function (value)
                    {
                        if (value)
                        {
                            pgbKreditKartenEdit.setTitle(""); // blendet den Titel aus
                            pgbKreditKartenEdit.setPercentDone(0);
                        }
                    }); // Hier wird jeder Wert des Array-Schlüssel angezeigt und das Feld oder die Feld-Bezeichnung ist irrelevant.
                }
            } else
            {
                wdKreditKartenEdit.findEditedDonemBorcu();
                wdKreditKartenEdit.hide();
                isc.say(hiddenForm.getField("Ergebnis").getValue());
            }
        }
    }
});
isc.HLayout.create({
    ID: "HLayoutButtonKreditKartenEdit",
    width: "100%",
    height: 30,
    align: "center",
    layoutMargin: 10,
    members: [
        isc.IButton.create({
            ID: "btnSaveKreditKartenEdit", // Borc Edit
            type: "button",
            name: "btnSaveData",
            title: "Speichern", width: 100,
            click: function ()
            {
                if (!dfKreditKartenEdit.validate())
                {
                    isc.say("Alle Felder müssen korrekt ausgefüllt werden.");
                    //  isc.Timer.setTimeout("dfKreditKartenEdit.ValidateTimereditWindow()", 3000);
                } else
                {
                    pgbKreditKartenEdit.setTitle("Lädt...");
                    RPCManager.send("", function (rpcResponse, data, rpcRequest)
                    {
                        var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                        if (_data.response.status === 0)
                        {  // Status 0 bedeutet Keine Fehler

                            var Ergebnis = _data.response.data["Ergebnis"];
                            hiddenForm.getField("Ergebnis").setValue(Ergebnis);
                            dfKreditKartenEdit.editTimer();
                            btnCancelKreditKartenEdit.setTitle("Schließen");
                            btnCancelKreditKartenEdit.setIcon("web/32/door_in.png");
                            btnSaveKreditKartenEdit.setDisabled(true);
                            //   isc.Timer.setTimeout("dfKreditKartenEdit.ErgebnisTimer()", 1000);
                            //   isc.Timer.setTimeout("dfKreditKartenEdit.LabelDeletTimer()",5000);


                            //isc.Timer.setTimeout("dfKreditKartenEdit.ValidateTimerNeuWindow()", 2000); // eigentlich timer für pgbKreditKartenEdit

                            //   filmListe.invalidateCache();
                            dfMonateKreditKarten.monCnt++;
                            isc.Timer.setTimeout("lgKreditKarten.dataChangedFeTimer()", 500);
                            if (dfKreditKartenEdit.getField("monat").getValue() != dfMonateKreditKarten.getField("monat").getValue())
                            {
                                setValue2Field(dfMonateKreditKarten, "monat", dfKreditKartenEdit.getField("monat").getValue());
                            } else
                            {
                                lgKreditKarten.invalidateCache();
                            }

                            //     lgKreditKarten.statistikFunktion(LinienDiagrammJahresPicker.getField("auswahl").getValue());                           

                        } else
                        { // Wenn die Validierungen Fehler aufweisen dann:

                            dfKreditKartenEdit.setErrors(_data.response.errors, true);
                            var _errors = dfKreditKartenEdit.getErrors();
                            for (var i in _errors)
                            {
                                isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>", function (value)
                                {
                                    if (value)
                                    {
                                        pgbKreditKartenEdit.setTitle(""); // blendet den Titel aus
                                        pgbKreditKartenEdit.setPercentDone(0);
                                    }
                                });
                            }

                        }
                    }, {// Übergabe der Parameter
                        actionURL: "api/kreditKarte_edit.php",
                        httpMethod: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        useSimpleHttp: true,
                        params: {karten_nr: dfKreditKartenEdit.getField("karten_nr").getValue(),
                            datum: dfKreditKartenEdit.getField("datum").getValue(),
                            betrag: dfKreditKartenEdit.getField("betrag").getValue(),
                            monat: dfKreditKartenEdit.getField("monat").getValue(),
                            ID: dfKreditKartenEdit.getField("ID").getValue(),
                            zahlung: dfKreditKartenEdit.getField("zahlung").getValue(),
                            mind_zahlung: dfKreditKartenEdit.getField("mind_zahlung").getValue()}

                    }); //Ende RPC                      




                }
            }
        }), isc.LayoutSpacer.create({
            width: 20
        }),
        isc.IButton.create({
            ID: "btnCancelKreditKartenEdit",
            top: 250,
            title: "Schließen",
            icon: "web/32/door_in.png",
            click: function ()
            {
                var ButtonTitle = btnCancelKreditKartenEdit.getTitle();
                if (ButtonTitle == "Abbrechen")
                {

                    isc.ask("<b>Wollen Sie wirklich beenden?<br>Daten könnten verloren gehen.</b>",
                      function (value)
                      {
                          if (value)
                          {
                              dfKreditKartenEdit.reset();
                              wdKreditKartenEdit.hide();
                              btnSaveKreditKartenEdit.setDisabled(true);
                              btnCancelKreditKartenEdit.setTitle("Schließen");
                              btnCancelKreditKartenEdit.setIcon("web/32/door_in.png");
                              dfKreditKartenEdit.clearErrors(true);
                              pgbKreditKartenEdit.setTitle(""); // blendet den Titel aus
                              pgbKreditKartenEdit.setPercentDone(0); // Setzt den Ladebalken zurÃ¼ck
                          }
                      }, {title: "Hinzufügen abbrechen?"});
                } else
                {
                    wdKreditKartenEdit.hide();
                    dfKreditKartenEdit.reset();
                    btnSaveKreditKartenEdit.setDisabled(true);
                    dfKreditKartenEdit.clearErrors(true);
                    pgbKreditKartenEdit.setTitle(""); // blendet den Titel aus
                    pgbKreditKartenEdit.setPercentDone(0); // Setzt den Ladebalken zurÃ¼ck
                }
            }
        })
    ]});
isc.VLayout.create({
    ID: "VLayoutKreditKartenEdit",
    height: "100%",
    width: "100%",
    align: "center",
    layoutMargin: 0,
    members: [dfKreditKartenEdit, HLayoutButtonKreditKartenEdit, pgbKreditKartenEdit]});

currentIcon = "famfam/application_form_edit.png";
isc.Window.create({
    ID: "wdKreditKartenEdit",
    width: 300,
    height: 400,
    title: "Yeni Dönem Borcu editlemek",
    //     autoSize: true,
    autoCenter: true,
    headerIconDefaults: {width: 16, height: 16, src: currentIcon},
    showFooter: false,
    showMinimizeButton: true,
    showCloseButton: true,
    canDragReposition: true,
    canDragResize: true,
    showShadow: false,
    showModalMask: false,
    //                modalMaskOpacity: 10,
    isModal: false,
    items: [VLayoutKreditKartenEdit],
    dfKreditKartenEditChanged: function ()
    {
        btnCancelKreditKartenEdit.setTitle("Abbrechen");
        btnCancelKreditKartenEdit.setIcon("icons/16/close.png");
        btnSaveKreditKartenEdit.setDisabled(false);
    }, findEditedDonemBorcu: function ()
    {
        if (!Array.isLoading(lgKreditKarten.getRecord(0)))
        {
            var _Kart = dfKreditKartenEdit.getField("karten_nr").getValue();
            var record = lgKreditKarten.data.find("karten_nr", _Kart);
            var index = lgKreditKarten.getRecordIndex(record);
            lgKreditKarten.selectRecord(record);
            lgKreditKarten.scrollToRow(index);
        } else
        {
            isc.Timer.setTimeout("wdKreditKartenEdit.findEditedDonemBorcu()", 200);
        }
    }
}
);


/*
 * ***************************** GoTo: LINIENGRAFIK  ***************************
 * -----------------------------------------------------------------------------
 */

isc.HTMLPane.create({
    width: "100%",
    height: "100%",
    ID: "htmlPaneLinienGrafikKreditKarten",
    styleName: "exampleTextBlock",
    contents: ""});

isc.DynamicForm.create({
    ID: "dfLinienGrafikKreditKarten",
    width: "100%",
    height: 24,
    count: 0,
    //                    align: "center",
    numCols: 4,
    titleOrientation: "left",
    margin: 5,
    fields: [{name: "jahr",
            title: "Jahr",
            optionDataSource: "jahresDS",
            defaultValue: _Monat.substr(2, 4),
            type: "select",
            width: 100,
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    count: ++dfLinienGrafikKreditKarten.count};
                return filter;
            },
            changed: function (form, item, value)
            {
                dfLinienGrafikKreditKarten.count++;
                chartGesamtMonatKreditKarten("M");
            }
        }, {
            name: "auswahl",
            title: "Gesamt oder Monat",
            valueMap: {"M": "Monat", "G": "Gesamt"},
            defaultValue: "M",
            type: "radioGroup",
            redrawOnChange: true,
            vertical: false,
            changed: function (form, item, value)
            {
                if (value === "G")
                {
                    form.getField("jahr").setDisabled(true);
                    dfLinienGrafikKreditKarten.count++;
                    chartGesamtMonatKreditKarten("G");

                } else if (value === "M")
                {
                    dfLinienGrafikKreditKarten.count++;
                    chartGesamtMonatKreditKarten("M");
                    form.getField("jahr").setDisabled(false);

                }
            }
        }
    ]});

isc.IButton.create({
    ID: "btnLinienGrafikCloseKreditKarten",
    top: 250,
    title: "Beenden",
    click: function ()
    {
        wdLinienGrafikKreditKarten.clear();
    }
});

isc.Window.create({
    ID: "wdLinienGrafikKreditKarten",
    width: "70%",
    height: 510,
    title: "Monats-Übersichts-Diagramm",
    //     autoSize: true,
    autoCenter: true,
    headerIconDefaults: {width: 16, height: 16, src: "famfam/chart_curve.png"},
    showFooter: false,
    showMinimizeButton: false,
    showCloseButton: false,
    canDragReposition: true,
    canDragResize: true,
    showShadow: false,
    showModalMask: true,
    modalMaskOpacity: 10,
    isModal: true,
    items: [dfLinienGrafikKreditKarten, htmlPaneLinienGrafikKreditKarten, btnLinienGrafikCloseKreditKarten]});

/*
 * *********************** ANFANG MENU *************************
 * -------------------------------------------------------------
 */

/*
 * ************************* ANFANG TOOLSTRIP BUTTONS **************************
 * -----------------------------------------------------------------------------
 */
isc.ToolStripButton.create({
    ID: "tsbLinienGrafikKreditKarten",
    prompt: "Grafik einblenden",
    icon: "web/32/chart_bar.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700,
    click: function ()
    {

        wdLinienGrafikKreditKarten.show();
        chartGesamtMonatKreditKarten(dfLinienGrafikKreditKarten.getField("auswahl").getValue());

    }
});

isc.ToolStripButton.create({
    ID: "tsbKreditKartenAdd",
    prompt: "Abrechnung hinzufügen",
    icon: "web/32/add.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700,
    click: function ()
    {

        var MonatGewaehlt = dfMonateKreditKarten.getField("monat").getValue();
        var _monat = MonatGewaehlt.substr(0, 2);
        var _jahr = MonatGewaehlt.substr(2, 4);
        wdKreditKartenAdd.show();
        dfKreditKartenAdd.clearValues();
        pgbKreditKartenAdd.setPercentDone(0);
        pgbKreditKartenAdd.setHeight(13);
        pgbKreditKartenAdd.setTitle("");
        dfKreditKartenAdd.getField("monat").setValue(MonatGewaehlt);
        dfKreditKartenAdd.getField("datum").setValue("01-" + _monat + "-" + _jahr);

    }
});

isc.ToolStripButton.create({
    ID: "tsbKreditKartenEdit",
    prompt: "Abrechnung editieren",
    icon: "web/32/pencil.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700,
    click: function ()
    {
        if (lgKreditKarten.getSelection().length == 1)
        {
            wdKreditKartenEdit.show();
            pgbKreditKartenEdit.setPercentDone(0);
            pgbKreditKartenEdit.setHeight(13);
            pgbKreditKartenEdit.setTitle("");
            var record = lgKreditKarten.getSelectedRecord();
            dfKreditKartenEdit.editRecord(record);
        } else
        {
            isc.say("Bitte erst einen Datensatz wählen!");
        }
        // dfKreditKartenEdit.getField("bezeichnung").setValue(record.bezeichnung);

    }
});

isc.ToolStripButton.create({
    ID: "tsbKreditKartenDelete",
    prompt: "Abrechnung entfernen",
    icon: "web/32/delete.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700,
    count: 0,
    click: function ()
    {

        if (lgKreditKarten.getSelection().length === 0)
        {
            isc.say("Bitte erst einen Datensatz wählen!");
            return;
        }
        isc.ask("Wollen Sie wirklich diesen Eintrag unwiederruflich löschen?", function (value)
        {
            if (value)
            {
                RPCManager.send("", function (rpcResponse, data, rpcRequest)
                {
                    var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                    if (_data.response.status === 0)
                    {  // Status 0 bedeutet Keine Fehler

                        var Ergebnis = _data.response.data["Ergebnis"];
                        hiddenForm.getField("Ergebnis").setValue(Ergebnis);
                        setValue2Field(dfMonateKreditKarten, "monat", dfMonateKreditKarten.getField("monat").getValue());
                        isc.Timer.setTimeout("lgKreditKarten.dataChangedFeTimer()", 500);
                    } else
                    { // Wenn die Validierungen Fehler aufweisen dann:

                        hiddenForm.setErrors(_data.response.errors, true);
                        var _errors = hiddenForm.getErrors();
                        for (var i in _errors)
                        {
                            isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>");
                        }

                    }
                }, {// Übergabe der Parameter
                    actionURL: "api/kreditKarte_delete.php",
                    httpMethod: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    useSimpleHttp: true,
                    params: {ID: lgKreditKarten.getSelectedRecord().ID}

                }); //Ende RPC 
            }
        });



    }
});

isc.ToolStripButton.create({
    ID: "tsbUploadDocKreditKarten",
    prompt: "Abrechnung hochladen",
    icon: "web/32/document_import.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700,
    count: 0,
    click: function ()
    {
        if (htmlPaneDropZoneKreditKarten.isVisible())
        {
            htmlPaneDropZoneKreditKarten.hide();
        } else
        {
            if (lgKreditKarten.getSelection().length == 1)
            {
                htmlPaneDropZoneKreditKarten.show();
            } else
            {
                isc.say("Bitte erst einen Vorgang wählen!");
            }

        }
    }
});

isc.ToolStripButton.create({
    ID: "tsbKreditKartenSummen",
    icon: "web/32/table_sum.png",
    title: "",
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700,
    count: 0,
    showDisabledIcon: false,
    prompt: "Öffnet die Jahresübersicht der einzelnen Karten",
    click: function ()
    {
        tsbKreditKartenSummen.count++;
        wdSummenKreditKarten.show();
        lgSummen.fetchData({jahr: _Monat.substr(2, 4), count: tsbKreditKartenSummen.count});
    }
});

/*
 * *********************** ANFANG MENU *****************************************
 * -----------------------------------------------------------------------------
 */


isc.Menu.create({
    ID: "menuKreditKarten",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    data: [
        {title: tsbKreditKartenAdd.prompt, icon: tsbKreditKartenAdd.icon, click: function ()
            {
                tsbKreditKartenAdd.click();
            }},
        {title: tsbKreditKartenEdit.prompt, icon: tsbKreditKartenEdit.icon, click: function ()
            {
                tsbKreditKartenEdit.click();
            }},
        {title: tsbKreditKartenDelete.prompt, icon: tsbKreditKartenDelete.icon, click: function ()
            {
                tsbKreditKartenDelete.click();
            }},
        {isSeparator: true},
        {title: tsbUploadDocKreditKarten.prompt, icon: tsbUploadDocKreditKarten.icon, click: function ()
            {
                tsbUploadDocKreditKarten.click();
            }},
        {isSeparator: true},
        {title: tsbKreditKartenSummen.prompt, icon: tsbKreditKartenSummen.icon, click: function ()
            {
                tsbKreditKartenSummen.click();
            }},
        {isSeparator: true},
        {title: tsbLinienGrafikKreditKarten.prompt, icon: tsbLinienGrafikKreditKarten.icon, click: function ()
            {
                tsbLinienGrafikKreditKarten.click();
            }}
    ]
});

isc.MenuButton.create({
    ID: "mbKreditKarten",
    autoDraw: false,
    title: "Menü",
    width: 100,
    menu: menuKreditKarten
});

/*
 * *************************** Layouts *****************************************
 * =============================================================================
 */

isc.Label.create({
    padding: 0,
    ID: "lblKreditKarten",
    width: 300,
    height: "100%",
    align: "center",
    contents: '<text style="color:' + titleLableColor + '; font-size:' + titleLableFontSize + '; font-family:' + titleLableFontFamily + '; text-decoration:none;">Kreditkarten</text>'
});


isc.ToolStrip.create({
    ID: "tsKreditKarten",
    width: "100%",
    backgroundImage: "backgrounds/leaves.jpg",
    height: 40,
    members: [dfMonateKreditKarten, isc.LayoutSpacer.create({width: 10}),
        tsbLinienGrafikKreditKarten, isc.LayoutSpacer.create({width: 10}),
        tsbKreditKartenAdd, isc.LayoutSpacer.create({width: 10}),
        tsbKreditKartenEdit, isc.LayoutSpacer.create({width: 10}),
        tsbKreditKartenDelete, isc.LayoutSpacer.create({width: 10}),
        tsbUploadDocKreditKarten, isc.LayoutSpacer.create({width: 10}),
        tsbKreditKartenSummen, isc.LayoutSpacer.create({width: "*"}),lblWaehrungEur, 
        isc.LayoutSpacer.create({width: 10}) ,lblKreditKarten, isc.LayoutSpacer.create({width: 5})]
});

isc.VLayout.create({
    ID: "VLayoutKreditKarten",
    height: "100%",
    width: "100%",
    members: [tsKreditKarten, htmlPaneDropZoneKreditKarten, StackKreditKarten]
});


/*
 * *************************** Initialisierung *********************************
 * =============================================================================
 */



addNode("VLayoutKreditKarten", {
    name: "VLayoutKreditKarten",
    cat: "Finanzen",
    onOpen: function ()
    {
        lgKreditKarten.contextMenu = menuKreditKarten;
        htmlPaneDropZoneKreditKarten.hide();
        setValue2Field(dfMonateKreditKarten, "monat", dfKreditKartenEdit.getField("monat").getValue());
        isc.Timer.setTimeout("chartMonatVorMonatkKreditKarten()", 500);
        clearCharts('htmlPaneVergleichsGrafikKreditKarten');
        getLiveCurrency();
    },
    treenode: {
        Name: "VLayoutKreditKarten",
        icon: "web/16/card_back.png",
        title: "Kreditkarten",
        enabled: true
    },
    reflow: true
}
);




