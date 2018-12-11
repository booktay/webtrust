import React, { Component } from 'react'
import {
  Icon,
  Menu,
  Sidebar,
  Header,
} from 'semantic-ui-react'
import Router from 'next/router'

export default class Plate extends Component {
  state = { visible: this.props.sidebarOpened }

  componentWillReceiveProps(nextProps) {
    this.setState(state => {
      state.visible = nextProps.sidebarOpened
    })
  }

  render() {
    const { visible } = this.state
    return (
      <Sidebar as={Menu} animation='push' icon='labeled' inverted
        vertical visible={visible} width='thin' color="black">
        <Menu.Item as='a' onClick={() => Router.push('/')}>
          <Header as='h4' inverted textAlign='left'>
            < Icon name = 'dashboard' / >
            <Header.Content >
              Dashboard
              < Header.Subheader > TH Domain </Header.Subheader>
            </Header.Content>
          </Header>
        </Menu.Item>
        < Menu.Item as='a' onClick={() => Router.push('/domain')}>
          <Header as='h4' inverted textAlign='left' >
            < Icon name = 'line chart' / >
            <Header.Content >
              DomainScore
              < Header.Subheader > Test Score </Header.Subheader>
            </Header.Content>
          </Header>
        </Menu.Item>
        < Menu.Item as='a' onClick={() => Router.push('/web')}>
          <Header as='h4' inverted textAlign='left' >
            < Icon name = 'line chart' / >
            <Header.Content >
              WebScore
              < Header.Subheader > Test Score </Header.Subheader>
            </Header.Content>
          </Header>
        </Menu.Item>
        < Menu.Item as='a' onClick={() => Router.push('/webscore')}>
          <Header as='h4' inverted textAlign='left' >
            < Icon name = 'line chart' / >
            <Header.Content >
              TestScore
              < Header.Subheader > Web Test </Header.Subheader>
            </Header.Content>
          </Header>
        </Menu.Item>
      </Sidebar>
    )
  }
}

