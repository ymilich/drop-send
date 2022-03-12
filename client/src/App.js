import logo from './logo.svg';
import './App.css';
import FileUploadPage from './upload/FileUpload';
import FileDownloadPage from './download/FileDownload';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <FileUploadPage></FileUploadPage>
        <FileDownloadPage></FileDownloadPage>
      </header>
      
    </div>
  );
}

export default App;