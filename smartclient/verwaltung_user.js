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

var counter = 0;

/*
 * *********************** GoTo: FUNKTIONEN ************************************
 * =============================================================================
 */


/*
 * ************************ GoTo: DataSources ************************
 */

/*
 * ******************* DS Users *****************************
 */

isc.DataSource.create({
    ID: "userDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
            dataURL: "api/ds/userDS.php"
        }
    ],
    titleField: "text",
    fields: [{
            name: "UserID",
            title: "UserID",
            type: "text",
            primaryKey: true
        }, {
            name: "benutzer",
            title: "User",
            type: "text"
        }, {
            name: "passwort",
            title: "Passwort",
            type: "text"
        }, {
            name: "admin",
            title: "Admin",
            type: "text",
            valueMap: {"J": "JA", "N": "Nein"}
        }, {
            name: "status",
            title: "Staus",
            type: "text",
            valueMap: {"O": "Gesperrt", "B": "Bestätigt"}
        }, {
            name: "email",
            title: "E-Mail",
            type: "text"
        },
        {
            name: "onlineTime",
            title: "Online-Zeit",
            type: "text"
        },
        {
            name: "logoutTime",
            title: "Logout-Zeit",
            type: "text"
        }, {
            name: "loginTime",
            title: "Login-Zeit",
            type: "text"
        },
        {
            name: "loginCount",
            title: "Login-Count",
            type: "text"
        },
        {
            name: "timeOut",
            title: "Timeout",
            type: "text"
        }
    ]
});




/*
 * ***************************** GoTo: Listen ************************************
 ---------------------------------------------------------------------------------
 */

isc.ListGrid.create({
    ID: "lgUser",
    //   header: "Daten düzenleme",
    width: "100%", height: "100%",
    alternateRecordStyles: true,
    dataSource: userDS,
    contextMenu: "",
    autoFetchData: true,
    taksit_count: 0,
    showFilterEditor: true,
    filterOnKeypress: true,
    selectionType: "single",
    showAllRecords: true,
    canExpandRecords: false,
    showGridSummary: true,
    //                    showGroupSummary: true,
    expansionMode: "details",
    margin: 0,
    fields: [{
            name: "UserID",
            showIf: "true",
            width: 60
        }, {
            name: "benutzer",
            width: 120,
            showGridSummary: true, showGroupSummary: true, summaryFunction: "count"
        }, {
            name: "passwort",
            width: 250
        }, {
            name: "admin",
            width: 80
        },
        {
            name: "status",
            width: 80
        },
        {
            name: "email",
            width: 200
        },
        {
            name: "onlineTime",
            width: 150
        },
        {
            name: "logoutTime",
            width: 150
        },
        {
            name: "loginCount",
            width: 70,
            showIf: "false"
        },
        {
            name: "loginTime",
            width: 150,
            showIf: "false"
        },
        {
            name: "timeOut",
            width: 150,
            showIf: "false"
        }
    ], hilites: [
        {
            textColor: "#000000",
            cssText: "color:#000000;background-color:#FFDFFF;",
            id: 0
        }
    ], selectionChanged: function (record, state)
    {
        if (state)
        {
            tsbUserEdit.setDisabled(false);
        } else
        {
            tsbUserEdit.setDisabled(true);
        }

    }, recordDoubleClick: function (viewer, record, recordNum, field, fieldNum, value, rawValue)
    {
        dfEditUser.editRecord(record);
        wdEditUser.show();
        pgbEditUser.setHeight(16);
        isc.Timer.setTimeout("btnResetEditUser.click()", 100);

    }
});


/*
 * ***************************** GoTo: DynaForm ********************************
 -------------------------------------------------------------------------------
 */

/*
 * *******GoTo***** Anfang edit User **********************
 * -------------------------------------------------------------
 */

isc.Progressbar.create({
    percentDone: 0,
    ID: "pgbEditUser",
    showTitle: true,
    title: "",
    height: 16,
    length: "100%"});

isc.ValuesManager.create({
    ID: "dfEditUser"
});

isc.DynamicForm.create({
    ID: "dfEditUserAdmin",
    width: "100%",
    height: "100%",
    valuesManager: dfEditUser,
    userCount: 0,
    colWidths: [150, "*"],
    numCols: 2,
    titleOrientation: "left",
    validateOnExit: true,
    validateOnChange: false,
    margin: 5,
    fields: [{name: "UserID",
            type: "hidden"}, {
            type: "RowSpacer",
            height: 10
        },
        {
            name: "admin",
            title: "Admin",
            width: 150,
            type: "select",
            valueMap: {"J": "Admin", "N": "Kein Admin"},
            required: true,
            changed: function (form, item, value)
            {
                form.changeFunctionEditUser();
            }

        }, {
            type: "RowSpacer",
            height: 10
        }, {
            name: "status",
            required: true,
            type: "select",
            title: "Status",
            valueMap: {"O": "Inaktiv", "B": "Aktiv"},
            width: 150,
            changed: function (form, item, value)
            {
                form.changeFunctionEditUser();
            }
        }, {
            type: "RowSpacer",
            height: 10
        }, {
            name: "email",
            title: "E-Mail",
            width: 200,
            type: "text",
            hint: "--- E-Mail ---",
            showHintInField: true,
            change: "form.changeFunctionEditUser()",
            //            colSpan: 2,
            length: 128,
            validators: [{
                    type: "lengthRange",
                    min: 0,
                    max: 128,
                    stopIfFalse: false
                },
                {
                    type: "regexp",
                    validateOnExit: true,
                    expression: "^(([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4})|([ ])$",
                    errorMessage: "Die E-Mail-Adresse bitte wie im Beispiel eingeben: email@mail.de"
                }
            ]
        }, {
            type: "RowSpacer",
            height: 30
        }], changeFunctionEditUser: function ()
    {
        btnSpeichernEditUser2.setDisabled(false);
        btnResetEditUser2.setDisabled(false);
        btnCloseUserEdit2.setTitle("Abbrechen");
        btnCloseUserEdit2.setIcon("famfam/cancel.png");
    }});

isc.DynamicForm.create({
    ID: "dfEditUserPW",
    width: "100%",
    height: "100%",
    valuesManager: dfEditUser,
    userCount: 0,
    colWidths: [150, "*"],
    numCols: 2,
    titleOrientation: "left",
    validateOnExit: true,
    validateOnChange: false,
    margin: 5,
    fields: [{name: "UserID",
            type: "hidden"}, {
            type: "RowSpacer",
            height: 10
        }, {
            name: "orig_passwort",
            title: "Aktuelles Passwort",
            width: 200,
            type: "password",
            hint: "Aktuelles Passwort eingeben",
            showHintInField: true,
            change: "form.changeFunctionEditUser()"
              //            colSpan: 2,
        }, {
            type: "RowSpacer",
            height: 10
        }, {
            name: "passwort",
            title: "neues Passwort",
            width: 200,
            type: "password",
            hint: "Passwort eingeben",
            showHintInField: true,
            change: "form.changeFunctionEditUser()",
            //            colSpan: 2,
            length: 40,
            validators: [{
                    type: "lengthRange",
                    min: 6,
                    max: 40,
                    stopIfFalse: false
                },
                {
                    type: "regexp",
                    validateOnExit: true,
                    expression: "^([0-9a-zA-Z-+*_.]{6,40})$",
                    errorMessage: "Das Passwort darf nur aus folgenden Zeichen bestehen: 0-9 a-z A-Z - + * _ und muss aus mind. 6, max. 40 Zeichen bestehen."
                }
            ]
        }, {
            name: "passwort2",
            title: "Passwort bestätigen",
            width: 200,
            type: "password",
            hint: "Passwort bestätigen",
            showHintInField: true,
            change: "form.changeFunctionEditUser()",
            //            colSpan: 2,
            length: 40,
            validators: [{
                    type: "lengthRange",
                    min: 6,
                    max: 40,
                    stopIfFalse: false
                },
                {
                    type: "regexp",
                    validateOnExit: true,
                    expression: "^([0-9a-zA-Z-+*_.]{6,40})$",
                    errorMessage: "Das Passwort darf nur aus folgenden Zeichen bestehen: 0-9 a-z A-Z - + * _ und muss aus mind. 6, max. 40 Zeichen bestehen."
                }
            ]
        }, {
            type: "RowSpacer",
            height: 30
        }
    ], changeFunctionEditUser: function ()
    {
        btnSpeichernEditUser.setDisabled(false);
        btnResetEditUser.setDisabled(false);
        btnCloseUserEdit.setTitle("Abbrechen");
        btnCloseUserEdit.setIcon("famfam/cancel.png");
    }
});

isc.IButton.create({
    ID: "btnCloseUserEdit",
    type: "button",
    disabled: false,
    icon: "famfam/door_in.png",
    name: "btnCloseUserEdit",
    showDisabledIcon: false,
    title: "Schließen", width: 100,
    click: function ()
    {

        if (btnCloseUserEdit.getTitle() == "Abbrechen")
        {
            isc.ask("Wollen Sie wirklich abbrechen? Nicht gespeicherte Daten könnten verloren gehen..", function (value)
            {
                if (value)
                {
                    wdEditUser.hide();
                }
            }, {title: "Vorgang abbrechen?"});
        } else
        {
            wdEditUser.hide();
        }

    }});

isc.IButton.create({
    ID: "btnSpeichernEditUser",
    type: "button",
    disabled: true,
    showDisabledIcon: false,
    icon: "famfam/database_save.png",
    name: "btnSpeichernEditUser",
    title: "Speichern",
    width: 100,
    click: function ()
    {
        if (dfEditUser.validate())
        {
            var _percent = pgbEditUser.percentDone + parseInt(10 + (50 * Math.random()));
            pgbEditUser.setPercentDone(_percent);
            pgbEditUser.setTitle(_percent + "%");
            RPCManager.send("", function (rpcResponse, data, rpcRequest)
            {
                var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                if (_data.response.status === 0)
                {  // Durum 0 bedeutet Keine Fehler
                    User_ID = lgUser.getSelectedRecord().UserID;
                    lgUser.invalidateCache();
                    isc.Timer.setTimeout("btnSpeichernEditUser.findUser()", 500);
                    btnSpeichernEditUser.pgbEditUserFunction();

                } else
                { // Wenn die Validierungen Fehler aufweisen dann:

                    dfEditUser.setErrors(_data.response.errors, true);
                    var _errors = dfEditUser.getErrors();
                    for (var i in _errors)
                    {
                        isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>", function (value)
                        {
                            if (value)
                            {
                                pgbEditUser.setTitle("");
                                pgbEditUser.setPercentDone(0);
                            }
                        });
                    }

                }
            }, {// Übergabe der Parameter
                actionURL: "api/userPasswortEdit.php",
                httpMethod: "POST",
                contentType: "application/x-www-form-urlencoded",
                useSimpleHttp: true,
                params: {
                    UserID: lgUser.getSelectedRecord().UserID,
                    passwort: dfEditUser.getField("passwort").getValue(),
                    passwort2: dfEditUser.getField("passwort2").getValue(),
                    orig_passwort: dfEditUser.getField("orig_passwort").getValue(),
                    benutzer: lgUser.getSelectedRecord().benutzer}

            }); //Ende RPC
        } else
        {
            isc.say("Bitte alle nötigen Felder, den Vorgaben entsprechend, ausfüllen");
        }
    }, findUser: function ()
    {
        var editedUser = lgUser.data.find("UserID", User_ID);
        var index = lgUser.getRecordIndex(editedUser);
        //                        lgUser.deselectAllRecords();
        lgUser.selectRecord(index);
        lgUser.scrollToRow(index);
    }, // Ende Click
    pgbEditUserFunction: function ()
    {
        if (pgbEditUser.percentDone < 100)
        {
            var _percent = pgbEditUser.percentDone + parseInt(10 + (50 * Math.random()));
            pgbEditUser.setPercentDone(_percent); // Zufallswert wird berechnet

            if (_percent <= 100)
            {
                pgbEditUser.setTitle(_percent + "%");
            } //Bis 100 wird mitgezählt
            else
            {
                pgbEditUser.setTitle("100%"); // ab 100 darf nicht mehr gezählt werden, da 100 leicht überstiegen wird.
            }

            isc.Timer.setTimeout("btnSpeichernEditUser.pgbEditUserFunction()", 200);
        } else
        {
            if (!dfEditUser.validate() && dfEditUser.hasErrors())
            {
                dfEditUser.setErrors();
                var _errors = dfEditUser.getErrors();
                for (var i in _errors)
                {
                    isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>", function (value)
                    {
                        if (value)
                        {
                            pgbEditUser.setTitle("");
                            pgbEditUser.setPercentDone(0);
                        }
                    }); // Hier wird jeder Wert des Array-Schlüssel angezeigt und das Feld oder die Feld-Bezeichnung ist irrelevant.
                }
            } else
            {

                dfEditUser.clearValues();
                wdEditUser.hide();
                isc.Timer.setTimeout("btnSpeichernEditUser.findUser()", 300);
                pgbEditUser.setTitle("");
                pgbEditUser.setPercentDone(0);
                resetButtons(btnSpeichernEditUser, btnResetEditUser, btnCloseUserEdit);
            }
        }
    }// Ende ProgressbarFunction
});
isc.IButton.create({
    ID: "btnResetEditUser",
    type: "button",
    disabled: true,
    icon: "famfam/arrow_undo.png",
    showDisabledIcon: false,
    name: "btnResetEditUser",
    title: "Reset", width: 100,
    click: function ()
    {
        dfEditUser.reset();
        resetButtons(btnSpeichernEditUser, btnResetEditUser, btnCloseUserEdit);
    }});


isc.HLayout.create({
    ID: "HLayoutUserEdit",
    height: 30,
    width: "100%",
    align: "center",
    members: [btnCloseUserEdit, isc.LayoutSpacer.create({
            width: 20
        }), btnSpeichernEditUser, isc.LayoutSpacer.create({
            width: 20
        }), btnResetEditUser]});



isc.IButton.create({
    ID: "btnCloseUserEdit2",
    type: "button",
    disabled: false,
    icon: "famfam/door_in.png",
    name: "btnCloseUserEdit2",
    showDisabledIcon: false,
    title: "Schließen", width: 100,
    click: function ()
    {

        if (btnCloseUserEdit2.getTitle() == "Abbrechen")
        {
            isc.ask("Wollen Sie wirklich abbrechen? Nicht gespeicherte Daten könnten verloren gehen..", function (value)
            {
                if (value)
                {
                    wdEditUser.hide();
                }
            }, {title: "Vorgang abbrechen?"});
        } else
        {
            wdEditUser.hide();
        }

    }});

isc.IButton.create({
    ID: "btnSpeichernEditUser2",
    type: "button",
    disabled: true,
    showDisabledIcon: false,
    icon: "famfam/database_save.png",
    name: "btnSpeichernEditUser2",
    title: "Speichern",
    width: 100,
    click: function ()
    {
        if (dfEditUserAdmin.validate())
        {
            var _percent = pgbEditUser.percentDone + parseInt(10 + (50 * Math.random()));
            pgbEditUser.setPercentDone(_percent);
            pgbEditUser.setTitle(_percent + "%");
            RPCManager.send("", function (rpcResponse, data, rpcRequest)
            {
                var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                if (_data.response.status === 0)
                {  // Durum 0 bedeutet Keine Fehler
                    User_ID = lgUser.getSelectedRecord().UserID;
                    lgUser.invalidateCache();
                    isc.Timer.setTimeout("btnSpeichernEditUser2.findUser()", 500);
                    btnSpeichernEditUser2.pgbEditUserFunction();

                } else
                { // Wenn die Validierungen Fehler aufweisen dann:

                    dfEditUserAdmin.setErrors(_data.response.errors, true);
                    var _errors = dfEditUserAdmin.getErrors();
                    for (var i in _errors)
                    {
                        isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>", function (value)
                        {
                            if (value)
                            {
                                pgbEditUser.setTitle("");
                                pgbEditUser.setPercentDone(0);
                            }
                        });
                    }

                }
            }, {// Übergabe der Parameter
                actionURL: "api/userEdit.php",
                httpMethod: "POST",
                contentType: "application/x-www-form-urlencoded",
                useSimpleHttp: true,
                params: {
                    UserID: dfEditUserAdmin.getField("UserID").getValue(),
                    admin: dfEditUserAdmin.getField("admin").getValue(),
                    email: dfEditUserAdmin.getField("email").getValue(),
                    status: dfEditUserAdmin.getField("status").getValue()}

            }); //Ende RPC
        } else
        {
            isc.say("Bitte alle nötigen Felder, den Vorgaben entsprechend, ausfüllen");
        }
    }, findUser: function ()
    {
        var editedUser = lgUser.data.find("UserID", User_ID);
        var index = lgUser.getRecordIndex(editedUser);
        //                        lgUser.deselectAllRecords();
        lgUser.selectRecord(index);
        lgUser.scrollToRow(index);
    }, // Ende Click
    pgbEditUserFunction: function ()
    {
        if (pgbEditUser.percentDone < 100)
        {
            var _percent = pgbEditUser.percentDone + parseInt(10 + (50 * Math.random()));
            pgbEditUser.setPercentDone(_percent); // Zufallswert wird berechnet

            if (_percent <= 100)
            {
                pgbEditUser.setTitle(_percent + "%");
            } //Bis 100 wird mitgezählt
            else
            {
                pgbEditUser.setTitle("100%"); // ab 100 darf nicht mehr gezählt werden, da 100 leicht überstiegen wird.
            }

            isc.Timer.setTimeout("btnSpeichernEditUser2.pgbEditUserFunction()", 200);
        } else
        {
            if (!dfEditUserAdmin.validate() && dfEditUserAdmin.hasErrors())
            {
                dfEditUserAdmin.setErrors();
                var _errors = dfEditUserAdmin.getErrors();
                for (var i in _errors)
                {
                    isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>", function (value)
                    {
                        if (value)
                        {
                            pgbEditUser.setTitle("");
                            pgbEditUser.setPercentDone(0);
                        }
                    }); // Hier wird jeder Wert des Array-Schlüssel angezeigt und das Feld oder die Feld-Bezeichnung ist irrelevant.
                }
            } else
            {

                dfEditUserAdmin.clearValues();
                wdEditUser.hide();
                isc.Timer.setTimeout("btnSpeichernEditUser2.findUser()", 300);
                pgbEditUser.setTitle("");
                pgbEditUser.setPercentDone(0);
                resetButtons(btnSpeichernEditUser2, btnResetEditUser2, btnCloseUserEdit2);
            }
        }
    }// Ende ProgressbarFunction
});
isc.IButton.create({
    ID: "btnResetEditUser2",
    type: "button",
    disabled: true,
    icon: "famfam/arrow_undo.png",
    showDisabledIcon: false,
    name: "btnResetEditUser2",
    title: "Reset", width: 100,
    click: function ()
    {
        dfEditUserAdmin.reset();
        resetButtons(btnSpeichernEditUser2, btnResetEditUser2, btnCloseUserEdit2);
    }});


isc.HLayout.create({
    ID: "HLayoutUserEdit2",
    height: 30,
    width: "100%",
    align: "center",
    members: [btnCloseUserEdit2, isc.LayoutSpacer.create({
            width: 20
        }), btnSpeichernEditUser2, isc.LayoutSpacer.create({
            width: 20
        }), btnResetEditUser2]});


isc.VLayout.create({
    ID: "VLayoutUserEditFormBtn2",
    height: 30,
    width: "100%",
    align: "center",
    members: [dfEditUserAdmin, HLayoutUserEdit2]});

isc.VLayout.create({
    ID: "VLayoutUserEditFormBtn",
    height: 30,
    width: "100%",
    align: "center",
    members: [dfEditUserPW, HLayoutUserEdit]});


isc.TabSet.create({
    ID: "tabUser",
    width: "100%",
    height: "100%",
    count: 0,
    tabs: [
        {title: "User-Edit",
            pane: VLayoutUserEditFormBtn2},
        {title: "Passwort ändern",
            pane: VLayoutUserEditFormBtn}
    ],
    tabSelected: function (tabSet, tabNum, tabPane, ID, tab, name)
    {

    }
});



isc.Window.create({
    ID: "wdEditUser",
    title: "User-Bearbeitung",
    autoSize: false,
    autoCenter: true,
    showFooter: false,
    showMinimizeButton: false,
    showCloseButton: false,
    width: 440,
    height: 300,
    headerIconDefaults: {
        width: 16,
        height: 16,
        src: "famfam/user_edit.png"
    },
    canDragReposition: true,
    canDragResize: false,
    showShadow: true,
    showModalMask: true,
    modalMaskOpacity: 10,
    isModal: true,
    items: [tabUser, pgbEditUser]
});
/*
 * ********************** Ende edit User **********************
 * -------------------------------------------------------------
 */
/*
 * ********************** Anfang Add User **********************
 * -------------------------------------------------------------
 */
isc.DynamicForm.create({
    ID: "dfUserAdd",
    width: "100%",
    height: "100%",
    userCount: 0,
    colWidths: [150, "*"],
    numCols: 2,
    titleOrientation: "left",
    validateOnExit: true,
    validateOnChange: false,
    margin: 5,
    fields: [{
            name: "admin",
            title: "Admin",
            width: 150,
            type: "select",
            defaultValue: "J",
            valueMap: {"J": "Admin", "N": "Kein Admin"},
            required: true,
            changed: function (form, item, value)
            {
                form.changeFunctionUserAdd();
            }

        }, {
            type: "RowSpacer",
            height: 10
        }, {
            name: "status",
            required: true,
            type: "select",
            title: "Status",
            defaultValue: "B",
            valueMap: {"O": "Inaktiv", "B": "Aktiv"},
            width: 150,
            changed: function (form, item, value)
            {
                form.changeFunctionUserAdd();
            }
        }, {
            type: "RowSpacer",
            height: 10
        }, {
            name: "email",
            title: "E-Mail",
            width: 200,
            type: "text",
            hint: "--- E-Mail ---",
            showHintInField: true,
            change: "form.changeFunctionUserAdd()",
            //            colSpan: 2,
            length: 128,
            validators: [{
                    type: "lengthRange",
                    min: 0,
                    max: 128,
                    stopIfFalse: false
                },
                {
                    type: "regexp",
                    validateOnExit: true,
                    expression: "^(([a-zA-Z0-9_.\\-+])+@(([a-zA-Z0-9\\-])+\\.)+[a-zA-Z0-9]{2,4})|([ ])$",
                    errorMessage: "Die E-Mail-Adresse bitte wie im Beispiel eingeben: email@mail.de"
                }
            ]
        }, {
            type: "RowSpacer",
            height: 10
        }, {
            name: "benutzer",
            title: "Benutzer",
            width: 200,
            type: "text",
            required: true,
            hint: "Benutzer eingeben",
            showHintInField: true,
            change: "form.changeFunctionUserAdd()",
            //            colSpan: 2,
        }, {
            name: "passwort",
            title: "Passwort",
            width: 200,
            type: "password",
            required: true,
            hint: "Passwort eingeben",
            showHintInField: true,
            change: "form.changeFunctionUserAdd()",
            //            colSpan: 2,
            length: 40,
            validators: [{
                    type: "lengthRange",
                    min: 6,
                    max: 40,
                    stopIfFalse: false
                },
                {
                    type: "regexp",
                    validateOnExit: true,
                    expression: "^([0-9a-zA-Z-+*_.]{6,40})$",
                    errorMessage: "Das Passwort darf nur aus folgenden Zeichen bestehen: 0-9 a-z A-Z - + * _ und muss aus mind. 6, max. 40 Zeichen bestehen."
                }
            ]
        }, {
            name: "passwort2",
            title: "Passwort bestätigen",
            width: 200,
            type: "password",
            hint: "Passwort bestätigen",
            showHintInField: true,
            change: "form.changeFunctionUserAdd()",
            //            colSpan: 2,
            length: 40,
            required: true,
            validators: [{
                    type: "lengthRange",
                    min: 6,
                    max: 40,
                    stopIfFalse: false
                },
                {
                    type: "regexp",
                    validateOnExit: true,
                    expression: "^([0-9a-zA-Z-+*_.]{6,40})$",
                    errorMessage: "Das Passwort darf nur aus folgenden Zeichen bestehen: 0-9 a-z A-Z - + * _ und muss aus mind. 6, max. 40 Zeichen bestehen."
                }
            ]
        }, {
            type: "RowSpacer",
            height: 30
        }
    ], changeFunctionUserAdd: function ()
    {
        btnSpeichernUserAdd.setDisabled(false);
        btnResetUserAdd.setDisabled(false);
        btnCloseUserAdd.setTitle("Abbrechen");
        btnCloseUserAdd.setIcon("famfam/cancel.png");
    }
});

isc.IButton.create({
    ID: "btnResetUserAdd",
    type: "button",
    disabled: true,
    icon: "famfam/arrow_undo.png",
    showDisabledIcon: false,
    name: "btnResetUserAdd",
    title: "Reset", width: 100,
    click: function ()
    {
        dfUserAdd.reset();
        resetButtons(btnSpeichernUserAdd, btnResetUserAdd, btnCloseUserAdd);
    }});

isc.IButton.create({
    ID: "btnCloseUserAdd",
    type: "button",
    disabled: false,
    icon: "famfam/door_in.png",
    name: "btnCloseUserAdd",
    showDisabledIcon: false,
    title: "Schließen", width: 100,
    click: function ()
    {

        if (btnCloseUserAdd.getTitle() == "Abbrechen")
        {
            isc.ask("Wollen Sie wirklich abbrechen? Nicht gespeicherte Daten könnten verloren gehen..", function (value)
            {
                if (value)
                {
                    wdUserAdd.hide();
                }
            }, {title: "Vorgang abbrechen?"});
        } else
        {
            wdUserAdd.hide();
        }

    }});

isc.IButton.create({
    ID: "btnSpeichernUserAdd",
    type: "button",
    disabled: true,
    showDisabledIcon: false,
    icon: "famfam/database_save.png",
    name: "btnSpeichernUserAdd",
    title: "Speichern",
    width: 100,
    click: function ()
    {
        if (dfUserAdd.validate())
        {
            RPCManager.send("", function (rpcResponse, data, rpcRequest)
            {
                var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
                if (_data.response.status === 0)
                {  // Durum 0 bedeutet Keine Fehler                
                    lgUser.invalidateCache();
                    dfUserAdd.clearValues();
                    wdUserAdd.hide();
                    resetButtons(btnSpeichernUserAdd, btnResetUserAdd, btnCloseUserAdd);

                } else
                { // Wenn die Validierungen Fehler aufweisen dann:

                    dfUserAdd.setErrors(_data.response.errors, true);
                    var _errors = dfUserAdd.getErrors();
                    for (var i in _errors)
                    {
                        isc.say("<b>Fehler! </br>" + (_errors [i]) + "</b>", function (value)
                        {
                            if (value)
                            {
                            }
                        });
                    }

                }
            }, {// Übergabe der Parameter
                actionURL: "api/userAdd.php",
                httpMethod: "POST",
                contentType: "application/x-www-form-urlencoded",
                useSimpleHttp: true,
                params: {
                    passwort: dfUserAdd.getField("passwort").getValue(),
                    passwort2: dfUserAdd.getField("passwort2").getValue(),
                    admin: dfUserAdd.getField("admin").getValue(),
                    status: dfUserAdd.getField("status").getValue(),
                    email: dfUserAdd.getField("email").getValue(),
                    benutzer: dfUserAdd.getField("benutzer").getValue()}

            }); //Ende RPC
        } else
        {
            isc.say("Bitte alle nötigen Felder, den Vorgaben entsprechend, ausfüllen");
        }
    }
});

isc.HLayout.create({
    ID: "HLayoutUserAdd",
    height: 30,
    width: "100%",
    align: "center",
    members: [btnCloseUserAdd, isc.LayoutSpacer.create({
            width: 20
        }), btnSpeichernUserAdd, isc.LayoutSpacer.create({
            width: 20
        }), btnResetUserAdd]});


isc.Window.create({
    ID: "wdUserAdd",
    title: "User-Anlegen",
    autoSize: false,
    autoCenter: true,
    showFooter: false,
    showMinimizeButton: false,
    showCloseButton: false,
    width: 440,
    height: 350,
    headerIconDefaults: {
        width: 16,
        height: 16,
        src: "famfam/user_edit.png"
    },
    canDragReposition: true,
    canDragResize: false,
    showShadow: true,
    showModalMask: true,
    modalMaskOpacity: 10,
    isModal: true,
    items: [dfUserAdd, HLayoutUserAdd]
});


/*
 * ********************** Ende Add User **********************
 * -------------------------------------------------------------
 */



/*
 ***************** Edit Button User **************************** 
 */
isc.ToolStripButton.create({
    ID: "tsbUserEdit",
    title: "",
    showDisabledIcon: false,
    disabled: true,
    icon: "web/32/user_edit.png",
    iconHeight: 32,
    iconWidth: 32,
    prompt: "Den gewählten User bearbeiten",
    hoverWidth: 100,
    hoverDelay: 700,
    action: function ()
    {
        if (lgUser.getSelection().length == 1)
        {
            record = lgUser.getSelectedRecord();
            dfEditUser.editRecord(record);
            wdEditUser.show();
            pgbEditUser.setHeight(16);
            isc.Timer.setTimeout("btnResetEditUser.click()", 50);
        } else
        {
            isc.say("Bitte erst einen Benutzer wählen");
        }

    }
});
/*
 ***************** New User Button **************************** 
 */
isc.ToolStripButton.create({
    ID: "tsbUserAdd",
    title: "",
    showDisabledIcon: false,
    disabled: false,
    icon: "web/32/user_add.png",
    iconHeight: 32,
    iconWidth: 32,
    prompt: "Neuen User anlegen",
    hoverWidth: 100,
    hoverDelay: 700,
    action: function ()
    {
        wdUserAdd.show();
    }
});

/*
 ***************** Refresh Button User ************************ 
 */
isc.ToolStripButton.create({
    ID: "tsbUserRefresh",
    title: "",
    showDisabledIcon: false,
    disabled: false,
    icon: "web/32/arrow_refresh.png",
    iconHeight: 32,
    iconWidth: 32,
    prompt: "User-Liste neuladen",
    hoverWidth: 100,
    hoverDelay: 700,
    action: function ()
    {
        lgUser.invalidateCache();
    }
});
/*
 ***************** Error-Form User ***************************** 
 */
isc.DynamicForm.create({
    ID: "dfErrorFormUser",
    width: 1,
    height: 1,
    titleOrientation: "left",
    fields: [{name: "errors",
            width: 1,
            type: "hidden"}]});




/*
 * ************************* ENDE USER *****************************************
 * *****************************************************************************
 */

/*
 * *********************** ANFANG MENU *************************
 * -------------------------------------------------------------
 */

isc.Menu.create({
    ID: "menuUser",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    data: [
        {title: tsbUserAdd.prompt, icon: tsbUserAdd.icon, click: function ()
            {
                tsbUserAdd.action();
            }},
        {title: tsbUserEdit.prompt, icon: tsbUserEdit.icon, click: function ()
            {
                tsbUserEdit.action();
            }},
        {title: tsbUserRefresh.prompt, icon: tsbUserRefresh.icon, click: function ()
            {
                tsbUserRefresh.action();
            }}
    ]
});

/*
 * *************************** Layouts *****************************************
 * =============================================================================
 */

isc.Label.create({
    padding: 0,
    ID: "lblUser",
    width: 300,
    height: "100%",
    align: "center",
    contents: '<text style="color:' + titleLableColor + '; font-size:' + titleLableFontSize + '; font-family:' + titleLableFontFamily + '; text-decoration:none;">Benutzer-Verwaltung</text>'
});


isc.ToolStrip.create({
    ID: "tsUser",
    width: "100%",
    backgroundImage: "backgrounds/leaves.jpg",
    height: 40,
    members: [tsbUserAdd, isc.LayoutSpacer.create({width: 10}), tsbUserEdit, isc.LayoutSpacer.create({width: 10}), tsbUserRefresh, isc.LayoutSpacer.create({width: "*"}), lblUser, isc.LayoutSpacer.create({width: 5})]
});

isc.VLayout.create({
    ID: "VLayoutUser",
    height: "100%",
    width: "100%",
    members: [tsUser, lgUser]
});


/*
 * *************************** Initialisierung *********************************
 * =============================================================================
 */



addNode("VLayoutUser", {
    name: "VLayoutUser",
    cat: "Verwaltung",
    onOpen: function ()
    {
        lgUser.contextMenu = menuUser;
        clearCharts('');
    },
    treenode: {
        Name: "VLayoutUser",
        icon: "web/16/group.png",
        title: "User verwalten",
        enabled: true
    },
    reflow: false
}
);




