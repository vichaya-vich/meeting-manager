# Meeting Manager

Simple Meeting Manager web application where users can create, update, delete, and list
meetings.

## Build With
- ReactTS
- Vite
- Material UI
- Express

## Instruction

1. Clone the repo 
   ```bash
   git clone https://github.com/vichaya-vich/meeting-manager.git
   ```
2. Copy `.env.example` file in this project root directory to `.env`
   ```bash
   cd <project_directory>

   cp .env.example .env
   ```
3. Enter your config in `.env`
   ```
   POSTGRES_USER=<username>
   POSTGRES_PASSWORD=<password>
   POSTGRES_DB=meeting_manager

   DATABASE_URL=<database_url>
   CORS_ORIGIN=http://localhost:8080

   VITE_API_BASE_URL=http://localhost:3000
   ```
4. Build and Run
   ```bash
   docker compose up --build
   ```
5. Test on [http://localhost:8080](http://localhost:8080)

## Demo

- [Meeting Manager](https://meeting-manager-rouge.vercel.app/)
