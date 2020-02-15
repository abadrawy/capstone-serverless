import { apiEndpoint } from '../config'
import { WatchListItem } from '../types/WatchListItem';
import { CreateWatchListItemRequest } from '../types/CreateWatchListItemRequest';
import Axios from 'axios'
import { UpdateWatchListItemRequest } from '../types/UpdateWatchListItemRequest';

export async function getWatchList(idToken: string): Promise<WatchListItem[]> {
  console.log('Fetching watchList items')

  const response = await Axios.get(`${apiEndpoint}/watchList`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Items:', response.data)
  return response.data.items
}

export async function createWatchListItem(
  idToken: string,
  newItem: CreateWatchListItemRequest
): Promise<WatchListItem> {
  const response = await Axios.post(`${apiEndpoint}/watchList`,  JSON.stringify(newItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchWatchListItem(
  idToken: string,
  itemId: string,
  updatedItem: UpdateWatchListItemRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/watchList/${itemId}`, JSON.stringify(updatedItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteWatchListItem(
  idToken: string,
  itemId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/watchList/${itemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  itemId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/watchList/${itemId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log("request",`${apiEndpoint}/watchList/${itemId}/attachment`)
  console.log("url response",response.data)
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
