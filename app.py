"""Flask app for Cupcakes"""
from flask import Flask, jsonify, request, render_template
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, Cupcake

app = Flask(__name__)

app.debug = True
app.config ['SECRET_KEY'] = 'cupcakessecretkey'
app.config ['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
toolbar = DebugToolbarExtension(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

with app.app_context():
    connect_db(app)
    db.create_all()

def serialize_cupcake(cupcake):
    """Serialize a cupcake SQLAlchemy object to dictionary"""
    return {
        "id" : cupcake.id,
        "flavor" : cupcake.flavor,
        "size" : cupcake.size,
        "rating": cupcake.rating,
        "image" : cupcake.image,
    }

@app.route('/')
def show_homepage():
    """Render homepage"""

    return render_template('homepage.html')

@app.route('/api/cupcakes')
def list_all_cupcakes():
    """return JSON of cupcakes"""
    cupcakes = Cupcake.query.all()
    serialized = [serialize_cupcake(c) for c in cupcakes]

    return jsonify(cupcakes=serialized)

@app.route('/api/cupcakes/<int:id>')
def show_single_cupcake_details(id):
    """return JSON for one single cupcake"""
    cupcake = Cupcake.query.get_or_404(id)
    serialized = serialize_cupcake(cupcake)

    return jsonify(cupcake=serialized)

@app.route('/api/cupcakes', methods=["POST"])
def create_cupcake():
    """Create a cupcake from JSON data and return JSON details"""
    data = request.json

    cupcake = Cupcake(
        flavor=data['flavor'],
        rating=data['rating'],
        size=data['size'],
        image=data['image'] or None)
    
    db.session.add(cupcake)
    db.session.commit()

    serialized = serialize_cupcake(cupcake)

    return (jsonify(serialized), 201)

@app.route('/api/cupcakes/<int:id>', methods=["PATCH"])
def update_cupcake(id):
    """update a single cupcake and respond with updated JSON"""
    data = request.json

    cupcake = Cupcake.query.get_or_404(id)

    cupcake.flavor = data['flavor']
    cupcake.rating = data['rating']
    cupcake.size = data['size']
    cupcake.image = data['image']

    db.session.add(cupcake)
    db.session.commit()

    serialized = serialize_cupcake(cupcake)


    return jsonify(serialized)

@app.route('/api/cupcakes/<int:id>', methods=["DELETE"])
def delete_cupcake(id):
    """Delete a specific cupcake"""
    cupcake = Cupcake.query.get_or_404(id)
    db.session.delete(cupcake)
    db.session.commit()

    return jsonify(message="Deleted")