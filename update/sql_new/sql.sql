-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server Version:               10.4.12-MariaDB - mariadb.org binary distribution
-- Server Betriebssystem:        Win64
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Exportiere Struktur von Prozedur finanz_db.umsaetzeKategorieClone
DROP PROCEDURE IF EXISTS `umsaetzeKategorieClone`;
DELIMITER //
CREATE PROCEDURE `umsaetzeKategorieClone`(
	IN `Var_ID` int
)
root:BEGIN

Declare Var_anzahl INT;
DECLARE Var_date_tmp DATE;
DECLARE Var_newID INT;
DECLARE Var_id2 INT;
DECLARE Var_interval CHAR(1);
DECLARE Var_enddatum DATE;
DECLARE Var_datum DATE;

SET Var_interval = (SELECT `interval` FROM einausgaben WHERE ID = Var_ID);
SET Var_enddatum = (SELECT `enddatum` FROM einausgaben WHERE ID = Var_ID);
SET Var_datum = (SELECT `datum` FROM einausgaben WHERE ID = Var_ID);



Start Transaction;
 
INSERt INTO einausgaben 
(art, typ, kontonr, vorgang, betrag, kategorie_id, datum, dauer, `interval`, enddatum, herkunft, detail, kommentar, zahlungsmittel_id, bundle) 
Select art, typ, kontonr, vorgang, betrag, kategorie_id, datum, dauer, `interval`, enddatum, herkunft, detail, kommentar, zahlungsmittel_id, bundle FROM einausgaben WHERE ID = Var_ID ;

set Var_anzahl = ROW_COUNT();


SET Var_newID = (Select max(ID) from einausgaben);


if Var_interval = 'Q'
Then
SET Var_date_tmp = DATE_ADD(Var_datum, INTERVAL 1 QUARTER); 
  While DATE_FORMAT(Var_date_tmp, "%Y%m") <= DATE_FORMAT(Var_enddatum, "%Y%m") DO
    INSERT INTO dates_tmp (einausgabe_id, datum) VALUES(Var_newID, Var_date_tmp);
    SET Var_date_tmp = DATE_ADD(Var_date_tmp, INTERVAL 1 QUARTER); 
  END While;
END if;


if Var_interval = 'Y'
Then
SET Var_date_tmp = DATE_ADD(Var_datum, INTERVAL 1 YEAR); 
  While DATE_FORMAT(Var_date_tmp, "%Y%m") <= DATE_FORMAT(Var_enddatum, "%Y%m") DO  
    INSERT INTO dates_tmp (einausgabe_id, datum) VALUES(Var_newID, Var_date_tmp);
    SET Var_date_tmp = DATE_ADD(Var_date_tmp, INTERVAL 1 YEAR); 
  END While;
END if;


if Var_interval = 'M'
Then
SET Var_date_tmp = DATE_ADD(Var_datum, INTERVAL 1 MONTH); 
  While DATE_FORMAT(Var_date_tmp, "%Y%m") <= DATE_FORMAT(Var_enddatum, "%Y%m") DO  
    INSERT INTO dates_tmp (einausgabe_id, datum) VALUES(Var_newID, Var_date_tmp);
    SET Var_date_tmp = DATE_ADD(Var_date_tmp, INTERVAL 1 MONTH); 
  END While;
END if;




COMMIT;

SELECT Var_anzahl AS ergebnis, Var_newID as ID;

END//
DELIMITER ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
