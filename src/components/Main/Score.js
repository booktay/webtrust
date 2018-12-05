import React, { Component } from 'react'
import {
  Header,
  Icon,
  Image,
  Segment,
  Card, 
} from 'semantic-ui-react'
import VerticalDivider from "../../layout/VerticalDivider";

export default class Score extends Component {

  render() {
    return (
      <div style={{margin:"2em", minHeight: 'calc(100vh - 100px)'}}>
        <Header as='h2' >Score</Header>
        <VerticalDivider/>
        <Segment basic>
        </Segment>
      </div>
    )
  }
}

