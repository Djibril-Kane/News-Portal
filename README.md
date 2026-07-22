# News Portal

Site d'actualité.

Le projet comprend trois parties :
1. **Site Web** (frontend + backend) avec gestion de rôles (Visiteur / Éditeur / Administrateur)
2. **Services Web** (SOAP + REST) exposant les fonctionnalités métier
3. **Application Client Java** consommant le service SOAP pour la gestion des utilisateurs

## Stack technique

| Composant | Technologie |
|---|---|
| Frontend | Next.js (React) |
| Backend / API / SOAP / REST | Spring Boot (Java) |
| Base de données | MySQL |
| ORM | Spring Data JPA |
| Authentification | Spring Security + JWT |
| Application client | Java (Swing) |

## Structure du dépôt

```
/backend       → Spring Boot (site web + SOAP + REST)
/frontend      → Next.js
/client-app    → Application Java de gestion des utilisateurs
```

## Prérequis

- Java 17+ et Maven
- Node.js 18+ et npm
- MySQL (local ou via WAMP/MAMP) avec une base `news_portal` créée

## Configuration de la base de données

Dans `backend/src/main/resources/application.properties`, adapter si besoin :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/news_portal
spring.datasource.username=root
spring.datasource.password=
```

## Lancement du projet

### Backend
```bash
cd backend
mvn spring-boot:run
```
Démarre sur `http://localhost:8080`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Démarre sur `http://localhost:3000`.

### Application Client Java
```bash
cd client-app
mvn compile exec:java
```

## Rôles (RBAC)

| Rôle | Droits |
|---|---|
| Visiteur | Consulter les articles |
| Éditeur | + gérer articles et catégories |
| Administrateur | + gérer les utilisateurs et les jetons d'authentification des services web |