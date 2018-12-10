import React, { Component } from 'react'
import {
  Breadcrumb
} from 'semantic-ui-react'
import {Router, withRouter} from "next/router";;

class BreadcrumbSearch extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {}

    render() {
        const {router} = this.props

        if (router.query.domain && router.query.subdomain) {
            const header_url = router.query.subdomain + "." + router.query.domain;
            return(
                <React.Fragment>
                    <Breadcrumb.Divider icon='right angle' />
                    <Breadcrumb.Section active>
                        Search for : 
                        <a href={router.asPath}> {header_url}</a>
                    </Breadcrumb.Section>
                </React.Fragment>
            )
        }
        return (
            <React.Fragment></React.Fragment>
        )
    }
}

export default withRouter(BreadcrumbSearch)