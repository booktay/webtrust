import React, { Component } from 'react'
import {
    Segment, Dimmer, Loader, Statistic, Grid, Header
} from 'semantic-ui-react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
}
from 'recharts';
import {Router, withRouter} from "next/router";;

class Chart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded : false,
            data_all: [],
            data_domain: {}
        }
    }

    componentDidMount() {
        const {router} = this.props
        return fetch(`/api/test/score/${router.query.domain}/${router.query.subdomain}`)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                this.setState({
                    data_domain:responseJson[0],
                    data_all:responseJson[1],
                    loaded: true
                })
            });
    }

    render() {
        const {router} = this.props
        const {loaded, data_domain, data_all} = this.state

        if (router.query.domain && router.query.subdomain) {
            const header_url = router.query.subdomain + "." + router.query.domain

            if (loaded) {
                return (
                    <React.Fragment>
                        <Grid columns='equal' textAlign='center' className="chartgrid">
                            <Grid.Row>
                                <Grid.Column style={{minWidth:"247.31px"}}>
                                <Segment.Group horizontal>
                                    <Segment>
                                        <Statistic size='huge'>
                                            <Statistic.Label>Subdomain</Statistic.Label>
                                            <Statistic.Value>{router.query.subdomain}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                    <Segment>
                                        <Statistic size='huge'>
                                            <Statistic.Label>Domain</Statistic.Label>
                                            <Statistic.Value>{router.query.domain}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                </Segment.Group>
                                </Grid.Column>
                                <Grid.Column width={5}>
                                    <Segment.Group horizontal>
                                        <Segment>
                                            <Statistic size='huge'>
                                                <Statistic.Label>Grade</Statistic.Label>
                                                <Statistic.Value>{data_domain.domaingrade}</Statistic.Value>
                                            </Statistic>
                                        </Segment>
                                    </Segment.Group>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Header as="h2">Certification Detail</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    <Segment>
                                        <BarChart width={640} height={450} data=""
                                            margin={{top: 15, right: 30, left: 20, bottom: 5}}>
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="name"/>
                                            <YAxis/>
                                            <Tooltip/>
                                            <Legend />
                                            <Bar dataKey="no" fill="#8804d8" minPointSize={5}/>
                                            <Bar dataKey="number" fill="#82ca9d" minPointSize={10}/>
                                        </BarChart>
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment>
                                        <BarChart width={640} height={450} data=""
                                            margin={{top: 15, right: 30, left: 20, bottom: 5}}>
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="name"/>
                                            <YAxis/>
                                            <Tooltip/>
                                            <Legend />
                                            <Bar dataKey="no" fill="#8804d8" minPointSize={5}/>
                                            <Bar dataKey="number" fill="#82ca9d" minPointSize={10}/>
                                        </BarChart>
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>

                        </Grid>
                    </React.Fragment>
                )
            }
            return (
                <React.Fragment>
                    <Segment className="chartcontent">
                        <Dimmer active inverted inline='centered' size='massive'>
                            <Loader size='large'>Loading</Loader>
                        </Dimmer>
                    </Segment>
                </React.Fragment>
            )
        }
        return (
            <React.Fragment></React.Fragment>
        )
    }
}

export default withRouter(Chart)