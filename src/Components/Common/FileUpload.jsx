import React from 'react';
import axios from 'axios';

class ReactUploadImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  onFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file_name', this.state.file);
    console.log(this.state.file);
    // const config = {
    //   headers: {
    //     'content-type': 'multipart/form-data'
    //   }
    // };
    // axios
    //   .post('http://localhost:3000/file/upload', formData, config)
    //   .then(response => {
    //     console.log(response);
    //   })
    //   .catch(error => console.log('error : ', error));
  }
  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit} style={{ color: '#fff' }}>
        <h1>File Upload</h1>
        <input type="file" name="file_name" onChange={this.onChange} />
        <button type="submit">Upload</button>
      </form>
    );
  }
}

export default ReactUploadImage;
