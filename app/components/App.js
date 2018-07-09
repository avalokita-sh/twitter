import React, { Component } from 'react';
import '../public/App.css';
import TweetList from './TweetList';

class App extends Component {
  render() {
    return (
      <div className="App">        
        <TweetList/>
      </div>
    );
  }
}

export default App;