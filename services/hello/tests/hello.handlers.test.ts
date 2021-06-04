/**
 * @jest-environment node
 */

import { APIGatewayEvent, Context } from 'aws-lambda';
import axios from 'axios';

import { getBaseURl } from '@packages/base/helpers'

import handlers from '../handlers';
// @ts-ignore
import config from '../serverless';


const baseUrl = getBaseURl(config);

test('say hello', async() => {
  const event = {} as APIGatewayEvent;
  const context = {} as Context;
  const response = await handlers.hello(event, context);

  expect(response.statusCode).toEqual(200);
  expect(response.body).toBe('welcome');
});

test('api hello', async() => {
  const response = await axios.get(baseUrl);

  expect(response.status).toEqual(200);
  expect(response.data).toBe('welcome');
});
