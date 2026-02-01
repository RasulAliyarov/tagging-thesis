


# Project structure
 /ai-tagger
  ├── /services
  │    ├── /frontend       # Next.js (Port 3000)
  │    ├── /gateway        # Node.js/Python (Port 8000) - Основной API
  │    └── /nlp-worker     # FastAPI (Port 8001) - Только ИИ
  ├── docker-compose.yml   # "Оркестратор", который всё запустит
  └── .env                 # Общие настройки


  docker-compose up
  docker-compose up --build