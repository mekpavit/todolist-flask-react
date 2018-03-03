import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ToDo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing_status: false,
            todo_description: this.props.todo['todo_description']
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleClick(e) {
        this.setState({
            editing_status: true
        })
    }

    handleChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        fetch('/api/todos/edit', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                todo_id: this.props.todo['todo_id'],
                todo_description: this.state.todo_description
            })
        })
            .then(res => res.json())
            .then((res) => {
                if (res['status'] === 'success') {
                    this.setState({editing_status: false})
                    this.props.updateToDos();
                }
            })
    }

    renderTextOrEdit() {
        if (this.state.editing_status === false) {
            return (
                <li key={this.props.todo['todo_id']} onClick={this.handleClick}>
                    {this.props.todo['todo_description']} {this.props.todo['todo_timestamp']}
                    <button type="button" id="delete" onClick={this.handleDelete}>Delete</button>
                </li>
            );
        } else {
            return (
                <li key={this.props.todo['todo_id']}>
                    <form onSubmit={this.handleSubmit}>
                        <input autoFocus type="text" id="todo_description" onChange={this.handleChange} value={this.state.todo_description}/>
                        <button type="submit">Update</button>
                        <button type="button" id="delete" onClick={this.handleDelete}>Delete</button>
                    </form>
                </li>
            );
        }
    }

    handleDelete(e) {
        e.preventDefault();
        fetch('/api/todos/delete', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                todo_id: this.props.todo['todo_id']
            })
        })
            .then(res => res.json())
            .then((res) => {
                if (res['status'] === 'success') {
                    this.props.updateToDos()
                }
            })
    }

    render() {
        return (
            this.renderTextOrEdit()
        );
    }
}

ToDo.propTypes = {
    todo: PropTypes.object,
    updateToDos: PropTypes.func
}

export default ToDo;