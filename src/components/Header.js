import React, {Component} from 'react'
import { Cookies } from 'react-cookie'
import { Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { API_URL } from '../config'
import '../assets/homeUser.css'
import Sun from '../assets/images/sun.svg'
import Man from '../assets/images/user.svg'
import Circle from '../assets/images/x-circle.svg'

class Header extends Component {
  constructor () {
    super()
    this.state = {name: ''}

    this.logout = this.logout.bind(this)

  }

  componentWillMount() {
    let cookies = new Cookies()
    let id = cookies.get('id')
    let userStatus = +cookies.get('isUser') ? 'users' : 'clinicians'
    fetch(`${API_URL}/v1/${userStatus}/${id}`)
    .then(res => {
      return res.json().then((user) => {
        let full_name = `${user.first_name} ${user.last_name}`
        this.setState({name: full_name})
      })
    })
  }

  logout() {
    let cookies = new Cookies()
    cookies.remove('isLoggedIn')
    cookies.remove('id')
    cookies.remove('isUser')
    cookies.remove('name')
  }

  render() {
    return (
      <div>
        <div className="well well-large welcome text-center">
        <Row className="welcome-row">
          <Col sm={7}>
            <h2>Emp <img className="text-center welcome-sun" src={ Sun } alt="empowerU"/> wer</h2>
          </Col>
          <Col sm={4}>
            <p className="welcome_name"><img className="text-center welcome-user" src={ Man } alt="man logo"/>&nbsp;{this.state.name}&nbsp;&nbsp;&nbsp;&nbsp;<Link to="/" onClick={this.logout}><img className="text-center welcome-user" src={ Circle } alt="logout logo"/>&nbsp;Logout</Link></p>
          </Col>
        </Row>
        </div>
      </div>
    )
  }
}

export default Header
