# FFK - Évaluation Technique Backend (Lead Tech)

## Description
API de gestion d'utilisateurs développée dans le cadre du processus de recrutement **Lead Tech** chez **FARAFINAH KANU (FFK)**.

Cette API implémente toutes les fonctionnalités demandées avec une architecture propre, sécurisée et maintenable.

## Fonctionnalités implémentées

- **Génération d'utilisateurs fictifs** réalistes avec Faker.js (`GET /api/users/generate`)
- **Import batch** d'utilisateurs via fichier JSON (`POST /api/users/batch`)
- **Authentification JWT** (support `username` ou `email`)
- **Routes protégées** :
  - Consultation de son propre profil (`GET /api/users/me`)
  - Consultation du profil d'un autre utilisateur (`GET /api/users/:username`)
- **Contrôle d'accès basé sur les rôles** (USER vs ADMIN)
- **Documentation interactive** avec Swagger/OpenAPI

## Stack Technique

- **Runtime** : Node.js + TypeScript
- **Framework** : Express
- **Base de données** : MySQL + Prisma ORM (avec adapter MariaDB)
- **Authentification** : JWT + bcryptjs (hashage sécurisé)
- **Documentation** : Swagger / OpenAPI 3.0
- **Upload** : Multer (memory storage)
- **Validation & Sécurité** : Helmet, CORS, gestion des erreurs centralisée

## Choix Techniques & Bonnes Pratiques

| Critère                  | Choix réalisé                          | Justification |
|-------------------------|----------------------------------------|-------------|
| ORM                     | Prisma + Adapter MariaDB               | Type-safety, productivité, migrations faciles |
| Architecture            | Couches (Controllers / Services / Middleware) | Maintenabilité et testabilité |
| Sécurité                | JWT + bcrypt (12 rounds) + Helmet      | Protection contre les attaques courantes |
| Gestion des erreurs     | Middleware centralisé                  | Cohérence des réponses API |
| Documentation           | Swagger avec JSDoc                     | Facilite l'évaluation par les recruteurs |
| Performance             | Multer en memory + Pool de connexions  | Évite les I/O inutiles |

## Installation & Lancement

```bash
# 1. Cloner et installer
npm install

# 2. Base de données
npx prisma generate
npx prisma db push

# 3. Lancement
npm run dev