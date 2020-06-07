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

var counter = 0;

/*
 * *********************** GoTo: FUNKTIONEN ************************************
 * =============================================================================
 */


/*
 * ************************ GoTo: DataSources ************************
 */

isc.DataSource.create({
    ID: "kategorienStammDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/kategorienStammDS.php"
        }
    ],
    titleField: "text",
    fields: [
        {
            name: "ID",
            primaryKey: true
        }, {
            name: "typ",
            type: "text"
        }, {
            name: "typ_bez",
            type: "text"
        },
        {
            name: "art",
            type: "text"
        },
        {
            name: "art_bez",
            type: "text"
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
    ID: "lgKategorienStamm",
    //   header: "Daten bearbeiten",
    width: "100%", height: "100%",
    alternateRecordStyles: true,
    dataSource: kategorienStammDS,
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
        }, {
            property: "art_bez",
            direction: "ascending"
        }
    ],
    groupStartOpen: "all",
    groupByField: ['typ_bez'],
    showGridSummary: true,
    fields: [
        {
            name: "ID",
            width: 70,
            title: "ID"
        }, {
            name: "bezeichnung",
            width: "*",
            title: "Bezeichnung"
        },
        {
            name: "typ",
            title: "Typ",
            showIf: "false"
        },
        {
            name: "typ_bez",
            title: "Typ",
            width: 200
        },
        {
            name: "art",
            title: "Art",
            showIf: "false"
        },
        {
            name: "art_bez",
            title: "Art",
            width: 200,
            showIf: "false"
        }
    ], recordDoubleClick: function (viewer, record, recordNum, field, fieldNum, value, rawValue)
    {
        wdStammKategorienEdit.show();
        dfStammKategorienEdit.editRecord(record);
    }, dataArrived: function ()
    {
    }
});


/*
 * ***************************** GoTo: Add Kategorie ***************************
 -------------------------------------------------------------------------------
 */

isc.DynamicForm.create({
    ID: "dfStammKategorienAdd",
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
            title: "Kostenart",
            width: 300,
            required: false,
            type: "hidden",
            redrawOnChange: true,
            vertical: false,
            valueMap: {"A": "Ausgabe", "E": "Einnahme"},
            defaultValue: "N",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernStammKategorienAdd, btnResetStammKategorienAdd, btnCloseStammKategorienAdd);
            }
        }, {
            name: "typ",
            title: "Kostentyp",
            width: 300,
            required: true,
            type: "radioGroup",
            redrawOnChange: true,
            vertical: false,
            valueMap: {"V": "Variabel", "F": "Fix"},
            defaultValue: "V",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernStammKategorienAdd, btnResetStammKategorienAdd, btnCloseStammKategorienAdd);
            }
        }, {
            name: "bezeichnung",
            title: "Bezeichnung",
            width: 300,
            required: true,
            type: "text",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernStammKategorienAdd, btnResetStammKategorienAdd, btnCloseStammKategorienAdd);
            }
        }
    ]});

isc.IButton.create({
    ID: "btnCloseStammKategorienAdd",
    type: "button",
    disabled: false,
    icon: "famfam/door_in.png",
    name: "btnCloseStammKategorienAdd",
    showDisabledIcon: false,
    title: "Schließen", width: 100,
    click: function ()
    {
        if (btnCloseStammKategorienAdd.getTitle() == "Abbrechen")
        {
            isc.ask("Wollen Sie wirklich abbrechen? Nicht gespeicherte Daten könnten verloren gehen.", function (value)
            {
                if (value)
                {
                    wdStammKategorienAdd.hide();
                }
            }, {title: "Vorgang abbrechen?"});
        } else
        {
            wdStammKategorienAdd.hide();
        }
    }});
/*
 * ************************* Speicher-Prozedur Add Umsatz **********************
 */
isc.IButton.create({
    ID: "btnSpeichernStammKategorienAdd",
    type: "button",
    disabled: true,
    count: 0,
    showDisabledIcon: false,
    icon: "famfam/database_save.png",
    name: "btnSpeichernStammKategorienAdd",
    title: "Speichern",
    width: 100,
    click: function ()
    {
        if (dfStammKategorienAdd.validate())
        {
            RPCManager.send("", function (rpcResponse, data, rpcRequest)
            {
                var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)

                if (_data.response.status === 0)
                {  // Status 0 bedeutet Keine Fehler
                    katStamm_id = _data.response.data["ID"];
                    lgKategorienStamm.invalidateCache();
                    if (!dfStammKategorienAdd.validate() && dfStammKategorienAdd.hasErrors())
                    {
                        dfStammKategorienAdd.setErrors();
                        var _errors = dfStammKategorienAdd.getErrors();
                        for (var i in _errors)
                        {
                            isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>"); // Hier wird jeder Wert des Array-Schlüssel angezeigt und das Feld oder die Feld-Bezeichnung ist irrelevant.
                        }
                    } else
                    {
                        isc.ask("Datensatz wurde erfolgreich eingefügt.<br>Wollen Sie einen weitere Kategorie einfügen?", function (value)
                        {
                            if (value)
                            {
                                isc.Timer.setTimeout("btnSpeichernStammKategorienAdd.isLoadingUmsatzTimer()", 150);
                                resetButtons(btnSpeichernStammKategorienAdd, btnResetStammKategorienAdd, btnCloseStammKategorienAdd);
                            } else
                            {
                                isc.Timer.setTimeout("btnSpeichernStammKategorienAdd.isLoadingUmsatzTimer()", 150);
                                resetButtons(btnSpeichernStammKategorienAdd, btnResetStammKategorienAdd, btnCloseStammKategorienAdd);
                                wdStammKategorienAdd.hide();
                            }

                        }, {title: "Datensatz einfügen"});
                    }

                    //                                isc.say(katStamm_id);


                } else
                { // Wenn die Validierungen Fehler aufweisen dann:

                    dfStammKategorienAdd.setErrors(_data.response.errors, true);
                    var _errors = dfStammKategorienAdd.getErrors();
                    for (var i in _errors)
                    {
                        isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>");
                    }

                }
            }, {// Übergabe der Parameter
                actionURL: "api/kategorie_stamm_add.php",
                httpMethod: "POST",
                contentType: "application/x-www-form-urlencoded",
                useSimpleHttp: true,
                params: {
                    bezeichnung: dfStammKategorienAdd.getField("bezeichnung").getValue(),
                    typ: dfStammKategorienAdd.getField("typ").getValue(),
                    art: dfStammKategorienAdd.getField("art").getValue()
                }

            }); //Ende RPC
        } else
        {
            isc.say("Bitte erst alle benötigten Felder ausfüllen");
        }

    }, // Ende Click
    findNewUmsatz: function ()
    {
        var ds = lgKategorienStamm.data.find("ID", katStamm_id);
        var index = lgKategorienStamm.getRecordIndex(ds);
        lgKategorienStamm.deselectAllRecords();
        lgKategorienStamm.selectRecord(index);
        lgKategorienStamm.scrollToRow(index);
    },
    isLoadingUmsatzTimer: function ()
    {
        if (!Array.isLoading(dfStammKategorienAdd.getRecord(0)))
        {
            isc.Timer.setTimeout("btnSpeichernStammKategorienAdd.findNewUmsatz()", 150);
        }
    }
});
isc.IButton.create({
    ID: "btnResetStammKategorienAdd",
    type: "button",
    showDisabledIcon: false,
    icon: "famfam/arrow_undo.png",
    disabled: true,
    name: "btnResetStammKategorienAdd",
    title: "Reset", width: 100,
    click: function ()
    {
        dfStammKategorienAdd.reset();
        btnSpeichernStammKategorienAdd.setDisabled(true);
        btnResetStammKategorienAdd.setDisabled(true);
        btnCloseStammKategorienAdd.setTitle("Schließen");
        btnCloseStammKategorienAdd.setIcon("famfam/door_in.png");
    }});
isc.HLayout.create({
    ID: "HLayoutStmmKategorienAdd",
    height: 30,
    width: "100%",
    align: "center",
    members: [btnCloseStammKategorienAdd, isc.LayoutSpacer.create({
            width: 20
        }), btnSpeichernStammKategorienAdd, isc.LayoutSpacer.create({
            width: 20
        }), btnResetStammKategorienAdd]});

currentIcon = "famfam/sum.png";
isc.Window.create({
    ID: "wdStammKategorienAdd",
    width: 500,
    height: 200,
    title: "Neue Kategorie erstellen",
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
    items: [dfStammKategorienAdd, isc.LayoutSpacer.create({
            height: 20
        }), HLayoutStmmKategorienAdd]});

isc.ToolStripButton.create({
    ID: "tsbStammKategorienAdd",
    count: 1,
    action: function ()
    {
        wdStammKategorienAdd.show();
        btnResetStammKategorienAdd.click();
    },
    prompt: "Neue Kategorie erstellen",
    icon: "web/32/add.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700
});

/*
 * ***************************** GoTo: Edit Kategorie **************************
 -------------------------------------------------------------------------------
 */



/*
 * ***************************** GoTo: Edit Kategorie **************************
 -------------------------------------------------------------------------------
 */

isc.DynamicForm.create({
    ID: "dfStammKategorienEdit",
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
            name: "ID",
            title: "ID",
            required: true,
            type: "hidden",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernStammKategorienEdit, btnResetStammKategorienEdit, btnCloseStammKategorienEdit);
            }
        }, {
            name: "art",
            title: "Kostenart",
            width: 300,
            required: false,
            type: "hidden",
            redrawOnChange: true,
            vertical: false,
            valueMap: {"A": "Ausgabe", "E": "Einnahme"},
            defaultValue: "N",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernStammKategorienEdit, btnResetStammKategorienEdit, btnCloseStammKategorienEdit);
            }
        }, {
            name: "typ",
            title: "Kostentyp",
            width: 300,
            required: true,
            type: "radioGroup",
            redrawOnChange: true,
            vertical: false,
            valueMap: {"V": "Variabel", "F": "Fix"},
            defaultValue: "V",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernStammKategorienEdit, btnResetStammKategorienEdit, btnCloseStammKategorienEdit);
            }
        }, {
            name: "bezeichnung",
            title: "Bezeichnung",
            width: 300,
            required: true,
            type: "text",
            changed: function (form, item, value)
            {
                changeFunction(btnSpeichernStammKategorienEdit, btnResetStammKategorienEdit, btnCloseStammKategorienEdit);
            }
        }
    ]});

isc.IButton.create({
    ID: "btnCloseStammKategorienEdit",
    type: "button",
    disabled: false,
    icon: "famfam/door_in.png",
    name: "btnCloseStammKategorienEdit",
    showDisabledIcon: false,
    title: "Schließen", width: 100,
    click: function ()
    {
        if (btnCloseStammKategorienEdit.getTitle() == "Abbrechen")
        {
            isc.ask("Wollen Sie wirklich abbrechen? Nicht gespeicherte Daten könnten verloren gehen.", function (value)
            {
                if (value)
                {
                    wdStammKategorienEdit.hide();
                }
            }, {title: "Vorgang abbrechen?"});
        } else
        {
            wdStammKategorienEdit.hide();
        }
    }});
/*
 * ************************* Speicher-Prozedur Edit Umsatz **********************
 */
isc.IButton.create({
    ID: "btnSpeichernStammKategorienEdit",
    type: "button",
    disabled: true,
    count: 0,
    showDisabledIcon: false,
    icon: "famfam/database_save.png",
    name: "btnSpeichernStammKategorienEdit",
    title: "Speichern",
    width: 100,
    click: function ()
    {
        if (lgKategorienStamm.getSelection().length == 1)
        {
            if (dfStammKategorienEdit.validate())
            {
                katStamm_id = lgKategorienStamm.getSelectedRecord().ID;
                RPCManager.send("", function (rpcResponse, data, rpcRequest)
                {
                    var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)

                    if (_data.response.status === 0)
                    {  // Status 0 bedeutet Keine Fehler

                        lgKategorienStamm.invalidateCache();
                        if (!dfStammKategorienEdit.validate() && dfStammKategorienEdit.hasErrors())
                        {
                            dfStammKategorienEdit.setErrors();
                            var _errors = dfStammKategorienEdit.getErrors();
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
                                    isc.Timer.setTimeout("btnSpeichernStammKategorienEdit.isLoadingUmsatzTimer()", 150);
                                    resetButtons(btnSpeichernStammKategorienEdit, btnResetStammKategorienEdit, btnCloseStammKategorienEdit);
                                    wdStammKategorienEdit.hide();
                                }

                            }, {title: "Datensatz einfügen"});
                        }

                        //                                isc.say(katStamm_id);


                    } else
                    { // Wenn die Validierungen Fehler aufweisen dann:

                        dfStammKategorienEdit.setErrors(_data.response.errors, true);
                        var _errors = dfStammKategorienEdit.getErrors();
                        for (var i in _errors)
                        {
                            isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>");
                        }

                    }
                }, {// Übergabe der Parameter
                    actionURL: "api/kategorie_stamm_edit.php",
                    httpMethod: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    useSimpleHttp: true,
                    params: {
                        ID: dfStammKategorienEdit.getField("ID").getValue(),
                        bezeichnung: dfStammKategorienEdit.getField("bezeichnung").getValue(),
                        typ: dfStammKategorienEdit.getField("typ").getValue(),
                        art: dfStammKategorienEdit.getField("art").getValue()
                    }

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
    findNewUmsatz: function ()
    {
        var ds = lgKategorienStamm.data.find("ID", katStamm_id);
        var index = lgKategorienStamm.getRecordIndex(ds);
        lgKategorienStamm.deselectAllRecords();
        lgKategorienStamm.selectRecord(index);
        lgKategorienStamm.scrollToRow(index);
    },
    isLoadingUmsatzTimer: function ()
    {
        if (!Array.isLoading(dfStammKategorienEdit.getRecord(0)))
        {
            isc.Timer.setTimeout("btnSpeichernStammKategorienEdit.findNewUmsatz()", 150);
        }
    }
});
isc.IButton.create({
    ID: "btnResetStammKategorienEdit",
    type: "button",
    showDisabledIcon: false,
    icon: "famfam/arrow_undo.png",
    disabled: true,
    name: "btnResetStammKategorienEdit",
    title: "Reset", width: 100,
    click: function ()
    {
        dfStammKategorienEdit.reset();
        resetButtons(btnSpeichernStammKategorienEdit, btnResetStammKategorienEdit, btnCloseStammKategorienEdit);
    }});

isc.HLayout.create({
    ID: "HLayoutStmmKategorienEdit",
    height: 30,
    width: "100%",
    align: "center",
    members: [btnCloseStammKategorienEdit, isc.LayoutSpacer.create({
            width: 20
        }), btnSpeichernStammKategorienEdit, isc.LayoutSpacer.create({
            width: 20
        }), btnResetStammKategorienEdit]
});

currentIcon = "famfam/sum.png";
isc.Window.create({
    ID: "wdStammKategorienEdit",
    width: 500,
    height: 200,
    title: "Kategorie editieren",
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
    items: [dfStammKategorienEdit, isc.LayoutSpacer.create({
            height: 20
        }), HLayoutStmmKategorienEdit]});

isc.ToolStripButton.create({
    ID: "tsbStammKategorienEdit",
    count: 1,
    action: function ()
    {
        var record = lgKategorienStamm.getSelectedRecord();
        wdStammKategorienEdit.show();
        dfStammKategorienEdit.editRecord(record);
    },
    prompt: "Kategorie editieren",
    icon: "web/32/pencil.png",
    title: "",
    showDisabledIcon: false,
    iconHeight: 32,
    iconWidth: 32,
    hoverWidth: 100,
    hoverDelay: 700
});



/*
 * GoTo: ************************ Lösche Kategorie *****************************
 * =============================================================================
 */

isc.ToolStripButton.create({
    ID: "tsbStammKategorienDelete",
    count: 1,
    action: function ()
    {
        if (lgKategorienStamm.getSelection().length == 1)
        {
            isc.ask("Wollen Sie wirklich den ausgewählten Datensatz löschen?", function (value)
            {
                if (value)
                {
                    katStamm_id = lgKategorienStamm.getSelectedRecord().ID;
                    RPCManager.send("", function (rpcResponse, data, rpcRequest)
                    {
                        var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                        if (_data.response.status === 0)
                        {  // Status 0 bedeutet Keine Fehler

                            isc.say("Datensatz wurde erfolgreich gelöscht.");
                            lgKategorienStamm.invalidateCache();
                            AusgabenListe.invalidateCache();

                        } else
                        { // Wenn die Validierungen Fehler aufweisen dann:                            
                            var _errors = _data.response.errors;
                            isc.say("<b>Fehler! </br>" + _errors + "</b>");
                        }
                    }, {// Übergabe der Parameter
                        actionURL: "api/kategorie_stamm_delete.php",
                        httpMethod: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        useSimpleHttp: true,
                        params: {
                            ID: katStamm_id}

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
    ID: "menuKategorien",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    data: [
        {title: tsbStammKategorienAdd.prompt, icon: tsbStammKategorienAdd.icon, click: function ()
            {
                tsbStammKategorienAdd.action();
            }},
        {title: tsbStammKategorienEdit.prompt, icon: tsbStammKategorienEdit.icon, click: function ()
            {
                tsbStammKategorienEdit.action();
            }},
        {title: tsbStammKategorienDelete.prompt, icon: tsbStammKategorienDelete.icon, click: function ()
            {
                tsbStammKategorienDelete.action();
            }}
    ]
});


/*
 * *************************** Layouts *****************************************
 * =============================================================================
 */

isc.Label.create({
    padding: 0,
    ID: "lblStammKategorien",
    width: 300,
    height: "100%",
    align: "center",
    contents: '<text style="color:' + titleLableColor + '; font-size:' + titleLableFontSize + '; font-family:' + titleLableFontFamily + '; text-decoration:none;">Kategorien</text>'
});


isc.ToolStrip.create({
    ID: "tsStammKategorien",
    width: "100%",
    backgroundImage: "backgrounds/leaves.jpg",
    height: 40,
    members: [tsbStammKategorienAdd, isc.LayoutSpacer.create({width: 10}), tsbStammKategorienEdit, 
        isc.LayoutSpacer.create({width: 10}), tsbStammKategorienDelete, isc.LayoutSpacer.create({width: "*"}), 
        lblStammKategorien, isc.LayoutSpacer.create({width: 5})]
});

isc.VLayout.create({
    ID: "VLayoutStammKategorien",
    height: "100%",
    width: "100%",
    members: [tsStammKategorien, lgKategorienStamm]
});


/*
 * *************************** Initialisierung *********************************
 * =============================================================================
 */



addNode("VLayoutStammKategorien", {
    name: "VLayoutStammKategorien",
    cat: "Stammdaten",
    onOpen: function ()
    {
        lgKategorienStamm.contextMenu = menuKategorien;
        clearCharts('');
    },
    treenode: {
        Name: "VLayoutStammKategorien",
        icon: "web/32/application_from_storage.png",
        title: "Kategorien verwalten",
        enabled: true
    },
    reflow: false
}
);




