<?php
session_start();
require_once("conf.php");
header("Cache-Control: no-cache, must-revalidate");
$host = (htmlspecialchars($_SERVER["HTTP_HOST"]));
$uri = rtrim(dirname(htmlspecialchars($_SERVER["PHP_SELF"])), "/\\");
if (isset($_SESSION["finanzen"]["loggedin"]) && $_SESSION["finanzen"]["loggedin"] && $_SESSION["finanzen"]["status"]) {
    ?>
    <HTML> 
        <HEAD>            
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" >
            <meta name="viewport" content="width = device-width, initial-scale = 1">
            <link href="<?php echo API_FOLDER ?>/styles/main.css" rel="stylesheet">
            <link href="<?php echo API_FOLDER ?>/dist/dropzone.css" rel="stylesheet"> 
            <script src="<?php echo API_FOLDER ?>/dist/dropzone.js" type="text/javascript"></script> 
            
            <TITLE>PECUNIA NON OLET</TITLE>            
            <SCRIPT type="text/javascript">
                user = "<?php echo (isset($_SESSION['finanzen']['benutzer']) && $_SESSION['finanzen']['benutzer'] != '') ? $_SESSION['finanzen']['benutzer'] : 'NoUser'; ?>";
                sidAdmin = "<?php $_SESSION["finanzen"]["admin"]; ?>";
            </SCRIPT>
            <SCRIPT type="text/javascript">
                apiFolder = "<?php echo API_FOLDER ?>";
                appFolder = "<?php echo APP_FOLDER ?>";
                modul = "<?php
    if (isset($_REQUEST['modul'])) {
        echo $_REQUEST['modul'];
    } else {
        echo '';
    }
    ?>";
                var isomorphicDir = apiFolder + "/isomorphic/";
            </SCRIPT> 	
            <script src= "<?php echo API_FOLDER ?>/js/amcharts/amcharts/amcharts.js" type="text/javascript"></script>
            <script src= "<?php echo API_FOLDER ?>/js/amcharts/amcharts/pie.js" type="text/javascript"></script>
            <script src= "<?php echo API_FOLDER ?>/js/amcharts/amcharts/serial.js" type="text/javascript"></script>
            <script src= "<?php echo API_FOLDER ?>/js/amcharts/amcharts/themes/patterns.js" type="text/javascript"></script>
            <script src= "<?php echo API_FOLDER ?>/js/amcharts/amcharts/themes/black.js" type="text/javascript"></script>
            <script src= "<?php echo API_FOLDER ?>/js/amcharts/amcharts/themes/chalk.js" type="text/javascript"></script>
            <script src= "<?php echo API_FOLDER ?>/js/amcharts/amcharts/themes/dark.js" type="text/javascript"></script>
            <script src= "<?php echo API_FOLDER ?>/js/amcharts/amcharts/themes/light.js" type="text/javascript"></script>
            <script src= "<?php echo API_FOLDER ?>/js/amcharts/amcharts/plugins/responsive/responsive.min.js" type="text/javascript"></script>
            <SCRIPT type="text/javascript" SRC="<?php echo API_FOLDER ?>/isomorphic/system/modules/ISC_Core.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="<?php echo API_FOLDER ?>/isomorphic/system/modules/ISC_Foundation.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="<?php echo API_FOLDER ?>/isomorphic/system/modules/ISC_Containers.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="<?php echo API_FOLDER ?>/isomorphic/system/modules/ISC_Grids.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="<?php echo API_FOLDER ?>/isomorphic/system/modules/ISC_Forms.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="<?php echo API_FOLDER ?>/isomorphic/system/modules/ISC_DataBinding.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="<?php echo API_FOLDER ?>/isomorphic/system/modules/ISC_Calendar.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="<?php echo API_FOLDER ?>/isomorphic/system/modules/ISC_RichTextEditor.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="<?php echo API_FOLDER ?>/isomorphic/skins/Tahoe/load_skin.js?locale=de"></SCRIPT>
            <SCRIPT type="text/javascript" SRC="<?php echo API_FOLDER ?>/isomorphic/locales/frameworkMessages_de.properties"></SCRIPT>

        </HEAD>
        <BODY>
            <!-- <script src="functions.js" type="text/javascript"></script> -->    

        
            <script src="<?php echo API_FOLDER ?>/finanzen.js" type="text/javascript"></script>
            <script src="<?php echo API_FOLDER ?>/finanzen_umsaetze.js" type="text/javascript"></script>           
            <script src="<?php echo API_FOLDER ?>/stammdaten_kategorien.js" type="text/javascript"></script>
            <script src="<?php echo API_FOLDER ?>/stammdaten_konten.js" type="text/javascript"></script>
            <script src="<?php echo API_FOLDER ?>/stammdaten_zahlungsmittel.js" type="text/javascript"></script>
            <script src="<?php echo API_FOLDER ?>/finanzen_prognosen.js" type="text/javascript"></script>
            <script src="<?php echo API_FOLDER ?>/finanzen_einausgaben.js" type="text/javascript"></script>
            <script src="<?php echo API_FOLDER ?>/finanzen_kredite.js" type="text/javascript"></script>
            <script src="<?php echo API_FOLDER ?>/finanzen_kreditkarten.js" type="text/javascript"></script>
            <script src="<?php echo API_FOLDER ?>/finanzen_raten.js" type="text/javascript"></script>
            <script src="<?php echo API_FOLDER ?>/verwaltung_user.js" type="text/javascript"></script>
        </BODY>
    </HTML>
    <?php
} else {
    header("Location: http://$host$uri/login");
}