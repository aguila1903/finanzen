/* 
 *
 * FINANZEN UMSÄTZE
 *  
 * Author: Suat Ekinci 
 * Copyright (c) 2020 Suat Ekinci 
 *
 * All rights reserved
 * 
 * PATCHES:
 * 
 */

var counterUmsatz = 0;
id_al = 0;
id_ald = 0;

/*
 * *********************** GoTo: FUNKTIONEN ************************************
 * =============================================================================
 */

var onRefresh = function (_listgrid, param)
{


    var dataSource = Canvas.getById(_listgrid).getDataSource();
    var request = {
        startRow: 0,
        endRow: (Canvas.getById(_listgrid).getVisibleRows()[1] + Canvas.getById(_listgrid).data.resultSize),
        sortBy: Canvas.getById(_listgrid).getSort(),
        showPrompt: false,
        params: {giroSpar: param

        }
    };
    var callback = function (dsResponse, data, dsRequest)
    {
        var resultSet = isc.ResultSet.create({
            dataSource: Canvas.getById(_listgrid).getDataSource(),
            initialLength: dsResponse.totalRows,
            initialData: dsResponse.data,
            sortSpecifiers: Canvas.getById(_listgrid).getSort()
        });
        Canvas.getById(_listgrid).setData(resultSet);
    };
    dataSource.fetchData(Canvas.getById(_listgrid).getCriteria(), callback, request);

};

var findRecord = function (_listgrid, ID)
{
    var cnt = 0;
    if (cnt <= 10)
    {
        if (!Array.isLoading(_listgrid.getRecord(0)))
        {
            var ds1 = _listgrid.data.find("ID", ID);
            var index1 = _listgrid.getRecordIndex(ds1);
            _listgrid.selectRecord(index1);
            _listgrid.scrollToRow(index1);
        } else
        {
            cnt++;
            isc.Timer.setTimeout(function ()
            {
                findRecord(_listgrid, ID);
            }, 500);
            console.log(cnt);
        }
    }
};


function uploadDocUmsaetze(_this)
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
                AusgabenListe.invalidateCache();
                isc.say(response);
            }
        } catch (err) {
            isc.say(err.message);
        }
        // Add the button to the file preview element.
        file.previewElement.appendChild(removeButtonUmsaetze);
    });
}
;

function initDropZoneUmsaetze()
{

    this.on("sending", function (file, xhr, formData)
    { // zusätzlich den mandanten mitschicken
//            var mandant = dfFibuAvise.getField("mandant").getValue();
//            formData.append("mandant", mandant);
    });
    removeButtonUmsaetze = Dropzone.createElement("<button class='remove-button'>Leeren</button>");
    this.on("drop", function (e)
    {
        e.preventDefault();
        e.stopPropagation();
        uploadDocUmsaetze(this);
    });
    this.on("addedfile", function (file)
    {
        uploadDocUmsaetze(this);
    });

    // Maximal nur 1 Datei erlaubt (maxFiles: 1 - dropzone.js) - Alles andere wird automatisch entfernt (Thumbnails)
    this.on("maxfilesexceeded", function (file)
    {
        this.removeFile(file);
        // Add the button to the file preview element.
        file.previewElement.appendChild(removeButtonUmsaetze);
    });

    _thisUms = this;
    // Listen to the click event
    removeButtonUmsaetze.addEventListener("click", function (e)
    {

        // Make sure the button click doesn't submit the form:
        e.preventDefault();
        e.stopPropagation();

        // Remove the file preview.
        _thisUms.removeFile(dropZoneUmsaetze.dropzone.files[0]);
        // If you want to the delete the file on the server as well,
        // you can do the AJAX request here.


//            delDocument("input_" + pdf_timestamp + ".pdf");

    });

    this.on("error", function (file, res)
    {
        isc.say(res);
        // Add the button to the file preview element.
        file.previewElement.appendChild(removeButtonUmsaetze);
    });
}

/*
 * ************************ GoTo: DataSources ************************
 */
isc.DataSource.create({
    ID: "ausgabenDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/ausgabenDS.php"
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
        }, {
            name: "monat",
            title: "Monat",
            type: "text"
        },
        {
            name: "einnahme",
            title: "Einnhame",
            type: "text"
        }, {
            name: "ausgabe",
            title: "Ausgabe",
            type: "text"
        }, {
            name: "differenz",
            type: "text"
        }
    ]});

isc.DataSource.create({
    ID: "ausgabenDetailsDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/ausgabenDetailsDS.php"
        }
    ]/*, transformResponse: function (dsResponse, dsRequest, jsonData)
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
     }*/,
    titleField: "text",
    fields: [
        {
            name: "ID",
            primaryKey: true
        }, {
            name: "datum",
            type: "date"
        },
        {
            name: "betrag",
            type: "text"
        }, {
            name: "herkunft",
            title: "Herkunft",
            type: "text"
        }, {
            name: "buchtext",
            title: "Buchungstext",
            type: "text"
        }, {
            name: "vorgang",
            title: "Vorgang",
            type: "text"
        }, {
            name: "kontonr",
            title: "Konto-Nr.",
            type: "text"
        }, {
            name: "einausgaben_id",
            type: "number"
        }, {
            name: "ref",
            type: "text"
        }
    ]});

isc.DataSource.create({
    ID: "kontenDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/kontenDS.php"
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
        }, {
            name: "kontonr",
            title: "Konto-Nr.",
            type: "text"
        },
        {
            name: "bezeichnung",
            title: "Bezeichnung",
            type: "text"
        }
    ]});


isc.DataSource.create({
    ID: "zahlmittelUmsaetzeDS",
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
        }
    ]});


isc.DataSource.create({
    ID: "kategorienDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/kategorienDS.php"
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
        }
    ]});


isc.DataSource.create({
    ID: "herkunftVorgangUmsDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/herkunftVorgangDS.php"
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
        }
    ]});

isc.DataSource.create({
    ID: "bundleUmsDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/bundleDS.php"
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
    ID: "htmlPaneDropZoneUmsaetze",
//    backgroundColor: "grey",
    styleName: "exampleTextBlock",
    contents: '<div id="dropzone"><form class="dropzone needsclick" id="dropZoneUmsaetze"> ' +
      '</form></div>'
});

Dropzone.options.dropZoneUmsaetze = {
    acceptedFiles: "application/vnd.ms-excel",
    url: "api/upload_umsaetze.php",
    method: "post",
    init: initDropZoneUmsaetze
};
//Dropzone.options.myAwesomeDropzone = {
//  acceptedFiles: "application/pdf" // The name that will be used to transfer the file
//
//};

/*
 * ****************** ENDE DropZone *****************************
 * --------------------------------------------------------------
 */



/*
 * ***************************** GoTo: Listen ************************************
 ---------------------------------------------------------------------------------
 */


/*
 * ******************* Ausgaben-Liste *******************************************
 * ------------------------------------------------------------------------------
 */
var AusgabenListeHilites =
  [
      {fieldName: "differenz",
          criteria: {
              fieldName: "differenz",
              operator: "greaterThan",
              value: 0
          },
          cssText: "color:green",
          id: 0
      },
      {fieldName: "differenz",
          criteria: {
              fieldName: "differenz",
              operator: "lessThan",
              value: 0
          },
          cssText: "color:red",
          id: 1
      }
  ];
isc.ListGrid.create({
    ID: "AusgabenListe",
    count: 0,
    //   header: "Daten bearbeiten",
    width: 370, height: "100%",
    alternateRecordStyles: true,
    dataSource: ausgabenDS,
    autoFetchData: true,
    showFilterEditor: false,
    filterOnKeypress: false,
    selectionType: "single",
    showAllRecords: true,
    canExpandRecords: false,
    expansionMode: "details",
    margin: 0,
    fields: [
        {
            name: "monat",
            width: "*",
            type: "date",
            title: "Monat",
            align: "center"
        },
        {
            name: "ausgabe",
            width: 80,
            title: "Ausgabe"
        }, {
            name: "einnahme",
            width: 80,
            title: "Einnahme",
            align: "right"
        }, {
            name: "differenz",
            width: 80,
            title: "Differenz",
            align: "right"
        }
    ], hilites: AusgabenListeHilites,
    selectionChanged: function (record, state)
    {

        AusgabenListeDetails.fetchData({monat: record.monat, giroSpar: dfKonten.getField("kontonr").getValue(), count: ++AusgabenListe.count});
        AusgabenListeDetails.getSum(record.monat);

    }/*, recordClick: function (record) {
     AusgabenListeDetails.fetchData({monat: record.monat, giroSpar: dfKonten.getField("kontonr").getValue(), count: ++AusgabenListe.count});
     }*/, dataArrived: function ()
    {
//        AusgabenListe.selectRecord(0);
    }
});


/*
 * ******************* AusgabenListe Details ***************************************************************************
 * ---------------------------------------------------------------------------------------------------------------------
 */
isc.ToolStrip.create({
    ID: "gridEditControls",
    width: "100%", height: 20,
    backgroundColor: "#E7F6FF",
    members: [
        isc.LayoutSpacer.create({width: "*"}),
        isc.Label.create({
            padding: 2,
            ID: "totalsLabel",
            align: "center",
            width: "100%"
        })

    ]
});
/*
 * hiliting
 
 */
iHTML = isc.Canvas.imgHTML("icons/16/message.png") + " ";
var hiliteArray =
  [
      {fieldName: "betrag",
          criteria: {
              fieldName: "betrag",
              operator: "greaterThan",
              value: 0
          },
          cssText: "color:green",
          id: 0
      },
      {fieldName: "betrag",
          criteria: {
              fieldName: "betrag",
              operator: "lessThan",
              value: 0
          },
          cssText: "color:red",
          id: 1
      }
  ];
isc.ListGrid.create({
    ID: "AusgabenListeDetails",
    //   header: "Daten bearbeiten",
    width: "100%", height: "100%",
    alternateRecordStyles: true,
    dataSource: ausgabenDetailsDS,
    autoFetchData: false,
    showFilterEditor: true,
    filterOnKeypress: true,
//    baseStyle: "myOtherGridCell",
    fetchDelay: 500,
    selectionType: "multi",
    showAllRecords: true,
    canExpandRecords: false,
    expansionMode: "details",
    margin: 0,
    sortField: "datum",
    showGridSummary: true,
    fields: [
        {
            name: "ref",
            type: "image",
            imageURLPrefix: "web/16/",
            imageURLSuffix: ".png",
            align: "center",
            showTitle: false,
            width: 30
        },
        {
            name: "datum",
            width: 70,
            title: "Datum",
            align: "center"
        }, {
            name: "betrag",
            width: 80,
            title: "Betrag",
            align: "right",
//            showGridSummary: true, showGroupSummary: true,
//            recordSummaryFunction: "multiplier",
//            summaryFunction: "sum",
            formatCellValue: function (value)
            {
                if (isc.isA.Number(value))
                {
                    return value.toLocalizedString();
                }
                return value;
            }
        },
        {
            name: "vorgang",
            width: "*",
            title: "Vorgang"
        },
        {
            name: "buchtext",
            width: 250,
            title: "Buchungstext"
        }, {
            name: "herkunft",
            width: 350,
            title: "Herkunft"
        }
    ],
    gridComponents: ["filterEditor", "header", "body", gridEditControls/*, "summaryRow"*/],
    getSum: function (/*monat*/)
    {
//        RPCManager.send("", function (rpcResponse, data, rpcRequest)
//        {
//            var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
//            var summeUmsaetze = _data.response.data["summeUmsaetze"];
//            var totalRows = _data.response.data["anzahl"];
//            var _errors = _data.response.errors;
//
//            if (_data.response.status !== 0)
//            {
//                isc.say(_errors);
//            } else
//            {
//
//                var labelContent = '<table><tr style="width:100%; color:' + gridComponentsLabelColor + '; font-size:' + gridComponentsLabelFontSize + '; font-family:' + gridComponentsLabelFontFamily + '; text-decoration:none;"><td width="200">' + totalRows + " Datensätze" + '</td><td width="80%"></td><td width="300" align="right">Summe: ' + summeUmsaetze + " €" + '</td></tr></table>';
//                totalsLabel.setContents(labelContent);
//            }
//        }, {// Übergabe der Parameter
//            actionURL: "api/ds/summeUmsaetzeDS.php",
//            httpMethod: "POST",
//            contentType: "application/x-www-form-urlencoded",
//            useSimpleHttp: true,
//            params: {
//                monat: monat,
//                kontonr: dfKonten.getField("kontonr").getValue()}
//        }); //Ende RPC

        var aData = AusgabenListeDetails.getData().localData;
        var laenge = aData.length;
        var summe = 0;
        var betrag = 0;
        for (i = 0; i < laenge; i++)
        {
            betrag = aData[i].betrag;
            betrag = betrag.replace(/\./g, "");
            betrag = betrag.replace(/,/g, ".");
            betrag = parseFloat(betrag);
            summe = summe + betrag;
        }
        var totalRows = AusgabenListeDetails.getTotalRows();
        var labelContent = '<table><tr style="width:100%; color:' + gridComponentsLabelColor + '; font-size:' + gridComponentsLabelFontSize + '; font-family:' + gridComponentsLabelFontFamily + '; text-decoration:none;"><td width="200">' + summe.toLocalizedString(2, ',', '.', '-') + " €" + '</td><td width="80%"></td><td width="300" align="right">' + totalRows + ' Vorgänge</td></tr></table>';
        totalsLabel.setContents(labelContent);

    }, recordDoubleClick: function (viewer, record, recordNum, field, fieldNum, value, rawValue)
    {
        wdUmsaetzeEdit.show();
        dfUmsaetzeEdit.editRecord(record);
    }, dataChanged: function ()
    {
        isc.Timer.setTimeout("AusgabenListeDetails.getSum()", 500);

    }, hilites: hiliteArray
});

isc.HLayout.create({
    ID: "HLayout_Umsaetze",
    height: "100%",
    width: "100%",
    count: 0,
    align: "center",
    layoutMargin: 0,
    margin: 0,
    members: [AusgabenListe, AusgabenListeDetails]});



isc.DynamicForm.create({
    ID: "dfKonten",
    monCnt: 0,
    width: 100,
    height: 10,
    numCols: 2,
    titleOrientation: "left",
    margin: 0,
    fields: [{
            name: "kontonr",
            title: "Konto",
            width: 150,
            optionDataSource: kontenDS,
            valueField: "kontonr",
            displayField: "bezeichnung",
//            defaultValue: "Konto wählen",
            pickListProperties: {showShadow: false, showFilterEditor: false, showHeader: false},
            pickListWidth: 350,
            pickListFields: [
                {name: "bezeichnung", width: 140}, {name: "kontonr", width: 200}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    count: ++dfKonten.monCnt};
                return filter;
            },
            type: "select",
            changed: function (form, item, value)
            {
                form.monCnt++;
                AusgabenListe.fetchData({count: ++form.monCnt, giroSpar: value});
                isc.Timer.setTimeout("AusgabenListe.selectRecord(0)", 200);
//                              AusgabenListeDetails.fetchData({monat: record.monat, giroSpar: dfKonten.getField("giroSpar").getValue(), count: taksitListe.count});

            }
        }]});


/*
 * GoTo: ************************ Daten editieren ******************************
 * =============================================================================
 */


isc.DynamicForm.create({
    ID: "dfUmsaetzeEdit",
    monCnt: 0,
    width: 100,
    height: 10,
    numCols: 2,
    titleOrientation: "left",
    margin: 10,
    fields: [{
            name: "ID",
            title: "ID",
            type: "hidden"
        }, {
            name: "kontonr",
            title: "Konto",
            width: 150,
            optionDataSource: kontenDS,
            valueField: "kontonr",
            displayField: "bezeichnung",
            required: true,
//            defaultValue: "Konto wählen",
            pickListProperties: {showShadow: false, showFilterEditor: false, showHeader: false},
            pickListWidth: 350,
            pickListFields: [
                {name: "bezeichnung", width: 140}, {name: "kontonr", width: 200}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    count: ++dfKonten.monCnt};
                return filter;
            },
            type: "select",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernUmsaetzeEdit, btnResetUmsaetzeEdit, btnCloseUmsaetzeEdit);
            }
        }, {
            name: "datum",
            title: "Datum",
            type: "date",
            required: true,
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernUmsaetzeEdit, btnResetUmsaetzeEdit, btnCloseUmsaetzeEdit);
            }
        }, {
            name: "buchtext",
            title: "Buchungstext",
            width: 300,
            type: "text",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernUmsaetzeEdit, btnResetUmsaetzeEdit, btnCloseUmsaetzeEdit);
            }
        }, {
            name: "vorgang",
            title: "Vorgang",
            width: 300,
            required: true,
            type: "text",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernUmsaetzeEdit, btnResetUmsaetzeEdit, btnCloseUmsaetzeEdit);
            }
        }, {
            name: "herkunft",
            title: "Herkunft",
            width: 300,
            type: "text",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernUmsaetzeEdit, btnResetUmsaetzeEdit, btnCloseUmsaetzeEdit);
            }
        }, {
            name: "betrag",
            title: "Betrag",
            width: 150,
            type: "text",
            required: true,
            keyPressFilter: "[-0-9,.]",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernUmsaetzeEdit, btnResetUmsaetzeEdit, btnCloseUmsaetzeEdit);
            }
        }
    ]});

isc.IButton.create({
    ID: "btnCloseUmsaetzeEdit",
    type: "button",
    disabled: false,
    icon: "famfam/door_in.png",
    name: "btnCloseUmsaetzeEdit",
    showDisabledIcon: false,
    title: "Schließen", width: 100, //Neuen Film anlegen
    click: function ()
    {
        if (btnCloseUmsaetzeEdit.getTitle() == "Abbrechen")
        {
            isc.ask("Wollen Sie wirklich abbrechen? Nicht gespeicherte Daten könnten verloren gehen.", function (value)
            {
                if (value)
                {
                    wdUmsaetzeEdit.hide();
                }
            }, {title: "Vorgang abbrechen?"});
        } else
        {
            wdUmsaetzeEdit.hide();
        }
    }});
/*
 * ************************* Speicher-Prozedur Edit Umsatz **********************
 */
isc.IButton.create({
    ID: "btnSpeichernUmsaetzeEdit",
    type: "button",
    disabled: true,
    count: 0,
    showDisabledIcon: false,
    icon: "famfam/database_save.png",
    name: "btnSpeichernUmsaetzeEdit",
    title: "Speichern",
    width: 100, //Neuen Film anlegen
    click: function ()
    {
        if (AusgabenListeDetails.getSelection().length == 1)
        {
            if (dfUmsaetzeEdit.validate())
            {
                id_ald = dfUmsaetzeEdit.getField("ID").getValue();
                id_al = AusgabenListe.getSelectedRecord().ID;
                RPCManager.send("", function (rpcResponse, data, rpcRequest)
                {
                    var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                    if (_data.response.status === 0)
                    {  // Status 0 bedeutet Keine Fehler

//                        AusgabenListeDetails.invalidateCache();
                        AusgabenListe.invalidateCache();
                        findRecord(AusgabenListe, id_al);
                        if (!dfUmsaetzeEdit.validate() && dfUmsaetzeEdit.hasErrors())
                        {
                            dfUmsaetzeEdit.setErrors();
                            var _errors = dfUmsaetzeEdit.getErrors();
                            for (var i in _errors)
                            {
                                isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>"); // Hier wird jeder Wert des Array-Schlüssel angezeigt und das Feld oder die Feld-Bezeichnung ist irrelevant.
                            }
                        } else
                        {
                            isc.say("Datensatz wurde erfolgreich editiert.", function (value)
                            {
                                if (value)
                                {
                                    isc.Timer.setTimeout("btnSpeichernUmsaetzeEdit.isLoadingUmsatzTimer()", 150);
                                    btnCloseUmsaetzeEdit.setTitle("Schließen");
                                    btnCloseUmsaetzeEdit.setIcon("famfam/door_in.png");
                                    btnResetUmsaetzeEdit.setDisabled(true);
                                    btnSpeichernUmsaetzeEdit.setDisabled(true);
                                    wdUmsaetzeEdit.hide();
                                }

                            }, {title: "Datensatz bearbeitet"});
                        }
                    } else
                    { // Wenn die Validierungen Fehler aufweisen dann:

                        dfUmsaetzeEdit.setErrors(_data.response.errors, true);
                        var _errors = dfUmsaetzeEdit.getErrors();
                        for (var i in _errors)
                        {
                            isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>");
                        }

                    }
                }, {// Übergabe der Parameter
                    actionURL: "api/umsatz_edit.php",
                    httpMethod: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    useSimpleHttp: true,
                    params: {
                        ID: id_ald,
                        betrag: dfUmsaetzeEdit.getField("betrag").getValue(),
                        vorgang: dfUmsaetzeEdit.getField("vorgang").getValue(),
                        herkunft: dfUmsaetzeEdit.getField("herkunft").getValue(),
                        buchtext: dfUmsaetzeEdit.getField("buchtext").getValue(),
                        datum: dfUmsaetzeEdit.getField("datum").getValue(),
                        kontonr: dfUmsaetzeEdit.getField("kontonr").getValue()}

                }); //Ende RPC
            } else
            {
                isc.say("Bitte erst alle benötigten Felder ausfüllen");
            }
        } else
        {
            isc.say("Bitte erst einen Datensatz wählen");
        }
    }, // Ende Click
    isLoadingUmsatzTimer: function ()
    {
        if (!Array.isLoading(AusgabenListeDetails.getRecord(0)))
        {

        }
    }
});
isc.IButton.create({
    ID: "btnResetUmsaetzeEdit",
    type: "button",
    showDisabledIcon: false,
    icon: "famfam/arrow_undo.png",
    disabled: true,
    name: "btnResetUmsaetzeEdit",
    title: "Reset", width: 100, //Neuen Film anlegen
    click: function ()
    {
        dfUmsaetzeEdit.reset();
        btnSpeichernUmsaetzeEdit.setDisabled(true);
        btnResetUmsaetzeEdit.setDisabled(true);
        btnCloseUmsaetzeEdit.setTitle("Schließen");
        btnCloseUmsaetzeEdit.setIcon("famfam/door_in.png");
    }});
isc.HLayout.create({
    ID: "HLayoutKundeEdit",
    height: 30,
    width: "100%",
    align: "center",
    members: [btnCloseUmsaetzeEdit, isc.LayoutSpacer.create({
            width: 20
        }), btnSpeichernUmsaetzeEdit, isc.LayoutSpacer.create({
            width: 20
        }), btnResetUmsaetzeEdit]});

currentIcon = "famfam/sum.png";
isc.Window.create({
    ID: "wdUmsaetzeEdit",
    width: 500,
    height: 300,
    title: "Umsatz bearbeiten",
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
    items: [dfUmsaetzeEdit, isc.LayoutSpacer.create({
            height: 20
        }), HLayoutKundeEdit]});

isc.ToolStripButton.create({
    ID: "tsbUmsaetzeEdit",
    count: 1,
    action: function ()
    {
        if (AusgabenListeDetails.getSelection().length == 1)
        {
            var record = AusgabenListeDetails.getSelectedRecord();
            wdUmsaetzeEdit.show();
            dfUmsaetzeEdit.editRecord(record);
        } else
        {
            isc.say("Bitte erst einen Datensatz wählen");
        }
    },
    prompt: "Datensatz editieren",
    icon: "web/32/pencil.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700
});


/*
 * GoTo: ************************ Daten hinzufügen ******************************
 * =============================================================================
 */


isc.DynamicForm.create({
    ID: "dfUmsaetzeAdd",
    monCnt: 0,
    width: 100,
    height: 10,
    numCols: 2,
    titleOrientation: "left",
    margin: 10,
    fields: [{
            name: "kontonr",
            title: "Konto",
            width: 150,
            optionDataSource: kontenDS,
            valueField: "kontonr",
            displayField: "bezeichnung",
            required: true,
//            defaultValue: "Konto wählen",
            pickListProperties: {showShadow: false, showFilterAddor: false, showHeader: false},
            pickListWidth: 350,
            pickListFields: [
                {name: "bezeichnung", width: 140}, {name: "kontonr", width: 200}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    count: ++dfKonten.monCnt};
                return filter;
            },
            type: "select",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernUmsaetzeAdd, btnResetUmsaetzeAdd, btnCloseUmsaetzeAdd);
            }
        }, {
            name: "datum",
            title: "Datum",
            type: "date",
            required: true,
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernUmsaetzeAdd, btnResetUmsaetzeAdd, btnCloseUmsaetzeAdd);
            }
        }, {
            name: "buchtext",
            title: "Buchungstext",
            width: 300,
            type: "text",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernUmsaetzeAdd, btnResetUmsaetzeAdd, btnCloseUmsaetzeAdd);
            }
        }, {
            name: "vorgang",
            title: "Vorgang",
            width: 300,
            required: true,
            type: "text",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernUmsaetzeAdd, btnResetUmsaetzeAdd, btnCloseUmsaetzeAdd);
            }
        }, {
            name: "herkunft",
            title: "Herkunft",
            width: 300,
            type: "text",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernUmsaetzeAdd, btnResetUmsaetzeAdd, btnCloseUmsaetzeAdd);
            }
        }, {
            name: "betrag",
            title: "Betrag",
            width: 150,
            type: "text",
            required: true,
            keyPressFilter: "[-0-9,.]",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernUmsaetzeAdd, btnResetUmsaetzeAdd, btnCloseUmsaetzeAdd);
            }
        }
    ]});

isc.IButton.create({
    ID: "btnCloseUmsaetzeAdd",
    type: "button",
    disabled: false,
    icon: "famfam/door_in.png",
    name: "btnCloseUmsaetzeAdd",
    showDisabledIcon: false,
    title: "Schließen", width: 100,
    click: function ()
    {
        if (btnCloseUmsaetzeAdd.getTitle() == "Abbrechen")
        {
            isc.ask("Wollen Sie wirklich abbrechen? Nicht gespeicherte Daten könnten verloren gehen.", function (value)
            {
                if (value)
                {
                    wdUmsaetzeAdd.hide();
                }
            }, {title: "Vorgang abbrechen?"});
        } else
        {
            wdUmsaetzeAdd.hide();
        }
    }});
/*
 * ************************* Speicher-Prozedur Add Umsatz **********************
 */
isc.IButton.create({
    ID: "btnSpeichernUmsaetzeAdd",
    type: "button",
    disabled: true,
    count: 0,
    showDisabledIcon: false,
    icon: "famfam/database_save.png",
    name: "btnSpeichernUmsaetzeAdd",
    title: "Speichern",
    width: 100,
    click: function ()
    {
        if (dfUmsaetzeAdd.validate())
        {
            id_al = AusgabenListe.getSelectedRecord().ID;
            RPCManager.send("", function (rpcResponse, data, rpcRequest)
            {
                var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                id_ald = _data.response.data["ID"];
                if (_data.response.status === 0)
                {  // Status 0 bedeutet Keine Fehler


                    AusgabenListe.invalidateCache();
                    findRecord(AusgabenListe, id_al);

                    if (!dfUmsaetzeAdd.validate() && dfUmsaetzeAdd.hasErrors())
                    {
                        dfUmsaetzeAdd.setErrors();
                        var _errors = dfUmsaetzeAdd.getErrors();
                        for (var i in _errors)
                        {
                            isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>"); // Hier wird jeder Wert des Array-Schlüssel angezeigt und das Feld oder die Feld-Bezeichnung ist irrelevant.
                        }
                    } else
                    {
                        isc.say("Datensatz wurde erfolgreich eingefügt.", function (value)
                        {
                            if (value)
                            {
                                isc.Timer.setTimeout("btnSpeichernUmsaetzeAdd.isLoadingUmsatzTimer()", 150);
                                resetButtons(btnSpeichernUmsaetzeAdd, btnResetUmsaetzeAdd, btnCloseUmsaetzeAdd);
                                wdUmsaetzeAdd.hide();
                            }

                        }, {title: "Datensatz einfügen"});
                    }

                    //                                isc.say(id_ald);


                } else
                { // Wenn die Validierungen Fehler aufweisen dann:

                    dfUmsaetzeAdd.setErrors(_data.response.errors, true);
                    var _errors = dfUmsaetzeAdd.getErrors();
                    for (var i in _errors)
                    {
                        isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>");
                    }

                }
            }, {// Übergabe der Parameter
                actionURL: "api/umsatz_add.php",
                httpMethod: "POST",
                contentType: "application/x-www-form-urlencoded",
                useSimpleHttp: true,
                params: {
                    betrag: dfUmsaetzeAdd.getField("betrag").getValue(),
                    vorgang: dfUmsaetzeAdd.getField("vorgang").getValue(),
                    herkunft: dfUmsaetzeAdd.getField("herkunft").getValue(),
                    buchtext: dfUmsaetzeAdd.getField("buchtext").getValue(),
                    datum: dfUmsaetzeAdd.getField("datum").getValue(),
                    kontonr: dfUmsaetzeAdd.getField("kontonr").getValue()}

            }); //Ende RPC
        } else
        {
            isc.say("Bitte erst alle benötigten Felder ausfüllen");
        }

    }, // Ende Click
    isLoadingUmsatzTimer: function ()
    {
        if (!Array.isLoading(AusgabenListeDetails.getRecord(0)))
        {
//            isc.Timer.setTimeout("btnSpeichernUmsaetzeAdd.findNewUmsatz()", 150);
        }
    }
});
isc.IButton.create({
    ID: "btnResetUmsaetzeAdd",
    type: "button",
    showDisabledIcon: false,
    icon: "famfam/arrow_undo.png",
    disabled: true,
    name: "btnResetUmsaetzeAdd",
    title: "Reset", width: 100,
    click: function ()
    {
        dfUmsaetzeAdd.reset();
        resetButtons(btnSpeichernUmsaetzeAdd, btnResetUmsaetzeAdd, btnCloseUmsaetzeAdd);
    }});
isc.HLayout.create({
    ID: "HLayoutUmsatzAdd",
    height: 30,
    width: "100%",
    align: "center",
    members: [btnCloseUmsaetzeAdd, isc.LayoutSpacer.create({
            width: 20
        }), btnSpeichernUmsaetzeAdd, isc.LayoutSpacer.create({
            width: 20
        }), btnResetUmsaetzeAdd]});

currentIcon = "famfam/sum.png";
isc.Window.create({
    ID: "wdUmsaetzeAdd",
    width: 500,
    height: 300,
    title: "Umsätze",
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
    items: [dfUmsaetzeAdd, isc.LayoutSpacer.create({
            height: 20
        }), HLayoutUmsatzAdd]});

isc.ToolStripButton.create({
    ID: "tsbUmsaetzeAdd",
    count: 1,
    action: function ()
    {
        wdUmsaetzeAdd.show();
        btnResetUmsaetzeAdd.click();
        dfUmsaetzeAdd.getField("kontonr").setValue(dfKonten.getField("kontonr").getValue());
    },
    prompt: "Neuen Datensatz anlegen",
    icon: "web/32/add.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700
});

/*
 * GoTo: *************************** Lösche DS *********************************
 * =============================================================================
 */

isc.ToolStripButton.create({
    ID: "tsbUmsaetzeDelete",
    count: 1,
    action: function ()
    {
        if (AusgabenListeDetails.getSelection().length == 1)
        {
            isc.ask("Wollen Sie wirklich den ausgewählten Datensatz löschen?", function (value)
            {
                if (value)
                {
                    id_ald = AusgabenListeDetails.getSelectedRecord().ID;
                    RPCManager.send("", function (rpcResponse, data, rpcRequest)
                    {
                        var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                        if (_data.response.status === 0)
                        {  // Status 0 bedeutet Keine Fehler

                            isc.say("Datensatz wurde erfolgreich gelöscht.");
                            AusgabenListe.invalidateCache();

                        } else
                        { // Wenn die Validierungen Fehler aufweisen dann:
                            var _errors = _data.response.errors;
                            isc.say("<b>Fehler! </br>" + _errors + "</b>");
                        }
                    }, {// Übergabe der Parameter
                        actionURL: "api/umsatz_delete.php",
                        httpMethod: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        useSimpleHttp: true,
                        params: {
                            ID: id_ald}

                    }); //Ende RPC   
                }
            });

        } else
        {
            isc.say("Bitte erst einen Datensatz wählen");
        }
    },
    prompt: "Löscht den ausgewählten Datensatz",
    icon: "web/32/delete.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700
});

/*
 * *************************** Kategorien **************************************
 * =============================================================================
 */


isc.DynamicForm.create({
    ID: "dfKategorien",
    monCnt: 0,
    width: "100%",
    height: "100%",
    count: 0,
    colWidths: [150, "*"],
    numCols: 2,
    titleOrientation: "left",
    validateOnExit: true,
    validateOnChange: false,
    margin: 5,
    fields: [{
            name: "art",
            title: "Kategorie-Art",
            width: 300,
            required: true,
            type: "radioGroup",
            redrawOnChange: true,
            vertical: false,
            valueMap: {"A": "Ausgabe", "E": "Einnahme"},
            defaultValue: "A",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
            }
        }, {
            name: "typ",
            title: "Kategorie-Typ",
            width: 300,
            required: true,
            type: "radioGroup",
            redrawOnChange: true,
            vertical: false,
            valueMap: {"V": "Variabel", "F": "Fix"},
            defaultValue: "V",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
                if (value == "F")
                {
                    dfKategorien.getField("interval").show();
                    dfKategorien.getField("detail").setDisabled(false);
//                    dfKategorien.getField("dauer").show();
                }
                if (value == "V")
                {
                    dfKategorien.getField("interval").hide();
                    dfKategorien.getField("detail").setDisabled(true);
                    dfKategorien.getField("detail").setValue("N");
//                    dfKategorien.getField("dauer").hide();
                }

            }
        }, {
            type: "RowSpacer",
            height: 10
        }, {
            name: "kontonr",
            title: "Konto",
            width: 150,
            optionDataSource: kontenDS,
            valueField: "kontonr",
            displayField: "bezeichnung",
            required: true,
//            defaultValue: "Konto wählen",
            pickListProperties: {showShadow: false, showFilterAddor: false, showHeader: false},
            pickListWidth: 350,
            pickListFields: [
                {name: "bezeichnung", width: 140}, {name: "kontonr", width: 200}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    count: ++dfKonten.monCnt};
                return filter;
            },
            type: "select",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernUmsaetzeAdd, btnResetUmsaetzeAdd, btnCloseUmsaetzeAdd);
            }
        }, {
            name: "kategorien",
            title: "Kategorien",
            width: 200,
            optionDataSource: kategorienDS,
            valueField: "ID",
            displayField: "bezeichnung",
            required: true,
//            defaultValue: "Konto wählen",
            pickListProperties: {showShadow: false, showFilterAddor: false, showHeader: false},
            pickListWidth: 210,
            pickListFields: [
                {name: "bezeichnung", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    typ: dfKategorien.getField("typ").getValue(), art: dfKategorien.getField("art").getValue(), count: ++dfKategorien.monCnt
                };
                return filter;
            },
            type: "select",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
            }, icons: [{
                    src: "web/16/add.png",
                    name: "icoKategorieAdd",
                    width: 16,
                    height: 16,
                    prompt: "Neue Kategorie hinzufügen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        wdStammKategorienAdd.show();
                        btnResetStammKategorienAdd.click();
                    }
                }]
        }, {
            name: "interval",
            title: "Intervall",
            width: 200,
            required: true,
            type: "select",
            redrawOnChange: true,
            vertical: false,
            valueMap: {"M": "monatlich", "Y": "jährlich", /*"W": "wöchentlich", "T": "täglich",*/ "Q": "quartalsweise"},
            defaultValue: "M",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
//                if (value == "M")
//                {
//                    form.getField("dauer").title = "Dauer in Monaten";
//                } else if (value == "Y")
//                {
//                    form.getField("dauer").title = "Dauer in Jahren";
//                } else if (value == "W")
//                {
//                    form.getField("dauer").title = "Dauer in Wochen";
//                } else if (value == "T")
//                {
//                    form.getField("dauer").title = "Dauer in Tagen";
//                } else if (value == "Q")
//                {
//                    form.getField("dauer").title = "Quartalsweise Dauer";
//                }
            }
        }, {
            name: "datum",
            title: "Datum",
            type: "date",
            required: true,
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
            }
        }, {
            name: "enddatum",
            title: "Enddatum",
            type: "date",
            required: true,
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
            }
        }, {
            name: "vorgang",
            title: "Vorgang",
            width: 300,
            required: true,
            type: "comboBox",
            optionDataSource: herkunftVorgangUmsDS,
            valueField: "bezeichnung",
            displayField: "bezeichnung",
            pickListProperties: {showShadow: false, showFilterAddor: false, showHeader: false},
            pickListWidth: 300,
            pickListFields: [
                {name: "bezeichnung", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    count: ++dfKonten.monCnt, f: this.name, value: dfKategorien.getField(this.name).getValue()};
                return filter;
            },
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
            }, icons: [{
                    src: "web/16/delete.png",
                    name: "icoKategorieAdd",
                    width: 16,
                    height: 16,
                    prompt: "Feldinhalt löschen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfKategorien.getField("vorgang").clearValue();
                        changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
                    }
                }]
        }, {
            name: "herkunft",
            title: "Herkunft",
            width: 300,
            required: true,
            type: "comboBox",
            optionDataSource: herkunftVorgangUmsDS,
            valueField: "bezeichnung",
            displayField: "bezeichnung",
            pickListProperties: {showShadow: false, showFilterAddor: false, showHeader: false},
            pickListWidth: 300,
            pickListFields: [
                {name: "bezeichnung", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    count: ++dfKonten.monCnt, f: this.name, value: dfKategorien.getField(this.name).getValue(), konto: dfKategorien.getField("kontonr").getValue()};
                return filter;
            },
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);

            }, icons: [{
                    src: "web/16/delete.png",
                    name: "icoKategorieAdd",
                    width: 16,
                    height: 16,
                    prompt: "Feldinhalt löschen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfKategorien.getField("herkunft").clearValue();
                        changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
                    }
                }]
        }, {
            name: "zahlungsmittel_id",
            title: "Zahlungsmittel",
            width: 300,
            required: false,
            type: "comboBox",
            optionDataSource: zahlmittelUmsaetzeDS,
            valueField: "ID",
            displayField: "bezeichnung",
            pickListProperties: {showShadow: false, showFilterAddor: false, showHeader: false},
            pickListWidth: 300,
            pickListFields: [
                {name: "bezeichnung", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    count: ++dfKategorien.monCnt, value: dfKategorien.getField(this.name).getDisplayValue()};
                return filter;
            },
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
            }, icons: [{
                    src: "web/16/delete.png",
                    name: "icoKategorieAdd",
                    width: 16,
                    height: 16,
                    prompt: "Feldinhalt löschen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfEinAusgaben.getField("zahlungsmittel_id").clearValue();
                        changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
                    }
                }]
        }, {
            name: "betrag",
            title: "Betrag",
            width: 150,
            type: "text",
            required: true,
            keyPressFilter: "[-0-9,.]",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
            }
        }, {
            type: "RowSpacer",
            height: 10
        }, {
            name: "kommentar",
            title: "Kommentar",
            width: 280,
            height: 60,
            type: "textArea",
            required: false,
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
            }
        }, {
            name: "detail",
            title: "Detail",
            width: 150,
            type: "radioGroup",
            valueMap: {"N": "Nein", "J": "Ja"},
            defaultValue: "N",
            required: false,
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
                if (value == "J")
                {
                    dfKategorien.getField("dauer").show();
                } else
                {
                    dfKategorien.getField("dauer").hide();
                }
            }
        },
        {
            name: "dauer",
            title: "Dauer in Monaten",
            defaultValue: 1,
            editorType: "SpinnerItem",
            min: 1, max: 9999, step: 1, wrapTitle: false,
            writeStackedIcons: false,
            keyPressFilter: "[0-9,]",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
            }
        }, {
            name: "bundle",
            title: "Einkauf",
            width: 300,
            required: false,
            type: "comboBox",
            optionDataSource: bundleUmsDS,
            valueField: "bezeichnung",
            displayField: "bezeichnung",
            pickListProperties: {showShadow: false, showFilterAddor: false, showHeader: false},
            pickListWidth: 300,
            pickListFields: [
                {name: "bezeichnung", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    count: ++dfKategorien.monCnt, value: dfKategorien.getField(this.name).getValue()};
                return filter;
            },
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
            }, icons: [{
                    src: "web/16/delete.png",
                    name: "bundle",
                    width: 16,
                    height: 16,
                    prompt: "Feldinhalt löschen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfKategorien.getField("bundle").clearValue();
                        changeFunction(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
                    }
                }]
        }
    ]});

isc.IButton.create({
    ID: "btnCloseKategorien",
    type: "button",
    disabled: false,
    icon: "famfam/door_in.png",
    name: "btnCloseKategorien",
    showDisabledIcon: false,
    title: "Schließen", width: 100,
    click: function ()
    {
        if (btnCloseKategorien.getTitle() == "Abbrechen")
        {
            isc.ask("Wollen Sie wirklich abbrechen? Nicht gespeicherte Daten könnten verloren gehen.", function (value)
            {
                if (value)
                {
                    wdKategorien.hide();
                }
            }, {title: "Vorgang abbrechen?"});
        } else
        {
            wdKategorien.hide();
        }
    }});
/*
 * ************************* Speicher-Prozedur Add Umsatz **********************
 */
isc.IButton.create({
    ID: "btnSpeichernKategorien",
    type: "button",
    disabled: true,
    count: 0,
    showDisabledIcon: false,
    icon: "famfam/database_save.png",
    name: "btnSpeichernKategorien",
    title: "Speichern",
    width: 100,
    click: function ()
    {
        id_al = AusgabenListe.getSelectedRecord().ID;
        id_ald = AusgabenListeDetails.getSelectedRecord().ID;
        if (dfKategorien.validate())
        {
            RPCManager.send("", function (rpcResponse, data, rpcRequest)
            {
                var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)

                if (_data.response.status === 0)
                {  // Status 0 bedeutet Keine Fehler
//                    umsatzKat_id = _data.response.data["ID"];
                    if (!dfKategorien.validate() && dfKategorien.hasErrors())
                    {
                        dfKategorien.setErrors();
                        var _errors = dfKategorien.getErrors();
                        for (var i in _errors)
                        {
                            isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>"); // Hier wird jeder Wert des Array-Schlüssel angezeigt und das Feld oder die Feld-Bezeichnung ist irrelevant.
                        }
                    } else
                    {
//                        AusgabenListeDetails.invalidateCache();
                        AusgabenListe.invalidateCache();
                        findRecord(AusgabenListe, id_al);

                        isc.say("Datensatz wurde erfolgreich eingefügt.", function (value)
                        {
                            if (value)
                            {
                                resetButtons(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
                                wdKategorien.hide();

                            }

                        }, {title: "Datensatz einfügen"});
                    }

                } else
                { // Wenn die Validierungen Fehler aufweisen dann:

                    dfKategorien.setErrors(_data.response.errors, true);
                    var _errors = dfKategorien.getErrors();
                    for (var i in _errors)
                    {
                        isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>");
                    }

                }
            }, {// Übergabe der Parameter
                actionURL: "api/umsatz_kategorie_add.php",
                httpMethod: "POST",
                contentType: "application/x-www-form-urlencoded",
                useSimpleHttp: true,
                params: {
                    betrag: dfKategorien.getField("betrag").getValue(),
                    art: dfKategorien.getField("art").getValue(),
                    typ: dfKategorien.getField("typ").getValue(),
                    kontonr: dfKategorien.getField("kontonr").getValue(),
                    datum: dfKategorien.getField("datum").getValue(),
                    enddatum: dfKategorien.getField("enddatum").getValue(),
                    vorgang: dfKategorien.getField("vorgang").getValue(),
                    herkunft: dfKategorien.getField("herkunft").getValue(),
                    bundle: dfKategorien.getField("bundle").getValue(),
                    interval: dfKategorien.getField("interval").getValue(),
                    dauer: dfKategorien.getField("dauer").getValue(),
                    detail: dfKategorien.getField("detail").getValue(),
                    kommentar: dfKategorien.getField("kommentar").getValue(),
                    zahlungsmittel: dfKategorien.getField("zahlungsmittel_id").getValue(),
                    umsatz_id: AusgabenListeDetails.getSelectedRecord().ID,
                    kategorie_id: dfKategorien.getField("kategorien").getValue()
                }

            }); //Ende RPC
        } else
        {
            isc.say("Bitte erst alle benötigten Felder ausfüllen");
        }

    } // Ende Click
});
isc.IButton.create({
    ID: "btnResetKategorien",
    type: "button",
    showDisabledIcon: false,
    icon: "famfam/arrow_undo.png",
    disabled: true,
    name: "btnResetKategorien",
    title: "Reset", width: 100,
    click: function ()
    {
        dfKategorien.reset();
        resetButtons(btnSpeichernKategorien, btnResetKategorien, btnCloseKategorien);
        dfKategorien.getField("interval").hide();
        dfKategorien.getField("dauer").hide();
        dfKategorien.getField("detail").setValue("N");
        dfKategorien.getField("detail").setDisabled(true);
        var record = AusgabenListeDetails.getSelectedRecord();
        dfKategorien.editRecord(record);

    }});
isc.HLayout.create({
    ID: "HLayoutKategorien",
    height: 30,
    width: "100%",
    align: "center",
    members: [btnCloseKategorien, isc.LayoutSpacer.create({
            width: 20
        }), btnSpeichernKategorien, isc.LayoutSpacer.create({
            width: 20
        }), btnResetKategorien]});


currentIcon = "famfam/sum.png";
isc.Window.create({
    ID: "wdKategorien",
    width: 500,
    height: 550,
    title: "Kategorie-Zuordnen",
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
    items: [dfKategorien, isc.LayoutSpacer.create({
            height: 20
        }), HLayoutKategorien]});


isc.ToolStripButton.create({
    ID: "tsbKategorien",
    count: 1,
    action: function ()
    {
        if (AusgabenListeDetails.getSelection().length == 1)
        {
            wdKategorien.show();
            btnResetKategorien.click();
            dfKategorien.getField("betrag").setValue(AusgabenListeDetails.getSelectedRecord().betrag);
            dfKategorien.getField("vorgang").setValue(AusgabenListeDetails.getSelectedRecord().vorgang);
            dfKategorien.getField("herkunft").setValue(AusgabenListeDetails.getSelectedRecord().herkunft);
            dfKategorien.getField("datum").setValue(AusgabenListeDetails.getSelectedRecord().datum);
            dfKategorien.getField("enddatum").setValue(AusgabenListeDetails.getSelectedRecord().datum);
            dfKategorien.getField("kontonr").setValue(AusgabenListeDetails.getSelectedRecord().kontonr);
            dfKategorien.getField("detail").setDisabled(true);
            dfKategorien.getField("dauer").hide();
            setValue2Field(dfKategorien, "detail", "N");
        } else
        {
            isc.say("Bitte erst einen Datensatz wählen");
        }
    },
    prompt: "Kategorie-Zuordnen",
    icon: "web/32/application_from_storage.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700
});

/*
 * ******************* CAMT-UPLOAD BUTTON **********************
 * -------------------------------------------------------------
 */
isc.ToolStripButton.create({
    ID: "tsbUmsaetze",
    count: 1,
    action: function ()
    {
        if (htmlPaneDropZoneUmsaetze.isVisible())
        {
            htmlPaneDropZoneUmsaetze.hide();
        } else
        {
            htmlPaneDropZoneUmsaetze.show();
        }
    },
    prompt: "Camt-Datei hochladen",
    icon: "web/32/table_money.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700
});

/*
 * *********************** ANFANG MENU *************************
 * -------------------------------------------------------------
 */



isc.Menu.create({
    ID: "menuUmsaetze",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    data: [
        {title: tsbUmsaetze.prompt, icon: tsbUmsaetze.icon, click: function ()
            {
                tsbUmsaetze.action();
            }},
        {isSeparator: true},
        {title: tsbUmsaetzeEdit.prompt, icon: tsbUmsaetzeEdit.icon, click: function ()
            {
                tsbUmsaetzeEdit.action();
            }},
        {title: tsbUmsaetzeAdd.prompt, icon: tsbUmsaetzeAdd.icon, click: function ()
            {
                tsbUmsaetzeAdd.action();
            }},
        {title: tsbUmsaetzeDelete.prompt, icon: tsbUmsaetzeDelete.icon, click: function ()
            {
                tsbUmsaetzeDelete.action();
            }},
        {isSeparator: true},
        {title: tsbKategorien.prompt, icon: tsbKategorien.icon, click: function ()
            {
                tsbKategorien.action();
            }
        }
    ]
});

/*
 * *************************** Layouts *****************************************
 * =============================================================================
 */

isc.Label.create({
    padding: 0,
    ID: "lblUmsaetze",
    width: 300,
    height: "100%",
    align: "center",
    contents: '<text style="color:' + titleLableColor + '; font-size:' + titleLableFontSize + '; font-family:' + titleLableFontFamily + '; text-decoration:none;">Umsätze</text>'
});


isc.ToolStrip.create({
    ID: "tsUmsaetze",
    width: "100%",
    backgroundImage: "backgrounds/leaves.jpg",
    height: 40,
    members: [dfKonten, isc.LayoutSpacer.create({width: 10}),
        tsbUmsaetze, isc.LayoutSpacer.create({width: 10}),
        tsbUmsaetzeEdit, isc.LayoutSpacer.create({width: 10}),
        tsbUmsaetzeAdd, isc.LayoutSpacer.create({width: 10}),
        tsbUmsaetzeDelete, isc.LayoutSpacer.create({width: 10}),
        tsbKategorien, isc.LayoutSpacer.create({width: "*"}),
        lblUmsaetze, isc.LayoutSpacer.create({width: 5})]
});

isc.VLayout.create({
    ID: "VLayoutUmsaetze",
    height: "100%",
    width: "100%",
    members: [tsUmsaetze, htmlPaneDropZoneUmsaetze, HLayout_Umsaetze]
});


/*
 * *************************** Initialisierung *********************************
 * =============================================================================
 */


addNode("VLayoutUmsaetze", {
    name: "VLayoutUmsaetze",
    cat: "Finanzen",
    onOpen: function ()
    {
        // Dropzone verstecken
        htmlPaneDropZoneUmsaetze.hide();
        // Konto-Selektor fixen
        if (counterUmsatz == 0)
        {
            setValue2Field(dfKonten, 'kontonr', "Konto wählen");
            counterUmsatz++;
            AusgabenListeDetails.contextMenu = menuUmsaetze;
            clearCharts('');
        }

    },
    treenode: {
        Name: "VLayoutUmsaetze",
        icon: "famfam/chart_bar.png",
        title: "Umsätze",
        enabled: true
    },
    reflow: true
}
);




