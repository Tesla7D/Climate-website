--
-- FILE       : tables.sql
-- PROJECT    : ClimateView - Weather Archiving and Visualization - Advanced SQL Final Project
-- PROGRAMMER : Ben Lorantfy, Grigory Kozyrev, Kevin Li, Michael Dasilva
-- DATE       : April 19, 2015
--

-- 
-- Drop the database if it already exists
-- 
DROP DATABASE IF EXISTS ClimateView;

--
-- Create database and use it
--
CREATE DATABASE ClimateView;
USE ClimateView;

--
-- Create StateTable
-- Stores the state names that map to the state codes
--
CREATE TABLE State(
	StateCode INT PRIMARY KEY,
	
	-- name of item (e.g. Harness, Reflector, etc.)
	Name VARCHAR(300)
);

--
-- Create user table
-- Creates the user table containing unique usernames and passwords
--
CREATE TABLE User(
	UserID INT AUTO_INCREMENT PRIMARY KEY,
	
	--
	-- User credentials
	--
	Username VARCHAR(255),
	Password VARCHAR(255)
);

--
-- Create YearMonth table
-- Stores year,month pairs of any dates used in user data
-- Year,month pairs are unique
--
CREATE TABLE YearMonth(
	YearMonth INT AUTO_INCREMENT PRIMARY KEY,
	
	-- Year data was taken
	Year INT,
	
	-- Month data was taken
	Month INT
);

--
-- Create log table
-- Logs each ETL
--
CREATE TABLE Log(
	UserID INT,
	
	-- Time ETL started
	AttemptTime DATETIME,
	
	-- Time ETL finished
	CompletionTime DATETIME,
	
	-- ETL date range
	LowerYearMonth INT,
	UpperYearMonth INT,
	
	-- Foreign keys
	FOREIGN KEY (LowerYearMonth) REFERENCES YearMonth(YearMonth),
	FOREIGN KEY (UpperYearMonth) REFERENCES YearMonth(YearMonth)
);

--
-- Create a user's data table
-- Each user's table is created dynamically when
-- they load data
-- Data is recorded on a monthly basis
-- This table is an example table useful for testing
--
CREATE TABLE User0Data(
	-- State data was collected in
	StateCode INT,
	
	-- YearMonth that data was collected in
	YearMonth INT,
	
	-- Millimeters of precepitation 
	PCP FLOAT,
	
	CDD FLOAT,
	HDD FLOAT,
	
	-- Lowest month temperture
	TMIN FLOAT,
	
	-- Maximum month temperture in degrees celcius
	TMAX FLOAT,
	
	-- Average month temperture in degrees celcius
	TAVG FLOAT,
	
	-- Foreign keys
	FOREIGN KEY (StateCode) REFERENCES State(StateCode),
	FOREIGN KEY (YearMonth) REFERENCES YearMonth(YearMonth)
);

-- Test User
INSERT INTO User(Username,Password) VALUES ("ben","$2y$10$DU3uoyhM9VsekGRL9HB0zOwVNQbMHrjD9IL0n/BzwTElQBROY7NBi");

--
-- StateCode Table Inserts
--
INSERT INTO State (StateCode,Name) VALUES ('001','Alabama');        
INSERT INTO State (StateCode,Name) VALUES ('002','Arizona');        
INSERT INTO State (StateCode,Name) VALUES ('003','Arkansas');       
INSERT INTO State (StateCode,Name) VALUES ('004','California');     
INSERT INTO State (StateCode,Name) VALUES ('005','Colorado');       
INSERT INTO State (StateCode,Name) VALUES ('006','Connecticut');    
INSERT INTO State (StateCode,Name) VALUES ('007','Delaware');       
INSERT INTO State (StateCode,Name) VALUES ('008','Florida');       
INSERT INTO State (StateCode,Name) VALUES ('009','Georgia');        
INSERT INTO State (StateCode,Name) VALUES ('010','Idaho 039 South Dakota');        
INSERT INTO State (StateCode,Name) VALUES ('011','Illinois');       
INSERT INTO State (StateCode,Name) VALUES ('012','Indiana');        
INSERT INTO State (StateCode,Name) VALUES ('013','013 Iowa  042 Utah');        
INSERT INTO State (StateCode,Name) VALUES ('014','Kansas043 Vermont');
INSERT INTO State (StateCode,Name) VALUES ('015','Kentucky');       
INSERT INTO State (StateCode,Name) VALUES ('016','Louisiana');      
INSERT INTO State (StateCode,Name) VALUES ('018','Maryland');       
INSERT INTO State (StateCode,Name) VALUES ('019','Massachusetts');  
INSERT INTO State (StateCode,Name) VALUES ('020','Michigan');       
INSERT INTO State (StateCode,Name) VALUES ('021','Minnesota');      
INSERT INTO State (StateCode,Name) VALUES ('022','Mississippi');    
INSERT INTO State (StateCode,Name) VALUES ('023','Missouri');       
INSERT INTO State (StateCode,Name) VALUES ('024','Montana');       
INSERT INTO State (StateCode,Name) VALUES ('025','Nebraska');       
INSERT INTO State (StateCode,Name) VALUES ('026','Nevada107 Southwest Region');       
INSERT INTO State (StateCode,Name) VALUES ('027','New Hampshire');   
INSERT INTO State (StateCode,Name) VALUES ('028','New Jersey');      
INSERT INTO State (StateCode,Name) VALUES ('029','New Mexico');      
INSERT INTO State (StateCode,Name) VALUES ('030','New York');
INSERT INTO State (StateCode,Name) VALUES ('031','North Carolina');
INSERT INTO State (StateCode,Name) VALUES ('032','North Dakota');
INSERT INTO State (StateCode,Name) VALUES ('033','Ohio');
INSERT INTO State (StateCode,Name) VALUES ('034','Oklahoma');
INSERT INTO State (StateCode,Name) VALUES ('035','Oregon');
INSERT INTO State (StateCode,Name) VALUES ('036','Pennsylvania');
INSERT INTO State (StateCode,Name) VALUES ('037','Rhode Island');
INSERT INTO State (StateCode,Name) VALUES ('038','South Carolina');
INSERT INTO State (StateCode,Name) VALUES ('039','South Dakota');
INSERT INTO State (StateCode,Name) VALUES ('040','Tennessee');
INSERT INTO State (StateCode,Name) VALUES ('041','Texas');
INSERT INTO State (StateCode,Name) VALUES ('042','Utah');
INSERT INTO State (StateCode,Name) VALUES ('043','Vermont');
INSERT INTO State (StateCode,Name) VALUES ('044','Virginia');
INSERT INTO State (StateCode,Name) VALUES ('045','Washington');
INSERT INTO State (StateCode,Name) VALUES ('046','West Virginia');
INSERT INTO State (StateCode,Name) VALUES ('047','Wisconsin');
INSERT INTO State (StateCode,Name) VALUES ('048','Wyoming');

INSERT INTO State (StateCode,Name) VALUES ('101','Northeast Region');
INSERT INTO State (StateCode,Name) VALUES ('102','East North Central Region');
INSERT INTO State (StateCode,Name) VALUES ('103','Central Region');
INSERT INTO State (StateCode,Name) VALUES ('104','Southeast Region');
INSERT INTO State (StateCode,Name) VALUES ('105','West North Central Region');
INSERT INTO State (StateCode,Name) VALUES ('106','South Region');
INSERT INTO State (StateCode,Name) VALUES ('107','Southwest Region');
INSERT INTO State (StateCode,Name) VALUES ('108','Northwest Region');
INSERT INTO State (StateCode,Name) VALUES ('109','West Region');
INSERT INTO State (StateCode,Name) VALUES ('110','National');

INSERT INTO State (StateCode,Name) VALUES ('111','Great Plains');
INSERT INTO State (StateCode,Name) VALUES ('115','Southern Plains and Gulf Coast');
INSERT INTO State (StateCode,Name) VALUES ('120','US Rockies and Westward');
INSERT INTO State (StateCode,Name) VALUES ('121','NWS Eastern Region');
INSERT INTO State (StateCode,Name) VALUES ('122','NWS Southern Region');
INSERT INTO State (StateCode,Name) VALUES ('123','NWS Central Region');
INSERT INTO State (StateCode,Name) VALUES ('124','NWS Western Region');
INSERT INTO State (StateCode,Name) VALUES ('201','Pacific Northwest Basin');
INSERT INTO State (StateCode,Name) VALUES ('202','California River Basin');
INSERT INTO State (StateCode,Name) VALUES ('203','Great Basin');
INSERT INTO State (StateCode,Name) VALUES ('204','Lower Colorado River Basin');
INSERT INTO State (StateCode,Name) VALUES ('205','Upper Colorado River Basin');
INSERT INTO State (StateCode,Name) VALUES ('206','Rio Grande River Basin');
INSERT INTO State (StateCode,Name) VALUES ('207','Texas Gulf Coast River Basin');
INSERT INTO State (StateCode,Name) VALUES ('208','Arkansas-White-Red Basin');
INSERT INTO State (StateCode,Name) VALUES ('209','Lower Mississippi River Basin');
INSERT INTO State (StateCode,Name) VALUES ('210','Missouri River Basin');
INSERT INTO State (StateCode,Name) VALUES ('211','Souris-Red-Rainy Basin');
INSERT INTO State (StateCode,Name) VALUES ('212','Upper Mississippi River Basin');
INSERT INTO State (StateCode,Name) VALUES ('213','Great Lakes Basin');
INSERT INTO State (StateCode,Name) VALUES ('214','Tennessee River Basin');
INSERT INTO State (StateCode,Name) VALUES ('215','Ohio River Basin');
INSERT INTO State (StateCode,Name) VALUES ('216','South Atlantic-Gulf Basin');
INSERT INTO State (StateCode,Name) VALUES ('217','Mid-Atlantic Basin');
INSERT INTO State (StateCode,Name) VALUES ('218','New England Basin');
INSERT INTO State (StateCode,Name) VALUES ('220','Mississippi River Basin & Tributaties');

INSERT INTO State (StateCode,Name) VALUES ('250','Spring Wheat Belt');
INSERT INTO State (StateCode,Name) VALUES ('255','Primary Hard Red Winter Wheat Belt');
INSERT INTO State (StateCode,Name) VALUES ('256','Winter Wheat Belt');
INSERT INTO State (StateCode,Name) VALUES ('260','Primary Corn and Soybean Belt');
INSERT INTO State (StateCode,Name) VALUES ('261','Corn Belt');
INSERT INTO State (StateCode,Name) VALUES ('262','Soybean Belt');
INSERT INTO State (StateCode,Name) VALUES ('265','Cotton Belt');

INSERT INTO State (StateCode,Name) VALUES ('350','Spring Wheat Belt');
INSERT INTO State (StateCode,Name) VALUES ('356','Winter Wheat Belt');
INSERT INTO State (StateCode,Name) VALUES ('361','Corn Belt');
INSERT INTO State (StateCode,Name) VALUES ('362','Soybean Belt');
INSERT INTO State (StateCode,Name) VALUES ('365','Cotton Belt');

INSERT INTO State (StateCode,Name) VALUES ('450','Spring Wheat Belt');
INSERT INTO State (StateCode,Name) VALUES ('456','Winter Wheat Belt');
INSERT INTO State (StateCode,Name) VALUES ('461','Corn Belt');
INSERT INTO State (StateCode,Name) VALUES ('462','Soybean Belt');
INSERT INTO State (StateCode,Name) VALUES ('465','Cotton Belt');