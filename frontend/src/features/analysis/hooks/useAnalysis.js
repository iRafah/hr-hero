import { useState } from "react";
import { analyseSingleCV, analyseMultipleCVs } from "../../../services/analysisApi";

export function useAnalysis() {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    async function runAnalysis({ jobTitle, jobDescription, files }) {
        setResults(null);
        setError(null);
        setIsLoading(true);

        const formData = new FormData();
        formData.append("job_title", jobTitle);
        formData.append("job_description", jobDescription);

        try {
            let data;
            if (files.length > 1) {
                files.forEach((file) => formData.append("cv_files", file));
                data = await analyseMultipleCVs(formData);
            } else {
                formData.append("cv_file", files[0]);
                data = await analyseSingleCV(formData);
            }
            setResults(data);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                "Analysis failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, results, error, runAnalysis };
}
