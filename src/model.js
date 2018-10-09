import 'carmi/macro';
// @carmi

const { root, setter, arg0, ternary, splice, and, or } = require('carmi');
const { createElement, bind } = require('carmi/jsx');
const React = { createElement };

const todos = root.get('todos');
const editing = root.get('editing');
const todosIndexById = todos
  .map((item, pos) => [item.get('id'), pos])
  .keyBy(item => item.get(0))
  .mapValues(item => item.get(1));
const isEditing = editing.mapValues(item =>
  or(item, item.eq(''))
    .not()
    .not()
);
const todosByIdx = todos.keyBy(item => item.get('id')).mapValues((item, id) => (
  <li key={id} className={ternary(isEditing.get(id), 'editing ', ' ').plus(ternary(item.get('done'), 'completed', ''))}>
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        checked={item.get('done')}
        onChange={bind('setDone', id, item.get('done').not())}
      />
      <label onDoubleClick={bind('setEditing', id, item.get('title'))}>{item.get('title')}</label>
      <button className="destroy" onClick={bind('removeItem', id)} />
    </div>
    <input
      className="edit"
      value={or(editing.get(id), '')}
      onChange={bind('updateEditing', id)}
      onBlur={bind('stopEditing', id, editing.get(id))}
      onKeyDown={bind('editInputKeyPress')}
      autoFocus={isEditing.get(id)}
    />
  </li>
));
const currentFilter = root.get('filter');
const visibleTodos = todos.filter(item =>
  or(
    currentFilter.eq('all'),
    and(currentFilter.eq('completed'), item.get('done')),
    and(currentFilter.eq('active'), item.get('done').not())
  )
);
const todosElements = visibleTodos.map(item => todosByIdx.get(item.get('id')));
const pendingItems = todos.filter(item => item.get('done').not());
const doneItems = todos.filter(item => item.get('done'));
const pendingCount = pendingItems.size();
function getFilterElement(filter) {
  const href = '#/' + filter;
  return (
    <li key={filter}>
      <a href={href} className={ternary(currentFilter.eq(filter), 'selected', '')} onClick={bind('setFilter', filter)}>
        {filter[0].toUpperCase() + filter.slice(1)}
      </a>
    </li>
  );
}

const filters = ['all', 'active', 'completed'].map(getFilterElement);
const todosList = (
  <div>
    <header>
      <h1 className="header">todos</h1>
      <input id="new-todo" placeholder="What needs to be done?" autoFocus onKeyDown={bind('newTodoKeyDown')} />
    </header>
    {ternary(
      todos.size(),
      <section id="main">
        <input
          id="toggle-all"
          type="checkbox"
          checked={pendingCount.not()}
          onChange={bind('setAllDone', pendingCount.not())}
        />
        <label htmlFor="toggle-all" />
        <ul id="todo-list">{todosElements}</ul>
      </section>,
      null
    )}
    {ternary(
      todos.size(),
      <footer id="footer">
        <span id="todo-count">
          <strong>{pendingCount}</strong>
          {ternary(pendingCount.eq(1), ' item left', ' items left')}
        </span>
        <ul id="filters">{filters}</ul>
        <button
          id="clear-completed"
          style={ternary(doneItems.size(), {}, { display: 'none' })}
          onClick={bind('clearDoneItems')}
        >
          Clear completed
        </button>
      </footer>,
      null
    )}
  </div>
);
const model = {
  todosList: todosList,
  pendingItems,
  todosIndexById,
  setItem: setter('todos', arg0),
  spliceItems: splice('todos'),
  setDone: setter('todos', arg0, 'done'),
  setTitle: setter('todos', arg0, 'title'),
  setFilter: setter('filter'),
  setEditing: setter('editing', arg0)
};

module.exports = model;
