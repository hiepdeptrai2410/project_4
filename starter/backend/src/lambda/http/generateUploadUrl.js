import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { createAttachmentPresignUrl } from '../../businessLogic/todos.mjs';
require('source-map-support/register');

export const handler = middy(async (event) => {
  const todoId = event.pathParameters.todoId;

  try {
    const imgUrl = await createAttachmentPresignUrl(todoId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        uploadUrl: imgUrl
      })
    };
  } catch (error) {
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