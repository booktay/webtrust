import React, { Component } from 'react'
import {
  Form, Card, Segment, Breadcrumb, Header
} from 'semantic-ui-react'
import stateOptions from "./domain.json";
import {Router} from "../../routes";
import {withRouter} from "next/router";

class Domain extends Component {
  state = { domain: '', subdomain: ''}

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const {domain, subdomain} = this.state
    Router.pushRoute(`/domain/${domain}/${subdomain}`)
  }

  render() {
    return (
      <div style={{margin:"2em", minHeight: 'calc(100vh - 100px)'}}>
        <Breadcrumb>
          <Breadcrumb.Section><a href='/'>Home</a></Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section><a href='/domain'>Domain</a></Breadcrumb.Section>
        </Breadcrumb>
        <Segment style={{width:"fit-content", position:"absolute"}}>
          <Header>Scoring Domain Monitoring</Header>
          <Form>
            <Form.Group inline style={{width: "30em"}}>
              <Form.Field>
                <label>Selected Domain</label>
                < Form.Select options = {
                  stateOptions.domain
                }
                placeholder = 'Domain'
                name = "domain"
                search searchInput = {
                  {
                    id: 'form-select-domain'
                  }
                }
                onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Selected Subdomain</label>
                < Form.Select options = {
                  stateOptions.subdomain
                }
                placeholder = 'Subdomain'
                name = "subdomain"
                search searchInput = {
                  {
                    id: 'form-select-subdomain'
                  }
                }
                onChange={this.handleChange}
                />
              </Form.Field>
            </Form.Group>
            <Form.Button content='Search' fluid primary onClick={this.handleSubmit} />
          </Form>
        </Segment >
      </div>
    )
  }
}

export default withRouter(Domain)