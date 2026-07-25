import sys
import uvicorn
from app.config import HOST, PORT

if __name__ == "__main__":
    print(f"🚀 Démarrage du serveur Xur AI Backend sur http://{HOST}:{PORT}")
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)
