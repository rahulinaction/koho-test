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
interface MyEditorProps {
}

interface MyState {
  input: string;
  content: Item [];
  loading: boolean;
}
class  App extends Component<MyEditorProps, MyState> {
  
  constructor(props: MyEditorProps) {
    super(props);
    this.state = {input: "", content: [], loading:  false };
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
    let output = [];
    let idArray : number[] = [];
    for(let index in content) {
      let item = JSON.parse(content[index]);
      // Handling duplicates records from front end
      if(!idArray.includes(item.id)){ 
        output.push(item);
        idArray.push(item.id);
      }  
    }
    
    self.setState({
      loading: true,
      content: []
    });
    axios.post('http://localhost:9000/users/userData', output )
    .then((response) => {
      let data = response.data;
      self.setState({
        content: data,
        loading: false
      });
    })
    .catch( (error: Error) => {
      console.log(error);
    });
  };

  selectFile = () => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      const file  = ((document.querySelector('input[type=file]') as HTMLInputElement).files as FileList);
      const newFile  = file[0] as File;
      const self = this;
      const reader = new FileReader()
      const textFile = /text.*/;
      if (newFile.type.match(textFile)) {
        reader.onload = (event: any) => {
          console.log('Event target ',event.target.result);
          self.setState({
            input: event.target.result
          });    
        }
      } else {
        alert('Not a file');
      }
      reader.readAsText(newFile);

    } else {
        alert("Your browser is too old to support HTML5 File API");
    }
  }

  render() {
    const { input , content, loading } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1> Copy Text or Select a file</h1>
          { loading ?
          <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
          </Spinner> :  null }

          <input type="file" onChange={this.selectFile} />
          <textarea  cols = {50} rows={10} value={input} onChange={this.handleChange} >
          {this.state.input}</textarea>
          <Button
            variant="primary"
            onClick={this.sendData}> Send Data</Button>
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
