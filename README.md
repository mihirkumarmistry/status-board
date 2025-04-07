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

## 🖥️ Running the Django Backend

1. Navigate to your Django backend project directory.

2. Create and activate a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```
---

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

4. Open the Arduino code and make the following changes:  
   <img width="607" alt="image" src="https://github.com/user-attachments/assets/b1c6a620-4c2e-47ad-b505-e157c78a38f5" />

   - 🔴 **Red Box**: Replace the Wi-Fi credentials (SSID and password) with your current network.
   - 🟢 **Green Box**: Update the API URL (e.g., `http://10.8.4.104:8000`) with your device’s IPv4.
   - 🔵 **Blue Box**: Match the first three parts of the IP address logic with your computer’s IPv4.

5. Upload the updated code to the NodeMCU using the [Arduino IDE](https://www.arduino.cc/en/software).

---
