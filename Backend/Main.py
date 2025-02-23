import datetime

class HotelSystem:
    def __init__(self,name):
        self.__name  = name
        self.__rooms = []
        self.__users = []
        self.__bookings = []
        self.__discounts = []
        self.__feedback  = []

class Room:
    def __init__(self, id:str, name:str, type:str, capacity:int, price:int, image:str, description:str, detail:str):
        self.__id  = id
        self.__name = name
        self.__type = type
        self.__capacity = capacity
        self.__price    = price
        self.__image    = image
        self.__description  = description
        self.__detail   = detail
        self.__booking_history  = []
        self.__reviews  = []

class User:
    def __init__(self, id:str, name:str, username:str, password:str, email:str, role:str):
        self.__id = id
        self.__name =  name
        self.__username = username
        self.__password = password
        self.__email = email
        self.__role = role

class Admin(User):
    def __init__(self, id:str, name:str, username:str, password:str, email:str, position:str):
        super().__init__(id, name, username, password, email, "Admin")
        self.__position = position

class Customer(User):
    def __init__(self, id:str, name:str, username:str, password:str, email:str):
        super().__init__(id, name, username, password, email, "Customer")
        self.__selected_room = []

class Booking:
    def __init__(self, id:str, datein:datetime, dateout:datetime, customer:str, rooms:list):
        self.__id = id
        self.__datein = datein
        self.__dateout = dateout
        self.__customer = customer
        self.__rooms = rooms
        self.__price = sum(room._Room__price for room in rooms)
        self.__final_price = self.__price
        self.__payment = None
        self.__invoice = None
        self.__status = "Unpaid"
        self.__discount = None

class Payment:
    def __init__(self, booking:Booking, method:str, amount:int):
        self.__booking = booking
        self.__payment_method = method
        self.__amount_paid = amount
        self.__payment_date = datetime.datetime.now().strftime("%d-%m-%Y")
        self.__status = "Unpaid"

class Invoice:
    def __init__(self, booking:Booking):
        self.__booking = booking
        self.__invoice_date = datetime.datetime.now().strftime("%d-%m-%Y")

class Discount:
    def __init__(self, code:str, type:str, value:int):
        self.__code = code
        self.__type =  type
        self.__value = value

class Review:
    def __init__(self, room_id:str, customer:Customer, rating:float, comment:str):
        self.__room_id = room_id
        self.__customer = customer
        self.__rating = rating
        self.__comment = comment
        self.__date = datetime.datetime.now().strftime("%d-%m-%Y")


class Feedback:
    def __init__(self, id:str, customer:Customer, rating:float, comment:str ,admin:Admin =None):
        self.__id = id
        self.__customer = customer
        self.__admin = admin
        self.__rating = rating
        self.__comment = comment
        self.__date = datetime.datetime.now().strftime("%d-%m-%Y")
