SELECT CURDATE(), 
CONCAT('Kontostand',' ',k.bezeichnung) AS vorgang,
SUM(ifnull(ausgabe,0) + ifnull(einnahme,0)) +
case when IFNULL((SELECT COUNT(einausgabe_id) FROM dates_tmp WHERE einausgabe_id = e.ID AND (DATE_FORMAT('2020-12-01',"%Y%m") >= DATE_FORMAT(datum,"%Y%m") AND DATE_FORMAT(CURDATE(),"%Y%m") < DATE_FORMAT(datum,"%Y%m"))),0) > 0 Then
((SELECT COUNT(einausgabe_id) FROM dates_tmp WHERE einausgabe_id = e.ID AND (DATE_FORMAT('2020-12-01',"%Y%m") >= DATE_FORMAT(datum,"%Y%m") AND DATE_FORMAT(CURDATE(),"%Y%m") < DATE_FORMAT(datum,"%Y%m")))-1) * -- Anzahl der Zahlungen abzüglich 1 da es schon mit den Fixkosten abgedeckt wird
-- Anfallende Fixkosten in bestimmten Zeitraum
IFNULL((Select 
  betrag
  from einausgaben a 
  JOIN kategorien k on a.kategorie_id = k.ID
  JOIN konten ko ON a.kontonr = ko.kontonr
  where DATE_FORMAT('2020-12-01',"%Y%m") IN (SELECT DATE_FORMAT(datum,"%Y%m") FROM dates_tmp d WHERE d.einausgabe_id = a.ID AND DATE_FORMAT('2020-12-01',"%Y%m") = DATE_FORMAT(d.datum,"%Y%m"))
   AND a.ID=e.ID 
	 ),0) ELSE 0 end
AS betrag,

-- Anfallende Fixkosten in bestimmtem Zeitraum
IFNULL((	 Select 
  betrag
  from einausgaben a 
  JOIN kategorien k on a.kategorie_id = k.ID
  JOIN konten ko ON a.kontonr = ko.kontonr
  where DATE_FORMAT('2020-12-01',"%Y%m") IN (SELECT DATE_FORMAT(datum,"%Y%m") FROM dates_tmp d WHERE d.einausgabe_id = a.ID AND DATE_FORMAT('2020-12-01',"%Y%m") = DATE_FORMAT(d.datum,"%Y%m"))
   AND a.ID=e.ID 
	 ),0) AS Kosten,
-- Anfallende Fixkosten in bestimmtem Zeitraum


(SELECT COUNT(einausgabe_id) FROM dates_tmp WHERE einausgabe_id = e.ID AND (DATE_FORMAT('2020-12-01',"%Y%m") >= DATE_FORMAT(datum,"%Y%m") AND DATE_FORMAT(CURDATE(),"%Y%m") < DATE_FORMAT(datum,"%Y%m"))  ) AS anzahl,


case when IFNULL((SELECT COUNT(einausgabe_id) FROM dates_tmp WHERE einausgabe_id = e.ID AND (DATE_FORMAT('2020-12-01',"%Y%m") >= DATE_FORMAT(datum,"%Y%m") AND DATE_FORMAT(CURDATE(),"%Y%m") < DATE_FORMAT(datum,"%Y%m"))),0) > 0 Then
((SELECT COUNT(einausgabe_id) FROM dates_tmp WHERE einausgabe_id = e.ID AND (DATE_FORMAT('2020-12-01',"%Y%m") >= DATE_FORMAT(datum,"%Y%m") AND DATE_FORMAT(CURDATE(),"%Y%m") < DATE_FORMAT(datum,"%Y%m")))-1) * -- Anzahl der Zahlungen abzüglich 1 da es schon mit den Fixkosten abgedeckt wird
-- Anfallende Fixkosten in bestimmten Zeitraum
IFNULL((Select 
  betrag
  from einausgaben a 
  JOIN kategorien k on a.kategorie_id = k.ID
  JOIN konten ko ON a.kontonr = ko.kontonr
  where DATE_FORMAT('2020-12-01',"%Y%m") IN (SELECT DATE_FORMAT(datum,"%Y%m") FROM dates_tmp d WHERE d.einausgabe_id = a.ID AND DATE_FORMAT('2020-12-01',"%Y%m") = DATE_FORMAT(d.datum,"%Y%m"))
   AND a.ID=e.ID 
	 ),0) ELSE 0 end AS kosten_kumm,
-- Aktueller Konstostand des jeweiligen Kontos
	 
kt.kontotyp,
 kt.bezeichnung AS bezeichnung,
CASE WHEN SUM(ifnull(ausgabe,0) + ifnull(einnahme,0)) < 0 THEN 'A' ELSE 'E' END,  
a.kontonr
FROM monats_ausgaben a JOIN konten k ON  a.kontonr=k.kontonr
JOIN konten_typen kt ON k.kontotyp=kt.kontotyp
JOIN einausgaben e ON a.kontonr=e.kontonr
-- Where DATE_FORMAT(var_heute,"%Y%m") = DATE_FORMAT(datum,"%Y%m")
GROUP BY a.kontonr ; 
	
