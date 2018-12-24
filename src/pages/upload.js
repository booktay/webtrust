import { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import {
  Button, Header, Icon, Segment, Sidebar, Menu, Breadcrumb, Form, Input
} from 'semantic-ui-react'
import Nav from "../components/layout/navigator";
import Sidemenu from "../components/layout/sidemenu";
import { withRouter } from "next/router";
import { Router } from "../Routes";

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sidebarOpened: true,
      filename: ""
    }
    this.handleOpenSidebar = this.handleOpenSidebar.bind(this)
  }

  handleOpenSidebar() {
    this.setState(state => {
      state.sidebarOpened = !state.sidebarOpened
      return state
    })
  }

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
    })
  }

  handleSubmit = () => {
    const { filename } = this.state
    if (filename !== "") {
      Router.pushRoute(`/upload/${filename}`)
    }
    else {
      alert("Please input Name!!!")
    }
  }

  render() {
    var sidebarcontent = 'menushow'
    if (!this.state.sidebarOpened) {
      sidebarcontent = 'menuhide'
    }

    const { filename } = this.state

    return (
      <React.Fragment>
        <Nav onReqOpenSidebar={this.handleOpenSidebar} />
        <Sidebar.Pushable as={Segment} id="sidebarhead">
          <Sidemenu sidebarOpened={this.state.sidebarOpened} />
          <Sidebar.Pusher className={sidebarcontent}>
            <Menu secondary inverted color="blue" attached='top'>
              <Menu.Item>
                <Breadcrumb>
                  <Breadcrumb.Section><a href='/'>Home</a></Breadcrumb.Section>
                  <Breadcrumb.Divider />
                  <Breadcrumb.Section><a href='/upload'>Upload Files</a></Breadcrumb.Section>
                </Breadcrumb>
              </Menu.Item>
            </Menu>
            <Segment attached='bottom' className="bottomcontent">
              <Segment>
                <Form>
                  <Form.Field>
                    <Header as="h3">Upload Detail</Header>
                    <Input action>
                      <Input label='Input Filename' placeholder='50alexath' name='filename' value={filename} onChange={this.handleChange} />
                    </Input>
                  </Form.Field>
                </Form>
              </Segment>
              <Segment placeholder>
                <Header icon>
                  <Icon name='file alternate' />
                  You can find any score files at directory <a href="/dir">/dir</a>
                </Header>
                <Button primary onClick={this.handleSubmit}>Add file</Button>
              </Segment>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </React.Fragment>
    )
  }
}
