export const handleWhatsAppClick = (patientPhone, doctorName, clinicName) => {
    if (!patientPhone) console.log("no patient phone");
    if (!doctorName) console.log("no doctor name");

    const phone = patientPhone.replace(/[^\d]/g, ""); // Remove +, spaces, dashes
    const message = encodeURIComponent(
        `Hello, this is Dr. ${doctorName} from ${clinicName}. I will shortly send the PDF report to you. Please let me know if you have any questions.`
    );
    const link = `https://wa.me/${phone}?text=${message}`;

    window.open(link, "_blank");
};
