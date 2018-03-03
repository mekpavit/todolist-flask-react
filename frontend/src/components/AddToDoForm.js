import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AddToDoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            todo_description: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    } 

    handleSubmit(e) {
        e.preventDefault();
        const todo_description = this.state.todo_description.trim();
        if (todo_description === '') {
            this.setState({
                error: "Please type your todo's description"
            })
            return;
        } else {
            fetch('/api/todos/add', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: this.props.user_id,
                    todo_description
                })
            })
                .then(res => res.json())
                .then((res) => {
                    if (res['status'] === 'success') {
                        this.setState({
                            todo_description: ''
                        });
                        this.props.updateToDos();
                    } else {
                        this.setState({
                            error: 'something went wrong!'
                        });
                    }
                });
        }
    }

    renderNothingOrForm() {
        if (this.props.user_id === null) {
            return <p>Please login first!</p>
        } else {
            return (
                <form onSubmit={this.handleSubmit}>
                    <label>Add todo: </label>
                    <input autoFocus type="text" id="todo_description" onChange={this.handleChange} value={this.state.todo_description}/>
                    <button type="Submit">Add</button>
                </form>
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderNothingOrForm()}
            </div>
        );
    }
}

AddToDoForm.propTypes = {
    user_id: PropTypes.number,
    updateToDos: PropTypes.func
}

export default AddToDoForm;