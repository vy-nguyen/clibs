'use strict';

import React        from 'react-mod';
import classnames   from 'classnames';

import JarvisWidget from './JarvisWidget.jsx';
import TodoStore    from '../stores/TodoStore.jsx';
import TodoActions  from '../actions/TodoActions.jsx';

import TodoList     from './TodoList.jsx';
import TodoForm     from './TodoForm.jsx';

class TodoWidget extends React.Component
{
    constructor(props) {
        super(props);
        this._toggleAdd = this._toggleAdd.bind(this);
        this._updateState = this._updateState.bind(this);

        this.state = TodoStore.getData();
    }

    componentDidMount() {
        this.unsub = TodoStore.listen(this._updateState);
    }

    componentWiiUnmount() {
        if (this.unsub != null) {
            this.unsub();
            this.unsub = null;
        }
    }

    _updateState() {
        this.setState(TodoStore.getData());
    }

    _toggleAdd() {
        TodoActions.toggleNewTodo()
    }

    render() {
        return (
            <JarvisWidget editbutton={false} color="blue">
                <header>
                    <span className="widget-icon"><i className="fa fa-check txt-color-white"/></span>
                    <h2> ToDo's </h2>
                    <div className="widget-toolbar">
                        <button className={classnames(["btn btn-xs btn-default", {
                            active: this.state.newTodo
                        }])} onClick={this._toggleAdd}>
                            <i className={classnames({
                                'fa fa-plus': !this.state.newTodo, 'fa fa-times': this.state.newTodo})
                            }/> Add
                        </button>
                    </div>
                </header>
                <div>
                    <div className="widget-body no-padding smart-form">
                        <div className={classnames({ 'hidden': !this.state.newTodo })}>
                            <h5 className="todo-group-title"><i className="fa fa-plus-circle"/> New Todo</h5>
                            <TodoForm />
                        </div>
                        <TodoList type="Critical" title="Critical Tasks" icon="warning"
                            items={this.state.items.filter(function(item) {
                                return item.type == 'Critical'
                            })}
                        />
                        <TodoList type="Important" title="Important Tasks" icon="exclamation"
                            items={this.state.items.filter(function(item) {
                                return item.type == 'Important'
                            })}
                        />
                        <TodoList type="Completed" title="Completed Tasks" icon="check"
                            items={this.state.items.filter(function(item) {
                                return item.type == 'Completed'
                            })}
                        />
                    </div>
                </div>
            </JarvisWidget>
        )
    }
}

export default TodoWidget;
