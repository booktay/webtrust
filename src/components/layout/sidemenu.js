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
            < Icon name='dashboard' />
            <Header.Content >
              Dashboard
              < Header.Subheader > TH Domain </Header.Subheader>
            </Header.Content>
          </Header>
        </Menu.Item>
        < Menu.Item as='a' onClick={() => Router.push('/domain')}>
          <Header as='h4' inverted textAlign='left' >
            < Icon name='area graph' />
            <Header.Content >
              Subdomain
              < Header.Subheader > Score </Header.Subheader>
            </Header.Content>
          </Header>
        </Menu.Item>
        < Menu.Item as='a' onClick={() => Router.push('/testscore')}>
          <Header as='h4' inverted textAlign='left' >
            < Icon name='code' />
            <Header.Content >
              URL
              < Header.Subheader > Web Score</Header.Subheader>
            </Header.Content>
          </Header>
        </Menu.Item>
        < Menu.Item as='a' onClick={() => Router.push('/dir')}>
          <Header as='h4' inverted textAlign='left' >
            < Icon name='folder open' />
            <Header.Content >
              Files
              < Header.Subheader > Directory</Header.Subheader>
            </Header.Content>
          </Header>
        </Menu.Item>
        {/* < Menu.Item as='a' onClick={() => Router.push('/upload')}>
          <Header as='h4' inverted textAlign='left' >
            < Icon name='cloud upload' />
            <Header.Content >
              Upload
              < Header.Subheader > Upload file</Header.Subheader>
            </Header.Content>
          </Header>
        </Menu.Item> */}
        < Menu.Item as='a' onClick={() => Router.push('/filename')}>
          <Header as='h4' inverted textAlign='left' >
            < Icon name='file alternate' />
            <Header.Content >
              Name
              < Header.Subheader > File Score</Header.Subheader>
            </Header.Content>
          </Header>
        </Menu.Item>
        < Menu.Item as='a' onClick={() => Router.push('/rule')}>
          <Header as='h4' inverted textAlign='left' >
            < Icon name='law' />
            <Header.Content >
              Rule
              < Header.Subheader > Grade Test</Header.Subheader>
            </Header.Content>
          </Header>
        </Menu.Item>
      </Sidebar>
    )
  }
}

