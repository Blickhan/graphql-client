import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useQuery, gql } from '@apollo/client';
import { get } from 'lodash';
import { Todo as TodoModel } from '../models/Todo';
import Todo from './Todo';
import CreateTodo from './CreateTodo';
import { TODOS } from '../queries';

const TODO_ADDED = gql`
  subscription TodoAdded {
    todoAdded {
      id
      title
      completed
    }
  }
`;
const TODO_DELETED = gql`
  subscription TodoDeleted {
    todoDeleted
  }
`;
const TODO_UPDATED = gql`
  subscription TodoUpdated {
    todoUpdated {
      id
      title
      completed
    }
  }
`;

export default () => {
  const [isFakeLoading, setIsFakeLoading] = useState(true);
  const { data, loading, subscribeToMore } = useQuery<{ todos: TodoModel[] }>(
    TODOS
  );

  useEffect(() => {
    subscribeToMore({
      document: TODO_ADDED,
      updateQuery: (prev, { subscriptionData }) => {
        const todoAdded = get(subscriptionData, 'data.todoAdded');
        if (todoAdded) {
          const todos = prev.todos;
          // Only add it to the cache if it hasn't been added already
          if (!todos.find((todo: TodoModel) => todo.id === todoAdded.id)) {
            return { todos: [...todos, todoAdded] };
          }
        }
        return prev;
      },
    });
    subscribeToMore({
      document: TODO_DELETED,
      updateQuery: (prev, { subscriptionData }) => {
        const todoDeleted = get(subscriptionData, 'data.todoDeleted');
        if (todoDeleted) {
          const todos = prev.todos.filter((todo) => todo.id !== todoDeleted);
          return { todos };
        }
        return prev;
      },
    });
    subscribeToMore({
      document: TODO_UPDATED,
      updateQuery: (prev, { subscriptionData }) => {
        const todoUpdated = get(subscriptionData, 'data.todoUpdated');
        if (todoUpdated) {
          const todos = prev.todos.map((todo: TodoModel) =>
            todo.id === todoUpdated.id ? todoUpdated : todo
          );
          return { todos };
        }
        return prev;
      },
    });
  }, [subscribeToMore]);

  setTimeout(() => {
    setIsFakeLoading(false);
  }, 500);

  if (loading || isFakeLoading) {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return <Spin indicator={antIcon} />;
  }

  return (
    <div>
      <h1
        style={{
          paddingLeft: '20px',
          fontSize: '20pt',
          fontStyle: 'italic',
        }}
      >
        Todos
      </h1>
      <div className="content">
        <CreateTodo />
        {data &&
          data.todos.map((todo: TodoModel) => {
            return <Todo key={todo.id} {...todo} />;
          })}
      </div>
    </div>
  );
};
