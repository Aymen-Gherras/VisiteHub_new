-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: exped360_db
-- ------------------------------------------------------
-- Server version	8.0.44

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

--
-- Table structure for table `agences`
--

DROP TABLE IF EXISTS `agences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agences` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneNumber` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wilaya` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `daira` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coverImage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_952a686215e4d5b32db255b356` (`name`),
  UNIQUE KEY `IDX_c6f59fd7a10d61ee76f638cd46` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agences`
--

LOCK TABLES `agences` WRITE;
/*!40000 ALTER TABLE `agences` DISABLE KEYS */;
INSERT INTO `agences` VALUES ('f637bac8-b406-4402-8d2c-0099df247a33','Aymene Agence','aymene-agence','','gherrasaymen14@gmail.com','+213796114775','maraval','31 - Oran','Bir El Djir','https://agence.com','http://localhost:4001/uploads/1766327644508-578066277.jpg','http://localhost:4001/uploads/1766327648684-846611291.jpg','2025-12-21 14:34:17.620664','2025-12-21 14:34:17.620664');
/*!40000 ALTER TABLE `agences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_posts`
--

DROP TABLE IF EXISTS `blog_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_posts` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Équipe Exped360',
  `tags` text COLLATE utf8mb4_unicode_ci,
  `featuredImage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `featuredImagePublicId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `publishedAt` date NOT NULL,
  `seoTitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seoDescription` text COLLATE utf8mb4_unicode_ci,
  `seoKeywords` text COLLATE utf8mb4_unicode_ci,
  `canonicalUrl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `viewCount` int NOT NULL DEFAULT '0',
  `likeCount` int NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_5b2818a2c45c3edb9991b1c7a5` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_posts`
--

LOCK TABLES `blog_posts` WRITE;
/*!40000 ALTER TABLE `blog_posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_click_events`
--

DROP TABLE IF EXISTS `contact_click_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_click_events` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('PHONE','WHATSAPP') COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `propertyId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_contact_click_property` (`propertyId`),
  KEY `idx_contact_click_type` (`type`),
  CONSTRAINT `FK_2d0e0b8f34505a611ba7f81363b` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_click_events`
--

LOCK TABLES `contact_click_events` WRITE;
/*!40000 ALTER TABLE `contact_click_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_click_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `demandes`
--

DROP TABLE IF EXISTS `demandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `demandes` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propertyType` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `propertyLocation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `propertyIntention` enum('sell','rent') COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `images` text COLLATE utf8mb4_unicode_ci,
  `whatsappContact` tinyint DEFAULT NULL,
  `emailContact` tinyint DEFAULT NULL,
  `status` enum('pending','processed','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `demandes`
--

LOCK TABLES `demandes` WRITE;
/*!40000 ALTER TABLE `demandes` DISABLE KEYS */;
/*!40000 ALTER TABLE `demandes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `featured_properties`
--

DROP TABLE IF EXISTS `featured_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `featured_properties` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `propertyId` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` int NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_89902f635d63bc032e4d96ac7f` (`propertyId`),
  KEY `IDX_ffa9b6aa179e1077e02d4a4176` (`position`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `featured_properties`
--

LOCK TABLES `featured_properties` WRITE;
/*!40000 ALTER TABLE `featured_properties` DISABLE KEYS */;
INSERT INTO `featured_properties` VALUES ('a9e6a248-d587-4b47-b0dc-62c2f8efa0da','bcb1a501-f6a4-4346-a40f-41decd3a6831',1,'2025-12-22 08:56:19.282191','2025-12-22 08:56:19.282191');
/*!40000 ALTER TABLE `featured_properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `homepage_carousel_images`
--

DROP TABLE IF EXISTS `homepage_carousel_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homepage_carousel_images` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageUrl` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `altText` text COLLATE utf8mb4_unicode_ci,
  `linkUrl` text COLLATE utf8mb4_unicode_ci,
  `mediaType` enum('image','video') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'image',
  `order` int NOT NULL DEFAULT '0',
  `isActive` tinyint NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_homepage_carousel_order` (`order`),
  KEY `idx_homepage_carousel_is_active` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homepage_carousel_images`
--

LOCK TABLES `homepage_carousel_images` WRITE;
/*!40000 ALTER TABLE `homepage_carousel_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `homepage_carousel_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `homepage_settings`
--

DROP TABLE IF EXISTS `homepage_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homepage_settings` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `maxSlides` int NOT NULL DEFAULT '3',
  `maxFeatured` int NOT NULL DEFAULT '6',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homepage_settings`
--

LOCK TABLES `homepage_settings` WRITE;
/*!40000 ALTER TABLE `homepage_settings` DISABLE KEYS */;
INSERT INTO `homepage_settings` VALUES ('cc8d5c99-ab03-40d9-95c5-76f4ecf12d53',3,6,'2025-12-21 14:32:37.041493','2025-12-21 14:32:37.041493');
/*!40000 ALTER TABLE `homepage_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nearby_places`
--

DROP TABLE IF EXISTS `nearby_places`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nearby_places` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `distance` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `display_order` int NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `property_id` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_nearby_places_display_order` (`property_id`,`display_order`),
  CONSTRAINT `FK_3594c485ff8d128949a0d448fc3` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nearby_places`
--

LOCK TABLES `nearby_places` WRITE;
/*!40000 ALTER TABLE `nearby_places` DISABLE KEYS */;
INSERT INTO `nearby_places` VALUES ('67d8c674-df1d-11f0-b44f-7e02cf9c40cd','Arret de bus','250 m','008-bus-2.svg',0,'2025-12-22 10:03:03.779769','2025-12-22 10:03:03.779769','96cf8cbe-db29-4add-80de-bdd19148a899'),('be55b727-de7a-11f0-9f03-e2ed745550b7','ecole','200 m','📍',0,'2025-12-21 14:38:40.915756','2025-12-21 14:38:40.915756','bcb1a501-f6a4-4346-a40f-41decd3a6831');
/*!40000 ALTER TABLE `nearby_places` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `papers`
--

DROP TABLE IF EXISTS `papers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `papers` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_de96795adbf4a34f3913160100` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `papers`
--

LOCK TABLES `papers` WRITE;
/*!40000 ALTER TABLE `papers` DISABLE KEYS */;
INSERT INTO `papers` VALUES ('2ac38157-54c1-4453-9b47-e3581c2b2d64','Décision','2025-12-21 14:38:40.849276','2025-12-21 14:38:40.849276'),('f1346ab6-4cae-4087-8924-6f9a27fcda2a','Acte notarié','2025-12-21 14:38:40.859967','2025-12-21 14:38:40.859967');
/*!40000 ALTER TABLE `papers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `promoteurId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `wilaya` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `daira` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('completed','construction','planning','suspended') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'planning',
  `coverImage` text COLLATE utf8mb4_unicode_ci,
  `totalUnits` int DEFAULT NULL,
  `availableUnits` int DEFAULT NULL,
  `deliveryDate` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `floorsCount` int DEFAULT NULL,
  `unitsPerFloor` int DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_7ba826c4fd4881fa81c1ef8376` (`promoteurId`),
  CONSTRAINT `FK_7ba826c4fd4881fa81c1ef83762` FOREIGN KEY (`promoteurId`) REFERENCES `promoteurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES ('ef217ab7-da2c-4726-acee-0c8f8af56129','48e3b1fd-0b52-453e-9d98-f5bd92952854','Residence Boutlelis','residence-boutlelis','Residence Boutlelis','31 - Oran','Boutlelis','Residence Boutlelis','planning','http://localhost:4001/uploads/1766327755719-74832701.jpg',NULL,NULL,NULL,NULL,NULL,'2025-12-21 14:35:57.370596','2025-12-21 14:35:57.370596');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promoteurs`
--

DROP TABLE IF EXISTS `promoteurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promoteurs` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phoneNumber` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wilaya` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `daira` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coverImage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_a1a277c5ec247eb245909ae87c` (`name`),
  UNIQUE KEY `IDX_13d6160435aabfded67127a01f` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promoteurs`
--

LOCK TABLES `promoteurs` WRITE;
/*!40000 ALTER TABLE `promoteurs` DISABLE KEYS */;
INSERT INTO `promoteurs` VALUES ('48e3b1fd-0b52-453e-9d98-f5bd92952854','Aymene Promoteur','aymene-promoteur','','gherrasaymen14@gmail.com','+213796114775','maraval','31 - Oran','Boutlelis','https://promoteur.com','http://localhost:4001/uploads/1766327708036-785652579.jpg','http://localhost:4001/uploads/1766327710751-920442340.jpg','2025-12-21 14:35:12.477788','2025-12-21 14:35:12.477788');
/*!40000 ALTER TABLE `promoteurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `surface` float NOT NULL,
  `type` enum('apartment','villa','house','studio','terrain','commercial') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'apartment',
  `transactionType` enum('vendre','location') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'vendre',
  `price` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `viewCount` int NOT NULL DEFAULT '0',
  `bedrooms` int DEFAULT NULL,
  `bathrooms` int DEFAULT NULL,
  `apartmentType` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `etage` int DEFAULT NULL,
  `wilaya` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Algeria',
  `daira` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `iframe360Link` text COLLATE utf8mb4_unicode_ci,
  `mainImage` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `images` json DEFAULT NULL,
  `papers` json DEFAULT NULL,
  `phoneNumber` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isFeatured` tinyint NOT NULL DEFAULT '0',
  `rentPeriod` enum('month','day') COLLATE utf8mb4_unicode_ci DEFAULT 'month' COMMENT 'Rent period for rental properties (month or day)',
  `propertyOwnerType` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Particulier',
  `propertyOwnerName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `projectId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_089e10e6f1282e7b4bd0c58263` (`slug`),
  UNIQUE KEY `idx_properties_slug` (`slug`),
  KEY `IDX_9dbad469241c6af1508d1dae0a` (`isFeatured`),
  KEY `IDX_43ea3aa0848332841c89a6da9d` (`createdAt`),
  KEY `IDX_2fd1bae8559fceb2dc9eea7bd6` (`price`),
  KEY `IDX_4960ebde3c85fa68d93e56e7a7` (`type`),
  KEY `IDX_d3d510ec8b7b4833a8d80eef33` (`transactionType`),
  KEY `IDX_33281726ddb65cf1ed50e38228` (`daira`),
  KEY `IDX_e00d585fa22cf9212dc4997b9d` (`wilaya`),
  KEY `idx_properties_is_featured` (`isFeatured`),
  KEY `idx_properties_rent_period` (`rentPeriod`),
  KEY `idx_properties_owner_type` (`propertyOwnerType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES ('96cf8cbe-db29-4add-80de-bdd19148a899','Test 2','Maison',200,'house','vendre','200',60,3,NULL,NULL,1,'16 - Alger','Algeria','El Harrach','El Harrach',NULL,NULL,'','http://localhost:4001/uploads/1766397771540-486030430.jpg','[\"http://localhost:4001/uploads/1766397778909-748130634.jpg\", \"http://localhost:4001/uploads/1766397778965-130860911.jpg\"]','[\"Décision\", \"Acte notarié\"]','+21396114775','test-2',0,'month','Promotion immobilière','Aymene Promoteur','ef217ab7-da2c-4726-acee-0c8f8af56129','2025-12-22 10:03:03.714080','2025-12-22 10:30:07.000000'),('bcb1a501-f6a4-4346-a40f-41decd3a6831','Test 1','Test',100,'apartment','vendre','100',3,3,NULL,NULL,2,'31 - Oran','Algeria','Bir El Djir','Bir El Djir',NULL,NULL,'','http://localhost:4001/uploads/1766327905632-752228286.jpg','[\"http://localhost:4001/uploads/1766327909868-254425117.jpg\", \"http://localhost:4001/uploads/1766327913336-304823018.jpg\"]','[\"Décision\", \"Acte notarié\"]','+213796114775','test-1',1,'month','Agence immobilière','Aymene Agence',NULL,'2025-12-21 14:38:40.867249','2025-12-22 10:34:31.000000');
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('admin','user','agent') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('078dbed3-9027-4755-ae5f-0c823418b262','Yacine','Fsr','Yacine.fsr@gmail.com','$2b$10$8xAesxyrQUHHvX.xhw8zJeC6XvKFcqaASJtavA2Husi1uz2lbxGkO','+213123456789','admin','2025-12-22 09:39:21.842247','2025-12-22 09:58:49.609596');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visit_events`
--

DROP TABLE IF EXISTS `visit_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visit_events` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sessionId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wilaya` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `daira` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `durationSeconds` int DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `propertyId` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_visit_property` (`propertyId`),
  CONSTRAINT `FK_ff012aba464a60a73b81672b8ef` FOREIGN KEY (`propertyId`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visit_events`
--

LOCK TABLES `visit_events` WRITE;
/*!40000 ALTER TABLE `visit_events` DISABLE KEYS */;
INSERT INTO `visit_events` VALUES ('00cec82e-62f1-4a8d-8242-c865616d8c68','6b340248-1bb1-40c7-a9eb-a1bda262401a','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',5,'2025-12-22 10:28:55.909778','96cf8cbe-db29-4add-80de-bdd19148a899'),('0399029d-ab5d-4afc-9245-cc21c783f310','6b340248-1bb1-40c7-a9eb-a1bda262401a','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',11,'2025-12-22 10:29:01.675537','96cf8cbe-db29-4add-80de-bdd19148a899'),('08685073-b079-417e-8213-8a267cca14e1','abfd181c-5f79-4087-a1b0-6ec92c9186a6','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:44.579900','96cf8cbe-db29-4add-80de-bdd19148a899'),('0b851bbf-4e80-417a-a304-30f4f39bfabc','a04c95ca-6f14-4d95-b494-2c903bc72a11','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',5,'2025-12-22 10:04:02.254426','96cf8cbe-db29-4add-80de-bdd19148a899'),('0bcd8ebd-8247-4176-927e-799321faa634','009abe7f-7e0b-4e66-bcc6-288332551e12','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',3,'2025-12-22 10:20:52.442453','96cf8cbe-db29-4add-80de-bdd19148a899'),('0c646009-698f-49bd-883d-68df605bb164','bb8e2c1a-95ee-4ed7-988a-fc312495e220','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',70,'2025-12-22 10:30:11.762491','96cf8cbe-db29-4add-80de-bdd19148a899'),('12a480a4-dd5b-4291-a605-42dca4aa5484','a289edc6-5682-4356-83ae-6568453202f7','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',16,'2025-12-22 10:28:37.610669','96cf8cbe-db29-4add-80de-bdd19148a899'),('15178199-8cd0-4eb6-95f6-6351de9e87c7','19c11405-0699-440e-8ebc-2ce447d5e830','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:38.810577','96cf8cbe-db29-4add-80de-bdd19148a899'),('1fb5ed56-6fb8-4f4c-b5eb-64f99c87ecbf','677dc08c-9052-43d7-a1cf-618593ca2d06','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',32,'2025-12-22 10:05:29.816444','96cf8cbe-db29-4add-80de-bdd19148a899'),('24d4280b-db7c-4580-b1d6-689eb8d0c630','91214ebb-fd06-4f08-b1c7-6cac17e91f9c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',522,'2025-12-22 10:19:30.847010','96cf8cbe-db29-4add-80de-bdd19148a899'),('25648511-3ce6-4c2a-b1d9-450948367d13','6ade3402-f8a1-4d0c-bbfa-f05565977b76','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',6,'2025-12-22 10:03:53.835842','96cf8cbe-db29-4add-80de-bdd19148a899'),('2b0c28d1-cd39-42c6-b297-dab4418d4b07','cf93b3f2-4a5f-49ed-bd60-3a8ea61b350f','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:41.206243','96cf8cbe-db29-4add-80de-bdd19148a899'),('2bcd7acc-845a-4653-8e9f-abf56e67171b','86020e38-b8d4-4a41-a680-c02c3c24467e','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',4,'2025-12-22 10:05:39.001045','96cf8cbe-db29-4add-80de-bdd19148a899'),('3083ccd0-d79c-4e71-96b1-eea9678bddec','7f57de3e-05e3-44a4-990f-0d6eda72d191','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',30,'2025-12-22 10:20:05.866222','96cf8cbe-db29-4add-80de-bdd19148a899'),('3305f728-17a6-4faf-bdb5-c103582f4586','a2aa85d8-49ca-473d-94a4-d623ee87c80b','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'31 - Oran','Bir El Djir',21,'2025-12-22 10:34:52.982168','bcb1a501-f6a4-4346-a40f-41decd3a6831'),('338069a2-817a-47dc-80b7-4953e310ca6d','78d82a12-1448-41fe-8f89-f6e627d9f910','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:41.560934','96cf8cbe-db29-4add-80de-bdd19148a899'),('383e9931-938c-4c18-9b42-04da35cceb05','8b732cba-cbe8-4cef-9324-49e15e22762c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'31 - Oran','Bir El Djir',33,'2025-12-22 09:02:53.757280','bcb1a501-f6a4-4346-a40f-41decd3a6831'),('389428e8-a552-48aa-a4f5-413e1deae4d8','bb97077f-633d-4cf7-8fd6-69cada97563d','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:40.692751','96cf8cbe-db29-4add-80de-bdd19148a899'),('3e261357-1310-4bbd-9345-547951f69c93','80612bb0-8126-4fcb-b623-e9d20625649b','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:39.032977','96cf8cbe-db29-4add-80de-bdd19148a899'),('4072c9e6-d8dc-4a9f-bb17-84b8c83553a3','bb8e2c1a-95ee-4ed7-988a-fc312495e220','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',24,'2025-12-22 10:29:25.925748','96cf8cbe-db29-4add-80de-bdd19148a899'),('4320fb7a-51ed-44c8-9ec2-1c9d4209e987','ce31e176-3f65-4b3a-b984-4752cb27abfe','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:41.382902','96cf8cbe-db29-4add-80de-bdd19148a899'),('4bb9aa09-0980-4ef6-8359-544939ea97c3','bb8e2c1a-95ee-4ed7-988a-fc312495e220','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',37,'2025-12-22 10:29:38.632892','96cf8cbe-db29-4add-80de-bdd19148a899'),('4e41a3a6-9e63-4a03-9b00-bc9f71a208e1','b923d77b-69b4-4cf9-8fb1-29a05c73742b','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',4,'2025-12-22 10:20:36.135285','96cf8cbe-db29-4add-80de-bdd19148a899'),('51e32189-da0a-49fe-9bbc-7bdb75584d6c','96bb26d3-009f-4645-bd5d-f04d64d92b2f','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:20.622374','96cf8cbe-db29-4add-80de-bdd19148a899'),('5325a8d4-94eb-4066-95e9-9da80eaa4fa9','677dc08c-9052-43d7-a1cf-618593ca2d06','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',4,'2025-12-22 10:05:02.297191','96cf8cbe-db29-4add-80de-bdd19148a899'),('5c19255b-4954-4223-a8f6-33cb32f51fd2','b922301f-7872-41ea-83c5-962eca7e453d','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:41.730919','96cf8cbe-db29-4add-80de-bdd19148a899'),('5c42de22-73eb-4122-967f-f5718a551563','a6a20d69-e2c4-4d75-9ddc-da3277184a99','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',29,'2025-12-22 10:28:16.566590','96cf8cbe-db29-4add-80de-bdd19148a899'),('5c5bc0a9-7132-41fd-b885-3d4cdb7cbb6f','23278831-6f35-4f04-ab8c-9cfae4343484','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',5,'2025-12-22 10:20:17.542439','96cf8cbe-db29-4add-80de-bdd19148a899'),('61ddc7f4-7034-469c-b40c-91658ad36b95','7f57de3e-05e3-44a4-990f-0d6eda72d191','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',5,'2025-12-22 10:19:41.139559','96cf8cbe-db29-4add-80de-bdd19148a899'),('6204b0d3-7450-4f2f-afcc-e898417a3c3d','80cb0b9e-d182-4f49-a020-e295b52d11b0','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:39.279552','96cf8cbe-db29-4add-80de-bdd19148a899'),('6376a301-a32a-4f7c-95e9-6c7886d157af','91214ebb-fd06-4f08-b1c7-6cac17e91f9c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',14,'2025-12-22 10:11:02.379544','96cf8cbe-db29-4add-80de-bdd19148a899'),('65d1527f-6f13-4dae-961a-e57d3589ee6f','91214ebb-fd06-4f08-b1c7-6cac17e91f9c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',10,'2025-12-22 10:10:58.132424','96cf8cbe-db29-4add-80de-bdd19148a899'),('6a65d290-5483-4852-b101-a0a86ed0e280','4d142cba-8a25-4622-8405-579034455285','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:43.154381','96cf8cbe-db29-4add-80de-bdd19148a899'),('6d6227c2-49b5-4d52-935c-d3d7a6ece53f','bb8e2c1a-95ee-4ed7-988a-fc312495e220','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',4,'2025-12-22 10:29:05.283130','96cf8cbe-db29-4add-80de-bdd19148a899'),('71219240-8624-402c-b6d7-3282f8ef38c8','a4e59174-177e-4c2a-b964-fec742da4380','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:42.284084','96cf8cbe-db29-4add-80de-bdd19148a899'),('719a78e3-3202-4b06-8bc4-7d3dc2a8de12','a2aa85d8-49ca-473d-94a4-d623ee87c80b','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'31 - Oran','Bir El Djir',30,'2025-12-22 10:35:01.835338','bcb1a501-f6a4-4346-a40f-41decd3a6831'),('7ad7a26e-5148-443c-9fac-9b16106ba131','cc5a9fd1-d2b4-4e94-9735-c2b88516c87b','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',417,'2025-12-22 10:27:41.758681','96cf8cbe-db29-4add-80de-bdd19148a899'),('7cd92b91-ca0d-4b35-9050-c8ee0d898521','18bbd3b0-7637-4105-86ef-7de28ce08c93','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:44.166452','96cf8cbe-db29-4add-80de-bdd19148a899'),('7f637a67-197c-49bf-b612-17ca284ec75a','09c6121a-71d8-4def-a4b7-6294aa79e4c4','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',5,'2025-12-22 10:04:31.785569','96cf8cbe-db29-4add-80de-bdd19148a899'),('7fd94fe4-5844-439c-a372-cfe88a3b9187','c1a3f7d5-d363-40a8-bd2f-ec1e7ff6d386','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:39.539163','96cf8cbe-db29-4add-80de-bdd19148a899'),('8005bf3b-2672-46ee-8b4b-e15a48a278de','63113043-be63-4840-90eb-b74a23bb9271','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:39.849102','96cf8cbe-db29-4add-80de-bdd19148a899'),('82c18db3-79d9-4d06-96a7-d96e4cf19710','9369f1b0-1060-4346-93c6-7b3da83ac291','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:38.081037','96cf8cbe-db29-4add-80de-bdd19148a899'),('867c446c-80e9-4725-863f-e156e9d22880','cece30e4-8b91-4ed6-927c-6848450520b2','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:21.179844','96cf8cbe-db29-4add-80de-bdd19148a899'),('8c763971-7f17-4c9b-830b-3b8986476f28','f38e4cf8-23d1-4f97-be4f-227cc416e214','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:17.376342','96cf8cbe-db29-4add-80de-bdd19148a899'),('8cc8adbd-97d9-4a50-b39c-d4b4ef98c775','071ce639-c847-438f-aaf6-98994afaeb18','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',2,'2025-12-22 10:20:07.632239','96cf8cbe-db29-4add-80de-bdd19148a899'),('8da90079-2fef-402f-a492-0dc9a9373821','2a935e5d-f7a6-4442-bc12-eefecb59a1ac','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:43.512799','96cf8cbe-db29-4add-80de-bdd19148a899'),('8f38981c-3e9b-4aa3-ac30-a1bf64858cdf','8b732cba-cbe8-4cef-9324-49e15e22762c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'31 - Oran','Bir El Djir',75,'2025-12-22 09:03:35.206333','bcb1a501-f6a4-4346-a40f-41decd3a6831'),('92102197-b24a-4e8d-a577-058391b936e0','e7016da7-e9cb-476c-8ae3-e20f20961ee2','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',3,'2025-12-22 10:28:50.406908','96cf8cbe-db29-4add-80de-bdd19148a899'),('925ff620-782b-46b7-98dd-f27181cabc2c','c65138ec-e67a-4b1c-a19f-dee9074437d2','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:38.462846','96cf8cbe-db29-4add-80de-bdd19148a899'),('9622919a-0064-488c-b571-0c098153f15a','ed638d9d-e96b-4095-b945-3a6abf92711f','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:45.505526','96cf8cbe-db29-4add-80de-bdd19148a899'),('963463a6-bfb6-4adc-89ec-cf230885ce09','4802ae47-7ab6-4502-8e68-d53b7d5cb11b','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',4,'2025-12-22 10:04:52.732821','96cf8cbe-db29-4add-80de-bdd19148a899'),('9682617b-2794-4194-8138-d4ae2ba070db','5df96bb4-f30f-4468-882d-2fb55fbc8fbc','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:42.960463','96cf8cbe-db29-4add-80de-bdd19148a899'),('96be6d94-e69d-4fca-a8f4-447fab16162b','86020e38-b8d4-4a41-a680-c02c3c24467e','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',302,'2025-12-22 10:10:37.065684','96cf8cbe-db29-4add-80de-bdd19148a899'),('981f4e71-43aa-4c2e-9374-be7d134e7703','28e981b6-af53-4eba-ac2c-6f34f4abd4d5','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',5,'2025-12-22 10:04:43.375342','96cf8cbe-db29-4add-80de-bdd19148a899'),('98d68b2a-42ab-49ca-b5f5-179ff0b063a8','684dfe9a-32fe-4b29-997d-3fdb38bffce8','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',2,'2025-12-22 10:19:43.179413','96cf8cbe-db29-4add-80de-bdd19148a899'),('9932e77a-fb5b-4dc4-b5be-658da2c28e2f','8b732cba-cbe8-4cef-9324-49e15e22762c','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'31 - Oran','Bir El Djir',20,'2025-12-22 09:02:40.180102','bcb1a501-f6a4-4346-a40f-41decd3a6831'),('9a861a09-b517-4270-a627-3ce20182c836','e4191e68-19af-469a-9411-d2620464c91e','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',2,'2025-12-22 10:27:55.024982','96cf8cbe-db29-4add-80de-bdd19148a899'),('9db30be1-04c1-4df3-8c94-824517cb000d','a289edc6-5682-4356-83ae-6568453202f7','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:22.222176','96cf8cbe-db29-4add-80de-bdd19148a899'),('9fe88e44-6d44-4839-8c66-79752691ac3e','0de79d54-2415-4729-b118-6b827286d379','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:42.095740','96cf8cbe-db29-4add-80de-bdd19148a899'),('b06a2f80-c25d-4aab-937d-062098f385d2','dce29c05-4897-4fbb-b8c0-7152cac1a8a4','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:05:31.725958','96cf8cbe-db29-4add-80de-bdd19148a899'),('b198d1af-12af-4f31-b569-5c9d7f8cdd86','5d599dc7-3a5d-4c8b-9dc6-1d3eb9beffe2','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:40.328127','96cf8cbe-db29-4add-80de-bdd19148a899'),('c0a3754c-a9d1-446a-b3b6-9bd1387c0add','2c04c312-79c7-4b3e-a938-eeb090760c3b','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:05:30.582942','96cf8cbe-db29-4add-80de-bdd19148a899'),('c48d8802-e8c5-4750-ae42-20716efb0a3e','8aa44f18-dc1c-4632-89e1-de6aaa3627c6','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:40.510704','96cf8cbe-db29-4add-80de-bdd19148a899'),('c532c3c4-3c10-4f4b-81f9-22543877201b','cc5a9fd1-d2b4-4e94-9735-c2b88516c87b','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',4,'2025-12-22 10:20:48.831709','96cf8cbe-db29-4add-80de-bdd19148a899'),('c93b3076-a4d4-4d27-933d-94970d678beb','74293f23-1251-40a7-93bc-5cc0c9b984ee','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:40.099438','96cf8cbe-db29-4add-80de-bdd19148a899'),('cf04a5df-670a-46d6-af4d-cf0f011c67c5','99854e0a-940c-42a5-b36f-f15c9069c682','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:41.047237','96cf8cbe-db29-4add-80de-bdd19148a899'),('d1dd0564-dfaa-461b-9e0d-0e9e9fcd2ff7','b73ced76-2e4c-48c2-8419-49df363ba500','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:42.803861','96cf8cbe-db29-4add-80de-bdd19148a899'),('dc04b860-05b4-43d2-ae5b-abbb481753a9','98ac9ee6-992f-448a-a06c-856e7fed3b2e','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',5,'2025-12-22 10:03:22.929044','96cf8cbe-db29-4add-80de-bdd19148a899'),('e2cd8a84-80d7-43ee-8a8d-8c44b2709bc5','2fdb7b68-2c66-4283-8786-2d6328df69d0','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:41.909905','96cf8cbe-db29-4add-80de-bdd19148a899'),('e2de6ded-61c0-4380-a85f-fc8021c1b5de','86020e38-b8d4-4a41-a680-c02c3c24467e','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',312,'2025-12-22 10:10:47.001479','96cf8cbe-db29-4add-80de-bdd19148a899'),('e5e0d14d-082e-47cf-8c50-a78637cd344b','a6a20d69-e2c4-4d75-9ddc-da3277184a99','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',6,'2025-12-22 10:27:53.190991','96cf8cbe-db29-4add-80de-bdd19148a899'),('e83d0f58-efa3-4213-aa4a-4c8e3d21dc43','a1fe71ff-e219-470d-b25b-3b23fd472f3f','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:42.464926','96cf8cbe-db29-4add-80de-bdd19148a899'),('eab91362-659d-424e-a547-c9b109b53536','65896a20-1a08-4d47-a469-0c2cfe6dab4a','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:40.876943','96cf8cbe-db29-4add-80de-bdd19148a899'),('ef94b873-94aa-4b9c-bc17-1f38bdff9dd7','8e6b21cd-952d-499a-8d2e-bfc3d756e4d8','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',2,'2025-12-22 10:28:19.101124','96cf8cbe-db29-4add-80de-bdd19148a899'),('f3b688d1-aac8-4c7f-a0c2-318830271d3e','25ac378d-b86b-443d-bddf-a3f47c27497d','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',2,'2025-12-22 10:04:33.447127','96cf8cbe-db29-4add-80de-bdd19148a899'),('f565d97b-38a5-45c8-8909-9e0ed12cdc3d','a2aa85d8-49ca-473d-94a4-d623ee87c80b','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'31 - Oran','Bir El Djir',2,'2025-12-22 10:34:33.735926','bcb1a501-f6a4-4346-a40f-41decd3a6831'),('f59e4517-33ef-4ddd-b857-04670822eb6f','e9e924b0-03a7-466b-a286-c95fcc6dac24','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:20.852604','96cf8cbe-db29-4add-80de-bdd19148a899'),('f770d912-57af-4f89-be8f-1e77ab63f588','480f71c3-6df6-434c-a70d-5fa622973d5d','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',1,'2025-12-22 10:28:44.344548','96cf8cbe-db29-4add-80de-bdd19148a899'),('fab62285-5080-4f72-bd63-94aaf53915ab','dac61017-b0ab-4bf9-add0-837e06154b87','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'31 - Oran','Bir El Djir',3,'2025-12-22 08:56:37.341913','bcb1a501-f6a4-4346-a40f-41decd3a6831'),('ffe59a7c-601c-4bbd-bd70-cf7d40c7bee9','1a05c8ce-29ee-4f5c-8e70-f326f7d917df','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0',NULL,'16 - Alger','El Harrach',4,'2025-12-22 10:20:25.815704','96cf8cbe-db29-4add-80de-bdd19148a899');
/*!40000 ALTER TABLE `visit_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'exped360_db'
--

--
-- Dumping routines for database 'exped360_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-22 19:07:30
