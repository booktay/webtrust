import {Component} from 'react'
import 'semantic-ui-css/semantic.min.css'
import {
  Segment,
  Sidebar,
} from 'semantic-ui-react'
import Nav from "../components/layout/navigator";
import Sidemenu from "../components/layout/sidemenu";
import Web from '../components/web';

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
    var sidebarcontent = 'menushow'
    if (!this.state.sidebarOpened) {
      sidebarcontent = 'menuhide'
    }

    return (
        <React.Fragment>
            <Nav onReqOpenSidebar={this.handleOpenSidebar} />
            <Sidebar.Pushable as={Segment} id="sidebarhead">
                <Sidemenu sidebarOpened={this.state.sidebarOpened} />
                <Sidebar.Pusher className={sidebarcontent}>
                    <Web/>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </React.Fragment>
    )
  }
}
