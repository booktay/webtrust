import React, { Component } from 'react'
import {
    Menu, Breadcrumb, Segment, Header, Table, Grid, GridColumn
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
                    <Grid columns='equal' textAlign='center' className="chartgrid">
                        <Grid.Row>
                            <Header as="h1">Grading Rule</Header>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h1">Grade</Header>
                                <Table celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Total Score</Table.HeaderCell>
                                            <Table.HeaderCell>Grade</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>70-100</Table.Cell>
                                            <Table.Cell positive>A</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>60-69</Table.Cell>
                                            <Table.Cell>B+</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>50-59</Table.Cell>
                                            <Table.Cell>B</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>40-49</Table.Cell>
                                            <Table.Cell warning>C+</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>30-39</Table.Cell>
                                            <Table.Cell>C</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>20-29</Table.Cell>
                                            <Table.Cell>D</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>0-20</Table.Cell>
                                            <Table.Cell negative>F</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                            <Grid.Column>
                                <Header as="h1">Score</Header>
                                <Table celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Scoring Part</Table.HeaderCell>
                                            <Table.HeaderCell>Score</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>Active-Inactive</Table.Cell>
                                            <Table.Cell>10%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Basic status</Table.Cell>
                                            <Table.Cell>20%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Revoke status</Table.Cell>
                                            <Table.Cell>10%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Expired</Table.Cell>
                                            <Table.Cell>10%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Valid-Invalid</Table.Cell>
                                            <Table.Cell>10%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Protocol type</Table.Cell>
                                            <Table.Cell>40%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row active>
                                            <Table.Cell>Total Score</Table.Cell>
                                            <Table.Cell>100%</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                        </Grid.Row>
                    </Grid>
                    <Grid columns='equal' textAlign='center' className="chartgrid">
                        <Grid.Row>
                            <Header as="h1">Basic Part (30%)</Header>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h1">Active-Inactive Part(10%)</Header>
                                <Table celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Detail</Table.HeaderCell>
                                            <Table.HeaderCell>Score</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>Status code from http</Table.Cell>
                                            <Table.Cell>4%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Status code from https </Table.Cell>
                                            <Table.Cell>6%</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                                <Table celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Detail</Table.HeaderCell>
                                            <Table.HeaderCell>Status code</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>Active</Table.Cell>
                                            <Table.Cell positive>100,200,300</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Inactive </Table.Cell>
                                            <Table.Cell negative>400,500</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                            <Grid.Column>
                                <Header as="h1">Basic Status Part (20%)</Header>
                                <Table celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Detail</Table.HeaderCell>
                                            <Table.HeaderCell>Score</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>HSTS+HTTPS</Table.Cell>
                                            <Table.Cell positive>20%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>HTTPS+HTTP</Table.Cell>
                                            <Table.Cell>15%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Only HTTPS</Table.Cell>
                                            <Table.Cell>10%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Only HTTP</Table.Cell>
                                            <Table.Cell negative>0%</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid columns='equal' textAlign='center' className="chartgrid">
                        <Grid.Row>
                            <Header as="h1">Certification Part (30%)</Header>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h1">Revoke status (10%)</Header>
                                <Table celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Detail</Table.HeaderCell>
                                            <Table.HeaderCell>Score</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>Not revoke</Table.Cell>
                                            <Table.Cell positive>10%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Not revoke</Table.Cell>
                                            <Table.Cell negative>0%</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                            <Grid.Column>
                                <Header as="h1">Expired Part (10%)</Header>
                                <Table celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Days</Table.HeaderCell>
                                            <Table.HeaderCell>Score</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>More than 30</Table.Cell>
                                            <Table.Cell positive>10%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>7-30</Table.Cell>
                                            <Table.Cell>5%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>0-7</Table.Cell>
                                            <Table.Cell negative>2.5%</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                            <Grid.Column>
                                <Header as="h1">Valid-Invalid Part(10%)</Header>
                                <Table celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Detail</Table.HeaderCell>
                                            <Table.HeaderCell>Score</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>Valid </Table.Cell>
                                            <Table.Cell positive>10%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>Invalid </Table.Cell>
                                            <Table.Cell negative>0%</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid columns='equal' textAlign='center' className="chartgrid">
                        <Grid.Row>
                            <Header as="h1">Protocol Part (40%)</Header>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Table celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Protocol</Table.HeaderCell>
                                            <Table.HeaderCell>Score</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>TLS1.2, TLS1.3</Table.Cell>
                                            <Table.Cell positive>40%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>TLS1.1</Table.Cell>
                                            <Table.Cell>30%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>TLS1.0, SSL3</Table.Cell>
                                            <Table.Cell>20%</Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>SSL2</Table.Cell>
                                            <Table.Cell negative>10%</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <style jsx>{`
                `}</style>
            </React.Fragment>
        )
    }
}

export default withRouter(Domain)