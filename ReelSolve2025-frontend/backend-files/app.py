# app.py
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    # Return a simple JSON response for testing
    return jsonify({"message": "Hello from Flask!"})

if __name__ == '__main__':
    # Run Flask on port 5000 by default
    app.run(port=5000)
