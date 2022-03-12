import React, {useState} from 'react';

function FileUploadPage(){
	const [selectedFile, setSelectedFile] = useState();
	const [isSelected, setIsSelected] = useState(false);
	const [isUploaded, setIsUploaded] = useState(false);
    const [key, setKey] = useState(false);

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsSelected(true);
	};

	const handleSubmission = () => {
        const formData = new FormData();

		formData.append('File', selectedFile);

		fetch('http://localhost:8468/upload',
            {
                method: 'POST',
                body: formData,
            })
        .then((response) => response.json())
        .then((result) => {
            setKey(result[0].key)
            setIsSelected(false)
            setSelectedFile(null)
            setIsUploaded(true)
            console.log('Success:', result);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

	return(
        <div>
            {!isUploaded ? (
            <div>
                <input type="file" name="file" onChange={changeHandler} />
                {isSelected ? (
                    <div>
                        <p>Filename: {selectedFile.name}</p>
                        <p>Filetype: {selectedFile.type}</p>
                        <p>Size in bytes: {selectedFile.size}</p>
                        <p>
                            lastModifiedDate:{' '}
                            {selectedFile.lastModifiedDate.toLocaleDateString()}
                        </p>
                    </div>
                ) : (
                    <p>Select a file to show details</p>
                )}
                <div>
                    <button onClick={handleSubmission}>Upload File</button>
                </div>
            </div>) : (
                <p>File Uploaded! Send this key to your friend: {key}</p>
            )}
        </div>
	)
}

export default FileUploadPage;