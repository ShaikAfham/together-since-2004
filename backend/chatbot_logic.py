import google.generativeai as genai
from family_data import family_data

# Configure Gemini (PUT YOUR REAL KEY HERE)
genai.configure(api_key="YAIzaSyDS77imHBTTlafKpUpILlGLBoiO2tzxZUg")

model = genai.GenerativeModel("gemini-1.5-flash")


def get_chatbot_response(question):

    q = question.lower()

    # 🔹 DIRECT FACTUAL ANSWERS

    if "how many children" in q:
        return "You have 4 beautiful children."

    if "children" in q and "name" in q or "who are our children" in q or "kids" in q:
        names = [child["name"] for child in family_data["children"]]
        return "Your children are: " + ", ".join(names) + "."

    if "where" in q and "live" in q:
        res = family_data["residence"]
        return f"You have been living in {res['current_city']}, {res['country']} since {res['since']}."

    if "mother" in q or "mom" in q:
        mother = family_data["parents"]["mother"]
        return f"Your mother is {mother['name']}, a dedicated {mother['profession']}."

    if "father" in q or "dad" in q:
        father = family_data["parents"]["father"]
        return f"Your father is {father['name']}, a proud {father['profession']}."

    if "when" in q and ("marry" in q or "married" in q or "wedding" in q):
        return "You married on 15th February 2004 in Hyderabad."

    if "journey" in q:
        return ("Your journey began with faith and trust in 2004, and over the years "
                "it blossomed into a home filled with love, resilience, and beautiful memories. "
                "Through every challenge and every blessing, you built a family grounded in strength and unity.")

    # 🔹 GEMINI FALLBACK (For emotional/creative questions)

    context = f"""
    You are a loving family assistant.

    Wedding Date: {family_data['wedding']['date']}
    Wedding Place: {family_data['wedding']['place']}
    Marriage Type: {family_data['wedding']['type']}

    Children:
    {family_data['children']}

    Always respond emotionally, warmly and respectfully.
    Keep responses short (3-5 lines max).
    """

    prompt = context + "\nUser Question: " + question

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print("Gemini Error:", e)
        return "Something went wrong while generating response."
