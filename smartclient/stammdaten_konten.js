/* 
 *
 * FINANZEN KONTEN
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
    ID: "kontenStammDS",
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
            name: "kontonr",
            primaryKey: true
        }, {
            name: "kontotyp",
            type: "text"
        }, {
            name: "typ_bez",
            type: "text"
        }, {
            name: "bezeichnung",
            type: "text"
        }
    ]});

isc.DataSource.create({
    ID: "kontotypDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/kontotypDS.php"
        }
    ],
    titleField: "text",
    fields: [
        {
            name: "kontotyp",
            primaryKey: true
        }, {
            name: "bezeichnung",
            type: "text"
        }
    ]});




/*
 * ***************************** GoTo: Listen ************************************
 ---------------------------------------------------------------------------------
 */

isc.ListGrid.create({
    ID: "lgKontenStamm",
    //   header: "Daten bearbeiten",
    width: "100%", height: "100%",
    alternateRecordStyles: true,
    dataSource: kontenStammDS,
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
            name: "kontonr",
            width: 200,
            title: "IBAN"
        }, {
            name: "bezeichnung",
            width: "*",
            title: "Bezeichnung"
        },
        {
            name: "kontotyp",
            title: "Typ",
            showIf: "false"
        },
        {
            name: "typ_bez",
            title: "Typ",
            width: 200
        }
    ], recordDoubleClick: function (viewer, record, recordNum, field, fieldNum, value, rawValue)
    {
        wdStammKontenEdit.show();
        dfStammKontenEdit.editRecord(record);
        dfStammKontenEdit.getField("action").setValue("edit");
        wdStammKontenEdit.setTitle("Editieren des Kontos");
        dfStammKontenEdit.getField("kontonrOld").setValue(record.kontonr);
    }, dataArrived: function ()
    {
    }
});


/*
 * ***************************** GoTo: DynaForm ********************************
 -------------------------------------------------------------------------------
 */


isc.DynamicForm.create({
    ID: "dfStammKontenEdit",
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
            name: "kontotyp",
            title: "Kontenart",
            width: 150,
            optionDataSource: kontotypDS,
            valueField: "kontotyp",
            displayField: "bezeichnung",
            required: true,
//            defaultValue: "Konto wählen",
            pickListProperties: {showShadow: false, showFilterAddor: false, showHeader: false},
            pickListWidth: 250,
            pickListFields: [
                {name: "bezeichnung", width: 140}, {name: "kontotyp", width: 100}],
            getPickListFilterCriteria: function ()
            {
                var filter = {
                    count: ++dfStammKontenEdit.monCnt};
                return filter;
            },
            type: "select",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernStammKontenEdit, btnResetStammKontenEdit, btnCloseStammKontenEdit);
            }
        }, {
            name: "kontonr",
            title: "IBAN",
            width: 300,
            required: true,
            type: "text",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernStammKontenEdit, btnResetStammKontenEdit, btnCloseStammKontenEdit);
            }
        }, {
            name: "bezeichnung",
            title: "Bezeichnung",
            width: 300,
            required: true,
            type: "text",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernStammKontenEdit, btnResetStammKontenEdit, btnCloseStammKontenEdit);
            }
        }, {
            name: "action",
            required: true,
            type: "hidden"
        }, {
            name: "kontonrOld",
            type: "hidden"
        }
    ]});

isc.IButton.create({
    ID: "btnCloseStammKontenEdit",
    type: "button",
    disabled: false,
    icon: "famfam/door_in.png",
    name: "btnCloseStammKontenEdit",
    showDisabledIcon: false,
    title: "Schließen", width: 100,
    click: function ()
    {
        if (btnCloseStammKontenEdit.getTitle() == "Abbrechen")
        {
            isc.ask("Wollen Sie wirklich abbrechen? Nicht gespeicherte Daten könnten verloren gehen.", function (value)
            {
                if (value)
                {
                    wdStammKontenEdit.hide();
                }
            }, {title: "Vorgang abbrechen?"});
        } else
        {
            wdStammKontenEdit.hide();
        }
    }});
/*
 * ************************* Speicher-Prozedur Edit Umsatz **********************
 */
isc.IButton.create({
    ID: "btnSpeichernStammKontenEdit",
    type: "button",
    disabled: true,
    count: 0,
    showDisabledIcon: false,
    icon: "famfam/database_save.png",
    name: "btnSpeichernStammKontenEdit",
    title: "Speichern",
    width: 100,
    click: function ()
    {
        if (lgKontenStamm.getSelection().length == 1)
        {
            var text = "editiert";
        } else
        {
            var text = "hinzugefügt";
        }
        if (dfStammKontenEdit.validate())
        {
            kontoStamm_id = dfStammKontenEdit.getField("kontonr").getValue();
            RPCManager.send("", function (rpcResponse, data, rpcRequest)
            {
                var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)

                if (_data.response.status === 0)
                {  // Status 0 bedeutet Keine Fehler

                    lgKontenStamm.invalidateCache();
                    if (!dfStammKontenEdit.validate() && dfStammKontenEdit.hasErrors())
                    {
                        dfStammKontenEdit.setErrors();
                        var _errors = dfStammKontenEdit.getErrors();
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
                                isc.Timer.setTimeout("btnSpeichernStammKontenEdit.isLoadingAccountTimer()", 150);
                                resetButtons(btnSpeichernStammKontenEdit, btnResetStammKontenEdit, btnCloseStammKontenEdit);
                                wdStammKontenEdit.hide();
                            }

                        }, {title: "Datensatz einfügen"});
                    }

                    //                                isc.say(kontoStamm_id);


                } else
                { // Wenn die Validierungen Fehler aufweisen dann:

                    dfStammKontenEdit.setErrors(_data.response.errors, true);
                    var _errors = dfStammKontenEdit.getErrors();
                    for (var i in _errors)
                    {
                        isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>");
                    }

                }
            }, {// Übergabe der Parameter
                actionURL: "api/konten_stamm_addEdit.php",
                httpMethod: "POST",
                contentType: "application/x-www-form-urlencoded",
                useSimpleHttp: true,
                params: {
                    bezeichnung: dfStammKontenEdit.getField("bezeichnung").getValue(),
                    kontotyp: dfStammKontenEdit.getField("kontotyp").getValue(),
                    kontonrNew: dfStammKontenEdit.getField("kontonr").getValue(),
                    kontonrOld: dfStammKontenEdit.getField("kontonrOld").getValue(),
                    action: dfStammKontenEdit.getField("action").getValue()
                }

            }); //Ende RPC
        } else
        {
            isc.say("Bitte erst alle benötigten Felder ausfüllen");
        }


    }, // Ende Click
    findNewAccount: function ()
    {
        var ds = lgKontenStamm.data.find("kontonr", kontoStamm_id);
        var index = lgKontenStamm.getRecordIndex(ds);
        lgKontenStamm.deselectAllRecords();
        lgKontenStamm.selectRecord(index);
        lgKontenStamm.scrollToRow(index);
    },
    isLoadingAccountTimer: function ()
    {
        if (!Array.isLoading(dfStammKontenEdit.getRecord(0)))
        {
            isc.Timer.setTimeout("btnSpeichernStammKontenEdit.findNewAccount()", 150);
        }
    }
});
isc.IButton.create({
    ID: "btnResetStammKontenEdit",
    type: "button",
    showDisabledIcon: false,
    icon: "famfam/arrow_undo.png",
    disabled: true,
    name: "btnResetStammKontenEdit",
    title: "Reset", width: 100,
    click: function ()
    {
        dfStammKontenEdit.reset();

        var title = wdStammKontenEdit.title.substr(0, 9);
        if (title == "Editieren")
        {
            dfStammKontenEdit.getField("action").setValue("edit");
        } else
        {
            dfStammKontenEdit.getField("action").setValue("add");
        }
        
        resetButtons(btnSpeichernStammKontenEdit, btnResetStammKontenEdit, btnCloseStammKontenEdit);
    }});


isc.HLayout.create({
    ID: "HLayoutStammKontenEdit",
    height: 30,
    width: "100%",
    align: "center",
    members: [btnCloseStammKontenEdit, isc.LayoutSpacer.create({
            width: 20
        }), btnSpeichernStammKontenEdit, isc.LayoutSpacer.create({
            width: 20
        }), btnResetStammKontenEdit]});

currentIcon = "famfam/sum.png";
isc.Window.create({
    ID: "wdStammKontenEdit",
    width: 500,
    height: 200,
    title: "Konto editieren",
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
    items: [dfStammKontenEdit, isc.LayoutSpacer.create({
            height: 20
        }), HLayoutStammKontenEdit]});

isc.ToolStripButton.create({
    ID: "tsbStammKontenEdit",
    count: 1,
    action: function ()
    {
        if (lgKontenStamm.getSelection().length == 1)
        {
            var record = lgKontenStamm.getSelectedRecord();
            wdStammKontenEdit.show();
            dfStammKontenEdit.editRecord(record);
            wdStammKontenEdit.title = "Editieren des Kontos";
            dfStammKontenEdit.getField("action").setValue("edit");
            dfStammKontenEdit.getField("kontonrOld").setValue(record.kontonr);
        } else
        {
            isc.say("Bitte erst ein Konto wählen");
        }
    },
    prompt: "Konto editieren",
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

        wdStammKontenEdit.show();
        dfStammKontenEdit.clearValues();
        resetButtons(btnSpeichernStammKontenEdit, btnResetStammKontenEdit, btnCloseStammKontenEdit);
        wdStammKontenEdit.title = "Konto hinzufügen";
        dfStammKontenEdit.getField("action").setValue("add");

    },
    prompt: "Konto hinzufügen",
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
        if (lgKontenStamm.getSelection().length == 1)
        {
            isc.ask("Wollen Sie wirklich das ausgewählte Konto löschen?", function (value)
            {
                if (value)
                {
                    kontoStamm_id = lgKontenStamm.getSelectedRecord().kontonr;
                    RPCManager.send("", function (rpcResponse, data, rpcRequest)
                    {
                        var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                        if (_data.response.status === 0)
                        {  // Status 0 bedeutet Keine Fehler

                            isc.say("Konto wurde erfolgreich gelöscht.");
                            lgKontenStamm.invalidateCache();

                        } else
                        { // Wenn die Validierungen Fehler aufweisen dann:                            
                            var _errors = _data.response.errors;
                            isc.say("<b>Fehler! </br>" + _errors + "</b>");
                        }
                    }, {// Übergabe der Parameter
                        actionURL: "api/konto_stamm_delete.php",
                        httpMethod: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        useSimpleHttp: true,
                        params: {
                            kontonr: kontoStamm_id}

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
    ID: "menuKonten",
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
    ID: "lblStammKonten",
    width: 300,
    height: "100%",
    align: "center",
    contents: '<text style="color:' + titleLableColor + '; font-size:' + titleLableFontSize + '; font-family:' + titleLableFontFamily + '; text-decoration:none;">Konten</text>'
});


isc.ToolStrip.create({
    ID: "tsStammKonten",
    width: "100%",
    backgroundImage: "backgrounds/leaves.jpg",
    height: 40,
    members: [tsbStammKontenAdd, isc.LayoutSpacer.create({width: 10}), 
        tsbStammKontenEdit, isc.LayoutSpacer.create({width: 10}), 
        tsbStammKontenDelete, isc.LayoutSpacer.create({width: "*"}), 
        lblStammKonten, isc.LayoutSpacer.create({width: 5})]
});

isc.VLayout.create({
    ID: "VLayoutStammKonten",
    height: "100%",
    width: "100%",
    members: [tsStammKonten, lgKontenStamm]
});


/*
 * *************************** Initialisierung *********************************
 * =============================================================================
 */



addNode("VLayoutStammKonten", {
    name: "VLayoutStammKonten",
    cat: "Stammdaten",
    onOpen: function ()
    {
        lgKontenStamm.contextMenu = menuKonten;
        clearCharts('');
    },
    treenode: {
        Name: "VLayoutStammKonten",
        icon: "web/16/card_bank.png",
        title: "Konten verwalten",
        enabled: true
    },
    reflow: false
}
);




