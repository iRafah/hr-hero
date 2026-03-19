import { useState } from "react";
import { X } from "lucide-react";

export function TagInput({ value = [], onChange, placeholder }) {
    const [inputValue, setInputValue] = useState("");

    const addTag = (tag) => {
        const trimmed = tag.trim().replace(/,$/, "");
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
        }
        setInputValue("");
    };

    const removeTag = (index) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            removeTag(value.length - 1);
        }
    };

    return (
        <div className="flex flex-wrap gap-1.5 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 min-h-11 focus-within:ring-2 focus-within:ring-blue-500 cursor-text">
            {value.map((tag, i) => (
                <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-indigo-900/60 text-indigo-300 border border-indigo-700/60 rounded px-2 py-0.5 text-xs"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={() => removeTag(i)}
                        className="hover:text-white transition-colors"
                    >
                        <X size={10} />
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => inputValue && addTag(inputValue)}
                placeholder={value.length === 0 ? placeholder : ""}
                className="flex-1 min-w-[140px] bg-transparent text-slate-100 text-sm placeholder-slate-500 outline-none"
            />
        </div>
    );
}

export default TagInput;
