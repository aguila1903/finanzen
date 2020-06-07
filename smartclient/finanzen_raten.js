/* 
 *
 * FINANZEN RATEN
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
 * ************************ GoTo: DataSources ************************
 */

isc.DataSource.create({
    ID: "ratenDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/ratenDS.php"
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
            name: "karten_nr",
            title: "Kartenkürzel",
            type: "text"
        }, {
            name: "bezeichnung",
            title: "Karten-Name",
            type: "text"
        },
        {
            name: "vorgang",
            title: "Islem",
            type: "text"
        },
        {
            name: "datum",
            title: "Islem Tarih",
            type: "text"
        },
        {
            name: "rate",
            title: "Vade",
            type: "text"
        },
        {
            name: "max_rate",
            title: "Toplam Vade",
            type: "text"
        }, {
            name: "rate_min_max",
            title: "Vade",
            type: "text"
        }, {
            name: "gesamt_betrag",
            title: "Toplam Taksit",
            type: "text"
        }, {
            name: "betrag_gezahlt",
            title: "Ödenen Taksit",
            type: "text"
        }, {
            name: "rest_betrag",
            title: "Kalan Taksit",
            type: "text"
        },
        {
            name: "betrag",
            title: "Taksit Tutari",
            type: "text"
        },
        {
            name: "monat",
            title: "Ay",
            type: "text"
        },
        {
            name: "status",
            title: "Status",
            type: "text"
        },
        {
            name: "rate_rest",
            title: "Kalan Ay",
            type: "text"
        },
        {
            name: "monat",
            title: "Ay",
            type: "text"
        },
        {
            name: "comment",
            title: "Yorum",
            type: "text"
        }, {
            name: "datum_abrechnung_karte",
            type: "text"
        }
    ]
});


isc.DataSource.create({
    ID: "abrechnungenDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/abrechnungenDS.php"
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
            name: "pdf",
            title: "PDF",
            type: "text"
        }

    ]
});


isc.DataSource.create({
    ID: "vorgangRatenDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/vorgangRatenDS.php"
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
            name: "vorgang",
            title: "Islem",
            type: "text",
            primaryKey: true
        }

    ]
});

isc.DataSource.create({
    ID: "zahlmittelRatenDS",
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
    ID: "datumDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/datumDS.php"
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
            name: "datum",
            title: "Datum",
            type: "text"
        }
    ]
});



/*
 * ***************************** GoTo: Listen ************************************
 ---------------------------------------------------------------------------------
 */

isc.ListGrid.create({
    ID: "lgRaten",
    //   header: "Daten bearbeiten",
    width: "50%", height: "100%",
    alternateRecordStyles: true,
    dataSource: ratenDS,
    autoFetchData: true,
    taksit_count: 0,
    showFilterEditor: true,
    filterOnKeypress: false,
    selectionType: "multiple",
    showAllRecords: true,
    canExpandRecords: false,
    showGridSummary: true,
    showGroupSummary: true,
    expansionMode: "details",
    groupByField: ['datum_abrechnung_karte'],
    margin: 0,
    fields: [
        {
            name: "ID",
            canFilter: false,
            type: "text",
            showIf: "false",
            width: 20
        }, {
            name: "karten_nr",
            type: "text",
            canFilter: false,
            showIf: "false",
            width: 50
        }, {
            name: "bezeichnung",
            title: "Kart",
            canFilter: false,
            type: "text",
            width: 150,
            showIf: "false"/*,
             getGroupTitle: function(groupValue, groupNode, field, fieldName, grid) {// Mit dieser Funktion wird der Gruppenwert
             
             
             baseTitle = groupValue + " (" + groupNode.groupMembers.length + " Taksit)"; // groupNode berechnet die DatensÃ¤tze
             return baseTitle; // und gibt diese im Gruppentitel wieder.
             }*/
        }, {
            name: "datum",
            title: "Islem Tarih",
            canFilter: false,
            width: 80
        },
        {
            name: "vorgang",
            title: "Islem", canFilter: true,
            type: "text",
            showGridSummary: true, showGroupSummary: true, summaryFunction: "count",
            width: 200
        },
        {
            name: "rate",
            type: "text",
            canFilter: false,
            showIf: "false",
            width: 50
        },
        {
            name: "max_rate",
            type: "text",
            canFilter: false,
            showIf: "false",
            width: 70
        }, {
            name: "rate_min_max",
            title: "Vade",
            canFilter: false,
            type: "text",
            width: 70
        },
        {
            name: "betrag",
            canFilter: false,
            title: "Taksit Tutari (TL)",
            type: "text",
            width: 80,
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
            }
        }, {
            name: "gesamt_betrag",
            canFilter: false,
            title: "Toplam Taksit (TL)", recordSummaryFunction: "multiplier",
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
            },
            width: 100
        }, {
            name: "betrag_gezahlt",
            canFilter: false,
            title: "Biten (TL)", recordSummaryFunction: "multiplier",
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
            },
            width: 80
        }, {
            name: "rest_betrag",
            canFilter: false,
            title: "Kalan Taksit (TL)", recordSummaryFunction: "multiplier",
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
            },
            width: 100
        },
        {
            name: "status",
            canFilter: false,
            type: "text",
            showIf: "false",
            width: 30
        },
        {
            name: "rate_rest",
            canFilter: false,
            type: "text",
            showIf: "true",
            width: 60,
            align: "center", recordSummaryFunction: "multiplier",
            summaryFunction: "max",
            showGridSummary: true, showGroupSummary: true,
            formatCellValue: function (value)
            {
                if (isc.isA.Number(value))
                {
                    return value;
                }
                return value;
            }
        },
        {
            name: "monat",
            canFilter: false,
            title: "Ay",
            align: "center",
            type: "text",
            width: 60
        },
        {
            name: "comment",
            canFilter: false,
            type: "text",
            showIf: "true",
            width: "*"
        }
    ], hilites: hiliteArray,
    selectionChanged: function (record, state)
    {
        if (state)
        {
            tsbRatenEdit.setDisabled(false);
        } else
        {
            tsbRatenEdit.setDisabled(true);
        }
    },
    recordDoubleClick: function (viewer, record, recordNum, field, fieldNum, value, rawValue)
    {
        wdRatenEdit.show();
        pgbRatenEdit.setPercentDone(0);
        pgbRatenEdit.setHeight(13);
        pgbRatenEdit.setTitle("");
        var record = lgRaten.getSelectedRecord();
        dfRatenEdit.editRecord(record);
    }, findRecordFunction: function ()
    {
        var _ID = hiddenForm.getField("ID").getValue();
        var record = lgRaten.data.find("ID", _ID);
        var index = lgRaten.getRecordIndex(record);
        lgRaten.selectRecord(record);
        lgRaten.scrollToRow(index);
    }, dataArrived: function ()
    {
        isc.Timer.setTimeout("lgRaten.findRecordFunction()", 500);
    },
    //    groupByField: "bezeichnung",
    groupStartOpen: "all"});
// == >> Toolstrip Hauptseite  



/*
 * ************************ GoTo: DOKUMENTEN-AUSWAHL ***************************
 -------------------------------------------------------------------------------
 */

isc.DynamicForm.create({
    ID: "dfRatenDocAuswahl",
    count: 0,
    autoSize: true,
    colWidths: [285, "*"],
    dataSource: abrechnungenDS,
    numCols: 1,
    titleOrientation: "top",
    validateOnExit: true,
    validateOnChange: false,
    margin: 10,
    fields: [{
            name: "karten_nr", required: true,
            optionDataSource: zahlmittelRatenDS,
            title: "Kart",
            type: "text",
            autoFetchData: true,
            valueField: "karten_nr",
            displayField: "bezeichnung",
            width: 250,
            pickListProperties: {showShadow: true, showFilterEditor: false, showHeader: true},
            pickListWidth: 245,
            pickListFields: [
                {name: "karten_nr", width: 50}, {name: "bezeichnung", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                dfRatenDocAuswahl.count++;
                var filter = {
                    count: dfRatenDocAuswahl.count, form: "dfRatenDocAuswahl", land: "TR"};
                return filter;
            }, changed: function ()
            {
                dfRatenDocAuswahl.getField("datum").setDisabled(false);
                if (dfRatenDocAuswahl.getField("datum").getValue())
                {
                    dfRatenDocAuswahl.clearValue("datum");
                    dfRatenDocAuswahl.clearValue("pdf");
                    btnRatenDocAuswahlOpen.setDisabled(true);
                }
            }
        }, {
            name: "datum", required: true,
            optionDataSource: datumDS,
            title: "Ekstre Tarihi",
            type: "text",
            disabled: true,
            autoFetchData: true,
            valueField: "datum",
            displayField: "datum",
            width: 250,
            pickListProperties: {showShadow: true, showFilterEditor: false, showHeader: true},
            pickListWidth: 245,
            pickListFields: [{name: "datum", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                dfRatenDocAuswahl.count++;
                var filter = {
                    count: dfRatenDocAuswahl.count, karten_nr: dfRatenDocAuswahl.getField("karten_nr").getValue()};
                return filter;
            }, changed: function (form, item, value)
            {
                RPCManager.send("", function (rpcResponse, data, rpcRequest)
                {
                    var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                    if (_data.response.status === 0)
                    {  // Status 0 bedeutet Keine Fehler
                        var _pdf = _data.response.data["pdf"];
                        dfRatenDocAuswahl.getField("pdf").setValue(_pdf);
                        if (_pdf != "noPDF.pdf")
                        {
                            btnRatenDocAuswahlOpen.setDisabled(false);
                        }
                    }

                }, {// Übergabe der Parameter
                    actionURL: "api/ds/abrechnungenDS.php",
                    httpMethod: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    useSimpleHttp: true,
                    params: {datum: dfRatenDocAuswahl.getField("datum").getValue()
                        , karten_nr: dfRatenDocAuswahl.getField("karten_nr").getValue()}

                }); //Ende RPC 
            }
        }, {
            name: "pdf", required: true,
            title: "Ekstre",
            type: "text",
            autoFetchData: false,
            width: 250
        }
    ]});

isc.IButton.create({
    ID: "btnRatenDocAuswahlOpen",
    type: "button",
    disabled: true,
    name: "btnRatenDocAuswahlOpen",
    title: "PDF öffnen", width: 100, //Neuen Film anlegen
    click: function ()
    {
        console.log("ich bin hier");
        var _kart_name = dfRatenDocAuswahl.getField("karten_nr").getDisplayValue();
        var _datum = dfRatenDocAuswahl.getField("datum").getValue();
        wdRatenAbrechnung.setTitle(_kart_name + " - " + _datum);
        wdRatenAbrechnung.show();
        htmlPaneRatenDoc.setContentsURL(pdfPath + dfRatenDocAuswahl.getField("pdf").getValue());
        console.log("...und hier");

    }});
isc.IButton.create({
    ID: "btnRatenDocAuswahlClose",
    type: "button",
    disabled: false,
    name: "btnRatenDocAuswahlClose",
    title: "Schließen", width: 100, //Neuen Film anlegen
    click: function ()
    {
        wdRatenDocAuswahl.hide();
    }});
isc.HLayout.create({
    ID: "HLayoutRatenDocAuswahlButtons",
    height: "10%",
    width: "100%",
    align: "center",
    layoutMargin: 0,
    members: [btnRatenDocAuswahlOpen, isc.LayoutSpacer.create({
            width: 20
        }), btnRatenDocAuswahlClose]});

isc.VLayout.create({
    ID: "VLayoutRatenDocAuswahlFormBtn",
    height: "100%",
    width: "100%",
    align: "center",
    valign: "center",
    layoutMargin: 0,
    members: [dfRatenDocAuswahl, HLayoutRatenDocAuswahlButtons]});

isc.Window.create({
    ID: "wdRatenDocAuswahl",
    title: "Ekstre secimi",
    autoSize: false,
    autoCenter: true,
    showFooter: false,
    headerIconDefaults: {width: 16, height: 16, src: "famfam/application_form_add.png"},
    showMinimizeButton: false,
    showCloseButton: true,
    width: 300,
    height: 230,
    canDragReposition: false,
    canDragResize: false,
    items: [VLayoutRatenDocAuswahlFormBtn]});


/*
 * ********************* GoTo: ANZEIGE DOKUMENT ********************************
 * =============================================================================
 */


isc.HTMLPane.create({
    width: "100%",
    height: "100%",
    ID: "htmlPaneRatenDoc",
    contentsURL: pdfPath + "noPDF.PDF",
    contentsType: "page"});


isc.Window.create({
    ID: "wdRatenAbrechnung",
    title: "Ekstreler",
    autoSize: false,
    autoCenter: true,
    showFooter: false,
    headerIconDefaults: {width: 16, height: 16, src: "famfam/pdf.png"},
    showMinimizeButton: false,
    showCloseButton: true,
    width: "50%",
    height: "100%",
    canDragReposition: false,
    canDragResize: false,
    items: [htmlPaneRatenDoc]});



/*
 * ***************************** GoTo: DynaForm ********************************
 -------------------------------------------------------------------------------
 */

isc.DynamicForm.create({
    ID: "dfRatenAuswahlAnzeige",
    monCnt: 0,
    width: 100,
    height: 10,
    numCols: 2,
    titleOrientation: "left",
    margin: 0,
    fields: [{
            name: "raten",
            title: "Raten",
            valueMap: {"E": "Alle", "A": "Aktive"},
            defaultValue: "A",
            type: "radioGroup",
            redrawOnChange: true,
            vertical: true,
            changed: function (form, item, value)
            {
                var timeStamp = new Date().getTime();
                /*   if (value === "E") {
                 lgRaten.fetchData({typ: "E"});
                 } else {
                 lgRaten.fetchData({typ: "A"});
                 }*/
                lgRaten.fetchData({karten_nr: dfRatenAuswahlKarte.getField("karten_nr").getValue(), typ: dfRatenAuswahlAnzeige.getField("raten").getValue(),
                    count: timeStamp
                });
            }

        }]});

isc.DynamicForm.create({
    ID: "dfRatenAuswahlKarte",
    monCnt: 0,
    width: 10,
    height: 10,
    dataSource: zahlmittelRatenDS,
    // numCols: 2,
    titleOrientation: "left",
    validateOnExit: true,
    validateOnChange: false,
    margin: 0,
    fields: [{
            name: "karten_nr", required: true,
            optionDataSource: zahlmittelRatenDS,
            title: "Kart",
            animatePickList: false,
            defaultValue: "ALL",
            type: "text",
            valueField: "karten_nr",
            displayField: "bezeichnung",
            width: 160,
            pickListProperties: {showShadow: true, showFilterEditor: false, showHeader: true},
            pickListWidth: 150,
            pickListFields: [
                {name: "bezeichnung", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                //      dfRatenEdit.kartCount++;
                var filter = {
                    form: "dfRatenAuswahlKarte", land: "TR"};
                return filter;
            },
            changed: function (form, item, value)
            {
                wdRatenEdit.editTaksit_FormChanged();
                var timeStamp = new Date().getTime();
                lgRaten.fetchData({karten_nr: value, typ: dfRatenAuswahlAnzeige.getField("raten").getValue(), count: timeStamp});
            }
        }]
});


/*
 * ************************ GoTo: FORM RATEN ADD *******************************
 -------------------------------------------------------------------------------
 */

isc.Progressbar.create({
    percentDone: 0, // pgbRatenAdd fÃ¤ngt bei 0% an
    ID: "pgbRatenAdd",
    showTitle: true,
    title: "",
    length: "100%"});
isc.DynamicForm.create({
    ID: "dfRatenAdd",
    width: "100%",
    height: "100%",
    kartCount: 0,
    colWidths: [150, "*"],
    numCols: 1,
    titleOrientation: "top",
    validateOnExit: true,
    validateOnChange: false,
    margin: 15,
    fields: [{
            name: "karten_nr", 
            required: true,
            optionDataSource: zahlmittelRatenDS,
            title: "Kart",
            type: "text",
            changed: function (form, item, value)
            {
                wdRatenAdd.addTaksit_FormChanged();
            },
            valueField: "karten_nr",
            displayField: "bezeichnung",
            width: 210,
            pickListProperties: {showShadow: true, showFilterEditor: false, showHeader: true},
            pickListWidth: 200,
            pickListFields: [
                {name: "karten_nr", width: 70}, {name: "bezeichnung", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                dfRatenAdd.kartCount++;
                var filter = {
                    count: dfRatenAdd.kartCount, land: "TR", form: "dfRatenAdd"};
                return filter;
            }
        },
        {
            name: "vorgang",
            title: "Islem",
            width: 250,
            type: "comboBox",
            optionDataSource: vorgangRatenDS,
            required: true,
            valueField: "vorgang",
            displayField: "vorgang",
            validators: [
                {
                    type: "lengthRange",
                    min: 1,
                    max: 50,
                    errorMessage: "Mind. 1 max. 50 Zeichen Erlaubt! </br></br>"
                }
            ],
            changed: function (form, item, value)
            {
                wdRatenAdd.addTaksit_FormChanged();
            }, getPickListFilterCriteria: function ()
            {
                dfRatenAdd.kartCount++;
                var filter = {
                    vorgang: dfRatenAdd.getField("vorgang").getValue(), count: dfRatenAdd.kartCount};
                return filter;
            }
        },
        {
            name: "betrag",
            title: "Taksit",
            type: "text", required: true,
            keyPressFilter: "[-0-9,]",
            changed: function (form, item, value)
            {
                wdRatenAdd.addTaksit_FormChanged();
            }
        },
        {
            name: "rate",
            title: "Vade", required: true,
            type: "spinner",
            defaultValue: 1,
            width: 50,
            keyPressFilter: "[0-9]",
            changed: function (form, item, value)
            {
                wdRatenAdd.addTaksit_FormChanged();
            }
        }, {
            name: "max_rate",
            title: "Vade Toplam", required: true,
            type: "spinner",
            width: 50,
            defaultValue: 1,
            keyPressFilter: "[0-9]",
            changed: function (form, item, value)
            {
                wdRatenAdd.addTaksit_FormChanged();
            }
        },
        {
            name: "monat",
            title: "Ay",
            type: "text", required: true,
            changed: function (form, item, value)
            {
                wdRatenAdd.addTaksit_FormChanged();
            }

        },
        {
            name: "comment",
            title: "Yorum",
            type: "textArea",
            width: 190,
            height: 80,
            required: false,
            changed: function (form, item, value)
            {
                wdRatenEdit.editTaksit_FormChanged();
            }

        }, {name: "datum",
            type: "date",
            title: "Islem Tarihi",
            startDate: "01/01/2010",
            changed: function (form, item, value)
            {
                wdRatenAdd.addTaksit_FormChanged();
            }
        }
    ], addTaksit_Timer: function ()
    {
        if (pgbRatenAdd.percentDone < 100)
        {
            var _percent = pgbRatenAdd.percentDone + parseInt(10 + (50 * Math.random()));
            pgbRatenAdd.setPercentDone(_percent); // Zufallswert wird berechnet

            if (_percent <= 100)
            {
                pgbRatenAdd.setTitle(_percent + "%");
            } //Bis 100 wird mitgezählt
            else
            {
                pgbRatenAdd.setTitle("100%"); // ab 100 darf nicht mehr gezählt werden, da 100 leicht überstiegen wird.
            }

            isc.Timer.setTimeout("dfRatenAdd.addTaksit_Timer()", 200);
        } else
        {
            if (!dfRatenAdd.validate() && dfRatenAdd.hasErrors())
            {
                dfRatenAdd.setErrors(_data.response.errors, true);
                var _errors = dfRatenAdd.getErrors();
                for (var i in _errors)
                {
                    isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>", function (value)
                    {
                        if (value)
                        {
                            pgbRatenAdd.setTitle(""); // blendet den Titel aus
                            pgbRatenAdd.setPercentDone(0);
                        }
                    }); // Hier wird jeder Wert des Array-Schlüssel angezeigt und das Feld oder die Feld-Bezeichnung ist irrelevant.
                }
            } else
            {
                isc.ask("Wollen Sie einen weiteren Taksit anlegen?", function (value)
                {
                    if (value)
                    {
                        dfRatenAdd.getField("vorgang").clearValue();
                        dfRatenAdd.getField("betrag").clearValue();
                        dfRatenAdd.getField("max_rate").clearValue();
                        dfRatenAdd.getField("comment").clearValue();
                        btnRatenCancelAdd.setTitle("Schließen");
                        btnRatenCancelAdd.setIcon("web/32/door_in.png");
                        btnRatenSaveAdd.setDisabled(true);
                        pgbRatenAdd.setTitle(""); // blendet den Titel aus
                        pgbRatenAdd.setPercentDone(0);
                    } else
                    {
                        wdRatenAdd.hide();
                        isc.say(hiddenForm.getField("Ergebnis").getValue(), function (value)
                        {
                            if (value)
                            {
                                isc.Timer.setTimeout("lgRaten.findRecordFunction()", 300);
                            }
                        });
                    }
                });

            }
        }
    }
});
isc.HLayout.create({
    ID: "HLayoutRatenButtonsAdd",
    taksitCnt_add: 0,
    width: "100%", // Taksit add
    height: 30,
    align: "center",
    layoutMargin: 10,
    members: [
        isc.IButton.create({
            ID: "btnRatenSaveAdd",
            type: "button",
            name: "btnRatenSaveAdd",
            title: "Speichern", width: 100,
            click: function ()
            {
                HLayoutRatenButtonsAdd.taksitCnt_add++;
                var _karten_nr = dfRatenAdd.getField("karten_nr").getValue();
                var _rate = dfRatenAdd.getField("rate").getValue();
                var _max_rate = dfRatenAdd.getField("max_rate").getValue();
                var _monat = dfRatenAdd.getField("monat").getValue();
                var _vorgang = dfRatenAdd.getField("vorgang").getValue();
                var _betrag = dfRatenAdd.getField("betrag").getValue();
                var _comment = dfRatenAdd.getField("comment").getValue();
                var _datum = dfRatenAdd.getField("datum").getValue();
                if (!dfRatenAdd.validate())
                {
                    isc.say("Alle Felder müssen korrekt ausgefüllt werden.");
                } else
                {
                    pgbRatenAdd.setTitle("Lädt...");
                    RPCManager.send("", function (rpcResponse, data, rpcRequest)
                    {
                        var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                        if (_data.response.status === 0)
                        {  // Status 0 bedeutet Keine Fehler
                            var timeStamp = new Date().getTime();
                            var Ergebnis = _data.response.data["Ergebnis"];
                            hiddenForm.getField("Ergebnis").setValue(Ergebnis);
                            dfRatenAdd.addTaksit_Timer();
                            btnRatenCancelAdd.setTitle("Schließen");
                            btnRatenCancelAdd.setIcon("web/32/door_in.png");
                            btnRatenSaveAdd.setDisabled(true);

                            lgRaten.fetchData({karten_nr: _karten_nr, typ: dfRatenAuswahlAnzeige.getField("raten").getValue(),
                                count: timeStamp
                            });
                            dfRatenAuswahlKarte.getField("karten_nr").setValue(_karten_nr);

                            //*********************************Suche des neu erstellten Datensatzes ***************************************************************************

                            RPCManager.send("", function (rpcResponse, data, rpcRequest)
                            {
                                var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                                if (_data.response.status === 0)
                                {  // Status 0 bedeutet Keine Fehler
                                    var _ID = _data.response.data["ID"];
                                    hiddenForm.getField("ID").setValue(_ID);
                                } else
                                { // Wenn die Validierungen Fehler aufweisen dann:

                                    hiddenForm.setErrors(_data.response.errors, true);
                                    var _errors = dfRatenAdd.getErrors();
                                    for (var i in _errors)
                                    {
                                        isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>");
                                    }

                                }
                            }, {// Übergabe der Parameter
                                actionURL: "api/ds/ratenFindID.php",
                                httpMethod: "POST",
                                contentType: "application/x-www-form-urlencoded",
                                useSimpleHttp: true,
                                params: {karten_nr: _karten_nr,
                                    rate: _rate,
                                    max_rate: _max_rate,
                                    monat: _monat,
                                    vorgang: _vorgang,
                                    betrag: _betrag}

                            }); //Ende RPC FindID_add


                            //******************* Wenn die Validierungen Fehler aufweisen dann:  ************************************************************************                                    

                        } else
                        {

                            dfRatenAdd.setErrors(_data.response.errors, true);
                            var _errors = dfRatenAdd.getErrors();
                            for (var i in _errors)
                            {
                                isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>", function (value)
                                {
                                    if (value)
                                    {
                                        pgbRatenAdd.setTitle(""); // blendet den Titel aus
                                        pgbRatenAdd.setPercentDone(0);
                                    }
                                });
                            }

                        }
                    }, {// Übergabe der Parameter
                        actionURL: "api/raten_add.php",
                        httpMethod: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        useSimpleHttp: true,
                        params: {karten_nr: _karten_nr,
                            rate: _rate,
                            max_rate: _max_rate,
                            monat: _monat,
                            vorgang: _vorgang,
                            betrag: _betrag,
                            comment: _comment,
                            datum: _datum}

                    }); //Ende RPC   
                }
            }
        }), isc.LayoutSpacer.create({
            width: 20
        }),
        isc.IButton.create({
            ID: "btnRatenCancelAdd",
            top: 250,
            title: "Schließen",
            icon: "web/32/door_in.png",
            click: function ()
            {
                var ButtonTitle = btnRatenCancelAdd.getTitle();
                if (ButtonTitle == "Abbrechen")
                {
                    isc.ask("<b>Wollen Sie wirklich beenden?<br>Daten könnten verloren gehen.</b>",
                      function (value)
                      {
                          if (value)
                          {
                              dfRatenAdd.reset();
                              wdRatenAdd.hide();
                              btnRatenSaveAdd.setDisabled(true);
                              btnRatenCancelAdd.setTitle("Schließen");
                              btnRatenCancelAdd.setIcon("web/32/door_in.png");
                              dfRatenAdd.clearErrors(true);
                              pgbRatenAdd.setTitle(""); // blendet den Titel aus
                              pgbRatenAdd.setPercentDone(0); // Setzt den Ladebalken zurÃ¼ck
                          }
                      }, {title: "Hinzufügen abbrechen?"});
                } else
                {
                    wdRatenAdd.hide();
                    dfRatenAdd.reset();
                    btnRatenSaveAdd.setDisabled(true);
                    dfRatenAdd.clearErrors(true);
                    pgbRatenAdd.setTitle(""); // blendet den Titel aus
                    pgbRatenAdd.setPercentDone(0); // Setzt den Ladebalken zurÃ¼ck
                }
            }
        })
    ]});
isc.VLayout.create({
    ID: "VLayoutRatenAdd",
    height: "100%",
    width: "100%",
    align: "center",
    layoutMargin: 0,
    members: [dfRatenAdd, HLayoutRatenButtonsAdd, pgbRatenAdd]});

isc.Window.create({
    ID: "wdRatenAdd",
    width: 300,
    height: 530,
    title: "Yeni Taksit eklemek",
    //     autoSize: true,
    autoCenter: true,
    headerIconDefaults: {width: 16, height: 16, src: "famfam/application_form_edit.png"},
    showFooter: true,
    showMinimizeButton: false,
    showCloseButton: true,
    canDragReposition: true,
    canDragResize: true,
    showShadow: false,
    showModalMask: false,
    modalMaskOpacity: 10,
    isModal: false,
    items: [VLayoutRatenAdd],
    addTaksit_FormChanged: function ()
    {
        btnRatenCancelAdd.setTitle("Abbrechen");
        btnRatenCancelAdd.setIcon("icons/16/close.png");
        btnRatenSaveAdd.setDisabled(false);
    }});
/*
 * ******************************** Ende Taksitler *****************************************************************************
 */



/*
 * ******************************** Anfang Taksitler Edit *****************************************************************************
 */


isc.Progressbar.create({
    percentDone: 0, // pgbRatenEdit fÃ¤ngt bei 0% an
    ID: "pgbRatenEdit",
    showTitle: true,
    title: "",
    length: "100%"});
isc.DynamicForm.create({
    ID: "dfRatenEdit",
    width: "100%",
    height: "100%",
    kartCount: 0,
    colWidths: [150, "*"],
    numCols: 1,
    titleOrientation: "top",
    validateOnExit: true,
    validateOnChange: false,
    margin: 15,
    fields: [
        {name: "ID",
            type: "hidden"}, 
        {
            name: "karten_nr", required: true,
            optionDataSource: zahlmittelRatenDS,
            title: "Kart",
            type: "text",
            changed: function (form, item, value)
            {
                wdRatenEdit.editTaksit_FormChanged();
            },
            valueField: "karten_nr",
            displayField: "bezeichnung",
            width: 210,
            pickListProperties: {showShadow: true, showFilterEditor: false, showHeader: true},
            pickListWidth: 200,
            pickListFields: [
                {name: "karten_nr", width: 70}, {name: "bezeichnung", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                dfRatenEdit.kartCount++;
                var filter = {
                    karten_nr: dfRatenEdit.getField("karten_nr").getValue(), count: dfRatenEdit.kartCount, form: "dfRatenEdit", land: "TR"};
                return filter;
            }
        },
        {
            name: "vorgang",
            title: "Islem",
            width: 250,
            type: "comboBox",
            optionDataSource: vorgangRatenDS,
            required: true,
            validators: [
                {
                    type: "lengthRange",
                    min: 1,
                    max: 50,
                    errorMessage: "Mind. 1 max. 50 Zeichen Erlaubt! </br></br>"
                }
            ],
            changed: function (form, item, value)
            {
                wdRatenEdit.editTaksit_FormChanged();
            }, getPickListFilterCriteria: function ()
            {
                dfRatenEdit.kartCount++;
                var filter = {
                    vorgang: dfRatenEdit.getField("vorgang").getValue(), count: dfRatenEdit.kartCount};
                return filter;
            }
        },
        {
            name: "betrag",
            title: "Taksit",
            type: "text", required: true,
            keyPressFilter: "[-0-9,]",
            changed: function (form, item, value)
            {
                wdRatenEdit.editTaksit_FormChanged();
            }
        },
        {
            name: "rate",
            title: "Vade", required: true,
            type: "spinner",
            width: 50,
            keyPressFilter: "[0-9]",
            changed: function (form, item, value)
            {
                wdRatenEdit.editTaksit_FormChanged();
            }
        }, {
            name: "max_rate",
            title: "Vade Toplam", required: true,
            type: "spinner",
            width: 50,
            keyPressFilter: "[0-9]",
            changed: function (form, item, value)
            {
                wdRatenEdit.editTaksit_FormChanged();
            }
        },
        {
            name: "monat",
            title: "Ay",
            type: "text", required: true,
            changed: function (form, item, value)
            {
                wdRatenEdit.editTaksit_FormChanged();
            }

        },
        {
            name: "comment",
            title: "Yorum",
            type: "textArea",
            width: 190,
            height: 80,
            required: false,
            changed: function (form, item, value)
            {
                wdRatenEdit.editTaksit_FormChanged();
            }},
        {name: "datum",
            title: "Islem Tarihi",
            type: "date",
            startDate: "01/01/2010",
            changed: function (form, item, value)
            {
                wdRatenEdit.editTaksit_FormChanged();
            }
        }

    ], editTaksit_Timer: function ()
    {
        if (pgbRatenEdit.percentDone < 100)
        {
            var _percent = pgbRatenEdit.percentDone + parseInt(10 + (50 * Math.random()));
            pgbRatenEdit.setPercentDone(_percent); // Zufallswert wird berechnet

            if (_percent <= 100)
            {
                pgbRatenEdit.setTitle(_percent + "%");
            } //Bis 100 wird mitgezählt
            else
            {
                pgbRatenEdit.setTitle("100%"); // ab 100 darf nicht mehr gezählt werden, da 100 leicht überstiegen wird.
            }

            isc.Timer.setTimeout("dfRatenEdit.editTaksit_Timer()", 200);
        } else
        {
            if (!dfRatenEdit.validate() && dfRatenEdit.hasErrors())
            {
                dfRatenEdit.setErrors(_data.response.errors, true);
                var _errors = dfRatenEdit.getErrors();
                for (var i in _errors)
                {
                    isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>", function (value)
                    {
                        if (value)
                        {
                            pgbRatenEdit.setTitle(""); // blendet den Titel aus
                            pgbRatenEdit.setPercentDone(0);
                        }
                    }); // Hier wird jeder Wert des Array-Schlüssel angezeigt und das Feld oder die Feld-Bezeichnung ist irrelevant.
                }
            } else
            {
                wdRatenEdit.hide();
                isc.say(hiddenForm.getField("Ergebnis").getValue(), function (value)
                {
                    if (value)
                    {
                        isc.Timer.setTimeout("lgRaten.findRecordFunction()", 300);
                    }
                });
            }
        }
    }
});
isc.HLayout.create({
    ID: "HLayoutRatenButtonsEdit",
    regiCnt_edit: 0,
    width: "100%",
    height: 30,
    align: "center",
    layoutMargin: 10,
    members: [
        isc.IButton.create({
            ID: "btnRatenSaveEdit",
            type: "button", // Taksit edit
            name: "btnRatenSaveEdit",
            title: "Speichern", width: 100,
            click: function ()
            {
                //FindRecord_edit_01 - Setzen der ID in das HiddenForm
                hiddenForm.getField("ID").setValue(dfRatenEdit.getField("ID").getValue());
                if (!dfRatenEdit.validate())
                {
                    isc.say(wdRatenEdit, "Alle Felder müssen korrekt ausgefüllt werden.");
                    //  isc.Timer.setTimeout("dfRatenEdit.ValidateTimereditTaksit_Window()", 3000);
                } else
                {
                    pgbRatenEdit.setTitle("Lädt...");
                    RPCManager.send("", function (rpcResponse, data, rpcRequest)
                    {
                        var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                        if (_data.response.status === 0)
                        {  // Status 0 bedeutet Keine Fehler
                            var timeStamp = new Date().getTime();
                            var Ergebnis = _data.response.data["Ergebnis"];
                            hiddenForm.getField("Ergebnis").setValue(Ergebnis);
                            dfRatenEdit.editTaksit_Timer();
                            btnRatenCancelEdit.setTitle("Schließen");
                            btnRatenCancelEdit.setIcon("web/32/door_in.png");
                            btnRatenSaveEdit.setDisabled(true);
                            //   isc.Timer.setTimeout("dfRatenEdit.ErgebnisTimer()", 1000);
                            //   isc.Timer.setTimeout("dfRatenEdit.LabelDeletTimer()",5000);


                            //isc.Timer.setTimeout("dfRatenEdit.ValidateTimerNeuWindow()", 2000); // eigentlich timer für pgbRatenEdit

                            //   filmListe.invalidateCache();
                            lgRaten.fetchData({karten_nr: dfRatenEdit.getField("karten_nr").getValue(), typ: dfRatenAuswahlAnzeige.getField("raten").getValue(),
                                count: timeStamp
                            });

                            dfRatenAuswahlKarte.getField("karten_nr").setValue(dfRatenEdit.getField("karten_nr").getValue());

                        } else
                        { // Wenn die Validierungen Fehler aufweisen dann:

                            dfRatenEdit.setErrors(_data.response.errors, true);
                            var _errors = dfRatenEdit.getErrors();
                            for (var i in _errors)
                            {
                                isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>", function (value)
                                {
                                    if (value)
                                    {
                                        pgbRatenEdit.setTitle(""); // blendet den Titel aus
                                        pgbRatenEdit.setPercentDone(0);
                                    }
                                });
                            }

                        }
                    }, {// Übergabe der Parameter
                        actionURL: "api/raten_edit.php",
                        httpMethod: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        useSimpleHttp: true,
                        params: {ID: dfRatenEdit.getField("ID").getValue(),
                            karten_nr: dfRatenEdit.getField("karten_nr").getValue(),
                            rate: dfRatenEdit.getField("rate").getValue(),
                            max_rate: dfRatenEdit.getField("max_rate").getValue(),
                            monat: dfRatenEdit.getField("monat").getValue(),
                            vorgang: dfRatenEdit.getField("vorgang").getValue(),
                            betrag: dfRatenEdit.getField("betrag").getValue(),
                            comment: dfRatenEdit.getField("comment").getValue(),
                            datum: dfRatenEdit.getField("datum").getValue()}

                    }); //Ende RPC    

                }
            }
        }), isc.LayoutSpacer.create({
            width: 20
        }),
        isc.IButton.create({
            ID: "btnRatenCancelEdit",
            top: 250,
            title: "Schließen",
            icon: "web/32/door_in.png",
            click: function ()
            {
                var ButtonTitle = btnRatenCancelEdit.getTitle();
                if (ButtonTitle == "Abbrechen")
                {

                    isc.ask("<b>Wollen Sie wirklich beenden?<br>Daten könnten verloren gehen.</b>",
                      function (value)
                      {
                          if (value)
                          {
                              dfRatenEdit.reset();
                              wdRatenEdit.hide();
                              btnRatenSaveEdit.setDisabled(true);
                              btnRatenCancelEdit.setTitle("Schließen");
                              btnRatenCancelEdit.setIcon("web/32/door_in.png");
                              dfRatenEdit.clearErrors(true);
                              pgbRatenEdit.setTitle(""); // blendet den Titel aus
                              pgbRatenEdit.setPercentDone(0); // Setzt den Ladebalken zurÃ¼ck
                          }
                      }, {title: "Hinzufügen abbrechen?"});
                } else
                {
                    wdRatenEdit.hide();
                    dfRatenEdit.reset();
                    btnRatenSaveEdit.setDisabled(true);
                    dfRatenEdit.clearErrors(true);
                    pgbRatenEdit.setTitle(""); // blendet den Titel aus
                    pgbRatenEdit.setPercentDone(0); // Setzt den Ladebalken zurÃ¼ck
                }
            }
        })
    ]});
isc.VLayout.create({
    ID: "VLayoutEditTaksit_Gesamt",
    height: "100%",
    width: "100%",
    align: "center",
    layoutMargin: 0,
    members: [dfRatenEdit, HLayoutRatenButtonsEdit, pgbRatenEdit]});
currentIcon = "famfam/application_form_edit.png";
isc.Window.create({
    ID: "wdRatenEdit",
    width: 300,
    height: 530,
    title: "Yeni Taksit eklemek",
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
    items: [VLayoutEditTaksit_Gesamt],
    editTaksit_FormChanged: function ()
    {
        btnRatenCancelEdit.setTitle("Abbrechen");
        btnRatenCancelEdit.setIcon("icons/16/close.png");
        btnRatenSaveEdit.setDisabled(false);
    }});




/*
 * ************************* ANFANG TOOLSTRIP BUTTONS **************************
 * -----------------------------------------------------------------------------
 */
isc.ToolStripButton.create({
    ID: "tsbRatenDown",
    icon: "web/32/chart_down_color.png",
    prompt: "Raten der ausgewählten Kreditkarte runtersetzen",
    title: "",
    showDisabledIcon: false,
    disabled: true,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700,
    click: function ()
    {
        isc.say("Button ist deaktiviert");
        return;
        isc.ask("Wollen Sie wirklich die Raten der ausgewählten Karte runtersetzen?", function (value)
        {
            if (value)
            {
                RPCManager.send("", function (rpcResponse, data, rpcRequest)
                {
                    var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                    if (_data.response.status === 0)
                    {  // Status 0 bedeutet Keine Fehler
                        var timeStamp = new Date().getTime();
                        var Ergebnis = _data.response.data["Ergebnis"];
                        hiddenForm.getField("Ergebnis").setValue(Ergebnis);
                        lgRaten.fetchData({karten_nr: dfRatenAuswahlKarte.getField("karten_nr").getValue(), typ: dfRatenAuswahlAnzeige.getField("raten").getValue(),
                            count: timeStamp
                        });

                    } else
                    {
                        hiddenForm.setErrors(_data.response.errors, true);
                        var _errors = hiddenForm.getErrors();
                        for (var i in _errors)
                        {
                            isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>");
                        }
                    }
                }, {// Übergabe der Parameter
                    actionURL: "api/raten_up_down.php",
                    httpMethod: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    useSimpleHttp: true,
                    params: {typ: "down",
                        monat: _Monat,
                        karten_nr: dfRatenAuswahlKarte.getField("karten_nr").getValue()}

                }); //Ende RPC 
            }
        });
    }
});

isc.ToolStripButton.create({
    ID: "tsbRatenUp",
    icon: "web/32/chart_up_color.png",
    prompt: "Raten der ausgewählten Kreditkarte hochsetzen",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700,
    click: function ()
    {
        if (dfRatenAuswahlKarte.getField("karten_nr").getValue() != "ALL")
        {
            isc.ask("Wollen Sie wirklich die Raten der ausgewählten Karte hochsetzen?", function (value)
            {
                if (value)
                {
                    RPCManager.send("", function (rpcResponse, data, rpcRequest)
                    {
                        var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                        if (_data.response.status === 0)
                        {  // Status 0 bedeutet Keine Fehler
                            var timeStamp = new Date().getTime();
                            var Ergebnis = _data.response.data["Ergebnis"];
                            hiddenForm.getField("Ergebnis").setValue(Ergebnis);

                            //   onRefresh_typ("lgRaten", "E");

                            lgRaten.fetchData({karten_nr: dfRatenAuswahlKarte.getField("karten_nr").getValue(), typ: dfRatenAuswahlAnzeige.getField("raten").getValue(),
                                count: timeStamp
                            });

                        } else
                        {
                            hiddenForm.setErrors(_data.response.errors, true);
                            var _errors = hiddenForm.getErrors();
                            for (var i in _errors)
                            {
                                isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>");
                            }
                        }
                    }, {// Übergabe der Parameter
                        actionURL: "api/raten_up_down.php",
                        httpMethod: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        useSimpleHttp: true,
                        params: {typ: "up",
                            /*  monat: lgRaten.getRecord(1).monat,*/
                            monat: _Monat,
                            karten_nr: dfRatenAuswahlKarte.getField("karten_nr").getValue()}

                    }); //Ende RPC 
                }
            });
        } else
        {
            isc.say("Bitte eine Kreditkarte wählen!");
        }

    }});


isc.ToolStripButton.create({
    ID: "tsbRatenAdd",
    icon: "web/32/add.png",
    prompt: "Rate hinzufügen",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700,
    click: function ()
    {

        wdRatenAdd.show();
        dfRatenAdd.clearValues();
        pgbRatenAdd.setPercentDone(0);
        pgbRatenAdd.setHeight(13);
        pgbRatenAdd.setTitle("");
        dfRatenAdd.getField("karten_nr").setValue(dfRatenAuswahlKarte.getField("karten_nr").getValue());

    }
});

isc.ToolStripButton.create({
    ID: "tsbRatenEdit",
    title: "",
    icon: "web/32/pencil.png",
    prompt: "Rate editieren",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700,
    click: function ()
    {
        if (lgKreditKarten.getSelection().length == 1)
        {
            wdRatenEdit.show();
            pgbRatenEdit.setPercentDone(0);
            pgbRatenEdit.setHeight(13);
            pgbRatenEdit.setTitle("");
            var record = lgRaten.getSelectedRecord();
            dfRatenEdit.editRecord(record);
        } else
        {
            isc.say("Bitte erst einen Datensatz wählen!");
        }
        // dfKreditKartenEdit.getField("bezeichnung").setValue(record.bezeichnung);

    }
});

isc.ToolStripButton.create({
    ID: "tsbRatenDelete",
    icon: "web/32/delete.png",
    prompt: "Rate löschen",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700,
    click: function ()
    {

        if (lgRaten.getSelection().length === 0)
        {
            isc.say("Bitte erst einen Datensatz wählen!");
            return;
        }
        RPCManager.send("", function (rpcResponse, data, rpcRequest)
        {
            var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
            if (_data.response.status === 0)
            {  // Status 0 bedeutet Keine Fehler
                var timeStamp = new Date().getTime();
                var Ergebnis = _data.response.data["Ergebnis"];
                hiddenForm.getField("Ergebnis").setValue(Ergebnis);
                lgRaten.fetchData({karten_nr: dfRatenAuswahlKarte.getField("karten_nr").getValue(), typ: dfRatenAuswahlAnzeige.getField("raten").getValue(),
                    count: timeStamp
                });
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
            actionURL: "api/raten_delete.php",
            httpMethod: "POST",
            contentType: "application/x-www-form-urlencoded",
            useSimpleHttp: true,
            params: {ID: lgRaten.getSelectedRecord().ID}

        }); //Ende RPC 

    }
});

isc.ToolStripButton.create({
    ID: "tsbRatenDocAuswahl",
    prompt: "Abrechnung einblenden",
    icon: "web/32/cash_register.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700,
    click: function ()
    {
        wdRatenDocAuswahl.show();
    }
});

/*
 * *********************** ANFANG MENU *****************************************
 * -----------------------------------------------------------------------------
 */


isc.Menu.create({
    ID: "menuRaten",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    data: [
        {title: tsbRatenAdd.prompt, icon: tsbRatenAdd.icon, click: function ()
            {
                tsbRatenAdd.click();
            }},
        {title: tsbRatenEdit.prompt, icon: tsbRatenEdit.icon, click: function ()
            {
                tsbRatenEdit.click();
            }},
        {title: tsbRatenDelete.prompt, icon: tsbRatenDelete.icon, click: function ()
            {
                tsbRatenDelete.click();
            }},
        {isSeparator: true},
        {title: tsbRatenDocAuswahl.prompt, icon: tsbRatenDocAuswahl.icon, click: function ()
            {
                tsbRatenDocAuswahl.click();
            }},
        {isSeparator: true},
        {title: tsbRatenUp.prompt, icon: tsbRatenUp.icon, click: function ()
            {
                tsbRatenUp.click();
            }},
        {isSeparator: true},
        {title: tsbRatenDown.prompt, icon: tsbRatenDown.icon, click: function ()
            {
                tsbRatenDown.click();
            }}
    ]
});

isc.MenuButton.create({
    ID: "mbRaten",
    autoDraw: false,
    title: "Menü",
    width: 100,
    menu: menuRaten
});

/*
 * *************************** Layouts *****************************************
 * =============================================================================
 */


isc.HLayout.create({
    ID: "HLayoutRatenListeAbrech",
    height: "100%",
    width: "100%",
    align: "center",
    layoutMargin: 0,
    members: [lgRaten, wdRatenAbrechnung]});

isc.Label.create({
    padding: 0,
    ID: "lblRaten",
    width: 300,
    height: "100%",
    align: "center",
    contents: '<text style="color:' + titleLableColor + '; font-size:' + titleLableFontSize + '; font-family:' + titleLableFontFamily + '; text-decoration:none;">Raten</text>'
});


isc.ToolStrip.create({
    ID: "tsRaten",
    width: "100%",
    backgroundImage: "backgrounds/leaves.jpg",
    height: 40,
    members: [dfRatenAuswahlKarte, isc.LayoutSpacer.create({width: 10}),
        dfRatenAuswahlAnzeige, isc.LayoutSpacer.create({width: 10}),
        tsbRatenAdd, isc.LayoutSpacer.create({width: 10}),
        tsbRatenEdit, isc.LayoutSpacer.create({width: 10}),
        tsbRatenDelete, isc.LayoutSpacer.create({width: 10}),
        tsbRatenDocAuswahl, isc.LayoutSpacer.create({width: 10}),
        tsbRatenUp, isc.LayoutSpacer.create({width: 10}),
        tsbRatenDown, isc.LayoutSpacer.create({width: "*"}),
        lblRaten, isc.LayoutSpacer.create({width: 5})]
});

isc.VLayout.create({
    ID: "VLayoutRaten",
    height: "100%",
    width: "100%",
    members: [tsRaten, HLayoutRatenListeAbrech]
});


/*
 * *************************** Initialisierung *********************************
 * =============================================================================
 */



addNode("VLayoutRaten", {
    name: "VLayoutRaten",
    cat: "Finanzen",
    onOpen: function ()
    {
        lgRaten.contextMenu = menuRaten;
        setValue2Field(dfRatenAuswahlAnzeige, "raten", "A");
        wdRatenAbrechnung.hide();
        clearCharts('');
    },
    treenode: {
        Name: "VLayoutRaten",
        icon: "web/32/calendar_coin.png",
        title: "Kreditkarten-Raten",
        enabled: true
    },
    reflow: false
}
);




