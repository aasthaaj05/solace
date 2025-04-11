import faiss
import os
import pickle
from langchain_community.vectorstores import FAISS  # Updated import
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader  # Updated import
from langchain.text_splitter import RecursiveCharacterTextSplitter


DB_PATH = "./faiss_index"  # Directory where FAISS DB will be stored
DATA_PATH = "./data"  # Folder containing PDFs

def create_vector_db():
    """Loads PDF files, generates embeddings, and stores them in FAISS."""

    # Ensure DB path exists
    os.makedirs(DB_PATH, exist_ok=True)  # ✅ Fix: Create folder if missing

    # Ensure data path exists
    if not os.path.isdir(DATA_PATH):
        raise ValueError(f"⚠️ The path '{DATA_PATH}' is not a directory. Create the folder and add PDFs.")

    # Load PDF documents
    documents = []
    for file in os.listdir(DATA_PATH):
        if file.endswith(".pdf"):
            pdf_path = os.path.join(DATA_PATH, file)
            loader = PyPDFLoader(pdf_path)
            documents.extend(loader.load())

    if not documents:
        raise ValueError("⚠️ No PDF files found in './data'. Please add PDFs.")

    # Split documents
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = text_splitter.split_documents(documents)

    # Generate embeddings
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")



    # Create FAISS vector store
    vector_db = FAISS.from_documents(texts, embeddings)

    # ✅ Fix: Ensure the FAISS index folder exists before writing
    os.makedirs(DB_PATH, exist_ok=True)  

    # Save FAISS index
    faiss.write_index(vector_db.index, os.path.join(DB_PATH, "faiss_index"))
    with open(os.path.join(DB_PATH, "faiss_store.pkl"), "wb") as f:
        pickle.dump(vector_db, f)

    print("✅ FAISS DB created and saved!")

    return vector_db