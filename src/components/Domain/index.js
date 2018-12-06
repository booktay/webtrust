import React, { Component } from 'react'
import {
  Form, Card, Segment, Grid, Header, GridColumn
} from 'semantic-ui-react'
import stateOptions from "./domain.json";
import {Router} from "../../routes";
export default class Domain extends Component {
  state = { domain: '', subdomain: '', header_domain:''}

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const {domain, subdomain} = this.state
    if (domain !== '' && subdomain != '') {
      this.setState({header_domain:domain.toUpperCase()+"."+subdomain.toUpperCase()})
    } 
    Router.pushRoute(`/domain/${domain}/${subdomain}`)
  }

  render() {
    const { domain, subdomain, header_domain } = this.state
    return (
      <div style={{margin:"2em", minHeight: 'calc(100vh - 100px)'}}>
        <Grid>
          <GridColumn column={2}>
            
          </GridColumn>
        </Grid>
        <Segment>
              <Header>Scoring Domain Monitoring</Header>
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
                  <Form.Button content='Submit' onClick={this.handleSubmit}  style={{marginTop: "1.1em"}} />
                </Form.Group>
              </Form>
        </Segment >
      </div>
    )
  }
}

