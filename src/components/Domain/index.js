import React, { Component } from 'react'
import {
  Form, Card
} from 'semantic-ui-react'
import stateOptions from "./domain.json";
import {Router} from "../../routes";
export default class Domain extends Component {
  state = { domain: 'th', subdomain: ''}

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    Router.pus
  }

  render() {
    const { domain, subdomain } = this.state
    return (
      <div>
        <div style={{margin:"2em", minHeight: 'calc(100vh - 100px)'}}>
          < Card fluid >
            <Card.Content>
              <Card.Header>Scoring Domain Monitoring</Card.Header>
            </Card.Content>
            <Card.Content>
              <Form>
                <Form.Group inline>
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
                </Form.Group>
                <Form.Group inline>
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
                <Form.Button content='Submit' />
              </Form>
            </Card.Content>
          </Card>
        </div>
      </div>
    )
  }
}

