# Management-System-SE-Project

## .env
```
    DATABASE_URL=postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?schema=public
```

### 1. Setup PostgreSQL Database

How to install PostgreSQL DB and pgAdmin using Docker:

1. **Install PostgreSQL and pgAdmin images:**
    - Run the following commands in your terminal:
      ```bash
      docker pull postgres
      docker pull dpage/pgadmin4
      ```

2. **Configure your value :**
    - Navigate to `src/db` and replace `<USER>`, `<PASSWORD>`, `<HOST>`, `<PORT>`, and `DATABASE` with your own values.
          

3. **Run Docker Compose:**
    - Start the PostgreSQL and pgAdmin containers by running:
      ```bash
      docker compose up
      ```

### 2. Setup Server

1. **Navigate to the server directory:**
    ```bash
    cd server
    ```

2. **Install Node packages:**
    ```bash
    npm install
    ```

3. **Migrate the database:**
    - Navigate to the `src` directory:
      ```bash
      cd src
      ```
    - Run the following command to create the initial migration:
      ```bash
      prisma migrate dev --name init
      ```

4. **Start the server:**
    ```bash
    npm run dev
    ```

---

### Additional Information

- Ensure that your database is correctly configured and running before starting the server.
- You can manage your PostgreSQL database through the pgAdmin interface by accessing the web client.
