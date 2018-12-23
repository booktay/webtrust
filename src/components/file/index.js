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
            name: '',
        }
    }

    handleChange = (e, { name, value }) => {
        this.setState({
            [name]: value,
        })
    }

    handleSubmit = () => {
        const { name } = this.state
        if (name !== "") {
            Router.pushRoute(`/file/${name}`)
        }
        else {
            alert("Please input URL!!!")
        }
    }

    async componentDidMount() {
        const { router } = this.props
        if (router.query.name) {
            const { data } = await this.loadData(router.query.name)
            this.setState(state => {
                state.data = data
                return state
            })
        }
    }

    async componentWillReceiveProps(nextProps) {
        if (this.props.router.asPath !== nextProps.router.asPath) {
            const { data } = await this.loadData(nextProps.router.query.name)
            this.setState(state => {
                state.data = data
                return state
            })
        }
    }

    async loadData(name) {
        const response = await fetch(`/api/score/file/${name}`)
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
        const { url, data } = this.state
        const { router } = this.props

        return (
            <React.Fragment>
                <Menu secondary inverted color="blue" attached='top'>
                    <Menu.Item>
                        <Breadcrumb>
                            <Breadcrumb.Section><a href='/'>Home</a></Breadcrumb.Section>
                            <Breadcrumb.Divider />
                            <Breadcrumb.Section><a href='/file'>File score</a></Breadcrumb.Section>
                            {
                                router.query.name ?
                                    <React.Fragment>
                                        <Breadcrumb.Divider icon='right angle' />
                                        <Breadcrumb.Section active>
                                            Search for File :
                                        <a href={router.asPath}> {router.query.name}</a>
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
                                    <Input label='Filename' placeholder='alexa' name='filename' value={filename} onChange={this.handleChange} />
                                    <Button onClick={this.handleSubmit} color='blue' >Scoring!!!</Button>
                                </Input>
                            </Form.Field>
                        </Form>
                    </Segment>
                    {!router.query.name ? <React.Fragment></React.Fragment> :
                        data ? <Content data={data} /> : this.loadStatus()}
                </Segment>
            </React.Fragment>
        )
    }
}

export default withRouter(Filescore)