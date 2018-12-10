import React, { Component } from 'react'
import {
    Menu, Breadcrumb, Segment, Form, Dimmer, Loader, Header
} from 'semantic-ui-react'
import {withRouter} from "next/router";
import {Router} from "../../Routes";
import Chart from './chart';
import BreadcrumbSearch from './breadcrumbsearch';

class Domain extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            loadOption: false,
            domain: '',
            subdomain: '',
            options_all: [],
            options_domain:[],
            options_subdomain:[]
        }
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleDomainChange = (e, { name, value }) => {
        this.setState({ 
            [name]: value,
            options_subdomain: this.state.options_all[value]
        })
    }
    
    handleSubmit = () => {
        const {domain, subdomain} = this.state
        if (domain !== "" && subdomain !== ""){
            Router.pushRoute(`/domain/${domain}/${subdomain}`)
        }
        else {
            alert("Please choose Domain and Subdomain!!!")
        }
    }

    componentDidMount() {
        return fetch('/api/test/domain')
            .then((response) => response.json())
            .then((responseJson) => {
                var keys = [], values = {};
                for(var res in responseJson) {
                    keys.push({ 
                        key: res, value: res, text: res.toUpperCase()
                    });
                    values[res]=[]
                    for (var temp in responseJson[res]) {
                        var val = responseJson[res][temp]
                        values[res].push({
                            key:val, value: val, text: val.toUpperCase()
                        });
                    }
                }
                this.setState({
                    options_all:values,
                    options_domain:keys,
                    options_subdomain:[{
                        key:'', value: '', text: ''
                    }],
                    loadOption: true
                })
            });
    }

    
    render() {
        const {options_domain, options_subdomain, loadOption} = this.state

        if (loadOption) {
            return (
                <React.Fragment>
                    <Menu secondary inverted color="blue" attached='top'>
                        <Menu.Item>
                            <Breadcrumb>
                                <Breadcrumb.Section><a href='/'>Home</a></Breadcrumb.Section>
                                <Breadcrumb.Divider />
                                <Breadcrumb.Section><a href='/domain'>Domain</a></Breadcrumb.Section>
                                <BreadcrumbSearch/>
                            </Breadcrumb>
                        </Menu.Item>
                    </Menu>
                    <Segment attached='bottom' className="bottomcontent">
                        <Segment className="chartcontent">
                            <Header>Scoring Domain Monitoring</Header>
                            <Form>
                                <Form.Field>
                                    <label>Selected Domain</label>
                                    < Form.Select options = { options_domain } placeholder = 'Domain' name = "domain" fluid
                                    search searchInput = {{ id: 'form-select-domain' }} onChange={this.handleDomainChange} />
                                </Form.Field>
                                <Form.Field>
                                    <label>Selected Subdomain</label>
                                    < Form.Select options = { options_subdomain } placeholder = 'Subdomain' name = "subdomain"
                                    search searchInput = {{ id: 'form-select-subdomain' }} onChange={this.handleChange} />
                                </Form.Field>
                                <Form.Button content='Search' fluid primary onClick={this.handleSubmit} />
                            </Form>
                        </Segment>
                        <Chart/>
                    </Segment>
                    <style jsx>{`
                    `}</style>
                </React.Fragment>
            )
        }

        return (
            <React.Fragment>
                <Menu secondary inverted color="blue" attached='top'>
                        <Menu.Item>
                            <Breadcrumb>
                                <Breadcrumb.Section><a href='/'>Home</a></Breadcrumb.Section>
                                <Breadcrumb.Divider />
                                <Breadcrumb.Section><a href='/domain'>Domain</a></Breadcrumb.Section>
                            </Breadcrumb>
                        </Menu.Item>
                    </Menu>
                <Segment attached='bottom'>
                    <Dimmer active inverted inline='centered' size='massive'>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>
                    <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                </Segment>
            </React.Fragment>
        )
    }
}

export default withRouter(Domain)