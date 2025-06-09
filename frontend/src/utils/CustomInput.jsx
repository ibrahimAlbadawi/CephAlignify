import React from "react";
import "./CustomInput.css";

const CustomInput = ({
    id,
    name,
    value,
    onChange,
    width = "274px",
    height = "32px",
    placeholder = "",
    type = "text",
    disabled = false,
    note = "",
    options = [],
    checked = false,
    label = "",
}) => {
    const style = { width, height };

    // Handle Select
    if (type === "select") {
        return (
            <select
                id={id}
                name={name}
                value={value}
                disabled={disabled}
                className="custom-input"
                style={style}
                onChange={onChange}
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

    // Handle Textarea
    if (type === "textarea") {
        return (
            <div>
                <textarea
                    id={id}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="custom-input"
                    style={{
                        ...style,
                        height: height === "32px" ? "100px" : height,
                        resize: "none",
                        padding: "8px",
                        overflowY: "auto",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        fontSize: 14,
                        fontFamily: "quicksand",
                    }}
                />
                {note && (
                    <p
                        style={{
                            color: "#db1607",
                            padding: "0",
                            margin: "0",
                            fontSize: "11px",
                            marginBottom: "9px",
                        }}
                    >
                        {note}
                    </p>
                )}
            </div>
        );
    }

    // Handle Checkbox
    if (type === "checkbox") {
        return (
            <div className="custom-checkbox-wrapper">
                <label className="custom-checkbox-label">
                    <input
                        id={id}
                        name={name}
                        value={value}
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={onChange}
                    />
                    <span className="custom-checkbox" />
                    {label && (
                        <span className="custom-checkbox-text">{label}</span>
                    )}
                </label>
            </div>
        );
    }

    // Default Input
    return (
        <div>
            {note !== "" ? (
                <div>
                    <input
                        id={id}
                        name={name}
                        value={value}
                        type={type}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="custom-input"
                        style={{ ...style, marginBottom: "0" }}
                        onChange={onChange}
                    />
                    <p
                        style={{
                            color: "#db1607",
                            padding: "0",
                            margin: "0",
                            fontSize: "11px",
                            marginBottom: "9px",
                        }}
                    >
                        {note}
                    </p>
                </div>
            ) : (
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="custom-input"
                    style={style}
                    onChange={onChange}
                />
            )}
        </div>
    );
};

export default CustomInput;
