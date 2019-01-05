import React, {
    Component
} from 'react'
import {
    Menu,
    Icon,
    Header,
    Image
} from 'semantic-ui-react'
import Router from 'next/router';

export default class Navigator extends Component {

  render() {
    return (
      <React.Fragment>
        <Menu icon size='tiny' className="navb">
          <Menu.Item>
            <Image src="/logo/logo.png" size='tiny'/>
          </Menu.Item>
          <Menu.Item name='sidemenu' onClick={this.props.onReqOpenSidebar}>
            <Icon name='list layout' size='large' />
          </Menu.Item>
          <Menu.Item name='home' onClick={() => Router.push('/')}>
            <Icon name='home' size='large' />
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item>
              <Header as='h3' textAlign='center'>Trusted Web Domain Analysis based on SSL TLS Certificate</Header>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </React.Fragment>
    )
  }
}