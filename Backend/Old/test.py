from datetime import datetime    


class User:
    def __init__(self, username: str, password: str, name: str, email: str):
        self.username = username
        self.password = password
        self.name = name
        self.email = email

    def authenticate(self, password: str):
        return self.password == password
    
    @property
    def username(self):
        return self.username
    
    @property
    def name(self):
        return self.name
    
    @property
    def email(self):
        return self.email
    
    @username.setter
    def username(self, username: str):
        self.username = username

    @name.setter
    def name(self, name: str):
        self.name = name

    @email.setter
    def email(self, email: str):
        self.email = email

    def set_password(self, password: str):
        self.password = password


class Customer(User):
    def __init__(self, name: str, email: str):
        super().__init__(name, email)
        self.role = "customer"
        self.selected_rooms = []

    def add_room(self, room: "Room") :
        self.selected_rooms.append(room)
    



class Admin(User):
    def __init__(self, name: str, email: str):
        super().__init__(name, email)
        self.role = "admin"
    


class Hotel:
    def __init__(self, name: str):
        self.name = name
        self.users = []
        self.rooms = []
        self.bookings = []
        self.discounts = []
        self.reviews = []
        self.feedbacks = []
    



class Room:
    def __init__(self, id: str, room_type: str, price: int):
        self.id = id
        self.type = room_type
        self.price = price
    
    def get_details(self) -> str:
        return f"Room {self.id}: {self.type}, Price: ${self.price}"
    
    def is_available(self, datein: datetime, dateout: datetime) -> bool:
        for booking in self.bookings:
            if booking.datein <= dateout and booking.dateout >= datein:
                return False


class Booking:
    def __init__(self, customer: Customer, datein: datetime, dateout: datetime, rooms):
        self.customer = customer
        self.datein = datein
        self.dateout = dateout
        self.rooms = rooms
        self.price = sum(room.price for room in rooms)
        self.final_price = self.price
        self.payments = []
        self.invoice = Invoice(self)
        self.discount = None
    
    def calculate_final_price(self) -> int:
        if self.discount:
            self.final_price = self.price - self.discount.apply_discount()
        return self.final_price
    
    def apply_discount(self, discount: 'Discount') -> None:
        self.discount = discount


class Payment:
    def __init__(self, booking: Booking):
        self.booking = booking
    
    def process_payment(self, amount: int) -> bool:
        return True  # Add payment processing logic
    
    def refund(self) -> bool:
        return True  # Add refund logic


class Invoice:
    def __init__(self, booking: Booking):
        self.booking = booking
    
    def generate_invoice(self) -> str:
        return f"Invoice for Booking {self.booking}"
    
    def get_invoice_details(self) -> str:
        return f"Invoice details for Booking {self.booking}"


class Discount:
    def __init__(self, code: str, amount: int, discount_type: str, count: int):
        self.code = code
        self.amount = amount
        self.type = discount_type
        self.count = count


class Review:
    def __init__(self, room_id: str, customer: Customer, rating: float, comment: str, date: datetime):
        self.room_id = room_id
        self.customer = customer
        self.rating = rating
        self.comment = comment
        self.date = date



class Feedback:
    def __init__(self, room_id: str, customer: Customer, rating: float, comment: str, date: datetime):
        self.room_id = room_id
        self.customer = customer
        self.rating = rating
        self.comment = comment
        self.date = date

def create_instance():
    hotel = Hotel("Grand Hotel")

    room1 = Room(id="101", room_type="Single", price=100)
    room2 = Room(id="102", room_type="Double", price=150)
    room3 = Room(id="102", room_type="Double", price=150)
    room4 = Room(id="102", room_type="Double", price=150)
    room5 = Room(id="102", room_type="Double", price=150)
    room6 = Room(id="102", room_type="Double", price=150)
    room7 = Room(id="102", room_type="Double", price=150)
    room8 = Room(id="102", room_type="Double", price=150)
    room9 = Room(id="102", room_type="Double", price=150)
    room10 = Room(id="102", room_type="Double", price=150)

    lst = [room1, room2, room3, room4, room5, room6, room7, room8, room9, room10]
    for room in lst:
        hotel.add_room(room)

    Discount1 = Discount(code="DISCOUNT10", amount=10, discount_type="percentage", count=100)
    Discount2 = Discount(code="DISCOUNT20", amount=20, discount_type="percentage", count=50)

    hotel.apply_discount(Discount1)
    hotel.apply_discount(Discount2)

    customer = Customer(name="John Doe", email="a")