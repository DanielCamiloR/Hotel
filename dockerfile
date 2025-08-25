# Imagen base
FROM node:18

# Carpeta de trabajo
WORKDIR /app

# Copiar package.json y lock primero (para cache)
COPY ./src/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY ./src .

# Exponer puerto
EXPOSE 3003

# Comando por defecto
CMD ["npm", "start"]
