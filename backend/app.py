from flask import Flask, request, jsonify
from flask_cors import CORS
from faiss_db import create_vector_db as load_vector_db  # Rename if necessary
# Import FAISS DB loader
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq

app = Flask(__name__)
CORS(app)

# Load FAISS Vector DB
vector_db = load_vector_db()

# Initialize LLaMA-2/Mistral model from Hugging Face API
llm = ChatGroq(
    temperature=0,
    groq_api_key="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",
    model_name="llama-3.3-70b-versatile"
)

# Define the prompt template for the chatbot
prompt_template = """You are a compassionate mental health chatbot. Respond thoughtfully to the following question:
{context}
User: {question}
Chatbot: """
PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])

# Setup LangChain QA Retrieval
retriever = vector_db.as_retriever()
qa_chain = RetrievalQA.from_chain_type(
    llm=llm, 
    chain_type="stuff",
    retriever=retriever,
    chain_type_kwargs={"prompt": PROMPT}
)

@app.route("/predict", methods=["POST"])
def predict():
    """Handles user chat requests and returns AI-generated responses."""
    data = request.get_json()
    user_input = data.get("message", "")

    if not user_input.strip():
        return jsonify({"answer": "Please provide a valid input"}), 400

    response = qa_chain.run(user_input)
    return jsonify({"answer": response})

if __name__ == "__main__":
    app.run(debug=True)
