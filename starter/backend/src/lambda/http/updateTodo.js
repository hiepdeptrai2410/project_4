import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { getUserId } from '../utils.mjs';
import { updateTodo } from '../../businessLogic/todos.mjs';
require('source-map-support/register');

export const handler = middy(async (event) => {
  const todoId = event.pathParameters.todoId;
  const updatedTodo = JSON.parse(event.body);
  const userId = getUserId(event);

  try {
    await updateTodo(userId, todoId, updatedTodo);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message
      })
    };
  }
});

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
);