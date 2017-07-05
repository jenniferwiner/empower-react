import React, {Component} from 'react'
import { Cookies } from 'react-cookie'
import { API_URL } from '../config'
import { Row, Col, Button, FormGroup, FormControl, HelpBlock } from 'react-bootstrap'
import $ from 'jquery'

import Header from '../components/Header'
import '../assets/journals.css'

class Journal extends Component {
  constructor() {
    super()

    this.state = {user_id: '', journals: '', title: '', content: '', sentiment: ''}
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  componentWillMount() {
    let cookie = new Cookies()
    let user_id = cookie.get('id')

    fetch(`${API_URL}/v1/journals/user/${user_id}`, {
      method: 'GET',
      headers: {
        'Authorization': cookie.get('token')
      }
    })
    .then(res => {
      return res.json().then((journals) => {
        if (journals) {
          let journalsList = journals.map((entry) => {
            let date = entry.created_at.substring(5, 10) + '-' + entry.created_at.substring(0, 4)
            return (<div key={entry.id} className="entry_div"><h2>{entry.title}</h2><h4 className="text-right">{date}</h4><p>{entry.content}</p><p className="sentiment-p">Sentiment: <i className={entry.sentiment}></i></p></div>)
          })
          this.setState({journals: journalsList, user_id: user_id})
        }
      })
    })
  }

  handleTitleChange(e) {
    this.setState({ title: e.target.value})
  }

  handleContentChange(e) {
    this.setState({ content: e.target.value})
  }

  handleSave(e) {
    e.preventDefault()
    let content = this.state.content
    $.ajax ({
      url: 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment/',
      beforeSend: function(xhrObj) {
        xhrObj.setRequestHeader("Content-Type", "application/json");
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "644e5ed6f0a9434882158e6b91c70012");
        xhrObj.setRequestHeader("Accept", "application/json");
      },
      type: 'POST',
      data: `{
        'documents': [{
              'language': 'en',
              'id': '1',
              'text': "${content}"
            }
          ]
        }`
      })
      .done((dataSentiment) => {
        if (dataSentiment.documents[0].score < .33) {
          this.setState({sentiment: 'fa fa-frown-o sentiment-icon'})
        } else if (dataSentiment.documents[0].score < .66) {
          this.setState({sentiment: 'fa fa-meh-o sentiment-icon'})
        } else {
          this.setState({sentiment: 'fa fa-smile-o sentiment-icon'})
        }
      })
      .fail(err => {
        console.log(err)
      }).then(() => {
        let cookie = new Cookies()
        fetch(`${API_URL}/v1/journals/`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': cookie.get('token')
          },
          body: JSON.stringify({
            user_id: this.state.user_id,
            title: this.state.title,
            content: this.state.content,
            sentiment: this.state.sentiment
          })
        }).then((res) => {
          return res.json().then((res) => {
            let journals = this.state.journals
            let date = res.created_at.substring(5, 10) + '-' + res.created_at.substring(0, 4)
            journals.unshift(<div key={res.id} className="entry_div"><h2>{res.title}</h2><h4 className="text-right">{date}</h4><p> {res.content}</p><p className="sentiment-p">Sentiment: <i className={res.sentiment}></i></p></div>)
            this.setState({journals: journals, title: '', content: ''})
          })
        })
      })

  }

  render() {
    return (
      <div>
      <Header />
      <Row className="row_height">
      <Col sm={6} className="form_side">
      <h3>today's entry</h3>
      <form onSubmit={this.handleSave}>
        <FieldGroup
          id="formControlsEmail"
          type="text"
          placeholder="Title"
          onChange = {this.handleTitleChange}
          required={true}
          value={this.state.title ? this.state.title : ''}
        />
        <FormGroup controlId="formControlsTextarea">
          <FormControl
           componentClass="textarea"
           placeholder="Write your thoughts..."
           onChange = {this.handleContentChange}
           required={true}
           value={this.state.content ? this.state.content : ''}
          />
        </FormGroup>
        <div className="text-center">
        <Button type="submit" >
          Save
        </Button>
        </div>
      </form>
      </Col>

      <Col sm={6} className="entries_side">
        <div className="text-center">
          <h1>Your Journal</h1>
        </div>
        <p className="text-center description">Just the act of recording your thoughts reduces anxiety.<br/><span>why not give it a try?</span></p>
        <div className="outer_journal_div">{this.state.journals}</div>
      </Col>
      </Row>
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

export default Journal
