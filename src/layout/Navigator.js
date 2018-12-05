import React, {
    Component
} from 'react'
import {
    Menu,
    Icon,
    Header,
    Image
} from 'semantic-ui-react'
import {Link} from '../routes';

export default class Navigator extends Component {

  render() {

    return (
      <Menu icon secondary size='tiny' style={{marginBottom: "auto"}}>
        <Menu.Item>
          <Image src="img/brand/logo.png" size='tiny'/>
        </Menu.Item>
        <Menu.Item name='sidemenu' onClick={this.props.onReqOpenSidebar}>
          <Icon name='list layout' size='large' />
        </Menu.Item>
        <Link route="/">
          <Menu.Item name='home'>
          <Icon name='home' size='large' />
          </Menu.Item>
        </Link>
        <Menu.Menu position='right'>
          <Menu.Item>
            <Header as='h2' textAlign='center'>Trusted Web Domain Analysis based on SSL TLS Certificate</Header>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}