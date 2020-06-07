/* 
 *
 * FINANZEN DASHBOARD
 *  
 * Author: Suat Ekinci 
 * Copyright (c) 2020 Suat Ekinci 
 *
 * All rights reserved
 * 
 * PATCHES:
 * 
 */

var counterDashboard = 0;

/*
 * *********************** GoTo: FUNKTIONEN ************************************
 * =============================================================================
 */
function amChartsFinanzStatus()
{

    htmlPaneFinanzStatus.setContents("");
    htmlPaneFinanzStatus.setContents("<div id='divFinanzStatus' style='width: 100%; height: 100%; padding-top: 5px;' ; ></div>");
    RPCManager.send("", function (rpcResponse, data, rpcRequest)
    {
        var _data = isc.JSON.decode(data); // Daten aus dem PHP (rpcResponse)
        if (_data.response.status === 0)
        {  // Status 0 bedeutet Keine Fehler

            console.log(_data);

        } else
        { // Wenn die Validierungen Fehler aufweisen dann:                            
            var _errors = _data.response.errors;
            console.log("<b>Fehler! </br>" + _errors + "</b>");
        }

    }, {
        actionURL: "api/ds/dashboard_finanzstatus.php",
        httpMethod: "GET",
        contentType: "application/x-www-form-urlencoded",
        useSimpleHttp: true,
        params: {count: counterDashboard}
    }); // Ende RPC
}
;

/*
 * ************************ GoTo: DataSources ************************
 */


/*
 * **************************** HTMLPane ***************************************
 * =============================================================================
 */

isc.HTMLPane.create({
    width: "100%",
    height: "100%",
    ID: "htmlPaneFinanzStatus",
    styleName: "exampleTextBlock",
    contents: ""});


/*
 * ******************* Einjahres-Prognose Listen ***********************************************************************
 * ---------------------------------------------------------------------------------------------------------------------
 */



/*
 * *************************** Layouts *****************************************
 * =============================================================================
 */

isc.Label.create({
    padding: 0,
    ID: "lblDashboard",
    width: 300,
    height: "100%",
    align: "center",
    contents: '<text style="color:' + titleLableColor + '; font-size:' + titleLableFontSize + '; font-family:' + titleLableFontFamily + '; text-decoration:none;">Dashboard</text>'
});


isc.ToolStrip.create({
    ID: "tsDashboard",
    width: "100%",
    backgroundImage: "backgrounds/leaves.jpg",
    height: 40,
    members: [isc.LayoutSpacer.create({width: 10}), isc.LayoutSpacer.create({width: "*"}),
        lblDashboard, isc.LayoutSpacer.create({width: 5})]
});

isc.VLayout.create({
    ID: "VLayoutDashboard",
    height: "100%",
    width: "100%",
    members: [tsDashboard, htmlPaneFinanzStatus]
});


/*
 * *************************** Initialisierung *********************************
 * =============================================================================
 */


addNode("VLayoutDashboard", {
    name: "VLayoutDashboard",
    cat: "Dashboard",
    onOpen: function ()
    {
        htmlPaneFinanzStatus.clear();
        htmlPaneVergleichsGrafikKreditKarten.clear();
        amChartsFinanzStatus();
    },
    treenode: {
        Name: "VLayoutDashboard",
        icon: "web/16/chart_stock.png",
        title: "Dashboard",
        enabled: true
    },
    reflow: false
}
);




