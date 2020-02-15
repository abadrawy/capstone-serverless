import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getWatchList } from '../../businessLogic/watchList'
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


 logger.info('Processing getWatchList event: ', event)

 const authorization = event.headers.Authorization
 const split = authorization.split(' ')
 const jwtToken = split[1]
 const items= await getWatchList(jwtToken);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items
      })
   }
  
}
