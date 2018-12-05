import React, { Component } from 'react'
import {
  Menu,
  Header
} from 'semantic-ui-react'
import VerticalDivider from "../divider";

export default class Footer extends Component {
  
  render() {

    return (
      <div>
        <VerticalDivider/>
        < Menu secondary style={{bottom: '0px', position: 'fixed', 'height': '10px', paddingTop: '1.2em'}}>
          <Menu.Menu position='right'>
            <Menu.Item>
              <Header as='h5' textAlign='right'>Copyright@KU</Header>
            </Menu.Item>
          </Menu.Menu>  
        </Menu>
      </div>
    )
  }
}