// Simulated appointment data
const appointments = [
    { doctor: "Dr. Sithabiso Dlamini", patient: "Amahle Phoswa", date: "2025-05-15", time: "10:00", confirmed: false },
    { doctor: "Dr. Sithabiso Dlamini", patient: "Mich Mvune", date: "2025-05-16", time: "14:00", confirmed: false }
];

// Determine user role (Doctor or Patient)
const userRole = "Doctor"; // Change to "Patient" based on login
const loggedInUser = userRole === "Doctor" ? "Dr. Sithabiso Dlamini" : "Amahle Phoswa"; // Simulate logged-in user

// Function to validate appointment date
function isValidFutureDate(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight
    const inputDate = new Date(dateStr);
    return inputDate >= today;
}

// Function to display error message
function showError(message) {
    const errorDiv = document.getElementById("errorMessage");
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
    setTimeout(() => errorDiv.classList.add("hidden"), 5000); // Hide after 5 seconds
}

// Handle form submission from the booking form
document.getElementById("appointmentForm")?.addEventListener("submit", function(event) {
    event.preventDefault();

    const date = document.getElementById("date").value;
    const doctor = document.getElementById("doctor").value;
    const time = document.getElementById("time").value;
    const patient = loggedInUser; // In a real app, get from user profile or form

    // Validate date
    if (!isValidFutureDate(date)) {
        showError("Cannot book appointments for past dates. Please select a future date.");
        return;
    }

    // Add new appointment
    const newAppointment = {
        doctor: doctor,
        patient: patient,
        date: date,
        time: time,
        confirmed: false
    };
    appointments.push(newAppointment);

    // Show confirmation
    document.getElementById("doctorName").textContent = doctor;
    document.getElementById("appointmentDate").textContent = date;
    document.getElementById("appointmentTime").textContent = time;
    document.getElementById("confirmationMessage").classList.remove("hidden");

    // Reset form
    this.reset();

    // Refresh views
    if (userRole === "Doctor") refreshDoctorView();
    if (userRole === "Patient") refreshPatientView();
});

// Function to confirm appointment
function confirmAppointment(index) {
    appointments[index].confirmed = true;
    refreshDoctorView(); // Refresh to update UI
}

// Function to refresh Doctor view
function refreshDoctorView() {
    const list = document.getElementById("doctorAppointments");
    list.innerHTML = ""; // Clear existing list

    appointments.forEach((appointment, index) => {
        if (appointment.doctor === loggedInUser) {
            const item = document.createElement("li");
            item.innerHTML = `
                ${appointment.patient} - ${appointment.date} at ${appointment.time}
                <button class="confirm" onclick="confirmAppointment(${index})" ${appointment.confirmed ? "disabled" : ""}>Confirm</button>
                <span id="status${index}" class="${appointment.confirmed ? "confirmed" : ""}">
                    ${appointment.confirmed ? "Confirmed" : "Pending"}
                </span>
            `;
            list.appendChild(item);
        }
    });
}

// Function to refresh Patient view
function refreshPatientView() {
    const list = document.getElementById("patientAppointments");
    list.innerHTML = ""; // Clear existing list

    appointments.forEach((appointment) => {
        if (appointment.patient === loggedInUser) {
            const item = document.createElement("li");
            item.innerHTML = `
                Appointment with ${appointment.doctor} - ${appointment.date} at ${appointment.time}
                <span class="${appointment.confirmed ? "confirmed" : ""}">
                    ${appointment.confirmed ? "Confirmed by Doctor" : "Awaiting Confirmation"}
                </span>
            `;
            list.appendChild(item);
        }
    });
}

// Initialize views based on user role
if (userRole === "Doctor") {
    document.getElementById("doctorView").classList.remove("hidden");
    refreshDoctorView();
} else if (userRole === "Patient") {
    document.getElementById("patientView").classList.remove("hidden");
    refreshPatientView();
}