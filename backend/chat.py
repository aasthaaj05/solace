from langchain.embeddings import HuggingFaceBgeEmbeddings
from langchain.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.vectorstores import FAISS  # Use FAISS instead of Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os

def create_vector_db():
    # Load and process PDF documents
    loader = DirectoryLoader("data/", glob="*.pdf", loader_cls=PyPDFLoader)
    documents = loader.load()
    
    # Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = text_splitter.split_documents(documents)

    # Load embeddings
    embeddings = HuggingFaceBgeEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')

    # Create FAISS vector store
    vector_db = FAISS.from_documents(texts, embeddings)

    # Save FAISS index
    vector_db.save_local("faiss_index")

    print("FAISS vector database created and saved!")

    return vector_db

def load_vector_db():
    embeddings = HuggingFaceBgeEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
    return FAISS.load_local("faiss_index", embeddings)

def setup_qa_chain(vector_db, llm):
    retriever = vector_db.as_retriever()
    
    prompt_template = """You are a compassionate mental health chatbot. Respond thoughtfully to the following question:
    {context}
    User: {question}
    Chatbot: """
    PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        chain_type_kwargs={"prompt": PROMPT}
    )
    return qa_chain

# Initialize FAISS
if not os.path.exists("faiss_index"):
    vector_db = create_vector_db()
else:
    vector_db = load_vector_db()
