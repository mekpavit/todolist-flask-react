import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'error': '',
            'user_name': ''
        }
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    } 

    handleLogin(e) {
        e.preventDefault();
        const user_name = this.state.user_name;
        if (user_name.trim() === '') {
            this.setState({
                error: 'Please type your name'
            });
            return;
        }
        fetch('/api/users', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_name
            })
        })
            .then(res => res.json())
            .then((res) => {
                if (res['status'] === 'success') {
                    this.props.setUser({
                        user_name: res['user_name'],
                        user_id: res['user_id']   
                    })
                }
            });
    }

    handleLogout(e) {
        e.preventDefault();
        this.props.setUser({
            user_id: '',
            user_name: ''
        })
    }

    renderInputOrText() {
        if (this.props.user_name === '') {
            return (
                <div>
                    <form onSubmit={this.handleLogin}>
                        <label>Type your name: </label>
                        <input autoFocus type="text" id="user_name" onChange={this.handleChange} value={this.state.user_name} />
                        <button type="submit">Enter</button>
                        {this.state.error}
                    </form>
                </div>
            );
        } else {
            return (
                <div>
                    <form>
                        <label>Your name: </label>
                        {this.props.user_name}
                        <button type="submit">Logout</button>
                    </form>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderInputOrText()}
            </div>
        );
    }
}

LoginForm.propTypes = {
    user_name: PropTypes.string,
    setUser: PropTypes.func
}

export default LoginForm