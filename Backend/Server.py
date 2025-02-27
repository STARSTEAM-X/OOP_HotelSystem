from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS

class Hotel:
    def __init__(self, name: str):
        self.__name = name
        self.__users = []
        self.__rooms = []
        self.__bookings = []
        self.__discounts = []
        self.__reviews = []
        self.__feedbacks = []

    @property
    def name(self):
        return self.__name
    
    def get_all_users(self):
        return self.__users
    
    def get_all_rooms(self):
        return self.__rooms
    
    def get_all_bookings(self):
        return self.__bookings
    
    def get_all_discounts(self):
        return self.__discounts
    
    def get_all_reviews(self):
        return self.__reviews
    
    def get_all_feedbacks(self):
        return self.__feedbacks
    
    def add_user(self, user: "User"):
        self.__users.append(user)
        return "User added successfully"
    
    def add_room(self, room: "Room"):
        self.__rooms.append(room)
        return "Room added successfully"
    
    def add_booking(self, booking: "Booking"):
        self.__bookings.append(booking)

    def add_discount(self, discount: "Discount"):
        self.__discounts.append(discount)

    def add_review(self, review: "Review"):
        self.__reviews.append(review)

    def add_feedback(self, feedback: "Feedback"):
        self.__feedbacks.append(feedback)

    def find_room_by_id(self, room_id: str):
        for room in self.__rooms:
            if room.id == room_id:
                return room
            
    def find_booking_by_id(self, booking_id: str):
        for booking in self.__bookings:
            if booking.id == booking_id:
                return booking
            
    def find_booking_by_username(self, username: str):
        for booking in self.__bookings:
            if booking.customer.username == username:
                return booking
            
    def find_discount_by_code(self, discount_code: str):
        for discount in self.__discounts:
            if discount.code == discount_code:
                return discount
            
    def find_review_by_room_id(self, room_id: str):
        for review in self.__reviews:
            if review.room_id == room_id:
                return review
            
    def find_feedback_by_booking_id(self, booking_id: str):
        for feedback in self.__feedbacks:
            if feedback.booking_id == booking_id:
                return feedback
    
    def find_user_by_username(self, username: str):
        for user in self.__users:
            if user.username == username:
                return user
            
    def find_available_rooms(self, checkin: datetime, checkout: datetime):
        available_rooms = []
        for room in self.__rooms:
            booking_conflict = False
            for booking in self.__bookings:
                if room in booking.rooms:
                    if (checkin <= booking.dateout and checkout >= booking.datein):
                        booking_conflict = True
                        break
            if not booking_conflict:
                available_rooms.append(room)
        return available_rooms

class User:
    def __init__(self, username: str, password: str, name: str,phone:str,role:str=None):
        self.__username = username
        self.__password = password
        self.__name = name
        self.__phone = phone
        self.__role = role
    
    @property
    def username(self):
        return self.__username
    
    @property
    def password(self):
        return self.__password
    
    @property
    def name(self):
        return self.__name
    
    @property
    def phone(self):
        return self.__phone
    
    @property
    def role(self):
        return self.__role
    
    @username.setter
    def username(self, username: str):
        self.__username = username

    @password.setter
    def password(self, password: str):
        self.__password = password

    @name.setter
    def name(self, name: str):
        self.__name = name

    @phone.setter
    def phone(self, phone: str):
        self.__phone = phone

    @role.setter
    def role(self, role: str):
        self.__role = role

class Customer(User):
    def __init__(self, username: str, password: str, name: str,phone:str):
        super().__init__(username, password, name, phone, role="Customer")
        self.__selected_room = []

    def add_selected_room(self, room: "Room"):
        if room not in self.__selected_room:
            self.__selected_room.append(room)
            return True
        return False
    
    def del_selected_room(self, room: "Room"):
        if room in self.__selected_room:
            self.__selected_room.remove(room)
            return True
        return False
    
    def get_selected_room(self):
        return self.__selected_room
        

class Admin(User):
    def __init__(self, username: str, password: str, name: str,phone:str):
        super().__init__(username, password, name, phone, role="Admin")


class Room:
    def __init__(self, id: str, room_type: str, price: float, description: str, details:str, image:str):
        self.__id = id
        self.__room_type = room_type
        self.__price = price
        self.__description = description
        self.__details = details
        self.__image = image
        self.__booking_history = []

    @property
    def id(self):
        return self.__id
    
    @property
    def room_type(self):
        return self.__room_type
    
    @property
    def price(self):
        return self.__price
    
    @property
    def description(self):
        return self.__description
    
    @property
    def details(self):
        return self.__details
    
    @property
    def image(self):
        return self.__image
    
    @id.setter
    def id(self, id: str):
        self.__id = id

    @room_type.setter
    def room_type(self, room_type: str):
        self.__room_type = room_type
    
    @price.setter
    def price(self, price: float):
        self.__price = price

    @description.setter
    def description(self, description: str):
        self.__description = description

    @details.setter
    def details(self, details: str):
        self.__details = details

    @image.setter
    def image(self, image: str):
        self.__image = image

    def add_booking_history(self, lst,customer_name):
        self.__booking_history.extend((date, customer_name) for date in lst)  # เก็บเป็น Tuple 

    def del_booking_history(self, lst):
        for date in lst:
            self.__booking_history = [entry for entry in self.__booking_history if entry[0] != date]


    def check_available(self, datein, dateout):
        if isinstance(datein, str):
            date1 = datetime.strptime(datein, "%d-%m-%Y")
        else:
            date1 = datein

        if isinstance(dateout, str):
            date2 = datetime.strptime(dateout, "%d-%m-%Y")
        else:
            date2 = dateout

        # สร้างลิสต์ของวันที่ในช่วงนั้น (รวมวันสุดท้ายด้วย)
        lst = [(date1 + timedelta(days=i)).strftime("%d-%m-%Y") for i in range((date2 - date1).days + 1)]

        # ถ้ามีวันใดวันหนึ่งในช่วงที่ถูกจองแล้ว return False
        return not any(date in self.__booking_history for date in lst)

    def get_booking_history(self):
        return self.__booking_history

class Booking:
    def __init__(self, id: str, customer: str, datein: datetime, dateout: datetime):
        self.__id = id
        self.__customer = customer
        self.__rooms = customer.get_selected_room()
        self.__datein = datein
        self.__dateout = dateout
        self.__price = sum(room.price for room in self.__rooms)
        self.__final_price = self.__price
        self.__discount = None
        self.__payment = None
        self.__invoice = None
        self.__status = "UnConfirmed"

    @property
    def id(self):
        return self.__id
    
    @property
    def customer(self):
        return self.__customer
    
    @property
    def rooms(self):
        return self.__rooms
    
    @property
    def datein(self):
        return self.__datein
    
    @property
    def dateout(self):
        return self.__dateout
    
    @property
    def price(self):
        return self.__price
    
    @property
    def final_price(self):
        return self.__final_price
    
    @property
    def discount(self):
        return self.__discount
    
    @property
    def payment(self):
        return self.__payment
    
    @property
    def invoice(self):
        return self.__invoice
    
    @property
    def status(self):
        return self.__status
    
    @id.setter
    def id(self, id: str):
        self.__id = id

    @customer.setter
    def customer(self, customer: str):
        self.__customer = customer

    @rooms.setter
    def rooms(self, rooms: list):
        self.__rooms = rooms

    @datein.setter
    def datein(self, datein: datetime):
        self.__datein = datein

    @dateout.setter
    def dateout(self, dateout: datetime):
        self.__dateout = dateout

    @price.setter
    def price(self, price: float):
        self.__price = price

    @final_price.setter
    def final_price(self, final_price: float):
        self.__final_price = final_price

    @discount.setter
    def discount(self, discount):
        self.__discount = discount

    @payment.setter
    def payment(self, payment: "Payment"):
        self.__payment = payment

    @invoice.setter
    def invoice(self, invoice: "Invoice"):
        self.__invoice = invoice

    def apply_discount(self, discount: "Discount"):
        self.__discount = discount
        self.__final_price = self.price - discount.calculate_discount(self.price)

    def confirm_booking(self):
        self.__status = "Confirmed"
        print(self.__datein)
        print(self.__dateout)

        unavailable_rooms = []
        for room in self.__rooms:
            if not room.check_available(self.__datein, self.__dateout):
                unavailable_rooms.append(room.name)

    def cancel_booking(self):
        self.__status = "Cancelled"
        for room in self.__rooms:
            room.del_booking_history([self.__datein, self.__dateout])


    def make_payment(self, payment: "Payment"):
        self.__payment = payment.make_payment(self.__final_price)
        self.__invoice = Invoice(self.__id, self.__customer, self.__final_price)
        

    def __str__(self):
        return f"Booking ID: {self.__id}, Customer: {self.__customer}, Date: {self.__datein} - {self.__dateout}, Price: {self.__price}, Final Price: {self.__final_price}"


class Payment:
    def __init__(self,booking:Booking, price: int, method: str):
        self.__booking = booking
        self.__price = price
        self.__method = method
        self.__status = "Unpaid"

    @property
    def booking(self):
        return self.__booking
    
    @property
    def price(self):
        return self.__price
    
    @property
    def method(self):
        return self.__method
    @property
    def status(self):
        return self.__status
    
    @booking.setter
    def booking(self, booking: "Booking"):
        self.__booking = booking

    @price.setter
    def price(self, price: int):
        self.__price = price

    @method.setter
    def method(self, method: str):
        self.__method = method

    def make_payment(self, price: int):
        self.__status = "Paid"
        return True
    
    def __str__(self):
        return f"Payment Method: {self.__method}, Price: {self.__price}, Status: {self.__status}"
    


class Invoice:
    def __init__(self, booking_id: str, customer: str, price: int):
        self.__booking_id = booking_id
        self.__customer = customer
        self.__price = price
        self.__status = "Unpaid"


    @property
    def booking_id(self):
        return self.__booking_id
    
    @property
    def customer(self):
        return self.__customer
    
    @property
    def price(self):
        return self.__price
    
    @property
    def status(self):
        return self.__status
    
    @booking_id.setter
    def booking_id(self, booking_id: str):
        self.__booking_id = booking_id

    @customer.setter
    def customer(self, customer: str):
        self.__customer = customer

    @price.setter
    def price(self, price: int):
        self.__price = price

    @status.setter
    def status(self, status: str):
        self.__status = status

    def __str__(self):
        return f"Invoice ID: {self.__booking_id}, Customer: {self.__customer}, Price: {self.__price}, Status: {self.__status}"

class Discount:
    def __init__(self, code: str, type: str, amount: int):
        self.__code = code
        self.__type =  type
        self.__amount = amount

    @property
    def code(self):
        return self.__code
    
    @property
    def type(self):
        return self.__type
    
    @property
    def amount(self):
        return self.__amount
    
    @code.setter
    def code(self, code: str):
        self.__code = code

    @type.setter
    def type(self, type: str):
        self.__type = type

    @amount.setter
    def amount(self, amount: int):
        self.__amount = amount

    def calculate_discount(self, price: int):
        if self.__type == "Percentage":
            return price * self.__amount / 100
        elif self.__type == "Fixed":
            return self.__amount
        
    def __str__(self):
        return f"Discount Code: {self.__code}, Type: {self.__type}, Amount: {self.__amount}"

class Review:
    def __init__(self, room_id: str, rating: int, comment: str):
        self.__room_id = room_id
        self.__rating = rating
        self.__comment = comment

class Feedback:
    def __init__(self, booking_id: str, rating: int, comment: str):
        self.__booking_id = booking_id
        self.__rating = rating
        self.__comment = comment

def create_instance():
    hotel = Hotel("Grand Hotel")

    room1 = Room(id="101", room_type="Deluxe Room", price=100,description="A luxurious room with a beautiful view and modern amenities.",details="This room includes a king-size bed, a walk-in closet, a balcony, and a jacuzzi.",image="https://cdn.discordapp.com/attachments/1252629751332474972/1342621093361356940/2.2.png?ex=67bc4715&is=67baf595&hm=6c397f909d8104fffd42d79d9582c7e2f1baf206ba404c1577b774815f4e6793&")
    room2 = Room(id="102", room_type="Suite Room", price=150,description="A spacious suite with a living area and premium facilities.",details="Includes a spacious living area, minibar, and a private balcony with sea view.",image="https://cdn.discordapp.com/attachments/1252629751332474972/1342621093361356940/2.2.png?ex=67bc4715&is=67baf595&hm=6c397f909d8104fffd42d79d9582c7e2f1baf206ba404c1577b774815f4e6793&")
    room3 = Room(id="103", room_type="Standard Room", price=150,description="Comfortable and affordable room with all basic amenities.",details="This room offers a cozy bed, a desk for work, and a flat-screen TV.",image="https://cdn.discordapp.com/attachments/1252629751332474972/1342621093361356940/2.2.png?ex=67bc4715&is=67baf595&hm=6c397f909d8104fffd42d79d9582c7e2f1baf206ba404c1577b774815f4e6793&")

    lst_room = [room1, room2, room3]
    for room in lst_room:
        hotel.add_room(room)

    customer1 = Customer(username="STARSTEAM", password="1234", name="STARSTEAM X",phone="1234567890")
    hotel.add_user(customer1)

    discount1 = Discount(code="DISCOUNT10", type="Percentage", amount=10)
    discount2 = Discount(code="DISCOUNT20", type="Percentage", amount=20)
    hotel.add_discount(discount1)
    hotel.add_discount(discount2)

    return hotel


app = Flask(__name__)
hotel_instance = create_instance()
CORS(app)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    user = hotel_instance.find_user_by_username(username)

    if user and user.password == password:
        # ส่งผลลัพธ์ในรูปแบบ JSON
        return {"message": "Login successful", "username": username}, 200  # รหัส 200 คือ OK
    
    return {"message": "Invalid username or password"}, 401  # รหัส 401 คือ Unauthorized


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    name = data.get('name')
    phone = data.get('phone')

    if not username or not password or not name or not phone:
        return jsonify({"error": "Missing required fields"}), 400

    if hotel_instance.find_user_by_username(username):
        return jsonify({"error": "Username already exists"}), 400

    new_user = Customer(username, password, name, phone)
    hotel_instance.add_user(new_user)

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/api/get_available_rooms', methods=['POST'])
def get_available_rooms():
    data = request.get_json()
    checkin = datetime.strptime(data['checkin'], '%Y-%m-%d')
    checkout = datetime.strptime(data['checkout'], '%Y-%m-%d')
    available_rooms = hotel_instance.find_available_rooms(checkin, checkout)
    rooms_info = [{"id": room.id, "name": room.room_type, "price": room.price,"description": room.description,"details": room.details,"image": room.image} for room in available_rooms]
    return jsonify(rooms_info)

@app.route('/api/user_select_room', methods=['POST'])
def user_select_room():
    data = request.get_json()
    customer = hotel_instance.find_user_by_username(data['username'])
    room = hotel_instance.find_room_by_id(data['room_id'])

    if not customer:
        return "User not found"
    if not room:
        return "Room not found"

    result = customer.add_selected_room(room)
    if result:
        return "Room selected successfully"
    return "Room already selected"

@app.route('/api/user_deselect_room', methods=['POST'])
def user_deselect_room():
    data = request.get_json()
    customer = hotel_instance.find_user_by_username(data['username'])
    room = hotel_instance.find_room_by_id(data['room_id'])

    if not customer:
        return "User not found"
    if not room:
        return "Room not found"

    result = customer.del_selected_room(room)
    if result:
        return "Room deselected successfully"
    return "Room not selected"

@app.route('/api/user_make_booking', methods=['POST'])
def user_make_booking():
    data = request.get_json()
    customer = hotel_instance.find_user_by_username(data['username'])
    datein = datetime.strptime(data['checkin'], '%Y-%m-%d')
    dateout = datetime.strptime(data['checkout'], '%Y-%m-%d')
    if not customer:
        return "User not found"
    if not datein or not dateout:
        return "Invalid date format"
    if datein > dateout:
        return "Invalid date range"
    if not customer.get_selected_room():
        return "No room selected"
    booking = Booking(id= F'BOOK_{len(hotel_instance.get_all_bookings())+1}', customer=customer, datein=datein, dateout=dateout)
    hotel_instance.add_booking(booking)
    return booking.id

@app.route('/api/user_add_discount', methods=['POST'])
def user_add_discount():
    data = request.get_json()
    booking = hotel_instance.find_booking_by_id(data['booking_id'])
    discount = hotel_instance.find_discount_by_code(data['discount_code'])
    print(data)
    print(booking)
    print(discount)

    if not booking:
        return "Booking not found",500
    
    if not discount:
        return "Discount not found",500
    
    booking.apply_discount(discount)
    print(booking.price)
    print(booking.final_price)
    result = {
        "booking_id": booking.id,
        "price": booking.price,
        "final_price": booking.final_price,
        "discount": discount.calculate_discount(booking.price)
    }
    return jsonify(result),200

@app.route('/api/user_confirm_booking', methods=['POST'])
def user_confirm_booking():
    data = request.get_json()
    booking = hotel_instance.find_booking_by_id(data['booking_id'])
    booking.confirm_booking()
    return booking.id

@app.route('/api/pay_booking', methods=['POST'])
def pay_booking():
    data = request.get_json()
    booking = hotel_instance.find_booking_by_id(data['booking_id'])
    payment = Payment(booking=booking, price=booking.final_price, method=data['method'])
    booking.make_payment(payment)
    booking.invoice.status = "Paid"
    return "Payment successful"

@app.route('/api/get_booking_status', methods=['POST'])
def get_booking_status():
    data = request.get_json()
    booking = hotel_instance.find_booking_by_id(data['booking_id'])
    return booking.status

@app.route('/api/get_booking_invoice', methods=['POST'])
def get_booking_invoice():
    data = request.get_json()
    booking = hotel_instance.find_booking_by_id(data['booking_id'])
    if not booking:
        return "Booking not found", 404
    invoice = booking.invoice
    if not invoice:
        return "Invoice not found", 404
    invoice_info = {
        "booking_id": invoice.booking_id,
        "customer": invoice.customer.name,
        "price": invoice.price,
        "status": invoice.status
    }
    return jsonify(invoice_info)

# New route to get booking details by username

@app.route('/api/booking/<booking_id>', methods=['GET'])
def get_booking_by_username(booking_id):
    booking = hotel_instance.find_booking_by_id(booking_id)
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    booking_info = {
        "selected_rooms": [{"id": room.id, "name": room.room_type, "price": room.price, "description": room.description, "details": room.details, "image": room.image} for room in booking.rooms],
        "start_date": booking.datein.strftime('%Y-%m-%d'),
        "end_date": booking.dateout.strftime('%Y-%m-%d'),
        "discount_amount": booking.discount.amount if booking.discount else 0,
        "total_amount": booking.final_price
    }
    return jsonify(booking_info)

# New route to get booking payment details
@app.route('/api/booking/payment/<booking_id>', methods=['GET'])
def get_booking_payment_by_booking_id(booking_id):
    booking = hotel_instance.find_booking_by_id(booking_id)
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    
    if booking.discount:
        discount = booking.discount.calculate_discount(booking.price)
    else:
        discount = 0

    rooms_info = [{"id": room.id, "name": room.room_type, "price": room.price,"description": room.description,"details": room.details,"image": room.image} for room in booking.rooms]
    payment_info = {
        "rooms": rooms_info,
        "datein": booking.datein.strftime('%Y-%m-%d'),
        "dateout": booking.dateout.strftime('%Y-%m-%d'),
        "discount" : discount,
        "final_price":booking.final_price
    }
    return jsonify(payment_info)

@app.route('/api/booking/invoice/<booking_id>', methods=['GET'])
def get_booking_invoice_by_booking_id(booking_id):
    booking = hotel_instance.find_booking_by_id(booking_id)
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    

    return ""

if __name__ == '__main__':
    app.run(debug=True)