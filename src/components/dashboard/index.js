import React, { Component } from 'react'
import {
  Segment, Menu, Dimmer, Loader, Breadcrumb
} from 'semantic-ui-react'
import {Router, withRouter} from "next/router";

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            loaded: false,
            domain: '',
            subdomain: ''
        }
     }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleSubmit = () => {
        const {domain, subdomain} = this.state
        if (domain !== "" && subdomain !== ""){
            Router.push(`/domain/${domain}/${subdomain}`)
        }
        else {
            alert("Please choose Domain and Subdomain!!!")
        }
    }

    componentDidMount() {
        this.setState({
            // loaded: true
        });
    }
    
    render() {
        const {router} = this.props
        var dimmershow = 'inactive'
        if (this.state.loaded == false) {
            dimmershow = 'active'
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
                <Segment attached='bottom'>
                    <Dimmer className={dimmershow} inverted inline='centered' size='massive'>
                        <Loader size='large'>Loading</Loader>
                    </Dimmer>
                    <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                </Segment>
                <style jsx>{`
                `}</style>
            </React.Fragment>
        )
    }
}

export default withRouter(Dashboard)