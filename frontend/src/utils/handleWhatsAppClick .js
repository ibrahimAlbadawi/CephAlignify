export const handleWhatsAppClick = (patientPhone, doctorName) => {
    if (!patientPhone) 
        console.log("no patient phone");
    if(!doctorName)
        console.log("no doctor name")

    const phone = patientPhone.replace(/[^\d]/g, ""); // Remove +, spaces, dashes
    const message = encodeURIComponent(`Hello there, this is Dr. ${doctorName}`);
    const link = `https://wa.me/${phone}?text=${message}`;

    window.open(link, "_blank");
};
