-- Fix mojibake (UTF-8 bytes interpreted/stored as Latin1-like text)
-- Safe-ish: only touches fields that contain typical mojibake markers.

USE exped360_db;

-- 1) Scan for mojibake markers across all text-ish columns
DROP TEMPORARY TABLE IF EXISTS encoding_issues;
CREATE TEMPORARY TABLE encoding_issues (
  table_name VARCHAR(128) NOT NULL,
  column_name VARCHAR(128) NOT NULL,
  bad_count BIGINT NOT NULL,
  sample VARCHAR(255) NULL
) ENGINE=InnoDB;

DELIMITER //
DROP PROCEDURE IF EXISTS scan_encoding_issues//
CREATE PROCEDURE scan_encoding_issues()
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE t VARCHAR(128);
  DECLARE c VARCHAR(128);

  DECLARE cur CURSOR FOR
    SELECT TABLE_NAME, COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND DATA_TYPE IN ('varchar','text','tinytext','mediumtext','longtext')
      AND TABLE_NAME NOT LIKE 'encoding_issues';

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN cur;
  read_loop: LOOP
    FETCH cur INTO t, c;
    IF done = 1 THEN
      LEAVE read_loop;
    END IF;

    SET @stmt = CONCAT(
      "INSERT INTO encoding_issues(table_name, column_name, bad_count, sample) ",
      "SELECT ",
      QUOTE(t), ", ", QUOTE(c), ", ",
      "COUNT(*), ",
      "SUBSTRING(MIN(`", c, "`), 1, 200) ",
      "FROM `", t, "` ",
      "WHERE LOCATE(0xC383, CONVERT(`", c, "` USING BINARY)) > 0 ",
      "OR LOCATE(0xC382, CONVERT(`", c, "` USING BINARY)) > 0 ",
      "OR LOCATE(0xC3A2, CONVERT(`", c, "` USING BINARY)) > 0;"
    );

    PREPARE s FROM @stmt;
    EXECUTE s;
    DEALLOCATE PREPARE s;
  END LOOP;
  CLOSE cur;
END//
DELIMITER ;

CALL scan_encoding_issues();

SELECT table_name, column_name, bad_count, sample
FROM encoding_issues
WHERE bad_count > 0
ORDER BY bad_count DESC, table_name, column_name;

DROP PROCEDURE scan_encoding_issues;

-- 2) Apply fix only where mojibake markers exist
DELIMITER //
DROP PROCEDURE IF EXISTS fix_mojibake//
CREATE PROCEDURE fix_mojibake()
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE t VARCHAR(128);
  DECLARE c VARCHAR(128);

  DECLARE cur CURSOR FOR
    SELECT TABLE_NAME, COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND DATA_TYPE IN ('varchar','text','tinytext','mediumtext','longtext');

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN cur;
  read_loop: LOOP
    FETCH cur INTO t, c;
    IF done = 1 THEN
      LEAVE read_loop;
    END IF;

    -- Reversible repair for strings like "DÃ©cision" => "Décision"
    SET @stmt = CONCAT(
      "UPDATE `", t, "` ",
      "SET `", c, "` = CONVERT(CAST(CONVERT(`", c, "` USING latin1) AS BINARY) USING utf8mb4) ",
      "WHERE LOCATE(0xC383, CONVERT(`", c, "` USING BINARY)) > 0 ",
      "OR LOCATE(0xC382, CONVERT(`", c, "` USING BINARY)) > 0 ",
      "OR LOCATE(0xC3A2, CONVERT(`", c, "` USING BINARY)) > 0;"
    );

    PREPARE s FROM @stmt;
    EXECUTE s;
    DEALLOCATE PREPARE s;
  END LOOP;
  CLOSE cur;
END//
DELIMITER ;

CALL fix_mojibake();
DROP PROCEDURE fix_mojibake;

-- 3) Post-scan: show anything still containing literal '??' (cannot be auto-restored reliably)
DROP TEMPORARY TABLE IF EXISTS interrogation_issues;
CREATE TEMPORARY TABLE interrogation_issues (
  table_name VARCHAR(128) NOT NULL,
  column_name VARCHAR(128) NOT NULL,
  bad_count BIGINT NOT NULL,
  sample VARCHAR(255) NULL
) ENGINE=InnoDB;

DELIMITER //
DROP PROCEDURE IF EXISTS scan_double_question//
CREATE PROCEDURE scan_double_question()
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE t VARCHAR(128);
  DECLARE c VARCHAR(128);

  DECLARE cur CURSOR FOR
    SELECT TABLE_NAME, COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND DATA_TYPE IN ('varchar','text','tinytext','mediumtext','longtext');

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN cur;
  read_loop: LOOP
    FETCH cur INTO t, c;
    IF done = 1 THEN
      LEAVE read_loop;
    END IF;

    SET @stmt = CONCAT(
      "INSERT INTO interrogation_issues(table_name, column_name, bad_count, sample) ",
      "SELECT ",
      QUOTE(t), ", ", QUOTE(c), ", ",
      "COUNT(*), ",
      "SUBSTRING(MIN(`", c, "`), 1, 200) ",
      "FROM `", t, "` ",
      "WHERE `", c, "` LIKE '%??%';"
    );

    PREPARE s FROM @stmt;
    EXECUTE s;
    DEALLOCATE PREPARE s;
  END LOOP;
  CLOSE cur;
END//
DELIMITER ;

CALL scan_double_question();

SELECT table_name, column_name, bad_count, sample
FROM interrogation_issues
WHERE bad_count > 0
ORDER BY bad_count DESC, table_name, column_name;

DROP PROCEDURE scan_double_question;
