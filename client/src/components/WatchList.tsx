import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Loader
} from 'semantic-ui-react'

import { createWatchListItem, deleteWatchListItem, getWatchList, patchWatchListItem } from '../api/watchList-api'
import Auth from '../auth/Auth'
import { WatchListItem } from '../types/WatchListItem'

interface WatchListProps {
  auth: Auth
  history: History
}

interface WatchListState {
  watchList: WatchListItem[]
  newWatchListItemName: string
  loadingWatchList: boolean
}

export class WatchList extends React.PureComponent<WatchListProps, WatchListState> {
  state: WatchListState = {
    watchList: [],
    newWatchListItemName: '',
    loadingWatchList: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newWatchListItemName: event.target.value })
  }

  onEditButtonClick = (itemId: string) => {
    this.props.history.push(`/watchList/${itemId}/edit`)
  }

  onWatchListItemCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newWatchListItem = await createWatchListItem(this.props.auth.getIdToken(), {
        name: this.state.newWatchListItemName
      })
      this.setState({
        watchList: [...this.state.watchList, newWatchListItem],
        newWatchListItemName: ''
      })
    } catch {
      alert('Item creation failed')
    }
  }

  onWatchListItemDelete = async (itemId: string) => {
    try {
      await deleteWatchListItem(this.props.auth.getIdToken(), itemId)
      this.setState({
        watchList: this.state.watchList.filter(watchListItem => watchListItem.itemId != itemId)
      })
    } catch {
      alert('Item deletion failed')
    }
  }

  onWatchListItemCheck = async (pos: number) => {
    try {
      const watchListItem = this.state.watchList[pos]
      await patchWatchListItem(this.props.auth.getIdToken(), watchListItem.itemId, {
        name: watchListItem.name
      })
      this.setState({
        watchList: update(this.state.watchList, {
        })
      })
    } catch {
      alert('Item deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const watchList = await getWatchList(this.props.auth.getIdToken())
      this.setState({
        watchList,
        loadingWatchList: false
      })
    } catch (e) {
      alert(`Failed to fetch watchList: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Watch List</Header>

        {this.renderCreateWatchListItemInput()}

        {this.renderWatchList()}
      </div>
    )
  }

  renderCreateWatchListItemInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Video',
              onClick: this.onWatchListItemCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Enter video name to add to watch list..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderWatchList() {
    if (this.state.loadingWatchList) {
      return this.renderLoading()
    }

    return this.renderWatchListList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading WatchList
        </Loader>
      </Grid.Row>
    )
  }

  renderWatchListList() {
    return (
      <Grid padded>
        {this.state.watchList.map((watchListItem, pos) => {
          return (
            <Grid.Row key={watchListItem.itemId}>
              
              <Grid.Column width={10} verticalAlign="middle">
                {watchListItem.name}
              </Grid.Column>
              
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(watchListItem.itemId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onWatchListItemDelete(watchListItem.itemId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {watchListItem.attachmentUrl && (
                <video width="750" height="500" controls >
                <source src={watchListItem.attachmentUrl} type="video/mp4"/>
               </video>
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
