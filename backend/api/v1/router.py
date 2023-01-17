import os
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from services.parser import Parser
from schemas.filter import FilterItem

router = APIRouter(
    prefix='/parser',
    responses={404: {'description': 'Not found'}},
)


@router.post('/')
def parse(values: FilterItem):
    parser = Parser()
    status_code = parser.parse(values.job_type.lower(), values.job_title.lower(), values.location.lower())

    def get_file():
        with open(os.getenv('DATA_FILE'), mode='rb') as f:
            yield from f

    return StreamingResponse(get_file(), media_type='text/csv', status_code=status_code)
