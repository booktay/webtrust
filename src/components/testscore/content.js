import React, { Component } from 'react'
import {
    Segment, Statistic, Grid, Table, Header, Progress
} from 'semantic-ui-react'
import { withRouter } from "next/router";

class Content extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { router, data } = this.props

        if (data.URL) {
            return (
                <React.Fragment>
                    <Grid columns='equal' textAlign='center' divided className="chartgrid">
                        <Grid.Row>
                            <Grid.Column width={1}>
                                <Segment basic>
                                    <Header as="h2">URL</Header>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment>
                                    <Header as="h2">https://{data.URL}</Header>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Segment>
                                    <Statistic size='huge'>
                                        <Statistic.Label>Total Score</Statistic.Label>
                                        <Statistic.Value>{data.GRADE[0]} %</Statistic.Value>
                                    </Statistic>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                < Segment style={
                                    {
                                        backgroundColor: (data.GRADE[0] > 80) ? "lightgreen" : ((data.GRADE[0] >= 50) ? "lightyellow" : "lightsalmon")
                                    }
                                } >
                                    < Statistic color="black" size='huge' >
                                        <Statistic.Label>Grade</Statistic.Label>
                                        <Statistic.Value>{data.GRADE[1] ? data.GRADE[1] : "Unknown"}</Statistic.Value>
                                    </Statistic>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                < Segment style={
                                    {
                                        backgroundColor: (data['Expired'] > 60) ? "lightgreen" : ((data['Expired'] >= 30) ? "lightyellow" : "lightsalmon")
                                    }
                                } >
                                    < Statistic color="black" size='huge' >
                                        <Statistic.Label>Expired Left (Days)</Statistic.Label>
                                        <Statistic.Value>{data.CERT.EXPIRED[1] ? data.CERT.EXPIRED[1] : "Unknown"}</Statistic.Value>
                                    </Statistic>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid columns='equal' textAlign='center' className="chartgrid">
                        <Grid.Row>
                            <Header as="h2">Scoring Detail</Header>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Segment>
                                    <Header as="h2">Active-Inactive</Header>
                                    <Progress value={data.SCORE[0][0]} color='orange' total={data.SCORE[0][1]} inverted progress='ratio' />
                                    <Header as="h2">Basic status</Header>
                                    <Progress value={data.SCORE[1][0]} color='olive' total={data.SCORE[1][1]} inverted progress='ratio' />
                                    <Header as="h2">Revoke status</Header>
                                    <Progress value={data.SCORE[2][0]} color='green' total={data.SCORE[2][1]} inverted progress='ratio' />
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment>
                                    <Header as="h2">Expired</Header>
                                    <Progress value={data.SCORE[3][0]} color='blue' total={data.SCORE[3][1]} inverted progress='ratio' />
                                    <Header as="h2">Valid-Invalid</Header>
                                    <Progress value={data.SCORE[4][0]} color='purple' total={data.SCORE[4][1]} inverted progress='ratio' />
                                    <Header as="h2">Protocol type</Header>
                                    <Progress value={data.SCORE[5][0]} color='pink' total={data.SCORE[5][1]} inverted progress='ratio' />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid columns='equal' textAlign='center' className="chartgrid">
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h2">Protocol Detail</Header>
                                <Table color='red' key='red' celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Protocol</Table.HeaderCell>
                                            <Table.HeaderCell>Status</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>SSLv2</Table.Cell>
                                            <Table.Cell>{data.PROTOCOL['SSLv2'] ? data.PROTOCOL['SSLv2'] : "Unknown"}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>SSLv3</Table.Cell>
                                            <Table.Cell>{data.PROTOCOL['SSLv3'] ? data.PROTOCOL['SSLv3'] : "Unknown"}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>TLS1</Table.Cell>
                                            <Table.Cell>{data.PROTOCOL['TLS1'] ? data.PROTOCOL['TLS1'] : "Unknown"}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>TLS11</Table.Cell>
                                            <Table.Cell>{data.PROTOCOL['TLS11'] ? data.PROTOCOL['TLS11'] : "Unknown"}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>TLS12</Table.Cell>
                                            <Table.Cell>{data.PROTOCOL['TLS12'] ? data.PROTOCOL['TLS12'] : "Unknown"}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>TLS13</Table.Cell>
                                            <Table.Cell>{data.PROTOCOL['TLS13'] ? data.PROTOCOL['TLS13'] : "Unknown"}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>NPNSPDY</Table.Cell>
                                            <Table.Cell>{data.PROTOCOL['NPNSPDY'] ? data.PROTOCOL['NPNSPDY'] : "Unknown"}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>ALPNHTTP2</Table.Cell>
                                            <Table.Cell>{data.PROTOCOL['ALPNHTTP2'] ? data.PROTOCOL['ALPNHTTP2'] : "Unknown"}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                            <Grid.Column>
                                <Header as="h2">More Detail</Header>
                                <Table color='yellow' key='yellow' celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell width={8}>HTTP</Table.HeaderCell>
                                            <Table.HeaderCell>Status</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>HTTP Status Code</Table.Cell>
                                            <Table.Cell>{data['CODE'] ? data['CODE'] : "Unknown"}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>HTTPS Status Code</Table.Cell>
                                            <Table.Cell>{data['SCODE'] ? data['SCODE'] : "Unknown"}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>HSTS</Table.Cell>
                                            <Table.Cell>{data['SHSTS'] ? data['SHSTS'] : "Unknown"}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                                <Table color='green' key='green' celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell width={8}>Certification</Table.HeaderCell>
                                            <Table.HeaderCell>Status</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>Certificate</Table.Cell>
                                            <Table.Cell>{data.CERT['STATUS'] ? data.CERT['STATUS'] : "Unknown"}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Signature</Table.Cell>
                                            <Table.Cell>{data.CERT['SIGNATURE'] ? data.CERT['SIGNATURE'] : "Unknown"}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Fingerprint</Table.Cell>
                                            <Table.Cell>{data.CERT['FINGERPRINT'] ? data.CERT['FINGERPRINT'] : "Unknown"}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>TRUSTED</Table.Cell>
                                            <Table.Cell>{data.CERT['VENDOR'] ? data.CERT['VENDOR'] : "Unknown"}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            Search time : {data.TIMESTAMP}
                        </Grid.Row>
                    </Grid>
                </React.Fragment>
            )
        }
        return (
            <Segment basic textAlign='center' className="chartcontent">
                <Header as="h1" >Not Found</Header>
            </Segment>
        )
    }
}

export default withRouter(Content)