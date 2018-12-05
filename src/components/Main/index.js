import React, { Component } from 'react'
import {
  Header,
  Icon,
  Image,
  Segment,
  Card, 
} from 'semantic-ui-react'
import VerticalDivider from "../../layout/VerticalDivider";

export default class Main extends Component {

  render() {
    return (
      <div style={{margin:"2em", minHeight: 'calc(100vh - 100px)'}}>
        <Header as='h2' >Home</Header>
        <VerticalDivider/>
        <Segment basic>
          <Card.Group>
            <Card>
              <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' />
              <Card.Content>
                <Card.Header>Matthew</Card.Header>
                <Card.Meta>
                  <span className='date'>Joined in 2015</span>
                </Card.Meta>
                <Card.Description>Matthew is a musician living in Nashville.</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <a>
                  <Icon name='user' />
                  22 Friends
              </a>
              </Card.Content>
            </Card>
            <Card>
              <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' />
              <Card.Content>

              </Card.Content>
            </Card>
          </Card.Group>
        </Segment>
      </div>
    )
  }
}

