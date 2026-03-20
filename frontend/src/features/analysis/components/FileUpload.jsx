import { useEffect, useState } from "react";
import { Upload, X, CheckCircle } from "lucide-react";

export function FileUpload({ onFileSelect }) {
    const [files, setFiles] = useState([]);

    const handleDrop = (e) => {
        e.preventDefault();
        const dropped = Array.from(e.dataTransfer.files);
        if (dropped.length) setFiles((prev) => [...prev, ...dropped]);
    };

    const handleChange = (e) => {
        const selected = Array.from(e.target.files);
        if (selected.length) setFiles((prev) => [...prev, ...selected]);
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        onFileSelect(files);
    }, [files, onFileSelect]);

    return (
        <div className="space-y-2">
            <div
                className="border-2 border-dashed border-slate-600 hover:border-blue-500 bg-slate-800/50 rounded-xl p-6 flex flex-col items-center gap-3 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <Upload size={24} className="text-slate-400" />
                <div className="text-center">
                    <p className="text-slate-300 text-sm">Drag & drop your CVs here</p>
                    <p className="text-slate-500 text-xs mt-0.5">Supported: .PDF and .DOCX</p>
                </div>
                <label
                    htmlFor="cv-browse"
                    className="text-blue-400 text-sm cursor-pointer hover:text-blue-300 transition-colors font-medium"
                >
                    Browse Files
                </label>
                <input
                    id="cv-browse"
                    type="file"
                    hidden
                    accept=".pdf,.docx"
                    multiple
                    onChange={handleChange}
                />
            </div>

            {files.length > 0 && (
                <div className="space-y-1.5">
                    {files.map((file, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2"
                        >
                            <span className="text-slate-300 text-sm truncate">{file.name}</span>
                            <button
                                type="button"
                                onClick={() => removeFile(i)}
                                className="text-slate-500 hover:text-red-400 ml-2 flex-shrink-0 transition-colors"
                            >
                                <X size={15} />
                            </button>
                        </div>
                    ))}
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                        <CheckCircle size={13} className="text-green-400" />
                        {files.length} file(s) selected
                    </p>
                </div>
            )}
        </div>
    );
}

export default FileUpload;
