import React, { Component } from 'react'
import {
    Menu, Breadcrumb, Segment, Form, Dimmer, Loader, Header, Input, Button
} from 'semantic-ui-react'
import {withRouter} from "next/router";
import {Router} from "../../Routes";
import BreadcrumbSearch from './breadcrumbsearch';
import Content from './content';

class Web extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            url: '',
            search: false
        }
    }
    
    handleChange = (e, { name, value }) => {
        this.setState({ 
            [name]: value,
            search: false
        })
    }
    handleSubmit = () => {
        const {url} = this.state
        if (url !== ""){
            this.setState({search:true})
            Router.pushRoute(`/testscore/${url}`)
        }
        else {
            alert("Please input URL!!!")
        }
    }

    componentDidMount() {}

    render() {
        const {url, search} = this.state

        return (
            <React.Fragment>
                <Menu secondary inverted color="blue" attached='top'>
                    <Menu.Item>
                        <Breadcrumb>
                            <Breadcrumb.Section><a href='/'>Home</a></Breadcrumb.Section>
                            <Breadcrumb.Divider />
                            <Breadcrumb.Section><a href='/testweb'>Testweb</a></Breadcrumb.Section>
                            <BreadcrumbSearch/>
                        </Breadcrumb>
                    </Menu.Item>
                </Menu>
                <Segment attached='bottom' className="bottomcontent">
                    <Segment className="chartcontent">
                        <Header>Web Scoring</Header>
                        <Form>
                            <Form.Field>
                                <label>Input URL</label>
                                <Input fluid action>
                                    <Input label='https://' placeholder='example.com' name='url' value={url} onChange={this.handleChange}/>
                                    <Button onClick={this.handleSubmit} color='blue' >Scoring!!!</Button>
                                </Input>
                            </Form.Field>
                        </Form>
                    </Segment>
                    {
                        search ? <Content /> : <React.Fragment></React.Fragment>
                    }
                </Segment>
                <style jsx>{`
                `}</style>
            </React.Fragment>
        )
    }
}

export default withRouter(Web)