import React, { Component } from 'react'
import {
    Menu, Breadcrumb, Segment, Form, Dimmer, Loader, Header
} from 'semantic-ui-react'
import {withRouter} from "next/router";
import {Router} from "../../Routes";
import Content from './content';

class Dashboard extends Component {
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
        return fetch('/test/domain')
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
                            </Breadcrumb>
                        </Menu.Item>
                    </Menu>
                    <Segment attached='bottom' className="bottomcontent">
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
                            </Breadcrumb>
                        </Menu.Item>
                    </Menu>
                <Segment attached='bottom' className="bottomcontent">
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

export default withRouter(Dashboard)