from fastapi import FastAPI
app = FastAPI()

@app.get("/")

def home():
    return {"message" : " Math Gap Analyzeer API is running"}
# CRUD operations
@app.get("/skills")
def get_skills():
    return [
        {"id":1, "name": "Integer Operations"},
        {"id":2, "name": "Fractions"},
         {"id":3, "name": "Rations & Proportions"},
    ]

    # Database schema 