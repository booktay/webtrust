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
    this.onChangeFile = this.onChangeFile.bind(this);
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

  onChangeFile() {
    const fileButton = document.getElementById(this.id);
    const file = fileButton ? fileButton.files[0] : null;
    if (this.props.onSelect) {
      this.props.onSelect(file);
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
                      <Input fluid label='Input Filename' placeholder='50alexath' name='filename' value={filename} onChange={this.handleChange} />
                    </Input>
                    <Input action>
                      <Input fluid hidden multiple type="file" onChange={this.onChangeFile} />
                    </Input>
                  </Form.Field>
                </Form>
                <Button primary onClick={this.handleSubmit}>Add file</Button>
              </Segment>
              <Segment placeholder>
                <Header icon>
                  <Icon name='file alternate' />
                  You can find any score files at directory <a href="/dir">/dir</a>
                </Header>
              </Segment>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </React.Fragment>
    )
  }
}
