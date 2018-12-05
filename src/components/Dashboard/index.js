import React, { Component } from 'react'
import {
  Header,
  Icon,
  Image,
  Segment,
  Card, 
} from 'semantic-ui-react'
import VerticalDivider from "../../layout/VerticalDivider";
import ChartA from "./ChartA";

export default class Dashboard extends Component {

  render() {
    return (
      <div style={{margin:"2em", minHeight: 'calc(100vh - 100px)'}}>
        <Header as='h2' >Dashboard</Header>
        <VerticalDivider/>
        <Segment basic>
          <ChartA />
        </Segment>
      </div>
    )
  }
}

