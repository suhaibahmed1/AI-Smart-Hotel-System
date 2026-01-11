# 🏨 AI Smart Hotel Management System

An AI-based Hotel Management System that predicts **room occupancy rates** and **room prices** using Machine Learning.  
This system helps hotel management make **data-driven decisions** to maximize revenue and improve future planning.

---

## 📌 Project Overview

Hotels often face difficulty in accurately predicting future room occupancy and pricing due to seasonal demand, events, and competitor pricing.  
This project solves the problem by using **historical booking data**, **revenue records**, **events data**, and **competitor pricing** to generate intelligent predictions.

The system uses **Supervised Machine Learning Regression algorithms** to forecast:
- 📊 Occupancy Rate (%)
- 💰 Room Price per Night

---

## 🎯 Objectives

- Predict future hotel occupancy rates
- Predict optimized room pricing
- Help hotel management:
  - Increase revenue
  - Reduce vacant rooms
  - Improve decision-making
- Replace manual estimation with AI-based predictions

---

## 🧠 Machine Learning Approach

### Algorithm Used
- **Gradient Boosting Regressor**
  - Type: Supervised Machine Learning (Regression)
  - Category: Ensemble Learning
  - Reason for Selection:
    - Handles non-linear data
    - High prediction accuracy
    - Combines multiple weak models into a strong predictor

---

## 🗂️ Dataset Used

| File Name | Description |
|---------|-------------|
| booking_history.csv | Historical booking data |
| revenue.csv | Monthly revenue data |
| events.csv | Monthly events data |
| competitor.csv | Competitor hotel pricing |
| actual_room_price.csv | Current room prices |

---

## ⚙️ Feature Engineering

- Month conversion (January → 1, February → 2)
- Occupancy calculation:
Occupancy Rate = Booked Rooms / Total Rooms

- Revenue per room calculation
- Event impact analysis
- Competitor price influence
- Room type encoding using Label Encoding

---

## 🏗️ Project Structure

Hotelupdated/
│
├── app.py
├── model/
│ ├── occupancy_prediction.py
│ ├── price_prediction.py
│ ├── predicted_occupancy_2025.csv
│ └── predicted_room_prices_2025.csv
│
├── csv file/
│ ├── booking_history.csv
│ ├── revenue.csv
│ ├── events.csv
│ └── competitor.csv
│
├── static/
│ └── css/
├── templates/

---

## 🚀 How to Run the Project

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/suhaibahmed1/AI-Smart-Hotel-System.git
cd AI-Smart-Hotel-System
2️⃣ Install Dependencies

pip install pandas numpy scikit-learn flask flask-wtf wtforms werkzeug

3️⃣ Run Flask Application
python app.py
4️⃣ Run Machine Learning Models
python model/occupancy_prediction.py
python model/price_prediction.py
📈 Output Files
predicted_occupancy_2025.csv

predicted_room_prices_2025.csv

These files contain AI-generated predictions for all room types and months.

🛠️ Technologies Used
Programming & ML
Python

Pandas

NumPy

Scikit-learn

Backend
Flask

Flask-WTF

WTForms

Tools
Git & GitHub

VS Code
