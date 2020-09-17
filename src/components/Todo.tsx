import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { get } from 'lodash';
import classNames from 'classnames';
import { TODOS } from '../queries';
import { Todo } from '../models/Todo';

import './Todo.css';

const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: Float!) {
    toggleTodo(id: $id) {
      errors {
        message
      }
      todo {
        id
        completed
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: Float!) {
    deleteTodo(id: $id) {
      errors {
        message
      }
      success
    }
  }
`;

interface TodoProps {
  id: number;
  title: string;
  completed: boolean;
}

export default ({ id, title, completed }: TodoProps): JSX.Element => {
  const [toggleTodo] = useMutation(TOGGLE_TODO, {
    onCompleted({ toggleTodo: { errors } }) {
      if (errors) {
        message.error(errors[0].message);
      }
    },
  });
  const [deleteTodo] = useMutation(DELETE_TODO, {
    update(cache, { data: { deleteTodo } }) {
      if (deleteTodo.success) {
        const data = cache.readQuery({ query: TODOS });
        const todos = get(data, 'todos', []);
        cache.writeQuery({
          query: TODOS,
          data: {
            todos: todos.filter((todo: Todo) => todo.id !== id),
          },
        });
      }
    },
    onCompleted({ deleteTodo: { errors } }) {
      if (errors) {
        message.error(errors[0].message);
      }
    },
  });

  return (
    <div className="todo">
      <div className="spread">
        <div
          className={classNames('title', completed ? 'completed' : '')}
          onClick={() => toggleTodo({ variables: { id } })}
        >
          {title}
        </div>
        <Button
          type="link"
          danger
          className="delete"
          style={{ display: 'none' }}
          onClick={() => deleteTodo({ variables: { id } })}
        >
          <CloseOutlined />
        </Button>
      </div>
      <div className="divider"></div>
    </div>
  );
};
