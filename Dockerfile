#Utilise Node.js 18 sur Alpine Linux comme image de base
FROM node:18-alpine

#Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie tous les fichiers du projet dans le conteneur
COPY . .

RUN npm install

EXPOSE 3000

#Définit le répertoire de travail dans le conteneur
CMD ["node", "Server.js"]