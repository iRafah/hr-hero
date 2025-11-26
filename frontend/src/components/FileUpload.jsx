import { useEffect, useState } from "react";
import { AiOutlineCheckCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { MdClear } from "react-icons/md";

const FileUpload = ({ onFileSelect }) => {

    const [files, setFiles] = useState([]);

    const handDrop = (event) => {
        event.preventDefault();
        const droppedFiles = event.dataTransfer.files;

        if (droppedFiles && droppedFiles.length > 0) {
            const newFiles = Array.from(droppedFiles);
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        console.log(selectedFiles);
        if (selectedFiles && selectedFiles.length > 0) {
            const newFiles = Array.from(selectedFiles);
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    useEffect(() => {
        onFileSelect(files);
    }, [files, onFileSelect]);

    return (
        <section className="drag-drop">
            <div
                className={`document-uploader ${files.length > 0 ? "upload-box active" : "upload-box"}`}
                onDrop={handDrop}
                onDragOver={(event) => event.preventDefault()}
            >
                <>
                    <div className="upload-info">
                        <AiOutlineCloudUpload className="upload-icon" />
                        <div>
                            <p>Drag and drop your files here</p>
                            <p>
                                Supported files: .PDF and .DOCX
                            </p>
                        </div>

                        <input
                            type="file"
                            hidden
                            id="browse"
                            onChange={handleFileChange}
                            accept=".pdf, .docx"
                            multiple
                        />
                        <label htmlFor="browse" className="browse-btn cursor-pointer hover:transparent rounded-md flex justify-center items-center text-blue-400">Browse Files</label>
                    </div>
                </>

                {files.length > 0 && (
                    <div className="file-list">
                        <div className="file-list__container">
                            {files.map((file, index) => (
                                <div className="file-item flex items-center justify-left mt-2" key={index}>
                                    <div className="file-info">
                                        <p>{file.name}</p>
                                    </div>
                                    <div className="file-actions">
                                        <MdClear onClick={() => handleRemoveFile(index)} className="text-red-500 cursor-pointer text-lg" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {files.length > 0 && (
                <div className="upload-success flex items-center justify-left mt-2">
                    <p>{files.length} file(s) selected</p>
                    <AiOutlineCheckCircle className="success-icon text-green-600 ml-2" />
                </div>
            )}
        </section>
    );
};

export default FileUpload;