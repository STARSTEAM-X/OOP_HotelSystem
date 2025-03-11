from OOP import Hotel, Account, User, Customer, Admin, Room, Booking, Discount, Payment, Invoice, Feedback, Review

from flask import Flask, request, jsonify
from flask_cors import CORS

from datetime import datetime

app = Flask(__name__)
CORS(app)


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


@app.route('/api/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']

    user = hotel.authenticate(username, password)
    print(user)
    if user:
        return jsonify({
            "message": "Login successful",
            "username": user.account.username,
            "role": user.account.role
        }), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/register', methods=['POST'])
def register():
    name = request.json['name']
    email = request.json['email']
    phone = request.json['phone']
    username = request.json['username']
    password = request.json['password']

    customer = Customer(name, email, phone, Account(username, password, "customer"))
    print(customer)
    if hotel.add_user(customer):
        return jsonify({"message": "Registration successful"}), 201
    else:
        return jsonify({"error": "Registration failed"}), 400
    
@app.route('/api/rooms_available', methods=['POST'])
def rooms_available():
    check_in = request.json['check_in']
    check_out = request.json['check_out']

    print(f"check_in: {check_in}, Type: {type(check_in)}")
    print(f"check_out: {check_out}, Type: {type(check_out)}")

    rooms = hotel.get_available_rooms(check_in, check_out)  # สมมติว่าได้ list ของ Room object ที่ available ในช่วงเวลานั้น
    room_list = [{
        "id": room.id,
        "type": room.type,
        "price": room.price,
        "capacity": room.capacity,
        "image": room.image,
        "description": room.description,
        "details": room.details
    } for room in rooms]
    print(room_list)
    return jsonify(room_list)  # ส่ง list ของ dictionary กลับไป

@app.route('/api/select_room', methods=['POST'])
def select_room():
    username = request.json['username']
    room_id = request.json['room_id']
    check_in = request.json['check_in']
    check_out = request.json['check_out']

    user = hotel.get_user_by_username(username)
    room = hotel.get_room_by_id(room_id)

    if user and room:
        respon = user.select_room(room, hotel, check_in, check_out)
        print(respon)

        if respon:
            return jsonify({"message": "Room selected"}), 200
        else:
            return jsonify({"error": "Room not available"}), 400
    else:
        return jsonify({"error": "Invalid username or room id"}), 400

@app.route('/api/deselect_room', methods=['POST'])
def deselect_room():
    username = request.json['username']
    room_id = request.json['room_id']

    user = hotel.get_user_by_username(username)
    room = hotel.get_room_by_id(room_id)

    if user and room:
        respon = user.delete_room(room)
        print(respon)

        if respon:
            return jsonify({"message": "Room deselected"}), 200
        else:
            return jsonify({"error": "Room not selected"}), 400
        
@app.route('/api/make_booking', methods=['POST'])
def make_booking():
    username = request.json['username']
    check_in = request.json['check_in']
    check_out = request.json['check_out']

    user = hotel.get_user_by_username(username)
    if user:
        booking = Booking(f"BOOK-{hotel.generate_booking_id()}", check_in, check_out, user)
        response = hotel.add_booking(booking)
        if booking and response:
            return jsonify({"message": "Booking successful"}), 200
        else:
            return jsonify({"error": "Booking failed"}), 400
    else:
        return jsonify({"error": "Invalid username"}), 400
    

@app.route('/api/use_discount', methods=['POST'])
def use_discount():
    username = request.json['username']
    book_id = request.json['book_id']
    discount_code = request.json['discount_code']

    user = hotel.get_user_by_username(username)
    booking = hotel.get_booking_by_id(book_id)
    discount = hotel.get_discount_by_code(discount_code)

    if user and booking and discount:
        respon = booking.apply_discount(discount)
        print(respon)
        if respon:
            return jsonify({
                "booking_id": booking.id,
                "price": booking.price,
                "final_price": booking.final_price,
                "discount": booking.price - booking.final_price
            }), 200
        else:
            return jsonify({"error": "Discount not found"}), 400
    else:
        return jsonify({"error": "Invalid username or discount code"}), 400
    

@app.route('/api/confirm_booking', methods=['POST'])
def confirm_booking():
    username = request.json['username']
    book_id = request.json['book_id']

    user = hotel.get_user_by_username(username)
    booking = hotel.get_booking_by_id(book_id)

    if user and booking:
        response = booking.confirm_booking(hotel)
        print(response)
        if response:
            return jsonify({"message": "Booking confirmed"}), 200
        else:
            return jsonify({"error": "Booking not confirmed"}), 400
    else:
        return jsonify({"error": "Invalid username or booking id"}), 400
    
@app.route('/api/cancel_booking', methods=['POST'])
def cancel_booking():
    username = request.json['username']
    book_id = request.json['book_id']

    user = hotel.get_user_by_username(username)
    booking = hotel.get_booking_by_id(book_id)

    if user and booking:
        response = booking.cancel_booking()
        print(response)
        if response:
            return jsonify({"message": "Booking canceled"}), 200
        else:
            return jsonify({"error": "Booking not canceled"}), 400
    else:
        return jsonify({"error": "Invalid username or booking id"}), 400

@app.route('/api/booking_payment', methods=['POST'])
def booking_payment():
    username = request.json['username']
    book_id = request.json['book_id']
    payment_method = request.json['payment_method']

    user = hotel.get_user_by_username(username)
    booking = hotel.get_booking_by_id(book_id)

    if user and booking:
        response = booking.make_payment(payment_method)
        print(response)
        if response:
            return jsonify({"message": "Payment successful"}), 200
        else:
            return jsonify({"error": "Payment failed"}), 400
    else:
        return jsonify({"error": "Invalid username or booking id"}), 400
    

@app.route('/api/booking_invoice', methods=['POST'])
def booking_invoice():
    username = request.json['username']
    book_id = request.json['book_id']

    user = hotel.get_user_by_username(username)
    booking = hotel.get_booking_by_id(book_id)

    if user and booking:
        response = booking.get_invoice()
        print(response)
        if response:
            return jsonify({"message": "Invoice generated"}), 200
        else:
            return jsonify({"error": "Invoice not generated"}), 400
    else:
        return jsonify({"error": "Invalid username or booking id"}), 400




@app.route('/api/booking/<booking_id>', methods=['GET'])
def get_booking_by_username(booking_id):
    booking = hotel.get_booking_by_id(booking_id)
    if booking:
        return jsonify({
            "booking_id": booking.id,
            "check_in": booking.check_in,
            "check_out": booking.check_out,
            "price": booking.price,
            "final_price": booking.final_price,
            "discount": booking.price - booking.final_price,
            "status": booking.status,
            "room": [{
                "id": room.id,
                "type": room.type,
                "price": room.price,
                "capacity": room.capacity,
                "image": room.image,
                "description": room.description,
                "details": room.details
            } for room in booking.room],
        }), 200
    else:
        return jsonify({"error": "Booking not found"}), 404

@app.route('/api/booking/payment/<booking_id>', methods=['GET'])
def get_booking_payment_by_booking_id(booking_id):
    booking = hotel.get_booking_by_id(booking_id)
    if booking:
        payment = booking.payment
        if payment:
            return jsonify({
                "check_in": booking.check_in,
                "check_out": booking.check_out,
                "price": booking.price,
                "final_price": booking.final_price,
                "discount": booking.price - booking.final_price,
                "room": [{
                    "id": room.id,
                    "type": room.type,
                    "price": room.price,
                    "capacity": room.capacity,
                    "image": room.image,
                    "description": room.description,
                    "details": room.details
                } for room in booking.room],
            }), 200
        else:
            return jsonify({"error": "Payment not found"}), 404
    else:
        return jsonify({"error": "Booking not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
