// src/config/database.ts
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaMariaDb({
  host: 'localhost',
  port: 3306,
  user: '',           // ton utilisateur MySQL
  password: '',         // ton mot de passe
  database: 'ffk_backend',      // nom de ta base
  connectionLimit: 10,
});

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;