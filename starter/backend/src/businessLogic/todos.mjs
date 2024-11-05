import { AttachmentUtils } from '../fileStorage/attachmentUtils.mjs';
import { TodosAccess } from '../dataLayer/todosAccess.mjs';
import { createLogger } from '../utils/logger.mjs';
import * as uuid from 'uuid';

const todosAccess = new TodosAccess();
const logger = createLogger('TodosLogic');
const attachmentUtils = new AttachmentUtils();

export async function getTodos(userId) {
    return todosAccess.getTodos(userId);
}

export async function createTodo(createTodoRequest, userId) {
    logger.info('Creating a todo item');
    const todoId = uuid.v4();
    const newTodo = {
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        attachmentUrl: null,
        done: false,
        ...createTodoRequest,
    };

    return todosAccess.createTodoItem(newTodo);
}

export async function updateTodo(todoId, userId, updateToDo) {
    try {
      logger.info("Updating a todo:", { userId, todoId });
      return await todosAccess.updateTodoItem(todoId, userId, updateToDo);
    } catch (error) {
      logger.error("Updating todo error:", { userId, todoId, error });
      throw error;
    }
  }

export async function updateTodoNote(userId, todoId, note) {
    logger.info('Updating todo note');
    const item = await todosAccess.getTodoItem(todoId, userId);

    if (!item) throw new Error('Item not found');

    if (item.userId !== userId) {
        throw new Error('User not authorized to update item');
    }
    return todosAccess.updateTodoNote(todoId, userId, note);
}

export async function deleteTodo(todoId, userId) {
    logger.info('Deleting a todo item');

    const item = await todosAccess.getTodoItem(todoId, userId);

    if (!item) throw new Error('Item not found');
    logger.info('Got item' + item);
    if (item.userId !== userId) {
        logger.info('Got userId' + userId);
        throw new Error('User not authorized to update item');
    }
    return todosAccess.deleteTodoItem(todoId, userId);
}

export async function createAttachmentPresignUrl(todoId) {
    logger.info('Generating upload url');
    return attachmentUtils.generateUploadUrl(todoId);
}

export async function updateAttachmentPresignedUrl(todoId, userId, attachmentUrl) {
    try {
        logger.info("Updating attachment presigned URL:", { userId, todoId });
        return await todosAccess.updateTodoAttachmentUrl(todoId, userId, attachmentUrl);
    } catch (error) {
        logger.error("Updating attachment presigned URL error :", { userId, todoId, error });
        throw error;
    }
}