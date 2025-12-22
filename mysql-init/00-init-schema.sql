-- Schema bootstrap for fresh MySQL volumes (VisiteHub / exped360_db)
-- This file intentionally contains *schema only* (no INSERTs).

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `exped360_db`;
USE `exped360_db`;

-- blog_posts
DROP TABLE IF EXISTS `blog_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_posts` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tags` mediumtext COLLATE utf8mb4_unicode_ci,
  `featuredImage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `featuredImagePublicId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `publishedAt` date NOT NULL,
  `seoTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoDescription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `seoKeywords` mediumtext COLLATE utf8mb4_unicode_ci,
  `canonicalUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `viewCount` int NOT NULL DEFAULT '0',
  `likeCount` int NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_5b2818a2c45c3edb9991b1c7a5` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- demandes
DROP TABLE IF EXISTS `demandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `demandes` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `propertyType` varchar(255) NOT NULL,
  `propertyLocation` varchar(255) NOT NULL,
  `propertyIntention` enum('sell','rent') NOT NULL,
  `message` text,
  `images` text,
  `whatsappContact` tinyint DEFAULT NULL,
  `emailContact` tinyint DEFAULT NULL,
  `status` enum('pending','processed','rejected') NOT NULL DEFAULT 'pending',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

-- favorite_properties
DROP TABLE IF EXISTS `favorite_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite_properties` (
  `id` varchar(36) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `userId` varchar(36) DEFAULT NULL,
  `propertyId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a2e3b36eef30c90929af3be31f7` (`userId`),
  KEY `FK_1cb1a5a847171963e956bb829dc` (`propertyId`),
  CONSTRAINT `FK_1cb1a5a847171963e956bb829dc` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`),
  CONSTRAINT `FK_a2e3b36eef30c90929af3be31f7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

-- featured_properties
DROP TABLE IF EXISTS `featured_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `featured_properties` (
  `id` varchar(36) NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `propertyId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_5d1fc39b16407d2e9b72f60019` (`propertyId`),
  KEY `IDX_featured_properties_order` (`order`),
  CONSTRAINT `FK_5d1fc39b16407d2e9b72f60019c` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

-- homepage_carousel_images
DROP TABLE IF EXISTS `homepage_carousel_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homepage_carousel_images` (
  `id` varchar(36) NOT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `linkUrl` varchar(255) DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `isActive` tinyint NOT NULL DEFAULT '1',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_homepage_carousel_order` (`order`),
  KEY `IDX_homepage_carousel_active` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

-- homepage_settings
DROP TABLE IF EXISTS `homepage_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homepage_settings` (
  `id` varchar(36) NOT NULL,
  `heroTitle` varchar(255) DEFAULT NULL,
  `heroSubtitle` varchar(255) DEFAULT NULL,
  `heroDescription` text,
  `heroButtonText` varchar(255) DEFAULT NULL,
  `heroButtonLink` varchar(255) DEFAULT NULL,
  `featuredSectionTitle` varchar(255) DEFAULT NULL,
  `featuredSectionSubtitle` varchar(255) DEFAULT NULL,
  `blogSectionTitle` varchar(255) DEFAULT NULL,
  `blogSectionSubtitle` varchar(255) DEFAULT NULL,
  `contactSectionTitle` varchar(255) DEFAULT NULL,
  `contactSectionSubtitle` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

-- agences
DROP TABLE IF EXISTS `agences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agences` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `wilaya` varchar(255) DEFAULT NULL,
  `daira` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `coverImage` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_agences_name` (`name`),
  UNIQUE KEY `IDX_agences_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- promoteurs
DROP TABLE IF EXISTS `promoteurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promoteurs` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `email` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `wilaya` varchar(255) DEFAULT NULL,
  `daira` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `coverImage` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_promoteurs_name` (`name`),
  UNIQUE KEY `IDX_promoteurs_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- projects
DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` varchar(36) NOT NULL,
  `promoteurId` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `wilaya` varchar(255) NOT NULL DEFAULT '',
  `daira` varchar(255) NOT NULL DEFAULT '',
  `address` varchar(255) DEFAULT NULL,
  `status` enum('completed','construction','planning','suspended') NOT NULL DEFAULT 'planning',
  `coverImage` text,
  `totalUnits` int DEFAULT NULL,
  `availableUnits` int DEFAULT NULL,
  `deliveryDate` varchar(255) DEFAULT NULL,
  `floorsCount` int DEFAULT NULL,
  `unitsPerFloor` int DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_projects_promoteurId` (`promoteurId`),
  CONSTRAINT `FK_projects_promoteurId` FOREIGN KEY (`promoteurId`) REFERENCES `promoteurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

-- nearby_places
DROP TABLE IF EXISTS `nearby_places`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nearby_places` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `distance` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '📍' COMMENT 'Icon emoji or SVG filename (e.g., ''📍'' or ''bus.svg'')',
  `display_order` int DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `propertyId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_1a2f2c6f8bb2d2666048af97df1` (`propertyId`),
  CONSTRAINT `FK_1a2f2c6f8bb2d2666048af97df1` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

-- papers
DROP TABLE IF EXISTS `papers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `papers` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_de96795adbf4a34f3913160100` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

-- properties
DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `surface` float NOT NULL,
  `type` enum('apartment','villa','house','studio','terrain','commercial') NOT NULL DEFAULT 'apartment',
  `transactionType` enum('vendre','location') NOT NULL DEFAULT 'vendre',
  `viewCount` int NOT NULL DEFAULT '0',
  `bedrooms` int DEFAULT NULL,
  `bathrooms` int DEFAULT NULL,
  `apartmentType` varchar(255) DEFAULT NULL,
  `wilaya` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL DEFAULT 'Algeria',
  `daira` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `iframe360Link` text,
  `mainImage` varchar(500) DEFAULT NULL,
  `images` json DEFAULT NULL,
  `papers` json DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `amenitiesId` varchar(36) DEFAULT NULL,
  `etage` int DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `isFeatured` tinyint NOT NULL DEFAULT '0',
  `rentPeriod` enum('month','day') DEFAULT 'month' COMMENT 'Rent period for rental properties (month or day)',
  `price` varchar(255) NOT NULL,
  `propertyOwnerType` varchar(255) NOT NULL DEFAULT 'Particulier',
  `propertyOwnerName` varchar(255) DEFAULT NULL COMMENT 'Name of agency or promotion company (only for Agence immobilière or Promotion immobilière)',
  `projectId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_26ef3c0b3235eda05a1bb0125d` (`amenitiesId`),
  UNIQUE KEY `IDX_089e10e6f1282e7b4bd0c58263` (`slug`),
  UNIQUE KEY `idx_properties_slug` (`slug`),
  KEY `idx_properties_is_featured` (`isFeatured`),
  KEY `idx_properties_rent_period` (`rentPeriod`),
  KEY `idx_properties_owner_type` (`propertyOwnerType`),
  CONSTRAINT `FK_26ef3c0b3235eda05a1bb0125d0` FOREIGN KEY (`amenitiesId`) REFERENCES `property_amenities` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

-- property_amenities
DROP TABLE IF EXISTS `property_amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_amenities` (
  `id` varchar(36) NOT NULL,
  `educationMaternal` tinyint NOT NULL DEFAULT '0',
  `educationPrimere` tinyint NOT NULL DEFAULT '0',
  `educationCollege` tinyint NOT NULL DEFAULT '0',
  `educationLycee` tinyint NOT NULL DEFAULT '0',
  `educationUniversite` tinyint NOT NULL DEFAULT '0',
  `educationEspaceDeLoisir` tinyint NOT NULL DEFAULT '0',
  `medicalsHopital` tinyint NOT NULL DEFAULT '0',
  `medicalsPharmacie` tinyint NOT NULL DEFAULT '0',
  `medicalsClinique` tinyint NOT NULL DEFAULT '0',
  `medicalsLaboratoire` tinyint NOT NULL DEFAULT '0',
  `loisirParc` tinyint NOT NULL DEFAULT '0',
  `loisirGym` tinyint NOT NULL DEFAULT '0',
  `loisirBibliotheque` tinyint NOT NULL DEFAULT '0',
  `loisirTheatre` tinyint NOT NULL DEFAULT '0',
  `loisirTerrains` tinyint NOT NULL DEFAULT '0',
  `loisirMall` tinyint NOT NULL DEFAULT '0',
  `transportBus` tinyint NOT NULL DEFAULT '0',
  `transportTrameway` tinyint NOT NULL DEFAULT '0',
  `transportMetro` tinyint NOT NULL DEFAULT '0',
  `transportTrain` tinyint NOT NULL DEFAULT '0',
  `internParking` tinyint NOT NULL DEFAULT '0',
  `internGarageIndividuel` tinyint NOT NULL DEFAULT '0',
  `internParkingCollectif` tinyint NOT NULL DEFAULT '0',
  `internJardin` tinyint NOT NULL DEFAULT '0',
  `internPiscine` tinyint NOT NULL DEFAULT '0',
  `internLoisir` tinyint NOT NULL DEFAULT '0',
  `internSafe` tinyint NOT NULL DEFAULT '0',
  `internCamera` tinyint NOT NULL DEFAULT '0',
  `internPolice` tinyint NOT NULL DEFAULT '0',
  `internInfirmerie` tinyint NOT NULL DEFAULT '0',
  `internAscenseurs` tinyint NOT NULL DEFAULT '0',
  `internGym` tinyint NOT NULL DEFAULT '0',
  `descriptionAccomodité` text,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

-- property_images
DROP TABLE IF EXISTS `property_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_images` (
  `id` varchar(36) NOT NULL,
  `iframeLink` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `propertyId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_7a07b6b7f9418bf1d5160106694` (`propertyId`),
  CONSTRAINT `FK_7a07b6b7f9418bf1d5160106694` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

-- property_papers
DROP TABLE IF EXISTS `property_papers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_papers` (
  `propertiesId` varchar(36) NOT NULL,
  `papersId` varchar(36) NOT NULL,
  PRIMARY KEY (`propertiesId`,`papersId`),
  KEY `IDX_9d4a2f9a45eecfd64992708654` (`propertiesId`),
  KEY `IDX_97e256ee0b7499fcc9c3ef8d8a` (`papersId`),
  CONSTRAINT `FK_97e256ee0b7499fcc9c3ef8d8ab` FOREIGN KEY (`papersId`) REFERENCES `papers` (`id`),
  CONSTRAINT `FK_9d4a2f9a45eecfd649927086548` FOREIGN KEY (`propertiesId`) REFERENCES `properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

-- users
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `type` enum('admin','user','agent') NOT NULL DEFAULT 'user',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

-- visit_events
DROP TABLE IF EXISTS `visit_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visit_events` (
  `id` varchar(36) NOT NULL,
  `sessionId` varchar(255) DEFAULT NULL,
  `userAgent` varchar(255) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `wilaya` varchar(255) DEFAULT NULL,
  `daira` varchar(255) DEFAULT NULL,
  `durationSeconds` int DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `propertyId` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_visit_property` (`propertyId`),
  CONSTRAINT `FK_ff012aba464a60a73b81672b8ef` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
