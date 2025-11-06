import React from "react";
import { GiBrain } from "react-icons/gi";
import { FaCheckSquare } from "react-icons/fa";
import { ImPushpin } from "react-icons/im";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdAnalytics } from "react-icons/md";


const CVAnalysisResults = ({ result }) => {
    return (
        <div className="w-full mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
            {/* Header */}
            <h2 className="text-2xl font-semibold flex items-center gap-2" style={{ color: '#0d5e7a' }}>
                <MdAnalytics /> CV Analysis Results
            </h2>
            {/* Divider */}
            <hr className="my-4 border-gray-200" />

            {/* Match Score */}
            <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-600 flex items-center"><FaMagnifyingGlass className="mr-2" /> Match Score</h3>
                <p
                    className={`text-3xl font-bold ${result.match_score >= 70 ? "text-green-500" : "text-red-500"}`}>
                    {result.match_score}%
                </p>
            </div>

            {/* Missing Skills */}
            <h3 className="text-xl font-semibold mt-6 text-gray-600 flex items-center"><ImPushpin className="mr-2" /> Missing Skills</h3>

            {result.missing_skills && result.missing_skills.length > 0 ? (
                <ul className="list-disc pl-5 mt-2 space-y-2">
                    {result.missing_skills.map((skill, index) => (
                        <li key={index} className="text-red-600 font-medium">
                            <span className="font-semibold">{skill}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="mt-4 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg flex items-center">
                    <FaCheckSquare className="mr-2" /> Great! All required skills seem to be covered.
                </div>
            )}

            {/* Summary */}
            <h3 className="text-xl text-gray-600 font-semibold mt-6 flex items-center"><GiBrain className="mr-2" /> Summary</h3>
            <p className="mt-2 text-gray-700 leading-relaxed whitespace-pre-line">
                {result.reasoning}
            </p>
        </div>
    );
};

export default CVAnalysisResults;
