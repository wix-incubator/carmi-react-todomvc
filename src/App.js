import React, { Component } from 'react';
import 'todomvc-app-css/index.css';
import 'todomvc-common/base.css';
import model from './model';
import carmiReact from 'carmi-react';

const ENTER_KEY = 13;
function stopEditing(id, value) {
  this.$startBatch();
  value = value || '';
  value = value.trim();
  if (value === '') {
    this.spliceItems(this.todosIndexById[id], 1);
  } else {
    this.setTitle(this.todosIndexById[id], value);
  }
  this.setEditing(id);
  this.$endBatch();
}
const { Provider, funcLib } = carmiReact({});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = model(
      {
        filter: 'all',
        editing: {},
        todos: []
      },
      {
        ...funcLib,
        setDone: function(id, value) {
          this.setDone(this.todosIndexById[id], value);
        },

        removeItem: function(id) {
          this.spliceItems(this.todosIndexById[id], 1);
        },
        updateEditing: function(id, evt) {
          this.setEditing(id, evt.target.value);
        },
        stopEditing: stopEditing,
        editInputKeyPress: function(evt) {
          if (evt.keyCode === ENTER_KEY) {
            evt.preventDefault();
            evt.target.blur();
          }
        },
        setAllDone: function(value, evt) {
          if (this.$model.todos.length) {
            this.$startBatch();
            this.$model.todos.forEach((todo, index) => {
              this.setDone(index, !value);
            });
            this.$endBatch();
          }
        },
        newTodoKeyDown: function(evt) {
          const title = (evt.target.value || '').trim();
          if (evt.keyCode === ENTER_KEY && title) {
            const id = '' + new Date().getTime();
            this.setItem(this.$model.todos.length, { id, title, done: false });
            evt.target.value = '';
          }
        },
        clearDoneItems: function() {
          this.spliceItems.apply(null, [0, this.$model.todos.length].concat(this.pendingItems));
        },
        setFilter: function(newFilter) {
          this.setFilter(newFilter);
        }
      }
    );
  }
  render() {
    return <Provider instance={this.state}>{() => this.state.todosList}</Provider>;
  }
}

export default App;
