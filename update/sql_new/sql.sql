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

-- Exportiere Struktur von Prozedur finanz_db.ausgabenDetailsDS
DROP PROCEDURE IF EXISTS `ausgabenDetailsDS`;
DELIMITER //
CREATE PROCEDURE `ausgabenDetailsDS`(
	IN `var_monat` CHAR(6),
	IN `var_giroSpar` VARCHAR(50)
)
root: BEGIN
DECLARE monat CHAR(2);
DECLARE jahr CHAR(4);

SET monat = SUBSTRING(var_monat,1,2);
SET jahr = SUBSTRING(var_monat,3,4);

SELECT 
	0 AS ID, 
	CONCAT(jahr,'-',monat,'-01') AS datum,
	'ÜBERTRAG VORMONAT' AS vorgang,
	'N' AS extern,
	'ÜBERTRAG VORMONAT' AS herkunft,
	'ÜBERTRAG VORMONAT' AS buchungstext,
	SUM(ifnull(ausgabe,0) + ifnull(einnahme,0)) AS betrag,
	a.kontonr,
	NULL as einausgaben_id
FROM monats_ausgaben a JOIN konten k ON  a.kontonr=k.kontonr
JOIN konten_typen kt ON k.kontotyp=kt.kontotyp
WHERE a.kontonr = var_giroSpar AND date_format(a.datum,"%Y%m") < CONCAT(jahr,monat)
GROUP BY a.kontonr

UNION	  

SELECT 
      ID,
	   datum as datum,
	   vorgang, ifnull(rtrim(extern),'N') as extern, ifnull(herkunft,'---') as herkunft, ifnull(buchungstext,'---') as buchungstext,  
	   einnahme as betrag, kontonr, einausgaben_id
  FROM monats_ausgaben
  Where month(datum) = SUBSTRING(var_monat,1,2) and year(datum) = SUBSTRING(var_monat,3,4) and einnahme > 0 and kontonr = var_giroSpar
  Union
 SELECT 
       ID,
	   datum as datum,
	   vorgang, ifnull(rtrim(extern),'N') as extern, ifnull(herkunft,'---') as herkunft, ifnull(buchungstext,'---') as buchungstext,  
	   ausgabe as betrag, kontonr, einausgaben_id
  FROM monats_ausgaben
  Where month(datum) = SUBSTRING(var_monat,1,2) and year(datum) = SUBSTRING(var_monat,3,4) and ausgabe < 0 and kontonr = var_giroSpar
  ORDER BY datum;
End//
DELIMITER ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
