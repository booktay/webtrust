import {Component} from 'react'
import {
  withRouter
} from "next/router";
import ApiIndex from '../api';

class API extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {
            router
        } = this.props
        if (router.query.type === "score") {
          return (
              <ApiIndex/>
          )
        }
        return (
          <div>API</div>
        )
    }
}

export default withRouter(API)