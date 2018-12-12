import React, { Component } from 'react'
import {
    Segment, Statistic, Grid, Table, Header, Progress
} from 'semantic-ui-react'
import {withRouter} from "next/router";

class Content extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const {router, data} = this.props
        
        if(data.url) {
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
                                    <Header as="h2">https://{router.query.url}</Header>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Segment>
                                    <Statistic size='huge'>
                                        <Statistic.Label>Total Score</Statistic.Label>
                                        <Statistic.Value>{data.total_score} %</Statistic.Value>
                                    </Statistic>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                < Segment style = {
                                    {
                                        backgroundColor: (data['total_score'] > 80) ? "lightgreen" : ((data['total_score'] >= 50) ? "lightyellow" : "lightsalmon")
                                    }
                                } >
                                    < Statistic color="black" size = 'huge' >
                                        <Statistic.Label>Grade</Statistic.Label>
                                        <Statistic.Value>{data.domain_grade}</Statistic.Value>
                                    </Statistic>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                < Segment style = {
                                    {
                                        backgroundColor: (data['Expired'] > 60) ? "lightgreen" : ((data['Expired'] >= 30) ? "lightyellow" : "lightsalmon")
                                    }
                                } >
                                    < Statistic color="black" size = 'huge' >
                                        <Statistic.Label>Expired Date</Statistic.Label>
                                        <Statistic.Value>{data.Expired}</Statistic.Value>
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
                                    <Progress value={data.score1} color='orange' total='10' inverted progress='ratio' />
                                    <Header as="h2">Basic status</Header>
                                    <Progress value={data.score2} color='olive' total='20' inverted progress='ratio' />
                                    <Header as="h2">Revoke status</Header>
                                    <Progress value={data.score3} color='green' total='10' inverted progress='ratio' />
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment>
                                    <Header as="h2">Expired</Header>
                                    <Progress value={data.score4} color='blue' total='10' inverted progress='ratio' />
                                    <Header as="h2">Valid-Invalid</Header>
                                    <Progress value={data.score5} color='purple' total='10' inverted progress='ratio' />
                                    <Header as="h2">Protocol type</Header>
                                    <Progress value={data.score6} color='pink' total='40' inverted progress='ratio' />
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
                                            <Table.Cell>{data['SSLv2']}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>SSLv3</Table.Cell>
                                            <Table.Cell>{data['SSLv3']}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>TLS1</Table.Cell>
                                            <Table.Cell>{data['TLS1']}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>TLS11</Table.Cell>
                                            <Table.Cell>{data['TLS11']}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>TLS12</Table.Cell>
                                            <Table.Cell>{data['TLS12']}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>TLS13</Table.Cell>
                                            <Table.Cell>{data['TLS13']}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>NPNSPDY</Table.Cell>
                                            <Table.Cell>{data['NPNSPDY']}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>ALPNHTTP2</Table.Cell>
                                            <Table.Cell>{data['ALPNHTTP2']}</Table.Cell>
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
                                            <Table.Cell>{data['code']}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>HTTPS Status Code</Table.Cell>
                                            <Table.Cell>{data['scode']}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>HSTS</Table.Cell>
                                            <Table.Cell>{data['shsts']}</Table.Cell>
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
                                            <Table.Cell>CertificateStatus</Table.Cell>
                                            <Table.Cell>{data['CertificateStatus']}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>SignatureStatus</Table.Cell>
                                            <Table.Cell>{data['SignatureStatus']}</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Fingerprint</Table.Cell>
                                            <Table.Cell>{data['Fingerprint']}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
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