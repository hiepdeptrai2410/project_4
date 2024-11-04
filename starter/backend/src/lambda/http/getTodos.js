import middy from 'middy';
import { cors } from 'middy/middlewares';
import { getUserId } from '../utils.mjs';
import { getTodos } from '../../businessLogic/todos.mjs';
require('source-map-support/register');

// Get all TODO items for a current user
export const handler = middy(async (event) => {
  const userId = getUserId(event);

  const todos = await getTodos(userId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos,
    }),
  };
});

handler.use(
  cors({
    credentials: true,
  })
);