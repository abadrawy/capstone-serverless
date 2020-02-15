import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)


import { WatchListItem } from '../models/WatchListItem'
import { WatchListItemUpdate } from '../models/WatchListItemUpdate'
import { createLogger } from '../utils/logger'
const logger = createLogger('auth')



export class WatchListAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly watchListTable = process.env.WATCHLIST_TABLE ,
    private readonly userIndex = process.env.USER_ID_INDEX,
    private readonly bucketName = process.env.WATCHLIST_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly s3 = new AWS.S3({
    signatureVersion: 'v4'
    })

    ) {}

  async getWatchList(userId: string): Promise<WatchListItem[]> {
    logger.info('Getting all items in watchList')

    const result = await this.docClient.query({
       TableName : this.watchListTable,
       IndexName : this.userIndex,
       KeyConditionExpression: 'userId = :userId',
       ExpressionAttributeValues: {
         ':userId': userId
      }
    }).promise()

    const items = result.Items
    return items as WatchListItem[]
  }

  async deleteWatchListItem(userId: string,itemId: string){
    const deleted = await this.docClient.delete({
        TableName: this.watchListTable,
        Key: {
          userId,
          itemId
        }
      }).promise();


     return deleted;

  }
  async generateUploadUrl(userId: string,itemId:string){
    const validItemId = await this.itemExists(userId,itemId)
  if (!validItemId) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Item does not exist'
      })
    }
    logger.info('could not generate url, item does not exist')

  }

  
    

   const uploadUrl= this.s3.getSignedUrl('putObject', {
    Bucket: this.bucketName,
    Key: itemId,
    Expires: this.urlExpiration
  })

   await this.docClient.update({
        TableName: this.watchListTable,
        Key: { userId, itemId },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ":attachmentUrl":`https://${this.bucketName}.s3.amazonaws.com/${itemId}`
        },
      }).promise();

   return uploadUrl;
  }


async  itemExists(userId: string,itemId: string) {
  const result = await this.docClient
    .get({
      TableName: this.watchListTable,
      Key: {
        userId,
        itemId

      }
    })
    .promise()

  logger.info('Get Item: ', result)
  return !!result.Item
}

  async updateWatchListItem(userId:string,updatedItem: WatchListItemUpdate, itemId:string){
    const newUpdatedItem = await this.docClient.update({
        TableName: this.watchListTable,
        Key: { userId, itemId },
        UpdateExpression: 'set itemName = :name',
        ExpressionAttributeValues: {
          ':name':updatedItem.name
        },
        ReturnValues: "ALL_NEW"
      }).promise();

    return newUpdatedItem
  }

  async createWatchListItem(item: WatchListItem): Promise<WatchListItem> {
    
    await this.docClient.put({
        TableName: this.watchListTable,
        Item: item
      }).promise()
    
      return item;

    }
  }

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}