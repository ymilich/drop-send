import React, {useState} from 'react';
import fileDownload from 'js-file-download'

function FileDownloadPage(){
    const [fileId, setFileId] = useState("");
    const [isFilled, setIsFilled] = useState(false);
    const [fileName, setFileName] = useState('');

	const changeHandler = (e) => {
        setFileId(e.target.value)
        setIsFilled(true)
    };

	const handleSubmission = () => {
        if (fileId != ""){
            fetch(
                `http://localhost:8468/getFile?fileId=${fileId}`,
                {
                    method: "GET"
                })
            .then((response) => {
                for (var pair of response.headers.entries()) {
                    console.log(pair[0]+ ': '+ pair[1]);
                    if (pair[0] == 'filename'){
                        console.log(pair[1])
                        setFileName(pair[1])
                    }
                 }
                return response.blob()
            })
            .then((blob) => {
                console.log(blob)
                fileDownload(blob, fileName)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    };

	return(
        <div>
			<input type="text" value={fileId} onChange={changeHandler} />
			<div>
            {isFilled ? (
				<button onClick={handleSubmission}>Get File</button>
                ):(
                    <div></div>
                )
            }
			</div>
		</div>
	)
}

export default FileDownloadPage;