import React, { Component } from 'react'
import {
    Menu, Breadcrumb, Segment
} from 'semantic-ui-react'
import {withRouter} from "next/router";

class Domain extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }

    render() {
        const {data} = this.state
        return (
            <React.Fragment>
                <Menu secondary inverted color="blue" attached='top'>
                    <Menu.Item>
                        <Breadcrumb>
                            <Breadcrumb.Section><a href='/'>Home</a></Breadcrumb.Section>
                            <Breadcrumb.Divider />
                            <Breadcrumb.Section><a href='/rule'>Rule</a></Breadcrumb.Section>
                        </Breadcrumb>
                    </Menu.Item>
                </Menu>
                <Segment attached='bottom' className="bottomcontent">
                    <Segment className="chartcontent">
                    </Segment>
                </Segment>
                <style jsx>{`
                `}</style>
            </React.Fragment>
        )
    }
}

export default withRouter(Domain)