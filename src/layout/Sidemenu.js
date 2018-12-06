import React, { Component } from 'react'
import {
  Icon,
  Menu,
  Sidebar,
  Header,
  Segment
} from 'semantic-ui-react'
import {Link} from '../routes';
import Dashboard from "../components/Dashboard";

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
      <Sidebar
        as={Menu}
        animation='push'
        icon='labeled'
        inverted
        vertical
        visible={visible}
        width='thin'
        color="black"
      >
        < Menu.Item as='a'>
            <Link route="dashboard" >
              <Header as='h4' inverted textAlign='left'>
                < Icon name = 'dashboard' / >
                Dashboard
              </Header>
            </Link>
        </Menu.Item>
        < Menu.Item as='a'>
            <Link route="score" >
              <Header as='h4' inverted textAlign='left'>
                < Icon name = 'file alternate' / >
                <Header.Content >
                  Scoring
                  < Header.Subheader > Test Rule </Header.Subheader>
                </Header.Content>
              </Header>
            </Link>
        </Menu.Item>
        < Menu.Item as='a'>
            <Link route="domain">
              <Header as='h4' inverted textAlign='left' >
                < Icon name = 'line chart' / >
                <Header.Content >
                  Domain
                  < Header.Subheader > Security Test </Header.Subheader>
                </Header.Content>
              </Header>
            </Link>
        </Menu.Item>
        {/* < Menu.Item as='a'>
            <Link route="score_web" >
              <Header as='h4' inverted>
                < Icon name = 'pie chart' / >
                Scoring
              </Header>
            </Link>
        </Menu.Item> */}
      </Sidebar>
    )
  }
}

