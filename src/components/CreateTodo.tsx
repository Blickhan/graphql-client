import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Input, Button, Alert } from 'antd';
import { get } from 'lodash';
import { TODOS } from '../queries';
import { Todo } from '../models/Todo';

const CREATE_TODO = gql`
  mutation CreateTodo($title: String!) {
    createTodo(title: $title) {
      errors {
        message
      }
      todo {
        id
        title
        completed
      }
    }
  }
`;

export default (): JSX.Element => {
  const [createTodo] = useMutation(CREATE_TODO, {
    update(cache, { data: { createTodo } }) {
      if (createTodo.todo) {
        const data = cache.readQuery({ query: TODOS });
        const todos = get(data, 'todos', []);
        // Only add it to the cache if it hasn't already been added (by the subscription)
        if (!todos.find((todo: Todo) => todo.id === createTodo.todo.id)) {
          cache.writeQuery({
            query: TODOS,
            data: { todos: [...todos, createTodo.todo] },
          });
        }
      }
    },
  });
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const {
        data: {
          createTodo: { errors },
        },
      } = await createTodo({ variables: { title } });

      if (errors) {
        throw new Error(errors[0].message);
      }

      setTitle('');
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  return (
    <div style={{ paddingBottom: '20px' }}>
      {errorMessage && (
        <div style={{ paddingBottom: '10px' }}>
          <Alert message={errorMessage} type="error" banner closable />
        </div>
      )}
      <form onSubmit={onSubmit}>
        <span style={{ paddingRight: '5px' }}>
          <Input
            style={{ maxWidth: '400px' }}
            placeholder="What do you need to get done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </span>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </form>
    </div>
  );
};
