import { test, expect, request, APIRequestContext } from '@playwright/test';
import { graphqlRequest } from '../objects/graphqlClient';
import { Logger } from '../utils/debugLogger';
import dotenv from 'dotenv';

dotenv.config();

let insertedTodoId: number;

test.describe('Todo GraphQL flow: insert, update, delete', () => {
  let requestContext: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    requestContext = await request.newContext();
  });

  test.afterAll(async () => {
    await requestContext.dispose();
  });

  test('should insert a new todo', async () => {
    const mutation = `
      mutation ($todo: todos_insert_input!) {
        insert_todos(objects: [$todo]) {
          returning {
            id
            title
          }
        }
      }
    `;

    const variables = { todo: { title: 'max automation' } };

    const data = await graphqlRequest<{
      insert_todos: { returning: { id: number; title: string }[] };
    }>(requestContext, mutation, variables);

    Logger.log('Insert response', data);

    insertedTodoId = data.insert_todos.returning[0].id;
    expect(insertedTodoId).toBeDefined();
  });

  test('should update the inserted todo', async () => {
    const mutation = `
      mutation($id: Int, $title: String, $is_completed: Boolean) {
        update_todos(
          where: { id: { _eq: $id } },
          _set: { title: $title, is_completed: $is_completed }
        ) {
          returning {
            id
            title
            is_completed
          }
        }
      }
    `;

    const variables = {
      id: insertedTodoId,
      title: 'Automation QA',
      is_completed: false,
    };

    const data = await graphqlRequest<{
      update_todos: { returning: { id: number; title: string; is_completed: boolean }[] };
    }>(requestContext, mutation, variables);

    Logger.log('Update response', data);

    expect(data.update_todos.returning[0].title).toBe('Automation QA');
  });

  test('should delete the inserted todo', async () => {
    const mutation = `
      mutation ($id: Int!) {
        delete_todos(where: { id: { _eq: $id } }) {
          returning {
            id
            title
          }
        }
      }
    `;

    const variables = { id: insertedTodoId };

    const data = await graphqlRequest<{
      delete_todos: { returning: { id: number; title: string }[] };
    }>(requestContext, mutation, variables);

    Logger.log('Delete response', data);

    expect(data.delete_todos.returning[0].id).toBe(insertedTodoId);
  });
});
