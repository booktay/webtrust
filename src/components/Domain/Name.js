import React, { Component } from 'react'
import {
  Menu, Grid, Header, Segment, Container
} from 'semantic-ui-react'
import VerticalDivider from "../../layout/VerticalDivider";
export default class Name extends Component {
  state = { activeItem: 'bio' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render() {
    const { activeItem } = this.state
    return (
      <div>
        < Menu pointing secondary color="black" inverted style={{backgroundColor:"#1EA7D6", border:"none"}}>
            <Menu.Item>
            <Header as='h3' textAlign='center' color="black" inverted>Scoring domain</Header>
            </Menu.Item>
            <Menu.Item name='Domain Score' active={activeItem === 'Domain Score'} onClick={this.handleItemClick} />
            <Menu.Item name='Suggestion' active={activeItem === 'Suggestion'} onClick={this.handleItemClick} />
            <Menu.Menu position='right'>
            </Menu.Menu>
        </Menu>
        <div style={{margin:"2em", minHeight: 'calc(100vh - 100px)'}}>
          <Container>
            <Segment placeholder>
              <Grid columns={2} stackable textAlign='center'>
                <Grid.Row verticalAlign='middle'>
                  <Grid.Column>
                      <Header as='h1'>AC.TH</Header>
                  </Grid.Column>
                  <Grid.Column>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </Container>
          <VerticalDivider/>
        </div>
      </div>
    )
  }
}

