import React, { Component } from 'react'
import {
    Segment, Dimmer, Loader, Statistic, Grid
} from 'semantic-ui-react'
import {Router, withRouter} from "next/router";
import Chart from "./chart";

class Content extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded : false,
            data_domain: {},
            data: []
        }
    }

    componentDidMount() {
        const {router} = this.props
        return fetch(`/api/test/score/${router.query.domain}/${router.query.subdomain}`)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    data_domain:responseJson[0],
                    data : responseJson,
                    loaded: true
                })
            });
    }

    render() {
        const {router} = this.props
        const {loaded, data_domain, data} = this.state

        if (router.query.domain && router.query.subdomain) {
            const header_url = router.query.subdomain + "." + router.query.domain
            if (loaded) {
                return (
                    <React.Fragment>
                        <Grid columns='equal' textAlign='center' divided className="chartgrid">
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
                                    < Segment.Group horizontal style = {
                                        {
                                            backgroundColor: (data_domain['domainscore'] > 80) ? "lightgreen" : ((data_domain['domainscore'] >= 50) ? "lightyellow" : "lightsalmon")
                                        }
                                    } >
                                        <Segment>
                                            < Statistic color="black" size = 'huge' >
                                                <Statistic.Label>Grade</Statistic.Label>
                                                <Statistic.Value>{data_domain.domaingrade}</Statistic.Value>
                                            </Statistic>
                                        </Segment>
                                    </Segment.Group>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Chart data={data} />
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

export default withRouter(Content)