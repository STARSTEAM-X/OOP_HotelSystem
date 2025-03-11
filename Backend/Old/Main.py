from datetime import datetime

class Room:
    def __init__(self, id: str, name: str, room_type: str, price: int, capacity: int, image: str, description: str, detail: str):
        self.__id = id
        self.__name = name
        self.__type = room_type
        self.__price = price
        self.__capacity = capacity
        self.__image = image
        self.__description = description
        self.__detail = detail
        self.__booking_history = []
        self.__reviews = []

    def get_id(self) -> str:
        return self.__id

    def get_name(self) -> str:
        return self.__name

    def get_type(self) -> str:
        return self.__type

    def get_price(self) -> int:
        return self.__price

    def get_image(self) -> str:
        return self.__image

    def get_description(self) -> str:
        return self.__description

    def get_detail(self) -> str:
        return self.__detail

    def get_capacity(self) -> int:
        return self.__capacity

    def add_review(self, review):
        self.__reviews.append(review)
        return "Review added successfully."

    def del_review(self, review_id: str):
        self.__reviews = [review for review in self.__reviews if review.get_room_id() != review_id]
        return "Review deleted successfully."

    def is_available(self, datein: datetime, dateout: datetime) -> bool:
        for booking in self.__booking_history:
            if not (dateout <= booking[0] or datein >= booking[1]):
                return False
        return True

    def set_price(self, new_price: int):
        self.__price = new_price
        return f"Room price updated to {new_price} USD."

    def set_capacity(self, new_capacity: int):
        self.__capacity = new_capacity
        return f"Room capacity updated to {new_capacity} people."


class User:
    def __init__(self, id: str, first_name: str, last_name: str, username: str, password: str, email: str, role: str):
        self.__id = id
        self.__first_name = first_name
        self.__last_name = last_name
        self.__username = username
        self.__password = password
        self.__email = email
        self.__role = role

    def get_id(self) -> str:
        return self.__id

    def get_first_name(self) -> str:
        return self.__first_name

    def get_last_name(self) -> str:
        return self.__last_name

    def get_email(self) -> str:
        return self.__email

    def get_username(self) -> str:
        return self.__username

    def login(self, username: str, password: str) -> bool:
        if self.__username == username and self.__password == password:
            return True
        return False


class Admin(User):
    def __init__(self, id: str, first_name: str, last_name: str, username: str, password: str, email: str, position: str):
        super().__init__(id, first_name, last_name, username, password, email, 'admin')
        self.__position = position

    def get_position(self) -> str:
        return self.__position

    def add_room(self, hotel_system, room: Room):
        return hotel_system.add_room(room)


class Customer(User):
    def __init__(self, id: str, first_name: str, last_name: str, username: str, password: str, email: str):
        super().__init__(id, first_name, last_name, username, password, email, 'customer')
        self.__selected_room = []

    def get_selected_room(self):
        return [room for room in self.__selected_room]

    def add_selected_room(self, room: Room):
        self.__selected_room.append(room)
        return f"Room '{room.get_name()}' added to selected rooms."

    def del_selected_room(self, room: Room):
        self.__selected_room = [r for r in self.__selected_room if r.get_id() != room.get_id()]
        return f"Room '{room.get_name()}' removed from selected rooms."


class Booking:
    def __init__(self, id: str, datein: datetime, dateout: datetime, customer: Customer, status: str = "Unpaid", discount = None):
        self.__id = id
        self.__datein = datein
        self.__dateout = dateout
        self.__customer = customer
        self.__rooms = customer.get_selected_room()
        self.__price = sum(room.get_price() for room in self.__rooms)
        self.__final_price = self.__price
        self.__status = status
        self.__discount = discount
        self.__payment = Payment(self, "Non-Select", self.__final_price, datetime.now())
        self.__invoice = Invoice(self, datetime.now())

    def get_id(self) -> str:
        return self.__id

    def get_datein(self) -> datetime:
        return self.__datein

    def get_dateout(self) -> datetime:
        return self.__dateout

    def get_customer(self) -> Customer:
        return self.__customer

    def get_rooms(self):
        return [room for room in self.__rooms]

    def get_price(self) -> int:
        return self.__price

    def get_payment(self):
        return self.__payment

    def get_invoice(self):
        return self.__invoice

    def calculate_days(self) -> int:
        return (self.__dateout - self.__datein).days

    def update_status(self, status: str):
        self.__status = status
        return f"Booking status updated to {status}."

    def get_status(self) -> str:
        return f"Booking Status: {self.__status}"

    def calculate_total_price(self) -> int:
        total_price = self.__price
        if self.__discount:
            total_price = self.__discount.apply_discount(total_price)
        return total_price

    def confirm_booking(self):
        self.__status = "Paid"
        return "Booking confirmed and marked as paid."

    def cancel_booking(self):
        self.__status = "Cancelled"
        return "Booking has been cancelled."

    def is_confirmed(self) -> bool:
        return self.__status == "Paid"

    def apply_discount(self, discount):
        self.__discount = discount
        self.__final_price = self.calculate_total_price()
        return f"Discount '{discount.get_code()}' applied. New price is {self.__final_price} USD."

    def apply_tax(self, rate: float = 0.07):
        self.__final_price += self.__final_price * rate
        return f"Tax applied. Final price is {self.__final_price} USD."

    def get_discount(self):
        return f"Discount: {self.__discount.get_code() if self.__discount else 'No discount applied'}"

    def update_booking(self, datein: datetime, dateout: datetime, rooms):
        self.__datein = datein
        self.__dateout = dateout
        self.__rooms = rooms
        return "Booking dates and rooms updated."


class Payment:
    def __init__(self, booking: Booking, payment_method: str, amount_paid: float, payment_date: datetime, status: str = "Unpaid"):
        self.__booking = booking
        self.__payment_method = payment_method
        self.__amount_paid = amount_paid
        self.__payment_date = payment_date
        self.__status = status

    def get_booking(self) -> Booking:
        return self.__booking

    def get_payment_date(self) -> datetime:
        return f"Payment Date: {self.__payment_date}"

    def get_payment_method(self) -> str:
        return f"Payment Method: {self.__payment_method}"

    def get_amount_paid(self) -> float:
        return f"Amount Paid: {self.__amount_paid} USD"

    def make_payment(self):
        self.__status = "Paid"
        return "Payment made successfully."

    def cancel_payment(self):
        self.__status = "Cancelled"
        return "Payment cancelled."

    def refund_payment(self):
        self.__status = "Refunded"
        return "Payment refunded."

    def update_status(self, status: str):
        self.__status = status
        return f"Payment status updated to {status}."

    def get_status(self) -> str:
        return f"Payment Status: {self.__status}"

    def update_payment_method(self, method: str):
        self.__payment_method = method
        return f"Payment method updated to {method}."


class Invoice:
    def __init__(self, booking: Booking, invoice_date: datetime):
        self.__booking = booking
        self.__invoice_date = invoice_date

    def generate_invoice(self):
        return "Invoice generated successfully."

    def get_invoice_details(self):
        return f"Invoice for Booking ID: {self.__booking.get_id()} on {self.__invoice_date}"


class Discount:
    def __init__(self, code: str, discount_type: str, value: int):
        self.__code = code
        self.__type = discount_type
        self.__value = value

    def get_code(self) -> str:
        return f"Discount Code: {self.__code}"

    def get_discount_type(self) -> str:
        return f"Discount Type: {self.__type}"

    def get_discount_value(self) -> int:
        return f"Discount Value: {self.__value}"

    def apply_discount(self, price: int) -> int:
        if self.__type == 'percentage':
            return price - (price * self.__value // 100)
        elif self.__type == 'fixed':
            return price - self.__value
        return price


class Review:
    def __init__(self, room_id: str, customer: Customer, rating: float, comment: str, date: datetime):
        self.__room_id = room_id
        self.__customer = customer
        self.__rating = rating
        self.__comment = comment
        self.__date = date

    def get_room_id(self) -> str:
        return f"Room ID: {self.__room_id}"

    def get_customer(self) -> Customer:
        return f"Customer: {self.__customer.get_username()}"

    def get_rating(self) -> float:
        return f"Rating: {self.__rating}"

    def get_comment(self) -> str:
        return f"Comment: {self.__comment}"

    def get_date(self) -> datetime:
        return f"Date: {self.__date}"

    def update_review(self, rating: float, comment: str):
        self.__rating = rating
        self.__comment = comment
        return "Review updated successfully."

    def cancel_review(self):
        return "Review cancelled."


class Feedback:
    def __init__(self, id: str, customer: Customer, admin, comment: str, rating: float, date: datetime):
        self.__id = id
        self.__customer = customer
        self.__admin = admin
        self.__comment = comment
        self.__rating = rating
        self.__date = date

    def get_customer(self) -> Customer:
        return f"Customer: {self.__customer.get_username()}"

    def get_admin(self):
        return f"Admin: {self.__admin.get_username() if self.__admin else 'No admin assigned'}"

    def get_rating(self) -> float:
        return f"Rating: {self.__rating}"

    def submit_feedback(self) -> str:
        return f"Feedback submitted by {self.__customer.get_username()}"

    def get_feedback(self) -> str:
        return f"Feedback: {self.__comment}"

    def cancel_feedback(self):
        return "Feedback cancelled."

    def update_feedback(self, new_comment: str, new_rating: float):
        self.__comment = new_comment
        self.__rating = new_rating
        return "Feedback updated successfully."


class HotelSystem:
    def __init__(self, name: str, address: str):
        self.__name = name
        self.__address = address
        self.__rooms = []
        self.__users = []
        self.__bookings = []
        self.__discounts = []
        self.__feedback = []

    def get_name(self) -> str:
        return f"Hotel Name: {self.__name}"

    def get_address(self) -> str:
        return f"Hotel Address: {self.__address}"

    def get_all_rooms(self):
        return [room.get_name() for room in self.__rooms]
    
    def get_all_users(self):
        return [user.get_username() for user in self.__users]

    def get_all_bookings(self):
        return [booking.get_id() for booking in self.__bookings]

    def get_all_reviews(self):
        reviews = []
        for room in self.__rooms:
            reviews.extend(room._Room__reviews)
        return [review.get_comment() for review in reviews]

    def get_all_feedbacks(self):
        return [feedback.get_feedback() for feedback in self.__feedback]

    def add_room(self, room: Room):
        self.__rooms.append(room)
        return f"Room '{room.get_name()}' added to the hotel."

    def add_user(self, user: User):
        self.__users.append(user)
        return f"User '{user.get_username()}' added to the hotel system."

    def add_booking(self, booking: Booking):
        self.__bookings.append(booking)
        return f"Booking '{booking.get_id()}' added."

    def add_discount(self, discount: Discount):
        self.__discounts.append(discount)
        return f"Discount code '{discount.get_code()}' added."

    def add_feedback(self, feedback: Feedback):
        self.__feedback.append(feedback)
        return f"Feedback from '{feedback.get_customer()}' added."

    def del_room(self, room: Room):
        self.__rooms.remove(room)
        return f"Room '{room.get_name()}' removed from the hotel."

    def del_user(self, user: User):
        self.__users.remove(user)
        return f"User '{user.get_username()}' removed from the hotel system."

    def del_booking(self, booking: Booking):
        self.__bookings.remove(booking)
        return f"Booking '{booking.get_id()}' deleted."

    def del_discount(self, discount: Discount):
        self.__discounts.remove(discount)
        return f"Discount code '{discount.get_code()}' removed."

    def del_feedback(self, feedback: Feedback):
        self.__feedback.remove(feedback)
        return f"Feedback from '{feedback.get_customer()}' deleted."

    def del_room_by_id(self, id: str):
        self.__rooms = [room for room in self.__rooms if room.get_id() != id]
        return f"Room with ID '{id}' deleted."

    def del_user_by_id(self, id: str):
        self.__users = [user for user in self.__users if user.get_id() != id]
        return f"User with ID '{id}' deleted."

    def del_discount_by_code(self, code: str):
        self.__discounts = [discount for discount in self.__discounts if discount.get_code() != code]
        return f"Discount code '{code}' deleted."

    def del_feedback_by_id(self, id: str):
        self.__feedback = [feedback for feedback in self.__feedback if feedback._Feedback__id != id]
        return f"Feedback with ID '{id}' deleted."

    def find_available_room(self, datein: datetime, dateout: datetime):
        available_rooms = [room for room in self.__rooms if room.is_available(datein, dateout)]
        if available_rooms:
            return [room.get_name() for room in available_rooms]
        return "No available rooms for the given dates."

    def find_room_by_id(self, id: str):
        for room in self.__rooms:
            if room.get_id() == id:
                return room.get_name()
        return f"No room found with ID '{id}'"

    def find_user_by_id(self, id: str):
        for user in self.__users:
            if user.get_id() == id:
                return user.get_username()
        return f"No user found with ID '{id}'"

    def find_booking_by_id(self, id: str):
        for booking in self.__bookings:
            if booking.get_id() == id:
                return booking.get_id()
        return f"No booking found with ID '{id}'"

    def find_discount_by_code(self, code: str):
        for discount in self.__discounts:
            if discount.get_code() == code:
                return discount.get_code()
        return f"No discount found with code '{code}'"

    def find_reviews_by_room_id(self, room_id: str):
        room = self.find_room_by_id(room_id)
        if room:
            return [review.get_comment() for review in room._Room__reviews]
        return f"No reviews found for room ID '{room_id}'"

    def update_user(self, user: User):
        for i, u in enumerate(self.__users):
            if u.get_id() == user.get_id():
                self.__users[i] = user
                return f"User '{user.get_username()}' updated successfully."

    def authenticate(self, username: str, password: str) -> bool:
        for user in self.__users:
            if user.login(username, password):
                return f"User '{username}' authenticated successfully."
        return f"Authentication failed for user '{username}'."
    
def main():
    print("Creating a hotel system...")
    hotel = HotelSystem("Grand Hotel", "1234 Hotel Street")

    print("\nCreating rooms...")
    room1 = Room("1", "Standard Room", "Standard", 100, 2, "standard.jpg", "A standard room with basic amenities.", "This room is perfect for a short stay.")
    room2 = Room("2", "Deluxe Room", "Deluxe", 150, 4, "deluxe.jpg", "A deluxe room with additional amenities.", "This room is perfect for a luxurious stay.")

    print("Create Admin and Customer...")
    admin1 = Admin(F"ADMIN_{len([x for x in hotel.get_all_users() if x.id[0:5] == "ADMIN"])}", "John", "Doe", "admin1", "password","email", "Manager")
    customer1 = Customer(F"Customer_{len([ x for x in hotel.get_all_users() if x.id[0:7] == "Customer"])}", "Alice", "Smith", "alice", "password", "email")
    customer2 = Customer(F"Customer_{len([ x for x in hotel.get_all_users() if x.id[0:7] == "Customer"])}", "Bob", "Johnson", "bob", "password", "email")

    print("add addmin and customer to the hotel system...")
    print(hotel.add_user(admin1))
    print(hotel.add_user(customer1))
    print(hotel.add_user(customer2))

    print("\nAdding rooms to the hotel...")
    print(admin1.add_room(hotel,room1))
    print(admin1.add_room(hotel,room2))

    print("\nFinding available rooms for a given date range...")
    print(hotel.find_available_room(datetime(2022, 1, 1), datetime(2022, 1, 5)))

    print("\nAdding selected rooms to a customer...")
    print(customer1.add_selected_room(room1))
    print(customer1.add_selected_room(room2))

    print("Booking a room...")
    booking1 = Booking(F"BOOKING_{len([x for x in hotel.get_all_bookings()])}", datetime(2022, 1, 1), datetime(2022, 1, 5), customer1)
    print(booking1)

    print("\nAdding a booking to the hotel system...")
    print(hotel.add_booking(booking1))

    print("\npayment...")

    print("\nUpdating the booking status...")
    print(booking1.update_status("Confirmed"))

if __name__ == "__main__":
    main()  # ทดสอบโค้ด