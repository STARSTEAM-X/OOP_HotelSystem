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

    def add_booking(self, datein: datetime, dateout: datetime):
        self.__booking_history.append((datein, dateout))

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

    # Manage Rooms
    def add_room(self, hotel_system, room: Room):
        return hotel_system.add_room(room)

    def edit_room(self, hotel_system, room: Room):
        return hotel_system.update_room(room)

    def delete_room(self, hotel_system, room: Room):
        return hotel_system.del_room(room)

    def view_rooms(self, hotel_system):
        return hotel_system.get_all_rooms()

    # View All Bookings
    def view_all_bookings(self, hotel_system):
        return hotel_system.get_all_bookings()

    # Manage Users
    def add_user(self, hotel_system, user: User):
        return hotel_system.add_user(user)

    def edit_user(self, hotel_system, user: User):
        return hotel_system.update_user(user)

    def delete_user(self, hotel_system, user: User):
        return hotel_system.del_user(user)

    def view_users(self, hotel_system):
        return hotel_system.get_all_users()

    # Manage Discounts
    def add_discount(self, hotel_system, discount):
        return hotel_system.add_discount(discount)

    def edit_discount(self, hotel_system, discount):
        return hotel_system.update_discount(discount)

    def delete_discount(self, hotel_system, discount):
        return hotel_system.del_discount(discount)

    def view_discounts(self, hotel_system):
        return hotel_system.get_all_discounts()

    # View Feedback
    def view_feedback(self, hotel_system):
        return hotel_system.get_all_feedbacks()
    

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

    def search_available_rooms(self, hotel_system, datein: datetime, dateout: datetime):
        return hotel_system.find_available_room(datein, dateout)

    def make_booking(self, hotel_system, datein: datetime, dateout: datetime):
        booking = Booking(str(len(hotel_system.get_all_bookings()) + 1), datein, dateout, self)
        hotel_system.add_booking(booking)
        for room in self.__selected_room:
            room.add_booking(datein, dateout)
        return "Booking made successfully."

    def make_payment(self, booking, payment_method: str, amount_paid: float):
        payment = Payment(booking, payment_method, amount_paid, datetime.now())
        booking.confirm_booking()
        return payment.make_payment()

    def view_bookings(self, hotel_system):
        return [booking for booking in hotel_system.get_all_bookings() if booking.get_customer().get_id() == self.get_id()]

    def cancel_booking(self, hotel_system, booking):
        booking.cancel_booking()
        hotel_system.del_booking(booking)
        return "Booking cancelled successfully."

    def add_review(self, room: Room, rating: float, comment: str):
        review = Review(room.get_id(), self, rating, comment, datetime.now())
        room.add_review(review)
        return "Review added successfully."

    def add_feedback(self, hotel_system, comment: str, rating: float):
        feedback = Feedback(str(len(hotel_system.get_all_feedbacks()) + 1), self, None, comment, rating, datetime.now())
        hotel_system.add_feedback(feedback)
        return "Feedback added successfully."
    
    def set_email(self, email: str):
        self.__email = email
        return f"Email updated to {email}."

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


from datetime import datetime

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
        return self.__rooms
    
    def get_all_users(self):
        return self.__users

    def get_all_bookings(self):
        return self.__bookings

    def get_all_reviews(self):
        return self.__reviews

    def get_all_feedbacks(self):
        return self.__feedback
    
    def get_all_discounts(self):
        return self.__discounts

    def add_room(self, room: Room):
        self.__rooms.append(room)
        return f"Room '{room.get_name()}' added to the hotel."

    def update_room(self, room: Room):
        for i, r in enumerate(self.__rooms):
            if r.get_id() == room.get_id():
                self.__rooms[i] = room
                return f"Room '{room.get_name()}' updated."
        return f"Room with ID '{room.get_id()}' not found."

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
                return user
        return f"No user found with ID '{id}'"

    def find_booking_by_id(self, id: str):
        for booking in self.__bookings:
            if booking.get_id() == id:
                return booking
        return f"No booking found with ID '{id}'"

    def find_discount_by_code(self, code: str):
        for discount in self.__discounts:
            if discount.get_code() == code:
                return discount
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
            
    def update_discount(self, discount: Discount):
        for i, d in enumerate(self.__discounts):
            if d.get_code() == discount.get_code():
                self.__discounts[i] = discount
                return f"Discount '{discount.get_code()}' updated successfully."
        return f"Discount with code '{discount.get_code()}' not found."

    def authenticate(self, username: str, password: str) -> bool:
        for user in self.__users:
            if user.login(username, password):
                return f"User '{username}' authenticated successfully."
        return f"Authentication failed for user '{username}'."



## User Operations

### 1. User Registration
hotel_system = HotelSystem("Example Hotel", "123 Example Street")

# Register a new customer
new_customer = Customer("1", "John", "Doe", "johndoe", "password123", "johndoe@example.com")
hotel_system.add_user(new_customer)

### 2. User Login

# Authenticate user
is_authenticated = hotel_system.authenticate("johndoe", "password123")
print(is_authenticated)  # Output: User 'johndoe' authenticated successfully.

# To search for available rooms within a date range:
from datetime import datetime
datein = datetime(2025, 3, 1)
dateout = datetime(2025, 3, 5)
available_rooms = new_customer.search_available_rooms(hotel_system, datein, dateout)
print(available_rooms)  # Output: List of available room names

### 4. Select Room
# To select a room for booking:

# Assuming room1 is an instance of Room
room1 = Room("101", "Deluxe Room", "Deluxe", 100, 2, "image_url", "A deluxe room", "Room details")
new_customer.add_selected_room(room1)

### 5. Make Booking
# To make a booking with the selected rooms:
booking_message = new_customer.make_booking(hotel_system, datein, dateout)
print(booking_message)  # Output: Booking made successfully.

### 6. Make Payment
# To make a payment for a booking:
booking = hotel_system.find_booking_by_id("1")  # Assuming booking ID is 1
payment_message = new_customer.make_payment(booking, "Credit Card", 500)
print(payment_message)  # Output: Payment made successfully.

### 7. View Bookings
# To view all bookings of the user:
user_bookings = new_customer.view_bookings(hotel_system)
print(user_bookings)  # Output: List of booking IDs

### 8. Cancel Booking
# To cancel a booking:
cancel_message = new_customer.cancel_booking(hotel_system, booking)
print(cancel_message)  # Output: Booking cancelled successfully.

### 9. Review Room
# To add a review for a room:
review_message = new_customer.add_review(room1, 4.5, "Great room!")
print(review_message)  # Output: Review added successfully.

### 10. Provide Feedback
# To provide feedback for the hotel:
feedback_message = new_customer.add_feedback(hotel_system, "Excellent service!", 5.0)
print(feedback_message)  # Output: Feedback added successfully.




## Admin Operations
### 1. Add Room
# To add a new room to the hotel system:
admin = Admin("admin1", "Jane", "Smith", "adminjane", "adminpass", "adminjane@example.com", "Manager")
add_room_message = admin.add_room(hotel_system, room1)
print(add_room_message)  # Output: Room 'Deluxe Room' added to the hotel.

room1.set_price(120)
edit_room_message = admin.edit_room(hotel_system, room1)
print(edit_room_message)  # Output: Room 'Deluxe Room' updated.

### 3. Delete Room
# To delete a room from the hotel system:
delete_room_message = admin.delete_room(hotel_system, room1)
print(delete_room_message)  # Output: Room 'Deluxe Room' removed from the hotel.

### 4. View All Bookings
# To view all bookings in the hotel system:
all_bookings = admin.view_all_bookings(hotel_system)
print(all_bookings)  # Output: List of all booking IDs

### 5. Manage Customer
# To manage Customer including adding, editing, deleting, and viewing users:
new_user = Customer("2", "Alice", "Brown", "alicebrown", "password456", "alicebrown@example.com")
add_user_message = admin.add_user(hotel_system, new_user)
print(add_user_message)

### 6. Edit Customer
# Edit an existing Customer
new_user.set_email("newalicebrown@example.com")
edit_user_message = admin.edit_user(hotel_system, new_user)
print(edit_user_message)  # Output: User 'alicebrown' updated successfully.

#### Delete User
# Delete a user
delete_user_message = admin.delete_user(hotel_system, new_user)
print(delete_user_message)  # Output: User 'alicebrown' removed from the hotel system.

#### View Users
# View all users
users = admin.view_users(hotel_system)
print(users)  # Output: List of all usernames

### 4. Manage Discounts
#### Add Discount
# Add a new discount
new_discount = Discount("DISCOUNT10", "percentage", 10)
add_discount_message = admin.add_discount(hotel_system, new_discount)
print(add_discount_message)  # Output: Discount code 'DISCOUNT10' added.

#### Edit Discount
# Edit an existing discount
new_discount = Discount("DISCOUNT10", "percentage", 15)
edit_discount_message = admin.edit_discount(hotel_system, new_discount)
print(edit_discount_message)  # Output: Discount 'DISCOUNT10' updated successfully.

#### Delete Discount
# Delete a discount
# delete_discount_message = admin.delete_discount(hotel_system, new_discount)
# print(delete_discount_message)  # Output: Discount code 'DISCOUNT10' removed.

#### View Discounts
# View all discounts
discounts = admin.view_discounts(hotel_system)
print(discounts)  # Output: List of all discount codes

### 5. View Feedback
# To view all feedback in the hotel system:
# View all feedback
feedbacks = admin.view_feedback(hotel_system)
print(feedbacks)  # Output: List of all feedback comments