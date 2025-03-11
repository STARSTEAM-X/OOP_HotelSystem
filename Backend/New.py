from datetime import datetime

class Account:
    def __init__(self, username, password, role):
        self.__username = username
        self.__password = password
        self.__role = role

    @property
    def username(self):
        return self.__username
    
    @property
    def role(self):
        return self.__role
    
    def login(self, username, password):
        if self.__username == username and self.__password == password:
            return True
        return False

class User:
    def __init__(self, name, email, phone, account):
        self.__name = name
        self.__email = email
        self.__phone = phone
        self.__account = account
        
    @property
    def name(self):
        return self.__name
    
    @property
    def email(self):
        return self.__email
    
    @property
    def phone(self):
        return self.__phone
    
    @property
    def account(self):
        return self.__account
    
    @name.setter
    def name(self, name):
        self.__name = name

    @email.setter
    def email(self, email):
        self.__email = email

    @phone.setter
    def phone(self, phone):
        self.__phone = phone

class Customer(User):
    def __init__(self, name, email, phone_number, account):
        super().__init__(name, email, phone_number, account)
        self.selected_room = []

    def select_room(self, room, hotel,check_in, check_out):
        if hotel.check_availability(check_in, check_out, room):
            self.selected_room.append(room)
            return f"Room {room.id} has been selected"
        else:
            return False #"Room is not available"

    def delete_room(self, room):
        if room in self.selected_room:
            self.selected_room.remove(room)
            return f"Room {room.id} has been removed"
        else:
            return False #"Room is not selected"

class Admin(User):
    def __init__(self, name, email, phone_number, account, position):
        super().__init__(name, email, phone_number, account)
        self.__position = position

class Room:
    def __init__(self, id, type, price, capacity, image, description, details):
        self.__id = id
        self.__type = type
        self.__price = price
        self.__capacity = capacity
        self.__image = image
        self.__description = description
        self.__details = details

    @property
    def id(self):
        return self.__id
    
    @property
    def type(self):
        return self.__type
    
    @property
    def price(self):
        return self.__price
    
    @property
    def capacity(self):
        return self.__capacity
    
    @property
    def image(self):
        return self.__image
    
    @property
    def description(self):
        return self.__description
    
    @property
    def details(self):
        return self.__details
    
    @id.setter
    def id(self, id):
        self.__id = id

    @type.setter
    def type(self, type):
        self.__type = type

    @price.setter
    def price(self, price):
        self.__price = price

    @capacity.setter
    def capacity(self, capacity):
        self.__capacity = capacity

    @image.setter
    def image(self, image):
        self.__image = image

    @description.setter
    def description(self, description):
        self.__description = description

    @details.setter
    def details(self, details):
        self.__details = details

class Booking:
    def __init__(self, id, check_in, check_out, customer):
        
        self.__id = id
        self.__customer = customer
        self.__check_in =  datetime.strptime(check_in, "%Y-%m-%d").strftime("%Y-%m-%d")
        self.__check_out = datetime.strptime(check_out, "%Y-%m-%d").strftime("%Y-%m-%d")
        self.__room = customer.selected_room
        self.__price = sum([room.price for room in self.__room])*self.num_days()
        self.__final_price = self.__price
        self.__status = 0 # 0: Pending, 1: Confirmed, 2: Cancelled
        self.__discount = None
        self.__payment = None
        self.__invoice = None

    @property
    def id(self):
        return self.__id
    
    def num_days(self):
        return (datetime.strptime(self.__check_out, "%Y-%m-%d") - datetime.strptime(self.__check_in, "%Y-%m-%d")).days
    
    @property
    def check_in(self):
        return self.__check_in
    
    @property
    def check_out(self):
        return self.__check_out
    
    @property
    def room(self):
        return self.__room
    
    @property
    def price(self):
        return self.__price
    
    @property
    def final_price(self):
        return self.__final_price
    
    @property
    def customer(self):
        return self.__customer
    
    @property
    def status(self):
        return self.__status
    
    @id.setter
    def id(self, id):
        self.__id = id

    @check_in.setter
    def check_in(self, check_in):
        self.__check_in = check_in

    @check_out.setter
    def check_out(self, check_out):
        self.__check_out = check_out

    @room.setter
    def room(self, room):
        self.__room = room

    @customer.setter
    def customer(self, customer):
        self.__customer = customer

    @price.setter
    def price(self, price):
        self.__price = price
    
    @final_price.setter
    def final_price(self, final_price):
        self.__final_price = final_price

    @property
    def payment(self):
        return self.__payment

    @status.setter
    def status(self, status):
        self.__status = status

    def apply_discount(self, discount):
        if self.__status == 1:
            return False #"Booking is Confirmed"
        if isinstance(discount, Discount):
            self.__discount = discount
            self.__final_price = self.__price - (self.__price * discount.value / 100)
            return f"Discount {discount.code} has been applied"
        else:
            return False #"Invalid discount"

    def confirm_booking(self, hotel):
        # ตรวจสอบว่าห้องยังว่างอยู่หรือไม่ก่อนยืนยันการจอง
        for room in self.__room:
            if not hotel.check_availability(self.__check_in, self.__check_out, room):
                return False #f"Room {room.id} is no longer available"
        
        # ถ้าผ่านการตรวจสอบแล้ว ให้ทำการยืนยัน
        self.__payment = Payment(self, self.__final_price)
        self.__invoice = Invoice(self)
        self.__status = 1  # เปลี่ยนสถานะเป็น Confirmed
        return f"Booking {self.__id} has been confirmed"


    def cancel_booking(self):
        self.__status = 2
        if self.__payment:
            self.__payment.status = 2
        if self.__invoice:
            self.__invoice.status = 2

    def make_payment(self, method):
        if self.__status != 1:
            return False #"Booking must be confirmed before payment"
        if self.__payment is None:
            self.__payment = Payment(self, self.__final_price)
        return self.__payment.make_payment(method)
    
    def get_invoice(self):
        if not hasattr(self, '__invoice'):
            self.__invoice = Invoice(self)
        return self.__invoice.get_invoice_details()


class Discount:
    def __init__(self, code, value):
        self.__code = code
        self.__value = value

    @property
    def code(self):
        return self.__code
    
    @property
    def value(self):
        return self.__value
    

class Payment:
    def __init__(self, booking, amount):
        self.__booking = booking
        self.__method = None  # ยังไม่ระบุวิธีการชำระเงิน
        self.__amount = amount
        self.__status = 0  # 0: Pending, 1: Paid, 2: Cancelled

    def make_payment(self, method):
        if self.__status == 1:
            return False #"Payment already completed"
        if method not in ["Credit Card", "Bank Transfer", "Cash"]:
            return False #"Invalid payment method"
        
        self.__method = method
        self.__status = 1  # เปลี่ยนสถานะเป็น Paid
        return f"Payment for booking {self.__booking.id} completed via {method}"

    @property
    def status(self):
        return self.__status

class Invoice:
    def __init__(self, booking):
        self.__id = f"INV-{booking.id}"
        self.__booking = booking
        self.__date = datetime.now()
        self.__amount = booking.final_price
        self.__status = 0  # 0: Unpaid, 1: Paid, 2: Cancelled

    def get_invoice_details(self):
        self.update_status()
        
        return {
            "Invoice ID": self.__id,
            "Booking ID": self.__booking.id,
            "Date Issued": self.__date,
            "Total Amount": self.__amount,
            "Payment Status": self.__status,
            "Room Details": [
                {
                    "Room ID": room.id,
                    "Room Type": room.type,
                    "Price per Night": room.price,
                    "Capacity": room.capacity,
                }
                for room in self.__booking.room
            ]
        }
    
    def update_status(self):
        if self.__booking.payment.status == 0:
            self.__status = "Unpaid"
        elif self.__booking.payment.status == 1:
            self.__status = "Paid"
        else:
            self.__status = "Cancelled"

class Feedback:
    def __init__(self, customer, message, rating):
        self.__customer = customer
        self.__message = message
        self.__rating = rating
        self.__date = datetime.now()

    @property
    def customer(self):
        return self.__customer
    
    @property
    def message(self):
        return self.__message
    
    @property
    def rating(self):
        return self.__rating
    
    @property
    def date(self):
        return self.__date

class Review:
    def __init__(self, room_id,customer, message):
        self.__room_id = room_id
        self.__customer = customer
        self.__message = message
        self.__date = datetime.now()

    @property
    def room_id(self):
        return self.__room_id

    @property
    def customer(self):
        return self.__customer
    
    @property
    def message(self):
        return self.__message
    
    @property
    def date(self):
        return self.__date
    
class Hotel:
    def __init__(self, name: str, address: str, phone: str, email: str):
        self.__name = name
        self.__address = address
        self.__phone_number = phone
        self.__email = email
        self.__users = []
        self.__rooms = []
        self.__bookings = []
        self.__discounts = []
        self.__feedbacks = []
        self.__reviews = []

    def get_name(self):
        return self.__name
    
    def get_info(self):
        return F"Address: {self.__address} Phone Number: {self.__phone_number} Email: {self.__email}"

    def add_user(self, user: User):
            if user.account.username not in [u.account.username for u in self.__users]:
                self.__users.append(user)
                return f'User {user.account.username} has been added'
            else:
                return False #f"User '{user.account.username}' already exists"

    def add_room(self, room):
            if room not in self.__rooms:
                self.__rooms.append(room)
                return f'Room {room.id} has been added'
            else:
                return False #"Room already exists"

    def add_booking(self, booking: Booking):
            if booking not in self.__bookings:
                self.__bookings.append(booking)
                return f'Booking {booking.id} has been added'
            else:
                return False #"Booking already exists"

    def add_discount(self, discount: Discount):
        if discount not in self.__discounts:
            self.__discounts.append(discount)
            return f'Discount {discount.code} has been added'
        else:
            return False #"Discount already exists"

    def add_feedback(self, feedback):
        if feedback not in self.__feedbacks:
            self.__feedbacks.append(feedback)
            return f'Feedback from {feedback.customer.name} has been added'
        else:
            return False #"Feedback already exists"

    def add_review(self, review):
        if review not in self.__reviews:
            self.__reviews.append(review)
            return f'Review from {review.customer.name} has been added'
        else:
            return False #"Review already exists"

    def get_all_users(self):
        return self.__users
    
    def get_all_rooms(self):
        return self.__rooms
    
    def get_all_bookings(self):
        return self.__bookings
    
    def get_all_discounts(self):
        return self.__discounts
    
    def get_all_feedbacks(self):
        return self.__feedbacks
    
    def get_all_reviews(self):
        return self.__reviews
    
    def get_user_by_username(self, username):
        for user in self.__users:
            if user.account.username == username:
                return user
        else:
            return False #"User not found"
    
    def get_room_by_id(self, id):
        for room in self.__rooms:
            if room.id == id:
                return room
        else:
            return False #"Room not found"
            
    def get_booking_by_id(self, id):
        for booking in self.__bookings:
            if booking.id == id:
                return booking
        else:
            return False #"Booking not found"
            
    def get_discount_by_code(self, code):
        for discount in self.__discounts:
            if discount.code == code:
                return discount
        else:
            return False #"Discount not found"
            
    def get_feedback_by_customer(self, customer):
        feedbacks = []
        for feedback in self.__feedbacks:
            if feedback.customer == customer:
                feedbacks.append(feedback)
        return feedbacks
    
    def get_review_by_room_id(self, room_id):
        reviews = []
        for review in self.__reviews:
            if review.room_id == room_id:
                reviews.append(review)
        return reviews
    
    def get_booking_by_customer(self, customer):
        bookings = []
        for booking in self.__bookings:
            if booking.customer == customer:
                bookings.append(booking)
        return bookings

    def check_availability(self, check_in, check_out, *rooms):
        check_in = datetime.strptime(check_in, "%Y-%m-%d").date()
        check_out = datetime.strptime(check_out, "%Y-%m-%d").date()

        for booking in self.__bookings:
            for room in rooms:
                if room in booking.room and booking.status == 1:  # ตรวจเฉพาะ booking ที่ยืนยันแล้ว
                    booked_in = datetime.strptime(booking.check_in, "%Y-%m-%d").date()
                    booked_out = datetime.strptime(booking.check_out, "%Y-%m-%d").date()
                    
                    # ตรวจสอบว่ามีการจองห้องในวันที่เดียวกันหรือไม่
                    if (check_in >= booked_in and check_in <=booked_out):
                        return False  # ห้องถูกจองแล้ว
                    elif(check_out > booked_in and check_out <= booked_out):
                        return False  # ห้องถูกจองแล้ว
        return True  # ห้องว่าง

    
    def authenticate(self, username, password):
        for user in self.__users:
            if user.account.login(username, password):
                return user
        return None
    

def create_instance():
    hotel = Hotel("AAA Hotel", "123 Street", "097-xxx-xxxx","AAAHotel@gmail.com")
    admin1 = Admin("Admin1", "Admin1@gmail.com", "097-xxx-xxxx", Account("admin1", "1234", "admin"), "Manager")
    customer1 = Customer("Customer1", "Customer1@gmail.com", "097-xxx-xxxx", Account("customer1", "1234", "customer"))
    customer2 = Customer("Customer2", "Customer2@gmail.com", "097-xxx-xxxx", Account("customer2", "1234", "customer"))

    print("\n\n Add User")
    print(hotel.add_user(admin1))
    print(hotel.add_user(customer1))
    print(hotel.add_user(customer2))

    room1 = Room("101", "Standard", 3000, 2, "image1.jpg", "Description 1", "Details 1")
    room2 = Room("102", "Suite Room", 3000, 3, "image1.jpg", "Description 1", "Details 1")
    room3 = Room("201", "Deluxe", 5000, 2, "image2.jpg", "Description 2", "Details 2")

    print("\n\n Add Room")
    print(hotel.add_room(room1))
    print(hotel.add_room(room2))
    print(hotel.add_room(room3))

    discount1 = Discount("DISCOUNT1", 10)
    discount2 = Discount("DISCOUNT2", 20)
    discount3 = Discount("DISCOUNT3", 30)
    discount4 = Discount("DISCOUNT4", 40)

    print("\n\n Add Discount")
    print(hotel.add_discount(discount1))
    print(hotel.add_discount(discount2))
    print(hotel.add_discount(discount3))
    print(hotel.add_discount(discount4))

    print("\n\n Customer1 Select Room")
    print(customer1.select_room(room1, hotel, "2025-03-11", "2025-03-13"))
    print(customer1.select_room(room2, hotel, "2025-03-11", "2025-03-13"))

    booking1 = Booking("BOOK-01", "2025-03-11", "2025-03-13", customer1)
    print(hotel.add_booking(booking1))
    print(booking1.apply_discount(discount1))
    print(booking1.confirm_booking(hotel))
    print(booking1.make_payment("Credit Card"))
    print(booking1.get_invoice())
    feedback1 = Feedback(customer1, "Good", 5)
    print(hotel.add_feedback(feedback1))
    review1 = Review("101", customer1, "Good")
    print(hotel.add_review(review1))

    print("\n\n Customer2 Select Room")
    print(customer2.select_room(room1, hotel, "2025-03-14", "2025-03-15"))

    booking2 = Booking("BOOK-02", "2025-03-14", "2025-03-15", customer2)
    print(hotel.add_booking(booking2))
    print(booking2.apply_discount(discount2))
    print(booking2.confirm_booking(hotel))
    print(booking2.make_payment("Bank Transfer"))
    print(booking2.get_invoice())
    feedback2 = Feedback(customer2, "Good", 5)
    print(hotel.add_feedback(feedback2))
    review2 = Review("101", customer2, "Good")
    print(hotel.add_review(review2))


if __name__ == "__main__":
    create_instance()