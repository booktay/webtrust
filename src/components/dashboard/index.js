import React, { Component } from 'react'
import {
    Menu, Breadcrumb, Segment, Dimmer, Loader
} from 'semantic-ui-react'
import {withRouter} from "next/router";
import {Router} from "../../Routes";
import Content from './content';

class Dashboard extends Component {
    constructor(props) {
        super(props)
    }

    render() {
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
                    <Content/>
                </Segment>
                <style jsx>{`
                `}</style>
            </React.Fragment>
        )
    }
}

export default withRouter(Dashboard)