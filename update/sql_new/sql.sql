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
WHERE (DATE_FORMAT(dt.datum,"%Y%m%d") BETWEEN DATE_FORMAT(var_heute,"%Y%m%d") AND DATE_FORMAT(last_day(var_heute),"%Y%m%d"))

UNION 

SELECT  
var_heute,
'Durchschn. variable Kosten',
  (IFNULL((Select SUM(betrag)
  from einausgaben a 
  where DATE_FORMAT(datum,"%Y%m%d") BETWEEN ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -2 MONTH) AND last_day(ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -2 MONTH)) AND a.typ = 'V'
  AND kontonr = a5.kontonr
  ),0) +
  
 IFNULL((Select sum(betrag)
  from einausgaben a 
  where DATE_FORMAT(datum,"%Y%m%d") BETWEEN ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -1 MONTH) AND last_day(ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -1 MONTH)) AND a.typ = 'V'
  AND kontonr = a5.kontonr
  ),0) +
  
 IFNULL((Select sum(betrag)
  from einausgaben a 
  where DATE_FORMAT(datum,"%Y%m%d") BETWEEN ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -3 MONTH) AND last_day(ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -3 MONTH)) AND a.typ = 'V'
  AND kontonr = a5.kontonr
  ),0)) / 3,
  kt.kontotyp,
 kt.bezeichnung AS bezeichnung,
 case when   (IFNULL((Select SUM(betrag)
  from einausgaben a 
  where DATE_FORMAT(datum,"%Y%m%d") BETWEEN ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -2 MONTH) AND last_day(ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -2 MONTH)) AND a.typ = 'V'
  AND kontonr = a5.kontonr
  ),0) +
  
 IFNULL((Select sum(betrag)
  from einausgaben a 
  where DATE_FORMAT(datum,"%Y%m%d") BETWEEN ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -1 MONTH) AND last_day(ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -1 MONTH)) AND a.typ = 'V'
  AND kontonr = a5.kontonr
  ),0) +
  
 IFNULL((Select sum(betrag)
  from einausgaben a 
  where DATE_FORMAT(datum,"%Y%m%d") BETWEEN ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -3 MONTH) AND last_day(ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -3 MONTH)) AND a.typ = 'V'
  AND kontonr = a5.kontonr
  ),0)) / 3 < 0 then 'A' ELSE 'E' END,
a5.kontonr  
FROM monats_ausgaben a5 JOIN konten k ON  a5.kontonr=k.kontonr
JOIN konten_typen kt ON k.kontotyp=kt.kontotyp
GROUP BY a5.kontonr;

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

 -- es müssen auch die druchschn. var. Kosten des aktuellen Monats berücksichtigt werden

  (IFNULL((Select SUM(betrag)
  from einausgaben 
  where DATE_FORMAT(datum,"%Y%m%d") BETWEEN ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -2 MONTH) AND last_day(ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -2 MONTH)) AND typ = 'V'
  AND kontonr = a.kontonr
  ),0) +
  
 IFNULL((Select sum(betrag)
  from einausgaben  
  where DATE_FORMAT(datum,"%Y%m%d") BETWEEN ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -1 MONTH) AND last_day(ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -1 MONTH)) AND typ = 'V'
  AND kontonr = a.kontonr
  ),0) +
  
 IFNULL((Select sum(betrag)
  from einausgaben  
  where DATE_FORMAT(datum,"%Y%m%d") BETWEEN ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -3 MONTH) AND last_day(ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m%d"), INTERVAL -3 MONTH)) AND typ = 'V'
  AND kontonr = a.kontonr
  ),0)) / 3 +

IFNULL((SELECT SUM(betrag) FROM vw_fixkosten f WHERE date_format(f.datum,"%Y%m%d") >= date_format(CURDATE(),"%Y%m%d") 
AND date_format(f.datum,"%Y%m%d") <= last_day(date_format(DATE_ADD(var_progMonat, INTERVAL -1 MONTH),"%Y%m%d")) AND f.kontonr=a.kontonr),0)
	
-- Kontostand aktueller Monat

+
case When var_monat > 1 -- Durchschnittliche variable Kosten werden in den Konstoständen berücksichtigt. 
Then  
IFNULL((Select 
  SUM(a5.betrag)/3
  from einausgaben a5 
--  where DATE_FORMAT(a5.datum,"%Y%m%d") >= DATE_FORMAT(var_vor3Monaten,"%Y%m01") AND  DATE_FORMAT(a5.datum,"%Y%m%d") <= LAST_DAY(DATE_FORMAT(var_vorMonatReal,"%Y%m%d")) AND a5.typ = 'V' and a5.kontonr = a.kontonr),0)*(var_monat-1)
  where DATE_FORMAT(a5.datum,"%Y%m%d") BETWEEN ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m01"), INTERVAL -3 MONTH) AND last_day(ADDDATE(CURDATE(), INTERVAL -1 MONTH)) AND a5.typ = 'V' and a5.kontonr = a.kontonr),0)*(var_monat-1)
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
  where DATE_FORMAT(a.datum,"%Y%m%d") BETWEEN ADDDATE(DATE_FORMAT(CURDATE(), "%Y%m01"), INTERVAL -3 MONTH) AND last_day(ADDDATE(CURDATE(), INTERVAL -1 MONTH)) AND a.typ = 'V'
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
   
   DELETE FROM dates_tmp WHERE einausgabe_id = Var_id2;

	INSERT INTO dates_tmp (einausgabe_id, datum) SELECT Var_id2, datum FROM dates_tmp WHERE einausgabe_id = Var_newID;

END if;

COMMIT;

SELECT Var_anzahl AS ergebnis, Var_newID as ID;

END//
DELIMITER ;

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
	DELETE FROM dates_tmp WHERE einausgabe_id = Var_id2;
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
	-- einfügen und anpasen der tmp-Daten
	DELETE FROM dates_tmp WHERE einausgabe_id = Var_id2;

	INSERT INTO dates_tmp (einausgabe_id, datum) SELECT Var_id2, datum FROM dates_tmp WHERE einausgabe_id = Var_ID;

END if;

COMMIT;   

SELECT Var_anzahl AS ergebnis;

END//
DELIMITER ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
