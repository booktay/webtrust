import React, { Component } from 'react'
import {
  Menu, Card, Header, Segment, Container, Statistic
} from 'semantic-ui-react'
import VerticalDivider from "../../layout/VerticalDivider";
export default class Result extends Component {
  render() {
    return (
      <div style={{margin:"2em", minHeight: 'calc(100vh - 100px)'}}>
        <Card.Group centered>
          <Card>
            <Card.Content>
              < Statistic  size='huge'>
                <Statistic.Label>Domain</Statistic.Label>
                <Statistic.Value>AC.TH</Statistic.Value>
              </Statistic>
            </Card.Content>
          </Card>
          <Card>
            < Card.Content>
              < Statistic size='huge' color="black">
                <Statistic.Label>Grade</Statistic.Label>
                <Statistic.Value>C</Statistic.Value>
              </Statistic>
            </Card.Content>
          </Card>
        </Card.Group>
        {/* <VerticalDivider/> */}
      </div>
    )
  }
}

