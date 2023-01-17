# Angelco scraper

## Installation

Copy `.env.sample` into `.env` or assign OS environment variables accordingly.

## First run

Docker container already contains all necessary data, and it will be applied for a first run.

To initialize container in a project root directory run 

```
docker-compose run nginx
```

And then start container

```
docker-compose up
```

After container started successfully, you can check it via browser [**localhost**](http://localhost:3050/).

## How to use

Specify **Job Title**, **Job Type** and **Location** fields and then click **SEND** to invoke Parser. After Parser finished, you will get **DOWNLOAD** button to save parsed data into your local machine directly.

## Common problems solution

If you can't get **DOWNLOAD** button, or get an error `Parser finished with X error` you should dive into container on the backend side and check the logs

```
docker exec -it fastapi bash
cat services/logs/parser.log
cat services/data/jobs.csv
```

Multiple errors with 403 code means that you exceeded requests limit and your IP address have been blocked indefinitely.

## Direct links

* Frontend React [**Here**](http://localhost:3000/)
* Backend FastAPI [**Here**](http://localhost:5000/)
* Proxy server Nginx [**Here**](http://localhost:3050/)
