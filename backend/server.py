from flask.helpers import send_from_directory
import pymongo
from flask import Flask
from flask import request
from flask import jsonify
import os
import json
from flask_cors import CORS, cross_origin
from model_mongodb import User
from model_mongodb import Todo

app = Flask(__name__, static_folder='build/', static_url_path='/')
app.debug = 'DEBUG' in os.environ


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)

# app = Flask(__name__, static_folder='./build', static_url_path='/')
# CORS(app)

# @app.route('/')
# @cross_origin
# def index():
#     return app.send_static_file('index.html')


# @app.errorhandler(404)
# def not_found(e):
#     return app.send_static_file('index.html')

#login API routes
@app.route('/users', methods=['POST'])
@cross_origin
def register_user():
    userToAdd = request.get_json()
    newUser = User(userToAdd)
    newUser.encryptPassword()
    if (newUser.email_exists()):
        return jsonify({"error": "User already exists"}), 404
    else:
        newUser.save()
        return jsonify(newUser), 201
@app.route('/login', methods=['POST'])
def login():  
    userToAdd = request.get_json()
    current_user = User(userToAdd)
    current_user.encryptPassword()
    if (current_user.user_exists()):
        return jsonify(current_user), 200
    return jsonify({"error": "User not found"}), 401

#Todos API routes
@app.route('/todos', methods=['POST', 'GET'])
@cross_origin
def add_todo():
    if request.method == 'GET':
        return jsonify(Todo().find_todos()), 201
    if request.method == 'POST':
        todoToAdd = request.get_json()
        newTodo = Todo(todoToAdd)
        newTodo.save()
        return jsonify(newTodo), 201

@app.route('/todos/completed', methods=['GET'])
@cross_origin
def get_completed_Todo():
    if request.method == 'GET':
        return jsonify(Todo().find_completed()), 201

@app.route('/todos/completed/<id>', methods=['PUT'])
@cross_origin
def completed_Todos(id):
    if request.method == 'PUT':
        bool = request.get_json()
        bool =  bool['completed']
        if Todo().update_completed(id, bool): 
            resp = jsonify({}), 204
            return resp
        else:
           return jsonify({"error": "Todo not found"}), 404
@app.route('/todos/<id>', methods=['GET', 'DELETE', 'PUT'])
@cross_origin
def get_todo(id):
    if request.method == 'GET':
        todo = Todo({"_id": id})
        if todo.reload():
            return todo, 201
        else:
            return jsonify({"error": "Todo not found"}), 404
    elif request.method == 'DELETE':
        deleteTodo = Todo({"_id": id})
        if deleteTodo.remove(): 
            resp = jsonify({}), 204
            return resp
        else:
           return jsonify({"error": "Todo not found"}), 404
    elif request.method == 'PUT':
        editTodo = request.get_json()
        if Todo().update_one(id, editTodo): 
            resp = jsonify({}), 204
            return resp
        else:
           return jsonify({"error": "Todo not found"}), 404

