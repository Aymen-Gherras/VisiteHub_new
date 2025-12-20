-- Creates a table to track raw contact button clicks per property
-- Used for: phone clicks + WhatsApp clicks

CREATE TABLE IF NOT EXISTS contact_click_events (
  id CHAR(36) NOT NULL,
  propertyId CHAR(36) NOT NULL,
  type ENUM('PHONE', 'WHATSAPP') NOT NULL,
  createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_contact_click_property (propertyId),
  KEY idx_contact_click_type (type),
  CONSTRAINT fk_contact_click_property
    FOREIGN KEY (propertyId)
    REFERENCES properties(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
