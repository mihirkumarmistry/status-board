<p align="center">
  <img src="https://github.com/mihirkumarmistry/status-board/blob/main/src/assets/images/logo-dark.svg" width="400" height="200">
</p>

# Status Board
**Status Board** is an application that provides an easy-to-use status update board for a professor's office. An electronic device made using the NodeMCU receives messages from the web application and displays them on the board according to the schedule.

# Steps to run the applications
## Prerequisites
Before setting up the project, you have the following installed:
1. Install latest version of **node** v22.13.1 or higher. [Download Node](https://nodejs.org/en/download)
2. Install Angular CLI using command. ```npm install -g @angular/cli```
3. Run backend project by following the steps mention in readme file.

## Steps to run angular application
1. Clone [Repository](https://github.com/mihirkumarmistry/status-board.git) locally.
2. Go to project file and install dependencies using this command ```npm install --force```
3. Once all the depandancy install successfully run this command to run appllication ```npm run start```

## Steps to configure the Node MCU
We didn't deploy the backend to server. So, every time we run the backed on different comuter we need to configure the Node MCU.
1. Connect your computer to the WiFi connection.
2. Record you device IPv4.
3. Run the backed project using the ```python manage.py runserver 0.0.0.0:8000```
4. <img width="607" alt="image" src="https://github.com/user-attachments/assets/b1c6a620-4c2e-47ad-b505-e157c78a38f5" />
  - See Red Box: Replace the the WiFi Credantial according to your WiFi network.
  - See Green Box: Replace the IP address in linke (10.8.4.104) with your device IPv4.
  - See Blue Box: Replace first 3 part of the IP with your device IPv4.
5. Upload this code to Node MCU using the [Arduino IDE](https://www..cc/en/software).

