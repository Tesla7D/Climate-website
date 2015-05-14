--
-- FILE       : tables.sql
-- PROJECT    : ClimateView - Weather Archiving and Visualization - Advanced SQL Final Project
-- PROGRAMMER : Ben Lorantfy, Grigory Kozyrev, Kevin Li, Michael Dasilva
-- DATE       : April 19, 2015
--

-- -----------------------------------------------------
--		Transformation sProc
-- -----------------------------------------------------

-- funnction to convert F to C and inch to mm of rain
-- returns year month
USE ClimateView;
DROP PROCEDURE IF EXISTS transformProc;
DELIMITER //
CREATE PROCEDURE transformProc(tblName VARCHAR(255), StateCode INT, inpYearMonth INT, PCP Float, CDD Float, HDD Float, TMIN Float, TMAX Float, TAVG Float)
BEGIN
	DECLARE celsiusTMIN INT;
    DECLARE celsiusTMAX INT;
    DECLARE celsiusTAVG INT;
    DECLARE mmPCP INT;
    DECLARE buf INT;
    
	SET celsiusTMIN := ((TMIN -32)*(5/9));
	SET celsiusTMAX := ((TMAX -32)*(5/9));
	SET celsiusTAVG := ((TAVG -32)*(5/9));
	-- convert inches into mm
	SET mmPCP := PCP *  25.4;	
    
    SET buf := (SELECT MAX(yearMonth) FROM YearMonth WHERE YearMonth.YearMonth = inpYearMonth);
    IF (buf IS NULL) THEN
		SET @yearNum = (SELECT LEFT(inpYearMonth, 4));
		SET @monthNum = (SELECT RIGHT(inpYearMonth, 2));
		INSERT INTO YearMonth(YearMonth, Year, Month) 
			VALUES (inpYearMonth, @yearNum, @monthNum);
	END IF;
    
	SET @q = CONCAT('INSERT INTO ' , tblName, ' (StateCode, YearMonth, PCP, CDD, HDD, TMIN, TMAX, TAVG) values  (' , StateCode, ',' , inpYearMonth, ',' ,  mmPCP, ',' , CDD, ',' , HDD, ',' , celsiusTMIN, ',' , celsiusTMAX, ',' ,  celsiusTAVG, ')');
	PREPARE stmt FROM @q;
	EXECUTE stmt;
	DEALLOCATE PREPARE stmt;
END //
DELIMITER ;

-- -----------------------------------------------------
--		Create User sProc
-- -----------------------------------------------------

-- function to create users data table;
-- parameter is userid or table name.
DROP PROCEDURE IF EXISTS createUserTable;
DELIMITER //
CREATE PROCEDURE createUserTable(tblName VARCHAR(255))
BEGIN
    SET @tableName = tblName;
	SET @Z = CONCAT ('DROP TABLE IF EXISTS '  , @tableName,'' );
	
    SET @q = CONCAT('
        CREATE TABLE ' , @tableName, ' (
		`StateCode` INT(11),
		`YearMonth` INT(11),
		-- Millimeters of precepitation 
		`PCP` FLOAT,
		`CDD` FLOAT,
		`HDD` FLOAT,
		-- Lowest month temperture
		`TMIN` FLOAT,
		-- Maximum month temperture in degrees celcius
		`TMAX` FLOAT,
		-- Average month temperture in degrees celcius
		`TAVG` FLOAT,
		
		-- Foreign keys
		FOREIGN KEY (StateCode) REFERENCES State(StateCode),
		FOREIGN KEY (YearMonth) REFERENCES YearMonth(YearMonth)
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8
    ');
	PREPARE stmt FROM @z;
	EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    PREPARE stmt FROM @q;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    -- Table is created.
END //
DELIMITER ;

