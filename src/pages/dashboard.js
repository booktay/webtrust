import {Component} from 'react'
import 'semantic-ui-css/semantic.min.css'
import {
  Segment,
  Sidebar,
} from 'semantic-ui-react'
import Nav from "../layout/Navigator";
import Sidemenu from "../layout/Sidemenu";
import Dashboard from "../components/Dashboard";

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sidebarOpened: false
    }
    this.handleOpenSidebar = this.handleOpenSidebar.bind(this)
  }

  handleOpenSidebar() {
    this.setState(state => {
      state.sidebarOpened = !state.sidebarOpened
      console.log(state)
      return state
    })
  }

  render() {
    return (
      <div className="ui">
        < Nav onReqOpenSidebar={this.handleOpenSidebar} />
        <Sidebar.Pushable as={Segment} style={{backgroundColor:"#e4e5e6", borderRadius: 0, marginTop: "auto"}}>
          <Sidemenu sidebarOpened={this.state.sidebarOpened} />
          <Sidebar.Pusher>
            <Dashboard/>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}
