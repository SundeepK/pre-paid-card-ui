import React, { Component } from 'react';
import './App.css';
import './lib/SearchTransactionsForm'
import SearchTransactionsForm from "./lib/SearchTransactionsForm";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Pre paid card transactions</h1>
        </header>

          <SearchTransactionsForm/>

       </div>
    );
  }
}

export default App;
