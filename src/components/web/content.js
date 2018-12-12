import React, { Component } from 'react'
import {
    Segment, Dimmer, Loader, Statistic, Grid, Table, Header, Pagination
} from 'semantic-ui-react'
import {Router, withRouter} from "next/router";

const renderBodyRow = ({ url,CertificateStatus,Expired,total_score, domain_grade }, i) => ({
  key: url,
  cells: [
    url,CertificateStatus,Expired,total_score, domain_grade
  ],
})

class Content extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded : false,
            data_domain: {},
            data_all: [],
            header: ['url','CertificateStatus','Expired','total_score', 'domain_grade'],
            all_page:1,
            activePage: 1
        }
        this.handlePaginationChange = this.handlePaginationChange.bind(this)
        this.loadTableData = this.loadTableData.bind(this)
    }

    handlePaginationChange = async (e, { activePage }) => {
        const {router} = this.props
        const data_all = await this.loadTableData(router.query.domain, router.query.subdomain, activePage)
        this.setState(state => {
            state.data_all = data_all
            state.loaded = true
            state.activePage = activePage
            return state
        })
    }

    async componentDidMount() {
        const {router} = this.props
        const {activePage} = this.state
        const data_domain = await this.loadGrade(router.query.domain, router.query.subdomain)
        const all_page = await this.loadPage()
        const data_all  = await this.loadTableData(router.query.domain, router.query.subdomain, activePage)
        this.setState(state => {
            state.data_domain = data_domain
            state.data_all = data_all
            state.all_page = all_page
            state.loaded = true
            return state
        })
    }

    async loadPage() {
        const response = await fetch(`/test/scoredomain/total`)
        const responseJson = await response.json()
        return responseJson['total']
    }

    async loadGrade(domain, subdomain) {
        const response = await fetch(`/test/scoredomain/${domain}/${subdomain}`)
        const responseJson = await response.json()
        return responseJson
    }

    async loadTableData(domain, subdomain, page) {
        const {header} = this.state
        const url = `/test/scoresubdomain/${domain}/${subdomain}/${page}`
        const response = await fetch(url)
        const responseJson = await response.json()
        const data_all = responseJson.map(item => {
            const result = {}
            for (let column of header) {
                result[column] = item[column]
            }
            return result
        })
        return data_all
    }

    render() {
        const {router} = this.props
        const {loaded, data_domain, data_all,activePage, header, all_page} = this.state
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
                                    {
                                        data_all ? <Table celled headerRow={header} tableData={data_all} renderBodyRow={renderBodyRow} />:
                                        <React.Fragment>
                                            <Segment basic className="chartcontent">
                                                <Dimmer active inverted inline='centered' size='massive'>
                                                    <Loader size='large'>Loading</Loader>
                                                </Dimmer>
                                            </Segment>
                                        </React.Fragment>
                                    }
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Pagination activePage={activePage} onPageChange={this.handlePaginationChange} totalPages={all_page} />
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