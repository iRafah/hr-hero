import { useAuth } from "../context/AuthContext";
import CandidateProfileForm from "../features/profile/CandidateProfileForm";
import RecruiterProfileForm from "../features/profile/RecruiterProfileForm";

export default function Profile() {
    const { user } = useAuth();

    const renderForm = () => {
        if (user?.role === "recruiter") return <RecruiterProfileForm user={user} />;
        return <CandidateProfileForm user={user} />;
    };

    return (
        <div className="px-4 sm:px-6 py-6 sm:py-8 w-full space-y-6">
            <h1 className="text-2xl font-bold text-slate-100">Perfil</h1>
            {renderForm()}
        </div>
    );
}
