<?php
session_start();
require_once("conf.php");
header("Cache-Control: no-cache, must-revalidate");
$host = (htmlspecialchars($_SERVER["HTTP_HOST"]));
$uri = rtrim(dirname(htmlspecialchars($_SERVER["PHP_SELF"])), "/\\");
?>
<HTML>
<HEAD>
<meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" >
            <meta name="viewport" content="width = device-width, initial-scale = 1">
            <link href="smartclient/styles/main.css" rel="stylesheet">
            <link href="smartclient/dist/dropzone.css" rel="stylesheet"> 
            <script src="smartclient/dist/dropzone.js" type="text/javascript"></script>
			<TITLE>PECUNIA NON OLET</TITLE>
<SCRIPT type="text/javascript">
user = 'kai';
sidAdmin = "<?php echo (isset($_SESSION['finanzen']['admin'])) ? $_SESSION['finanzen']['admin'] : ADMIN_STD; ?>";
apiFolder = 'smartclient';
appFolder = 'finanzen';
modul = '';
var isomorphicDir = apiFolder + '/isomorphic/';
var extend = false;
</SCRIPT>
<script src= "smartclient/js/amcharts/amcharts/amcharts.js" type="text/javascript"></script>
            <script src= "smartclient/js/amcharts/amcharts/pie.js" type="text/javascript"></script>
            <script src= "smartclient/js/amcharts/amcharts/serial.js" type="text/javascript"></script>
            <script src= "smartclient/js/amcharts/amcharts/themes/patterns.js" type="text/javascript"></script>
            <script src= "smartclient/js/amcharts/amcharts/themes/black.js" type="text/javascript"></script>
            <script src= "smartclient/js/amcharts/amcharts/themes/chalk.js" type="text/javascript"></script>
            <script src= "smartclient/js/amcharts/amcharts/themes/dark.js" type="text/javascript"></script>
            <script src= "smartclient/js/amcharts/amcharts/themes/light.js" type="text/javascript"></script>
            <script src= "smartclient/js/amcharts/amcharts/plugins/responsive/responsive.min.js" type="text/javascript"></script>
            <SCRIPT type="text/javascript" SRC="smartclient/isomorphic/system/modules/ISC_Core.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="smartclient/isomorphic/system/modules/ISC_Foundation.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="smartclient/isomorphic/system/modules/ISC_Containers.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="smartclient/isomorphic/system/modules/ISC_Grids.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="smartclient/isomorphic/system/modules/ISC_Forms.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="smartclient/isomorphic/system/modules/ISC_DataBinding.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="smartclient/isomorphic/system/modules/ISC_Calendar.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="smartclient/isomorphic/system/modules/ISC_RichTextEditor.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="smartclient/isomorphic/skins/Tahoe/load_skin.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="smartclient/isomorphic/locales/frameworkMessages_de.properties"></SCRIPT></HEAD>
<BODY>
<script src='smartclient/finanzen.js' type='text/javascript'></script>
<script src='smartclient/finanzen_umsaetze.js' type='text/javascript'></script>
<script src='smartclient/stammdaten_kategorien.js' type='text/javascript'></script>
<script src='smartclient/stammdaten_konten.js' type='text/javascript'></script>
<script src='smartclient/stammdaten_zahlungsmittel.js' type='text/javascript'></script>
<script src='smartclient/finanzen_prognosen.js' type='text/javascript'></script>
<script src='smartclient/finanzen_einausgaben.js' type='text/javascript'></script>
<script src='smartclient/finanzen_kredite.js' type='text/javascript'></script>
<script src='smartclient/verwaltung_user.js' type='text/javascript'></script>
</BODY>
</HTML>
