import React, { Component } from 'react'
import {
    Segment, Dimmer, Loader, Statistic, Grid, Table, Header
} from 'semantic-ui-react'
import {Router, withRouter} from "next/router";

const renderBodyRow = ({ name, status, notes }, i) => ({
    key: name || `row-${i}`,
    warning: !!(status && status.match('Requires Action')),
    cells: [
        name || 'No name specified',
        status ? { key: 'status', icon: 'attention', content: status } : 'Unknown',
        notes ? { key: 'notes', icon: 'attention', content: notes, warning: true } : 'None',
    ],
})

class Content extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded : false,
            data_domain: {},
            data_all: []
        }
    }

    componentDidMount() {
        const {router} = this.props
        return fetch(`/api/test/score/${router.query.domain}/${router.query.subdomain}`)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    data_domain:responseJson[0],
                    data_all : responseJson[1],
                    loaded: true
                })
            });
    }

    websiteHave() {
        const {data_all} = this.state;
        return data_all
    }

    websiteRowHave() {
        const {data_all} = this.state;
        return Object.keys(data_all[0]);
    }

    render() {
        const {router} = this.props
        const {loaded, data_domain, data_all} = this.state

        if (router.query.domain && router.query.subdomain) {
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
                        <Grid columns='equal' textAlign='center' className="chartgrid">
                            <Grid.Row>
                                <Header as="h2">Website</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    {/* <Table celled headerRow={this.websiteRowHave} tableData={this.websiteHave} /> */}
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

export default withRouter(Content)