import React, { useState, useEffect } from "react";

import "./Profile.css";

import PrimaryButton from "../../../utils/PrimaryButton";
import CustomInput from "../../../utils/CustomInput";

import { generateTimeOptions } from "../../../utils/GenerateTimes";
import { useUser } from "../../../context/UserProvider";
import { useNotification } from "../../../hooks/useNotification";
import { getDoctorProfile } from "../../../api/doctor";
import { updateDoctorProfile } from "../../../api/doctor";
const Profile = () => {
    const { user } = useUser();
    const showNotification = useNotification();
    const [headerText, setHeaderText] = useState("");
    const [fadeClass, setFadeClass] = useState("fade-in");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        clinic_work_start: "",
        clinic_work_end: "",
        address: "",
        city: "",
        country: "",
        secretary_username: "",
        secretary_email: "",
        secretary_password: "",
        secretary_password_confirmation: "",
    });

    const doctorName = user?.full_name || "Doctor";

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        else if (hour < 18) return "Good afternoon";
        else return "Good evening";
    };
    useEffect(() => {
        // Step 1: Show greeting
        setHeaderText(`${getGreeting()}, Dr. ${doctorName}`);

        // Step 2: After 2.5s, fade out
        const fadeOutTimeout = setTimeout(() => {
            setFadeClass("fade-out");
        }, 2500);

        // Step 3: After 3.2s, change to Agenda title and fade in
        const changeTextTimeout = setTimeout(() => {
            setHeaderText(`Profile Settings`);
            setFadeClass("fade-in");
        }, 3200);

        return () => {
            clearTimeout(fadeOutTimeout);
            clearTimeout(changeTextTimeout);
        };
    }, []);

    useEffect(() => {
        getDoctorProfile()
            .then((res) => {
                const data = res.data.doctor; //backend is passing a dictionary instead of a regular object (kill me plz)
                // console.log(data);
                setFormData({
                    username: data.username || "",
                    email: data.email || "",
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    clinic_work_start:
                        data.clinic_work_start?.slice(0, 5) || "",
                    clinic_work_end: data.clinic_work_end?.slice(0, 5) || "",
                    address: data.address || "",
                    city: data.city || "",
                    country: data.country || "",
                    secretary_username: data.secretary?.username || "",
                    secretary_email: data.secretary?.email || "",
                    secretary_password: "",
                    secretary_password_confirmation: "",
                });
            })
            .catch((err) => {
                console.error(
                    "Failed to fetch profile",
                    err.response?.data || err
                );
            });
    }, []);

    const handleSaveChanges = () => {
        const doctorPayload = {
            username: formData.username,
            email: formData.email,
            full_name: `${formData.first_name} ${formData.last_name}`,
            first_name: formData.first_name,
            last_name: formData.last_name,
            address: formData.address,
        };

        const clinicPayload = {
            name: "Default Clinic", // ✅ or pull dynamically from backend if editable
            work_start: formData.clinic_work_start,
            work_end: formData.clinic_work_end,
        };

        const secretaryPayload = {
            username: formData.secretary_username,
            email: formData.secretary_email,
        };

        if (
            formData.secretary_password ||
            formData.secretary_password_confirmation
        ) {
            secretaryPayload.password = formData.secretary_password;
            secretaryPayload.confirm_password =
                formData.secretary_password_confirmation;
        }

        const fullPayload = {
            doctor: doctorPayload,
            clinic: clinicPayload,
            secretary: secretaryPayload,
        };
        // console.log("Current formData:", formData); // <== log this!
        // console.log("Payload being sent:", fullPayload);
        updateDoctorProfile(fullPayload)
            .then((res) => {
                showNotification({
                    type: "success",
                    text: res?.data?.detail || "Profile updated successfully!",
                });
            })
            .catch((err) => {
                const backendErrors = err?.response?.data;
                console.error("Detailed backend error:", backendErrors);

                const message =
                    typeof backendErrors === "string"
                        ? backendErrors
                        : backendErrors?.detail ||
                          backendErrors?.message ||
                          Object.entries(backendErrors || {})
                              .map(([key, val]) => `${key}: ${val}`)
                              .join(", ") ||
                          "Failed to update profile.";

                showNotification({
                    type: "error",
                    text: message,
                });
            });
    };

    return (
        <div id="doctor-profile-container">
            <h1 id="doctor-profile-header" className={fadeClass}>
                {headerText}
            </h1>
            <div id="doctor-profile-settings">
                <div className="profile-sections">
                    {/* Main Information */}
                    <div className="profile-section">
                        <h2>Main information</h2>
                        <div className="input-group-container">
                            <label
                                htmlFor="profile-username"
                                className="profile-labels"
                            >
                                Username:
                            </label>
                            {/*change the placeholder later to be dynamic*/}
                            <CustomInput
                                id="profile-username"
                                type="text"
                                placeholder="Username"
                                disabled={true}
                                name="profile-username"
                                value={formData.username}
                            />
                            <div className="input-row">
                                <div className="input-group">
                                    <label
                                        htmlFor="profile-first-name"
                                        className="profile-labels"
                                    >
                                        First name:
                                    </label>

                                    <CustomInput
                                        id="profile-first-name"
                                        type="text"
                                        placeholder="Change first name"
                                        width="131px"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                first_name: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="input-group">
                                    <label
                                        htmlFor="profile-last-name"
                                        className="profile-labels"
                                    >
                                        Last name:
                                    </label>

                                    <CustomInput
                                        id="profile-last-name"
                                        type="text"
                                        placeholder="Change last name"
                                        width="131px"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                last_name: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            <label
                                htmlFor="profile-email"
                                className="profile-labels"
                            >
                                Email:
                            </label>
                            <CustomInput
                                id="profile-email"
                                type="text"
                                placeholder="Email"
                                disabled={true}
                                name="email"
                                value={formData.email}
                            />
                            <label
                                htmlFor="profile-clinic-hours"
                                className="profile-labels"
                            >
                                Clinic work hours:
                            </label>
                            <div className="input-row">
                                <CustomInput
                                    id="profile-clinic-hours"
                                    type="select"
                                    placeholder="From"
                                    options={generateTimeOptions()}
                                    name="clinic_work_start"
                                    value={formData.clinic_work_start}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            clinic_work_start: e.target.value,
                                        }))
                                    }
                                />

                                <CustomInput
                                    id="profile-clinic-hours"
                                    type="select"
                                    placeholder="To"
                                    options={generateTimeOptions()}
                                    name="clinic_work_end"
                                    value={formData.clinic_work_end}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            clinic_work_end: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="profile-section">
                        <h2>Additional information</h2>
                        <div className="input-group-container">
                            <label
                                htmlFor="profile-address"
                                className="profile-labels"
                            >
                                Address:
                            </label>
                            <CustomInput
                                id="profile-address"
                                type="text"
                                placeholder="Add address"
                                name="address"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        address: e.target.value,
                                    }))
                                }
                            />
                            <div className="input-row">
                                <div className="input-group">
                                    <label
                                        htmlFor="profile-city"
                                        className="profile-labels"
                                    >
                                        City:
                                    </label>
                                    <CustomInput
                                        id="profile-city"
                                        type="text"
                                        placeholder="Add city"
                                        width="131px"
                                        name="city"
                                        value={formData.city}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                city: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="input-group">
                                    <label
                                        htmlFor="profile-country"
                                        className="profile-labels"
                                    >
                                        Country:
                                    </label>

                                    <CustomInput
                                        id="profile-country"
                                        type="text"
                                        placeholder="Add country"
                                        width="131px"
                                        name="country"
                                        value={formData.country}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                country: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secretary Settings */}
                    <div className="profile-section">
                        <h2>Secretary settings</h2>
                        <div className="input-group-container">
                            <label
                                htmlFor="profile-secretary-username"
                                className="profile-labels"
                            >
                                Secretary username:
                            </label>
                            <CustomInput
                                id="profile-secretary-username"
                                type="text"
                                placeholder="Change username"
                                name="secretary_username"
                                value={formData.secretary_username}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        secretary_username: e.target.value,
                                    }))
                                }
                            />
                            <label
                                htmlFor="profile-secretary-email"
                                className="profile-labels"
                            >
                                Secretary email:
                            </label>
                            <CustomInput
                                id="profile-secretary-email"
                                type="text"
                                placeholder="Change email"
                                name="secretary_email"
                                value={formData.secretary_email}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        secretary_email: e.target.value,
                                    }))
                                }
                            />
                            <label
                                htmlFor="profile-secretary-password"
                                className="profile-labels"
                            >
                                Secretary password:
                            </label>
                            <CustomInput
                                id="profile-secretary-password"
                                type="password"
                                placeholder="Change password"
                                name="secretary_password"
                                value={formData.secretary_password}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        secretary_password: e.target.value,
                                    }))
                                }
                            />
                            <label
                                htmlFor="profile-secretary-password-confirmation"
                                className="profile-labels"
                            >
                                Confirm secretary password:
                            </label>
                            <CustomInput
                                id="profile-secretary-password-confirmation"
                                type="password"
                                placeholder="Confirm new password"
                                name="secretary_password_confirmation"
                                value={formData.secretary_password_confirmation}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        secretary_password_confirmation:
                                            e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="save-button-wrapper">
                <PrimaryButton
                    text="Save changes"
                    width="470px"
                    onClick={handleSaveChanges}
                />
            </div>{" "}
        </div>
    );
};

export default Profile;
