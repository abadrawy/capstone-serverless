import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateWatchListItemRequest } from '../../requests/UpdateWatchListItemRequest'
import { updateWatchListItem } from '../../businessLogic/watchList'
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')




export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
 logger.info('Processing updateWatchListItem event: ', event)

  const itemToUpdate: UpdateWatchListItemRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const itemId = event.pathParameters.itemId

  const updatedItem= await updateWatchListItem(jwtToken,itemToUpdate,itemId)

   return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
     updatedItem
    })
  }

}
