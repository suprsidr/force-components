import React, {Component} from 'react';
import jetpack from 'fs-jetpack';
import path from 'path';

class FileBrowser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      directories: [],
      files: [],
      currentDirectory: ''
    };
    this.basePath = path.resolve('C:/xampp/htdocs/StaticCMSContent-dev/ForceRc/snippets/');
  }
  updateState(obj, cb) {
    this.setState(obj, () => {
      cb && cb();
      console.log(this.state);
    });
  }
  componentDidMount() {
    let obj = jetpack.inspectTree(this.basePath, {relativePath: true});
    if(obj.children && obj.children.length > 0) {
      let dirs = this.getChildren(obj);
      this.updateState({directories: dirs});
    }
  }
  getDirectoryOptions(obj, key) {
    if(obj.children.length > 0) {
      return React.createElement('optgroup', {label: obj.name, key: key}, obj.children.reduce((prev, next, e) => {
        prev.push(this.getDirectoryOptions(next, `${key}_${e}`));
        return prev;
      }, []))
    } else {
      return React.createElement('option', {key: key, value: obj.relativePath}, obj.name);
    }
  }
  directoryOnChange(e) {
    this.updateState({
      files: jetpack.list(path.join(this.basePath, e.target.value)),
      currentDirectory: e.target.value
    });
  }
  fileOnChange(e) {
    this.loadFile(e.target.value);
  }
  loadFile(file) {
    var code = jetpack.read(path.join(this.basePath, this.state.currentDirectory, file), 'utf8');
    this.props.updateTextArea(code);
  }
  getChildren(o) {
    return o.children.reduce((prev, next) => {
      if(next.type === 'file') {
        return prev;
      }
      prev.push({
        name: next.name,
        relativePath: next.relativePath,
        children: this.getChildren(next)
      });
      return prev;
    }, [])
  }
  render() {
    return (
      <div className="row">
        <div className="small-6 columns">
          <select rel="dir" onChange={(e) => this.directoryOnChange(e)}>
            <option key="a">Select Directory</option>
            {this.state.directories.map((dir, i) => this.getDirectoryOptions(dir, i))}
          </select>
        </div>
        <div className="small-6 columns">
          <select onChange={(e) => this.fileOnChange(e)}>
            <option key="b">Select File</option>
            {this.state.files.map((file, i) => <option key={i} value={file}>{file}</option>)}
          </select>
        </div>
      </div>
    )
  }
}

export default FileBrowser;
