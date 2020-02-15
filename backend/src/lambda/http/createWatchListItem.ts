import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateWatchListItemRequest } from '../../requests/CreateWatchListItemRequest'
import { createWatchListItem } from '../../businessLogic/watchList'
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing createWatchListItem event: ', event)

  const itemReq: CreateWatchListItemRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const item = await createWatchListItem(itemReq, jwtToken)
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
    })
  };
}
