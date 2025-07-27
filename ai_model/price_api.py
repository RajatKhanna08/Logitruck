from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = joblib.load("price_estimator_model.pkl")

load_category_map = {
    "Fragile": 0,
    "Perishable Goods": 1,
    "General Goods": 2,
    "Others": 3
}

body_type_map = {
    "Open Body": 1.0,
    "Closed Container": 1.2,
    "Tanker": 1.4,
    "Refrigerated Truck": 1.6,
    "Heavy Duty Flatbed": 2.0
}

size_category_map = {
    "Small (7-10 ft)": 1.0,
    "Medium (14-17 ft)": 1.2,
    "Large (19-22 ft)": 1.5,
    "XL / Heavy Duty": 2.0
}

urgency_level_map = {
    "Normal": 0,
    "Medium": 1,
    "High": 2
}

@app.route('/')
def home():
    return "✅ AI Price Estimator Flask API is running!"

@app.route('/predict', methods=['POST'])
def predict_price():
    data = request.get_json()
    try:
        print("Received data:", data)

        features = [
            float(data.get('weightInTon', 0)),
            float(data.get('distanceInKm', 0)),
            int(data.get('isMultiStop', 0)),
            load_category_map.get(data.get('loadCategory'), 3),
            body_type_map.get(data.get('bodyTypeMultiplier'), 1.0),
            size_category_map.get(data.get('sizeCategoryMultiplier'), 1.0),
            urgency_level_map.get(data.get('urgencyLevel'), 0),
            float(data.get('deliveryTimeline', 1))
        ]

        prediction_input = np.array(features).reshape(1, -1)
        predicted_price = model.predict(prediction_input)[0]

        # Optional: Add surcharge for Multi-Stop if needed
        if features[2] == 1:
            predicted_price *= 1.15  # 15% more for multi-stop

        return jsonify({
            'estimatedPrice': round(predicted_price, 2)
        })

    except Exception as e:
        print("Error in prediction:", e)
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
