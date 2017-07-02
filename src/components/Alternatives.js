import React, { Component } from 'react'
import
  { FormGroup,
    FormControl,
    HelpBlock,
    Button
  } from 'react-bootstrap'

import { Cookies } from 'react-cookie'
import { API_URL } from '../config'

import Plus from '../assets/images/plus.svg'

class Alternatives extends Component {
  constructor() {
    super()

    this.state = {
      text: '',
      alt_ideas: [],
      name: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.deleteAlternative = this.deleteAlternative.bind(this)
  }

  componentWillMount() {
    let cookie = new Cookies()
    let user_id = cookie.get('id')

    fetch(`${API_URL}/v1/users/${user_id}`)
    .then(res => {
      return res.json().then((user) => {
        if (user.alternatives) {
          let alt_ideas = user.alternatives.map((alt) => {
            return (<p key={alt.id} id={alt.id} onClick={this.deleteAlternative} className="alt-list-text text-center">{alt.text}</p>)
          })
          this.setState({alt_ideas: alt_ideas, name: user.first_name})
        }
      })
    })
    }

  handleChange(e) {
    this.setState({ text: e.target.value})
  }

  handleClick(e) {
    let cookies = new Cookies()
    let user_id = cookies.get('id')
    e.preventDefault()
    fetch(`${API_URL}/v1/alternatives`, {
      method: 'POST',
      body: JSON.stringify({ text: this.state.text, user_id: user_id}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json().then((res) => {
        let alts = this.state.alt_ideas
        let newAlt = (<p key={res.id} id={res.id} onClick={this.deleteAlternative} className="alt-list-text text-center">{res.text}</p>)
        alts.push(newAlt)
        this.setState({alt_ideas: alts})
      })
    })
    this.setState({text: ''})
  }

  deleteAlternative(e) {
    fetch(`${API_URL}/v1/alternatives/${e.target.id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.text()
    }).then((res) => {
      let alt_ideas = this.state.alt_ideas
      let id = alt_ideas.indexOf(e.target)
      alt_ideas.splice(id, 1)
      this.setState(alt_ideas: alt_ideas)
    })
  }

  render() {
    return (
        <div className="alternatives text-center">
            <h1>ALTERNATIVES</h1>
            <div>
              {this.state.alt_ideas}
            </div>
            <form onSubmit={this.handleClick}>
              <FormGroup className="alt-form">
                <FieldGroup
                  id="formControlsAlt"
                  type="text"
                  placeholder="Enter an Alternative"
                  onChange = {this.handleChange}
                  required={true}
                  value ={this.state.text}
                />
              </FormGroup>
              <Button type="submit"><img src={Plus} alt="add-new-alternative"/></Button>
            </form>
        </div>
    )
  }
}

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  )
}

export default Alternatives
