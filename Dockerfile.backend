FROM python:3.12-slim

WORKDIR /app

# Dependencias mínimas
RUN sudo apt-get update && sudo apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev\
    && sudo rm -rf /var/lib/apt/lists/*

COPY requirements.txt
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

RUN python manage.py collectstatic --noinput
RUN python manage.py crear_admin --username admin

EXPOSE 8000
