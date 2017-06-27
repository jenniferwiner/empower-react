import React, {Component} from 'react'
import { Cookies } from 'react-cookie'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import Header from './Header'
import '../assets/homeUser.css'

class HomeUser extends Component {
  constructor() {
    super()
    this.state = {
      alt_ideas: '',
      name: ''
    }
  }

  componentWillMount() {
    let cookie = new Cookies()
    let user_id = cookie.get('id')

    fetch(`http://localhost:3000/v1/users/${user_id}`)
    .then(res => {
      return res.json().then((user) => {
        let alt_ideas = user.alternatives.map((alt) => {
          return (<li key={alt.id} className="alt-list-text text-center">{alt.text}</li>)
        })
        this.setState({alt_ideas: alt_ideas, name: user.first_name})
      })
    })
    }

  render() {
    return (
      <div>
      <Header />
        <div className="container">
          <div className="jumbotron alternatives">
            <ul>
              {this.state.alt_ideas}
            </ul>
            <Button>Add New</Button>
          </div>
        </div>
        <Link to="/survey" className="text-center"><Button>Take a Survey</Button></Link>
      </div>
    )
  }
}

export default HomeUser
