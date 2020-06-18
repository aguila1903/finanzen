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


-- Exportiere Datenbank Struktur für finanz_db
DROP DATABASE IF EXISTS `finanz_db`;
CREATE DATABASE IF NOT EXISTS `finanz_db` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `finanz_db`;

-- Exportiere Struktur von Tabelle finanz_db.dates_tmp
DROP TABLE IF EXISTS `dates_tmp`;
CREATE TABLE IF NOT EXISTS `dates_tmp` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `einausgabe_id` int(11) NOT NULL,
  `datum` date NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_einausgabe` (`einausgabe_id`),
  KEY `index` (`datum`),
  KEY `index2` (`einausgabe_id`,`datum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle finanz_db.einausgaben
DROP TABLE IF EXISTS `einausgaben`;
CREATE TABLE IF NOT EXISTS `einausgaben` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `art` char(1) NOT NULL DEFAULT '',
  `typ` char(1) NOT NULL DEFAULT '',
  `kontonr` varchar(50) NOT NULL DEFAULT '',
  `vorgang` varchar(450) DEFAULT '',
  `herkunft` varchar(450) DEFAULT '',
  `betrag` decimal(10,2) NOT NULL DEFAULT 0.00,
  `kategorie_id` int(11) NOT NULL DEFAULT 0,
  `datum` date NOT NULL,
  `dauer` int(11) DEFAULT 1,
  `interval` char(1) DEFAULT NULL,
  `enddatum` date NOT NULL,
  `ID2` int(11) DEFAULT NULL,
  `detail` char(1) DEFAULT 'N' COMMENT 'N=keine Dateil-Ansicht, J=Detail-Ansicht des Vorgangs',
  `kommentar` text DEFAULT NULL,
  `dokument` varchar(264) DEFAULT NULL,
  `zahlungsmittel_id` int(11) DEFAULT NULL,
  `bundle` varchar(64) DEFAULT NULL COMMENT 'Positionen zu einem ganzen Einkauf (Bon, Quittung) zusammenführen',
  PRIMARY KEY (`ID`),
  KEY `kagegorie` (`kategorie_id`),
  KEY `kontonr` (`kontonr`),
  KEY `zahlungsmittel` (`zahlungsmittel_id`),
  CONSTRAINT `kagegorie` FOREIGN KEY (`kategorie_id`) REFERENCES `kategorien` (`ID`),
  CONSTRAINT `kontonr` FOREIGN KEY (`kontonr`) REFERENCES `konten` (`kontonr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle finanz_db.kategorien
DROP TABLE IF EXISTS `kategorien`;
CREATE TABLE IF NOT EXISTS `kategorien` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `typ` char(1) NOT NULL,
  `art` char(1) NOT NULL,
  `bezeichnung` varchar(264) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle finanz_db.kk_raten
DROP TABLE IF EXISTS `kk_raten`;
CREATE TABLE IF NOT EXISTS `kk_raten` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `karten_nr` char(4) NOT NULL COMMENT 'karten_kz',
  `vorgang` varchar(50) DEFAULT NULL COMMENT 'islem',
  `rate` int(11) DEFAULT NULL COMMENT 'vade',
  `max_rate` int(11) DEFAULT NULL COMMENT 'vade_max',
  `betrag` decimal(8,2) DEFAULT NULL COMMENT 'taksit',
  `monat` char(6) DEFAULT NULL,
  `status` char(1) DEFAULT NULL,
  `comment` varchar(500) DEFAULT NULL,
  `datum` date DEFAULT NULL COMMENT 'islem_tarihi',
  PRIMARY KEY (`ID`),
  KEY `Index1` (`karten_nr`,`status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle finanz_db.konten
DROP TABLE IF EXISTS `konten`;
CREATE TABLE IF NOT EXISTS `konten` (
  `kontonr` varchar(50) NOT NULL DEFAULT '0',
  `bezeichnung` varchar(50) NOT NULL DEFAULT '0',
  `kontotyp` smallint(6) NOT NULL DEFAULT 0 COMMENT '1=Giro, 2=Spar, 3=Mäusekonto, 4=Kreditkarte',
  PRIMARY KEY (`kontonr`),
  KEY `fk_konto_typ` (`kontotyp`),
  CONSTRAINT `fk_konto_typ` FOREIGN KEY (`kontotyp`) REFERENCES `konten_typen` (`kontotyp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle finanz_db.konten_typen
DROP TABLE IF EXISTS `konten_typen`;
CREATE TABLE IF NOT EXISTS `konten_typen` (
  `kontotyp` smallint(6) NOT NULL DEFAULT 0,
  `bezeichnung` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`kontotyp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle finanz_db.kreditkarten_abr
DROP TABLE IF EXISTS `kreditkarten_abr`;
CREATE TABLE IF NOT EXISTS `kreditkarten_abr` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `karten_nr` varchar(50) DEFAULT NULL,
  `betrag` decimal(8,2) DEFAULT NULL COMMENT 'doenem_borcu',
  `monat` char(6) DEFAULT NULL,
  `datum` date DEFAULT NULL,
  `zahlung` decimal(8,2) DEFAULT NULL COMMENT 'odeme',
  `pdf` varchar(200) DEFAULT NULL,
  `mind_zahlung` decimal(8,2) DEFAULT NULL COMMENT 'asgari',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle finanz_db.module
DROP TABLE IF EXISTS `module`;
CREATE TABLE IF NOT EXISTS `module` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `modul` varchar(264) NOT NULL,
  `admin` char(1) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle finanz_db.monats_ausgaben
DROP TABLE IF EXISTS `monats_ausgaben`;
CREATE TABLE IF NOT EXISTS `monats_ausgaben` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `datum` datetime NOT NULL,
  `einnahme` decimal(10,2) DEFAULT NULL,
  `ausgabe` decimal(10,2) DEFAULT NULL,
  `vorgang` varchar(450) NOT NULL,
  `csv_name` varchar(250) DEFAULT NULL,
  `typ` varchar(2) DEFAULT NULL,
  `extern` char(1) DEFAULT NULL,
  `buchungstext` varchar(450) DEFAULT NULL,
  `herkunft` varchar(450) DEFAULT NULL,
  `kontonr` varchar(50) NOT NULL,
  `hash` char(32) DEFAULT NULL,
  `einausgaben_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `Index` (`datum`),
  KEY `Index2` (`kontonr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle finanz_db.prognosedaten
DROP TABLE IF EXISTS `prognosedaten`;
CREATE TABLE IF NOT EXISTS `prognosedaten` (
  `vorgang` varchar(450) NOT NULL,
  `betrag` decimal(12,2) NOT NULL,
  `monat` date NOT NULL,
  `kontotyp` smallint(6) NOT NULL DEFAULT 0,
  `art` varchar(3) NOT NULL DEFAULT '0',
  `kategorie` varchar(264) NOT NULL,
  `kontonr` varchar(50) DEFAULT NULL,
  KEY `index1` (`monat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle finanz_db.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `benutzer` varchar(20) NOT NULL,
  `passwort` varchar(128) DEFAULT NULL,
  `admin` char(1) DEFAULT NULL,
  `status` char(1) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `loginCount` smallint(6) DEFAULT NULL,
  `loginTime` datetime DEFAULT NULL,
  `timeOut` datetime DEFAULT NULL,
  `logoutTime` datetime DEFAULT NULL,
  `onlineTime` datetime DEFAULT NULL,
  `session` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`UserID`,`benutzer`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle finanz_db.wechselkurse
DROP TABLE IF EXISTS `wechselkurse`;
CREATE TABLE IF NOT EXISTS `wechselkurse` (
  `datum` datetime NOT NULL,
  `kurs` decimal(7,4) NOT NULL,
  `waehrung` varchar(20) NOT NULL,
  PRIMARY KEY (`datum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von Tabelle finanz_db.zahlungsmittel
DROP TABLE IF EXISTS `zahlungsmittel`;
CREATE TABLE IF NOT EXISTS `zahlungsmittel` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `bezeichnung` varchar(50) NOT NULL DEFAULT '0',
  `karten_nr` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Daten Export vom Benutzer nicht ausgewählt

-- Exportiere Struktur von View finanz_db.vw_fixkosten
DROP VIEW IF EXISTS `vw_fixkosten`;
-- Erstelle temporäre Tabelle um View Abhängigkeiten zuvorzukommen
CREATE TABLE `vw_fixkosten` (
	`ID` INT(11) NOT NULL,
	`betrag` DECIMAL(10,2) NOT NULL,
	`vorgang` VARCHAR(450) NULL COLLATE 'utf8_general_ci',
	`kontonr` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`art` CHAR(1) NOT NULL COLLATE 'utf8_general_ci',
	`kategorie_id` INT(11) NOT NULL,
	`datum` DATE NOT NULL
) ENGINE=MyISAM;

-- Exportiere Struktur von Prozedur finanz_db.addUmsaetze
DROP PROCEDURE IF EXISTS `addUmsaetze`;
DELIMITER //
CREATE PROCEDURE `addUmsaetze`(
	IN `Var_buchtext` VARCHAR(450),
	IN `Var_vorgang` VARCHAR(450),
	IN `Var_herkunft` VARCHAR(450),
	IN `Var_datum` DATETIME,
	IN `Var_einnahme` DECIMAL(10,2),
	IN `Var_ausgabe` DECIMAL(10,2),
	IN `Var_kontonr` VARCHAR(50),
	IN `Var_hash` VARCHAR(32)
)
root:BEGIN

Declare Var_anzahl int;


Start Transaction;

 
INSERt INTO monats_ausgaben 
(datum, einnahme, ausgabe, buchungstext, herkunft, vorgang, kontonr, hash) 
values (Var_datum, Var_einnahme, Var_ausgabe, Var_buchtext, Var_herkunft, Var_vorgang, Var_kontonr, Var_hash);

set Var_anzahl = ROW_COUNT();

 IF Var_anzahl = 0
 Then 
 Rollback;
SELECT Var_anzahl AS ergebnis;
 Leave root;
 End IF;
commit;
SELECT Var_anzahl AS ergebnis, (Select max(ID) from monats_ausgaben) as ID;

END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.ausgabenADD
DROP PROCEDURE IF EXISTS `ausgabenADD`;
DELIMITER //
CREATE PROCEDURE `ausgabenADD`(
	IN `var_vorgang` VARCHAR(450),
	IN `var_betrag` NUMERIC(10,2),
	IN `var_datum` DATE,
	IN `var_csv_name` VARCHAR(250),
	IN `var_buchtext` VARCHAR(450),
	IN `var_herkunft` VARCHAR(450),
	IN `var_hash` CHAR(32),
	IN `var_kontonr` VARCHAR(50),
	IN `var_typ` VARCHAR(2)
)
root:BEGIN

Declare  var_Ergebnis int;
Declare  var_einnahme numeric(10,2);
Declare  var_ausgabe numeric(10,2);
  
set var_Ergebnis = 0;

Start Transaction;

    
  if var_betrag < 0 then  
    set var_ausgabe = var_betrag;
    set var_einnahme = 0;
  else
    set var_einnahme = var_betrag;
    set var_ausgabe = 0;
  end if;
  
  
  if not exists (Select hash from monats_ausgaben where month(datum) = month(var_datum) and year(datum) = year(var_datum) and typ = var_typ and hash = var_hash) then  
    Insert Into monats_ausgaben
    (vorgang, einnahme, ausgabe, datum, csv_name,typ, buchungstext, herkunft, hash, kontonr)
    values
    (var_vorgang, var_einnahme, var_ausgabe, var_datum, var_csv_name,var_typ, var_buchtext, var_herkunft, var_hash, var_kontonr);
  
    Set var_Ergebnis = ROW_COUNT();
    
	if var_Ergebnis = 1 then       
      Select var_Ergebnis AS Ergebnis, var_vorgang AS ErgText;
      commit;
	Else		  
	  Select var_Ergebnis AS Ergebnis, var_vorgang AS ErgText;
      rollback;
      leave root;	
    End if; 

 Else 
    Set var_Ergebnis = -2;
    Select var_Ergebnis AS Ergebnis, var_vorgang AS ErgText;
    rollback;
    leave root;
 End if;
 


  
END//
DELIMITER ;

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

-- Exportiere Struktur von Prozedur finanz_db.ausgabenDS
DROP PROCEDURE IF EXISTS `ausgabenDS`;
DELIMITER //
CREATE PROCEDURE `ausgabenDS`(
	IN `var_monat` CHAR(2),
	IN `var_jahr` CHAR(4),
	IN `var_giroSpar` VARCHAR(50)
)
root: BEGIN

 declare var_datum char(10);

 set var_datum = var_jahr+'-'+var_monat+'-01';

SELECT 
    SUM(ifnull(a.einnahme,0)) AS Einnahme,
    SUM(ifnull(a.ausgabe,0)) AS Ausgabe,
    SUM(ifnull(a.ausgabe,0) + ifnull(a.einnahme,0)) AS Differenz,
    DATE_FORMAT(datum, '%m%Y') AS Monat,
    DATE_FORMAT(datum, '%Y%m') AS sort,
    kontonr AS typ
FROM
    monats_ausgaben a
WHERE
    kontonr = var_giroSpar
GROUP BY DATE_FORMAT(datum, '%m%Y') , DATE_FORMAT(datum, '%Y%m') , kontonr
ORDER BY sort DESC; 

  End//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.dashboard_ausgaben_gesamt
DROP PROCEDURE IF EXISTS `dashboard_ausgaben_gesamt`;
DELIMITER //
CREATE PROCEDURE `dashboard_ausgaben_gesamt`()
BEGIN

SELECT 
-- Fixkosten
IFNULL((SELECT SUM(ifnull(betrag,0)) + IFNULL((SELECT SUM(ifnull(betrag,0))
FROM  einausgaben  
WHERE art = 'A' AND date_format(datum, "%Y%m") = DATE_FORMAT(a.datum,"%Y%m") AND typ = 'F'),0)
FROM  einausgaben e JOIN dates_tmp d on e.ID=d.einausgabe_id
WHERE art = 'A'  AND DATE_FORMAT(d.datum, "%Y%m") = DATE_FORMAT(a.datum,"%Y%m") 
),0)  AS fixkosten,
-- Variable Kosten
IFNULL((SELECT SUM(ifnull(betrag,0))
FROM  einausgaben e 
WHERE art = 'A' AND e.typ = 'V'  AND DATE_FORMAT(e.datum, "%Y%m") = DATE_FORMAT(a.datum,"%Y%m")),0) AS variable_kosten, 
-- Stand
date_format(a.datum, "%Y%m") AS stand

FROM einausgaben a 
Where DATE_FORMAT(a.datum,"%Y%m%d") between '202001' AND DATE_FORMAT(CURDATE(),"%Y%m%d") 
GROUP BY DATE_FORMAT(a.datum,"%Y%m");

END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.dashboard_ausg_kat
DROP PROCEDURE IF EXISTS `dashboard_ausg_kat`;
DELIMITER //
CREATE PROCEDURE `dashboard_ausg_kat`()
BEGIN
SELECT SUM(ifnull(betrag,0)) AS summe, k.bezeichnung 
FROM  einausgaben e JOIN dates_tmp d on e.ID=d.einausgabe_id
JOIN kategorien k ON e.kategorie_id=k.ID
WHERE e.art = 'A' AND date_format(d.datum, "%Y%m%d") BETWEEN date_format(CURDATE(), "%Y%m01") and CURDATE()
GROUP BY k.bezeichnung
UNION
SELECT SUM(ifnull(betrag,0)) AS summe, k.bezeichnung
FROM  einausgaben e 
JOIN kategorien k ON e.kategorie_id=k.ID
WHERE e.art = 'A' AND date_format(datum, "%Y%m%d") BETWEEN date_format(CURDATE(), "%Y%m01") and CURDATE()
GROUP BY k.bezeichnung;
END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.dashboard_einnahmen
DROP PROCEDURE IF EXISTS `dashboard_einnahmen`;
DELIMITER //
CREATE PROCEDURE `dashboard_einnahmen`()
BEGIN
  DECLARE var_vorMonatReal DATE;    

  SET var_vorMonatReal = date_format(ADDDATE(CURDATE(), INTERVAL -1 MONTH), "%Y%m%d");



SELECT ifnull((SELECT SUM(ifnull(betrag,0)) + 

IFNULL((SELECT SUM(ifnull(betrag,0))
FROM  einausgaben  
WHERE art = 'E' AND date_format(datum, "%Y%m%d") BETWEEN date_format(var_vorMonatReal, "%Y%m01") and var_vorMonatReal AND typ = 'F'),0) 

FROM  einausgaben e JOIN dates_tmp d on e.ID=d.einausgabe_id
WHERE art = 'E' AND date_format(d.datum, "%Y%m%d") BETWEEN date_format(var_vorMonatReal, "%Y%m01") and var_vorMonatReal
GROUP BY e.typ),0) AS fixeinnahmen
, 
ifnull((SELECT SUM(ifnull(betrag,0))
FROM  einausgaben e 
WHERE art = 'E' AND date_format(e.datum, "%Y%m%d") BETWEEN date_format(var_vorMonatReal, "%Y%m01") and var_vorMonatReal AND e.typ = 'V' 
GROUP BY e.typ),0) AS variable_einnahmen,
date_format(var_vorMonatReal, "%d.%m.%Y") AS stand

UNION 

SELECT ifnull((SELECT SUM(ifnull(betrag,0)) + 

IFNULL((SELECT SUM(ifnull(betrag,0))
FROM  einausgaben  
WHERE art = 'E' AND date_format(datum, "%Y%m%d") BETWEEN date_format(CURDATE(), "%Y%m01") and CURDATE()
AND typ = 'F'),0)
FROM  einausgaben e JOIN dates_tmp d on e.ID=d.einausgabe_id
WHERE art = 'E' AND date_format(d.datum, "%Y%m%d") BETWEEN date_format(CURDATE(), "%Y%m01") and CURDATE()
GROUP BY e.typ),0)  AS fixeinnahmen
, 
ifnull((SELECT SUM(ifnull(betrag,0))
FROM  einausgaben e 
WHERE art = 'E' AND date_format(e.datum, "%Y%m%d") BETWEEN date_format(CURDATE(), "%Y%m01") and CURDATE() AND e.typ = 'V' 
GROUP BY e.typ),0) AS variable_einnahmen, 
date_format(CURDATE(), "%d.%m.%Y") AS stand;
END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.dashboard_ein_kat
DROP PROCEDURE IF EXISTS `dashboard_ein_kat`;
DELIMITER //
CREATE PROCEDURE `dashboard_ein_kat`()
BEGIN
SELECT SUM(ifnull(betrag,0)) AS summe, k.bezeichnung 
FROM  einausgaben e JOIN dates_tmp d on e.ID=d.einausgabe_id
JOIN kategorien k ON e.kategorie_id=k.ID
WHERE e.art = 'E' AND date_format(d.datum, "%Y%m%d") BETWEEN date_format(CURDATE(), "%Y%m01") and CURDATE()
GROUP BY k.bezeichnung
UNION
SELECT SUM(ifnull(betrag,0)) AS summe, k.bezeichnung
FROM  einausgaben e 
JOIN kategorien k ON e.kategorie_id=k.ID
WHERE e.art = 'E' AND date_format(datum, "%Y%m%d") BETWEEN date_format(CURDATE(), "%Y%m01") and CURDATE()
GROUP BY k.bezeichnung;
END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.dashboard_finanzstatus
DROP PROCEDURE IF EXISTS `dashboard_finanzstatus`;
DELIMITER //
CREATE PROCEDURE `dashboard_finanzstatus`()
BEGIN
  DECLARE var_vorMonatReal DATE;    

  SET var_vorMonatReal = date_format(ADDDATE(CURDATE(), INTERVAL -1 MONTH), "%Y%m%d");



SELECT SUM(ifnull(ausgabe,0) + ifnull(einnahme,0)) as summe, k.kontotyp,
k.bezeichnung, date_format(CURDATE(), "%d.%m.%Y") AS stand
FROM  monats_ausgaben m JOIN konten k ON m.kontonr=k.kontonr
GROUP BY m.kontonr
UNION 
SELECT SUM(ifnull(ausgabe,0) + ifnull(einnahme,0)) as summe, k.kontotyp,
k.bezeichnung, date_format(var_vorMonatReal, "%d.%m.%Y") AS stand
FROM  monats_ausgaben m JOIN konten k ON m.kontonr=k.kontonr
WHERE date_format(m.datum, "%Y%m%d") <=  var_vorMonatReal
GROUP BY m.kontonr

ORDER BY kontotyp;
END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.dashboard_kosten
DROP PROCEDURE IF EXISTS `dashboard_kosten`;
DELIMITER //
CREATE PROCEDURE `dashboard_kosten`()
BEGIN
  DECLARE var_vorMonatReal DATE;    

  SET var_vorMonatReal = date_format(ADDDATE(CURDATE(), INTERVAL -1 MONTH), "%Y%m%d");



SELECT IFNULL((SELECT SUM(ifnull(betrag,0)) + IFNULL((SELECT SUM(ifnull(betrag,0))
FROM  einausgaben  
WHERE art = 'A' AND date_format(datum, "%Y%m%d") BETWEEN date_format(var_vorMonatReal, "%Y%m01") and var_vorMonatReal
AND typ = 'F'),0)
FROM  einausgaben e JOIN dates_tmp d on e.ID=d.einausgabe_id
WHERE art = 'A' AND date_format(d.datum, "%Y%m%d") BETWEEN date_format(var_vorMonatReal, "%Y%m01") and var_vorMonatReal
GROUP BY e.typ),0) AS fixkosten
, 
IFNULL((SELECT SUM(ifnull(betrag,0)) as summe
FROM  einausgaben e 
WHERE art = 'A' AND date_format(e.datum, "%Y%m%d") BETWEEN date_format(var_vorMonatReal, "%Y%m01") and var_vorMonatReal AND e.typ = 'V' 
GROUP BY e.typ),0) AS variable_kosten,
date_format(var_vorMonatReal, "%d.%m.%Y") AS stand


UNION 
SELECT IFNULL((SELECT SUM(ifnull(betrag,0)) + IFNULL((SELECT SUM(ifnull(betrag,0))
FROM  einausgaben  
WHERE art = 'A' AND date_format(datum, "%Y%m%d") BETWEEN date_format(CURDATE(), "%Y%m01") and CURDATE()
AND typ = 'F'),0)
FROM  einausgaben e JOIN dates_tmp d on e.ID=d.einausgabe_id
WHERE art = 'A' AND date_format(d.datum, "%Y%m%d") BETWEEN date_format(CURDATE(), "%Y%m01") and CURDATE()
GROUP BY e.typ),0)  AS fixkosten
, 
IFNULL((SELECT SUM(ifnull(betrag,0))
FROM  einausgaben e 
WHERE art = 'A' AND date_format(e.datum, "%Y%m%d") BETWEEN date_format(CURDATE(), "%Y%m01") and CURDATE() AND e.typ = 'V' 
GROUP BY e.typ),0) AS variable_kosten, date_format(CURDATE(), "%d.%m.%Y") AS stand;
END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.editUmsaetze
DROP PROCEDURE IF EXISTS `editUmsaetze`;
DELIMITER //
CREATE PROCEDURE `editUmsaetze`(
	IN `Var_ID` INT,
	IN `Var_buchtext` VARCHAR(450),
	IN `Var_vorgang` VARCHAR(450),
	IN `Var_herkunft` VARCHAR(450),
	IN `Var_datum` DATETIME,
	IN `Var_einnahme` DECIMAL(10,2),
	IN `Var_ausgabe` DECIMAL(10,2),
	IN `Var_kontonr` VARCHAR(50),
	IN `Var_hash` VARCHAR(32)
)
root:BEGIN

Declare Var_anzahl int;


Start Transaction;

 
UPDATE monats_ausgaben 
SET 
    datum = Var_datum,
    einnahme = Var_einnahme,
    ausgabe = Var_ausgabe,
    buchungstext = Var_buchtext,
    herkunft = Var_herkunft,
    vorgang = Var_vorgang,
    kontonr = Var_kontonr,
    hash = Var_hash
WHERE
    ID = Var_ID;

set Var_anzahl = ROW_COUNT();


 IF Var_anzahl = 0
 Then 
 Rollback;
SELECT Var_anzahl AS ergebnis;
 Leave root;
 End IF;
commit;
SELECT Var_anzahl AS ergebnis;

END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.editUser
DROP PROCEDURE IF EXISTS `editUser`;
DELIMITER //
CREATE PROCEDURE `editUser`(IN `Var_UserID` INT, IN `Var_passwort` VARCHAR(128), IN `Var_user` VARCHAR(15))
root:BEGIN

Declare Var_anzahl int;

Start Transaction;

UPDATE users 
SET 
    passwort = Var_passwort
WHERE
    UserID = Var_UserID;

set Var_anzahl = ROW_COUNT();


 IF Var_anzahl != 1  Then 

 Rollback;

SELECT Var_anzahl AS ergebnis, Var_UserID AS UserID;

 Leave root;

 End IF;

 

commit;

SELECT Var_anzahl AS ergebnis, Var_UserID AS UserID;





END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.editUser2
DROP PROCEDURE IF EXISTS `editUser2`;
DELIMITER //
CREATE PROCEDURE `editUser2`(
	IN `Var_UserID` INT,
	IN `Var_admin` CHAR(1),
	IN `Var_status` CHAR(1),
	IN `Var_e_mail` VARCHAR(264),
	IN `Var_user` VARCHAR(15)
)
root:BEGIN

Declare Var_anzahl int;

Start Transaction;

Update users set
admin = Var_admin,
status = Var_status,
email = Var_e_mail
Where UserID = Var_UserID;

set Var_anzahl = ROW_COUNT();


 IF Var_anzahl != 1  Then 

 Rollback;

 Select Var_anzahl as ergebnis, Var_UserID as UserID;

 Leave root;

 End IF;

 
commit;

Select Var_anzahl as ergebnis, Var_UserID as UserID;





END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.einausgabenDS
DROP PROCEDURE IF EXISTS `einausgabenDS`;
DELIMITER //
CREATE PROCEDURE `einausgabenDS`()
root:BEGIN


SELECT e.ID, e.datum, enddatum, e.art, e.typ, e.kontonr, e.vorgang, e.betrag, e.kategorie_id, e.interval,   
  case when e.interval = 'Y' then 'jährlich' when e.interval = 'Q' then 'quartalsweise' when e.interval = 'M' then 'monatlich' END AS int_bez,
  case when e.typ = 'V' then 'Variabel' when e.typ = 'F' then 'Fix' ELSE '' END  typ_bez,
  case when e.art = 'A' then 'Ausgabe'  when e.art = 'E' then 'Einnahme' ELSE '' END  art_bez,
  ka.bezeichnung AS kategorie,  
  k.bezeichnung AS konto_bez, herkunft
 FROM einausgaben e 
  JOIN konten k ON e.kontonr=k.kontonr
  JOIN kategorien ka ON e.kategorie_id=ka.ID;
  
END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.einJahresPrognose
DROP PROCEDURE IF EXISTS `einJahresPrognose`;
DELIMITER //
CREATE PROCEDURE `einJahresPrognose`()
root: BEGIN 
DECLARE var_heute DATE; 
DECLARE var_jahr CHAR(4); 
DECLARE var_month VARCHAR(20); 
DECLARE var_minMonat DATE; 
DECLARE var_monatsname VARCHAR(20); 
DECLARE var_monat CHAR(2);

SET var_heute = CURDATE(); 
SET var_jahr = YEAR(var_heute); 
SET var_monat = MONTH(var_heute);

SET SQL_SAFE_UPDATES = 0;




TRUNCATE TABLE prognosedaten;

-- DELETE FROM prognosedaten WHERE DATE_FORMAT(monat,"%Y%m") =  DATE_FORMAT(var_heute,"%Y%m");

INSERT INTO prognosedaten (monat, vorgang, betrag, kontotyp, kategorie, art, kontonr)

SELECT var_heute, 
CONCAT('Kontostand',' ',k.bezeichnung) AS vorgang,
SUM(ifnull(ausgabe,0) + ifnull(einnahme,0)) AS betrag,
kt.kontotyp,
 kt.bezeichnung AS bezeichnung,
CASE WHEN SUM(ifnull(ausgabe,0) + ifnull(einnahme,0)) < 0 THEN 'A' ELSE 'E' END,  
a.kontonr
FROM monats_ausgaben a JOIN konten k ON  a.kontonr=k.kontonr
JOIN konten_typen kt ON k.kontotyp=kt.kontotyp

GROUP BY a.kontonr

UNION

SELECT var_heute,
 vorgang,
 betrag, 
 ko.kontotyp,
 k.bezeichnung, CASE WHEN betrag < 0 THEN 'A' ELSE 'E' END,
 a.kontonr
FROM einausgaben a
JOIN kategorien k ON a.kategorie_id = k.ID
JOIN dates_tmp dt ON a.ID=dt.einausgabe_id
JOIN konten ko ON a.kontonr = ko.kontonr
WHERE  (DATE_FORMAT(a.datum,"%Y%m%d") BETWEEN DATE_FORMAT(var_heute,"%Y%m%d") AND DATE_FORMAT(last_day(var_heute),"%Y%m%d"))
UNION
SELECT 
 dt.datum,
 vorgang,
 betrag, 
 ko.kontotyp,
 k.bezeichnung, CASE WHEN betrag < 0 THEN 'A' ELSE 'E' END,
 a.kontonr
FROM einausgaben a
JOIN kategorien k ON a.kategorie_id = k.ID
JOIN dates_tmp dt ON a.ID=dt.einausgabe_id AND date_format(dt.datum, "%Y%m") = date_format(CURDATE(), "%Y%m")
JOIN konten ko ON a.kontonr = ko.kontonr
WHERE (DATE_FORMAT(dt.datum,"%Y%m%d") BETWEEN DATE_FORMAT(var_heute,"%Y%m%d") AND DATE_FORMAT(last_day(var_heute),"%Y%m%d"));



SET var_minMonat = (
SELECT MIN(monat)
FROM prognosedaten);
 
 If MONTH(var_heute) = 1 THEN SET var_monatsname = 'Januar'; END if;
 If MONTH(var_heute) = 2 THEN SET var_monatsname ='Februar'; END if;
 If MONTH(var_heute) = 3 THEN SET var_monatsname ='März'; END if;
 If MONTH(var_heute) = 4 THEN SET var_monatsname ='April'; END if;
 If MONTH(var_heute) = 5 THEN SET var_monatsname ='Mai'; END if;
 If MONTH(var_heute) = 6 THEN SET var_monatsname ='Juni'; END if;
 If MONTH(var_heute) = 7 THEN SET var_monatsname ='Juli'; END if;
 If MONTH(var_heute) = 8 THEN SET var_monatsname ='August'; END if;
 If MONTH(var_heute) = 9 THEN SET var_monatsname ='September'; END if;
 If MONTH(var_heute) = 10 THEN SET var_monatsname ='Oktober'; END if;
 If MONTH(var_heute) = 11 THEN SET var_monatsname ='November'; END if;
 If MONTH(var_heute) = 12 THEN SET var_monatsname ='Dezember'; END if;
SELECT CONCAT(var_monatsname, ' ', var_jahr) AS monat,
 vorgang,
 betrag, CASE WHEN art = 'A' THEN 'Ausgaben' WHEN art = 'E' THEN 'Einnahmen' END AS art,
 kategorie,
 p.kontotyp,
 ifnull(kt.bezeichnung, 'Start') AS kontotyp_bez,
 p.kontonr
FROM
 prognosedaten p LEFT JOIN konten_typen kt ON p.kontotyp=kt.kontotyp
WHERE MONTH(monat) = MONTH(var_heute) AND YEAR(monat) = YEAR(var_heute); 

END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.einJahresPrognose2
DROP PROCEDURE IF EXISTS `einJahresPrognose2`;
DELIMITER //
CREATE PROCEDURE `einJahresPrognose2`(
	IN `var_monat` INT
)
BEGIN
  Declare var_progMonat date;
  Declare var_aktuellerTag date;
  Declare var_jahr char(4);
  Declare var_minMonat date;
  Declare var_vorMonat date;
  DECLARE var_vorMonatReal DATE;
  DECLARE var_vor3Monaten DATE;  
  Declare var_monatsname varchar(20);
  Declare var_quartal int;
    
  set var_progMonat = ADDDATE(CURDATE(), INTERVAL var_monat Month);
  set var_aktuellerTag =  CURDATE();
  set var_vorMonat = ADDDATE(var_progMonat, INTERVAL -1 Month);
  SET var_vorMonatReal = ADDDATE(var_aktuellerTag, INTERVAL -1 Month);
  SET var_vor3Monaten = ADDDATE(var_vorMonatReal, INTERVAL -2 Month);

  
  set var_jahr = YEAR(var_progMonat);
  
  
     
  set var_minMonat = (Select min(monat) from prognosedaten);
  
  
  	If month(var_progMonat) = 1 Then set var_monatsname = 'Januar', var_quartal = 1; 
    end if;
    If month(var_progMonat) = 2 Then set var_monatsname ='Februar', var_quartal = 1;  
    end if;
    If month(var_progMonat) = 3 Then set var_monatsname ='März', var_quartal = 1; 
    end if;
    If month(var_progMonat) = 4 Then set var_monatsname ='April', var_quartal = 2; 
    end if;
    If month(var_progMonat) = 5 Then set var_monatsname ='Mai', var_quartal = 2; 
    end if;
    If month(var_progMonat) = 6 Then set var_monatsname ='Juni', var_quartal = 2; 
    end if;
    If month(var_progMonat) = 7 Then set var_monatsname ='Juli', var_quartal = 3;  
    end if;
    If month(var_progMonat) = 8 Then set var_monatsname ='August', var_quartal = 3;  
    end if;
    If month(var_progMonat) = 9 Then set var_monatsname ='September' , var_quartal = 3; 
    end if;
    If month(var_progMonat) = 10 Then set var_monatsname ='Oktober', var_quartal = 4; 
    end if;
    If month(var_progMonat) = 11 Then set var_monatsname ='November', var_quartal = 4;  
    end if;
    If month(var_progMonat) = 12 Then set var_monatsname ='Dezember', var_quartal = 4; 
    end if;
    

   
  
  
DELETE FROM prognosedaten WHERE DATE_FORMAT(monat,"%Y%m") =  DATE_FORMAT(var_progMonat,"%Y%m");
  
  
INSERT into prognosedaten (monat, vorgang, betrag, kontotyp, kategorie, art, kontonr)
  
SELECT var_progMonat, CONCAT('Kontostand',' ',k.bezeichnung),

-- Kontostand aktueller Monat
IFNULL(( 
SELECT SUM(IFNULL(ausgabe,0) + IFNULL(einnahme,0))
FROM monats_ausgaben p
JOIN konten k ON p.kontonr=k.kontonr
JOIN konten_typen kt ON k.kontotyp=kt.kontotyp
WHERE DATE_FORMAT(a.datum,"%Y%m") < DATE_FORMAT(var_progMonat,"%Y%m") AND p.kontonr = a.kontonr),0) +



IFNULL((SELECT SUM(betrag) FROM vw_fixkosten f WHERE date_format(f.datum,"%Y%m%d") >= date_format(CURDATE(),"%Y%m%d") 
AND date_format(f.datum,"%Y%m%d") <= last_day(date_format(DATE_ADD(var_progMonat, INTERVAL -1 MONTH),"%Y%m%d")) AND f.kontonr=a.kontonr),0)
	
-- Kontostand aktueller Monat

+
case When var_monat > 1 
Then  
IFNULL((Select 
  SUM(a5.betrag)/3
  from einausgaben a5 
  where DATE_FORMAT(a5.datum,"%Y%m%d") >= DATE_FORMAT(var_vor3Monaten,"%Y%m01") AND  DATE_FORMAT(a5.datum,"%Y%m%d") <= LAST_DAY(DATE_FORMAT(var_vorMonatReal,"%Y%m%d")) AND a5.typ = 'V' and a5.kontonr = a.kontonr),0)*(var_monat-1)
ELSE 0
END ,


kt.kontotyp,
 kt.bezeichnung, CASE WHEN SUM(IFNULL(ausgabe,0) + IFNULL(einnahme,0)) < 0 THEN 'A' ELSE 'E' END, 
a.kontonr
FROM monats_ausgaben a
JOIN konten k ON a.kontonr=k.kontonr
JOIN konten_typen kt ON k.kontotyp=kt.kontotyp
JOIN einausgaben e ON a.kontonr=e.kontonr
GROUP BY a.kontonr
-- Ende Einfügen der Kontostände 
Union
-- Einfügen der Fixkosten aus der Tabelle dates_tmp
Select  var_progMonat,
  vorgang,
  betrag,  
  ko.kontotyp,
  k.bezeichnung, 
  case when betrag < 0 then 'A' ELSE 'E' END,
  a.kontonr
  from einausgaben a 
  JOIN kategorien k on a.kategorie_id = k.ID
  JOIN konten ko ON a.kontonr = ko.kontonr
  JOIN dates_tmp dt ON a.ID=dt.einausgabe_id
  where DATE_FORMAT(var_progMonat,"%Y%m") = DATE_FORMAT(dt.datum,"%Y%m")
  
-- Ende Einfügen der Fixkosten 

UNION
-- Einfügen der Fixkosten aus der Tabelle einausgaben
  Select  var_progMonat,
  vorgang,
  betrag,  
  ko.kontotyp,
  k.bezeichnung, 
  case when betrag < 0 then 'A' ELSE 'E' END,
  a.kontonr
  from einausgaben a 
  JOIN kategorien k on a.kategorie_id = k.ID
  JOIN konten ko ON a.kontonr = ko.kontonr
  where DATE_FORMAT(var_progMonat,"%Y%m") = DATE_FORMAT(a.datum,"%Y%m")
-- Ende Einfügen der Fixkosten
 
Union

Select  var_progMonat,
  'Durchschn. var. Kost. d. letzten 3 Monate',
  sum(betrag)/3,  
  ko.kontotyp,
  'Variable Kosten', 
  case when (sum(betrag)/3) < 0 then 'A' ELSE 'E' END,
  a.kontonr
  from einausgaben a 
  JOIN konten ko ON a.kontonr = ko.kontonr
  where DATE_FORMAT(datum,"%Y%m%d") >= DATE_FORMAT(var_vor3Monaten,"%Y%m01") AND  DATE_FORMAT(datum,"%Y%m%d") <= LAST_DAY(DATE_FORMAT(var_vorMonatReal,"%Y%m%d")) AND a.typ = 'V' 
  GROUP BY a.kontonr ;
 


SELECT 
    CONCAT(var_monatsname, ' ', var_jahr) AS monat,
    vorgang,
    betrag,
    case when art = 'A' then 'Ausgaben' when art = 'E' then 'Einnahmen' END AS art,
    kategorie,
    p.kontotyp,
    ifnull(kt.bezeichnung, (SELECT bezeichnung FROM konten_typen WHERE kontotyp = 1)) AS kontotyp_bez,
    p.kontonr
FROM
 prognosedaten p left JOIN konten_typen kt ON p.kontotyp=kt.kontotyp
WHERE
    MONTH(monat) = MONTH(var_progMonat) 

  ;
  
END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.kategorieAdd
DROP PROCEDURE IF EXISTS `kategorieAdd`;
DELIMITER //
CREATE PROCEDURE `kategorieAdd`(
	IN `var_bezeichnung` VARCHAR(450),
	IN `var_typ` CHAR(1),
	IN `var_art` CHAR(1)
)
root:BEGIN

Declare  var_Ergebnis int;
  
set var_Ergebnis = 0;

Start Transaction;

 
    Insert INTO kategorien
    (bezeichnung, typ, art)
    values
    (var_bezeichnung, var_typ, var_art);
  
    Set var_Ergebnis = ROW_COUNT();
    
	if var_Ergebnis = 1 then       
      Select var_Ergebnis AS Ergebnis, (SELECT MAX(ID) FROM kategorien) AS ID;
      commit;
	Else		  
	  Select var_Ergebnis AS Ergebnis;
      rollback;
      leave root;	
    End if; 

  
END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.kategorieEdit
DROP PROCEDURE IF EXISTS `kategorieEdit`;
DELIMITER //
CREATE PROCEDURE `kategorieEdit`(
	IN `var_ID` INT,
	IN `var_bezeichnung` VARCHAR(450),
	IN `var_typ` CHAR(1),
	IN `var_art` CHAR(1)
)
root:BEGIN

Declare  var_Ergebnis int;
  
set var_Ergebnis = 0;

Start Transaction;

 
    UPDATE kategorien
    set bezeichnung = var_bezeichnung, 
	 typ = var_typ, 
	 art = var_art 
	 WHERE ID = var_ID;
  
    Set var_Ergebnis = ROW_COUNT();
    
	if var_Ergebnis = 1 then       
      Select var_Ergebnis AS Ergebnis, (SELECT MAX(ID) FROM kategorien) AS ID;
      commit;
	Else		  
	  Select var_Ergebnis AS Ergebnis;
      rollback;
      leave root;	
    End if; 

  
END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.kontenDS
DROP PROCEDURE IF EXISTS `kontenDS`;
DELIMITER //
CREATE PROCEDURE `kontenDS`()
BEGIN
SELECT kontonr, k.bezeichnung, k.kontotyp, kt.bezeichnung AS typ_bez FROM konten k JOIN konten_typen kt ON k.kontotyp=kt.kontotyp ORDER BY k.bezeichnung;
END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.kontoAdd
DROP PROCEDURE IF EXISTS `kontoAdd`;
DELIMITER //
CREATE PROCEDURE `kontoAdd`(
	IN `var_kontonr` VARCHAR(50),
	IN `var_bezeichnung` VARCHAR(50),
	IN `var_typ` CHAR(1)
)
root:BEGIN

Declare  var_Ergebnis int;
  
set var_Ergebnis = 0;

Start Transaction;

 
    Insert INTO konten
    (kontonr, bezeichnung, kontotyp)
    values
    (var_kontonr, var_bezeichnung, var_typ);
  
    Set var_Ergebnis = ROW_COUNT();
    
	if var_Ergebnis = 1 then       
      Select var_Ergebnis AS Ergebnis;
      commit;
	Else		  
	  Select var_Ergebnis AS Ergebnis;
      rollback;
      leave root;	
    End if; 

  
END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.kontoEdit
DROP PROCEDURE IF EXISTS `kontoEdit`;
DELIMITER //
CREATE PROCEDURE `kontoEdit`(
	IN `var_kontonrNew` VARCHAR(50),
	IN `var_kontonrOld` VARCHAR(50),
	IN `var_bezeichnung` VARCHAR(50),
	IN `var_typ` CHAR(1)
)
root:BEGIN

Declare  var_Ergebnis int;
  
set var_Ergebnis = 0;

Start Transaction;

 
    Update konten set
    kontonr = var_kontonrNew, bezeichnung = var_bezeichnung, kontotyp = var_typ 
	 WHERE kontonr = var_kontonrOld;
  
    Set var_Ergebnis = ROW_COUNT();
    
	if var_Ergebnis = 1 then       
      Select var_Ergebnis AS Ergebnis;
      commit;
	Else		  
	  Select var_Ergebnis AS Ergebnis;
      rollback;
      leave root;	
    End if; 

  
END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.kontotypDS
DROP PROCEDURE IF EXISTS `kontotypDS`;
DELIMITER //
CREATE PROCEDURE `kontotypDS`()
BEGIN

SELECT kontotyp, bezeichnung FROM konten_typen ORDER BY bezeichnung;
  
  
END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.kreditKartenAbrDS
DROP PROCEDURE IF EXISTS `kreditKartenAbrDS`;
DELIMITER //
CREATE PROCEDURE `kreditKartenAbrDS`(
	IN `var_monat` CHAR(6)
)
BEGIN


 declare var_monat_ char(2);
 declare var_jahr_ char(4);
 declare var__date varchar(20);
 declare var__monat varchar(2);
 declare var__jahr varchar(4);
 declare var__monat_alt char(6);

set var_monat_ = SUBSTRING(var_monat,1,2);
set var_jahr_ = SUBSTRING(var_monat,3,4);


set var__date = ADDDATE(concat(var_jahr_,'-',var_monat_,'-','01'), INTERVAL -1 month);

set var__monat = MONTH(var__date);
set var__jahr = YEAR(var__date);

if LENGTH(var__monat) = 1 then
set var__monat = concat('0',var__monat);
end if;


set var__monat_alt = concat(var__monat,var__jahr);
 
SELECT 
    b.ID,
    b.karten_nr,
    a.bezeichnung,
    b.betrag,
    mind_zahlung,
    (SELECT 
            betrag
        FROM
            kreditkarten_abr
        WHERE
            monat = var__monat_alt
                AND karten_nr = b.karten_nr) AS vor_monat,
    DATE_FORMAT(b.datum, '%d.%m.%Y') AS datum,
    DATE_FORMAT(b.datum, '%Y.%m.%d') AS datum2,
    b.monat AS Monat,
    ifnull(b.pdf,'') as pdf,
    b.zahlung
FROM
    zahlungsmittel a,
    kreditkarten_abr b
WHERE
    b.monat = var_monat
        AND b.karten_nr = a.karten_nr
ORDER BY 3;

END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.kreditKartenAdd
DROP PROCEDURE IF EXISTS `kreditKartenAdd`;
DELIMITER //
CREATE PROCEDURE `kreditKartenAdd`(
	IN `var_karten_nr` VARCHAR(50),
	IN `var_betrag` NUMERIC(8,2),
	IN `var_monat` VARCHAR(50),
	IN `var_datum` DATE
)
root:BEGIN

declare var_Ergebnis int;
declare var_ID int;

insert into kreditkarten_abr 
(karten_nr, betrag, monat, datum)
values(var_karten_nr, var_betrag, var_monat, var_datum);

set var_Ergebnis = ROW_COUNT();

if var_Ergebnis != 1 then
set var_Ergebnis = -1;
SELECT var_Ergebnis AS Ergebnis, - 99 AS ID;
leave root;
End if;

set var_ID = (Select max(ID) from kreditkarten_abr);

SELECT var_Ergebnis AS Ergebnis, var_ID AS ID;

End//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.kreditKartenDelete
DROP PROCEDURE IF EXISTS `kreditKartenDelete`;
DELIMITER //
CREATE PROCEDURE `kreditKartenDelete`(`var_id` INT)
root:BEGIN

declare var_anzahl int;

start Transaction;

DELETE FROM kreditkarten_abr 
WHERE
    ID = var_id;

set var_anzahl = ROW_COUNT();

If var_anzahl = 1
then
  Select var_anzahl as Ergebnis;
  Commit;
Else
  Select Ergebnis = -1;
  Rollback;
  leave root;
End if;



End//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.kreditKartenEdit
DROP PROCEDURE IF EXISTS `kreditKartenEdit`;
DELIMITER //
CREATE PROCEDURE `kreditKartenEdit`(`var_karten_nr` VARCHAR(50), `var_betrag` NUMERIC(8,2), `var_monat` VARCHAR(50), `var_datum` DATE, `var_ID` INT, `var_zahlung` NUMERIC(8,2), `var_mind_zahlung` NUMERIC(8,2))
root:BEGIN

declare var_Ergebnis int;

UPDATE kreditkarten_abr 
SET 
    karten_nr = var_karten_nr,
    betrag = var_betrag,
    monat = var_monat,
    datum = var_datum,
    zahlung = var_zahlung,
    mind_zahlung = var_mind_zahlung
WHERE
    ID = var_ID;

set var_Ergebnis = ROW_COUNT();

if var_Ergebnis = 0 then
set var_Ergebnis = -1;
SELECT var_Ergebnis AS Ergebnis;
leave root;
End if;

SELECT var_Ergebnis AS Ergebnis;

End//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.kreditkarten_upload_doc
DROP PROCEDURE IF EXISTS `kreditkarten_upload_doc`;
DELIMITER //
CREATE PROCEDURE `kreditkarten_upload_doc`(
	IN `var_ID` INT,
	IN `var_pdf_name` VARCHAR(200)
)
root:BEGIN


Declare var_anzahl int;

UPDATE kreditkarten_abr 
SET 
    pdf = var_pdf_name
WHERE
    ID = var_ID;

set var_anzahl = ROW_COUNT();

IF var_anzahl = 0
then 
Select -1 as Ergebnis;
leave root;
End if;

SELECT var_anzahl AS Ergebnis;

END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.loginProc
DROP PROCEDURE IF EXISTS `loginProc`;
DELIMITER //
CREATE PROCEDURE `loginProc`(IN `Var_benutzer` VARCHAR(20), IN `Var_passwort` VARCHAR(128), IN `Var_session` VARCHAR(200))
root:Begin

  Declare Var_ergebnis int;

  Declare Var_loginCount smallint;

  Declare Var_loginTime datetime;

  Declare Var_timeOut datetime;

  Declare Var_status char(1);

  Declare Var_admin char(1);

  

  SET Var_loginCount = (Select ifnull(loginCount,0)  from users where benutzer = Var_benutzer);
  SET Var_loginTime = (Select ifnull(loginTime,CURTIME()) from users where benutzer = Var_benutzer);
  SET Var_timeOut = (Select timeOut from users where benutzer = Var_benutzer);  
  

    IF TIMESTAMPDIFF(MINUTE, Var_timeOut, CURTIME()) < 5 OR Var_timeOut != NULL   THEN

    Select -99 as Ergebnis, NULL as admin, NULL as 'status';

    LEAVE root;

  

  ELSE

  SET SQL_SAFE_UPDATES=0;

UPDATE users 
SET 
    timeOut = NULL,
    session = Var_session
WHERE
    benutzer = Var_benutzer;

  END IF;

    

    Set Var_ergebnis = (Select count(Concat(benutzer,passwort)) from users where benutzer = Var_benutzer and passwort = Var_passwort

    group by admin, status);

    Set Var_status = (Select status from users where benutzer = Var_benutzer and passwort = Var_passwort

    group by admin, status);

    Set Var_admin = (Select admin from users where benutzer = Var_benutzer and passwort = Var_passwort

    group by admin, status);

    

    If Var_ergebnis = 1

    THEN

		IF Var_status != 'O'

		THEN

			Update users set loginCount = 0, loginTime = NULL, timeOut = NULL, onlineTime = CURTIME(), logoutTime = NULL where benutzer = Var_benutzer;

			SELECT 
    Var_ergebnis AS Ergebnis,
    Var_admin AS admin,
    Var_status AS status;

			LEAVE root;
		ELSE
			Update users set loginCount = 0, loginTime = NULL, timeOut = NULL where benutzer = Var_benutzer;

			SELECT 
    Var_ergebnis AS Ergebnis,
    Var_admin AS admin,
    Var_status AS status;
			LEAVE root;
		END IF;

    ELSE   

      If not exists (select 1 from users where benutzer = Var_benutzer)

      THEN

        Select 0 as Ergebnis, NULL as admin, NULL as 'status';         
        LEAVE root;

      Else      

        if Var_loginCount <= 2         THEN

          If TIMESTAMPDIFF(MINUTE, Var_loginTime, CURTIME()) < 3

          THEN

            Update users set loginCount = Var_loginCount +1, loginTime = CURTIME() where benutzer = Var_benutzer;

SELECT 0 AS Ergebnis, NULL AS admin, NULL AS 'status'; 

            LEAVE root;         

          ELSE         

            Update users set loginCount = 1, loginTime = CURTIME() where benutzer = Var_benutzer;

SELECT 0 AS Ergebnis, NULL AS admin, NULL AS 'status'; 

            LEAVE root;

          END IF;        

        ELSE
                   Update users set loginCount = 0, loginTime = NULL, timeOut = CURTIME() where benutzer = Var_benutzer;

SELECT - 98 AS Ergebnis, NULL AS admin, NULL AS 'status'; 

          LEAVE root;       

      END IF;

    END IF;

  END IF;

  SET SQL_SAFE_UPDATES=1;

End//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.logoutProc
DROP PROCEDURE IF EXISTS `logoutProc`;
DELIMITER //
CREATE PROCEDURE `logoutProc`(
	IN `Var_user` VARCHAR(15)
)
root: BEGIN DECLARE Var_anzahl INT; 
SET SQL_SAFE_UPDATES=0;

UPDATE users SET logoutTime = CURTIME(), onlineTime = NULL
WHERE benutzer = Var_user; 

SET Var_anzahl = ROW_COUNT();


IF Var_anzahl != 1 THEN
  SELECT -99 AS ergebnis;  
  LEAVE root; 
ELSE
  SELECT Var_anzahl AS ergebnis; 
  LEAVE root; 
END IF; 

END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.monateDS
DROP PROCEDURE IF EXISTS `monateDS`;
DELIMITER //
CREATE PROCEDURE `monateDS`()
BEGIN

declare var_jahr char(4);
declare var_monat char(3); 
declare var__monat char(6);  

set var_monat = convert(month(curdate()),char);

if (length(trim(var_monat)) <= 1) then
  set var_monat = concat('0',var_monat);   
  
  set var_jahr =  YEAR(curdate());
  
  set var__monat = concat(var_monat,var_jahr);   

IF (var__monat not in (select distinct monat from kreditkarten_abr))
Then
  Select var__monat as monat,  var_jahr as jahr, var_monat as nur_monat, concat(substring(var__monat ,3,4),SUBSTRING(var__monat ,1,2)) as sort
  union
  select distinct monat, substring(monat,3,4) as jahr, SUBSTRING(monat,1,2) nur_monat, concat(substring(monat,3,4),SUBSTRING(monat,1,2)) as sort
  from kreditkarten_abr order by 4  desc;
else 
  select distinct monat, substring(monat,3,4) as jahr, SUBSTRING(monat,1,2) nur_monat, concat(substring(monat,3,4),SUBSTRING(monat,1,2)) as sort
  from kreditkarten_abr order by  4 desc;
End if;

End if;

End//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.ratenAdd
DROP PROCEDURE IF EXISTS `ratenAdd`;
DELIMITER //
CREATE PROCEDURE `ratenAdd`(`var_karten_nr` VARCHAR(50), `var_vorgang` VARCHAR(50), `var_rate` INT, `var_max_rate` INT, `var_betrag` NUMERIC(8,2), `var_monat` CHAR(6), `var_comment` VARCHAR(500), `var_datum` DATE)
root:BEGIN

Declare var_Ergebnis int;
Declare var_status char(1);

if var_rate != var_max_rate then
  set var_status = 'A';
Else
  set var_status = 'E';
end if;

if var_rate > var_max_rate then
  set var_Ergebnis = -2;
SELECT var_Ergebnis AS Ergebnis; 
  leave root;
End if;

Insert Into kk_raten
(karten_nr, vorgang, rate, max_rate, betrag, monat, status, comment, datum)
values
(var_karten_nr, var_vorgang, var_rate, var_max_rate, var_betrag, var_monat, var_status, var_comment, var_datum);

set var_Ergebnis = ROW_COUNT();

if var_Ergebnis != 1
then
  set var_Ergebnis = -1;
SELECT var_Ergebnis AS Ergebnis;
  leave root;
End if;

SELECT var_Ergebnis AS Ergebnis;

End//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.ratenEdit
DROP PROCEDURE IF EXISTS `ratenEdit`;
DELIMITER //
CREATE PROCEDURE `ratenEdit`(`var_karten_nr` VARCHAR(50), `var_vorgang` VARCHAR(50), `var_rate` INT, `var_rate_max` INT, `var_betrag` NUMERIC(8,2), `var_monat` CHAR(6), `var_id` INT, `var_comment` VARCHAR(500), `var_datum` DATE)
root:BEGIN

Declare var_Ergebnis int;
Declare var_status char(1);

if var_rate != var_rate_max then
  set var_status = 'A';
Else
  set var_status = 'E';
end if;

if var_rate > var_rate_max
Then
  set var_Ergebnis = -2;
SELECT var_Ergebnis AS Ergebnis; 
  leave root;
End if;


UPDATE betragler 
SET 
    karten_nr = var_karten_nr,
    vorgang = var_vorgang,
    rate = var_rate,
    rate_max = var_rate_max,
    betrag = var_betrag,
    monat = var_monat,
    status = var_status,
    comment = var_comment,
    datum = var_datum
WHERE
    ID = var_id;

set var_Ergebnis = ROW_COUNT();

if var_Ergebnis = 0
then
  set var_Ergebnis = -1;
SELECT var_Ergebnis AS Ergebnis;
  leave root;
Else
  set var_Ergebnis = 1;
end if;

SELECT var_Ergebnis AS Ergebnis;

End//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.ratenFindID
DROP PROCEDURE IF EXISTS `ratenFindID`;
DELIMITER //
CREATE PROCEDURE `ratenFindID`(`var_karten_nr` VARCHAR(50), `var_vorgang` VARCHAR(50), `var_rate` INT, `var_max_rate` INT, `var_betrag` NUMERIC(8,2), `var_monat` CHAR(6))
root:BEGIN


Declare var_anzahl int;
Declare var_id int;

SELECT 
    var_id = MAX(ID)
FROM
    taksitler
WHERE
    karten_kz = var_karten_nr
        AND vorgang = var_vorgang
        AND rate = var_rate
        AND max_rate = var_max_rate
        AND betrag = var_betrag
        AND monat = var_monat;

set var_anzahl = ROW_COUNT();
if var_anzahl = 0
then
set var_anzahl = -1;
SELECT var_anzahl AS Ergebnis, 0 AS ID;
leave root;
END if;

SELECT var_anzahl AS Ergebnis, var_id AS ID;

END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.raten_down
DROP PROCEDURE IF EXISTS `raten_down`;
DELIMITER //
CREATE PROCEDURE `raten_down`(`var_monat` CHAR(6), `var_karten_nr` VARCHAR(50))
root:BEGIN

Declare var_Ergebnis int;

set var_Ergebnis = 0;

if var_karten_nr = 'ALL' then 
  Update kk_raten
  set rate = rate -1,
  monat = var_monat
  Where status = 'A';

  set var_Ergebnis = ROW_COUNT();

UPDATE kk_raten 
SET 
    rate = 1,
    monat = var_monat
WHERE
    status = 'A' AND rate = 0;

Else  
  Update kk_raten
  set rate = rate -1,
  monat = var_monat
  Where status = 'A'
  and karten_nr = var_karten_nr;

  set var_Ergebnis = ROW_COUNT();

UPDATE kk_raten  
SET 
    rate = 1,
    monat = var_monat
WHERE
    status = 'A'
        AND karten_nr = var_karten_nr
        AND rate = 0;


  if var_Ergebnis = 0 then
    set var_Ergebnis = -1;
SELECT var_Ergebnis AS Ergebnis;
    leave root;
  Else
    set var_Ergebnis = 1;
SELECT var_Ergebnis AS Ergebnis;
End if;

End if;

END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.raten_up
DROP PROCEDURE IF EXISTS `raten_up`;
DELIMITER //
CREATE PROCEDURE `raten_up`(
	IN `var_monat` CHAR(6),
	IN `var_karten_nr` CHAR(4)
)
root:BEGIN

Declare var_Ergebnis int;


DECLARE var_done INT DEFAULT 0;
DECLARE c_ID int;
DECLARE c_rate int;
DECLARE c_max_rate int;
DECLARE myCursor CURSOR FOR 
Select rate, max_rate, ID from kk_raten
where status = 'A';
DECLARE CONTINUE HANDLER FOR NOT FOUND SET var_done = 1;

set var_Ergebnis = 0;

if var_karten_nr = 'ALL' then 
  Update kk_raten
  set rate = rate + 1,
  monat = var_monat
  Where status = 'A';
  set var_Ergebnis = ROW_COUNT();
Else  
  Update kk_raten
  set rate = rate + 1,
  monat = var_monat
  Where status = 'A'
  and karten_nr = var_karten_nr;
  set var_Ergebnis = ROW_COUNT();
end if;


SET var_done = 0;
SET SQL_SAFE_UPDATES=0;
OPEN myCursor;
FETCH myCursor INTO c_rate, c_max_rate, c_ID;

WHILE NOT var_done DO
if c_rate = c_max_rate then
Update kk_raten
set status = 'E'
where ID = c_ID;
End if;

SET var_done = 0;
FETCH myCursor INTO c_rate, c_max_rate, c_ID;

END WHILE;
CLOSE myCursor;



if var_Ergebnis = 0 then
    set var_Ergebnis = -1;
SELECT var_Ergebnis AS Ergebnis;
    leave root;
  Else
    set var_Ergebnis = 1;
SELECT var_Ergebnis AS Ergebnis;
End if;



END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.spSummenRechner
DROP PROCEDURE IF EXISTS `spSummenRechner`;
DELIMITER //
CREATE PROCEDURE `spSummenRechner`(
	IN `var_jahr` INT
)
BEGIN

select sum(a1.zahlung) as Summe, 'Asya' as Karte from kreditkarten_abr a1
  where a1.karten_nr = 'asya'
  and substring(a1.monat,3,4) = var_jahr
union
select sum(a1.zahlung) as Summe, 'Axcess' as Karte from kreditkarten_abr a1
  where a1.karten_nr = 'axce'
  and substring(a1.monat,3,4) = var_jahr
union
select sum(a1.zahlung) as Summe, 'Bonus' as Karte from kreditkarten_abr a1
  where a1.karten_nr = 'bonu'
  and substring(a1.monat,3,4) = var_jahr
union
select sum(a1.zahlung) as Summe, 'CardFinans' as Karte from kreditkarten_abr a1
  where a1.karten_nr = 'cafi'
  and substring(a1.monat,3,4) = var_jahr
union
select sum(a1.zahlung) as Summe, 'World' as Karte from kreditkarten_abr a1
  where a1.karten_nr = 'ypwo'
  and substring(a1.monat,3,4) = var_jahr
union
select sum(a1.zahlung) as Summe, 'Citi' as Karte from kreditkarten_abr a1
  where a1.karten_nr = 'citi'
  and substring(a1.monat,3,4) = var_jahr;

End//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.umsaetzeKategorieAdd
DROP PROCEDURE IF EXISTS `umsaetzeKategorieAdd`;
DELIMITER //
CREATE PROCEDURE `umsaetzeKategorieAdd`(
	IN `Var_art` CHAR(1),
	IN `Var_typ` CHAR(1),
	IN `Var_datum` DATE,
	IN `Var_kontonr` VARCHAR(50),
	IN `Var_vorgang` VARCHAR(450),
	IN `var_herkunft` VARCHAR(450),
	IN `Var_betrag` DECIMAL(10,2),
	IN `Var_kategorie` INT,
	IN `Var_dauer` INT,
	IN `Var_interval` CHAR(1),
	IN `Var_enddatum` DATE,
	IN `Var_herkunft_intern` VARCHAR(50),
	IN `Var_detail` CHAR(1),
	IN `Var_kommentar` TEXT,
	IN `Var_umsatz_id` INT,
	IN `Var_zahlungsmittel` INT,
	IN `Var_bundle` VARCHAR(64)
)
root:BEGIN

Declare Var_anzahl INT;
DECLARE Var_date_tmp DATE;
DECLARE Var_newID INT;
DECLARE Var_id2 INT;




Start Transaction;
 
INSERt INTO einausgaben 
(art, typ, kontonr, vorgang, betrag, kategorie_id, datum, dauer, `interval`, enddatum, herkunft, detail, kommentar, zahlungsmittel_id, bundle) 
values (Var_art, Var_typ, Var_kontonr, Var_vorgang, Var_betrag, Var_kategorie, Var_datum, Var_dauer, Var_interval, Var_enddatum, var_herkunft, Var_detail, Var_kommentar, Var_zahlungsmittel, Var_bundle);

set Var_anzahl = ROW_COUNT();


SET Var_newID = (Select max(ID) from einausgaben);

if Var_umsatz_id > 0 
Then 
  UPDATE monats_ausgaben SET einausgaben_id = Var_newID
  WHERE ID = Var_umsatz_id;
END if; 

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



IF EXISTS (SELECT * FROM konten WHERE kontonr = Var_herkunft_intern) 
Then 
  	if Var_art = 'E' then
  	 Set Var_art = 'A';
  	ELSE 
  	 Set Var_art = 'E';
  	END if; 
    
	INSERT INTO einausgaben (art, typ, kontonr, vorgang, betrag, kategorie_id, datum, `interval`, enddatum, herkunft, ID2)
   VALUES(Var_art, Var_typ, Var_herkunft_intern, Var_vorgang, Var_betrag*(-1), Var_kategorie, Var_datum, Var_interval, Var_enddatum, Var_kontonr, Var_newID);
    
   SET Var_id2 = (SELECT MAX(ID) FROM einausgaben);
   UPDATE einausgaben SET ID2 = Var_id2, herkunft = Var_herkunft_intern WHERE ID = Var_newID;

END if;

COMMIT;

SELECT Var_anzahl AS ergebnis, Var_newID as ID;

END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.umsaetzeKategorieDelete
DROP PROCEDURE IF EXISTS `umsaetzeKategorieDelete`;
DELIMITER //
CREATE PROCEDURE `umsaetzeKategorieDelete`(
	IN `Var_ID` INT
)
root:BEGIN

Declare Var_anzahl INT;
DECLARE Var_date_tmp DATE;
DECLARE Var_newID INT;
DECLARE Var_id2 INT;
DECLARE Var_monats_ausgaben_id INT;

DECLARE EXIT HANDLER FOR SQLEXCEPTION 
BEGIN
      Rollback;
		SELECT -99 AS ergebnis;
 		
END;


Start Transaction;

DELETE FROM dates_tmp WHERE einausgabe_id = Var_ID; 

IF (SELECT ifnull(ID2,-99) FROM einausgaben WHERE ID = Var_ID) != -99  
Then 
  SET Var_id2 = (SELECT ID2 FROM einausgaben WHERE ID = Var_ID);
	DELETE from einausgaben WHERE ID = Var_id2;
END if; 

DELETE from einausgaben
WHERE ID = Var_ID;

If (SELECT IFNULL(einausgaben_id, -99) from monats_ausgaben WHERE einausgaben_id = Var_ID) > 0
Then 
  SET Var_monats_ausgaben_id = (SELECT ID from monats_ausgaben WHERE einausgaben_id = Var_ID);
  UPDATE monats_ausgaben SET einausgaben_id = NULL WHERE ID = Var_monats_ausgaben_id;
END if;

set Var_anzahl = ROW_COUNT();


COMMIT;
SELECT Var_anzahl AS ergebnis;

END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.umsaetzeKategorieEdit
DROP PROCEDURE IF EXISTS `umsaetzeKategorieEdit`;
DELIMITER //
CREATE PROCEDURE `umsaetzeKategorieEdit`(
	IN `Var_ID` INT,
	IN `Var_art` CHAR(1),
	IN `Var_typ` CHAR(1),
	IN `Var_datum` DATE,
	IN `Var_kontonr` VARCHAR(50),
	IN `Var_vorgang` VARCHAR(450),
	IN `Var_herkunft` VARCHAR(450),
	IN `Var_betrag` DECIMAL(10,2),
	IN `Var_kategorie` INT,
	IN `Var_dauer` INT,
	IN `Var_interval` CHAR(1),
	IN `Var_enddatum` DATE,
	IN `Var_herkunft_intern` VARCHAR(50),
	IN `Var_detail` CHAR(1),
	IN `Var_kommentar` TEXT,
	IN `Var_zahlungsmittel` INT,
	IN `Var_bundle` VARCHAR(64)
)
root:BEGIN

Declare Var_anzahl INT;
DECLARE Var_date_tmp DATE;
DECLARE Var_newID INT;
DECLARE Var_GegenKntID INT;
DECLARE Var_id2 INT;


SET Var_id2 = -99;


Start Transaction;
 
Update einausgaben set
art = Var_art, 
typ = Var_typ, 
kontonr = Var_kontonr, 
vorgang = Var_vorgang, 
betrag = Var_betrag, 
kategorie_id = Var_kategorie, 
datum = Var_datum, 
`interval` = Var_interval, 
enddatum = Var_enddatum, 
herkunft = Var_herkunft,
detail = Var_detail, 
dauer = Var_dauer,
kommentar = Var_kommentar,
zahlungsmittel_id = Var_zahlungsmittel,
bundle = Var_bundle
WHERE ID = Var_ID;

set Var_anzahl = ROW_COUNT();

DELETE FROM dates_tmp WHERE einausgabe_id = Var_ID; 

if Var_interval = 'Q'
Then
SET Var_date_tmp = DATE_ADD(Var_datum, INTERVAL 1 QUARTER); 
  While DATE_FORMAT(Var_date_tmp, "%Y%m") <= DATE_FORMAT(Var_enddatum, "%Y%m") DO
    INSERT INTO dates_tmp (einausgabe_id, datum) VALUES(Var_ID, Var_date_tmp);
    SET Var_date_tmp = DATE_ADD(Var_date_tmp, INTERVAL 1 QUARTER); 
  END While;
END if;


if Var_interval = 'Y'
Then
SET Var_date_tmp = DATE_ADD(Var_datum, INTERVAL 1 YEAR); 
  While DATE_FORMAT(Var_date_tmp, "%Y%m") <= DATE_FORMAT(Var_enddatum, "%Y%m") DO  
    INSERT INTO dates_tmp (einausgabe_id, datum) VALUES(Var_ID, Var_date_tmp);
    SET Var_date_tmp = DATE_ADD(Var_date_tmp, INTERVAL 1 YEAR); 
  END While;
END if;


if Var_interval = 'M'
Then
SET Var_date_tmp = DATE_ADD(Var_datum, INTERVAL 1 MONTH); 
  While DATE_FORMAT(Var_date_tmp, "%Y%m") <= DATE_FORMAT(Var_enddatum, "%Y%m") DO  
    INSERT INTO dates_tmp (einausgabe_id, datum) VALUES(Var_ID, Var_date_tmp);
    SET Var_date_tmp = DATE_ADD(Var_date_tmp, INTERVAL 1 MONTH); 
  END While;
END if;


IF (SELECT ifnull(ID2,-99) FROM einausgaben WHERE ID = Var_ID) != -99 
Then 
  SET Var_id2 = (SELECT ID2 FROM einausgaben WHERE ID = Var_ID);
END if;

IF EXISTS (SELECT * FROM konten WHERE kontonr = Var_herkunft_intern) 
Then 
  	 if Var_art = 'E' then
  	   Set Var_art = 'A';
  	  ELSE 
  	   Set Var_art = 'E';
  	  END if; 
  if Var_id2 > -99 
  then  	  
    Update einausgaben SET
     art = Var_art, 
     typ = Var_typ, 
     kontonr = Var_herkunft_intern, 
	  vorgang = Var_vorgang, 
     betrag = Var_betrag*(-1), 
     kategorie_id = Var_kategorie, 
     datum = Var_datum, 
     `interval` = Var_interval, 
     enddatum = Var_enddatum, 
     herkunft = Var_kontonr,
     ID2 = Var_ID
    WHERE ID = Var_id2;
  ELSE 
	INSERT INTO einausgaben (art, typ, kontonr, vorgang, betrag, kategorie_id, datum, `interval`, enddatum, herkunft, ID2)
   VALUES(Var_art, Var_typ, Var_herkunft_intern, Var_vorgang, Var_betrag*(-1), Var_kategorie, Var_datum, Var_interval, Var_enddatum, Var_kontonr, Var_ID);
    
    SET Var_id2 = (SELECT MAX(ID) FROM einausgaben);
    
    UPDATE einausgaben SET ID2 = Var_id2, herkunft = Var_herkunft_intern WHERE ID = Var_ID;
    
  END if;
END if;

COMMIT;   

SELECT Var_anzahl AS ergebnis;

END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.UserAddProc
DROP PROCEDURE IF EXISTS `UserAddProc`;
DELIMITER //
CREATE PROCEDURE `UserAddProc`(
	IN `Var_benutzer` VARCHAR(50),
	IN `Var_passwort` VARCHAR(128),
	IN `Var_status` CHAR(1),
	IN `Var_admin` CHAR(1),
	IN `Var_email` VARCHAR(128)
)
root:begin



declare Var_anzahl int;

declare Var_userID int DEFAULT 0;




IF CHAR_LENGTH(Var_benutzer) = 0 or CHAR_LENGTH(Var_passwort) = 0

THEN

Select 0 as ergebnis; 

LEAVE root;

End If;





if exists (Select * from users where benutzer = Var_benutzer)

THEN

Select -1 as ergebnis, Var_userID as userID; LEAVE root;

End If;



INSERT INTO Users 

( benutzer, Passwort, admin, STATUS, email) VALUES (Var_benutzer, Var_passwort, Var_admin, Var_status, Var_email); 



set Var_anzahl = ROW_COUNT();



if Var_anzahl != 1

THEN

Select -2 as ergebnis; LEAVE root;

End IF;



SET Var_userID = (Select max(userID) from Users);



select Var_anzahl as ergebnis, Var_userID as userID;



end//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.zahlungAdd
DROP PROCEDURE IF EXISTS `zahlungAdd`;
DELIMITER //
CREATE PROCEDURE `zahlungAdd`(
	IN `Var_bezeichnung` VARCHAR(50),
	IN `Var_karten_nr` VARCHAR(50)
)
root:BEGIN

Declare  var_Ergebnis int;
  
set var_Ergebnis = 0;

Start Transaction;

 
    Insert INTO zahlungsmittel
    (bezeichnung, karten_nr)
    values
    (Var_bezeichnung, Var_karten_nr);
  
    Set var_Ergebnis = ROW_COUNT();
    
	if var_Ergebnis = 1 then       
      Select var_Ergebnis AS Ergebnis;
      commit;
	Else		  
	  Select var_Ergebnis AS Ergebnis;
      rollback;
      leave root;	
    End if; 

  
END//
DELIMITER ;

-- Exportiere Struktur von Prozedur finanz_db.zahlungEdit
DROP PROCEDURE IF EXISTS `zahlungEdit`;
DELIMITER //
CREATE PROCEDURE `zahlungEdit`(
	IN `var_ID` INT,
	IN `Var_bezeichnung` VARCHAR(50),
	IN `Var_karten_nr` VARCHAR(50)
)
root:BEGIN

Declare  var_Ergebnis int;
  
set var_Ergebnis = 0;

Start Transaction;

 
    Update zahlungsmittel set
      bezeichnung = Var_bezeichnung,
      karten_nr = Var_karten_nr
	 WHERE ID = var_ID;
  
    Set var_Ergebnis = ROW_COUNT();
    
	if var_Ergebnis = 1 then       
      Select var_Ergebnis AS Ergebnis;
      commit;
	Else		  
	  Select var_Ergebnis AS Ergebnis;
      rollback;
      leave root;	
    End if; 

  
END//
DELIMITER ;

-- Exportiere Struktur von View finanz_db.vw_fixkosten
DROP VIEW IF EXISTS `vw_fixkosten`;
-- Entferne temporäre Tabelle und erstelle die eigentliche View
DROP TABLE IF EXISTS `vw_fixkosten`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `vw_fixkosten` AS select `a`.`ID` AS `ID`,`a`.`betrag` AS `betrag`,`a`.`vorgang` AS `vorgang`,`a`.`kontonr` AS `kontonr`,`a`.`art` AS `art`,`a`.`kategorie_id` AS `kategorie_id`,ifnull(`dt`.`datum`,`a`.`datum`) AS `datum` from (`einausgaben` `a` join `dates_tmp` `dt` on(`a`.`ID` = `dt`.`einausgabe_id`)) where `a`.`typ` = 'F' union select `a`.`ID` AS `ID`,`a`.`betrag` AS `betrag`,`a`.`vorgang` AS `vorgang`,`a`.`kontonr` AS `kontonr`,`a`.`art` AS `art`,`a`.`kategorie_id` AS `kategorie_id`,`a`.`datum` AS `datum` from `einausgaben` `a` where `a`.`typ` = 'F' order by 7 ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
