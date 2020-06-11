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


/*
 * *********************** GoTo: FUNKTIONEN ************************************
 * =============================================================================
 */

var refreshEinAusgabenListen = function (_form, _fieldName)
{
    var string = "";
    if (_form.getField(_fieldName).getValue())
    {
        var field = _form.getField(_fieldName).getValue();
        string = field.join(",");
    }

    return string;
};
function setCriteria()
{
    criteriaAll = {
        art: dfEinAusgabenFilter.getField("art").getValue(),
        typ: dfEinAusgabenFilter.getField("typ").getValue(),
        enddatum: refreshEinAusgabenListen(dfEinAusgabenFilter, "enddatum"),
        datum: refreshEinAusgabenListen(dfEinAusgabenFilter, "datum"),
        konto: refreshEinAusgabenListen(dfEinAusgabeKonten, "konten"),
        vorgang: refreshEinAusgabenListen(dfEinAusgabenFilter, "vorgang"),
        monat_jahr: refreshEinAusgabenListen(dfEinAusgabenFilter, "monat_jahr"),
        jahr: refreshEinAusgabenListen(dfEinAusgabenFilter, "jahr"),
        herkunft: refreshEinAusgabenListen(dfEinAusgabenFilter, "herkunft"),
        interval: refreshEinAusgabenListen(dfEinAusgabenFilter, "interval"),
        kategorie: dfEinAusgabenFilter.getField("kategorie_id").getDisplayValue(),
        zahlungsmittel: refreshEinAusgabenListen(dfEinAusgabenFilter, "zahlungsmittel"),
        count: ++dfEinAusgabenFilter.counter
    };
    return criteriaAll;
}

function fetchEinAusgaben(_form)
{

    var noSearch = "undefined";
    var _datum = null;
    var _enddatum = null;
    var _art = null;
    var _typ = null;
    var _kontonr = null;
    var _vorgang = null;
    var _herkunft = null;
    var _interval = null;
    var _kategorie = null;
    var _monat_jahr = null;
    var _jahr = null;
    var _zahlungsmittel_id = null;
    _zahlungsmittel_id = refreshEinAusgabenListen(_form, "zahlungsmittel");
    if (typeof (_form.getField("monat_jahr").getValue()) !== noSearch)
    {
        _monat_jahr = refreshEinAusgabenListen(_form, "monat_jahr");
    }
    if (typeof (_form.getField("jahr").getValue()) !== noSearch)
    {
        _jahr = refreshEinAusgabenListen(_form, "jahr");
    }
    if (typeof (_form.getField("enddatum").getValue()) !== noSearch)
    {
        _enddatum = refreshEinAusgabenListen(_form, "enddatum");
    }
    if (typeof (_form.getField("art").getValue()) !== noSearch)
    {
        _art = _form.getField("art").getValue();
    }
    if (typeof (_form.getField("typ").getValue()) !== noSearch)
    {
        _typ = _form.getField("typ").getValue();
    }
    if (typeof (_form.getField("datum").getValue()) !== noSearch)
    {
        _datum = refreshEinAusgabenListen(_form, "datum");
    }
//    if (typeof (dfEinAusgabeKonten.getField("konto").getValue()) !== noSearch) {
    _kontonr = refreshEinAusgabenListen(dfEinAusgabeKonten, "konten");
//    }
    if (typeof (_form.getField("vorgang").getValue()) !== noSearch)
    {
        _vorgang = refreshEinAusgabenListen(_form, "vorgang");
    }
    if (typeof (_form.getField("herkunft").getValue()) !== noSearch)
    {
        _herkunft = refreshEinAusgabenListen(_form, "herkunft");
    }
    if (typeof (_form.getField("interval").getValue()) !== noSearch)
    {
        _interval = refreshEinAusgabenListen(_form, "interval");
    }
    if (typeof (_form.getField("kategorie_id").getDisplayValue()) !== noSearch)
    {
        _kategorie = _form.getField("kategorie_id").getDisplayValue();
    }

    lgEinAusgaben.fetchData({"jahr": _jahr, "monat_jahr": _monat_jahr, "enddatum": _enddatum, "art": _art, "typ": _typ, "datum": _datum,
        "konto": _kontonr, "vorgang": _vorgang, "herkunft": _herkunft, "interval": _interval,
        "kategorie": _kategorie, zahlungsmittel: _zahlungsmittel_id, counter: ++_form.counter});
    getSumEinAusgaben(totalsLabelEinAusgaben, "api/ds/einAusgabenDS.php", _jahr, _monat_jahr, _enddatum, _art, _typ, _datum, _kontonr, _vorgang, _herkunft, _interval, _kategorie, _zahlungsmittel_id);
}
;
function getSumEinAusgaben(_lbl_id, _scriptUrl, _jahr, _monat_jahr, _enddatum, _art, _typ, _datum, _kontonr, _vorgang, _herkunft, _interval, _kategorie, _zahlungsmittel_id)
{

    RPCManager.send("", function (rpcResponse, data, rpcRequest)
    {
        var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
        var summeUmsaetze = _data["summe"];
//            var totalRows = _data["anzahl"];


        var labelContent = '<table><tr style="width:100%; color:' + gridComponentsLabelColor + '; font-size:' + gridComponentsLabelFontSize + '; font-family:' + gridComponentsLabelFontFamily + '; text-decoration:none;"><td width="200">' + 0 + " Datensätze" + '</td><td width="80%"></td><td width="300" align="right">Summe: ' + summeUmsaetze + " €" + '</td></tr></table>';
        _lbl_id.setContents(labelContent);
//            }
    }, {// Übergabe der Parameter
        actionURL: _scriptUrl,
        httpMethod: "POST",
        contentType: "application/x-www-form-urlencoded",
        useSimpleHttp: true,
        params: {
            f: "sum", "jahr": _jahr, "monat_jahr": _monat_jahr, "enddatum": _enddatum, "art": _art, "typ": _typ, "datum": _datum,
            "konto": _kontonr, "vorgang": _vorgang, "herkunft": _herkunft, "interval": _interval, zahlungsmittel: _zahlungsmittel_id,
            "kategorie": _kategorie
        }
    }); //Ende RPC

}
;
function uploadDocEinAusgabe(_this, id)
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
                lgEinAusgaben.invalidateCache();
                isc.say(response, function (value)
                {
                    if (value)
                    {
                        var ds = lgEinAusgaben.data.find("ID", id);
                        var index = lgEinAusgaben.getRecordIndex(ds);
                        lgEinAusgaben.deselectAllRecords();
                        lgEinAusgaben.selectRecord(index);
                        lgEinAusgaben.scrollToRow(index);
                    }
                });
            }
        } catch (err) {
            isc.say(err.message);
        }
        // Add the button to the file preview element.
        file.previewElement.appendChild(removeButtonEinAusg);
    });
}
;
function initDropZoneEinAusgabe()
{

    removeButtonEinAusg = Dropzone.createElement("<button class='remove-button'>Leeren</button>");
    this.on("sending", function (file, xhr, formData)
    { // zusätzlich die ID mitschicken
        var ID = lgEinAusgaben.getSelectedRecord().ID;
        formData.append("ID", ID);
    });
    this.on("drop", function (e)
    {
        var ID = lgEinAusgaben.getSelectedRecord().ID;
        e.preventDefault();
        e.stopPropagation();
        uploadDocEinAusgabe(this, ID);
    });
    this.on("addedfile", function (file)
    {
        var ID = lgEinAusgaben.getSelectedRecord().ID;
        uploadDocEinAusgabe(this, ID);
    });
    // Maximal nur 1 Datei erlaubt (maxFiles: 1 - dropzone.js) - Alles andere wird automatisch entfernt (Thumbnails)
    this.on("maxfilesexceeded", function (file)
    {
        this.removeFile(file);
        // Add the button to the file preview element.
        file.previewElement.appendChild(removeButtonEinAusg); // instance 1
    });
    _thisEA = this;
    // Listen to the click event

    removeButtonEinAusg.addEventListener("click", function (e)
    {


        // Make sure the button click doesn't submit the form:
        e.preventDefault();
        e.stopPropagation();
        // Remove the file preview.
        _thisEA.removeFile(dropZoneEinAusgabe.dropzone.files[0]); // instance 1
        // If you want to the delete the file on the server as well,
        // you can do the AJAX request here.


//            delDocument("input_" + pdf_timestamp + ".pdf");

    });
    this.on("error", function (file, res)
    {
        isc.say(res);
        // Add the button to the file preview element.
        file.previewElement.appendChild(removeButtonEinAusg);
    });
}

function drop(drop_zone, _form, _status, _list, _url)
{// wird beim öffnen des Upload-Fensters gestartet
    var dropZone = document.getElementById(drop_zone);
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', uploadFile(_form, _status, _list, _url), false);
    document.getElementById(_status).innerHTML = "";
    document.getElementById(_list).innerHTML = "";
}

function handleDragOver(event)
{
    event.stopPropagation();
    event.preventDefault();
    var dt = event.dataTransfer;
    dt.dropEffect = 'copy'; // Explicitly show this is a copy.

}

function uploadFile(_form, _status, _list, _url)
{
    return function (event)
    { //callback
        event.stopPropagation();
        event.preventDefault();
        files = event.dataTransfer.files; // FileList object.
        // files is a FileList of File objects. List some properties.
        var output = [];
        for (var i = 0, f; f = files[i]; i++)
        {
            output.push('<li><strong>', f.name, '</strong> - ', f.size, ' bytes </li>');
            //  uploadFile(f, event);

            var xhr = new XMLHttpRequest(); // den AJAX Request anlegen
            // Angeben der URL und des Requesttyps
            xhr.open('POST', _url); // Die Verbindung wird geöffnet
            xhr.responseType = "json";
            var formdata = new FormData(); // Anlegen eines FormData Objekts zum Versenden unserer Datei

            var ID = lgEinAusgaben.getSelectedRecord().ID;
            formdata.append('file', f);
            formdata.append('ID', ID);
            xhr.upload.addEventListener("progress", progressHandler(_status), false); // ist für den Übertragungsprozess verantwortlich u.a. für die Progressbar
            xhr.addEventListener("load", completeHandler(files.length), false); // Gibt die Antwort des Servers wieder bei abgeschlossener Übertragung
            xhr.addEventListener("error", errorHandler(_status), false); //Zeigt die Fehler-Texte an z.B. bei Fehlern im PHP Skript
            xhr.send(formdata); // Absenden des Requests
        }
        //isc.say('<ul>' + output.join('') + '</ul>');

        document.getElementById(_list).innerHTML = '<ol>' + output.join('') + '</ol>'; //Namen der hochgel. Dateien werden angezeigt

        // Neu laden der Tabelle
    };
}

function progressHandler(_status)
{
//    document.getElementById('loaded_n_total').innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total;
    return function (event)
    {//callback
        var percent = (event.loaded / event.total) * 100;
        //   document.getElementById('progressBar').value = Math.round(percent); // Funktioniert wird aber nicht gebraucht
        document.getElementById(_status).innerHTML = Math.round(percent) + "% geladen";
    };
}

function completeHandler(i)
{
    return function (event)
    {//callback
        var response = event.target.response;
        isc.say(response);
        fetchEinAusgaben(dfEinAusgabenFilter);
    };
    //  document.getElementById('progressBar').value = 0; // Funktioniert wird aber nicht gebraucht

}
function errorHandler(_status)
{
    return function ()
    {//callback
        document.getElementById(_status).innerHTML = "Upload failed";
    };
}


/*
 * ************************ GoTo: DataSources ************************
 */

isc.DataSource.create({
    ID: "einauszahlungenDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            defaultParams: {
                "counter": Date.now()
            },
            dataURL: "api/ds/einAusgabenDS.php"
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
            name: "art",
            title: "Art",
            type: "text"
        },
        {
            name: "typ",
            title: "Typ",
            type: "text"
        }, {
            name: "betrag",
            title: "Betrag",
            type: "text"
        }, {
            name: "kontonr",
            title: "Konto",
            type: "text"
        }, {
            name: "vorgang",
            title: "Vorgang",
            type: "text"
        }, {
            name: "herkunft",
            title: "Herkunft",
            type: "text"
        }, {
            name: "interval",
            type: "text"
        }, {
            name: "int_bez",
            title: "Intervall",
            type: "text"
        }, {
            name: "konto_bez",
            title: "typ",
            type: "text"
        }, {
            name: "kategorie",
            title: "Kategorie",
            type: "text"
        }, {
            name: "kategorie_id",
            title: "Kategorie-ID",
            type: "text"
        }, {
            name: "kommentar",
            title: "Kommentar",
            type: "text"
        }, {
            name: "detail",
            title: "Detail",
            type: "text"
        }, {
            name: "dauer",
            type: "text"
        }, {
            name: "zahlungsmittel_id",
            type: "number"
        }, {
            name: "zahlungsmittel_bez",
            type: "text"
        }, {
            name: "bundle",
            type: "text"
        }
    ]});
isc.DataSource.create({
    ID: "einAusgabenSucheFelderDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            defaultParams: {
                "counter": Date.now()
            },
            dataURL: "api/ds/einAusgabenSucheFelderDS.php"
        }
    ],
    titleField: "text",
    fields: [
        {
            name: "ID",
            title: "ID",
            type: "text",
            primaryKey: true
        }, {
            name: "zahlungsmittel",
            type: "text"
        }, {
            name: "zahlungsmittel_bez",
            type: "text"
        },
        {
            name: "monatJahr",
            title: "Zeitraum",
            type: "text"
        },
        {
            name: "jahr",
            title: "Jahr",
            type: "text"
        },
        {
            name: "datum",
            title: "Datum",
            type: "text"
        },
        {
            name: "enddatum",
            title: "End-Datum",
            type: "text"
        },
        {
            name: "art",
            title: "Art",
            type: "text"
        },
        {
            name: "art_bez",
            title: "Art",
            type: "text"
        },
        {
            name: "typ",
            title: "Typ",
            type: "text"
        },
        {
            name: "typ_bez",
            title: "Typ",
            type: "text"
        }, {
            name: "betrag",
            title: "Betrag",
            type: "text"
        }, {
            name: "kontonr",
            title: "Konto",
            type: "text"
        }, {
            name: "vorgang",
            title: "Vorgang",
            type: "text"
        }, {
            name: "herkunft",
            title: "Herkunft",
            type: "text"
        }, {
            name: "interval",
            type: "text"
        }, {
            name: "int_bez",
            title: "Intervall",
            type: "text"
        }, {
            name: "konto_bez",
            title: "Konto",
            type: "text"
        }, {
            name: "kategorie",
            title: "Kategorie",
            type: "text"
        }, {
            name: "kategorie_id",
            title: "Kategorie-ID",
            type: "text"
        }
    ]});
isc.DataSource.create({
    ID: "kontenEinAusDS",
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
            title: "Konto",
            type: "text"
        },
        {
            name: "bezeichnung",
            title: "Bezeichnung",
            type: "text"
        }
    ]});
isc.DataSource.create({
    ID: "kategorienEinAusDS",
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
    ID: "zahlmittelEinAusDS",
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
    ID: "herkunftVorgangDS",
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
    ID: "bundleDS",
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
    ID: "htmlPaneDropZoneEinAusgabe",
    styleName: "exampleTextBlock",
    contents: '<div id="mainEinAusgaben">' +
      '<div id="drop_zone_einausgaben">Datei hier hinein ziehen</div>' +
      '<form><input type="hidden" name="dropEinAusgaben"></form>' +
      //   '<progress id="progressBar" value=0 max="100"</progress>'+
      '<h3 id="statusEinAusgaben"></h3>' +
      '<p id="loaded_n_totalEinAusgaben"></p>' +
      '<div id="uploadListEinAusgaben"></div></div>'
//    contents: '<div id="dropzone"><form class="dropzone needsclick" id="dropZoneEinAusgabe"> ' +'</form></div>'
});
//Dropzone.options.dropZoneEinAusgabe = {
////    acceptedFiles: "application/vnd.ms-excel",
//    url: "api/upload_document.php",
//    method: "post",
//    init: initDropZoneEinAusgabe
//};

/*
 * ****************** ENDE DropZone *****************************
 * --------------------------------------------------------------
 */


/*
 * **************************** DynaForm ***************************************
 * =============================================================================
 */
isc.DynamicForm.create({
    ID: "dfEinAusgabeKonten",
    monCnt: 0,
    width: 100,
    height: 10,
    margin: 0,
    numCols: 2,
    fields: [{name: "konten",
            title: "Konten",
            type: "select",
            multiple: true,
            multipleAppearance: "picklist",
            optionDataSource: kontenPrognosenDS,
            valueField: "kontonr",
            displayField: "bezeichnung",
            required: true,
//            defaultValue: "1",
            pickListProperties: {showShadow: false, showFilterAddor: false, showHeader: false},
            pickListWidth: 480,
            pickListFields: [
                {name: "bezeichnung", width: 140}, {name: "kontonr", width: 140}, {name: "typ_bez", width: 140}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    f: "prognosen", count: ++dfEinAusgabeKonten.monCnt};
                return filter;
            },
            changed: function (form, item, value)
            {
                console.log(value);
                fetchEinAusgaben(dfEinAusgabenFilter);
            }
        }
    ]
});
/*
 * ******************* Ausgaben-Liste *******************************************
 * ------------------------------------------------------------------------------
 */

isc.ToolStrip.create({
    ID: "gridEditControlsEinAusgaben",
    width: "100%", height: 20,
    backgroundColor: "#E7F6FF",
    members: [
        isc.LayoutSpacer.create({width: "*"}),
        isc.Label.create({
            padding: 2,
            ID: "totalsLabelEinAusgaben",
            align: "center",
            width: "100%"
        })

    ]
});
var hiliteArrayEinAusgabe =
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
    ID: "lgEinAusgaben",
    count: 0,
    counter: 0,
    //   header: "Daten bearbeiten",
    width: "100%", height: "100%",
    alternateRecordStyles: true,
    dataSource: "einauszahlungenDS",
    autoFetchData: true,
    showFilterEditor: false,
    filterOnKeypress: false,
    selectionType: "single",
    showAllRecords: true,
    canExpandRecords: false,
    expansionMode: "details",
    showGridSummary: false,
    showGroupSummary: false,
    groupStartOpen: "all",
    groupByField: ['konto_bez', 'kategorie'],
    margin: 0,
    initialSort: [{
            property: "datum",
            direction: "ascending"
        }, {
            property: "kategorie",
            direction: "ascending"
        }, {
            property: "vorgang",
            direction: "ascending"
        }
    ],
    fields: [
        {
            name: "ID",
            title: "ID",
            type: "text",
            showIf: "false"
        }, {
            name: "vorgang",
            title: "Vorgang",
            type: "text"
        }, {
            name: "betrag",
            title: "Betrag",
            type: "text",
            align: "right",
            width: 100
        },
        {
            name: "datum",
            title: "Datum",
            type: "date"
        }, {
            name: "kategorie",
            title: "Kategorie",
            type: "text", showHover: true,
            hoverHTML: "return record.kategorie"
        }, {
            name: "kategorie_id",
            title: "Kategorie-ID",
            type: "number",
            showIf: "false"
        },
        {
            name: "enddatum",
            title: "Ende",
            type: "date",
            showIf: "false"
        }, {
            name: "art_bez",
            width: "*",
            showIf: "false",
            getGroupTitle: function (groupValue, groupNode, field, fieldName, grid)
            {
                var color = (groupValue == "Einnahmen") ? "#34cf3b" : "#ba1dbf";
                return '<text style="color:' + color + '; font-size:14px; font-family:' + mainHeaderFontFamily + ';' + mainHeaderFontStyle + ' ">' + groupValue + '</text>';
            }
        },
        {
            name: "typ_bez",
            title: "Typ",
            type: "text",
            showIf: "false"
        }, {
            name: "kontonr",
            title: "Konto",
            type: "text"
        }, {
            name: "konto_bez",
            title: "Konto",
            type: "text",
            getGroupTitle: function (groupValue, groupNode, field, fieldName, grid)
            {
                return '<text style="color:red; font-size:16px; font-family:' + mainHeaderFontFamily + ';' + mainHeaderFontStyle + ' ">' + groupValue + '</text>';
            }
        }, {
            name: "herkunft",
            title: "Herkunft",
            type: "text", showHover: true,
            hoverHTML: "return record.herkunft"
        }, {
            name: "interval",
            type: "text",
            showIf: "false"
        }, {
            name: "int_bez",
            title: "Intervall",
            type: "text"
        }, {
            name: "kommentar",
            title: "Kommentar",
            type: "text", showHover: true,
            hoverHTML: "return record.kommentar"
        }, {
            name: "zahlungsmittel_bez",
            title: "Zahlungsmittel",
            type: "text",
            showIf: "false"
        }, {
            name: "bundle",
            title: "Einkauf",
            type: "text",
            showIf: "false"
        },
        {name: "document", title: "Info",
            type: "link",
            showTitle: false,
            width: 30,
            align: "center",
            linkText: isc.Canvas.imgHTML("famfam/page_white_acrobat.png", 16, 16),
            linkURLPrefix: docPath
        }
    ], hilites: hiliteArrayEinAusgabe,
    gridComponents: [/*"filterEditor",*/ "header", "body", gridEditControlsEinAusgaben/*, "summaryRow"*/],
    recordDoubleClick: function (viewer, record, recordNum, field, fieldNum, value, rawValue)
    {
        wdEinAusgabe.show();
        dfEinAusgaben.editRecord(record);
        dfEinAusgaben.getField("action").setValue("edit");
        wdEinAusgabe.setTitle("Editieren eines Vorgangs");
        setValue2Field(dfEinAusgaben, 'typ', record.typ);
        setValue2Field(dfEinAusgaben, 'datum', record.datum);
        setValue2Field(dfEinAusgaben, 'detail', record.detail);
        resetButtons(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
    }
});
/*
 * *************************** Ein-Ausgaben Form *******************************
 * =============================================================================
 */


isc.DynamicForm.create({
    ID: "dfEinAusgaben",
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
    fields: [
        {
            name: "action",
            type: "hidden"
        },
        {
            name: "ID",
            type: "hidden"
        }, {
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
                changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
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
                changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
                if (value == "F")
                {
                    dfEinAusgaben.getField("interval").show();
                    dfEinAusgaben.getField("detail").setDisabled(false);
                }
                if (value == "V")
                {
                    dfEinAusgaben.getField("interval").hide();
                    dfEinAusgaben.getField("detail").setDisabled(true);
                    dfEinAusgaben.getField("detail").setValue("N");
                }

            }
        }, {
            type: "RowSpacer",
            height: 10
        }, {
            name: "kontonr",
            title: "Konto",
            width: 150,
            required: true,
            optionDataSource: kontenEinAusDS,
            valueField: "kontonr",
            displayField: "bezeichnung",
//            defaultValue: "typ wählen",
            pickListProperties: {showShadow: false, showFilterAddor: false, showHeader: false},
            pickListWidth: 350,
            pickListFields: [
                {name: "bezeichnung", width: 140}, {name: "kontonr", width: 200}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    count: ++dfEinAusgaben.monCnt};
                return filter;
            },
            type: "select",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernUmsaetzeAdd, btnResetUmsaetzeAdd, btnCloseUmsaetzeAdd);
            }
        }, {
            name: "kategorie_id",
            title: "Kategorien",
            width: 200,
            optionDataSource: kategorienEinAusDS,
            valueField: "ID",
            displayField: "bezeichnung",
            required: true,
//            defaultValue: "typ wählen",
            pickListProperties: {showShadow: false, showFilterAddor: false, showHeader: false},
            pickListWidth: 210,
            pickListFields: [
                {name: "bezeichnung", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    typ: dfEinAusgaben.getField("typ").getValue(), art: dfEinAusgaben.getField("art").getValue(), count: ++dfEinAusgaben.monCnt
                };
                return filter;
            },
            type: "select",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
            }, icons: [{
                    src: "web/16/add.png",
                    name: "kategorie_id",
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
                changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
            }
        }, {
            name: "datum",
            title: "Datum",
            type: "date",
            startDate: "01/01/2010",
            endDate: "31/12/2099",
            required: true,
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
            }
        }, {
            name: "enddatum",
            title: "Enddatum",
            type: "date",
            startDate: "01/01/2010",
            endDate: "31/12/2099",
            required: true,
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
            }
        }, {
            name: "vorgang",
            title: "Vorgang",
            width: 300,
            required: true,
            type: "comboBox",
            optionDataSource: herkunftVorgangDS,
            valueField: "bezeichnung",
            displayField: "bezeichnung",
            pickListProperties: {showShadow: false, showFilterAddor: false, showHeader: false},
            pickListWidth: 300,
            pickListFields: [
                {name: "bezeichnung", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    count: ++dfEinAusgaben.monCnt, f: this.name, value: dfEinAusgaben.getField(this.name).getValue()};
                return filter;
            },
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
            }, icons: [{
                    src: "web/16/delete.png",
                    name: "vorgang",
                    width: 16,
                    height: 16,
                    prompt: "Feldinhalt löschen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfEinAusgaben.getField("vorgang").clearValue();
                        changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
                    }
                }]
        }, {
            name: "herkunft",
            title: "Herkunft",
            width: 300,
            required: true,
            type: "comboBox",
            optionDataSource: herkunftVorgangDS,
            valueField: "bezeichnung",
            displayField: "bezeichnung",
            pickListProperties: {showShadow: false, showFilterAddor: false, showHeader: false},
            pickListWidth: 300,
            pickListFields: [
                {name: "bezeichnung", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    count: ++dfEinAusgaben.monCnt, f: this.name, value: dfEinAusgaben.getField(this.name).getValue(), konto: dfEinAusgaben.getField("kontonr").getValue()};
                return filter;
            },
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
            }, icons: [{
                    src: "web/16/delete.png",
                    name: "herkunft",
                    width: 16,
                    height: 16,
                    prompt: "Feldinhalt löschen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfEinAusgaben.getField("herkunft").clearValue();
                        changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
                    }
                }]
        }, {
            name: "zahlungsmittel_id",
            title: "Zahlungsmittel",
            width: 300,
            required: false,
            type: "comboBox",
            optionDataSource: zahlmittelEinAusDS,
            valueField: "ID",
            displayField: "bezeichnung",
            pickListProperties: {showShadow: false, showFilterAddor: false, showHeader: false},
            pickListWidth: 300,
            pickListFields: [
                {name: "bezeichnung", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    count: ++dfEinAusgaben.monCnt, value: dfEinAusgaben.getField(this.name).getDisplayValue()};
                return filter;
            },
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
            }, icons: [{
                    src: "web/16/delete.png",
                    name: "zahlungsmittel_id",
                    width: 16,
                    height: 16,
                    prompt: "Feldinhalt löschen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfEinAusgaben.getField("zahlungsmittel_id").clearValue();
                        changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
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
                changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
            }
        }, {
            type: "RowSpacer",
            height: 10
        }, {
            name: "kommentar",
            title: "Kommentar",
            width: 280,
            height: 60,
            required: false,
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
            }
        }, {
            name: "detail",
            title: "Detail",
            width: 150,
            defaultValue: "N",
            type: "radioGroup",
            valueMap: {"N": "Nein", "J": "Ja"},
            required: false,
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
                if (value == "J")
                {
                    dfEinAusgaben.getField("dauer").show();
                } else
                {
                    dfEinAusgaben.getField("dauer").hide();
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
                changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
            }
        }, {
            name: "bundle",
            title: "Einkauf",
            width: 300,
            required: false,
            type: "comboBox",
            optionDataSource: bundleDS,
            valueField: "bezeichnung",
            displayField: "bezeichnung",
            pickListProperties: {showShadow: false, showFilterAddor: false, showHeader: false},
            pickListWidth: 300,
            pickListFields: [
                {name: "bezeichnung", width: "*"}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    count: ++dfEinAusgaben.monCnt, value: dfEinAusgaben.getField(this.name).getValue()};
                return filter;
            },
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
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
                        dfEinAusgaben.getField("bundle").clearValue();
                        changeFunction(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
                    }
                }]
        }
    ]});
isc.IButton.create({
    ID: "btnCloseEinAusgabe",
    type: "button",
    disabled: false,
    icon: "famfam/door_in.png",
    name: "btnCloseEinAusgabe",
    showDisabledIcon: false,
    title: "Schließen", width: 100,
    click: function ()
    {
        if (btnCloseEinAusgabe.getTitle() == "Abbrechen")
        {
            isc.ask("Wollen Sie wirklich abbrechen? Nicht gespeicherte Daten könnten verloren gehen.", function (value)
            {
                if (value)
                {
                    wdEinAusgabe.hide();
                }
            }, {title: "Vorgang abbrechen?"});
        } else
        {
            wdEinAusgabe.hide();
        }
    }});
/*
 * ************************* Speicher-Prozedur Add Umsatz **********************
 */
isc.IButton.create({
    ID: "btnSpeichernEinAusgabe",
    type: "button",
    disabled: true,
    count: 0,
    showDisabledIcon: false,
    icon: "famfam/database_save.png",
    name: "btnSpeichernEinAusgabe",
    title: "Speichern",
    width: 100,
    click: function ()
    {
        id = 0;
        var action = dfEinAusgaben.getField("action").getValue();
        if (dfEinAusgaben.validate())
        {
            if (lgEinAusgaben.getSelection().length == 1)
            {
                id = lgEinAusgaben.getSelectedRecord().ID;
                var text = "editiert";
            } else
            {
                var text = "hinzugefügt";
            }
            RPCManager.send("", function (rpcResponse, data, rpcRequest)
            {
                var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)

                if (_data.response.status === 0)
                {  // Status 0 bedeutet Keine Fehler
                    if (action != "edit")
                    {
                        id = _data.response.data["ID"];
                    }
                    fetchEinAusgaben(dfEinAusgabenFilter);
                    if (!dfEinAusgaben.validate() && dfEinAusgaben.hasErrors())
                    {
                        dfEinAusgaben.setErrors();
                        var _errors = dfEinAusgaben.getErrors();
                        for (var i in _errors)
                        {
                            isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>"); // Hier wird jeder Wert des Array-Schlüssel angezeigt und das Feld oder die Feld-Bezeichnung ist irrelevant.
                        }
                    } else
                    {
                        if (action == "edit")
                        {
                            isc.say("Datensatz wurde erfolgreich " + text, function (value)
                            {
                                if (value)
                                {
                                    isc.Timer.setTimeout("btnSpeichernEinAusgabe.isLoadingEinAusgabeTimer()", 150);
                                    resetButtons(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
                                    wdEinAusgabe.hide();
                                }

                            }, {title: "Datensatz einfügen"});
                        } else if (action == "add")
                        {
                            isc.ask("Datensatz wurde erfolgreich " + text + "<br>Wollen Sie einen weiteren Eintrag vornehmen?", function (value)
                            {
                                if (value)
                                {
                                    isc.Timer.setTimeout("btnSpeichernEinAusgabe.isLoadingEinAusgabeTimer()", 150);
                                    resetButtons(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
                                    dfEinAusgaben.getField("action").setValue("add");
                                    wdEinAusgabe.setTitle("Hinzufügen eines neuen Vorgangs");
                                    dfEinAusgaben.getField("betrag").clearValue();
                                } else
                                {
                                    isc.Timer.setTimeout("btnSpeichernEinAusgabe.isLoadingEinAusgabeTimer()", 150);
                                    resetButtons(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
                                    wdEinAusgabe.hide();
                                }

                            }, {title: "Datensatz einfügen"});
                        } else
                        {
                            isc.warn("Aktionsparameter nicht gefunden. Vorgang wird abgebrochen.", function (value)
                            {
                                if (value)
                                {
                                    isc.Timer.setTimeout("btnSpeichernEinAusgabe.isLoadingEinAusgabeTimer()", 150);
                                    resetButtons(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
                                    wdEinAusgabe.hide();
                                }
                            });
                        }
                    }

                    //                                isc.say(umsatz_id);


                } else
                { // Wenn die Validierungen Fehler aufweisen dann:

                    dfEinAusgaben.setErrors(_data.response.errors, true);
                    var _errors = dfEinAusgaben.getErrors();
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
                    ID: id,
                    action: action,
                    betrag: dfEinAusgaben.getField("betrag").getValue(),
                    art: dfEinAusgaben.getField("art").getValue(),
                    typ: dfEinAusgaben.getField("typ").getValue(),
                    kontonr: dfEinAusgaben.getField("kontonr").getValue(),
                    datum: dfEinAusgaben.getField("datum").getValue(),
                    enddatum: dfEinAusgaben.getField("enddatum").getValue(),
                    vorgang: dfEinAusgaben.getField("vorgang").getValue(),
                    herkunft: dfEinAusgaben.getField("herkunft").getValue(),
                    interval: dfEinAusgaben.getField("interval").getValue(),
                    dauer: dfEinAusgaben.getField("dauer").getValue(),
                    detail: dfEinAusgaben.getField("detail").getValue(),
                    kommentar: dfEinAusgaben.getField("kommentar").getValue(),
                    bundle: dfEinAusgaben.getField("bundle").getValue(),
                    zahlungsmittel: dfEinAusgaben.getField("zahlungsmittel_id").getValue(),
                    kategorie_id: dfEinAusgaben.getField("kategorie_id").getValue()
                }

            }); //Ende RPC
        } else
        {
            isc.say("Bitte erst alle benötigten Felder ausfüllen");
        }

    }, // Ende Click
    findNewEinAusgabe: function ()
    {
        var ds = lgEinAusgaben.data.find("ID", id);
        var index = lgEinAusgaben.getRecordIndex(ds);
        lgEinAusgaben.deselectAllRecords();
        lgEinAusgaben.selectRecord(index);
        lgEinAusgaben.scrollToRow(index);
    },
    isLoadingEinAusgabeTimer: function ()
    {
        if (!Array.isLoading(dfEinAusgaben.getRecord(0)))
        {
            isc.Timer.setTimeout("btnSpeichernEinAusgabe.findNewEinAusgabe()", 150);
        }
    }
});
isc.IButton.create({
    ID: "btnResetEinAusgabe",
    type: "button",
    showDisabledIcon: false,
    icon: "famfam/arrow_undo.png",
    disabled: true,
    name: "btnResetEinAusgabe",
    title: "Reset", width: 100,
    click: function ()
    {

        dfEinAusgaben.reset();
        var title = wdEinAusgabe.title.substr(0, 9);
        if (title == "Editieren")
        {
            dfEinAusgaben.getField("action").setValue("edit");
        } else
        {
            dfEinAusgaben.getField("action").setValue("add");
        }

        if (title == "Editieren") // Interval nur verschwinden lassen, wenn Edit-Mode und Fixkosten
        {
            typ_ = lgEinAusgaben.getSelectedRecord().typ;
            detail_ = lgEinAusgaben.getSelectedRecord().detail;
            if (typ_ != "F")
            {
                dfEinAusgaben.getField("interval").hide();
            }
            if (detail_ == "J")
            {
                dfEinAusgaben.getField("dauer").show();
            } else
            {
                dfEinAusgaben.getField("dauer").hide();
            }
        } else
        {
            dfEinAusgaben.getField("interval").hide();
            dfEinAusgaben.getField("dauer").hide();
        }
        resetButtons(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
    }});
isc.HLayout.create({
    ID: "HLayoutEinAusgabe",
    height: 30,
    width: "100%",
    align: "center",
    members: [btnCloseEinAusgabe, isc.LayoutSpacer.create({
            width: 20
        }), btnSpeichernEinAusgabe, isc.LayoutSpacer.create({
            width: 20
        }), btnResetEinAusgabe]});
currentIcon = "famfam/sum.png";
isc.Window.create({
    ID: "wdEinAusgabe",
    width: 500,
    height: 600,
    title: "",
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
    items: [dfEinAusgaben, isc.LayoutSpacer.create({
            height: 20
        }), HLayoutEinAusgabe]});
/*
 * ******************************** FILTER *************************************
 * =============================================================================
 */

/*
 * ******************************** GoTo: Filter *******************************
 */
var dfEinAusgabenWidth = 230;
isc.DynamicForm.create({
    ID: "dfEinAusgabenFilter",
    width: "100%",
    height: "100%",
    titleOrientation: "top",
//    backgroundImage: "backgrounds/leaves.jpg",
    validateOnExit: true,
    counter: 0,
    numCols: 1,
//    align: "left",
    colWidths: [50, 50],
    margin: 0,
    fields: [{
            name: "jahr",
            type: "select",
            multiple: true,
            multipleAppearance: "picklist",
            required: false,
            colSpan: 1,
            hint: "Jahr",
            title: "Jahr",
            showHintInField: true,
            disabled: false,
            width: dfEinAusgabenWidth,
            showTitle: true,
//            defaultValue: _Monat,
            autoFetchData: false,
            valueField: "jahr",
            displayField: "jahr",
            optionDataSource: "einAusgabenSucheFelderDS",
            pickListProperties: {
                showShadow: false,
                showFilterEditor: false,
                showHeader: false
            },
            pickListWidth: dfEinAusgabenWidth - 5,
            pickListFields: [{
                    name: "jahr",
                    width: "*"
                }
            ],
            getPickListFilterCriteria: function ()
            {
                var criteriaAll = setCriteria();
                var criteria = {};
                for (var crit in criteriaAll)
                {
                    if (crit != this.name)
                    {
                        criteria[crit] = criteriaAll[crit];
                    }
                }
                criteria['lookFor'] = this.name;
                return criteria;
            },
            changed: function (form, item, value)
            {
                fetchEinAusgaben(dfEinAusgabenFilter);
            }, icons: [{
                    src: "famfam/delete.png",
                    name: "jahr",
                    width: 16,
                    height: 16,
                    prompt: "Inhalt des Feldes entfernen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfEinAusgabenFilter.getField(this.name).clearValue();
                        fetchEinAusgaben(dfEinAusgabenFilter);
                    }
                }, {
                    src: "famfam/date_go.png",
                    name: "jahr2",
                    width: 16,
                    height: 16,
                    prompt: "Setzt das Feld auf das aktuelle Jahr",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        setValue2Field(dfEinAusgabenFilter, dfEinAusgabenFilter.getField("jahr"), jahr);
                    }
                }]
        }, {
            name: "monat_jahr",
            type: "select",
            multiple: true,
            multipleAppearance: "picklist",
            required: false,
            colSpan: 1,
            hint: "Zeitraum",
            title: "Zeitraum",
            showHintInField: true,
            disabled: false,
            width: dfEinAusgabenWidth,
            showTitle: true,
//            defaultValue: _Monat,
            autoFetchData: false,
            valueField: "monatJahr",
            displayField: "monatJahr",
            optionDataSource: "einAusgabenSucheFelderDS",
            pickListProperties: {
                showShadow: false,
                showFilterEditor: false,
                showHeader: false
            },
            pickListWidth: dfEinAusgabenWidth - 5,
            pickListFields: [{
                    name: "monatJahr",
                    width: "*"
                }
            ],
            getPickListFilterCriteria: function ()
            {
                var criteriaAll = setCriteria();
                var criteria = {};
                for (var crit in criteriaAll)
                {
                    if (crit != this.name)
                    {
                        criteria[crit] = criteriaAll[crit];
                    }
                }
                criteria['lookFor'] = this.name;
                return criteria;
            },
            changed: function (form, item, value)
            {
                fetchEinAusgaben(dfEinAusgabenFilter);
            }, icons: [{
                    src: "famfam/delete.png",
                    name: "monat_jahr",
                    width: 16,
                    height: 16,
                    prompt: "Inhalt des Feldes entfernen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfEinAusgabenFilter.getField(this.name).clearValue();
                        fetchEinAusgaben(dfEinAusgabenFilter);
                    }
                }, {
                    src: "famfam/date_go.png",
                    name: "monat_jahr2",
                    width: 16,
                    height: 16,
                    prompt: "Setzt das Feld auf den aktuellen Monat",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        setValue2Field(dfEinAusgabenFilter, dfEinAusgabenFilter.getField("monat_jahr"), _Monat);
                    }
                }]
        }, {
            name: "kategorie_id",
            type: "select",
            multiple: true,
            multipleAppearance: "picklist",
            required: false,
            hint: "Kategorie",
            title: "Kategorie",
            colSpan: 1,
            showHintInField: true,
            disabled: false,
            width: dfEinAusgabenWidth,
            showTitle: true,
            autoFetchData: false,
            valueField: "kategorie_id",
            displayField: "kategorie",
            optionDataSource: "einAusgabenSucheFelderDS",
            pickListProperties: {
                showShadow: false,
                showFilterEditor: false,
                showHeader: false
            },
            pickListWidth: dfEinAusgabenWidth - 5,
            pickListFields: [{
                    name: "kategorie",
                    width: "*"
                }
            ],
            getPickListFilterCriteria: function ()
            {
                var criteriaAll = setCriteria();
                var criteria = {};
                for (var crit in criteriaAll)
                {
                    if (crit != this.name)
                    {
                        criteria[crit] = criteriaAll[crit];
                    }
                }
                criteria['lookFor'] = this.name;
                return criteria;
            },
            changed: function (form, item, value)
            {
                fetchEinAusgaben(dfEinAusgabenFilter);
            }, icons: [{
                    src: "famfam/delete.png",
                    name: "kategorie_id",
                    width: 16,
                    height: 16,
                    prompt: "Inhalt des Feldes entfernen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfEinAusgabenFilter.getField(this.name).clearValue();
                        fetchEinAusgaben(dfEinAusgabenFilter);
                    }
                }]
        }, {
            name: "datum",
            type: "select",
            multiple: true,
            multipleAppearance: "picklist",
            required: false,
            colSpan: 1,
            hint: "Datum",
            title: "Datum",
            showHintInField: true,
            disabled: false,
            width: dfEinAusgabenWidth,
            showTitle: true,
            autoFetchData: false,
            valueField: "datum",
            displayField: "datum",
            optionDataSource: "einAusgabenSucheFelderDS",
            pickListProperties: {
                showShadow: false,
                showFilterEditor: false,
                showHeader: false
            },
            pickListWidth: dfEinAusgabenWidth - 5,
            pickListFields: [{
                    name: "datum",
                    width: "*"
                }
            ],
            getPickListFilterCriteria: function ()
            {
                var criteriaAll = setCriteria();
                var criteria = {};
                for (var crit in criteriaAll)
                {
                    if (crit != this.name)
                    {
                        criteria[crit] = criteriaAll[crit];
                    }
                }
                criteria['lookFor'] = this.name;
                return criteria;
            },
            changed: function (form, item, value)
            {
                fetchEinAusgaben(dfEinAusgabenFilter);
            }, icons: [{
                    src: "famfam/delete.png",
                    name: "datum",
                    width: 16,
                    height: 16,
                    prompt: "Inhalt des Feldes entfernen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfEinAusgabenFilter.getField(this.name).clearValue();
                        fetchEinAusgaben(dfEinAusgabenFilter);
                    }
                }, {
                    src: "famfam/date_go.png",
                    name: "datum2",
                    width: 16,
                    height: 16,
                    prompt: "Setzt das Feld auf das aktuelle Datum",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        setValue2Field(dfEinAusgabenFilter, dfEinAusgabenFilter.getField("datum"), _Heute_Ger);
                    }
                }]
        }, {
            name: "enddatum",
            type: "select",
            multiple: true,
            multipleAppearance: "picklist",
            required: false,
            hint: "Enddatum",
            title: "Enddatum",
            colSpan: 1,
            optionDataSource: "einAusgabenSucheFelderDS",
            showHintInField: true,
            disabled: false,
            width: dfEinAusgabenWidth,
            showTitle: true,
            valueField: "enddatum",
            autoFetchData: false,
            displayField: "enddatum",
            pickListProperties: {
                showShadow: false,
                showFilterEditor: false,
                showHeader: false
            },
            pickListWidth: dfEinAusgabenWidth - 5,
            pickListFields: [{
                    name: "enddatum",
                    width: 60
                }
            ],
            getPickListFilterCriteria: function ()
            {
                var criteriaAll = setCriteria();
                var criteria = {};
                for (var crit in criteriaAll)
                {
                    if (crit != this.name)
                    {
                        criteria[crit] = criteriaAll[crit];
                    }
                }
                criteria['lookFor'] = this.name;
                return criteria;
            },
            changed: function (form, item, value)
            {
                fetchEinAusgaben(dfEinAusgabenFilter);
            }, icons: [{
                    src: "famfam/delete.png",
                    name: "enddatum",
                    width: 16,
                    height: 16,
                    prompt: "Inhalt des Feldes entfernen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfEinAusgabenFilter.getField(this.name).clearValue();
                        fetchEinAusgaben(dfEinAusgabenFilter);
                    }
                }]
        }, {
            name: "art",
            type: "select",
            required: false,
            colSpan: 1,
            hint: "Ein- oder Ausgabe",
            title: "Ein- oder Ausgabe",
            showHintInField: true,
            disabled: false,
            width: dfEinAusgabenWidth,
            showTitle: true,
            optionDataSource: "einAusgabenSucheFelderDS",
            valueField: "art",
            autoFetchData: false,
            displayField: "art_bez",
            pickListProperties: {
                showShadow: false,
                showFilterEditor: false,
                showHeader: false
            },
            pickListWidth: dfEinAusgabenWidth - 5,
            pickListFields: [{
                    name: "art_bez",
                    width: 120
                }
            ],
            getPickListFilterCriteria: function ()
            {
                var criteriaAll = setCriteria();
                var criteria = {};
                for (var crit in criteriaAll)
                {
                    if (crit != this.name)
                    {
                        criteria[crit] = criteriaAll[crit];
                    }
                }
                criteria['lookFor'] = this.name;
                return criteria;
            },
            changed: function (form, item, value)
            {
                fetchEinAusgaben(dfEinAusgabenFilter);
            }, icons: [{
                    src: "famfam/delete.png",
                    name: "art",
                    width: 16,
                    height: 16,
                    prompt: "Inhalt des Feldes entfernen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfEinAusgabenFilter.getField(this.name).clearValue();
                        fetchEinAusgaben(dfEinAusgabenFilter);
                    }
                }]
        }, {
            name: "typ",
            type: "select",
            required: false,
            hint: "Fix- oder variable Kosten",
            title: "Fix- oder variable Kosten",
            colSpan: 1,
            showHintInField: true,
            disabled: false,
            width: dfEinAusgabenWidth,
            showTitle: true,
            optionDataSource: "einAusgabenSucheFelderDS",
            valueField: "typ",
            autoFetchData: false,
            displayField: "typ_bez",
            pickListProperties: {
                showShadow: false,
                showFilterEditor: false,
                showHeader: false
            },
            pickListWidth: dfEinAusgabenWidth - 5,
            pickListFields: [{
                    name: "typ_bez",
                    width: 120
                }
            ],
            getPickListFilterCriteria: function ()
            {
                var criteriaAll = setCriteria();
                var criteria = {};
                for (var crit in criteriaAll)
                {
                    if (crit != this.name)
                    {
                        criteria[crit] = criteriaAll[crit];
                    }
                }
                criteria['lookFor'] = this.name;
                return criteria;
            },
            changed: function (form, item, value)
            {
                fetchEinAusgaben(dfEinAusgabenFilter);
            }, icons: [{
                    src: "famfam/delete.png",
                    name: "typ",
                    width: 16,
                    height: 16,
                    prompt: "Inhalt des Feldes entfernen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfEinAusgabenFilter.getField(this.name).clearValue();
                        fetchEinAusgaben(dfEinAusgabenFilter);
                    }
                }]
        }, {
            name: "zahlungsmittel",
            type: "select",
            multiple: true,
            multipleAppearance: "picklist",
            required: false,
            hint: "Zahlungsmittel",
            title: "Zahlungsmittel",
            colSpan: 1,
            showHintInField: true,
            disabled: false,
            width: dfEinAusgabenWidth,
            showTitle: true,
            autoFetchData: false,
            valueField: "zahlungsmittel_id",
            displayField: "zahlungsmittel_bez",
            optionDataSource: "einAusgabenSucheFelderDS",
            pickListProperties: {
                showShadow: false,
                showFilterEditor: false,
                showHeader: false
            },
            pickListWidth: dfEinAusgabenWidth - 5,
            pickListFields: [{
                    name: "zahlungsmittel_bez",
                    width: "*"
                }
            ],
            getPickListFilterCriteria: function ()
            {
                var criteriaAll = setCriteria();
                var criteria = {};
                for (var crit in criteriaAll)
                {
                    if (crit != this.name)
                    {
                        criteria[crit] = criteriaAll[crit];
                    }
                }
                criteria['lookFor'] = this.name;
                return criteria;
            },
            changed: function (form, item, value)
            {
                fetchEinAusgaben(dfEinAusgabenFilter);
            }, icons: [{
                    src: "famfam/delete.png",
                    name: "zahlungsmittel",
                    width: 16,
                    height: 16,
                    prompt: "Inhalt des Feldes entfernen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfEinAusgabenFilter.getField(this.name).clearValue();
                        fetchEinAusgaben(dfEinAusgabenFilter);
                    }
                }]
        }, /*{
         name: "kontonr",
         type: "text",
         required: false,
         hint: "kontonr",
         colSpan: 1,
         showHintInField: true,
         disabled: false,
         width: dfEinAusgabenWidth,
         showTitle: true,
         autoFetchData: false,
         valueField: "kontonr",
         displayField: "bezeichnung",
         optionDataSource: "einAusgabenSucheFelderDS",
         pickListProperties: {
         showShadow: false,
         showFilterEditor: false,
         showHeader: false
         },
         pickListWidth: dfEinAusgabenWidth - 5,
         pickListFields: [{
         name: "kontonr",
         width: "*"
         }, {
         name: "bezeichnung",
         width: 120
         }
         ],
         getPickListFilterCriteria: function () {
         var criteriaAll = setCriteria();
         var criteria = {};
         for (var crit in criteriaAll) {
         if (crit != this.name) {
         criteria[crit] = criteriaAll[crit];
         }
         }
         criteria['lookFor'] = this.name;
         return criteria;
         },
         changed: function (form, item, value) {
         fetchEinAusgaben(dfEinAusgabenFilter);
         
         }, icons: [{
         src: "famfam/delete.png",
         name: "kontonr",
         width: 16,
         height: 16,
         prompt: "Inhalt des Feldes entfernen",
         hoverWidth: 300,
         hoverDelay: 700,
         click: function () {
         dfEinAusgabenFilter.getField(this.name).clearValue();
         fetchEinAusgaben(dfEinAusgabenFilter);
         }
         }]
         }, */{
            name: "vorgang",
            type: "select",
            multiple: true,
            multipleAppearance: "picklist",
            required: false,
            hint: "Vorgang",
            title: "Vorgang",
            colSpan: 1,
            showHintInField: true,
            disabled: false,
            width: dfEinAusgabenWidth,
            showTitle: true,
            autoFetchData: false,
            valueField: "vorgang",
            displayField: "vorgang",
            optionDataSource: "einAusgabenSucheFelderDS",
            pickListProperties: {
                showShadow: false,
                showFilterEditor: false,
                showHeader: false
            },
            pickListWidth: dfEinAusgabenWidth - 5,
            pickListFields: [{
                    name: "vorgang",
                    width: "*"
                }
            ],
            getPickListFilterCriteria: function ()
            {
                var criteriaAll = setCriteria();
                var criteria = {};
                for (var crit in criteriaAll)
                {
                    if (crit != this.name)
                    {
                        criteria[crit] = criteriaAll[crit];
                    }
                }
                criteria['lookFor'] = this.name;
                return criteria;
            },
            changed: function (form, item, value)
            {
                fetchEinAusgaben(dfEinAusgabenFilter);
            }, icons: [{
                    src: "famfam/delete.png",
                    name: "vorgang",
                    width: 16,
                    height: 16,
                    prompt: "Inhalt des Feldes entfernen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfEinAusgabenFilter.getField(this.name).clearValue();
                        fetchEinAusgaben(dfEinAusgabenFilter);
                    }
                }]
        }, {
            name: "herkunft",
            type: "select",
            multiple: true,
            multipleAppearance: "picklist",
            required: false,
            hint: "Herkunft",
            title: "Herkunft",
            colSpan: 1,
            showHintInField: true,
            disabled: false,
            width: dfEinAusgabenWidth,
            showTitle: true,
            autoFetchData: false,
            valueField: "herkunft",
            displayField: "herkunft",
            optionDataSource: "einAusgabenSucheFelderDS",
            pickListProperties: {
                showShadow: false,
                showFilterEditor: false,
                showHeader: false
            },
            pickListWidth: dfEinAusgabenWidth - 5,
            pickListFields: [{
                    name: "herkunft",
                    width: "*"
                }
            ],
            getPickListFilterCriteria: function ()
            {
                var criteriaAll = setCriteria();
                var criteria = {};
                for (var crit in criteriaAll)
                {
                    if (crit != this.name)
                    {
                        criteria[crit] = criteriaAll[crit];
                    }
                }
                criteria['lookFor'] = this.name;
                return criteria;
            },
            changed: function (form, item, value)
            {
                fetchEinAusgaben(dfEinAusgabenFilter);
            }, icons: [{
                    src: "famfam/delete.png",
                    name: "herkunft",
                    width: 16,
                    height: 16,
                    prompt: "Inhalt des Feldes entfernen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfEinAusgabenFilter.getField(this.name).clearValue();
                        fetchEinAusgaben(dfEinAusgabenFilter);
                    }
                }]
        }, {
            name: "interval",
            type: "select",
            multiple: true,
            multipleAppearance: "picklist",
            required: false,
            colSpan: 1,
            hint: "Zahlungsinterval",
            title: "Zahlungsinterval",
            showHintInField: true,
            disabled: false,
            width: dfEinAusgabenWidth,
            showTitle: true,
            autoFetchData: false,
            valueField: "interval",
            displayField: "int_bez",
            optionDataSource: "einAusgabenSucheFelderDS",
            pickListProperties: {
                showShadow: false,
                showFilterEditor: false,
                showHeader: false
            },
            pickListWidth: dfEinAusgabenWidth - 5,
            pickListFields: [{
                    name: "int_bez",
                    width: "*"
                }
            ],
            getPickListFilterCriteria: function ()
            {
                var criteriaAll = setCriteria();
                var criteria = {};
                for (var crit in criteriaAll)
                {
                    if (crit != this.name)
                    {
                        criteria[crit] = criteriaAll[crit];
                    }
                }
                criteria['lookFor'] = this.name;
                return criteria;
            },
            changed: function (form, item, value)
            {
                fetchEinAusgaben(dfEinAusgabenFilter);
            }, icons: [{
                    src: "famfam/delete.png",
                    name: "interval",
                    width: 16,
                    height: 16,
                    prompt: "Inhalt des Feldes entfernen",
                    hoverWidth: 300,
                    hoverDelay: 700,
                    click: function ()
                    {
                        dfEinAusgabenFilter.getField(this.name).clearValue();
                        fetchEinAusgaben(dfEinAusgabenFilter);
                    }
                }]
        }
    ]
});
/*
 * *************************** ToolStrip Button ********************************
 * =============================================================================
 */

isc.ToolStripButton.create({
    ID: "tsbEinAusgabeAdd",
    count: 1,
    action: function ()
    {
        wdEinAusgabe.show();
        dfEinAusgaben.clearValues();
        dfEinAusgaben.getField("action").setValue("add");
        wdEinAusgabe.setTitle("Hinzufügen eines neuen Vorgangs");
        setValue2Field(dfEinAusgaben, "detail", "N");
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
isc.ToolStripButton.create({
    ID: "tsbEinAusgabeEdit",
    count: 1,
    action: function ()
    {
        if (lgEinAusgaben.getSelection().length == 1)
        {
            var record = lgEinAusgaben.getSelectedRecord();
            dfEinAusgaben.editRecord(record);
            wdEinAusgabe.show();
            wdEinAusgabe.setTitle("Editieren eines Vorgangs");
            dfEinAusgaben.getField("action").setValue("edit");
            setValue2Field(dfEinAusgaben, 'typ', record.typ);
            setValue2Field(dfEinAusgaben, 'datum', record.datum);
//            setValue2Field(dfEinAusgaben, 'detail', record.detail);
            setValue2Field(dfEinAusgaben, "detail", record.detail);
            resetButtons(btnSpeichernEinAusgabe, btnResetEinAusgabe, btnCloseEinAusgabe);
        } else
        {
            isc.say("Bitte erst einen Datensatz wählen");
        }
    },
    prompt: "Daten bearbeiten",
    icon: "web/32/pencil.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700
});
isc.ToolStripButton.create({
    ID: "tsbEinAusgabeDelete",
    count: 1,
    action: function ()
    {

        if (lgEinAusgaben.getSelection().length == 1)
        {
            isc.ask("Wollen Sie wirklich das ausgewählte typ löschen?", function (value)
            {
                if (value)
                {
                    einAusg_id = lgEinAusgaben.getSelectedRecord().ID;
                    RPCManager.send("", function (rpcResponse, data, rpcRequest)
                    {
                        var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                        if (_data.response.status === 0)
                        {  // Status 0 bedeutet Keine Fehler

                            isc.say("Vorgang wurde erfolgreich gelöscht.");
                            fetchEinAusgaben(dfEinAusgabenFilter);
                        } else
                        { // Wenn die Validierungen Fehler aufweisen dann:                            
                            var _errors = _data.response.errors;
                            isc.say("<b>Fehler! </br>" + _errors + "</b>");
                        }
                    }, {// Übergabe der Parameter
                        actionURL: "api/einAusgabe_delete.php",
                        httpMethod: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        useSimpleHttp: true,
                        params: {
                            ID: einAusg_id}

                    }); //Ende RPC   
                }
            });
        } else
        {
            isc.say("Bitte erst einen Datensatz wählen");
        }
    },
    prompt: "Datensatz löschen",
    icon: "web/32/delete.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700
});
isc.ToolStripButton.create({
    ID: "tsbEinAusgabenDeleteDoc",
    count: 1,
    action: function ()
    {
        if (lgEinAusgaben.getSelection().length == 1 && lgEinAusgaben.getSelectedRecord().document != "")
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
                            fetchEinAusgaben(dfEinAusgabenFilter);
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
                            ID: lgEinAusgaben.getSelectedRecord().ID,
                            document: lgEinAusgaben.getSelectedRecord().document
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
isc.ToolStripButton.create({
    ID: "tsbEinAusgabeRefresh",
    count: 1,
    action: function ()
    {
        fetchEinAusgaben(dfEinAusgabenFilter);
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
    ID: "tsbUploadDocEinAusgabe",
    count: 0,
    action: function ()
    {
        if (htmlPaneDropZoneEinAusgabe.isVisible())
        {
            htmlPaneDropZoneEinAusgabe.hide();
        } else
        {
            if (lgEinAusgaben.getSelection().length == 1)
            {
                htmlPaneDropZoneEinAusgabe.show();
                tsbUploadDocEinAusgabe.count++;
                if (tsbUploadDocEinAusgabe.count == 1)
                {
                    isc.Timer.setTimeout(function ()
                    {
                        drop('drop_zone_einausgaben', lgEinAusgaben, 'statusEinAusgaben', 'uploadListEinAusgaben', "api/upload_document.php");
                    }, 500);
                }
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
/*
 * *********************** ANFANG MENU *************************
 * -------------------------------------------------------------
 */

isc.Menu.create({
    ID: "menuEinAusgabe",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    data: [
        {title: tsbEinAusgabeRefresh.prompt, icon: tsbEinAusgabeRefresh.icon, click: function ()
            {
                tsbEinAusgabeRefresh.action();
            }},
        {isSeparator: true},
        {title: tsbEinAusgabeEdit.prompt, icon: tsbEinAusgabeEdit.icon, click: function ()
            {
                tsbEinAusgabeEdit.action();
            }},
        {title: tsbEinAusgabeAdd.prompt, icon: tsbEinAusgabeAdd.icon, click: function ()
            {
                tsbEinAusgabeAdd.action();
            }},
        {title: tsbEinAusgabeDelete.prompt, icon: tsbEinAusgabeDelete.icon, click: function ()
            {
                tsbEinAusgabeDelete.action();
            }},
        {isSeparator: true},
        {title: tsbUploadDocEinAusgabe.prompt, icon: tsbUploadDocEinAusgabe.icon, click: function ()
            {
                tsbUploadDocEinAusgabe.action();
            }},
        {isSeparator: true},
        {title: tsbEinAusgabenDeleteDoc.prompt, icon: tsbEinAusgabenDeleteDoc.icon, click: function ()
            {
                tsbEinAusgabenDeleteDoc.action();
            }}
    ]
});
isc.MenuButton.create({
    ID: "mbEinAusgabe",
    autoDraw: false,
    title: "Menü",
    width: 100,
    menu: menuEinAusgabe
});
/*
 * *************************** Layouts *****************************************
 * =============================================================================
 */

isc.Label.create({
    padding: 0,
    ID: "lblEinAusgabe",
    width: "*",
    height: "100%",
    align: "center",
    contents: '<text style="color:' + titleLableColor + '; font-size:' + titleLableFontSize + '; font-family:' + titleLableFontFamily + '; text-decoration:none;">Ein- und Ausgaben Übersicht</text>'
});
isc.ToolStrip.create({
    ID: "tsEinAusgabe",
    width: "100%",
    backgroundImage: "backgrounds/leaves.jpg",
    height: 40,
    members: [mbEinAusgabe, isc.LayoutSpacer.create({width: 10}), dfEinAusgabeKonten, /*
     tsbEinAusgabeRefresh, isc.LayoutSpacer.create({width: 10}),
     tsbEinAusgabeAdd, isc.LayoutSpacer.create({width: 10}),
     tsbEinAusgabeEdit, isc.LayoutSpacer.create({width: 10}),
     tsbEinAusgabeDelete, isc.LayoutSpacer.create({width: 10}),
     tsbUploadDocEinAusgabe, */ isc.LayoutSpacer.create({width: "*"}),
        lblEinAusgabe, isc.LayoutSpacer.create({width: 5})]
});
isc.HLayout.create({
    ID: "HLayoutEinAusgabeFilter",
    height: "100%",
    width: 250,
    overflow: "auto",
    showResizeBar: true,
    members: [dfEinAusgabenFilter]});
isc.VLayout.create({
    ID: "VLayoutEinAusgabe",
//    overflow: "scroll",
    height: "100%",
    width: "100%",
    members: [tsEinAusgabe, htmlPaneDropZoneEinAusgabe, lgEinAusgaben]
});
isc.HLayout.create({
    ID: "HLayoutEinAusgabeFilter_List",
    height: "100%",
    width: "100%",
    members: [HLayoutEinAusgabeFilter, VLayoutEinAusgabe]});
/*
 * *************************** Initialisierung *********************************
 * =============================================================================
 */


addNode("HLayoutEinAusgabeFilter_List", {
    name: "HLayoutEinAusgabeFilter_List",
    cat: "Finanzen",
    onOpen: function ()
    {
        fetchEinAusgaben(dfEinAusgabenFilter);
        lgEinAusgaben.contextMenu = menuEinAusgabe;
        htmlPaneDropZoneEinAusgabe.hide();
//        PaneKredite.clear();
//        htmlPaneVergleichsGrafikKreditKarten.clear();
        clearCharts('');
        setValue2Field(dfEinAusgabenFilter, "monat_jahr", [_Monat]);
    },
    treenode: {
        Name: "HLayoutEinAusgabeFilter_List",
        icon: "web/16/cart.png",
        title: "Ein- und Ausgaben Übersicht",
        enabled: true
    },
    reflow: false
}
);




