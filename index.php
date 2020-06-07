<!DOCTYPE html>
<?php
$host = (htmlspecialchars($_SERVER["HTTP_HOST"]));
$uri = rtrim(dirname(htmlspecialchars($_SERVER["PHP_SELF"])), "/\\");
require_once("conf.php");
?>
<html lang="de">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>FINANZEN</title>
        <link href="smartclient/styles/styles.css" rel="stylesheet"> 
        <!--<link rel="shortcut icon" href="http://<?php echo $host . $uri ?>/images/favicon.ico" type='image/x-icon'>-->
                <!--<script src="..\login\sha512.js" type="text/javascript"></script>--> 
        <SCRIPT src="smartclient/login.js"></SCRIPT> 
        <SCRIPT type="text/javascript">
            appFolder = "<?php echo APP_FOLDER ?>";
            userOK = "<?php echo USR_OK ?>";
        </SCRIPT>        
    </head>
    <body>
        <img id="bg_img_login" alt=" " class="center_login">
        <div class="box_login center_login">
            <span id="title"></span>
            <form>
                <br />
                <!--<label for="name">User: </label>-->
                <span class="glyphi" id="glyph_usr"></span>                    
                <input class="feld" type="text" name="benutzername" id="benutzername"/>
                <br />
                <br />
                <!--<label for="passwort">Passwort: </label>-->
                <span class="glyphi glyph_pw"></span> 
                <input class="feld" type="password" name="passwort" id="passwort"/>
                <br />              
            </form> 
            <br/>
            <div><center><button class="login_button" id="btnLogin">Login</button></center></div>         
            <p id="antwort"></p>
        </div>
    </body>
</html>