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

var counterPrognosen = 0;

/*
 * *********************** GoTo: FUNKTIONEN ************************************
 * =============================================================================
 */

var refreshPrognoseListen = function ()
{
    var sKonten = "";
    if (dfEinAusgabenPrognosen.getField("konten").getValue())
    {
        var konten = dfEinAusgabenPrognosen.getField("konten").getValue();
        sKonten = konten.join(",");
    }

    var count = 0;
    listeErsterMonat.fetchData({count: Date.now(), konto: sKonten, proc: "einJahresPrognose"});
    ++count;
    listeZweiterMonat.fetchData({count: Date.now(), monat: count, konto: sKonten, proc: "einJahresPrognose2"});
    ++count;
    listeDritterMonat.fetchData({count: Date.now(), monat: count, konto: sKonten, proc: "einJahresPrognose2"});
    ++count;
    listeVierterMonat.fetchData({count: Date.now(), monat: count, konto: sKonten, proc: "einJahresPrognose2"});
    ++count;
    listeFuenfterMonat.fetchData({count: Date.now(), monat: count, konto: sKonten, proc: "einJahresPrognose2"});
    ++count;
    listeSechsterMonat.fetchData({count: Date.now(), monat: count, konto: sKonten, proc: "einJahresPrognose2"});
    ++count;
    listeSiebterMonat.fetchData({count: Date.now(), monat: count, konto: sKonten, proc: "einJahresPrognose2"});
    ++count;
    listeAchterMonat.fetchData({count: Date.now(), monat: count, konto: sKonten, proc: "einJahresPrognose2"});
    ++count;
    listeNeunterMonat.fetchData({count: Date.now(), monat: count, konto: sKonten, proc: "einJahresPrognose2"});
    ++count;
    listeZehnterMonat.fetchData({count: Date.now(), monat: count, konto: sKonten, proc: "einJahresPrognose2"});
    ++count;
    listeElfterMonat.fetchData({count: Date.now(), monat: count, konto: sKonten, proc: "einJahresPrognose2"});
    ++count;
    listeZwoelfterMonat.fetchData({count: Date.now(), monat: count, konto: sKonten, proc: "einJahresPrognose2"});
};

/*
 * ************************ GoTo: DataSources ************************
 */

isc.DataSource.create({
    ID: "listeEinJahresPrognoseDS",
    allowAdvancedCriteria: true,
    // serverType:"sql",
    dataFormat: "json",
    operationBindings: [
        {operationType: "fetch",
//            defaultParams: {
//                "counter": Date.now()
//            },
            dataURL: "api/ds/listeEinJahresPrognoseDS.php"
        }
    ],
    titleField: "text",
    fields: [
        {
            name: "monat",
            title: "Monat",
            type: "text"
        },
        {
            name: "vorgang",
            title: "Vorgang",
            type: "text"
        }, {
            name: "betrag",
            title: "Betrag",
            type: "text"
        }, {
            name: "art",
            title: "Art",
            type: "text"
        }, {
            name: "kontotyp",
            title: "Kontotyp",
            type: "text"
        }, {
            name: "kontotyp_bez",
            title: "Kontotyp",
            type: "text"
        }, {
            name: "kategorie",
            title: "Kategorie",
            type: "text"
        }
    ]});


isc.DataSource.create({
    ID: "kontenPrognosenDS",
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
        },
        {
            name: "typ_bez",
            title: "Kontenart",
            type: "text"
        }
    ]});

/*
 * **************************** DynaForm ***************************************
 * =============================================================================
 */
isc.DynamicForm.create({
    ID: "dfEinAusgabenPrognosen",
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
                    f: "prognosen", count: ++dfEinAusgabenPrognosen.monCnt};
                return filter;
            },
            changed: function (form, item, value)
            {
                console.log(value);
                refreshPrognoseListen();
            }
        }
    ]
});

/*
 * ******************* Einjahres-Prognose Listen ***********************************************************************
 * ---------------------------------------------------------------------------------------------------------------------
 */

ClassFactory.defineClass("einJahresListen", ListGrid);

einJahresListen.addProperties({
    //   header: "Daten bearbeiten",
    width: 300, height: "100%",
    alternateRecordStyles: true,
    autoFetchData: false,
    showHeader: false,
    showFilterEditor: false,
    filterOnKeypress: false,
    selectionType: "single",
    showAllRecords: true,
    canExpandRecords: false,
    showGridSummary: true,
    showGroupSummary: false,
    sortField: "art",
    groupByField: ['monat', 'kontotyp_bez',  'art', 'kategorie'],
    margin: 0,
    initialSort: [/*{
            property: "art",
            direction: "ascending"
        },*/{
            property: "kontotyp_bez",
            direction: "ascending"
        },{
            property: "kategorie",
            direction: "ascending"
        },{
            property: "vorgang",
            direction: "ascending"
        }
    ],
    fields: [
         {
            name: "kontotyp_bez",
            width: "*",
            title: "Konto",
            showIf: "false",
            getGroupTitle: function (groupValue, groupNode, field, fieldName, grid)
            {
                return '<text style="color:red; font-size:16px; font-family:' + mainHeaderFontFamily + ';' + mainHeaderFontStyle + ' ">' + groupValue + '</text>';
            }
        },{
            name: "kartegorie",
            width: "*",
            title: "Kategorie",
            showIf: "false",
            getGroupTitle: function (groupValue, groupNode, field, fieldName, grid)
            {
                return '<text style="color:green; font-size:12px; font-family:' + mainHeaderFontFamily + ';' + mainHeaderFontStyle + ' ">' + groupValue + '</text>';
            }
        },{
            name: "art",
            width: "*",
            showIf: "false",
            getGroupTitle: function (groupValue, groupNode, field, fieldName, grid)
            {
                var color = (groupValue == "Einnahmen") ? "#34cf3b" : "#ba1dbf";
                return '<text style="color:'+color+'; font-size:14px; font-family:' + mainHeaderFontFamily + ';' + mainHeaderFontStyle + ' ">' + groupValue + '</text>';
            }
        },
        {
            name: "vorgang",
            width: "*",
            title: "Vorgang"
        }, {
            name: "betrag",
            width: 70,
            title: "Betrag",
            align: "right",
            showGridSummary: true, showGroupSummary: true,
            recordSummaryFunction: "multiplier",
            summaryFunction: "sum",
            formatCellValue: function (value)
            {
                if (isc.isA.Number(value))
                {
                    return value.toCurrencyString("€ ");
                }
                return value;
            }
        }
    ], hilites: [
        {cssText: "color:#000000;background-color:#C1FFC1;",
            id: 0 // Einnahmen
        },
        {cssText: "color:#000000;background-color:#F9E7E7;",
            id: 1 // Ausgaben
        }/*,
        {cssText: "color:#000000;background-color:#F9B717;",
            id: 2 // Sparkonto
        },
        {cssText: "color:#000000;background-color:#AEEEEE;",
            id: 3 // Schulden
        },
        {cssText: "color:#000000;background-color:#F0FFF0;",
            id: 3 // Mäusekonten
        }*/]
});

isc.einJahresListen.create({
    ID: "listeErsterMonat",
    dataSource: listeEinJahresPrognoseDS
});
isc.einJahresListen.create({
    ID: "listeZweiterMonat",
    dataSource: listeEinJahresPrognoseDS
});
isc.einJahresListen.create({
    ID: "listeDritterMonat",
    dataSource: listeEinJahresPrognoseDS
});
isc.einJahresListen.create({
    ID: "listeVierterMonat",
    dataSource: listeEinJahresPrognoseDS
});
isc.einJahresListen.create({
    ID: "listeFuenfterMonat",
    dataSource: listeEinJahresPrognoseDS
});
isc.einJahresListen.create({
    ID: "listeSechsterMonat",
    dataSource: listeEinJahresPrognoseDS
});
isc.einJahresListen.create({
    ID: "listeSiebterMonat",
    dataSource: listeEinJahresPrognoseDS
});
isc.einJahresListen.create({
    ID: "listeAchterMonat",
    dataSource: listeEinJahresPrognoseDS
});
isc.einJahresListen.create({
    ID: "listeNeunterMonat",
    dataSource: listeEinJahresPrognoseDS
});
isc.einJahresListen.create({
    ID: "listeZehnterMonat",
    dataSource: listeEinJahresPrognoseDS
});
isc.einJahresListen.create({
    ID: "listeElfterMonat",
    dataSource: listeEinJahresPrognoseDS
});
isc.einJahresListen.create({
    ID: "listeZwoelfterMonat",
    dataSource: listeEinJahresPrognoseDS
});
var count = 0;


isc.HLayout.create({
    ID: "HLayoutJahresPrognose",
    height: "100%",
    width: "100%",
    overflow: "scroll",
    members: [listeErsterMonat, listeZweiterMonat, listeDritterMonat, listeVierterMonat, listeFuenfterMonat, listeSechsterMonat,
        listeSiebterMonat, listeAchterMonat, listeNeunterMonat, listeZehnterMonat, listeElfterMonat, listeZwoelfterMonat]

});
//isc.HLayout.create({
//    ID: "HLayoutJahresPrognose2",
//    height: "50%",
//    width: "100%",
//    members: [listeSiebterMonat, listeAchterMonat, listeNeunterMonat, listeZehnterMonat, listeElfterMonat, listeZwoelfterMonat]
//
//});

isc.VLayout.create({
    ID: "VLayoutJahresPrognose",
    height: "100%",
    width: "100%",
    members: [HLayoutJahresPrognose/*, HLayoutJahresPrognose2*/]

});



/*
 * *************************** Layouts *****************************************
 * =============================================================================
 */

isc.Label.create({
    padding: 0,
    ID: "lblPrognose",
    width: 300,
    height: "100%",
    align: "center",
    contents: '<text style="color:' + titleLableColor + '; font-size:' + titleLableFontSize + '; font-family:' + titleLableFontFamily + '; text-decoration:none;">Prognosen</text>'
});

isc.ToolStripButton.create({
    ID: "tsbPrognose",
    count: 1,
    action: function ()
    {
        refreshPrognoseListen();
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

isc.ToolStrip.create({
    ID: "tsPrognose",
    width: "100%",
    backgroundImage: "backgrounds/leaves.jpg",
    height: 40,
    members: [dfEinAusgabenPrognosen, isc.LayoutSpacer.create({width: 10}), tsbPrognose, isc.LayoutSpacer.create({width: "*"}),
        lblPrognose, isc.LayoutSpacer.create({width: 5})]
});

isc.VLayout.create({
    ID: "VLayoutPrognose",
    height: "100%",
    width: "100%",
    members: [tsPrognose, HLayoutJahresPrognose]
});


/*
 * *************************** Initialisierung *********************************
 * =============================================================================
 */


addNode("VLayoutPrognose", {
    name: "VLayoutPrognose",
    cat: "Finanzen",
    onOpen: function ()
    {
//        refreshPrognoseListen();
        clearCharts('');
    },
    treenode: {
        Name: "VLayoutPrognose",
        icon: "web/16/chart_stock.png",
        title: "Einjahres-Prognose",
        enabled: true
    },
    reflow: false
}
);




