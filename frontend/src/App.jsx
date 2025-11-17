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
  const [resultJson, setResultJson] = useState(null);

  const isFormValid = () => {
    return jobTitle.trim() !== '' && jobDescription.trim() !== '' && files.length > 0;
  };

  const handleSubmit = async event => {

    if (!isFormValid()) {
      alert('Please fill in all required fields.');
      return;
    }

    let response;
    // Send the data to the API.
    try {
      setResultJson(null);
      setIsAnalysing(true);

      // slight delay to show analysing state
      await new Promise((r) => setTimeout(r, 5000));

      const formData = new FormData();
      formData.append('job_title', jobTitle);
      formData.append('job_description', jobDescription);
      files.forEach((file => formData.append('cv_files', file)));

      // const response = await api.post('/analyse-multiple-cvs', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      if (files.length > 1) {
        files.forEach((file => formData.append('cv_files', file)));

        response = await api.post('/analyse-multiple-cvs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      else {
        formData.append('cv_file', files[0]);

        response = await api.post('/analyse-single-cv', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      console.log('Status:', response.status);
      console.log('Response data:', response.data);
      setResultJson(response.data);

      // setTimeout(() => {
      //   setResultJson(response.data);
      //   //setIsAnalysing(false);
      // }, 3000); // simulate network delay

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

    // setIsAnalysing(true);
    // setResultJson(null);

    // const mockData = {
    //   match_score: 95,
    //   missing_skills: [],
    //   reasoning:
    //     "The candidate's CV fully aligns with the job description, demonstrating strong experience in all required areas.",
    // };

    // setTimeout(() => {
    //   setResultJson(mockData);
    //   setIsAnalysing(false);
    // }, 3000); // simulate network delay

    // return; // ⛔ prevent real API call

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
              className={`w-full text-white font-medium py-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-2 ${isAnalysing
                ? 'bg-green-400 cursor-not-allowed opacity-80'
                : 'bg-green-600 hover:bg-green-700'
                }`}
              disabled={isAnalysing}
            >
              {isAnalysing ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  Analyse CV
                  <FaMagnifyingGlass className="inline-block ml-1" />
                </>
              )}
            </button>
          </form>

          {!isAnalysing && (
            resultJson ? (
              resultJson.map((result, index) => (
                <CVAnalysisResults key={index} result={result} />
              ))
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
