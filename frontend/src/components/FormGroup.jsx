import React from "react";

const FormGroup = ({ label, children }) => (
    <div className="form-group">
        {label}
        {children}
    </div>
)

export default FormGroup;