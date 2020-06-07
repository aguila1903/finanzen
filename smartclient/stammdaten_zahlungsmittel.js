/* 
 *
 * FINANZEN ZAHLUNGSMITTEL
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
    ID: "zahlungsmitelStammDS",
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
        }, {
            name: "bezeichnung",
            type: "text"
        }, {
            name: "karten_nr",
            title: "Karten-Nr."
        }
    ]});




/*
 * ***************************** GoTo: Listen ************************************
 ---------------------------------------------------------------------------------
 */

isc.ListGrid.create({
    ID: "lgZahlungStamm",
    //   header: "Daten bearbeiten",
    width: "100%", height: "100%",
    alternateRecordStyles: true,
    dataSource: zahlungsmitelStammDS,
    autoFetchData: true,
    showFilterEditor: true,
    filterOnKeypress: true,
    fetchDelay: 500,
    selectionType: "single",
    showAllRecords: true,
    canExpandRecords: false,
    expansionMode: "details",
    margin: 0,
    initialSort: [{
            property: "bezeichnung",
            direction: "ascending"
        }
    ],
//    groupStartOpen: "all",
//    groupByField: ['typ_bez'],
    showGridSummary: true,
    fields: [
        {
            name: "ID",
            width: 200,
            title: "Kontonr"
        }, {
            name: "bezeichnung",
            width: "*",
            title: "Bezeichnung"
        }, {
            name: "karten_nr",
            width: "*",
            title: "Karten-Nr."
        }
    ], recordDoubleClick: function (viewer, record, recordNum, field, fieldNum, value, rawValue)
    {
        wdStammZahlungEdit.show();
        dfStammZahlungEdit.editRecord(record);
        dfStammZahlungEdit.getField("action").setValue("edit");
        wdStammZahlungEdit.setTitle("Editieren");
        dfStammZahlungEdit.getField("ID").setValue(record.ID);
    }, dataArrived: function ()
    {
    }
});


/*
 * ***************************** GoTo: DynaForm ********************************
 -------------------------------------------------------------------------------
 */


isc.DynamicForm.create({
    ID: "dfStammZahlungEdit",
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
    fields: [ {
            name: "ID",
            width: 300,
            required: true,
            type: "hidden"
        }, {
            name: "bezeichnung",
            title: "Bezeichnung",
            width: 300,
            required: true,
            type: "text",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernStammZahlungEdit, btnResetStammZahlungEdit, btnCloseStammZahlungEdit);
            }
        }, {
            name: "karten_nr",
            title: "Karten-Nr.",
            width: 300,
            required: false,
            type: "text",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernStammZahlungEdit, btnResetStammZahlungEdit, btnCloseStammZahlungEdit);
            }
        }, {
            name: "action",
            required: true,
            type: "hidden"
        }
    ]});

isc.IButton.create({
    ID: "btnCloseStammZahlungEdit",
    type: "button",
    disabled: false,
    icon: "famfam/door_in.png",
    name: "btnCloseStammZahlungEdit",
    showDisabledIcon: false,
    title: "Schließen", width: 100,
    click: function ()
    {
        if (btnCloseStammZahlungEdit.getTitle() == "Abbrechen")
        {
            isc.ask("Wollen Sie wirklich abbrechen? Nicht gespeicherte Daten könnten verloren gehen.", function (value)
            {
                if (value)
                {
                    wdStammZahlungEdit.hide();
                }
            }, {title: "Vorgang abbrechen?"});
        } else
        {
            wdStammZahlungEdit.hide();
        }
    }});
/*
 * ************************* Speicher-Prozedur Edit Umsatz **********************
 */
isc.IButton.create({
    ID: "btnSpeichernStammZahlungEdit",
    type: "button",
    disabled: true,
    count: 0,
    showDisabledIcon: false,
    icon: "famfam/database_save.png",
    name: "btnSpeichernStammZahlungEdit",
    title: "Speichern",
    width: 100,
    click: function ()
    {
        if (lgZahlungStamm.getSelection().length == 1)
        {
            var text = "editiert";
        } else
        {
            var text = "hinzugefügt";
        }
        if (dfStammZahlungEdit.validate())
        {
            zahlungStamm_id = dfStammZahlungEdit.getField("ID").getValue();
            RPCManager.send("", function (rpcResponse, data, rpcRequest)
            {
                var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)

                if (_data.response.status === 0)
                {  // Status 0 bedeutet Keine Fehler

                    lgZahlungStamm.invalidateCache();
                    if (!dfStammZahlungEdit.validate() && dfStammZahlungEdit.hasErrors())
                    {
                        dfStammZahlungEdit.setErrors();
                        var _errors = dfStammZahlungEdit.getErrors();
                        for (var i in _errors)
                        {
                            isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>"); // Hier wird jeder Wert des Array-Schlüssel angezeigt und das Feld oder die Feld-Bezeichnung ist irrelevant.
                        }
                    } else
                    {
                        isc.say("Datensatz wurde erfolgreich " + text, function (value)
                        {
                            if (value)
                            {
                                isc.Timer.setTimeout("btnSpeichernStammZahlungEdit.isLoadingAccountTimer()", 150);
                                resetButtons(btnSpeichernStammZahlungEdit, btnResetStammZahlungEdit, btnCloseStammZahlungEdit);
                                wdStammZahlungEdit.hide();
                            }

                        }, {title: "Datensatz einfügen"});
                    }

                    //                                isc.say(zahlungStamm_id);


                } else
                { // Wenn die Validierungen Fehler aufweisen dann:

                    dfStammZahlungEdit.setErrors(_data.response.errors, true);
                    var _errors = dfStammZahlungEdit.getErrors();
                    for (var i in _errors)
                    {
                        isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>");
                    }

                }
            }, {// Übergabe der Parameter
                actionURL: "api/zahlung_stamm_addEdit.php",
                httpMethod: "POST",
                contentType: "application/x-www-form-urlencoded",
                useSimpleHttp: true,
                params: {
                    bezeichnung: dfStammZahlungEdit.getField("bezeichnung").getValue(),
                    ID: dfStammZahlungEdit.getField("ID").getValue(),
                    karten_nr: dfStammZahlungEdit.getField("karten_nr").getValue(),
                    action: dfStammZahlungEdit.getField("action").getValue()
                }

            }); //Ende RPC
        } else
        {
            isc.say("Bitte erst alle benötigten Felder ausfüllen");
        }


    }, // Ende Click
    findeNewPayment: function ()
    {
        var ds = lgZahlungStamm.data.find("ID", zahlungStamm_id);
        var index = lgZahlungStamm.getRecordIndex(ds);
        lgZahlungStamm.deselectAllRecords();
        lgZahlungStamm.selectRecord(index);
        lgZahlungStamm.scrollToRow(index);
    },
    isLoadingAccountTimer: function ()
    {
        if (!Array.isLoading(dfStammZahlungEdit.getRecord(0)))
        {
            isc.Timer.setTimeout("btnSpeichernStammZahlungEdit.findeNewPayment()", 150);
        }
    }
});
isc.IButton.create({
    ID: "btnResetStammZahlungEdit",
    type: "button",
    showDisabledIcon: false,
    icon: "famfam/arrow_undo.png",
    disabled: true,
    name: "btnResetStammZahlungEdit",
    title: "Reset", width: 100,
    click: function ()
    {
        dfStammZahlungEdit.reset();

        var title = wdStammZahlungEdit.title.substr(0, 9);
        if (title == "Editieren")
        {
            dfStammZahlungEdit.getField("action").setValue("edit");
        } else
        {
            dfStammZahlungEdit.getField("action").setValue("add");
        }
        
        resetButtons(btnSpeichernStammZahlungEdit, btnResetStammZahlungEdit, btnCloseStammZahlungEdit);
    }});


isc.HLayout.create({
    ID: "HLayoutStmmKontenEdit",
    height: 30,
    width: "100%",
    align: "center",
    members: [btnCloseStammZahlungEdit, isc.LayoutSpacer.create({
            width: 20
        }), btnSpeichernStammZahlungEdit, isc.LayoutSpacer.create({
            width: 20
        }), btnResetStammZahlungEdit]});

currentIcon = "famfam/sum.png";
isc.Window.create({
    ID: "wdStammZahlungEdit",
    width: 500,
    height: 200,
    title: "Zahlungsmittel",
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
    items: [dfStammZahlungEdit, isc.LayoutSpacer.create({
            height: 20
        }), HLayoutStmmKontenEdit]});

isc.ToolStripButton.create({
    ID: "tsbStammKontenEdit",
    count: 1,
    action: function ()
    {
        if (lgZahlungStamm.getSelection().length == 1)
        {
            var record = lgZahlungStamm.getSelectedRecord();
            wdStammZahlungEdit.show();
            dfStammZahlungEdit.editRecord(record);
            wdStammZahlungEdit.title = "Editieren";
            dfStammZahlungEdit.getField("action").setValue("edit");
            dfStammZahlungEdit.getField("ID").setValue(record.ID);
        } else
        {
            isc.say("Bitte erst einen Datensatz wählen");
        }
    },
    prompt: "Zahlungsmittel editieren",
    icon: "web/32/pencil.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700
});

isc.ToolStripButton.create({
    ID: "tsbStammKontenAdd",
    count: 1,
    action: function ()
    {

        wdStammZahlungEdit.show();
        dfStammZahlungEdit.clearValues();
        resetButtons(btnSpeichernStammZahlungEdit, btnResetStammZahlungEdit, btnCloseStammZahlungEdit);
        wdStammZahlungEdit.title = "Hinzufügen";
        dfStammZahlungEdit.getField("action").setValue("add");

    },
    prompt: "Kategorie editieren",
    icon: "web/32/add.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700
});



/*
 * GoTo: ************************ Lösche Konto *********************************
 * =============================================================================
 */

isc.ToolStripButton.create({
    ID: "tsbStammKontenDelete",
    count: 1,
    action: function ()
    {
        if (lgZahlungStamm.getSelection().length == 1)
        {
            isc.ask("Wollen Sie wirklich das ausgewählte Konto löschen?", function (value)
            {
                if (value)
                {
                    zahlungStamm_id = lgZahlungStamm.getSelectedRecord().ID;
                    RPCManager.send("", function (rpcResponse, data, rpcRequest)
                    {
                        var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                        if (_data.response.status === 0)
                        {  // Status 0 bedeutet Keine Fehler

                            isc.say("Konto wurde erfolgreich gelöscht.");
                            lgZahlungStamm.invalidateCache();

                        } else
                        { // Wenn die Validierungen Fehler aufweisen dann:                            
                            var _errors = _data.response.errors;
                            isc.say("<b>Fehler! </br>" + _errors + "</b>");
                        }
                    }, {// Übergabe der Parameter
                        actionURL: "api/zahlung_stamm_delete.php",
                        httpMethod: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        useSimpleHttp: true,
                        params: {
                            ID: zahlungStamm_id}

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
 * *********************** ANFANG MENU *************************
 * -------------------------------------------------------------
 */

isc.Menu.create({
    ID: "menuZahlung",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    data: [
        {title: tsbStammKontenAdd.prompt, icon: tsbStammKontenAdd.icon, click: function ()
            {
                tsbStammKontenAdd.action();
            }},
        {title: tsbStammKontenEdit.prompt, icon: tsbStammKontenEdit.icon, click: function ()
            {
                tsbStammKontenEdit.action();
            }},
        {title: tsbStammKontenDelete.prompt, icon: tsbStammKontenDelete.icon, click: function ()
            {
                tsbStammKontenDelete.action();
            }}
    ]
});

/*
 * *************************** Layouts *****************************************
 * =============================================================================
 */

isc.Label.create({
    padding: 0,
    ID: "lblStammZahlung",
    width: 300,
    height: "100%",
    align: "center",
    contents: '<text style="color:' + titleLableColor + '; font-size:' + titleLableFontSize + '; font-family:' + titleLableFontFamily + '; text-decoration:none;">Zahlungsmittel</text>'
});


isc.ToolStrip.create({
    ID: "tsStammZahlung",
    width: "100%",
    backgroundImage: "backgrounds/leaves.jpg",
    height: 40,
    members: [tsbStammKontenAdd, isc.LayoutSpacer.create({width: 10}), tsbStammKontenEdit, isc.LayoutSpacer.create({width: 10}), tsbStammKontenDelete, isc.LayoutSpacer.create({width: "*"}), lblStammZahlung, isc.LayoutSpacer.create({width: 5})]
});

isc.VLayout.create({
    ID: "VLayoutStammZahlung",
    height: "100%",
    width: "100%",
    members: [tsStammZahlung, lgZahlungStamm]
});


/*
 * *************************** Initialisierung *********************************
 * =============================================================================
 */



addNode("VLayoutStammZahlung", {
    name: "VLayoutStammZahlung",
    cat: "Stammdaten",
    onOpen: function ()
    {
        lgZahlungStamm.contextMenu = menuZahlung;
        clearCharts('');
    },
    treenode: {
        Name: "VLayoutStammZahlung",
        icon: "web/16/card_front.png",
        title: "Zahlungsmittel verwalten",
        enabled: true
    },
    reflow: false
}
);




