import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { createLogger } from '../utils/logger.mjs';

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('TodosAccess');

export class TodosAccess {
  constructor(
    docClient = new XAWS.DynamoDB.DocumentClient(),
    todosTable = process.env.TODOS_TABLE
  ) {
    this.docClient = docClient;
    this.todosTable = todosTable;
  }

  async getTodos(userId) {
    logger.info('Getting all todos');

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
        ScanIndexForward: true,
      })
      .promise();

    const items = result.Items;
    return items;
  }

  async getTodoItem(todoId, userId) {
    logger.info('Getting a todo item');

    const result = await this.docClient
      .get({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId,
        },
      })
      .promise();

    return result.Item;
  }

  async createTodoItem(todoItem) {
    logger.info('Creating a todo item');

    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todoItem,
      })
      .promise();

    return todoItem;
  }

  async updateTodoItem(todoId, userId, updateToDo) {
    console.log(`Updating todo item ${todoId} in ${this.todosTable}`);
    console.log(`updateToDo ${updateToDo}`);
    try {
      await this.docClient
        .update({
          TableName: this.todosTable,
          Key: {
            todoId,
            userId,
          },
          UpdateExpression: "set #name = :name, #dueDate = :dueDate, #done = :done",
          ExpressionAttributeNames: {
            "#name": "name",
            "#dueDate": "dueDate",
            "#done": "done",
          },
          ExpressionAttributeValues: {
            ":name": updateToDo.name,
            ":dueDate": updateToDo.dueDate,
            ":done": updateToDo.done,
          },
          ReturnValues: "UPDATED_NEW",
        })
        .promise();
      return updateToDo;
    } catch (error) {
      throw Error(error);
    }
  }

  async deleteTodoItem(todoId, userId) {
    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId,
        },
      })
      .promise();
  }

  async updateTodoAttachmentUrl(todoId, userId, attachmentUrl) {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId,
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl,
        },
      })
      .promise();
  }

  async updateTodoNote(todoId, userId, note) {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId,
        userId,
      },
      UpdateExpression: 'set note = :note',
      ExpressionAttributeValues: {
        ':note': note,
      },
    }).promise();
  }
}