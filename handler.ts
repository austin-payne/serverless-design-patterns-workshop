import * as AWS from "aws-sdk";
import * as uuid from "uuid";
import type { APIGatewayProxyHandler } from "aws-lambda";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const createItem: APIGatewayProxyHandler = async (event) => {
  const data = JSON.parse(event.body!);
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Item: {
      id: uuid.v4(),
      text: data.text,
      createdAt: new Date().toISOString(),
    },
  };

  await dynamoDb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
  };
};

export const getItem: APIGatewayProxyHandler = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: event.pathParameters!.id,
    },
  };

  const result = await dynamoDb.get(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  };
};

export const listItem: APIGatewayProxyHandler = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
  };

  const result = await dynamoDb.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
};

export const deleteItem: APIGatewayProxyHandler = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: event.pathParameters!.id,
    },
  };

  await dynamoDb.delete(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};
