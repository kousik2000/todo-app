"use client"

import React, { useState, useEffect } from 'react';

const TodoApp = () => {
  const [todoText, setTodoText] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  const addTodo = () => {
    if (todoText.trim() === '') return;

    const newTodo = {
      id: todos.length + 1,
      text: todoText,
      completed: false,
      editMode: false,
    };

    setTodos([...todos, newTodo]);
    updateLocalStorage([...todos, newTodo]);

    setTodoText('');
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    updateLocalStorage(updatedTodos);
  };

  const toggleComplete = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }
      return todo;
    });

    setTodos(updatedTodos);
    updateLocalStorage(updatedTodos);
  };

  const toggleEditMode = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          editMode: !todo.editMode,
        };
      }
      return todo;
    });

    setTodos(updatedTodos);
    updateLocalStorage(updatedTodos);
  };

  const updateTodoText = (id, newText) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          text: newText,
          editMode: false,
        };
      }
      return todo;
    });

    setTodos(updatedTodos);
    updateLocalStorage(updatedTodos);
  };

  const updateLocalStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  return (
    <div className='bg-white min-h-screen p-4'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Todo App</h1>

      <div className='mb-4 items-center text-center'>
        <input
          type='text'
          className='border border-gray-300 rounded p-2 mr-2'
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mr-2 mt-2'
          onClick={addTodo}
        >
          Add Todo
        </button>
      </div>

      <ul className='flex flex-col items-center'>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className='flex items-center justify-between mb-2 min-w-[340px] mt-5 border border-blue p-3 rounded'
          >
            {todo.editMode ? (
              <input
                type='text'
                value={todo.text}
                onChange={(e) => updateTodoText(todo.id, e.target.value)}
                className='border border-gray-300 rounded p-2 mr-2'
              />
            ) : (
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
            )}

            <div>
              {todo.editMode ? (
                <button
                  className='bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded mr-1'
                  onClick={() => toggleEditMode(todo.id)}
                >
                  Save
                </button>
              ) : (
                <button
                  className='bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded mr-2'
                  onClick={() => toggleEditMode(todo.id)}
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => deleteTodo(todo.id)}
                className='bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded'
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
