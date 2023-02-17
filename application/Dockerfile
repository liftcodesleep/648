FROM python:3.8.13-slim-buster
WORKDIR /app
RUN rm -r -f .
COPY ./ ./

#RUN pip install --upgrade pip --no-cache-dir

#RUN pip install -r requirements.txt --no-cache-dir

#CMD ["sudo", "apt", "update"]

#CMD ["sudo", "apt", "install", "nodejs", "npm"]

WORKDIR /csc648_team1/csc648_team1/my-app

CMD ["npm", "install"]
#CMD ["npm", "install", "react-scripts", "--save"]
#CMD ["npm", "run", "build"]

WORKDIR /app

RUN  ls csc648_team1/my-app/build/static/css

CMD ["python3", "manage.py", "collectstatic"]

RUN  ls csc648_team1/my-app/build/static/css

#CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

CMD ["gunicorn", "csc648_team1.wsgi:application", "--bind", "0.0.0.0:8000", "--timeout", "90"]
