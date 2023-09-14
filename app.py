from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, support_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///movies.db'

db = SQLAlchemy(app) 

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(120), nullable=False)
    poster_path = db.Column(db.String(120), nullable=True)
    director = db.Column(db.String(120), nullable=True)

@app.route('/submit', methods=['POST'])
@cross_origin(supports_credentials=True)
def submit_data():
    data = request.get_json()
    movie = Movie(title=data['title'], year=data['year'], rating=data['rating'], comment=data['comment'], poster_path=data['poster_path'], director=data['director'])
    db.session.add(movie)
    db.session.commit()

    return jsonify({'message': 'Data received!'})

@app.route('/movies', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_movies():
    movies = Movie.query.all()
    movies_list = []

    for movie in movies:
        movies_list.append({'title': movie.title, 'year': movie.year, 'rating': movie.rating, 'comment': movie.comment, 'poster_path': movie.poster_path, 'director': movie.director})

    return jsonify({'movies': movies_list})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
