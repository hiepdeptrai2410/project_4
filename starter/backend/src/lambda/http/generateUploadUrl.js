import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { AttachmentUtils } from '../../fileStorage/attachmentUtils.mjs';
import { updateAttachmentPresignedUrl } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('GenerateUploadUrl')
const attachmentUtils = new AttachmentUtils()

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
    })
  )
  .handler(async (event) => {
    try {
      const todoId = event.pathParameters.todoId
      const userId = getUserId(event)
      const uploadUrl = await attachmentUtils.generateUploadUrl(todoId)
      const attachmentUrl = await attachmentUtils.getAttachmentUrl(todoId)
      await updateAttachmentPresignedUrl(todoId, userId, attachmentUrl)
      logger.info('Upload URL generated successfully', { userId, todoId })
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          uploadUrl: uploadUrl,
        }),
      };
    } catch (error) {
      logger.info('Generating upload URL error ', { error: error.message });
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Unable to generate upload URL',
        }),
      };
    }
  });