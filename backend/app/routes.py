from . import app, db
from flask import jsonify, request, send_from_directory
from .models import User, ToDo

@app.route('/')
@app.route('/<path:path>')
def index():
    return send_from_directory('./../../frontend/build', 'index.html')

""" User route """

@app.route('/api/users', methods=['POST'])
def login():
    if request.method == 'POST':
        req = request.get_json()
        if req['user_name'] is not None:
            user = db.session.query(User.id, User.name).filter(User.name==req['user_name']).first()
            if user is not None:
                return jsonify({
                    'status': 'success',
                    'user_id': user.id,
                    'user_name': user.name
                })
            else:
                user = User(name=req['user_name'])
                db.session.add(user)
                db.session.commit()
                user = db.session.query(User.id, User.name).filter(User.name==req['user_name']).first()
                return jsonify({
                    'status': 'success',
                    'user_id': user.id,
                    'user_name': user.name
                })

""" ToDo Route """

@app.route('/api/todos', methods=['POST'])
def show_todos():
    if request.method == 'POST':
        req = request.get_json()
        todos = db.session.query(ToDo).filter(ToDo.user_id==req['user_id']).order_by(ToDo.timestamp).all()
        json_todos = []
        for todo in todos:
            t = dict()
            t['todo_id'] = todo.id
            t['todo_description'] = todo.description
            t['todo_timestamp'] = todo.timestamp
            json_todos.append(t)
        return jsonify({
            'status': 'success',
            'todos': json_todos
        })

@app.route('/api/todos/add', methods=['POST'])
def add_todos():
    if request.method == 'POST':
        req = request.get_json()
        todo = ToDo(description=req['todo_description'], user_id=req['user_id'])
        db.session.add(todo)
        db.session.commit()
        return jsonify({
            'status': 'success'
        })

@app.route('/api/todos/edit', methods=['POST'])
def edit_todos():
    if request.method == 'POST':
        req = request.get_json()
        todo = db.session.query(ToDo).filter(ToDo.id==req['todo_id']).first()
        todo.description = req['todo_description']
        db.session.commit()
        return jsonify({
            'status': 'success'
        })

@app.route('/api/todos/delete', methods=['POST'])
def delete_todos():
    if request.method == 'POST':
        req = request.get_json()
        t = db.session.query(ToDo).filter(ToDo.id==req['todo_id']).first()
        db.session.delete(t)
        db.session.commit()
        return jsonify({
            'status': 'success'
        })