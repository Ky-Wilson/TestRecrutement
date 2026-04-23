// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import errorMiddleware from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9090;

app.use(helmet());
app.use(cors());
app.use(express.json());                   
app.use(express.urlencoded({ extended: true }));

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FFK Backend - API Utilisateurs',
      version: '1.0.0',
      description: 'API de gestion d\'utilisateurs pour le test technique Lead Tech',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend FFK opérationnel sur le port 9090' });
});

// Middleware de gestion des erreurs
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Documentation Swagger disponible sur http://localhost:${PORT}/docs`);
});