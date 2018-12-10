import {Component} from 'react'
import 'semantic-ui-css/semantic.min.css'
import {
  Segment,
  Sidebar,
} from 'semantic-ui-react'
import Nav from "../components/layout/navigator";
import Sidemenu from "../components/layout/sidemenu";
import Domain from '../components/domain';

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sidebarOpened: true
    }
    this.handleOpenSidebar = this.handleOpenSidebar.bind(this)
  }

  handleOpenSidebar() {
    this.setState(state => {
      state.sidebarOpened = !state.sidebarOpened
      return state
    })
  }

  render() {
    return (
        <React.Fragment>
            <Nav onReqOpenSidebar={this.handleOpenSidebar} />
            <Sidebar.Pushable as={Segment} id="sidebarhead">
                <Sidemenu sidebarOpened={this.state.sidebarOpened} />
                <Sidebar.Pusher id="sidebarcontent">
                    <Domain/>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </React.Fragment>
    )
  }
}
