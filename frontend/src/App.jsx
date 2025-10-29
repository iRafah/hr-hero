import { useState } from 'react'
import { UploadCloud, FileText } from 'lucide-react'

import './App.css'
import FormGroup from './components/FormGroup.jsx'

function App() {

  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here we send data to your FastAPI backend.

    alert('Form submitted! Check console for data.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            CV Analyst <FileText className="w-6 h-6 text-gray-600" />
          </h1>
          <p className="text-gray-500 mt-2">
            See how well your CV matches a job description — instantly.
          </p>
        </div>

        <form className="space-y-5">
          <div>
            {/* Job title */}
            <FormGroup>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Job title
              </label>
              <input
                type="text"
                id="jobTitle"
                placeholder="e.g., Full-Stack Developer"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </FormGroup>
          </div>

          {/* Job description */}
          <div>
            <FormGroup>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job description
              </label>
              <textarea
                placeholder="Paste the job description here"
                rows="5"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              ></textarea>
            </FormGroup>
          </div>

          {/* File upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-blue-400 transition m-5">
            <UploadCloud className="w-10 h-10 text-gray-400" />
            <p className="mt-2 text-gray-500">
              Drag & drop your CV (PDF) or{" "}
              <label
                htmlFor="file-upload"
                className="text-blue-600 font-medium cursor-pointer hover:underline"
              >
                browse files
              </label>
            </p>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            Analyse CV
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
