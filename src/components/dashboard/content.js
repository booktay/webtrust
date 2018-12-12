import React, { Component } from 'react'
import {
    Menu, Breadcrumb, Segment, Header, Table, Grid
} from 'semantic-ui-react'
import {withRouter} from "next/router";

class Content extends Component {
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
                <Grid columns='equal' textAlign='center' className="chartgrid">
                    <Grid.Row>
                        <Header as="h1">TH Domain Dashboard</Header>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as="h1">Subdomain Grade</Header>
                        </Grid.Column>
                        <Grid.Column>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                    </Grid.Row>
                </Grid>
                <style jsx>{`
                `}</style>
            </React.Fragment>
        )
    }
}

export default withRouter(Content)