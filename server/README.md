# Management-System-SE-Project

# .env
DATABASE_URL=postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/DATABASE?schema=public

# Setup development enviroment

## 1. Setup progres database
How to install postgres db and pgadmin container: 
    - install postgres and pgadmin image:
        docker pull postgres
        docker pull dpage/pgadmin4
    
    - got to src/db replace <username>, <password>, <email> with value
    - run cmd:
        - docker compose up

## 2. Setup server
1. cd server
2. install node package: 
    cmd: npm install
3. database migration:
    cd src
    cmd: 
        to create first migrations
        - prisma migrate dev --name init
4. cmd: npm run dev to start server


