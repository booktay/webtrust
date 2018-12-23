import React, { Component } from 'react'
import {
    Menu, Statistic, Segment, Header, Table, Grid
} from 'semantic-ui-react'
import { withRouter } from "next/router";

class Content extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { dataDomain } = this.props
        // console.log(dataDomain)
        return (
            <React.Fragment>
                <Grid columns='equal' textAlign='center' className="chartgrid">
                    <Grid.Row>
                        <Header as="h1" style={{ fontSize: "-webkit-xxx-large" }}>TH Domain Dashboard</Header>
                    </Grid.Row>
                    <Grid columns='equal' textAlign='center' divided className="chartgrid">
                        <Grid.Row>
                            <Grid.Column style={{ minWidth: "247.31px" }}>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <Statistic size='huge'>
                                            <Statistic.Label>Subdomain</Statistic.Label>
                                            <Statistic.Value>{dataDomain[0].subdomain}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                    <Segment>
                                        <Statistic size='huge'>
                                            <Statistic.Label>Domain</Statistic.Label>
                                            <Statistic.Value>{dataDomain[0].domain}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                < Segment.Group horizontal style={
                                    {
                                        backgroundColor: (dataDomain[0]['grade'][0] > 80) ? "lightgreen" : ((dataDomain[0]['grade'][0] >= 50) ? "lightyellow" : "lightsalmon")
                                    }
                                } >
                                    <Segment>
                                        < Statistic color="black" size='huge' >
                                            <Statistic.Label>Score</Statistic.Label>
                                            <Statistic.Value>{Math.ceil(dataDomain[0]['grade'][0])}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                    <Segment>
                                        < Statistic color="black" size='huge' >
                                            <Statistic.Label>Grade</Statistic.Label>
                                            <Statistic.Value>{dataDomain[0]['grade'][1]}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid columns='equal' textAlign='center' divided className="chartgrid">
                        <Grid.Row>
                            <Grid.Column style={{ minWidth: "247.31px" }}>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <Statistic size='huge'>
                                            <Statistic.Label>Subdomain</Statistic.Label>
                                            <Statistic.Value>{dataDomain[1].subdomain}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                    <Segment>
                                        <Statistic size='huge'>
                                            <Statistic.Label>Domain</Statistic.Label>
                                            <Statistic.Value>{dataDomain[1].domain}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                < Segment.Group horizontal style={
                                    {
                                        backgroundColor: (dataDomain[1]['grade'][0] > 80) ? "lightgreen" : ((dataDomain[1]['grade'][0] >= 50) ? "lightyellow" : "lightsalmon")
                                    }
                                } >
                                    <Segment>
                                        < Statistic color="black" size='huge' >
                                            <Statistic.Label>Score</Statistic.Label>
                                            <Statistic.Value>{Math.ceil(dataDomain[1]['grade'][0])}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                    <Segment>
                                        < Statistic color="black" size='huge' >
                                            <Statistic.Label>Grade</Statistic.Label>
                                            <Statistic.Value>{dataDomain[1]['grade'][1]}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid columns='equal' textAlign='center' divided className="chartgrid">
                        <Grid.Row>
                            <Grid.Column style={{ minWidth: "247.31px" }}>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <Statistic size='huge'>
                                            <Statistic.Label>Subdomain</Statistic.Label>
                                            <Statistic.Value>{dataDomain[2].subdomain}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                    <Segment>
                                        <Statistic size='huge'>
                                            <Statistic.Label>Domain</Statistic.Label>
                                            <Statistic.Value>{dataDomain[2].domain}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                < Segment.Group horizontal style={
                                    {
                                        backgroundColor: (dataDomain[2]['grade'][0] > 80) ? "lightgreen" : ((dataDomain[2]['grade'][0] >= 50) ? "lightyellow" : "lightsalmon")
                                    }
                                } >
                                    <Segment>
                                        < Statistic color="black" size='huge' >
                                            <Statistic.Label>Score</Statistic.Label>
                                            <Statistic.Value>{Math.ceil(dataDomain[2]['grade'][0])}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                    <Segment>
                                        < Statistic color="black" size='huge' >
                                            <Statistic.Label>Grade</Statistic.Label>
                                            <Statistic.Value>{dataDomain[2]['grade'][1]}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid columns='equal' textAlign='center' divided className="chartgrid">
                        <Grid.Row>
                            <Grid.Column style={{ minWidth: "247.31px" }}>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <Statistic size='huge'>
                                            <Statistic.Label>Subdomain</Statistic.Label>
                                            <Statistic.Value>{dataDomain[3].subdomain}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                    <Segment>
                                        <Statistic size='huge'>
                                            <Statistic.Label>Domain</Statistic.Label>
                                            <Statistic.Value>{dataDomain[3].domain}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                < Segment.Group horizontal style={
                                    {
                                        backgroundColor: (dataDomain[3]['grade'][0] > 80) ? "lightgreen" : ((dataDomain[3]['grade'][0] >= 50) ? "lightyellow" : "lightsalmon")
                                    }
                                } >
                                    <Segment>
                                        < Statistic color="black" size='huge' >
                                            <Statistic.Label>Score</Statistic.Label>
                                            <Statistic.Value>{Math.ceil(dataDomain[3]['grade'][0])}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                    <Segment>
                                        < Statistic color="black" size='huge' >
                                            <Statistic.Label>Grade</Statistic.Label>
                                            <Statistic.Value>{dataDomain[3]['grade'][1]}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid columns='equal' textAlign='center' divided className="chartgrid">
                        <Grid.Row>
                            <Grid.Column style={{ minWidth: "247.31px" }}>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <Statistic size='huge'>
                                            <Statistic.Label>Subdomain</Statistic.Label>
                                            <Statistic.Value>{dataDomain[4].subdomain}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                    <Segment>
                                        <Statistic size='huge'>
                                            <Statistic.Label>Domain</Statistic.Label>
                                            <Statistic.Value>{dataDomain[4].domain}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                < Segment.Group horizontal style={
                                    {
                                        backgroundColor: (dataDomain[4]['grade'][0] > 80) ? "lightgreen" : ((dataDomain[4]['grade'][0] >= 50) ? "lightyellow" : "lightsalmon")
                                    }
                                } >
                                    <Segment>
                                        < Statistic color="black" size='huge' >
                                            <Statistic.Label>Score</Statistic.Label>
                                            <Statistic.Value>{Math.ceil(dataDomain[4]['grade'][0])}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                    <Segment>
                                        < Statistic color="black" size='huge' >
                                            <Statistic.Label>Grade</Statistic.Label>
                                            <Statistic.Value>{dataDomain[4]['grade'][1]}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid columns='equal' textAlign='center' divided className="chartgrid">
                        <Grid.Row>
                            <Grid.Column style={{ minWidth: "247.31px" }}>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <Statistic size='huge'>
                                            <Statistic.Label>Subdomain</Statistic.Label>
                                            <Statistic.Value>{dataDomain[5].subdomain}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                    <Segment>
                                        <Statistic size='huge'>
                                            <Statistic.Label>Domain</Statistic.Label>
                                            <Statistic.Value>{dataDomain[5].domain}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                < Segment.Group horizontal style={
                                    {
                                        backgroundColor: (dataDomain[5]['grade'][0] > 80) ? "lightgreen" : ((dataDomain[5]['grade'][0] >= 50) ? "lightyellow" : "lightsalmon")
                                    }
                                } >
                                    <Segment>
                                        < Statistic color="black" size='huge' >
                                            <Statistic.Label>Score</Statistic.Label>
                                            <Statistic.Value>{Math.ceil(dataDomain[5]['grade'][0])}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                    <Segment>
                                        < Statistic color="black" size='huge' >
                                            <Statistic.Label>Grade</Statistic.Label>
                                            <Statistic.Value>{dataDomain[5]['grade'][1]}{dataDomain[5]['grade'][1].length == 1 ? " " : ""}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid columns='equal' textAlign='center' divided className="chartgrid">
                        <Grid.Row>
                            <Grid.Column style={{ minWidth: "247.31px" }}>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <Statistic size='huge'>
                                            <Statistic.Label>Subdomain</Statistic.Label>
                                            <Statistic.Value>{dataDomain[6].subdomain}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                    <Segment>
                                        <Statistic size='huge'>
                                            <Statistic.Label>Domain</Statistic.Label>
                                            <Statistic.Value>{dataDomain[6].domain}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                < Segment.Group horizontal style={
                                    {
                                        backgroundColor: (dataDomain[6]['grade'][0] > 80) ? "lightgreen" : ((dataDomain[6]['grade'][0] >= 50) ? "lightyellow" : "lightsalmon")
                                    }
                                } >
                                    <Segment>
                                        < Statistic color="black" size='huge' >
                                            <Statistic.Label>Score</Statistic.Label>
                                            <Statistic.Value>{Math.ceil(dataDomain[6]['grade'][0])}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                    <Segment>
                                        < Statistic color="black" size='huge' >
                                            <Statistic.Label>Grade</Statistic.Label>
                                            <Statistic.Value>{dataDomain[6]['grade'][1]}{dataDomain[6]['grade'][1].length > 1 ? "" : " "}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                </Segment.Group>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid>
                <style jsx>{`
                `}</style>
            </React.Fragment >
        )
    }
}

export default withRouter(Content)