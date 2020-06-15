/* 
 *
 * FINANZEN KREDITE
 *  
 * Author: Suat Ekinci 
 * Copyright (c) 2020 Suat Ekinci 
 *
 * All rights reserved
 * 
 * PATCHES:
 * 
 */

dsCounterKredite = 0;
/*
 * GoTo: ********************** FUNKTIONEN *************************************
 * =============================================================================
 */
function amChartsKredite()
{

    PaneKredite.setContents("");
    PaneKredite.setContents("<div id='divGrafikKredite' style='width: 100%; height: 90%; padding-top: 5px;' ; ></div>");
    RPCManager.send("", function (rpcResponse, data, rpcRequest)
    {
        _data = isc.JSON.decode(data);
        dsCounterKredite.monCnt++;
        var chartData = _data.response.data;


        // SERIAL CHART
        chart = new AmCharts.AmSerialChart();
        chart.dataProvider = chartData;
        chart.categoryField = "vorgang";
        chart.plotAreaBorderAlpha = 0.2;
        console.log(chart.dataProvider[0].length);
        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.gridAlpha = 0.1;
        categoryAxis.axisAlpha = 0;
        categoryAxis.gridPosition = "start";

        // value
        var valueAxis = new AmCharts.ValueAxis();
        valueAxis.stackType = "regular";
        valueAxis.gridAlpha = 0.1;
        valueAxis.axisAlpha = 0;
        chart.addValueAxis(valueAxis);

        // GRAPHS
        // first graph     
        graph = new AmCharts.AmGraph();
        graph.title = "Gezahlt";
        graph.labelText = "[[value]]";
        graph.valueField = "betrag_gezahlt";
        graph.type = "column";
        graph.lineAlpha = 0;
        graph.fillAlphas = 1;
        graph.lineColor = "#B3DBD4";
        graph.balloonText = "[[title]]: [[value]]";
        chart.addGraph(graph);

        // second graph                            
        graph = new AmCharts.AmGraph();
        graph.title = "Restbetrag";
        graph.labelText = "[[value]]";
        graph.valueField = "rest_betrag";
        graph.type = "column";
        graph.lineAlpha = 0;
        graph.fillAlphas = 1;
        graph.lineColor = "#F9E7E7";
        graph.balloonText = "[[title]]: [[value]]";
        chart.addGraph(graph);


        // LEGEND                  
        var legend = new AmCharts.AmLegend();
        legend.borderAlpha = 0.2;
        legend.horizontalGap = 10;
        chart.addLegend(legend);

        chart.write('divGrafikKredite');

    }, {
        actionURL: "api/ds/grafikKrediteDS.php",
        httpMethod: "GET",
        contentType: "application/x-www-form-urlencoded",
        useSimpleHttp: true,
        params: {count: dsCounterKredite.monCnt,
            auswahl: dfKrediteAuswahl.getField("auswahl").getValue()}
    }); // Ende RPC
}
;

function uploadDocKredite(_this, id)
{ // Dokument in der Dropzone wird hochgeladen

    _this.on("success", function (file, res)
    {
//        var dateiname = file.name.replace(/.csv/gi, ".UEB");
        response = JSON.parse(res);
        try {
            if (!Array.isArray(response) && response.substr(0, 6) == "Error:")
            {
                isc.say(response);
                _this.removeFile(file);
                var res = response.split(" - ");
                if (res.length > 1)
                {
//                    delDocument("input_" + res[1] + ".pdf");
                }
            } else
            {
//                lgKredite.invalidateCache();
                lgKredite.fetchData({auswahl: dfKrediteAuswahl.getField("auswahl").getValue()});
                isc.say(response, function (value)
                {
                    if (value)
                    {
                        var ds = lgKredite.data.find("ID", id);
                        var index = lgKredite.getRecordIndex(ds);
                        lgKredite.deselectAllRecords();
                        lgKredite.selectRecord(index);
                        lgKredite.scrollToRow(index);
                    }
                });
            }
        } catch (err) {
            isc.say(err.message);
        }
        // Add the button to the file preview element.
        file.previewElement.appendChild(removeButtonKr);
    });
}
;


function initDropZoneKredite()
{

    this.on("sending", function (file, xhr, formData)
    { // zusätzlich die ID mitschicken
        var ID = lgKredite.getSelectedRecord().ID;
        formData.append("ID", ID);
    });
    removeButtonKr = Dropzone.createElement("<button class='remove-button'>Leeren</button>");
    this.on("drop", function (e)
    {
        var ID = lgKredite.getSelectedRecord().ID;
        e.preventDefault();
        e.stopPropagation();
        uploadDocKredite(this, ID);
    });
    this.on("addedfile", function (file)
    {
        var ID = lgKredite.getSelectedRecord().ID;
        uploadDocKredite(this, ID);
    });

    // Maximal nur 1 Datei erlaubt (maxFiles: 1 - dropzone.js) - Alles andere wird automatisch entfernt (Thumbnails)
    this.on("maxfilesexceeded", function (file)
    {
        this.removeFile(file);
        // Add the button to the file preview element.
        file.previewElement.appendChild(removeButtonKr); // instance 2
    });

    _thisKr = this;
    // Listen to the click event
    removeButtonKr.addEventListener("click", function (e)
    {

        // Make sure the button click doesn't submit the form:
        e.preventDefault();
        e.stopPropagation();

        // Remove the file preview.        

        _thisKr.removeFile(dropZoneKredite.dropzone.files[0]); // instance 2
        // If you want to the delete the file on the server as well,
        // you can do the AJAX request here.


//            delDocument("input_" + pdf_timestamp + ".pdf");

    });

    this.on("error", function (file, res)
    {
        isc.say(res);
        // Add the button to the file preview element.
        file.previewElement.appendChild(removeButtonKr);
    });

}

/*
 * GoTo: ********************** DataSources ************************************
 * =============================================================================
 */

isc.DataSource.create({
    ID: "krediteDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            defaultParams: {
                "counter": Date.now()
            },
            dataURL: "api/ds/krediteDS.php"
        }
    ],
    titleField: "text",
    fields: [
        {
            name: "ID",
            title: "ID",
            type: "text",
            primaryKey: true
        },
        {
            name: "datum",
            title: "Datum",
            type: "date"
        },
        {
            name: "enddatum",
            title: "End-Datum",
            type: "date"
        },
        {
            name: "rate_min_max",
            title: "Raten",
            type: "text"
        },
        {
            name: "rate_rest",
            title: "Restliche Raten",
            type: "number"
        }, {
            name: "betrag",
            title: "Rate",
            type: "text"
        }, {
            name: "betrag_gezahlt",
            title: "Bereits gezahlt",
            type: "text"
        }, {
            name: "gesamt_betrag",
            title: "Gesamt",
            type: "text"
        }, {
            name: "rest_betrag",
            title: "Rest",
            type: "text"
        }, {
            name: "vorgang",
            title: "Vorgang",
            type: "text"
        }, {
            name: "kommentar",
            title: "Kommentar",
            type: "text"
        }, {
            name: "max_rate",
            title: "Gesamtrate",
            type: "number"
        }, {
            name: "rate",
            title: "Rate",
            type: "number"
        }, {
            name: "kategorie",
            title: "Kategorie",
            type: "text"
        }, {
            name: "kategorie_id",
            title: "Kategorie-ID",
            type: "text"
        }, {
            name: "letzte_zahlung",
            title: "Monat letzte Zahlung",
            type: "text"
        }
    ]});


/*
 * ******************** GoTo: DropZone *************************
 * -------------------------------------------------------------
 */

isc.HTMLPane.create({
    width: "100%",
    height: 250,
    margin: 1,
    ID: "htmlPaneDropZoneKredite",
    styleName: "exampleTextBlock",
    contents: '<div id="dropzone"><form class="dropzone needsclick" id="dropZoneKredite"> ' +
      '</form></div>'
});

Dropzone.options.dropZoneKredite = {
//    acceptedFiles: "application/vnd.ms-excel",
    url: "api/upload_document.php",
    method: "post",
    init: initDropZoneKredite
};

/*
 * ****************** ENDE DropZone *****************************
 * --------------------------------------------------------------
 */


/*
 * **************************** DynaForm ***************************************
 * =============================================================================
 */
isc.DynamicForm.create({
    ID: "dfKrediteAuswahl",
    monCnt: 0,
    width: 300,
    height: 10,
    margin: 0,
    numCols: 2,
    fields: [{
            name: "auswahl",
            title: "Anzeige der Daten",
            valueMap: {"A": "aktive Vorgänge", "ALL": "alle Vorgänge"},
            defaultValue: "A",
            type: "radioGroup",
            redrawOnChange: true,
            vertical: false,
            changed: function (form, item, value)
            {
                lgKredite.fetchData({auswahl: value});
                amChartsKredite();
            }
        }
    ]
});


/*
 * GoTo: ************************ Listen ***************************************
 * =============================================================================
 */


isc.ToolStrip.create({
    ID: "gridEditControlsKredite",
    width: "100%", height: 20,
    backgroundColor: "#E7F6FF",
    members: [
        isc.LayoutSpacer.create({width: "*"}),
        isc.Label.create({
            padding: 2,
            ID: "totalsLabelKredite",
            align: "center",
            width: "100%"
        })

    ]
});

isc.ListGrid.create({
    ID: "lgKredite",
    count: 0,
    counter: 0,
    //   header: "Daten bearbeiten",
    width: "100%", height: "45%",
    alternateRecordStyles: true,
    dataSource: "krediteDS",
    autoFetchData: true,
    showFilterEditor: false,
    filterOnKeypress: false,
    selectionType: "single",
    showAllRecords: true,
    canExpandRecords: false,
    expansionMode: "details",
    showGridSummary: true,
    showGroupSummary: false,
//    groupStartOpen: "all",
//    groupByField: ['konto_bez', 'kategorie'],
    margin: 0,
//    initialSort: [{
//            property: "konto_bez",
//            direction: "ascending"
//        }
//    ],
    fields: [
        {
            name: "ID",
            title: "ID",
            type: "text",
            showIf: "false"
        }, {
            name: "vorgang",
            title: "Vorgang",
            type: "text",
            width: 250
        },
        {
            name: "rate_min_max",
            title: "Raten",
            type: "text",
            width: 60
        },
        {
            name: "rate_rest",
            title: "Übrig",
            type: "number",
            width: 80
        }, {
            name: "betrag",
            title: "Ratenzahlung",
            type: "localeFloat",
            width: 100
        }, {
            name: "gesamt_betrag",
            title: "Gesamt",
            type: "localeFloat",
            width: 80
        }, {
            name: "betrag_gezahlt",
            title: "Gezahlt",
            type: "localeFloat",
            width: 80
        }, {
            name: "rest_betrag",
            title: "Rest",
            type: "localeFloat",
            width: 80
        },
        {
            name: "datum",
            title: "Start-Datum",
            type: "date",
            width: 100
        },
        {
            name: "enddatum",
            title: "Letzte Zahlung",
            type: "date",
            width: 100,
            showIf: "false"
        }, {
            name: "letzte_zahlung",
            title: "Monat letzte Zahlung",
            type: "text",
            width: 130
        }, {
            name: "herkunft",
            title: "Herkunft/Kreditinstitut",
            type: "text",
            width: 200
        }, {
            name: "rate",
            title: "Rate",
            type: "number",
            showIf: "false"
        }, {
            name: "kategorie",
            title: "Kategorie",
            type: "text",
            width: 180
        }, {
            name: "kategorie_id",
            title: "Kategorie-ID",
            type: "text",
            showIf: "false"
        }, {
            name: "kommentar",
            title: "Kommentar",
            type: "text", showHover: true,
            hoverHTML: "return record.kommentar"
        },
        {name: "document", title: "Info",
            type: "link",
            showTitle: false,
            width: 30,
            align: "center",
            linkText: isc.Canvas.imgHTML("famfam/page_white_acrobat.png", 16, 16),
            linkURLPrefix: docPath
        }
    ],
    gridComponents: [/*"filterEditor",*/ "header", "body", gridEditControlsKredite/*, "summaryRow"*/],
    getSum: function (/*monat*/)
    {

        this.Super("dataChanged", arguments);
        var totalRows = lgKredite.data.getLength();
        var summe = 0;
        var zwSumme = "";
        var zwSumme2 = 0;
        //------------------------------
        var summe_taksit = 0;
        var zwSumme_taksit = "";
        var zwSumme2_taksit = 0;
        //------------------------------
        var summe_odenen = 0;
        var zwSumme_odenen = "";
        var zwSumme2_odenen = 0;
        //------------------------------
        var summe_kalanTaksit = 0;
        var zwSumme_kalanTaksit = "";
        var zwSumme2_kalanTaksit = 0;
        //------------------------------

        if (totalRows > 0 && lgKredite.data.lengthIsKnown())
        {

            for (var i = 0; i < totalRows; i++)
            {

                zwSumme = lgKredite.data.localData[i].gesamt_betrag.replace(/\./g, ''); // Erst alle Punkte weg
                zwSumme2 = parseFloat(zwSumme.replace(/,/g, ".")); // Komma wird mit Punkt getauscht

                summe = summe + zwSumme2;
                //--------------------------------------------------------------------------------------------------------------------------------
                zwSumme_taksit = lgKredite.data.localData[i].betrag.replace(/\./g, ''); // Erst alle Punkte weg
                zwSumme2_taksit = parseFloat(zwSumme_taksit.replace(/,/g, ".")); // Komma wird mit Punkt getauscht

                summe_taksit = summe_taksit + zwSumme2_taksit;
                //--------------------------------------------------------------------------------------------------------------------------------
                zwSumme_odenen = lgKredite.data.localData[i].betrag_gezahlt.replace(/\./g, ''); // Erst alle Punkte weg
                zwSumme2_odenen = parseFloat(zwSumme_odenen.replace(/,/g, ".")); // Komma wird mit Punkt getauscht

                summe_odenen = summe_odenen + zwSumme2_odenen;
                //--------------------------------------------------------------------------------------------------------------------------------
                zwSumme_kalanTaksit = lgKredite.data.localData[i].rest_betrag.replace(/\./g, ''); // Erst alle Punkte weg
                zwSumme2_kalanTaksit = parseFloat(zwSumme_kalanTaksit.replace(/,/g, ".")); // Komma wird mit Punkt getauscht

                summe_kalanTaksit = summe_kalanTaksit + zwSumme2_kalanTaksit;
            }

            var erg1 = "Gesamt: " + summe.toLocalizedString(2, ',', '.', '-'); // Gesamt
            var erg2 = "Ges. Raten: " + summe_taksit.toLocalizedString(2, ',', '.', '-'); // Raten
            var erg3 = "Gezahlt: " + summe_odenen.toLocalizedString(2, ',', '.', '-'); // Gezahlt
            var erg4 = "Noch zu zahlen: " + summe_kalanTaksit.toLocalizedString(2, ',', '.', '-'); // Rest
        }

        var labelContent = '<table><tr style="width:100%; color:' + gridComponentsLabelColor + '; font-size:' + gridComponentsLabelFontSize + '; font-family:' + gridComponentsLabelFontFamily + '; text-decoration:none;"><td width="200">' + erg2 + '</td><td width="200">' + erg1 + '</td><td width="200">' + erg3 + '</td><td width="200">' + erg4 + '</td></tr></table>';
        totalsLabelKredite.setContents(labelContent);

    }, recordClick: function (viewer, record, recordNum, field, fieldNum, value, rawValue)
    {
        if (record.document != "" && record.document != "null" && record.document != null)
        {
            PaneKrediteDocument.setContentsURL(docPath + record.document);
        }
    }, dataChanged()
    {
        lgKredite.getSum();
    }
});

/*
 * *************************** ToolStrip Button ********************************
 * =============================================================================
 */

isc.ToolStripButton.create({
    ID: "tsbKrediteRefresh",
    count: 1,
    action: function ()
    {
//        lgKredite.invalidateCache();
        lgKredite.fetchData({auswahl: dfKrediteAuswahl.getField("auswahl").getValue()});
        amChartsKredite();
    },
    prompt: "Daten neu laden",
    icon: "web/32/arrow_refresh.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700
});

isc.ToolStripButton.create({
    ID: "tsbUploadDocsKredite",
    count: 1,
    action: function ()
    {
        if (htmlPaneDropZoneKredite.isVisible())
        {
            htmlPaneDropZoneKredite.hide();
        } else
        {
            if (lgKredite.getSelection().length == 1)
            {
                htmlPaneDropZoneKredite.show();
            } else
            {
                isc.say("Bitte erst einen Vorgang wählen!");
            }

        }
    },
    prompt: "Vorgangsdokument hochladen",
    icon: "web/32/document_import.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700
});

isc.ToolStripButton.create({
    ID: "tsbKrediteDeleteDoc",
    count: 1,
    action: function ()
    {

        if (lgKredite.getSelection().length == 1)
        {
            isc.ask("Wollen Sie wirklich das ausgewählte Dokument löschen?", function (value)
            {
                if (value)
                {

                    RPCManager.send("", function (rpcResponse, data, rpcRequest)
                    {
                        var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                        if (_data.response.status === 0)
                        {  // Status 0 bedeutet Keine Fehler

                            isc.say("Dokument wurde erfolgreich gelöscht.");
//                            lgKredite.invalidateCache();
                            lgKredite.fetchData({auswahl: dfKrediteAuswahl.getField("auswahl").getValue()});
                            amChartsKredite();

                        } else
                        { // Wenn die Validierungen Fehler aufweisen dann:                            
                            var _errors = _data.response.errors;
                            isc.say("<b>Fehler! </br>" + _errors + "</b>");
                        }
                    }, {// Übergabe der Parameter
                        actionURL: "api/delDocument.php",
                        httpMethod: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        useSimpleHttp: true,
                        params: {
                            ID: lgKredite.getSelectedRecord().ID,
                            document: lgKredite.getSelectedRecord().document
                        }

                    }); //Ende RPC   
                }
            });

        } else
        {
            isc.say("Bitte erst einen Datensatz wählen");
        }
    },
    prompt: "Dokument des Vorgangs löschen",
    icon: "web/32/delete.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700
});

/*
 * ***************************** GRAFIK KREDITE ********************************
 * =============================================================================
 */

isc.HTMLPane.create({
    width: "50%",
    height: "100%",
    ID: "PaneKredite",
    styleName: "exampleTextBlock",
    contents: ""});

isc.HTMLPane.create({
    width: "100%",
    height: "100%",
    ID: "PaneKrediteDocument",
    contentsType: "page",
    contentsURL: docPath + "noPDF.PDF"
});

isc.HLayout.create({
    ID: "VLayoutGrafikKredite",
//    backgroundColor: "E3E3E3",
    height: "100%",
    align: "center",
    width: "100%",
    members: [PaneKredite]
});


/*
 * ****************************** SectionStack *********************************
 * =============================================================================
 */

isc.SectionStack.create({
    ID: "StackKredite",
    visibilityMode: "multiple",
    width: "100%", height: "100%",
    sections: [
        {title: "Ratenzahlungen", expanded: true, items: [
                lgKredite
            ]},
        {title: "Grafik", expanded: true, items: [
                VLayoutGrafikKredite
            ]},
        {title: "Dokument", expanded: false, items: [
                PaneKrediteDocument
            ]}
    ]
});



/*
 * GoTo: *********************** ANFANG MENU ***********************************
 * =============================================================================
 */

isc.Menu.create({
    ID: "menuKredite",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    data: [
        {title: tsbKrediteRefresh.prompt, icon: tsbKrediteRefresh.icon, click: function ()
            {
                tsbKrediteRefresh.action();
            }},
        {isSeparator: true},
        {title: tsbUploadDocsKredite.prompt, icon: tsbUploadDocsKredite.icon, click: function ()
            {
                tsbUploadDocsKredite.action();
            }},
        {title: tsbKrediteDeleteDoc.prompt, icon: tsbKrediteDeleteDoc.icon, click: function ()
            {
                tsbKrediteDeleteDoc.action();
            }}
    ]
});

/*
 * *************************** Layouts *****************************************
 * =============================================================================
 */

isc.Label.create({
    padding: 0,
    ID: "lblKredite",
    width: "100%",
    height: "100%",
    align: "center",
    contents: '<text style="color:' + titleLableColor + '; font-size:' + titleLableFontSize + '; font-family:' + titleLableFontFamily + '; text-decoration:none;">Kredite / Finanzierungen</text>'
});


isc.ToolStrip.create({
    ID: "tsKredite",
    width: "100%",
    backgroundImage: "backgrounds/leaves.jpg",
    height: 40,
    members: [tsbKrediteRefresh, isc.LayoutSpacer.create({width: 10}),
        tsbUploadDocsKredite, isc.LayoutSpacer.create({width: 10}),
        tsbKrediteDeleteDoc, isc.LayoutSpacer.create({width: 10}),
        dfKrediteAuswahl, isc.LayoutSpacer.create({width: "*"}),
        lblKredite, isc.LayoutSpacer.create({width: 5})]
});


isc.VLayout.create({
    ID: "VLayoutKredite",
//    overflow: "scroll",
    height: "100%",
    width: "100%",
    members: [tsKredite, htmlPaneDropZoneKredite, StackKredite]
});


/*
 * *************************** Initialisierung *********************************
 * =============================================================================
 */


addNode("VLayoutKredite", {
    name: "VLayoutKredite",
    cat: "Finanzen",
    onOpen: function ()
    {
        clearCharts('');
        amChartsKredite();
        lgKredite.contextMenu = menuKredite;
        htmlPaneDropZoneKredite.hide();
    },
    treenode: {
        Name: "VLayoutKredite",
        icon: "web/16/cash_stack.png",
        title: "Kredite, Finanzierungen, Raten",
        enabled: true
    },
    reflow: true
}
);