import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import { updateTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import httpCors from '@middy/http-cors'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('UpdateTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    httpCors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const newTodo = JSON.parse(event.body)
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const updatedTodo = await updateTodo(todoId, userId, newTodo)
    logger.info('Todo updated') 
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: updatedTodo
      })
    }
  })