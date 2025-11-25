SET @startdate = '2022-04-01';
SET @stopedate = '2022-06-30';

SELECT 
    final.ClinicID,
    MIN(DaFirstVisit) AS DaFirstVisit,
    MIN(LClinicID) AS LClinicID,
    MIN(age) AS age,
    MIN(Sex) AS Sex,
    MIN(DaHIV) AS DaHIV,
    MIN(Vcctcode) AS Vcctcode,
    MIN(VcctID) AS VcctID,
    MIN(OffIn) AS OffIn,
    MIN(SiteName) AS SiteName,
    MIN(daartin) AS daartin,
    MIN(Artnum) AS Artnum,
    MIN(ART) AS ART,
    MIN(DaArt) AS DaArt,
    MIN(Village) AS Village,
    MIN(Commune) AS Commune,
    MIN(District) AS District,
    MIN(Province) AS Province,
    CASE
        WHEN COUNT(ip.ClinicID) > 0 THEN CONCAT('ID poor (', MIN(ip.PoorIdentifier), ')')
        ELSE 'Not have'
    END AS IdPoorStatus
FROM (
    SELECT 
        ll.ClinicID,
        ll.DaFirstVisit,
        ll.LClinicID,
        ll.age,
        ll.Sex,
        ll.DaHIV,
        ll.Vcctcode,
        ll.VcctID,
        ll.OffIn,
        ll.SiteName,
        ll.daartin,
        ll.Artnum,
        ll.ART,
        ll.DaArt,
        u.Village,
        u.Commune,
        u.District,
        u.Province
    FROM (
        -- Adult (tblaimain)
        SELECT 
            i.ClinicID,
            i.DaFirstVisit,
            i.LClinicID,
            YEAR(@stopedate) - YEAR(i.DaBirth) AS age,
            IF(i.Sex = 0, 'Female', 'Male') AS Sex,
            i.DaHIV,
            i.Vcctcode,
            i.VcctID,
            i.OffIn,
            i.SiteName,
            i.DaART AS daartin,
            i.Artnum,
            a.ART,
            a.DaArt
        FROM tblaimain i
        LEFT JOIN (
            SELECT ClinicID 
            FROM tblavpatientstatus 
            WHERE Da <= @stopedate 
            ORDER BY ClinicID
        ) el ON el.ClinicID = i.ClinicID
        INNER JOIN (
            SELECT ClinicID, MAX(DatVisit) AS lastdate 
            FROM tblavmain 
            WHERE DatVisit <= @stopedate 
            GROUP BY ClinicID
        ) md ON md.ClinicID = i.ClinicID
        LEFT JOIN (
            SELECT * FROM tblaart 
            WHERE DaArt <= @stopedate
        ) a ON a.ClinicID = i.ClinicID
        WHERE i.DaFirstVisit <= @stopedate 
          AND el.ClinicID IS NULL

        UNION

        -- Child (tblcimain)
        SELECT 
            i.ClinicID,
            i.DaFirstVisit,
            i.LClinicID,
            YEAR(@stopedate) - YEAR(i.DaBirth) AS age,
            IF(i.Sex = 0, 'Female', 'Male') AS Sex,
            i.DaTest AS DaHIV,
            i.Vcctcode,
            i.VcctID,
            i.OffIn,
            i.SiteName,
            i.DaART AS daartin,
            i.Artnum,
            a.ART,
            a.DaArt
        FROM tblcimain i
        LEFT JOIN (
            SELECT ClinicID 
            FROM tblcvpatientstatus 
            WHERE Da <= @stopedate 
            ORDER BY ClinicID
        ) el ON el.ClinicID = i.ClinicID
        INNER JOIN (
            SELECT ClinicID, MAX(DatVisit) AS lastdate 
            FROM tblcvmain 
            WHERE DatVisit <= @stopedate 
            GROUP BY ClinicID
        ) md ON md.ClinicID = i.ClinicID
        LEFT JOIN (
            SELECT * FROM tblcart 
            WHERE DaArt <= @stopedate
        ) a ON a.ClinicID = i.ClinicID
        WHERE i.DaFirstVisit <= @stopedate 
          AND el.ClinicID IS NULL
    ) AS ll
    LEFT JOIN tblaumain u ON u.ClinicID = ll.ClinicID
) AS final
LEFT JOIN (
    SELECT ClinicID, MIN(PoorIdentifier) AS PoorIdentifier
    FROM (
        SELECT ClinicID, Typecode, Codes AS PoorIdentifier FROM tblalink
        UNION ALL
        SELECT ClinicID, Typecode, Codes AS PoorIdentifier FROM tblclink
    ) AS link_source
    WHERE Typecode = 'ID Poor'
) AS ip ON ip.ClinicID = final.ClinicID
GROUP BY final.ClinicID;
