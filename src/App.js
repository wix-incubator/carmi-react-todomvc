import React, { Component } from 'react';
import 'todomvc-app-css/index.css';
import 'todomvc-common/base.css';
import model from './model';
import carmiReact from 'carmi-react';

const ENTER_KEY = 13;
function stopEditing(instance, id, value) {
  instance.$startBatch();
  value = value || '';
  value = value.trim();
  if (value === '') {
    instance.spliceItems(instance.todosIndexById[id], 1);
  } else {
    instance.setTitle(instance.todosIndexById[id], value);
  }
  instance.setEditing(id);
  instance.$endBatch();
}
const { Provider, funcLib } = carmiReact({
  setDone: (instance, id, value) => instance.setDone(instance.todosIndexById[id], value),
  removeItem: (instance, id) => instance.spliceItems(instance.todosIndexById[id], 1),
  updateEditing: (instance, id, evt) => instance.setEditing(id, evt.target.value),
  stopEditing: stopEditing,
  editInputKeyPress: (instance, evt) => {
    if (evt.keyCode === ENTER_KEY) {
      evt.preventDefault();
      evt.target.blur();
    }
  },
  setAllDone: (instance, value, evt) => {
    if (instance.$model.todos.length) {
      instance.$startBatch();
      instance.$model.todos.forEach((todo, index) => {
        instance.setDone(index, !value);
      });
      instance.$endBatch();
    }
  },
  newTodoKeyDown: (instance, evt) => {
    const title = (evt.target.value || '').trim();
    if (evt.keyCode === ENTER_KEY && title) {
      const id = '' + new Date().getTime();
      instance.setItem(instance.$model.todos.length, { id, title, done: false });
      evt.target.value = '';
    }
  },
  clearDoneItems: instance =>
    instance.spliceItems.apply(null, [0, instance.$model.todos.length].concat(instance.pendingItems))
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = model(
      {
        filter: 'all',
        editing: {},
        todos: []
      },
      funcLib
    );
  }
  render() {
    return <Provider instance={this.state}>{() => this.state.todosList}</Provider>;
  }
}

export default App;
