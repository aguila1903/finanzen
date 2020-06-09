<?php

session_start();
require_once('adodb5/adodb.inc.php');
require_once('conf.php');
$host = (htmlspecialchars($_SERVER["HTTP_HOST"]));
$uri = rtrim(dirname(htmlspecialchars($_SERVER["PHP_SELF"])), "/\\");

$ADODB_CACHE_DIR = 'C:/php/cache';

$ADODB_FETCH_MODE = ADODB_FETCH_ASSOC; // Liefert ein assoziatives Array, das der geholten Zeile entspricht 

$ADODB_COUNTRECS = true;

$dbSyb = ADONewConnection("mysqli");

$dbSyb->memCache = false;
$dbSyb->debug = false;

function getModules($dbSyb, $sidAdmin) {
    $data = array();

    $dbSyb->Connect(DB_HOST, DB_USER, DB_PW, DB_NAME);  //=>>> Verbindungsaufbau mit der DB

    if (!$dbSyb->IsConnected()) {
        exit("Anmeldung: " . $dbSyb->ErrorMsg());
    }

    $querySQL = "Select modul from module Where admin = '$sidAdmin'";

    $rs = $dbSyb->Execute($querySQL);

    if (!$rs) {
        exit("Query 1: " . $dbSyb->ErrorMsg());
    }

    $i = 0;
    while (!$rs->EOF) {
        $data[$i] = $rs->fields['modul'];
        $i++;
        $rs->MoveNext();
    }

    $rs->Close();

    return $data;
}

$script = '';

$phpStart = '<?php';
$phpEnd = '?>';

$htmlStart = '<HTML>';
$htmlEnd = '</HTML>';

$headStart = '<HEAD>';
$headEnd = '</HEAD>';

$bodyStart = '<BODY>';
$bodyEnd = '</BODY>';

$scriptStart = '<SCRIPT type="text/javascript">';
$scriptEnd = '</SCRIPT>';

$title = 'PECUNIA NON OLET';

$user = (isset($_SESSION['finanzen']['benutzer']) && $_SESSION['finanzen']['benutzer'] != '') ? $_SESSION['finanzen']['benutzer'] : 'NoUser';
$sidAdmin = (isset($_SESSION["finanzen"]["admin"])) ? $_SESSION["finanzen"]["admin"] : ADMIN_STD;

$header = 'session_start();
require_once("conf.php");
header("Cache-Control: no-cache, must-revalidate");
$host = (htmlspecialchars($_SERVER["HTTP_HOST"]));
$uri = rtrim(dirname(htmlspecialchars($_SERVER["PHP_SELF"])), "/\\\");';

$apiFolder = API_FOLDER;
$appFolder = APP_FOLDER;
$modul = (isset($_REQUEST['modul'])) ? $_REQUEST['modul'] : '';

$loggedIn = (isset($_SESSION["finanzen"]["loggedin"])) ? $_SESSION["finanzen"]["loggedin"] : false;
$status = (isset($_SESSION["finanzen"]["status"])) ? $_SESSION["finanzen"]["status"] : false;

$script .= $phpStart."\n";
$script .= $header."\n";

if ($loggedIn && $status) {
    $script .= $phpEnd."\n";
    $script .= $htmlStart."\n";
    $script .= $headStart."\n";
    $script .=          '<meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" >
            <meta name="viewport" content="width = device-width, initial-scale = 1">
            <link href="' . $apiFolder . '/styles/main.css" rel="stylesheet">
            <link href="' . $apiFolder . '/dist/dropzone.css" rel="stylesheet"> 
            <script src="' . $apiFolder . '/dist/dropzone.js" type="text/javascript"></script>
			<TITLE>' . $title . '</TITLE>';
 
    $script .= "\n".$scriptStart."\n";
    $script .= "user = '$user';\n";
    $script .= 'sidAdmin = "<?php echo (isset($_SESSION[\'finanzen\'][\'admin\'])) ? $_SESSION[\'finanzen\'][\'admin\'] : ADMIN_STD; ?>";';
    $script .= "\n";
    $script .= "apiFolder = '$apiFolder';\n";
    $script .= "appFolder = '$appFolder';\n";
    $script .= "modul = '$modul';\n";
    $script .= "var isomorphicDir = apiFolder + '/isomorphic/';\n";
    $script .= "var extend = false;\n";
    $script .= $scriptEnd."\n";
    $script .= '<script src= "' . $apiFolder . '/js/amcharts/amcharts/amcharts.js" type="text/javascript"></script>
            <script src= "' . $apiFolder . '/js/amcharts/amcharts/pie.js" type="text/javascript"></script>
            <script src= "' . $apiFolder . '/js/amcharts/amcharts/serial.js" type="text/javascript"></script>
            <script src= "' . $apiFolder . '/js/amcharts/amcharts/themes/patterns.js" type="text/javascript"></script>
            <script src= "' . $apiFolder . '/js/amcharts/amcharts/themes/black.js" type="text/javascript"></script>
            <script src= "' . $apiFolder . '/js/amcharts/amcharts/themes/chalk.js" type="text/javascript"></script>
            <script src= "' . $apiFolder . '/js/amcharts/amcharts/themes/dark.js" type="text/javascript"></script>
            <script src= "' . $apiFolder . '/js/amcharts/amcharts/themes/light.js" type="text/javascript"></script>
            <script src= "' . $apiFolder . '/js/amcharts/amcharts/plugins/responsive/responsive.min.js" type="text/javascript"></script>
            <SCRIPT type="text/javascript" SRC="' . $apiFolder . '/isomorphic/system/modules/ISC_Core.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="' . $apiFolder . '/isomorphic/system/modules/ISC_Foundation.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="' . $apiFolder . '/isomorphic/system/modules/ISC_Containers.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="' . $apiFolder . '/isomorphic/system/modules/ISC_Grids.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="' . $apiFolder . '/isomorphic/system/modules/ISC_Forms.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="' . $apiFolder . '/isomorphic/system/modules/ISC_DataBinding.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="' . $apiFolder . '/isomorphic/system/modules/ISC_Calendar.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="' . $apiFolder . '/isomorphic/system/modules/ISC_RichTextEditor.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="' . $apiFolder . '/isomorphic/skins/Tahoe/load_skin.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="' . $apiFolder . '/isomorphic/locales/frameworkMessages_de.properties"></SCRIPT>';
    $script .= $headEnd."\n";

    $script .= $bodyStart."\n";

    $aModules = getModules($dbSyb, $sidAdmin);

    foreach ($aModules as $module) {
        $script .= "<script src='$apiFolder/$module' type='text/javascript'></script>\n";
    }

    $script .= $bodyEnd."\n";
    $script .= $htmlEnd."\n";   
    
} else {
    $script .= "header('Location: http://$host$uri/login');\n";
    $script .= $phpEnd."\n";
}

file_put_contents("start.php", $script);

header("Location: http://$host$uri/start");
?>