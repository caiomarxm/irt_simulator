import logging
from sqlmodel import Session

from core.db import engine, init_db


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init() -> None:
    with Session(engine) as session:
        logger.info(f"Creating db...")
        init_db(session=session)
        logger.info(f"Db created")


if __name__ == "__main__":
    init()
