import React, {useState} from 'react';

function FileDownloadPage(){
    const [fileId, setFileId] = useState("");
    const [isFilled, setIsFilled] = useState(false)

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
            .then((response) => response.blob())
            .then((blob) => {
                console.log(blob)
                const url = window.URL.createObjectURL(
                    new Blob([blob]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    `filename`,
                );
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
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