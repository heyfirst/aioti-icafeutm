import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <nav className="navbar navbar-light bg-faded">
          <a className="navbar-brand" href="#">iCafe @ UTM</a>
        </nav>
        <h1 className="text-center">Kitchen Dashboard</h1>
        <div className="container">
          <div className="row">
            <div className="col-4">
              <div className="card">
                <ul className="list-group list-group-flush">
                  <a href="#" className="list-group-item">Cras justo odio</a>
                  <a href="#" className="list-group-item">Dapibus ac facilisis in</a>
                  <a href="#" className="list-group-item">Vestibulum at eros</a>
                </ul>
              </div>
            </div>
            <div className="col-8">
              <div className="card">
                <div className="card-block text-left">
                  <h4 className="card-title">Table 1</h4>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias consequuntur consequatur totam.</p>
                </div>
                <ul className="list-group list-group-flush">
                  <li href="#" className="list-group-item">Cras justo odio</li>
                  <li href="#" className="list-group-item">Dapibus ac facilisis in</li>
                  <li href="#" className="list-group-item">Vestibulum at eros</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
