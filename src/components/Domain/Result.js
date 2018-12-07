import React, { Component } from 'react'
import {
  Header, Form, Statistic, Breadcrumb, Segment, Grid, Table, Dimmer, Loader, Image,
} from 'semantic-ui-react'
import {
  Sector,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
}
from 'recharts';
import {withRouter} from "next/router";
import {Router} from "../../routes";
import stateOptions from "./domain.json";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const headerRow = ['Protocol', 'Yes', 'No']

const renderBodyRow = ({ name, yes, no }, i) => ({
  key: name || `row-${i}`,
  cells: [
    name ? {
      key: 'name',
      content :name,
    } : 'Other',
    yes ? {
      key: 'yes',
      icon: 'checkmark',
      content: yes
    } : 'Unknown',
    no ? {
      key: 'no',
      icon: 'close',
      content: no,
    } : 'None'
  ],
})

const headerRowWeb = ["url", "Certhave", "Certvalid", "Status", "Expired"]

const renderBodyRowWeb = ({ url, certhave, certvalid, status, expired }, i) => ({
  key: url || `row-${i}`,
  cells: [
    url ? {
      key: 'url',
      content: url,
    } : 'Other',
    certhave ? {
      key: 'certhave',
      content: certhave
    } : 'Unknown',
    certvalid ? {
      key: 'certvalid',
      content: certvalid,
    }: 'Unknown',
    status ? {
      key: 'status',
      content: status,
    } : 'Inactive',
    expired ? {
      key: 'expired',
      content: expired,
    } : '000000'
  ],
})

const headerRowValid = ["Certification", "Number"]

const renderBodyRowValid = ({ name, number }, i) => ({
  key: name || `row-${i}`,
  cells: [
    name ? {
      key: 'name',
      content: name,
    } : 'Other',
    number ? {
      key: 'number',
      content: number
    } : 'Unknown'
  ],
})
class Result extends Component {
  constructor(props) {
    super(props)
    this.state = {
        data: {},
        loaded: false,
        activeIndex: 0,
        domain:'',
        subdomain:''
    }
    this.onPieEnter = this.onPieEnter.bind(this)
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    const {domain, subdomain} = this.state
    if (domain !== "" && subdomain !== ""){
      Router.pushRoute(`/domain/${domain}/${subdomain}`)
    }
    else {
      alert("Please choose Domain and Subdomain!!!")
    }
  }

  componentDidMount() {
    const {router} = this.props
    return fetch('/api/score/' + router.query.domain + "/" + router.query.subdomain)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        data: responseJson
        })
      this.setState({loaded: true});
    })
  }

  onPieEnter(data, index) {
    this.setState({
      activeIndex: index,
    });
  }

  render() {
    const {router} = this.props
    const {grade,certhave,certvalid,protocol,webscore} = this.state.data

    const header_url = router.query.subdomain + "." + router.query.domain

    if (this.state.loaded == false) {
      return (
        <Segment>
          <Dimmer active inverted inline='centered' size='massive'>
            <Loader inverted>Loading</Loader>
          </Dimmer>
          <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
        </Segment>  
      )
    }
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
        <Grid style={{margin:"1em"}}>
          <Grid.Row columns="equal">
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
              <Segment.Group horizontal style={{height:"170.64px",margin:"auto", marginLeft:"1em"}}>
                <Segment inverted color="red" style={{paddingTop:"2em", maxWidth:"fit-content"}}>
                  < Statistic size='huge' inverted color="black" >
                    <Statistic.Label>Grade</Statistic.Label>
                    <Statistic.Value>{grade}</Statistic.Value>
                  </Statistic>
                </Segment>
                <Segment style={{paddingTop:"2em", paddingLeft:"4em"}}>
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
          <Segment>
            <Header as="h2">
              Certification Detail
            </Header>
          </Segment>
          < Grid.Row columns = "equal" >
            <Grid.Column width={8} style={{minWidth: "688.6px"}}>
              <Segment>
                <Header as="h2">
                  Have Certifacation
                </Header>
              </Segment>
              <Table celled padded>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell singleLine>Certification</Table.HeaderCell>
                    <Table.HeaderCell>Number</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <Header as='h5'>
                        Found
                      </Header>
                    </Table.Cell>
                    <Table.Cell singleLine>{certhave[0].value}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <Header as='h5'>
                        NotFound
                      </Header>
                    </Table.Cell>
                    <Table.Cell singleLine>{certhave[1].value}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              <Table celled selectable size="large" headerRow={headerRowValid} tableData={certvalid} renderBodyRow={renderBodyRowValid} />
            </Grid.Column>
            <Grid.Column width={8}>
              <Segment>
                <Header as="h2">
                  Valid/Invalid Certifacation
                </Header>
              </Segment>
              <Segment>
                <BarChart width={640} height={450} data={certvalid}
                        margin={{top: 15, right: 30, left: 20, bottom: 5}}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <Tooltip/>
                  <Legend />
                  {/* <Bar dataKey="no" fill="#8804d8" minPointSize={5}/> */}
                  <Bar dataKey="number" fill="#82ca9d" minPointSize={10}/>
                </BarChart>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Segment>
            <Header as="h2">
              TLS/SSL Protocol Detail
            </Header>
          </Segment>
          < Grid.Row columns = "equal" >
            <Grid.Column width={8} style={{minWidth: "688.6px"}}>
              <Segment>
                <BarChart width={640} height={480} data={protocol}
                    margin={{top: 15, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Legend />
                <Bar dataKey="no" fill="#8804d8" minPointSize={5}/>
                <Bar dataKey="yes" fill="#82ca9d" minPointSize={10}/>
                </BarChart>
              </Segment>
            </Grid.Column>
            <Grid.Column style={{marginLeft:"-1em"}}>
              <Table celled selectable size="large" headerRow={headerRow} tableData={protocol} renderBodyRow={renderBodyRow} />
            </Grid.Column>
          </Grid.Row>
          <Segment>
            <Header as="h2">
              Web Score
            </Header>
          </Segment>
          < Grid.Row columns = "equal" >
            <Grid.Column>
              <Table celled selectable size="large" headerRow={headerRowWeb} tableData={webscore} renderBodyRow={renderBodyRowWeb} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default withRouter(Result)