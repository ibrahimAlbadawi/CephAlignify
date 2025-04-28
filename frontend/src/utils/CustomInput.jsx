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
        <div>
            {note != "" ? (
                <div>
                    <input
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="custom-input"
                        style={{...style, marginBottom: '0'}}
                        note={note}
                    />
                    <p style={{color:'#db1607', padding: '0', margin: '0', fontSize: '11px', marginBottom: '9px'}}>{note}</p>
                </div>
            ) : (
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="custom-input"
                    style={style}
                    note={note}
                />
            )}
        </div>
    );
};

export default CustomInput;
