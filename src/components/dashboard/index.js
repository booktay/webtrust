import React, { Component } from 'react'
import {
    Menu, Breadcrumb, Segment, Dimmer, Loader
} from 'semantic-ui-react'
import { withRouter } from "next/router";
import { Router } from "../../Routes";
import Content from './content';

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataDomain: undefined,
            load: false
        }
    }

    async componentDidMount() {
        const { dataDomain } = await this.loadDataDomain()
        this.setState(state => {
            state.dataDomain = dataDomain
            state.load = true
            return state
        })
    }

    async loadDataDomain() {
        const response = await fetch(`/api/search/th`)
        const responseJson = await response.json()
        return { dataDomain: responseJson }
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

    render() {
        const { load, dataDomain } = this.state;
        if (load) {
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
                        {dataDomain ? <Content dataDomain={dataDomain} /> : <React.Fragment></React.Fragment>}
                    </Segment>
                    <style jsx>{`
                        `}</style>
                </React.Fragment>
            )
        }
        return this.loadStatus();
    }
}

export default withRouter(Dashboard)