PARKING LOT MANAGEMENT SYSTEM

PROJECT DESCRIPTION:
Manage vehicle parking spaces and parking records. Security staff can register incoming
vehicles, assign parking slots, record entry and exit times, and calculate parking charges.

TECHNOLOGIES:
HTML, CSS, JavaScript, Node.js, Express and MySQL.

DATABASE:
Database name: parking_lot_db
Tables: users, parking_slots, vehicles, parking_records

SETUP STEPS:
1. Open MySQL Workbench.
2. Open database.sql and execute the complete SQL script.
3. Open this project folder in VS Code.
4. Open server.js and change the MySQL password if required.
5. Open terminal in the project folder and run:
      npm install
      npm start
6. Open browser:
      http://localhost:3000

PAGES:
- Home
- Users (add, list, update, delete)
- Parking Slots (add, list, update, delete)
- Vehicles (add, list, update, delete)
- Parking Records (add, list, update, delete)

DROPDOWNS:
- User role: Admin, Security Staff, User
- Vehicle type: Two Wheeler, Four Wheeler
- Slot status: Available, Occupied
- Record status: Active, Completed
- User, vehicle and parking slot IDs are loaded from the database.

NOTE:
The MySQL user in server.js is root and the sample password is tejaswi.
Change it to your own MySQL password before running the project.
