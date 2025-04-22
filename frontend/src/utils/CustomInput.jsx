import React from "react";
import "./CustomInput.css";

const CustomInput = ({
    width = "274px",
    height = "32px",
    placeholder = "",
    type = "text",
    id,
    disabled = false,
    options = [],
}) => {
    const style = { width, height };

    if (type === "select") {
        return (
            <select
                id={id}
                disabled={disabled}
                className="custom-input"
                style={style}
                defaultValue=""
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((opt, i) => (
                    <option key={i} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        );
    }

    return (
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className="custom-input"
            style={style}
        />
    );
};

export default CustomInput;
