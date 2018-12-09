import React, {
    Component
} from 'react'
import {
    withRouter
} from "next/router";

class api extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const {router} = this.props
        return fetch('localhost:9200/' + router.query.domain + "/" + router.query.subdomain)
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson)
        }
  }

    getPost(search) {
        pass
    }

    render() {
        const {
            router
        } = this.props

        // const data = {
        //     type:router.query.type,
        //     arg1:router.query.arg1,
        //     arg2:router.query.arg2,
        // }

        return (
            <div>
                {router.query.type}
            </div>
        )
    }
}

export default withRouter(api)