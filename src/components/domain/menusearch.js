import React, { Component } from 'react'
import {
  Menu
} from 'semantic-ui-react'
import {Router, withRouter} from "next/router";;

class MenuSearch extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {router} = this.props

        if (router.query.domain && router.query.subdomain) {
            return(
                <React.Fragment>
                    <Menu.Item>
                        <Menu.Item name='Score Detail Or Website'
                        onClick={this.props.onReqOpen}/>
                    </Menu.Item>
                </React.Fragment>
            )
        }
        return (
            <React.Fragment></React.Fragment>
        )
    }
}

export default withRouter(MenuSearch)