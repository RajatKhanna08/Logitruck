from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)  

# Load the trained model
model = joblib.load("price_estimator_model.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received data:", data)

        # Extract and preprocess the features
        weight = float(data['weightInTon'])
        distance = float(data['distance'])
        multi_stop = 1 if data['multiStop'] else 0
        delivery_time = float(data['deliveryTimeline'])

        # Encoding categorical features (you must have used label encoding during training)
        load_category_map = {'Fragile': 0, 'Liquid': 1, 'General': 2}
        body_type_map = {'Open Body': 0, 'Closed Body': 1}
        size_category_map = {'Small (7-10 ft)': 0, 'Medium (11-19 ft)': 1, 'Large (20+ ft)': 2}
        urgency_map = {'Normal': 0, 'Urgent': 1}

        load_category = load_category_map.get(data['loadCategory'], 0)
        body_type = body_type_map.get(data['bodyType'], 0)
        size_category = size_category_map.get(data['sizeCategory'], 0)
        urgency_level = urgency_map.get(data['urgencyLevel'], 0)

        # Prepare input array
        input_data = np.array([[weight, distance, multi_stop, delivery_time,
                                load_category, body_type, size_category, urgency_level]])

        prediction = model.predict(input_data)[0]

        return jsonify({'estimated_price': round(prediction, 2)})

    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
