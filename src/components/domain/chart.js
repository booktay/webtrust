import React, { Component } from 'react'
import {
    Segment, Dimmer, Loader, Table, Grid, Header, Progress, GridColumn
} from 'semantic-ui-react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
}
from 'recharts';
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


class Chart extends Component {
    constructor(props) {
        super(props)
    }

    certHave() {
        const data_domain = this.props.data[0];
        return [
            {name:"Yes", value:data_domain.havecertificate},
            {name:"No", value:data_domain.nothavecertificate},
        ]
    }

    protocolHave() {
        const data_all = this.props.data[1];

        const search = ["SSLv2", "SSLv3", "TLS1", "TLS11", "TLS12", "TLS13"]
        var protocol = [];

        for (var lookup in search) {
            var temp = {name:search[lookup], yes:0, no:0, undefined:0};
            for (var data in data_all){
                if (data_all[data][search[lookup]] === "yes") temp['yes'] += 1
                else if (data_all[data][search[lookup]] === "no") temp['no'] += 1
                else temp['undefined'] += 1
            }
            protocol.push(temp)
        }
        return protocol;
    }

    activeHave() {
        const data_domain = this.props.data[0];
        var active = [
            {name:"activehttp", value:data_domain['activehttp']},
            {name:"inactivehttp", value:data_domain['inactivehttp']},
            {name:"activehttps", value:data_domain['activehttps']},
            {name:"inactivehttps", value:data_domain['inactivehttps']},
        ];
        return active;
    }

    render() {
        const data_domain = this.props.data[0];
        return (
            <React.Fragment>
                <Grid columns='equal' textAlign='center' className="chartgrid">
                    <Grid.Row>
                        <Header as="h2">Scoring Detail</Header>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment>
                                <Header as="h2">Active-Inactive</Header>
                                <Progress value={data_domain.score1} color='orange' total='10' inverted progress='ratio' />
                                <Header as="h2">Basic status</Header>
                                <Progress value={data_domain.score2} color='olive' total='20' inverted progress='ratio' />
                                <Header as="h2">Revoke status</Header>
                                <Progress value={data_domain.score3} color='green' total='10' inverted progress='ratio' />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment>
                                <Header as="h2">Expired</Header>
                                <Progress value={data_domain.score4} color='blue' total='10' inverted progress='ratio' />
                                <Header as="h2">Valid-Invalid</Header>
                                <Progress value={data_domain.score5} color='purple' total='10' inverted progress='ratio' />
                                <Header as="h2">Protocol type</Header>
                                <Progress value={data_domain.score6} color='pink' total='40' inverted progress='ratio' />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    {/* <Grid.Row>
                        <Header as="h2">Certification Detail</Header>
                    </Grid.Row> */}
                    <Grid.Row>
                        <Grid.Column>
                            <Segment>
                                <Header as="h2">
                                    Have Certification
                                </Header>
                                <BarChart width={640} height={450} data={this.certHave()}
                                    margin={{top: 15, right: 30, left: 20, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend />
                                    <Bar dataKey="value" fill="#82ca9d" minPointSize={10}/>
                                </BarChart>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment>
                                <Header as="h2">
                                    Valid Certification
                                </Header>
                                <BarChart width={640} height={450} data={this.certHave()}
                                    margin={{top: 15, right: 30, left: 20, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend />
                                    <Bar dataKey="value" fill="#82ca9d" minPointSize={10}/>
                                </BarChart>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    {/* <Grid.Row>
                        <Header as="h2">Protocol Detail</Header>
                    </Grid.Row> */}
                    <Grid.Row>
                        <Grid.Column>
                            <Segment>
                                <Header as="h2">
                                    Protocol Detail
                                </Header>
                                <BarChart width={640} height={450} data={this.protocolHave()}
                                    margin={{top: 15, right: 30, left: 20, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend />
                                    <Bar dataKey="undefined" fill="#82ca9d" minPointSize={2}/>
                                    <Bar dataKey="no" fill="#82ca9d" minPointSize={6}/>
                                    <Bar dataKey="yes" fill="#82ca9d" minPointSize={10}/>
                                </BarChart>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment>
                                <Header as="h2">
                                    Active-Inactive
                                </Header>
                                <BarChart width={640} height={450} data={this.activeHave()}
                                    margin={{top: 15, right: 30, left: 20, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend />
                                    <Bar dataKey="value" fill="#82ca9d" minPointSize={10}/>
                                </BarChart>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </React.Fragment>
        )
    }
}

export default withRouter(Chart)