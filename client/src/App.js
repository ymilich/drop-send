import logo from './logo.svg';
import './App.css';
import FileUploadPage from './upload/FileUpload';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <FileUploadPage></FileUploadPage>
      </header>
      
    </div>
  );
}

export default App;