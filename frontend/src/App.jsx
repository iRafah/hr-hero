import { useState } from 'react'
import { GiRobotHelmet } from "react-icons/gi";
import { FaMagnifyingGlass } from "react-icons/fa6";

import './App.css'
import FormGroup from './components/FormGroup.jsx'
import FileUpload from './components/FileUpload.jsx'
import CVAnalysisResults from './components/CVAnalysisResults.jsx'

function App() {

  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState([]);


  // Dummy result for demonstration. In real application, this would come from backend after analysis.
  const result_json = {
    match_score: '90',
    missing_skills: ["Docker", "GraphQL"],
    reasoning:
      "Your CV matches most of the job requirements. However, experience with Docker and GraphQL would strengthen your profile even more.",
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here we send data to your FastAPI backend.

    alert('Form submitted! Check console for data.');
  };

  return (

    <main className="min-h-screen bg-">
      <header className="text-center p-10">
        <h1 className="text-4xl font-bold text-white-800 flex items-center justify-center gap-2">
          HR Hero <GiRobotHelmet /> |
        </h1>
        <p className="text-white-500 mt-2 ml-5">
          Your AI-powered assistant for CV analysis and job matching.
        </p>
      </header>

      <div className="flex items-center justify-center px-4 mt-15">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <form className="space-y-5">
            <div>
              {/* Job title */}
              <FormGroup>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job title
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  placeholder="e.g., Full-Stack Developer"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </FormGroup>
            </div>

            {/* File upload */}
            <FileUpload onFilesSelected={setFiles} />

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-medium py-2.5 rounded-lg hover:bg-green-700 transition cursor-pointer"
            >
              Analyse CV
              <FaMagnifyingGlass className="inline-block ml-2" />
            </button>
          </form>


          {!result_json ? (
            <div className="text-green-800 text-bold flex items-center mt-5">Analyzing CV... <div className="loading-spinner ml-2"></div></div>
          ) : result_json.match_score ? (
            <CVAnalysisResults result={result_json} />
          ) : (
            <div className="text-gray-500 italic">
              No results available yet.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default App
