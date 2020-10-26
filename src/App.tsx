import { Component } from  'react';
import './App.css';
import React from 'react';
import axios from 'axios';
import { Item }  from './models/item';

import { Button, Spinner, Table } from 'react-bootstrap';

declare global {
  interface Window {
    File:any;
    FileReader: any;
    FileList: any
  }
}
interface Props {
}

interface State {
  input: string;
  content: Item [];
  loading: boolean;
  error: string;
}
class  App extends Component<Props, State> {
  
  constructor(props: Props) {
    super(props);
    this.state = {input: "", content: [], loading:  false, error: "" };
  }

  handleChange = (event:React.ChangeEvent<HTMLTextAreaElement> ) => {
    this.setState({
      input: event.target.value
    });
  }

  sendData = (event: React.MouseEvent<HTMLElement>) => {
    const { input } = this.state;
    const content = input.trim().split("\n");
    const self = this;
    let records = [];
    let idArray : number[] = [];
    for(let index in content) {
      let item = JSON.parse(content[index]);
      // Handling duplicates records from front end
      if(!idArray.includes(item.id)){ 
        records.push(item);
        idArray.push(item.id);
      }  
    }
    
    self.setState({
      loading: true,
      content: [],
      error: ""
    });
    // Sending post request to our nodejs server to filter and retrieve data
    if(records.length > 0) {
      axios.post('http://localhost:9000/users/userData', records )
      .then((response) => {
        let data = response.data;
        self.setState({
          content: data,
          loading: false,
          error: ""
        });
      })
      .catch( (error: Error) => {
        self.setState({
          error: error.message
        });
        console.log(error);
      });
    }
    
  };

  // Select file and paste content into textarea
  selectFile = () => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      const file  = ((document.querySelector('input[type=file]') as HTMLInputElement).files as FileList);
      const newFile  = file[0] as File;
      const self = this;
      const reader = new FileReader()
      const textFile = /text.*/;
      if (newFile.type.match(textFile)) {
        reader.onload = (event: any) => {
          self.setState({
            input: event.target.result
          });    
        }
      } else {
        self.setState({
          error : "Not a file"
        });
        //alert('Not a file');
      }
      reader.readAsText(newFile);

    } else {
        this.setState({
          error : "Your browser is too old to support HTML5 File API"
        });
    }
  }

  render() {
    const { input , content, loading, error } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1> Copy Text or Select a file</h1>
          { error? <p className="error">Error</p> : null }
          { loading ?
          <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
          </Spinner> :  null }

          <input type="file" onChange={this.selectFile} />
          <textarea  cols = {50} rows={10} value={input} onChange={this.handleChange} >
          {this.state.input}</textarea>
          <Button
            variant="primary"
            onClick={this.sendData}>Filter</Button>
          { content.length > 0 ? 
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Id</th>
                <th>CustomerId</th>
                <th>Accepted</th>
              </tr>
            </thead>
            <tbody>
            {content.map((value, index) => {
                return (
                  <tr key={value.id}>
                    <td>{value.id}</td>
                    <td>{value.customer_id}</td>
                    <td>{value.accepted ? "Accepted": "Rejected"}</td>
                  </tr>
                );
               })}
            </tbody>
          </Table> : null }  
            
        </header>
      </div>
    );
  }
  
}

export default App;
