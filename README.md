# Countdown-Timer-Website

## Overview
This project is a simple countdown timer website to keep tracking events and deadlines by displaying remaining time in days, hours, minutes, and seconds.

I create this website because i could not find website that fulfill my need for countdown timers that is free, So i decided to create one for myself. Feel free to use it for yourself.

## Tech stacks
### Frontend
- React
- Tailwind CSS
- Vite
- TypeScript
### Backend
- NestJS
- PostgreSQL

## Installation
### Docker (Recommended)
#### Docker Compose with local repository
1. Clone the repository:
2. Execute bash 
   ```bash
   docker compose up
   ```
3. Open your browser and navigate to `http://localhost:5173`

#### Docker Hub
1. Create docker compose file `docker-compose.yml` in your project directory:
```yaml
services:
  db:
    image: postgres:latest
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: db
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    restart: on-failure
    networks:
      - prisma-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d db"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    image: zenonist/countdown-timer-website-backend:latest
    ports:
      - "3000:3000"
    restart: on-failure
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/db
    depends_on:
      db:
        condition: service_healthy
    networks:
      - prisma-network
      
  frontend:
    image: zenonist/countdown-timer-website-frontend:latest
    ports:
      - "5173:5173"
    restart: on-failure
    environment:
      - VITE_BACKEND_URL=http:/localhost:3000
    depends_on:
      backend:
        condition: service_started
    networks:
      - prisma-network

volumes:
  db_data:

networks:
  prisma-network:
    name: prisma-network
```
2. Execute bash 
   ```bash
   docker compose up
   ```
3. Open your browser and navigate to `http://localhost:5173`

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/Zenonist/Countdown-timer-website
   ```
2. Setup postgres
   - Install PostgreSQL and create a database named `db`
   - Create a user with username `user` and password `password`
3. Install dependencies for backend:
   ```bash
   cd backend
   npm install
   ```
4. Setup environment variables for backend:
    - Create a `.env` file in the `backend` directory with the following content:
      ```
      DATABASE_URL=postgresql://user:password@localhost:5432/db
      ```
5. Start the backend server:
    ```bash
    npm run start:dev
    ```
6. Install dependencies for frontend:
7. ```bash
   cd frontend
   npm install
   ```
8. Start the frontend server:
   ```bash
    npm run dev
    ```
9. Open your browser and navigate to `http://localhost:5173`