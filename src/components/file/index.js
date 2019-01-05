import React, { Component } from 'react'
import {
    Menu, Breadcrumb, Segment, Form, Dimmer, Loader, Header, Input, Button
} from 'semantic-ui-react'
import { withRouter } from "next/router";
import { Router } from "../../Routes";
import Content from './content';

class Filescore extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: undefined,
            filename: '',
        }
    }

    handleChange = (e, { name, value }) => {
        this.setState({
            [name]: value,
        })
    }

    handleSubmit = () => {
        const { filename } = this.state
        if (filename !== "") {
            Router.pushRoute(`/filename/${filename}`)
        }
        else {
            alert("Please input Name!!!")
        }
    }

    async componentDidMount() {
        const { router } = this.props
        if (router.query.filename) {
            const { data } = await this.loadData(router.query.filename)
            this.setState(state => {
                state.data = data
                return state
            })
        }
    }

    async componentWillReceiveProps(nextProps) {
        if (this.props.router.asPath !== nextProps.router.asPath) {
            const { data } = await this.loadData(nextProps.router.query.filename)
            this.setState(state => {
                state.data = data
                return state
            })
        }
    }

    async loadData(filename) {
        const response = await fetch(`/api/search/score/file/${filename}`)
        const responseJson = await response.json()
        return { data: responseJson }
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
        const { filename, data } = this.state
        const { router } = this.props
        // console.log(data)
        return (
            <React.Fragment>
                <Menu secondary inverted color="blue" attached='top'>
                    <Menu.Item>
                        <Breadcrumb>
                            <Breadcrumb.Section><a href='/'>Home</a></Breadcrumb.Section>
                            <Breadcrumb.Divider />
                            <Breadcrumb.Section><a href='/filename'>FileTest</a></Breadcrumb.Section>
                            {
                                router.query.filename ?
                                    <React.Fragment>
                                        <Breadcrumb.Divider icon='right angle' />
                                        <Breadcrumb.Section active>
                                            Search for Filename :
                                        <a href={router.asPath}> {router.query.filename}</a>
                                        </Breadcrumb.Section>
                                    </React.Fragment> : <React.Fragment></React.Fragment>
                            }
                        </Breadcrumb>
                    </Menu.Item>
                </Menu>
                <Segment attached='bottom' className="bottomcontent">
                    <Segment className="chartcontent">
                        <Header>File Scoring</Header>
                        <Form>
                            <Form.Field>
                                <Input action>
                                    <Input label='Input Filename' placeholder='50alexath' name='filename' value={filename} onChange={this.handleChange} />
                                    <Button onClick={this.handleSubmit} color='blue' >Scoring!!!</Button>
                                </Input>
                            </Form.Field>
                        </Form>
                    </Segment>
                    {!router.query.filename ? <React.Fragment></React.Fragment> :
                        data ? <Content dataDomain={data} /> : this.loadStatus()}
                </Segment>
            </React.Fragment>
        )
    }
}

export default withRouter(Filescore)