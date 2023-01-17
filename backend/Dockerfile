FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /src/usr/app/back

COPY Pipfile Pipfile.lock ./

RUN pip install --upgrade pip \
    pip install pipenv && pipenv install --system

COPY . .
