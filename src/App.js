import React, { Component } from 'react';
import './App.css';
import UploadFile from "./components/UploadFile"

class App extends Component {
	// I keep the App as a component to easily implement new features in the future
	state = {

	}

  render() {
    return (
      <div className="App">
				<UploadFile
					toggleLoading={ this.toggleLoading }/>
      </div>
    );
  }
}

export default App;
