import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'

import Landing from './scenes/Landing'
import Home from './scenes/Home'
import Survey from './scenes/Survey'
import Mindfulness from './scenes/Mindfulness'
import Journal from './scenes/Journal'
import About from './scenes/About'

import registerServiceWorker from './registerServiceWorker'
import './assets/general.css'

ReactDOM.render(
  <BrowserRouter>
    <div className="App">
      <Route exact path="/" component={ About }></Route>
      <Route exact path="/home" component={ Home }></Route>
      <Route exact path="/survey" component={ Survey }></Route>
      <Route exact path="/signup" component={ About }></Route>
      <Route path="/graph" component={ Home }></Route>
      <Route exact path="/mindfulness" component={ Mindfulness }></Route>
      <Route exact path="/journal" component={ Journal }></Route>
    </div>
  </BrowserRouter>,
  document.getElementById('root')
)
registerServiceWorker()
