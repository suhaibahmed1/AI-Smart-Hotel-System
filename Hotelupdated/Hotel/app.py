import csv
import os
import pandas as pd
from flask import Flask, jsonify, render_template, redirect, url_for, flash

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import DataRequired
from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, session


app = Flask(__name__)
app.secret_key = "super_secure_secret_key"

# --------------------
# Login system
# --------------------
ADMIN_USER = {
    "username": "admin",
    "password": generate_password_hash("admin123")
}

class LoginForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    remember = BooleanField("Remember Me")

@app.route("/", methods=["GET", "POST"])
@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        if form.username.data == ADMIN_USER["username"] and check_password_hash(ADMIN_USER["password"], form.password.data):
            return redirect(url_for("dashboard"))
        else:
            flash("Invalid username or password", "error")
    return render_template("login.html", form=form)

# --------------------
# Dashboard
# --------------------
@app.route("/dashboard")
def dashboard():

    return render_template("dashboard.html")

@app.route("/api/average-room-prices")
def average_room_prices():
    last_df = pd.read_csv(
        r"C:\Users\SUHAIB\Downloads\Hotelupdated\Hotel\csv file\last_year.csv"
    )

    actual_df = pd.read_csv(
        r"C:\Users\SUHAIB\Downloads\Hotelupdated\Hotel\csv file\actual_room_price.csv"
    )

    predicted_df = pd.read_csv(
        r"C:\Users\SUHAIB\Downloads\Hotelupdated\Hotel\model\predicted_room_prices_2025.csv"
    )

    last_avg = last_df.groupby("Room_Type")["Room_per_night_price"].mean()
    actual_avg = actual_df.groupby("Room_Type")["Room_per_night_price"].mean()
    predicted_avg = predicted_df.groupby("Room_Type")["Room_per_night_price"].mean()

    return jsonify({
        "last_year": last_avg.round(2).to_dict(),
        "actual": actual_avg.round(2).to_dict(),
        "predicted": predicted_avg.round(2).to_dict()
    })

@app.route("/api/dashboard-kpi")
def dashboard_kpi():

    # ---------- ACTUAL OCCUPANCY ----------
    actual_df = pd.read_csv(r"C:\Users\SUHAIB\Downloads\Hotelupdated\Hotel\csv file\booking_history.csv")

    actual_df["Occupancy_Rate"] = (
        actual_df["Booked_Rooms"] / actual_df["Total_Rooms"]
    ) * 100

    actual_12_month_avg = round(
        actual_df["Occupancy_Rate"].mean(), 2
    )

    # ---------- AI PREDICTED OCCUPANCY ----------
    ai_df = pd.read_csv(r"C:\Users\SUHAIB\Downloads\Hotelupdated\Hotel\model\predicted_occupancy_2025.csv")

    ai_12_month_avg = round(
        ai_df["Predicted_Occupancy_Rate"].mean(), 2
    )

    return jsonify({
        "actual_occupancy": actual_12_month_avg,
        "ai_predicted_occupancy": ai_12_month_avg
    })
@app.route("/api/revenue-kpi")
def revenue_kpi():
    # Read revenue CSV dynamically
    revenue_df = pd.read_csv(r"C:\Users\SUHAIB\Downloads\Hotelupdated\Hotel\model\monthly_profit_revenue_comparison_2025.csv")

    # Calculate totals
    total_revenue_actual = revenue_df['Revenue_Actual'].sum()
    total_revenue_predicted = revenue_df['Revenue_Predicted'].sum()
    total_profit_actual = revenue_df['Profit_Actual'].sum()
    total_profit_predicted = revenue_df['Profit_Predicted'].sum()

    revenue_loss = total_revenue_predicted - total_revenue_actual
    profit_gain = total_profit_predicted - total_profit_actual

    # Return JSON for frontend consumption
    return jsonify({
        "total_revenue_actual": round(total_revenue_actual, 2),
        "total_revenue_predicted": round(total_revenue_predicted, 2),
        "total_profit_actual": round(total_profit_actual, 2),
        "total_profit_predicted": round(total_profit_predicted, 2),
        "revenue_loss": round(revenue_loss, 2),
        "profit_gain": round(profit_gain, 2)
    })


# --------------------
# Demand Forecasting
# --------------------
@app.route("/demand-forecast")
def demand_forecast():
    return render_template("DemandForecast.html")

@app.route("/api/occupancy-data")
def occupancy_data():
    df = pd.read_csv(r"C:\Users\SUHAIB\Downloads\Hotelupdated\Hotel\model\predicted_occupancy_2025.csv")
    
    # Strip whitespace in column names just in case
    df.columns = [col.strip() for col in df.columns]

    # Rename columns for JS convenience
    df = df.rename(columns={
        'Room_Type': 'room_type',
        'Month': 'month',
        'Predicted_Occupancy_Rate': 'occupancy'
    })
    
    # Convert to JSON list of dicts
    data = df.to_dict(orient='records')
    return jsonify(data)



BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# CSV paths
ACTUAL_CSV = os.path.join(BASE_DIR, 'csv file', 'actual_room_price.csv')
PREDICTED_CSV = os.path.join(BASE_DIR, 'model', 'predicted_room_prices_2025.csv')

@app.route("/ai_pricing")
def ai_pricing():
    return render_template("Aipricing.html")


# Actual room prices
@app.route("/api/rooms/actual")
def get_actual_rooms():
    try:
        df = pd.read_csv(ACTUAL_CSV)
        df_json = df.rename(columns={
            'Month': 'month',
            'Room_Id': 'room_id',
            'Room_Type': 'room_type',
            'Room_per_night_price': 'price'
        })
        return jsonify(df_json.to_dict(orient="records"))
    except FileNotFoundError:
        return jsonify({"error": "Actual CSV not found!"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Predicted room prices
@app.route("/api/rooms/predicted")
def get_predicted_rooms():
    try:
        df = pd.read_csv(PREDICTED_CSV)
        df_json = df.rename(columns={
            'Month': 'month',
            'Room_Id': 'room_id',
            'Room_Type': 'room_type',
            'Predicted_Room_Price': 'predicted_price'
        })
        return jsonify(df_json.to_dict(orient="records"))
    except FileNotFoundError:
        return jsonify({"error": "Predicted CSV not found!"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --------------------
# Analytic Report Page
# --------------------
@app.route("/analytic_report")
def analytic_report():   
    return render_template("AnalyticReport.html")

# --------------------
# Analytic Report API
# --------------------
@app.route("/api/monthly-profit-revenue-comparison-2025")
def monthly_profit_revenue():
    df = pd.read_csv(
        r"C:\Users\SUHAIB\Downloads\Hotelupdated\Hotel\model\monthly_profit_revenue_comparison_2025.csv"
    )
    return jsonify(df.to_dict(orient="records"))

@app.route("/api/override-price", methods=["POST"])
def override_price():
    data = request.json

    key = f"{data['room_type']}_{data['month']}"

    if "overrides" not in session:
        session["overrides"] = {}

    session["overrides"][key] = data["ai_price"]
    session.modified = True

    return jsonify({"status": "success"})




# --------------------
# Room Management
# --------------------


@app.route("/room-management")
def room_management():
    return render_template("RoomManagement.html")


def read_price_csv(path):
    data = {}
    with open(path, newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            month = row['Month']
            room = row['Room_Type'].lower()
            price = float(row['Room_per_night_price'])

            if month not in data:
                data[month] = {}
            data[month][room] = price

    return data



@app.route("/api/actual-room-prices")
def get_actual_prices():
    return jsonify(read_price_csv(ACTUAL_CSV))


@app.route("/api/ai-room-prices")
def get_ai_prices():
    return jsonify(read_price_csv(PREDICTED_CSV))

@app.route("/api/room-prices")
def room_prices():
    mode = request.args.get("mode", "actual")

    actual_df = pd.read_csv(r"C:\Users\SUHAIB\Downloads\Hotelupdated\Hotel\csv file\actual_room_price.csv")
    ai_df = pd.read_csv(r"C:\Users\SUHAIB\Downloads\Hotelupdated\Hotel\model\predicted_room_prices_2025.csv")

    overrides = session.get("price_overrides", {})

    result = []

    for _, row in actual_df.iterrows():
        key = f"{row['Month']}_{row['Room_Type']}"
        actual_price = row["Room_per_night_price"]

        # apply temporary override if exists
        display_price = overrides.get(key, actual_price)

        record = {
            "month": row["Month"],
            "room_type": row["Room_Type"],
            "actual_price": round(display_price, 2)
        }

        if mode == "ai":
            ai_price = ai_df[
                (ai_df["Month"] == row["Month"]) &
                (ai_df["Room_Type"] == row["Room_Type"])
            ]["Room_per_night_price"].values[0]

            record["ai_price"] = round(ai_price, 2)

        result.append(record)

    return jsonify(result)


@app.route("/api/apply-ai-price", methods=["POST"])
def apply_ai_price():
    data = request.json

    overrides = session.get("price_overrides", {})
    key = f"{data['month']}_{data['room_type']}"

    overrides[key] = data["price"]

    session["price_overrides"] = overrides

    return "", 204



# -------------------
# AI Explanation
# --------------------
@app.route("/ai-explanation")
def ai_explanation():
    return render_template("AiExplanation.html")

# --------------------
# Logout
# --------------------
@app.route("/logout")
def logout():
    return redirect(url_for("login"))





if __name__ == "__main__":
    app.run(debug=True)
