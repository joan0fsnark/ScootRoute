j"""Models for Scooter Directions App."""

from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()



def connect_to_db(flask_app, db_uri='postgresql:///users', echo=True):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!') 
    #this won't really check that it is connect to the DB. 
    #Do this first before running py files!!!!
    #FYI (seed_database.py) while run the DB for us (below steps)
    # Steps to create the db from sql dump file
    #step 1: createdb ratings 
    #step2 : psql ratings < ratings.sql

class User(db.Model):
    """A user table class"""

    __tablename__ = 'user_info'

    id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)
    fname = db.Column(db.String)
    lname = db.Column(db.String)                    
    email = db.Column(db.String, 
                        unique=True)
    password = db.Column(db.String)

            
    def __repr__(self):
        return f'<User d={self.id} email={self.email}>'

# class Movie(db.Model):
#     """Movie table class"""

#     __tablename__ = 'movies'
    
#     movie_id = db.Column(db.Integer,
#                         autoincrement=True,
#                         primary_key=True)
#     title = db.Column(db.String)
#     overview = db.Column(db.Text)
#     release_date = db.Column(db.DateTime)
#     poster_path = db.Column(db.String)

#     # ratings = a list of Rating objects

#     def __repr__(self):
#         return f'<Movies movie_id={self.movie_id} title={self.title}>'


# class Rating(db.Model):
#     """A rating table class"""

#     __tablename__ = 'ratings'

#     rating_id = db.Column(db.Integer,
#                         autoincrement=True,
#                         primary_key=True)
#     movie_id = db.Column(db.Integer,
#                         db.ForeignKey('movies.movie_id')) 
#     user_id = db.Column(db.Integer,
#                         db.ForeignKey('users.user_id'))
#     score = db.Column(db.Integer)
    
#     movie = db.relationship('Movie', backref='ratings') #(backref = 'ratings') is to tie the Movies table to Ratings Table to be able to call to ratings attribute
#     user = db.relationship('User', backref='ratings')#(backref = 'ratings') is to tie the Users table to Ratings Table

         
#     def __repr__(self):
#         return f'<Ratings: rating_id={self.rating_id} score= {self.score}>'


#bd.create_all() is to create all the tables with the details above in python class
#caution: check to see if the variable will return a list or an actual string

if __name__ == '__main__':
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)
