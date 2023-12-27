-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server-Version:               10.4.12-MariaDB - mariadb.org binary distribution
-- Server-Betriebssystem:        Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Exportiere Struktur von Tabelle finanz_db.category_mapping
CREATE TABLE IF NOT EXISTS `category_mapping` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `KEY` varchar(50) NOT NULL DEFAULT '',
  `Name` varchar(264) NOT NULL DEFAULT '',
  `catID` int(11) NOT NULL,
  `typ` char(1) DEFAULT 'V',
  PRIMARY KEY (`ID`),
  KEY `FK_category_mapping_kategorien` (`catID`),
  CONSTRAINT `FK_category_mapping_kategorien` FOREIGN KEY (`catID`) REFERENCES `kategorien` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=198 DEFAULT CHARSET=utf8;

-- Exportiere Daten aus Tabelle finanz_db.category_mapping: ~177 rows (ungefähr)
INSERT INTO `category_mapping` (`ID`, `KEY`, `Name`, `catID`, `typ`) VALUES
	(1, 'Penny', 'Penny', 43, 'V'),
	(2, 'Aldi', 'Aldi', 43, 'V'),
	(3, 'Lidl', 'Lidl', 43, 'V'),
	(4, 'Rewe', 'Rewe', 43, 'V'),
	(5, 'Tchibo', 'Tchibo', 43, 'V'),
	(6, 'DM-Drogerie', 'DM-Drogerie', 60, 'V'),
	(7, 'Action', 'Action', 43, 'V'),
	(8, 'Rusta', 'Rusta', 43, 'V'),
	(9, 'Lindenbazar', 'Lindenbazar', 43, 'V'),
	(10, 'Zara', 'Zara', 91, 'V'),
	(11, 'Burger King', 'Burger King', 79, 'V'),
	(12, 'HM.COM', 'HM.COM', 62, 'V'),
	(13, 'H&M', 'H&M', 62, 'V'),
	(14, 'IKEA', 'IKEA', 87, 'V'),
	(15, 'McDonalds', 'McDonalds', 79, 'V'),
	(16, 'Budnikowsky', 'Budnikowsky', 60, 'V'),
	(17, 'Rossmann', 'Rossmann', 60, 'V'),
	(18, 'KIK', 'KIK', 62, 'V'),
	(19, 'Karaca', 'Karaca', 87, 'V'),
	(20, 'Pizza Hut', 'Pizza Hut', 79, 'V'),
	(21, 'Aral', 'Aral', 88, 'V'),
	(22, 'Shell', 'Shell', 88, 'V'),
	(23, 'Jet', 'Jet', 88, 'V'),
	(24, 'RYD', 'RYD', 88, 'V'),
	(25, 'Apotheke', 'Apotheke', 65, 'V'),
	(26, 'HEM', 'HEM Tankstelle', 88, 'V'),
	(27, 'AMZN-Ratenza', 'Amazon Ratenzahlung', 47, 'F'),
	(28, 'Amazon.de', 'Amazon', 43, 'V'),
	(29, 'AMZN Mktp', 'Amazon', 43, 'V'),
	(30, 'Saturn', 'SATURN ELECTRO-HANDELS', 55, 'V'),
	(31, 'MEIN HVV LOGPAY', 'Hamburger Hochbahn', 57, 'V'),
	(32, 'Ernsting\'s family', 'Ernsting\'s family', 62, 'V'),
	(33, 'TK MAXX', 'TK MAXX', 62, 'V'),
	(34, 'Kaufland', 'Kaufland', 43, 'V'),
	(35, 'PARKAUTOMATEN', 'PARKAUTOMATEN', 58, 'V'),
	(36, 'Zalando', 'Zalando', 90, 'V'),
	(37, 'DEICHMANN', 'DEICHMANN', 90, 'V'),
	(38, 'notino.de', 'notino.de', 60, 'V'),
	(39, 'Netto Marken-Discount', 'Netto Marken-Discount', 43, 'V'),
	(40, 'C&A', 'C&A', 62, 'V'),
	(41, 'Takko', 'Takko', 62, 'V'),
	(42, 'NETTO ApS', 'NETTO ApS & Co. KG', 43, 'V'),
	(43, 'Prime Video', 'Prime Video', 42, 'V'),
	(44, 'STADT NORDERSTEDT', 'STADT NORDERSTEDT', 89, 'V'),
	(45, 'Tankstelle', 'Tankstelle', 88, 'V'),
	(46, 'AMEND RESTAURANT', 'AMEND RESTAURANT', 79, 'V'),
	(47, 'Contipark', 'Contipark', 58, 'V'),
	(48, 'AMZ.*', 'Amazon', 43, 'V'),
	(49, 'Hamburger Hochbahn', 'Hamburger Hochbahn AG', 57, 'V'),
	(50, 'Hoeffner', 'Höffner', 87, 'V'),
	(51, 'apolux', 'apolux.de', 65, 'V'),
	(52, 'BALKES MARKT', 'BALKES MARKT', 43, 'V'),
	(53, 'Jysk', 'Jysk', 87, 'V'),
	(54, 'Hartfelder', 'Hartfelder', 87, 'V'),
	(55, 'MEDIKAMENT', 'Medikamente', 65, 'V'),
	(56, 'apo.com', 'apo.com', 65, 'V'),
	(57, 'OfficeCentre GmbH', 'Staples', 92, 'V'),
	(58, 'ZZHI GASTRO', 'ZZHI GASTRO GMBH', 79, 'V'),
	(59, 'Hagebaumarkt', 'Hagebaumarkt', 93, 'V'),
	(60, 'Bauhaus', 'Bauhaus', 93, 'V'),
	(61, 'Plambeck', 'Plambeck', 93, 'V'),
	(62, 'Hornbach', 'Hornbach', 93, 'V'),
	(63, 'Vinted', 'Vinted', 43, 'V'),
	(64, 'Media-Markt', 'Media-Markt', 55, 'V'),
	(65, 'Ebay', 'Ebay', 43, 'V'),
	(66, 'BARSTUFF.DE', 'BARSTUFF.DE', 43, 'V'),
	(67, 'ZURBRUEGGEN', 'ZURBRUEGGEN', 87, 'V'),
	(68, 'DISAPO', 'disapo.de', 65, 'V'),
	(69, 'DHL OL', 'DHL', 74, 'V'),
	(70, 'FOTOGRAF', 'FOTOGRAF', 94, 'V'),
	(71, 'NINTENDO', 'NINTENDO', 95, 'V'),
	(72, 'Steam', 'Steam', 95, 'V'),
	(73, 'DOCMORRIS', 'DOCMORRIS', 65, 'V'),
	(74, 'TOTAL', 'TOTAL', 88, 'V'),
	(75, 'WÄHRUNGSUMRECHNUNGSENTGELT', 'WÄHRUNGSUMRECHNUNGSENTGELT', 96, 'V'),
	(76, 'MAUTSTELLE', 'MAUTSTELLE', 97, 'V'),
	(77, 'DARSGO', 'DarsGo system', 97, 'V'),
	(78, 'OPTIKER BODE', 'OPTIKER BODE', 98, 'V'),
	(79, 'TRIP COM', 'Trip.com', 99, 'V'),
	(80, 'IDEALSWEDEN', 'IDEAL OF SWEDEN', 43, 'V'),
	(81, 'KLARNA', 'KLARNA', 43, 'V'),
	(82, 'THALIA.DE', 'THALIA.DE', 69, 'V'),
	(83, 'DEHNER GARTEN-CENTER', 'DEHNER GARTEN-CENTER', 93, 'V'),
	(84, 'UNITED CINEMAS', 'United Cinemas International', 100, 'V'),
	(85, 'SERENGETI-PARK', 'SERENGETI-PARK', 101, 'V'),
	(86, 'FLIXBUS', 'FLIXBUS', 102, 'V'),
	(87, 'FOTOSTUDIO', 'FOTOSTUDIO', 94, 'V'),
	(88, 'BS HRUSICA I-J JESENICE', 'BS HRUSICA I-J JESENICE', 88, 'V'),
	(89, 'HVV ABO', 'Hamburger Hochbahn', 57, 'F'),
	(90, 'MEIN HVV TICKET', 'Hamburger Hochbahn', 57, 'V'),
	(91, 'PAYPAL *.HVV', 'Hamburger Hochbahn', 57, 'V'),
	(93, 'MEDIAMARKT', 'Media-Markt', 55, 'V'),
	(94, 'Media Markt', 'Media-Markt', 55, 'V'),
	(96, 'H . M Hennes . Mauritz', 'H&M', 62, 'V'),
	(97, 'TEAM ORHAN', 'TEAM ORHAN', 50, 'V'),
	(98, 'Drillisch', 'Drillisch', 33, 'F'),
	(99, 'ES Gebaeude-Service', 'ES Gebaeude-Service', 53, 'F'),
	(100, 'Familienkasse', 'Familienkasse', 52, 'F'),
	(101, 'Haushalt', 'Haushalt', 105, 'F'),
	(102, 'SEG System-EDV', 'SEG System-EDV', 53, 'F'),
	(103, 'MEGABAD', 'MEGABAD', 104, 'V'),
	(104, 'Netflix', 'Netflix', 42, 'F'),
	(105, 'ONUR GMBH', 'ONUR GMBH', 43, 'V'),
	(106, 'Kaya Markt', 'Kaya Markt', 43, 'V'),
	(107, 'Entgeltabrechnung', 'Entgeltabrechnung', 67, 'F'),
	(108, 'EYUEP SULTAN MARKET', 'EYUEP SULTAN MARKET', 43, 'V'),
	(109, 'DEVK', 'DEVK', 44, 'F'),
	(111, 'Kindergeld Hazar', 'Umbuchung Kindergeld', 82, 'F'),
	(112, 'Kindergeld Haktan', 'Umbuchung Kindergeld', 82, 'F'),
	(113, 'turkishairlines', 'Turkish Airlines', 99, 'V'),
	(114, 'OIL', 'Tankstelle', 88, 'V'),
	(115, 'GUENES FLEISCHWAREN', 'Fleischerei Cami', 43, 'V'),
	(116, 'ADAC', 'ADAC', 50, 'V'),
	(117, 'Hadi Dagdogen', 'Kaya Döner', 79, 'V'),
	(118, 'STREIFENENTEN', 'STREIFENENTEN', 86, 'V'),
	(119, 'PUETT UN PANN', 'PUETT UN PANN', 110, 'V'),
	(120, 'Buecherhallen', 'Buecherhallen', 69, 'V'),
	(121, 'AMC Deutschland', 'AMC Deutschland', 68, 'V'),
	(122, 'Servicepreis Girokonto', 'Entgeltabrechnung', 67, 'F'),
	(123, 'Sollzinsen', 'Sollzinsen', 67, 'F'),
	(124, 'Bareinzahlung', 'Bareinzahlung', 81, 'V'),
	(125, 'Lastschrift GA', 'Barauszahlung Geldautomat', 45, 'V'),
	(126, 'Barauszahlung GA', 'Barauszahlung Geldautomat', 45, 'V'),
	(127, 'K \\+ K Reinigungsservice', 'K + K Reinigungsservice', 53, 'F'),
	(128, 'SCHUFA', 'SCHUFA Holding AG', 111, 'F'),
	(129, 'NANU NANA', 'NANU NANA', 43, 'V'),
	(130, 'interabo GmbH', 'interabo GmbH', 53, 'F'),
	(131, 'Vereinigung Hamburger Kinde', 'Vereinigung Hamburger Kindertagesstätten', 76, 'F'),
	(132, 'IHR REAL', 'Real', 43, 'V'),
	(133, 'Steuerkasse', 'Steuerkasse', 112, 'V'),
	(134, 'FAMILA', 'FAMILA', 43, 'V'),
	(135, 'KK-Hanzade', 'Kleiderkreisel', 62, 'V'),
	(136, 'KK-Rukiye Büyüksoy', 'Kleiderkreisel', 62, 'V'),
	(137, 'MARKTKAUF', 'MARKTKAUF', 43, 'V'),
	(138, 'OBI SAGT', 'OBI', 93, 'V'),
	(139, 'Vodafone', 'Vodafone', 33, 'V'),
	(140, 'HUK-COBURG', 'HUK-COBURG', 44, 'V'),
	(141, 'KIBEK', 'KIBEK', 87, 'V'),
	(143, 'SVWZ\\+Rümeysa Ekinci', 'Kleiderkreisel', 62, 'V'),
	(145, 'eteleon', 'eteleon Drillisch', 33, 'V'),
	(146, 'SVWZ\\+Sahra', 'Kleiderkreisel', 62, 'V'),
	(147, 'KK-Umsaetze', 'Kreditkartenabrechnung', 64, 'V'),
	(148, 'SVWZ\\+Rukiye Büyüksoy', 'Kleiderkreisel', 62, 'V'),
	(149, 'MARKANT', 'MARKANT', 43, 'V'),
	(150, 'SVWZ\\+SPAREN', 'Umbuchung auf Sparkonto', 82, 'V'),
	(152, 'GO-NORDERSTEDT', 'GO-NORDERSTEDT', 89, 'V'),
	(153, 'MOEBELHAUS', 'MOEBELHAUS', 87, 'V'),
	(154, 'BUDNI', 'BUDNI', 60, 'V'),
	(155, 'HAGEBAU', 'HAGEBAU', 93, 'V'),
	(156, 'TEDI', 'TEDI GMBH', 43, 'V'),
	(157, 'MEYDAN-MARKT', 'MEYDAN-MARKT', 43, 'V'),
	(158, 'NORD MARKT', 'NORD MARKT', 43, 'V'),
	(159, 'Spar-Umbuchung', 'Spar-Umbuchung', 82, 'V'),
	(161, 'SVWZ\\+Hanzade', 'Kleiderkreisel', 62, 'V'),
	(162, 'NETTO SAGT', 'NETTO', 43, 'V'),
	(163, 'Barverfuegung', 'Barauszahlung Geldautomat', 45, 'V'),
	(164, 'WEFA e\\.V\\.', 'WEFA e.V.', 109, 'V'),
	(165, 'APOTH', 'APOTHEKE', 65, 'V'),
	(166, 'ONUR', 'ONUR', 43, 'V'),
	(167, 'berke  IBAN', 'Kleiderkreisel', 62, 'V'),
	(168, 'AMC Alfa', 'AMC Deutschland', 68, 'V'),
	(169, 'hanzade  IBAN', 'Kleiderkreisel', 62, 'V'),
	(170, 'Sportclub Alstertal', 'Sportclub Alstertal-Langenhorn', 114, 'F'),
	(171, 'sahra  IBAN', 'Kleiderkreisel', 62, 'V'),
	(172, 'ES GEBAEUDESERVICE', 'ES Gebaeude-Service', 53, 'F'),
	(173, 'Deutsche Post', 'Deutsche Post AG', 74, 'V'),
	(175, 'ISBKDEFXXXX', 'IS-Bank', 115, 'V'),
	(176, 'SKY MARKT', 'SKY MARKT', 43, 'V'),
	(178, 'APCOA', 'Autoparking', 58, 'V'),
	(179, 'Pharmeo', 'Pharmeo.de', 65, 'V'),
	(180, 'KARSTADT', 'KARSTADT', 62, 'V'),
	(181, 'Kundenmietfach', 'Kundenmietfach', 67, 'F'),
	(182, 'KREIS SEGEBERG-DER LANDRAT', 'KREIS SEGEBERG-DER LANDRAT', 89, 'V'),
	(183, 'Deutsche Lufthansa', 'Deutsche Lufthansa', 99, 'V'),
	(184, 'A\\.T\\.U AUTO', 'A.T.U AUTO', 50, 'V'),
	(185, 'AllSecur', 'AllSecur', 50, 'F'),
	(186, 'KFZ-STEUER', 'KFZ-STEUER', 50, 'F'),
	(187, 'Spar  IBAN', 'Spar-Umbuchung', 82, 'V'),
	(188, 'MEDIA MAR', 'Media-Markt', 55, 'V'),
	(189, 'KRUEMET', 'KRUEMET', 43, 'V'),
	(190, 'ROLLER GMBH', 'ROLLER GMBH', 87, 'V'),
	(191, 'DM FIL', 'DM FILIALE', 60, 'V'),
	(192, 'Kinderwelt Hamburg', 'Kinderwelt Hamburg', 53, 'F'),
	(193, 'Habibe Erdogan', 'Habibe Erdogan', 113, 'V'),
	(194, 'BR-SPIELWAREN', 'BR-SPIELWAREN', 91, 'V'),
	(195, 'NETTO MARKEN', 'NETTO MARKEN', 43, 'V'),
	(196, 'WEFA-HUMANITARE', 'WEFA-HUMANITARE', 109, 'V'),
	(197, 'APO\\. AM LANGEN', 'Apotheke', 65, 'V');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;




-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server-Version:               10.4.12-MariaDB - mariadb.org binary distribution
-- Server-Betriebssystem:        Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

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
Declare  newID int;
  
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
		SET newID = (SELECT MAX(ID) FROM monats_ausgaben);     
      Select var_Ergebnis AS Ergebnis, var_vorgang AS ErgText, newID AS ID;
      commit;
	Else		  
	  Select var_Ergebnis AS Ergebnis, var_vorgang AS ErgText, 0 AS ID;
      rollback;
      leave root;	
    End if; 

 Else 
    Set var_Ergebnis = -2;
    Select var_Ergebnis AS Ergebnis, var_vorgang AS ErgText, 0 AS ID;
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
	NULL as einausgaben_id,
	'---' AS kategorie
FROM monats_ausgaben a JOIN konten k ON  a.kontonr=k.kontonr
JOIN konten_typen kt ON k.kontotyp=kt.kontotyp
WHERE a.kontonr = var_giroSpar AND date_format(a.datum,"%Y%m") < CONCAT(jahr,monat)
GROUP BY a.kontonr

UNION	  

SELECT 
      ma1.ID,
	   datum as datum,
	   vorgang, ifnull(rtrim(extern),'N') as extern, ifnull(herkunft,'---') as herkunft, ifnull(buchungstext,'---') as buchungstext,  
	   einnahme as betrag, kontonr, einausgaben_id, (SELECT ka.bezeichnung FROM einausgaben e JOIN kategorien ka ON e.kategorie_id=ka.ID WHERE e.ID = ma1.einausgaben_id) AS kategorie
  FROM monats_ausgaben ma1
  Where month(datum) = SUBSTRING(var_monat,1,2) and year(datum) = SUBSTRING(var_monat,3,4) and einnahme > 0 and kontonr = var_giroSpar
  Union
 SELECT 
       ma2.ID,
	   datum as datum,
	   vorgang, ifnull(rtrim(extern),'N') as extern, ifnull(herkunft,'---') as herkunft, ifnull(buchungstext,'---') as buchungstext,  
	   ausgabe as betrag, kontonr, einausgaben_id, (SELECT ka.bezeichnung FROM einausgaben e JOIN kategorien ka ON e.kategorie_id=ka.ID WHERE e.ID = ma2.einausgaben_id) AS kategorie
  FROM monats_ausgaben ma2
  Where month(datum) = SUBSTRING(var_monat,1,2) and year(datum) = SUBSTRING(var_monat,3,4) and ausgabe < 0 and kontonr = var_giroSpar
  ORDER BY datum desc;
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

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;


CREATE TABLE `amazon_visa` (
	`ID` INT(11) NOT NULL AUTO_INCREMENT,
	`Umsatz` VARCHAR(264) NOT NULL COLLATE 'utf8_general_ci',
	`kaufdatum` DATE NOT NULL,
	`buchdatum` DATE NOT NULL,
	`abrechnung_datum` DATE NOT NULL,
	`betrag` DECIMAL(14,2) NOT NULL,
	`catID` INT(11) NULL DEFAULT NULL,
	`typ` CHAR(1) NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`hash` CHAR(32) NOT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`ID`) USING BTREE,
	UNIQUE INDEX `hash` (`hash`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=1
;
