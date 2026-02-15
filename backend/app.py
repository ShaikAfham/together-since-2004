from flask import Flask, render_template, request, jsonify
from chatbot_logic import get_chatbot_response
from family_data import family_data

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/timeline")
def timeline():
    return jsonify(family_data["timeline"])

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    question = data.get("message", "")
    response = get_chatbot_response(question)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run()


