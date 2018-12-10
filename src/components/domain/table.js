import React, { Component } from 'react'
import {
    Segment, Dimmer, Loader, Statistic, Grid, Header, GridColumn
} from 'semantic-ui-react'
import {Router, withRouter} from "next/router";;

class Table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded : false,
            data_all: []
        }
    }

    componentDidMount() {
        const {router} = this.props
        return fetch(`/api/test/score/${router.query.domain}/${router.query.subdomain}`)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    data_all:responseJson[1],
                    loaded: true
                })
            });
    }

    render() {
        const {router} = this.props
        const {loaded, data_domain, data_all} = this.state

        if (router.query.domain && router.query.subdomain) {
            const header_url = router.query.subdomain + "." + router.query.domain
            if (loaded) {
                return (
                    <React.Fragment>
                        <Grid columns='equal' textAlign='center' className="chartgrid">
                            <Grid.Row>
                                <Header as="h2">Website</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <GridColumn>
                                    <Segment>

                                    </Segment>
                                </GridColumn>
                            </Grid.Row>
                        </Grid>
                    </React.Fragment>
                )
            }
            return (
                <React.Fragment>
                    <Segment className="chartcontent">
                        <Dimmer active inverted inline='centered' size='massive'>
                            <Loader size='large'>Loading</Loader>
                        </Dimmer>
                    </Segment>
                </React.Fragment>
            )
        }
        return (
            <React.Fragment></React.Fragment>
        )
    }
}

export default withRouter(Table)