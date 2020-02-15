import * as uuid from 'uuid'

import { WatchListItem } from '../models/WatchListItem'
import { WatchListAccess } from '../dataLayer/watchListAccess'
import { CreateWatchListItemRequest } from '../requests/CreateWatchListItemRequest'
import { UpdateWatchListItemRequest } from '../requests/UpdateWatchListItemRequest'
import { parseUserId } from '../auth/utils'

const watchListAccess = new WatchListAccess()

export async function getWatchList(jwtToken: string): Promise<WatchListItem[]> {
  const userId = parseUserId(jwtToken)
  return watchListAccess.getWatchList(userId)
}
export async function deleteWatchListItem(jwtToken: string,itemId: string){
	  const userId = parseUserId(jwtToken)
	return watchListAccess.deleteWatchListItem(userId,itemId)

}
export async function generateUploadUrl(jwtToken: string,itemId:string){
	  const userId = parseUserId(jwtToken)
	return watchListAccess.generateUploadUrl(userId,itemId)
}
export async function updateWatchListItem(jwtToken: string,itemReq:UpdateWatchListItemRequest, itemId: string){
	 const userId = parseUserId(jwtToken)
	return watchListAccess.updateWatchListItem(userId,itemReq, itemId)
}
export async function createWatchListItem(itemReq: CreateWatchListItemRequest,jwtToken: string): Promise<WatchListItem> {

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await watchListAccess.createWatchListItem({
    itemId: itemId,
    userId: userId,
    createdAt: Date.now.toString(),
    ...itemReq});
}


