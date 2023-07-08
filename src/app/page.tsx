"use client"

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { types, Instance, flow } from 'mobx-state-tree';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoModel = types
  .model('Todo', {
    id: types.identifierNumber,
    text: types.string,
    completed: false,
  })
  .actions(self => ({
    toggleComplete() {
      self.completed = !self.completed;
    },
  }));

const TodoStore = types
  .model('TodoStore', {
    todos: types.array(TodoModel),
  })
  .actions(self => ({
    addTodo: flow(function* (text: string) {
      const newTodo: Todo = {
        id: self.todos.length + 1,
        text,
        completed: false,
      };

      self.todos.push(newTodo);
      self.updateLocalStorage();
    }),
    deleteTodoById: flow(function* (id: number) {
      self.todos.replace(self.todos.filter(todo => todo.id !== id));
      self.updateLocalStorage();
    }),
    updateLocalStorage() {
      localStorage.setItem('todos', JSON.stringify(self.todos));
    },
    getTodosFromLocalStorage: flow(function* () {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos);
        self.todos = parsedTodos;
      }
    }),
  }));

type TodoStoreType = Instance<typeof TodoStore>;

const todoStore = TodoStore.create({
  todos: [],
});

const TodoApp: React.FC = () => {
  const [todoText, setTodoText] = useState('');

  useEffect(() => {
    todoStore.getTodosFromLocalStorage();
  }, []);

  const addTodo = () => {
    if (todoText.trim() === '') return;

    todoStore.addTodo(todoText);
    setTodoText('');
  };

  const deleteTodo = (id: number) => {
    todoStore.deleteTodoById(id);
  };

  const toggleComplete = (id: number) => {
    const todo = todoStore.todos.find(todo => todo.id === id);
    if (todo) {
      todo.toggleComplete();
    }
  };

  return (
    <div className='bg-white min-h-screen p-4'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Todo App</h1>

      <div className='mb-4 items-center text-center'>
        <input
          type='text'
          className='border border-gray-300 rounded p-2 mr-2'
          value={todoText}
          onChange={e => setTodoText(e.target.value)}
        />
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mr-2 mt-2'
          onClick={addTodo}
        >
          Add Todo
        </button>

      </div>

      <ul className='flex flex-col items-center'>
        {todoStore.todos.map(todo => (
          <li
            key={todo.id}
            className='flex items-center justify-between mb-2 min-w-[340px] mt-5 border border-blue p-3 rounded'
          >
            <div className='flex items-center'>
              <input
                type='checkbox'
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className='mr-2'
              />
              <span className={todo.completed ? 'line-through' : ''}>
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className='bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded ml-auto'
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default observer(TodoApp);
