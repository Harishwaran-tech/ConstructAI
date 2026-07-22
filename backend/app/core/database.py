import os
from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

db_url = settings.DATABASE_URL
connect_args = {}

if db_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False
elif db_url.startswith("mysql"):
    # Parse URL to inspect and clean up SSL query parameters
    parsed = urlparse(db_url)
    params = dict(parse_qsl(parsed.query))
    
    # Try to find isrgrootx1.pem certificate
    ca_filename = "isrgrootx1.pem"
    ca_path = None
    
    # Check possible paths
    possible_paths = [
        ca_filename,
        os.path.join("..", ca_filename),
        os.path.abspath(ca_filename),
        os.path.abspath(os.path.join("..", ca_filename)),
        os.path.join("/opt/render/project/src", ca_filename)
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            ca_path = os.path.abspath(path)
            break
            
    if ca_path:
        # Build the SSL configuration dictionary for PyMySQL
        ssl_config = {"ca": ca_path}
        
        # Determine if we should verify the server certificate & hostname
        verify_cert = True
        if "ssl_verify_cert" in params:
            verify_cert = params["ssl_verify_cert"].lower() in ("true", "1")
            
        ssl_config["check_hostname"] = verify_cert
        connect_args["ssl"] = ssl_config
        
        # Remove raw SSL parameters from URL query string so SQLAlchemy/pymysql
        # doesn't try to parse them with incorrect paths.
        cleaned_params = {
            k: v for k, v in params.items()
            if k not in ["ssl_ca", "ssl_verify_cert", "ssl_verify_identity"]
        }
        
        # Reconstruct the DB URL with cleaned query parameters
        new_query = urlencode(cleaned_params)
        db_url = urlunparse(parsed._replace(query=new_query))

engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
