import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ToDo from './ToDo';

class ShowToDos extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <ul>
                    {this.props.todos.map((todo) => {
                        return (
                            <ToDo 
                                key={todo['todo_id']} 
                                todo={todo} 
                                updateToDos={this.props.updateToDos}
                            />
                        )
                    })}
                </ul>
            </div>
        );
    }

}

ShowToDos.propTypes = {
    todos: PropTypes.array,
    updateToDos: PropTypes.func
}

export default ShowToDos;