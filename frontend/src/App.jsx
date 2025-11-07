import React, { useState } from 'react'
import './App.css'
import api from './api.js'

import { GiRobotHelmet } from "react-icons/gi";
import { FaMagnifyingGlass } from "react-icons/fa6";

// Components
import FormGroup from './components/FormGroup.jsx'
import FileUpload from './components/FileUpload.jsx'
import CVAnalysisResults from './components/CVAnalysisResults.jsx'

function App() {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [isAnalysing, setIsAnalysing] = useState(false);

  // Dummy result for demonstration. In real application, this would come from backend after analysis.
  const [resultJson, setResultJson] = useState(null);

  const isFormValid = () => {
    return jobTitle.trim() !== '' && jobDescription.trim() !== '' && files.length > 0;
  };

  const handleSubmit = async event => {

    if (!isFormValid()) {
      alert('Please fill in all required fields.');
      return;
    }

    // Send the data to the API.
    try {
      setIsAnalysing(true);
      setResultJson(null);

      const formData = new FormData();
      formData.append('job_title', jobTitle);
      formData.append('job_description', jobDescription);
      formData.append('cv_file', files[0]);

      const response = await api.post('/analyse-cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Status:', response.status);
      console.log('Response data:', response.data);
      setResultJson(response.data);

    } catch (err) {
      if (err.response) {
        console.error('POST failed with status:', err.response.status, err.response.statusText);
      } else if (err.request) {
        console.error('Network error: no response from server');
      } else {
        console.error('Request setup error:', err.message);
      }
    }
    finally {
      setIsAnalysing(false);
    }

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
          <form className="space-y-5" action={handleSubmit}>
            <div>
              {/* Job title */}
              <FormGroup>
                <label className="block text-md font-medium text-gray-700 my-1" htmlFor="jobTitle" >
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
                <label className="block text-md font-medium text-gray-700 my-1" htmlFor="jobDescription">
                  Job description
                </label>
                <textarea
                  id="jobDescription"
                  placeholder="Paste the job description here"
                  rows="5"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </FormGroup>
            </div>

            {/* File upload */}
            <FileUpload onFileSelect={setFiles} />

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-medium py-2.5 rounded-lg hover:bg-green-700 transition cursor-pointer"
              disabled={isAnalysing}
            >
              Analyse CV
              <FaMagnifyingGlass className="inline-block ml-2" />
            </button>
          </form>

          {isAnalysing && (
            <div className="text-green-800 font-bold flex items-center mt-5 justify-center">
              Analyzing CV... <div className="loading-spinner ml-2"></div>
            </div>
          )}

          {!isAnalysing && (
            resultJson ? (
              <CVAnalysisResults result={resultJson} />
            ) : (
              <div className="text-gray-500 italic">No results available yet.</div>
            )
          )}
        </div>
      </div>
    </main>
  )
}

export default App
