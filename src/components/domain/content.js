import React, { Component } from 'react'
import {
    Segment, Dimmer, Loader, Statistic, Grid, Header, Progress, Pagination, Table
} from 'semantic-ui-react'
import {withRouter} from "next/router";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
}
from 'recharts';

const renderBodyRow = ({ id,url,CertificateStatus,Expired,total_score, domain_grade }, i) => ({
  key: id,
  cells: [
    id,url,CertificateStatus,Expired,total_score, domain_grade
  ],
})

class Content extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSubdomain: undefined,
            header: ['id', 'url', 'CertificateStatus', 'Expired', 'total_score', 'domain_grade'],
            allPage: 1,
            activePage: 1
        }
        this.handlePaginationChange = this.handlePaginationChange.bind(this)
        this.loadTableData = this.loadTableData.bind(this)
    }

    certHave(dataDomain) {
        return [
            {name:"Yes", value:dataDomain.havecertificate},
            {name:"No", value:dataDomain.nothavecertificate},
        ]
    }

    certValid(dataDomain) {
        return [
            {name:"Yes", value:dataDomain.havecertificate},
            {name:"No", value:dataDomain.nothavecertificate},
        ]
    }

    protocolHave(dataDomain) {
        const search = ["SSLv2", "SSLv3", "TLS1", "TLS11", "TLS12", "TLS13"]
        var protocol = []
        for (var lookup in search) {
            var temp = {name:search[lookup], yes:0, no:0, undefined:0};
            for (var data in dataDomain) {
                if (dataDomain[data][search[lookup]] === "yes") temp['yes'] += 1
                else if (dataDomain[data][search[lookup]] === "no") temp['no'] += 1
                else temp['undefined'] += 1
            }
            protocol.push(temp)
        }
        return protocol;
    }

    activeHave(dataDomain) {
        var active = [
            {name:"activehttp", value:dataDomain['activehttp']},
            {name:"inactivehttp", value:dataDomain['inactivehttp']},
            {name:"activehttps", value:dataDomain['activehttps']},
            {name:"inactivehttps", value:dataDomain['inactivehttps']},
        ];
        return active;
    }

    loadStatus() {
        return (
            <Segment basic attached='bottom' className="bottomcontent">
                <Dimmer active inverted inline='centered' size='massive'>
                    <Loader size='large'>Loading</Loader>
                </Dimmer>
                <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
            </Segment>
        )
    }

    handlePaginationChange = async (e, { activePage }) => {
        const {domain, subdomain} = this.props.dataDomain
        const {dataSubdomain} = await this.loadTableData(domain, subdomain, activePage)
        this.setState(state => {
            state.dataSubdomain = dataSubdomain
            state.activePage = activePage
            return state
        })
    }

    async componentDidMount() {
        const {domain, subdomain} = this.props.dataDomain
        const {activePage} = this.state
        const {allPage} = await this.loadPage(domain, subdomain)
        const {dataSubdomain}  = await this.loadTableData(domain, subdomain, activePage)
        this.setState(state => {
            state.dataSubdomain = dataSubdomain
            state.allPage = allPage
            return state
        })
    }

    async loadPage(domain, subdomain) {
        const response = await fetch(`/test/score/subdomain/${domain}/${subdomain}/web/count`)
        const responseJson = await response.json()
        return {allPage:responseJson['total']}
    }

    async loadTableData(domain, subdomain, page) {
        const {header} = this.state
        const response = await fetch(`/test/score/subdomain/${domain}/${subdomain}/web/${page}`)
        const responseJson = await response.json()
        const dataSubdomain = responseJson.map(item => {
            const result = {}
            for (let column of header) {
                result[column] = item[column]
            }
            return result
        })
        return {dataSubdomain:dataSubdomain}
    }

    render() {
        const {dataDomain} = this.props
        const {activePage, dataSubdomain, allPage, header} = this.state

        if (dataDomain.domain) {
            return (
                <React.Fragment>
                    <Grid columns='equal' textAlign='center' divided className="chartgrid">
                        <Grid.Row>
                            <Grid.Column style={{minWidth:"247.31px"}}>
                            <Segment.Group horizontal>
                                <Segment>
                                    <Statistic size='huge'>
                                        <Statistic.Label>Subdomain</Statistic.Label>
                                        <Statistic.Value>{dataDomain.subdomain}</Statistic.Value>
                                    </Statistic>
                                </Segment>
                                <Segment>
                                    <Statistic size='huge'>
                                        <Statistic.Label>Domain</Statistic.Label>
                                        <Statistic.Value>{dataDomain.domain}</Statistic.Value>
                                    </Statistic>
                                </Segment>
                            </Segment.Group>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                < Segment.Group horizontal style = {
                                    {
                                        backgroundColor: (dataDomain['domainscore'] > 80) ? "lightgreen" : ((dataDomain['domainscore'] >= 50) ? "lightyellow" : "lightsalmon")
                                    }
                                } >
                                    <Segment>
                                        < Statistic color="black" size = 'huge' >
                                            <Statistic.Label>Grade</Statistic.Label>
                                            <Statistic.Value>{dataDomain.domaingrade}</Statistic.Value>
                                        </Statistic>
                                    </Segment>
                                </Segment.Group>
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
                                    <Header as="h3">Active-Inactive</Header>
                                    <Progress value={Math.ceil(dataDomain.score1)} color='olive' total='10' progress='ratio' />
                                    <Header as="h3">Basic status</Header>
                                    <Progress value={Math.ceil(dataDomain.score2)} color='green' total='20' progress='ratio' />
                                    <Header as="h3">Revoke status</Header>
                                    <Progress value={Math.ceil(dataDomain.score3)} color='teal' total='10' progress='ratio' />
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment>
                                    <Header as="h3">Expired</Header>
                                    <Progress value={Math.ceil(dataDomain.score4)} color='violet' total='10' progress='ratio' />
                                    <Header as="h3">Valid-Invalid</Header>
                                    <Progress value={Math.ceil(dataDomain.score5)} color='purple' total='10' progress='ratio' />
                                    <Header as="h3">Protocol type</Header>
                                    <Progress value={Math.ceil(dataDomain.score6)} color='pink' total='40' progress='ratio' />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        {/* <Grid.Row>
                            <Header as="h2">Certification Detail</Header>
                        </Grid.Row> */}
                        <Grid.Row>
                            <Grid.Column>
                                <Segment>
                                    <Header as="h3">
                                        Have Certification
                                    </Header>
                                    <BarChart width={640} height={450} data={this.certHave(dataDomain)}
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
                                    <Header as="h3">
                                        Valid Certification
                                    </Header>
                                    <BarChart width={640} height={450} data={this.certValid(dataDomain)}
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
                                    <Header as="h3">
                                        Protocol Detail
                                    </Header>
                                    <BarChart width={640} height={450} data={this.protocolHave(dataDomain)}
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
                                    <Header as="h3">
                                        Active-Inactive
                                    </Header>
                                    <BarChart width={640} height={450} data={this.activeHave(dataDomain)}
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
                        <Grid.Row>
                            <Header as="h2">Website</Header>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                {
                                    dataSubdomain ? <Table celled headerRow={header} tableData={dataSubdomain} renderBodyRow={renderBodyRow} />:
                                    this.loadStatus()
                                }
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Pagination activePage={activePage} onPageChange={this.handlePaginationChange} totalPages={allPage} />
                        </Grid.Row>
                    </Grid>
                </React.Fragment>
            )
        }
        return (
            <React.Fragment>
                <Segment basic textAlign='center' className="chartcontent">
                    <Header as="h1" >Not Found</Header>
                </Segment>
            </React.Fragment>
        )
    }
}

export default withRouter(Content)