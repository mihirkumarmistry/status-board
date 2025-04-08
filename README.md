<p align="center">
  <img src="https://github.com/mihirkumarmistry/status-board/blob/main/src/assets/images/logo-dark.svg" width="400" height="200">
</p>

# Status Board

**Status Board** is an application that provides an easy-to-use status update board for a professor's office.  
An electronic device built using the NodeMCU receives messages from the web application and displays them on the board according to the schedule.

---

## 📌 Features

- Web-based interface to send real-time status updates
- Angular frontend and Django backend
- Status displayed on an electronic board using NodeMCU (ESP8266)
- Supports scheduled messages
- Easy local setup and testing

---

## 🛠️ Tech Stack

| Component        | Technology          |
|------------------|---------------------|
| Frontend         | Angular             |
| Backend          | Django (Python)     |
| Microcontroller  | NodeMCU (ESP8266)   |
| Communication    | HTTP (Local Network)|

---

## 🚀 Getting Started

This section explains how to run both the Angular frontend and the Django backend locally, along with NodeMCU configuration for full functionality.

---

## ✅ Prerequisites

Make sure the following tools are installed:

- **Node.js** (v22.13.1 or higher)  
  👉 [Download Node.js](https://nodejs.org/en/download)

- **Angular CLI**  
  Install it globally:  
  ```bash
  npm install -g @angular/cli

- **Docker Desktop**  
  Install Docker Desktop: [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

- **Pgadmin 4**  
  Install Pgadmin 4  [Download Pgadmin 4](https://www.pgadmin.org/download/)

## 🖥️ Running the Django Backend

1. Clone [Repository](https://github.com/athul-narayanan/displayboardapi.git) locally.

cd displayboardapi

2. Install and prepare dependencies using:
   ```bash
    pip install -r requirements.txt
   ```

3. Pull the docker image for postgres using:
   ```bash
   docker pull postgres
   ```

4. Run the docker container using:
   ```bash
   docker run --name asepostgres -e POSTGRES_PASSWORD=Algoma@2024 -p 5433:5432 -d postgres
   ```

5. Create database in the container:
   ```bash
   docker exec -it asepostgres psql -U postgres -c "CREATE DATABASE displayboarddatabase"
   ```
6. Prepare database migrations for all tables using:
   ```bash
   python manage.py makemigrations user
   ```
7. Apply Migrations to the database using:
   ```bash
   python manage.py migrate
   ```
8. Add Entry for user roles by running below SQL commands:
   ```bash
    INSERT INTO public.userrole (id, role_name)
    VALUES (1, 'USER');

    INSERT INTO public.userrole (id, role_name)
    VALUES (2, 'ADMIN');

    INSERT INTO public.userrole (id, role_name)
    VALUES (3, 'MASTER');
   ```
9. Run the application using:
   ```bash
    python manage.py runserver 0.0.0.0:8000
   ```
---
The above command runs the application on port 8000. Make sure that you have installed required dependencies and started postgres sql in docker.

- Once the application is started cron jobs can be started using ```python manage.py runapscheduler```
- shut down the application manually using ```Ctrl-C```
## 💻 Running the Angular Frontend

1. Clone the repository:
   ```bash
   git clone https://github.com/mihirkumarmistry/status-board.git
   ```

2. Navigate to the project directory:
   ```bash
   cd status-board
   ```

3. Install the dependencies:
   ```bash
   npm install --force
   ```

4. Run the Angular application:
   ```bash
   npm run start
   ```

The app will be available at:  
➡️ `http://localhost:4200`

---

## ⚙️ Configuring the NodeMCU

Since the backend is running locally, you must update the NodeMCU every time the backend runs on a different computer.

### 🔧 Steps to Configure

1. Connect your computer to the Wi-Fi network.

2. Find your computer’s IPv4 address:  
   - Windows: `ipconfig`  
   - macOS/Linux: `ifconfig`

3. Run the Django backend:  
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

4. Open the Arduino code and make the following changes: [Node MCU CODE](https://github.com/mihirkumarmistry/status-board/blob/main/MCU/sketch_wifi/sketch_au.ino/sketch_au.ino.ino)
   <img width="607" alt="image" src="https://github.com/user-attachments/assets/bf5ba650-19ab-4a19-aba9-74d39a7eea69" />

   - 🔴 **Red Box**: Replace the Wi-Fi credentials (SSID and password) with your current network.
   - 🟢 **Green Box**: Update the API URL (e.g., `http://10.8.4.104:8000`) with your device’s IPv4.
   - 🔵 **Blue Box**: Match the first three parts of the IP address logic with your computer’s IPv4.
   - 🟤 **Blown Line**: Replace email with your email, you used during the registration process.

6. Upload the updated code to the NodeMCU using the [Arduino IDE](https://www.arduino.cc/en/software).

---
