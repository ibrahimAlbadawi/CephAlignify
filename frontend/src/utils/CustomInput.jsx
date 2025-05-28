import React from "react";
import "./CustomInput.css";

const CustomInput = ({
    width = "274px",
    height = "32px",
    placeholder = "",
    type = "text",
    id,
    disabled = false,
    note = "",
    options = [],
    // onChange = {handleChange}
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
                // onChange={handleChange}
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

    if (type === "textarea") {
        return (
            <div>
                <textarea
                    id={id}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="custom-input"
                    style={{
                        ...style,
                        height: height === "32px" ? "100px" : height,
                        resize: "none", // 👈 disables resize handle
                        padding: "8px",
                        overflowY: "auto", // ensure scroll appears if content overflows
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE & Edge
                        fontSize: 14,
                        fontFamily: 'quicksand'
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

    // Default input
    return (
        <div>
            {note !== "" ? (
                <div>
                    <input
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="custom-input"
                        style={{ ...style, marginBottom: "0" }}
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
                />
            )}
        </div>
    );
};

export default CustomInput;
