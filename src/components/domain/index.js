import React, { Component } from 'react'
import {
    Menu, Breadcrumb, Segment, Form, Dimmer, Loader, Header
} from 'semantic-ui-react'
import { withRouter } from "next/router";
import { Router } from "../../Routes";
import Content from './content';

class Domain extends Component {
    constructor(props) {
        super(props)
        this.state = {
            optionsDomain: [],
            optionsSubdomain: [{ key: '', value: '', text: '' }],
            loadOption: false,
            domain: '',
            subdomain: '',
            dataDomain: undefined
        }
        this.loadDataDomain = this.loadDataDomain.bind(this)
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleDomainChange = async (e, { name, value }) => {
        this.setState({ [name]: value })
        const { optionsSubdomain } = await this.loadOptionSubdomain(value)
        this.setState(state => {
            state.optionsSubdomain = optionsSubdomain
            return state
        })
    }

    handleSubmit = async () => {
        const { domain, subdomain } = this.state
        if (domain !== "" && subdomain !== "") {
            Router.pushRoute(`/domain/${domain}/${subdomain}`)
        }
        else {
            alert("Please choose Domain and Subdomain!!!")
        }
    }

    async componentDidMount() {
        const { optionsDomain } = await this.loadOptionDomain()
        this.setState(state => {
            state.optionsDomain = optionsDomain
            state.loadOption = true
            return state
        })
        const { router } = this.props
        if (router.query.domain && router.query.subdomain) {
            const { dataDomain } = await this.loadDataDomain(router.query.domain, router.query.subdomain)
            this.setState(state => {
                state.dataDomain = dataDomain
                return state
            })
        }
    }

    async componentWillReceiveProps(nextProps) {
        if (this.props.router.asPath !== nextProps.router.asPath) {
            const { dataDomain } = await this.loadDataDomain(nextProps.router.query.domain, nextProps.router.query.subdomain)
            this.setState(state => {
                state.dataDomain = dataDomain
                return state
            })
        }
    }

    async loadOptionDomain() {
        const response = await fetch('/api/search/domain')
        const responseJson = await response.json()
        var keys = []
        for (var res of responseJson) {
            keys.push({
                key: res, value: res, text: res.toUpperCase()
            });
        }
        return { optionsDomain: keys }
    }

    async loadOptionSubdomain(domain) {
        const response = await fetch(`/api/search/subdomain/${domain}`)
        const responseJson = await response.json()
        var values = []
        for (var val of responseJson) {
            values.push({ key: val, value: val, text: val.toUpperCase() });
        }
        return { optionsSubdomain: values }
    }

    async loadDataDomain(domain, subdomain) {
        const response = await fetch(`/api/search/score/subdomain/${domain}/${subdomain}`)
        const responseJson = await response.json()
        return { dataDomain: responseJson }
    }

    render() {
        const { optionsDomain, optionsSubdomain, loadOption, dataDomain } = this.state
        const { router } = this.props
        return (
            <React.Fragment>
                <Menu secondary inverted color="blue" attached='top'>
                    <Menu.Item>
                        <Breadcrumb>
                            <Breadcrumb.Section><a href='/'>Home</a></Breadcrumb.Section>
                            <Breadcrumb.Divider />
                            <Breadcrumb.Section><a href='/domain'>Domain</a></Breadcrumb.Section>
                            {
                                router.query.domain && router.query.subdomain ?
                                    <React.Fragment>
                                        <Breadcrumb.Divider icon='right angle' />
                                        <Breadcrumb.Section active>
                                            Search for Domain :
                                        <a href={router.asPath}> {router.query.domain}.{router.query.subdomain}</a>
                                        </Breadcrumb.Section>
                                    </React.Fragment> : <React.Fragment></React.Fragment>
                            }
                        </Breadcrumb>
                    </Menu.Item>
                </Menu>
                {loadOption ?
                    <Segment attached='bottom' className="bottomcontent">
                        <Segment className="chartcontent">
                            <Header>Scoring Domain Monitoring</Header>
                            <Form>
                                <Form.Field>
                                    <label>Selected Domain</label>
                                    < Form.Select options={optionsDomain} placeholder='Domain' name="domain" fluid
                                        search searchInput={{ id: 'form-select-domain' }} onChange={this.handleDomainChange} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Selected Subdomain</label>
                                    < Form.Select options={optionsSubdomain} placeholder='Subdomain' name="subdomain"
                                        search searchInput={{ id: 'form-select-subdomain' }} onChange={this.handleChange} />
                                </Form.Field>
                                <Form.Button content='Search' fluid primary onClick={this.handleSubmit} />
                            </Form>
                        </Segment>
                        {dataDomain ? <Content dataDomain={dataDomain} /> : <React.Fragment></React.Fragment>}
                    </Segment> :
                    <Segment basic attached='bottom' className="bottomcontent">
                        <Dimmer active inverted inline='centered' size='massive'>
                            <Loader size='large'>Loading</Loader>
                        </Dimmer>
                        <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                        <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                        <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                        <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    </Segment>
                }
            </React.Fragment>
        )
    }
}

export default withRouter(Domain)