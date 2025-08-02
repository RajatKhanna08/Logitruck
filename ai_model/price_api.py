from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load the trained model
model = joblib.load("price_estimator_model.pkl")

# --- CORRECT & COMPLETE MAPPINGS BASED ON TRAINING DATA ---
# These now reflect the unique values in your ai_price_estimator_dataset.csv

delivery_type_map = {'multi': 0, 'single': 1}

load_category_map = {
    'bulk': 0,
    'electronics': 1,
    'fragile': 2,
    'furniture': 3,
    'others': 4,
    'perishable': 5
}

truck_body_type_map = {
    'container': 0,
    'flatbed': 1,
    'heavy-duty': 2,
    'mini-truck': 3,
    'open': 4,
    'reefer': 5,
    'tanker': 6,
    'tipper': 7,
    'trailer': 8
}

truck_size_category_map = {
    'extra-large': 0,
    'heavy-duty': 1,
    'large': 2,
    'medium': 3,
    'small': 4
}

urgency_level_map = {
    'high': 0,
    'low': 1,
    'medium': 2
}


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("✅ Received data for prediction:", data)

        # --- FEATURE PREPARATION BASED ON THE MODEL'S TRAINING ---
        # The order of features MUST match the training data columns

        # 1. weight_ton (Numerical)
        weight_ton = float(data['weight_ton'])

        # 2. distance_km (Numerical)
        distance_km = float(data['distance_km'])

        # 3. delivery_type (Categorical)
        delivery_type = delivery_type_map.get(data['delivery_type'], -1) # Default to -1 if not found

        # 4. load_category (Categorical)
        load_category = load_category_map.get(data['load_category'], -1)

        # 5. truck_body_type (Categorical)
        truck_body_type = truck_body_type_map.get(data['truck_body_type'], -1)

        # 6. truck_size_category (Categorical)
        truck_size_category = truck_size_category_map.get(data['truck_size_category'], -1)

        # 7. urgency_level (Categorical)
        urgency_level = urgency_level_map.get(data['urgency_level'], -1)
        
        # 8. delivery_timeline_days (Numerical)
        delivery_timeline_days = float(data.get('delivery_timeline_days', 1.0))

        # Check for any mapping errors
        if -1 in [delivery_type, load_category, truck_body_type, truck_size_category, urgency_level]:
            print("❌ Error: One or more categorical features could not be mapped.")
            return jsonify({'error': 'Invalid categorical value provided.'}), 400

        # Prepare input array in the correct order for the model
        input_data = np.array([[
            weight_ton,
            distance_km,
            delivery_type,
            load_category,
            truck_body_type,
            truck_size_category,
            urgency_level,
            delivery_timeline_days
        ]])

        print("➡️ Processed input for model:", input_data)

        # Predict the price
        prediction = model.predict(input_data)[0]

        print("💡 AI Model Prediction:", prediction)
        return jsonify({'estimated_price': round(prediction, 2)})

    except Exception as e:
        print("❌ Error during prediction:", e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)