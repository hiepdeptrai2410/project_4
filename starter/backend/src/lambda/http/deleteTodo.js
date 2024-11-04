import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { getUserId } from '../utils.mjs';
import { deleteTodo } from '../../businessLogic/todos.mjs';
require('source-map-support/register');

export const handler = middy(async (event) => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);

  try {
    await deleteTodo(todoId, userId);
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 204,
      body: ''
    };
  } catch (error) {
    console.log('Delte Todo error: ' + error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'server error'
      })
    };
  }
});

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
);