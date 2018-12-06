import React, { Component } from 'react'
import {
  Header, Form, Statistic, Breadcrumb, Segment, Grid
} from 'semantic-ui-react'
import {withRouter} from "next/router";
import {Router} from "../../routes";
import stateOptions from "./domain.json";
import ChartA from "./ChartA";

class Result extends Component {

  state = { domain: '', subdomain: '', 
    data:{
      grade:"C+"
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const {domain, subdomain} = this.state
    Router.pushRoute(`/domain/${domain}/${subdomain}`)
  }
  render() {
    const {router} = this.props
    const {grade} = this.state.data

    const header_url = router.query.subdomain + "." + router.query.domain
    return (
      <div style={{margin:"2em", minHeight: 'calc(100vh - 100px)'}}>
        <Breadcrumb>
          <Breadcrumb.Section><a href='/'>Home</a></Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section><a href='/domain'>Domain</a></Breadcrumb.Section>
          <Breadcrumb.Divider icon='right angle' />
          <Breadcrumb.Section active>
            Search for : 
            <a href={router.asPath}> {header_url}</a>
          </Breadcrumb.Section>
        </Breadcrumb>
        <br/>
        <Grid style={{margin:"auto"}}>
          <Grid.Row columns='equal'>
            <Grid.Column width={5}>
              <Segment style={{width:"fit-content"}}>
                <Header>Scoring Domain Monitoring</Header>
                <Form>
                  <Form.Group inline style={{width: "30em"}}>
                    <Form.Field >
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
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment.Group horizontal style={{maxWidth:"fit-content", height:"170.64px",margin:"auto", marginLeft:"1em"}}>
                <Segment inverted color="red" style={{paddingTop:"2em"}}>
                  < Statistic size='huge' inverted color="black" >
                    <Statistic.Label>Grade</Statistic.Label>
                    <Statistic.Value>{grade}</Statistic.Value>
                  </Statistic>
                </Segment>
                <Segment style={{paddingTop:"2em"}}>
                  < Statistic size='huge' >
                    <Statistic.Label>Subdomain</Statistic.Label>
                    <Statistic.Value>{router.query.subdomain}</Statistic.Value>
                  </Statistic>
                  < Statistic size='huge' >
                    <Statistic.Label>Domain</Statistic.Label>
                    <Statistic.Value>{router.query.domain}</Statistic.Value>
                  </Statistic>
                </Segment>
              </Segment.Group>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns='equal'>
              <ChartA />
            {/* <Grid.Column width={10}>
              <Segment>
              </Segment>
            </Grid.Column>
            <Grid.Column></Grid.Column> */}
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default withRouter(Result)