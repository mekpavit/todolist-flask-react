import React, { Component } from 'react';

import LoginForm from './components/LoginForm';
import AddToDoForm from './components/AddToDoForm';
import ShowToDos from './components/ShowToDos';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_id: null,
            user_name: '',
            todos: []
        }
        this.setUser = this.setUser.bind(this);
        this.updateToDos = this.updateToDos.bind(this);
    }

    setUser(user) {
        this.setState({
            user_id: user.user_id,
            user_name: user.user_name
        });
        this.updateToDos();

    }

    updateToDos() {
        fetch('/api/todos', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                user_id: this.state.user_id
            })
        })
            .then(res => res.json())
            .then((res) => {
                if (res['status'] === 'success') {
                    this.setState({
                        todos: res['todos']
                    });
                }
            });
    }

    render() {
        return (
            <div>
                <LoginForm 
                    setUser={this.setUser} 
                    user_name={this.state.user_name} 
                />
                <AddToDoForm 
                    user_id={this.state.user_id} 
                    updateToDos={this.updateToDos} 
                />
                <ShowToDos 
                    todos={this.state.todos} 
                    updateToDos={this.updateToDos}
                />
            </div>
        );
    }
}

export default App;
