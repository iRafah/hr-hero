import { useState } from 'react'

import './App.css'
import FormGroup from './components/FormGroup.jsx'

function App() {

  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [cvFile, setCvFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here we send data to your FastAPI backend.

    alert('Form submitted! Check console for data.');
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup label="Job title">
        <input
          type="text"
          id="jobTitle"
          placeholder="e.g., Senior Sofware Engineer"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Job description">
        <textarea
          id="jobDescription"
          placeholder="Enter the job description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        >

        </textarea>
      </FormGroup>

      <button
        type="submit"
        className="analyze-button"
        disabled={!jobTitle || !jobDescription || !cvFile}
      >

        Analyse CV
      </button>
    </form>
  )
}

export default App
