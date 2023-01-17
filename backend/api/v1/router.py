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

    return StreamingResponse(
        open(os.getenv('DATA_FILE')),
        status_code=status_code,
        media_type='text/csv',
        headers={'Content-Disposition": f"attachment; filename=jobs.csv'},
    )
