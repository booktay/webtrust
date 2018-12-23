import React, { Component } from 'react'
import {
    Segment, Dimmer, Loader, Statistic, Grid, Header, Progress, Pagination, Table
} from 'semantic-ui-react'
import { withRouter } from "next/router";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
}
    from 'recharts';

function toUpperFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function useProtocol(protocol) {
    const protocol_keys = Object.keys(protocol);
    for (let keyin in protocol_keys) {
        if (keyin > 1 && ["offered (OK)", "offered"].includes(protocol[protocol_keys[keyin]])) return protocol_keys[keyin]
    }
    return ""
}

const renderBodyRow = ({ URL, HTTP, HTTPS, PROTOCOL, CERT, GRADE }, i) => ({
    key: URL,
    cells: [
        URL ? { key: 'URL', content: URL } : 'Unknown',
        HTTP ? { key: 'HTTP', content: toUpperFirst(HTTP) } : 'Unknown',
        HTTPS ? { key: 'HTTPS', content: toUpperFirst(HTTPS) } : 'Unknown',
        useProtocol(PROTOCOL) ? { key: 'PROTOCOL', content: useProtocol(PROTOCOL) } : 'Unknown',
        CERT['STATUS'] ? { key: 'CERT', content: toUpperFirst(CERT['STATUS']) } : 'Unknown',
        CERT['EXPIRED'][1] ? { key: 'EXPIRED', content: toUpperFirst(CERT['EXPIRED'][1]) } : 'Unknown',
        GRADE ? { key: 'GRADE', content: GRADE[1].toUpperCase() } : 'Unknown'
    ],
})

class Content extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSubdomain: undefined,
            header: ['URL', 'HTTP', 'HTTPS', 'PROTOCOL', 'CERT STATUS', 'EXPIRED DATE', 'GRADE'],
            allPage: 1,
            activePage: 1
        }
        this.handlePaginationChange = this.handlePaginationChange.bind(this)
        this.loadTableData = this.loadTableData.bind(this)
    }

    certHave(dataDomain) {
        return [
            { name: "Yes", value: dataDomain.havecertificate },
            { name: "No", value: dataDomain.nothavecertificate },
        ]
    }

    statusCode(status) {
        const code_keys = ["100", "200", "300", "400", "500", "other"];

        return [
            {
                name: "Http",
                "1XX": status[0][code_keys[0]] ? status[0][code_keys[0]] : 0,
                "2XX": status[0][code_keys[1]] ? status[0][code_keys[1]] : 0,
                "3XX": status[0][code_keys[2]] ? status[0][code_keys[2]] : 0,
                "4XX": status[0][code_keys[3]] ? status[0][code_keys[3]] : 0,
                "5XX": status[0][code_keys[4]] ? status[0][code_keys[4]] : 0,
                other: status[0][code_keys[5]] ? status[0][code_keys[5]] : 0,
            },
            {
                name: "Https",
                "1XX": status[1][code_keys[0]] ? status[1][code_keys[0]] : 0,
                "2XX": status[1][code_keys[1]] ? status[1][code_keys[1]] : 0,
                "3XX": status[1][code_keys[2]] ? status[1][code_keys[2]] : 0,
                "4XX": status[1][code_keys[3]] ? status[1][code_keys[3]] : 0,
                "5XX": status[1][code_keys[4]] ? status[1][code_keys[4]] : 0,
                other: status[1][code_keys[5]] ? status[1][code_keys[5]] : 0,
            }
        ]
    }

    protocolHave(protocol) {
        const protocol_keys = Object.keys(protocol);
        var protocol_format = [];
        for (var lookup in protocol_keys) {
            protocol_format.push({ name: protocol_keys[lookup], total: protocol[protocol_keys[lookup]] });
        }
        return protocol_format;
    }

    activeHave(dataDomain) {
        var active = [
            { name: "Http", active: dataDomain['activehttp'], inactive: dataDomain['inactivehttp'] },
            { name: "Https", active: dataDomain['activehttps'], inactive: dataDomain['inactivehttps'] },
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
        const { domain, subdomain } = this.props.dataDomain
        const { dataSubdomain } = await this.loadTableData(domain, subdomain, activePage)
        this.setState(state => {
            state.dataSubdomain = dataSubdomain
            state.activePage = activePage
            return state
        })
    }

    async componentDidMount() {
        const { domain, subdomain } = this.props.dataDomain
        const { activePage } = this.state
        const { allPage } = await this.loadPage(this.props.dataDomain)
        const { dataSubdomain } = await this.loadTableData(domain, subdomain, activePage)
        this.setState(state => {
            state.dataSubdomain = dataSubdomain
            state.allPage = allPage
            return state
        })
    }

    async componentWillReceiveProps(nextProps) {
        if (this.props.dataDomain.subdomain !== nextProps.dataDomain.subdomain) {
            const { domain, subdomain } = nextProps.dataDomain
            const { allPage } = await this.loadPage(nextProps.dataDomain)
            const { dataSubdomain } = await this.loadTableData(domain, subdomain, 1)
            this.setState(state => {
                state.dataSubdomain = dataSubdomain
                state.allPage = allPage
                state.activePage = 1
                return state
            })
        }
    }

    async loadPage(dataDomain) {
        return { allPage: Math.ceil(dataDomain['url'].length / 10) }
    }

    async loadTableData(domain, subdomain, page) {
        const response = await fetch(`/api/search/score/subdomain/${domain}/${subdomain}/url/${page}`)
        const responseJson = await response.json()
        return { dataSubdomain: responseJson }
    }

    render() {
        const { dataDomain } = this.props
        const { activePage, dataSubdomain, allPage, header } = this.state
        console.log(dataSubdomain);

        if (dataDomain.domain) {
            return (
                <React.Fragment>
                    <Grid columns='equal' textAlign='center' divided className="chartgrid">
                        <Grid.Row>
                            <Grid.Column style={{ minWidth: "247.31px" }}>
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
                                < Segment.Group horizontal style={
                                    {
                                        backgroundColor: (dataDomain['grade'][0] > 80) ? "lightgreen" : ((dataDomain['grade'][0] >= 50) ? "lightyellow" : "lightsalmon")
                                    }
                                } >
                                    <Segment>
                                        < Statistic color="black" size='huge' >
                                            <Statistic.Label>Grade</Statistic.Label>
                                            <Statistic.Value>{dataDomain['grade'][1]}</Statistic.Value>
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
                                    <Progress value={Math.ceil(dataDomain['score'][0])} color='olive' total='10' progress='ratio' />
                                    <Header as="h3">Basic status</Header>
                                    <Progress value={Math.ceil(dataDomain['score'][1])} color='green' total='20' progress='ratio' />
                                    <Header as="h3">Revoke status</Header>
                                    <Progress value={Math.ceil(dataDomain['score'][2])} color='teal' total='10' progress='ratio' />
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment>
                                    <Header as="h3">Expired</Header>
                                    <Progress value={Math.ceil(dataDomain['score'][3])} color='violet' total='10' progress='ratio' />
                                    <Header as="h3">Valid-Invalid</Header>
                                    <Progress value={Math.ceil(dataDomain['score'][4])} color='purple' total='10' progress='ratio' />
                                    <Header as="h3">Protocol type</Header>
                                    <Progress value={Math.ceil(dataDomain['score'][5])} color='pink' total='40' progress='ratio' />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        {/* Row 2 */}
                        <Grid.Row>
                            <Grid.Column>
                                <Segment>
                                    <Header as="h3">
                                        Have Certification
                                    </Header>
                                    <BarChart width={640} height={450} data={this.certHave(dataDomain)}
                                        margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill="#2B3959" minPointSize={10} />
                                    </BarChart>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment>
                                    <Header as="h3">
                                        Status Code
                                    </Header>
                                    <BarChart width={640} height={450} data={this.statusCode([dataDomain['code'], dataDomain['scode']])}
                                        margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="other" stackId="a" fill="#1494A2" minPointSize={8} />
                                        <Bar dataKey="5XX" stackId="a" fill="#780829" minPointSize={8} />
                                        <Bar dataKey="3XX" stackId="a" fill="#DA3521" minPointSize={8} />
                                        <Bar dataKey="2XX" stackId="a" fill="#DB8830" minPointSize={8} />
                                        <Bar dataKey="4XX" stackId="a" fill="#8D683A" minPointSize={8} />
                                        <Bar dataKey="1XX" stackId="a" fill="#333923" minPointSize={8} />
                                    </BarChart>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        {/* Row 3 */}
                        <Grid.Row>
                            <Grid.Column>
                                <Segment>
                                    <Header as="h3">
                                        Protocol Detail
                                    </Header>
                                    <BarChart width={640} height={450} data={this.protocolHave(dataDomain['protocol'])}
                                        margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="total" fill="#C19641" minPointSize={8} />
                                    </BarChart>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment>
                                    <Header as="h3">
                                        Active-Inactive
                                    </Header>
                                    <BarChart width={640} height={450} data={this.activeHave(dataDomain)}
                                        margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="active" fill="#66887C" minPointSize={10} />
                                        <Bar dataKey="inactive" fill="#C19641" minPointSize={10} />
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
                                    dataSubdomain ? <Table celled headerRow={header} tableData={dataSubdomain} renderBodyRow={renderBodyRow} /> :
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