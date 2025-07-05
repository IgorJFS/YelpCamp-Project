FROM node:20

WORKDIR /app

# Copia os arquivos de dependências primeiro para cache
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

# Copia o resto do código
COPY . .

# Exponha a porta usada pelo app
EXPOSE 3000

# Comando para modo dev com hot reload
CMD ["npm", "run", "dev"]
