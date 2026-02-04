from sqlmodel import Session, SQLModel, create_engine, select
from backend.models import User, Ride
from passlib.context import CryptContext

# Setup DB connection (assuming local sqlite for now as per project structure)
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url)

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
def get_hash(password):
    return pwd_context.hash(password)

def create_dummy_data():
    # Reset DB
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # 1. Create Users
        users_data = [
            # IBA Students
            {"email": "ali.iba@iba.edu.pk", "full_name": "Ali Khan", "uni": "Institute of Business Administration (IBA)", "pass": "pass123", "phone": "03001111111"},
            {"email": "sara.iba@iba.edu.pk", "full_name": "Sara Ahmed", "uni": "Institute of Business Administration (IBA)", "pass": "pass123", "phone": "03002222222"},
            # FAST Students
            {"email": "bilal.fast@nu.edu.pk", "full_name": "Bilal Raza", "uni": "FAST-NUCES", "pass": "pass123", "phone": "03003333333"},
            {"email": "zainab.fast@nu.edu.pk", "full_name": "Zainab Ali", "uni": "FAST-NUCES", "pass": "pass123", "phone": "03004444444"},
            # NED Students
            {"email": "fahad.ned@neduet.edu.pk", "full_name": "Fahad Mustafa", "uni": "NED University of Engineering and Technology", "pass": "pass123", "phone": "03005555555"},
        ]

        print("Creating Users...")
        for u in users_data:
            # Check if exists
            existing = session.exec(select(User).where(User.email == u["email"])).first()
            if not existing:
                user = User(
                    email=u["email"],
                    full_name=u["full_name"],
                    university=u["uni"],
                    password_hash=get_hash(u["pass"]),
                    phone=u["phone"]
                )
                session.add(user)
        session.commit()

        # 2. Create Rides
        from datetime import date, timedelta
        today = date.today().isoformat()
        tomorrow = (date.today() + timedelta(days=1)).isoformat()
        
        rides_data = [
            # IBA Rides
            {"driver": "ali.iba@iba.edu.pk", "origin": "Gulshan-e-Iqbal", "dest": "Institute of Business Administration (IBA)", "time": "08:00", "date": tomorrow},
            {"driver": "sara.iba@iba.edu.pk", "origin": "Gulistan-e-Jauhar", "dest": "Institute of Business Administration (IBA)", "time": "09:00", "date": today},
            
            # FAST Rides 
            {"driver": "bilal.fast@nu.edu.pk", "origin": "Gulshan-e-Iqbal", "dest": "FAST-NUCES", "time": "08:15", "date": tomorrow},
            {"driver": "zainab.fast@nu.edu.pk", "origin": "North Nazimabad", "dest": "FAST-NUCES", "time": "08:30", "date": today},

             # NED Rides
            {"driver": "fahad.ned@neduet.edu.pk", "origin": "Gulshan-e-Iqbal", "dest": "NED University of Engineering and Technology", "time": "08:45", "date": tomorrow},
        ]

        print("Creating Rides...")
        for r in rides_data:
             # Check if exact ride exists to avoid duplicates on re-run
            existing = session.exec(select(Ride).where(
                Ride.driver_email == r["driver"],
                Ride.origin_area == r["origin"],
                Ride.departure_time == r["time"],
                Ride.date == r["date"]
            )).first()
            
            if not existing:
                ride = Ride(
                    driver_email=r["driver"],
                    origin_area=r["origin"],
                    destination_area=r["dest"],
                    departure_time=r["time"],
                    date=r["date"],
                    seats_available=3,
                    whatsapp_number="03001234567"
                )
                session.add(ride)
        
        session.commit()
        print("Dummy Data Populated Successfully!")

if __name__ == "__main__":
    create_dummy_data()
