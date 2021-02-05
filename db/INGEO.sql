-- MySQL dump 10.13  Distrib 8.0.22, for macos10.15 (x86_64)
--
-- Host: localhost    Database: INGEO
-- ------------------------------------------------------
-- Server version	8.0.22

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
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `idArticles` int NOT NULL AUTO_INCREMENT,
  `title` tinytext CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `short_description` tinytext CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `html_content` longtext CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `img_path` tinytext CHARACTER SET utf8 COLLATE utf8_spanish_ci,
  `in_carousel` tinyint(1) NOT NULL DEFAULT '0',
  `in_news` tinyint(1) NOT NULL DEFAULT '0',
  `in_highlight` tinyint(1) NOT NULL DEFAULT '0',
  `keywords` text CHARACTER SET utf8 COLLATE utf8_spanish_ci,
  `publish_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` int NOT NULL,
  `sectorId` int NOT NULL,
  PRIMARY KEY (`idArticles`),
  KEY `sectorId_idx` (`sectorId`),
  KEY `userFK_idx` (`userId`),
  CONSTRAINT `sectorFK` FOREIGN KEY (`sectorId`) REFERENCES `sectors` (`idSectors`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userFK` FOREIGN KEY (`userId`) REFERENCES `users` (`idUsers`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sectors`
--

DROP TABLE IF EXISTS `sectors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sectors` (
  `idSectors` int NOT NULL AUTO_INCREMENT,
  `sector_category` tinytext CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `sector_name` tinytext CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`idSectors`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sectors`
--

LOCK TABLES `sectors` WRITE;
/*!40000 ALTER TABLE `sectors` DISABLE KEYS */;
/*!40000 ALTER TABLE `sectors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `idUsers` int NOT NULL AUTO_INCREMENT,
  `usr_name` varchar(64) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `usr_password` char(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `usr_password_salt` char(8) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `email` tinytext CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `first_name` tinytext CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `last_name` tinytext CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  `degree` tinytext CHARACTER SET utf8 COLLATE utf8_spanish_ci,
  `profile_img` tinytext CHARACTER SET utf8 COLLATE utf8_spanish_ci,
  `short_ description` tinytext CHARACTER SET utf8 COLLATE utf8_spanish_ci,
  `phone_number` tinytext CHARACTER SET utf8 COLLATE utf8_spanish_ci,
  `web_link` tinytext CHARACTER SET utf8 COLLATE utf8_spanish_ci,
  `first_time` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idUsers`),
  UNIQUE KEY `usr_name_UNIQUE` (`usr_name`),
  UNIQUE KEY `usr_password_salt_UNIQUE` (`usr_password_salt`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','12684dff28c6cf97e2067243bacbea07e1a2df777fbaedba0d6a5b448f188e57','fayv5xr5','juanmapintor@unsj-cuim.edu.ar','Juan Manuel','Pintor Ejarque',1,NULL,NULL,NULL,NULL,NULL,0),(2,'user','846ec57e1d6d3999798bfddb39de19c08e6a74ec17705d88b7314dd4a7694e48','abcdefgh','mail@mail.mail','Nombre','Apellido',0,NULL,NULL,NULL,NULL,NULL,0),(25,'U8HJzATO','b15a9452fa040d5bcd6527f7ffed89cca4bea4987ce95721019e47b4192c6cc0','8m5q3lpd','juanmapintor22@gmail.com','Nombre','Apellido',1,NULL,NULL,NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_sectors`
--

DROP TABLE IF EXISTS `users_sectors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_sectors` (
  `userId` int NOT NULL,
  `sectorsId` int NOT NULL,
  PRIMARY KEY (`userId`,`sectorsId`),
  KEY `sectorFK_idx` (`sectorsId`),
  CONSTRAINT `sector` FOREIGN KEY (`sectorsId`) REFERENCES `sectors` (`idSectors`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user` FOREIGN KEY (`userId`) REFERENCES `users` (`idUsers`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_sectors`
--

LOCK TABLES `users_sectors` WRITE;
/*!40000 ALTER TABLE `users_sectors` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_sectors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-04 22:32:30
