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
image = "https://www.banidea.com/wp-content/uploads/2019/09/small-hotel.jpg"
room1 = Room("101", "Standard", 3000, 2, image, "Comfortable and affordable room with all basic amenities.", "This room offers a cozy bed, a desk for work, and a flat-screen TV.")
room2 = Room("102", "Suite Room", 3000, 3, image, "A spacious suite with a living area and premium facilities.", "Includes a spacious living area, minibar, and a private balcony with sea views.")
room3 = Room("201", "Deluxe", 5000, 2, image, "A luxurious room with a beautiful view and modern amenities.", "This room offers a king-size bed, a seating area, and a luxurious bathroom.")
room4 = Room("202", "Family Room", 5000, 4, image, "A large family room with multiple beds and entertainment options.", "Includes two queen-size beds, a sofa bed, and a gaming console.")
room5 = Room("301", "Standard", 3000, 2, image, "Comfortable and affordable room with all basic amenities.", "This room offers a cozy bed, a desk for work, and a flat-screen TV.")
room6 = Room("302", "Suite Room", 3000, 3, image, "A spacious suite with a living area and premium facilities.", "Includes a spacious living area, minibar, and a private balcony with sea views.")
room7 = Room("401", "Deluxe", 5000, 2, image, "A luxurious room with a beautiful view and modern amenities.", "This room offers a king-size bed, a seating area, and a luxurious bathroom.")
room8 = Room("402", "Family Room", 5000, 4, image, "A large family room with multiple beds and entertainment options.", "Includes two queen-size beds, a sofa bed, and a gaming console.")
room9 = Room("501", "Standard", 3000, 2, image, "Comfortable and affordable room with all basic amenities.", "This room offers a cozy bed, a desk for work, and a flat-screen TV.")
room10 = Room("502", "Suite Room", 3000, 3, image, "A spacious suite with a living area and premium facilities.", "Includes a spacious living area, minibar, and a private balcony with sea views.")

print("\n\n Add Room")
room_lst = [room1,room2,room3,room4, room5, room6, room7, room8, room9, room10]
for room in room_lst:
    print(hotel.add_room(room))


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
    print("Raw request data:", request.data)  # Debugging
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
    return jsonify(room_list)  # ส่ง list ของ dictionary กลับไป

@app.route('/api/get_review_by_room_id', methods=['POST'])
def get_review_by_room_id():
    username = request.json['username']
    room_id = request.json['room_id']

    user = hotel.get_user_by_username(username)
    reviews = hotel.get_review_by_room_id(room_id)

    if user and reviews:
        response =[]
        for review in reviews:
            response.append({
                "id": review.id,
                "room_id": review.room_id,
                "customer": review.customer.name,
                "rating": review.rating,
                "comment": review.comment,
                "date": review.date
            })
        print(response)
        return jsonify(response),200
    else:
        return jsonify({"error": "Invalid username or room id"})


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
        

@app.route('/api/get_selected', methods=['POST'])
def get_selected():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user:
        response = []
        for room in user.selected_room:
            response.append({
                "id": room.id,
                "type": room.type,
                "price": room.price,
                "capacity": room.capacity,
                "image": room.image,
                "description": room.description,
                "details": room.details
            })
        return jsonify(response)
    else:
        return jsonify({"error": "User not found"}), 404
        
@app.route('/api/make_booking', methods=['POST'])
def make_booking():
    username = request.json['username']
    check_in = request.json['check_in']
    check_out = request.json['check_out']

    user = hotel.get_user_by_username(username)
    if user:
        booking = Booking(f"BOOK-{hotel.generate_booking_id()}", check_in, check_out, user)
        response = hotel.add_booking(booking)
        print(booking.room)
        if booking and response:
            return jsonify({
                "message": "Booking successful",
                "booking_id": booking.id,
            }), 200
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
    
@app.route('/api/booking/<booking_id>', methods=['GET'])
def get_booking_by_id(booking_id):
    booking = hotel.get_booking_by_id(booking_id)
    if booking:
        return jsonify({
            "booking_id": booking.id,
            "day": booking.num_days(),
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
    
@app.route('/api/booking/payment/<booking_id>', methods=['GET'])
def get_booking_payment_by_booking_id(booking_id):
    booking = hotel.get_booking_by_id(booking_id)
    print(booking)
    if booking:
        payment = booking.payment
        print(payment)
        if payment:
            return jsonify({
                "booking_id": booking.id,
                "check_in": booking.check_in,
                "check_out": booking.check_out,
                "day": booking.num_days(),
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
    

@app.route('/api/booking/invoice/<booking_id>', methods=['GET'])
def get_booking_invoice_by_booking_id(booking_id):
    booking = hotel.get_booking_by_id(booking_id)
    if booking:
        if booking.invoice:
            return jsonify({
                "booking_id": booking.id,
                "check_in": booking.check_in,
                "check_out": booking.check_out,
                "day": booking.num_days(),
                "price": booking.price,
                "final_price": booking.final_price,
                "discount": booking.price - booking.final_price,
                "payment_method": booking.payment.method,
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
            return jsonify({"error": "Invoice not found"}), 404
    else:
        return jsonify({"error": "Booking not found"}), 404

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
    
@app.route('/api/my_booking', methods=['Post'])
def my_booking():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    booking_list = hotel.get_booking_by_customer(user) # สมมติว่าได้ list ของ Booking object ที่เป็นของ user นี้
    if booking_list :
        response = []
        for booking in booking_list:
            print(booking)
            response.append({
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
            })
        return jsonify(response)
    else:
        return jsonify({"error": "Booking not found"}), 404
    

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


@app.route('/api/add_feedback', methods=['POST'])
def add_feedback():
    username = request.json['username']
    book_id = request.json['book_id']
    rating = request.json['rating']
    comment = request.json['comment']

    user = hotel.get_user_by_username(username)
    booking = hotel.get_booking_by_id(book_id)

    if user and booking:
        feedback = Feedback(f"FEED-{hotel.generate_feedback_id()}", user, comment, rating)
        response = hotel.add_feedback(feedback)
        print(response)
        if response:
            return jsonify({"message": "Feedback added"}), 200
        else:
            return jsonify({"error": "Feedback not added"}), 400
    else:
        return jsonify({"error": "Invalid username or booking id"}), 400
    
@app.route('/api/add_review', methods=['POST'])
def add_review():
    username = request.json['username']
    room_id = request.json['room_id']
    rating = request.json['rating']
    comment = request.json['comment']

    user = hotel.get_user_by_username(username)
    room = hotel.get_room_by_id(room_id)

    if user and room:
        review = Review(f"REV-{hotel.generate_review_id()}", room_id, user, comment, rating)
        response = hotel.add_review(review)
        print(response)
        if response:
            return jsonify({"message": "Review added"}), 200
        else:
            return jsonify({"error": "Review not added"}), 400
    else:
        return jsonify({"error": "Invalid username or room id"}), 400
    

        
@app.route('/api/my_feedback', methods=['Post'])
def my_feedback():
    username = request.json['username']

    user = hotel.get_user_by_username(username)
    feedback_list = hotel.get_feedback_by_customer(user)
    if feedback_list:
        response = []
        for feedback in feedback_list:
            response.append({
                "id": feedback.id,
                "date": feedback.date,
                "customer": feedback.customer.name,
                "rating": feedback.rating,
                "comment": feedback.comment
            })
        return jsonify(response)
    else:
        return jsonify({"error": "Feedback not found"}), 404     
    
@app.route('/api/edit_my_feedback', methods=['Post'])
def edit_my_feedback():
    username = request.json['username']
    feedback_id = request.json['feedback_id']
    rating = request.json['rating']
    comment = request.json['comment']

    user = hotel.get_user_by_username(username)
    feedback = hotel.get_feedback_by_id(feedback_id)

    if user and feedback:
        feedback.rating = rating
        feedback.comment = comment
        return jsonify({"message": "Feedback updated"}), 200
    else:
        return jsonify({"error": "Invalid username or feedback id"}), 400
    
@app.route('/api/delete_my_feedback', methods=['Post'])
def delete_my_feedback():
    username = request.json['username']
    feedback_id = request.json['feedback_id']

    user = hotel.get_user_by_username(username)
    feedback = hotel.get_feedback_by_id(feedback_id)

    if user and feedback:
        response = hotel.delete_feedback(feedback)
        if response:
            return jsonify({"message": "Feedback deleted"}), 200
        else:
            return jsonify({"error": "Feedback not deleted"}), 400
    else:
        return jsonify({"error": "Invalid username or feedback id"}), 400

@app.route('/api/my_review', methods=['Post'])
def my_review():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    review_list = hotel.get_review_by_customer(user)
    if review_list:
        response = []
        for review in review_list:
            response.append({
                "id": review.id,
                "date": review.date,
                "customer": review.customer.name,
                "room_id": review.room_id,
                "rating": review.rating,
                "comment": review.comment
            })
        return jsonify(response)
    else:
        return jsonify({"error": "Review not found"}), 404  
    
@app.route('/api/edit_my_review', methods=['Post'])
def edit_my_review():
    username = request.json['username']
    review_id = request.json['review_id']
    rating = request.json['rating']
    comment = request.json['comment']

    user = hotel.get_user_by_username(username)
    review = hotel.get_review_by_id(review_id)

    if user and review:
        review.rating = rating
        review.comment = comment
        return jsonify({"message": "Review updated"}), 200
    else:
        return jsonify({"error": "Invalid username or review id"}), 400
    
@app.route('/api/delete_my_review', methods=['Post'])
def delete_my_review():
    username = request.json['username']
    review_id = request.json['review_id']

    user = hotel.get_user_by_username(username)
    review = hotel.get_review_by_id(review_id)

    if user and review:
        response = hotel.delete_review(review)
        if response:
            return jsonify({"message": "Review deleted"}), 200
        else:
            return jsonify({"error": "Review not deleted"}), 400
    else:
        return jsonify({"error": "Invalid username or review id"}), 400
    

    
@app.route('/api/admin/room/view', methods=['Post'])
def room_view():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        room_list = hotel.get_all_rooms()
        response = []
        for room in room_list:
            response.append({
                "id": room.id,
                "type": room.type,
                "price": room.price,
                "capacity": room.capacity,
                "image": room.image,
                "description": room.description,
                "details": room.details
            })
        return jsonify(response)
    else:
        return jsonify({"error": "Invalid username or role"}), 400
    
@app.route('/api/admin/room/add', methods=['Post'])
def room_add():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        room = Room(request.json['id'], request.json['type'], int(request.json['price']), int(request.json['capacity']), request.json['image'], request.json['description'], request.json['details'])
        response = hotel.add_room(room)
        if response:
            return jsonify({"message": "Room added"}), 201
        else:
            return jsonify({"error": "Room not added"}), 400
    else:
        return jsonify({"error": "Invalid username or role"}), 400
    
@app.route('/api/admin/room/update', methods=['Post'])
def room_update():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        room_id = request.json['room_id']
        room = hotel.get_room_by_id(room_id)
        if room:
            room.type = request.json['type']
            room.price = int(request.json['price'])
            room.capacity = int(request.json['capacity'])
            room.image = request.json['image']
            room.description = request.json['description']
            room.details = request.json['details']
            return jsonify({"message": "Room updated"}), 200
        else:
            return jsonify({"error": "Room not found"}), 404
    else:
        return jsonify({"error": "Invalid username or role"}), 400
    
@app.route('/api/admin/room/delete', methods=['Post'])
def room_delete():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        room_id = request.json['room_id']
        room = hotel.get_room_by_id(room_id)
        if room:
            response = hotel.delete_room(room)
            if response:
                return jsonify({"message": "Room deleted"}), 200
            else:
                return jsonify({"error": "Room not deleted"}), 400
        else:
            return jsonify({"error": "Room not found"}), 404
    else:
        return jsonify({"error": "Invalid username or role"}), 400
    


@app.route('/api/admin/user/view', methods=['Post'])
def user_view():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        user_list = hotel.get_all_users()
        response = []
        for user in user_list:
            response.append({
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "username": user.account.username,
                "role": user.account.role
            })
        return jsonify(response)
    else:
        return jsonify({"error": "Invalid username or role"}), 400
    

@app.route('/api/admin/user/add', methods=['Post'])
def user_add():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        role = request.json['role']
        if role == "admin":
            new_user = Admin(request.json['name'], request.json['email'], request.json['phone'], Account(request.json['username_new'], request.json['password'], role), request.json['position'])
        else:
            new_user = Customer(request.json['name'], request.json['email'], request.json['phone'], Account(request.json['username_new'], request.json['password'], role))
        response = hotel.add_user(new_user)
        if response:
            return jsonify({"message": "User added"}), 201
        else:
            return jsonify({"error": "User not added"}), 400
    else:
        return jsonify({"error": "Invalid username or role"}), 400
    
@app.route('/api/admin/user/update', methods=['Post'])
def user_update():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    print(user.account.role)
    if user:
        user = request.json['username_target']
        user = hotel.get_user_by_username(user)
        if user:
            user.account.change_password(request.json['password'])
            user.name = request.json['name']
            user.email = request.json['email']
            user.phone = request.json['phone']
            
            return jsonify({"message": "User updated"}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    else:
        return jsonify({"error": "Invalid username or role"}), 400
    
@app.route('/api/admin/user/delete', methods=['Post'])
def user_delete():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        user = request.json['username_target']
        user = hotel.get_user_by_username(user)
        if user:
            response = hotel.delete_user(user)
            if response:
                return jsonify({"message": "User deleted"}), 200
            else:
                return jsonify({"error": "User not deleted"}), 400
        else:
            return jsonify({"error": "User not found"}), 404
    else:
        return jsonify({"error": "Invalid username or role"}), 400

@app.route('/api/admin/booking/view', methods=['Post'])
def booking_view():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        booking = hotel.get_all_bookings()
        print(booking)
        if booking:
            response = []
            for booking in booking:
                response.append({
                    "booking_id": booking.id,
                    "customer": booking.customer.name,
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
                })
            return jsonify(response)
        else:
            return jsonify({"error": "Booking not found"}), 404
    else:
        return jsonify({"error": "Invalid username or role"}), 400
    
@app.route('/api/admin/booking/delete', methods=['Post'])
def booking_delete():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        booking_id = request.json['booking_id']
        booking = hotel.get_booking_by_id(booking_id)
        if booking:
            response = hotel.delete_booking(booking)
            if response:
                return jsonify({"message": "Booking deleted"}), 200
            else:
                return jsonify({"error": "Booking not deleted"}), 400
        else:
            return jsonify({"error": "Booking not found"}), 404
    else:
        return jsonify({"error": "Invalid username or role"}), 400

@app.route('/api/admin/cancel_booking', methods=['POST'])
def admin_cancel_booking():
    username = request.json['username']
    role = request.json['role']
    book_id = request.json['book_id']

    user = hotel.get_user_by_username(username)
    booking = hotel.get_booking_by_id(book_id)

    if user and booking and role == "admin":
        response = booking.cancel_booking()
        print(response)
        if response:
            return jsonify({"message": "Booking canceled"}), 200
        else:
            return jsonify({"error": "Booking not canceled"}), 400
    else:
        return jsonify({"error": "Invalid username or booking id"}), 400
    

    
@app.route('/api/admin/discount/view', methods=['Post'])
def discount_view():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        discount_list = hotel.get_all_discounts()
        if discount_list:
            response = []
            for discount in discount_list:
                response.append({
                    "code": discount.code,
                    "percent": discount.value
                })
            return jsonify(response)
        else:
            return jsonify({"error": "Discount not found"}), 404
    else:
        return jsonify({"error": "Invalid username or role"}), 400
    
@app.route('/api/admin/discount/add', methods=['Post'])
def discount_add():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        discount = Discount(request.json['code'], int(request.json['percent']))
        response = hotel.add_discount(discount)
        if response:
            return jsonify({"message": "Discount added"}), 201
        else:
            return jsonify({"error": "Discount not added"}), 400
    else:
        return jsonify({"error": "Invalid username or role"}), 400
    
@app.route('/api/admin/discount/update', methods=['Post'])
def discount_update():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        code = request.json['code']
        discount = hotel.get_discount_by_code(code)
        if discount:
            discount.value = int(request.json['percent'])
            return jsonify({"message": "Discount updated"}), 200
        else:
            return jsonify({"error": "Discount not found"}), 404
    else:
        return jsonify({"error": "Invalid username or role"}), 400
    
@app.route('/api/admin/discount/delete', methods=['Post'])
def discount_delete():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        code = request.json['code']
        discount = hotel.get_discount_by_code(code)
        if discount:
            response = hotel.delete_discount(discount)
            if response:
                return jsonify({"message": "Discount deleted"}), 200
            else:
                return jsonify({"error": "Discount not deleted"}), 400
        else:
            return jsonify({"error": "Discount not found"}), 404
    else:
        return jsonify({"error": "Invalid username or role"}), 400
    

@app.route('/api/admin/feedback/view', methods=['Post'])
def feedback_view():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        feedback = hotel.get_all_feedbacks() # สมมติว่าได้ List Feedback object ทั้งหมด
        if feedback:
            response = []
            for feedback in feedback:
                response.append({
                    "id": feedback.id,
                    "customer": feedback.customer.name,
                    "rating": feedback.rating,
                    "comment": feedback.comment,
                    "date": feedback.date
                })
            return jsonify(response), 200
        else:
            return jsonify({"error": "Feedback not found"}), 404
    else:
        return jsonify({"error": "Invalid username or role"}), 400
    
@app.route('/api/admin/feedback/delete', methods=['Post'])
def feedback_delete():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        feedback_id = request.json['feedback_id']
        feedback = hotel.get_feedback_by_id(feedback_id)
        if feedback:
            response = hotel.delete_feedback(feedback)
            if response:
                return jsonify({"message": "Feedback deleted"}), 200
            else:
                return jsonify({"error": "Feedback not deleted"}), 400
        else:
            return jsonify({"error": "Feedback not found"}), 404
    else:
        return jsonify({"error": "Invalid username or role"}), 400
    

@app.route('/api/admin/review/view', methods=['Post']) 
def review_view():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        review = hotel.get_all_reviews() # สมมติว่าได้ List Review object ทั้งหมด
        if review:
            response = []
            for review in review:
                response.append({
                    "id": review.id,
                    "room_id": review.room_id,
                    "customer": review.customer.name,
                    "rating": review.rating,
                    "comment": review.comment,
                    "date": review.date
                })
            return jsonify(response), 200
        else:
            return jsonify({"error": "Review not found"}), 404
    else:
        return jsonify({"error": "Invalid username or role"}), 400
    
@app.route('/api/admin/review/delete', methods=['Post'])
def review_delete():
    username = request.json['username']
    user = hotel.get_user_by_username(username)
    if user and user.account.role == "admin":
        review_id = request.json['review_id']
        review = hotel.get_review_by_id(review_id)
        print(review)
        if review:
            response = hotel.delete_review(review)
            if response:
                return jsonify({"message": "Review deleted"}), 200
            else:
                return jsonify({"error": "Review not deleted"}), 400
        else:
            return jsonify({"error": "Review not found"}), 404
    else:
        return jsonify({"error": "Invalid username or role"}), 400




    


    
if __name__ == '__main__':
    app.run(debug=True)
