from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow CORS requests from your React frontend

# Load the trained model
model = joblib.load("price_estimator_model.pkl")

@app.route('/')
def home():
    return "✅ AI Price Estimator Flask API is running!"

@app.route('/predict', methods=['POST'])
def predict_price():
    data = request.get_json()

    try:
        # Extract inputs from the request
        features = [
            data['weightInTons'],
            data['distanceInKm'],
            data['isMultiStop'],           # 0 for single, 1 for multi
            data['loadCategory'],          # Integer encoded
            data['bodyTypeMultiplier'],    # Float
            data['sizeCategoryMultiplier'],# Float
            data['urgencyLevel'],          # Integer encoded
            data['deliveryTimeline']       # in hours or days
        ]

        # Convert to numpy array and reshape for prediction
        prediction_input = np.array(features).reshape(1, -1)

        # Make prediction
        predicted_price = model.predict(prediction_input)[0]

        return jsonify({
            'estimatedPrice': round(predicted_price, 2)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)