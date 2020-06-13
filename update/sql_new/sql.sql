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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
