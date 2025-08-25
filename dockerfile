# Imagen base
FROM node:18

# Carpeta de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Exponer puerto
EXPOSE 3003

# Iniciar app
CMD ["npm", "start"]
