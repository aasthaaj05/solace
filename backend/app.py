from flask import Flask, request, jsonify
from flask_cors import CORS
from faiss_db import create_vector_db as load_vector_db  # Rename if necessary
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq
import re  # For cleaning responses

app = Flask(__name__)
CORS(app)

# Load FAISS Vector DB
vector_db = load_vector_db()

# Initialize LLaMA-2/Mistral model from Hugging Face API
llm = ChatGroq(
    temperature=0.5,  # Increased temperature for more human-like responses
    groq_api_key="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",
    model_name="llama-3.3-70b-versatile"
)

# Define the prompt template for the chatbot
prompt_template = """You are a compassionate mental health chatbot. Your goal is to provide helpful and empathetic support to children. Respond thoughtfully to the following question. Follow these rules:
1. Provide actionable advice or emotional support first.
2. Only ask a follow-up question if it helps the child express themselves better or guides them toward a solution.
3. Keep your response short, conversational, and empathetic.
4. Do not mention or reference any source documents, research papers, or files.

Context: {context}
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

def clean_text(text):
    """Remove references to documents, research papers, or files from the text."""
    # Remove phrases like "document: data/report.pdf" or "research paper: XYZ"
    text = re.sub(r"(document|research paper|file|module):\s*\S+", "", text)
    return text.strip()

def make_response_humanlike(response):
    """Post-process the response to make it more concise and human-like."""
    # Remove unnecessary phrases or overly formal language
    response = re.sub(r"\s+", " ", response)  # Remove extra spaces
    response = response.strip()
    return response

@app.route("/predict", methods=["POST"])
def predict():
    """Handles user chat requests and returns AI-generated responses."""
    data = request.get_json()
    user_input = data.get("message", "")

    if not user_input.strip():
        return jsonify({"answer": "Please provide a valid input"}), 400

    # Retrieve relevant context
    relevant_docs = retriever.get_relevant_documents(user_input)
    
    # Clean the retrieved context to remove document references
    cleaned_context = " ".join([clean_text(doc.page_content) for doc in relevant_docs])

    # Generate response using the QA chain
    response = qa_chain.run({"query": user_input, "context": cleaned_context})

    # Clean the final response to ensure no document references remain
    cleaned_response = clean_text(response)

    # Make the response more human-like and concise
    humanlike_response = make_response_humanlike(cleaned_response)

    return jsonify({"answer": humanlike_response})

if __name__ == "__main__":
    app.run(debug=True)