import React, { Component } from 'react'
import {
  Form, Card, Segment, Breadcrumb, Header
} from 'semantic-ui-react'
import {Router, withRouter} from "next/router";

class Domain extends Component {
  state = { domain: '', subdomain: ''}

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const {domain, subdomain} = this.state
    if (domain !== "" && subdomain !== ""){
      Router.push(`/domain/${domain}/${subdomain}`)
    }
    else {
      alert("Please choose Domain and Subdomain!!!")
    }
  }

  render() {
    return (
        <React.Fragment>
            <Header as='h2' >Domain</Header>
            <Segment basic>
            </Segment>
            <style jsx>{`
            `}</style>
        </React.Fragment>
    )
  }
}

export default withRouter(Domain)