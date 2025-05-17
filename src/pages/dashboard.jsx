import React, { useState } from "react";
import { useEffect } from "react";
import "../styles/dashboard.css";
import {
  getPresignedUrl,
  uploadFileToS3,
  saveMetadataToDynamo,
  getReports,
} from "../api/medivault";

import { getUser } from "../services/authService";
import { useNavigate } from "react-router-dom"; 
import { signOutUser } from "../services/authService";



const Dashboard = () => {
  const [userName, setUserName] = useState("Atharva");
  const [lastLogin, setLastLogin] = useState("2025-05-10 08:30 AM");

  // Reports state starts empty
  const [reports, setReports] = useState([]);

  // Appointments state starts empty
  const [appointments, setAppointments] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [reportFilter, setReportFilter] = useState("");
  const [uploadDetails, setUploadDetails] = useState({
    file: null,
    type: "",
    date: "",
    doctor: "",
  });

  // Appointment form state
  const [appointmentForm, setAppointmentForm] = useState({
    date: "",
    time: "",
    doctor: "",
    purpose: "",
  });

const [userEmail, setUserEmail] = useState("");
const navigate = useNavigate();



useEffect(() => {
  const checkAuthAndFetchReports = async () => {
    try {
      const user = await getUser();

      if (!user || !user.signInDetails?.loginId) {
        alert("Session expired. Please log in again.");
        await signOutUser(); // Ensure token/session is cleared
        navigate("/login");
        return;
      }

      const email = user.signInDetails.loginId;
      setUserEmail(email);

      const reportsFromDB = await getReports(email);
      setReports(reportsFromDB);
      console.log("Fetched reports for:", email, reportsFromDB);
    } catch (error) {
      console.error("Error fetching user or reports:", error);
      alert("Session invalid or expired. Please log in again.");
      await signOutUser();
      navigate("/login");
    }
  };

  checkAuthAndFetchReports();
}, [navigate]);



useEffect(() => {
  if (window.location.hash) {
    const el = document.querySelector(window.location.hash);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80, // adjust for padding
        behavior: 'smooth'
      });
    }
  }
}, [navigate]);



  // Filter reports
// ✅ Safe version with null checks to avoid crash on undefined values
const filteredReports = reports.filter((report) => {
  const type = report.type || "";
  const doctor = report.doctor || "";
  const date = report.date || "";

  const matchesSearch =
    type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    date.includes(searchTerm);

  const matchesFilter = reportFilter
    ? type.toLowerCase() === reportFilter.toLowerCase()
    : true;

  return matchesSearch && matchesFilter;
});

  // Handle file input change
  const handleFileChange = (e) => {
    setUploadDetails({ ...uploadDetails, file: e.target.files[0] });
  };

  // Handle upload detail changes
  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setUploadDetails({ ...uploadDetails, [name]: value });
  };

  // Handle report upload submission
  const handleUpload = async (e) => {
    e.preventDefault();
  
    const { file, type, date, doctor } = uploadDetails;
  
    if (!file || !type || !date) {
      alert("Please fill all required fields and select a file.");
      return;
    }
  
    const fileName = `${Date.now()}_${file.name}`;
    const fileType = file.type;
  
    try {
      console.log("▶️ Getting presigned URL...");
      const signedUrl = await getPresignedUrl(fileName, fileType);
      console.log("✅ Signed URL:", signedUrl);
  
      console.log("▶️ Uploading file to S3...");
      const uploaded = await uploadFileToS3(file, signedUrl);
      console.log("✅ Upload success:", uploaded);
  
      if (!uploaded) {
        alert("Upload to S3 failed");
        return;
      }
  
      const fileUrl = signedUrl.split("?")[0]; // remove query params
      const metadata = {
        reportId: fileName,
        userEmail: userEmail,
        title: type,
        date,
        doctorName: doctor || "N/A",
        fileUrl,
        fileType,
      };
  
      console.log("▶️ Saving metadata:", metadata);
      const response = await saveMetadataToDynamo(metadata);
      console.log("✅ Metadata saved:", response);
  
      alert("Report uploaded successfully!");
  
      setUploadDetails({ file: null, type: "", date: "", doctor: "" });
      setReports([{ ...metadata, status: "Uploaded" }, ...reports]);
  
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Upload failed, please try again.");
    }
  };
  
  
  // Handle appointment form input change
  const handleAppointmentChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm({ ...appointmentForm, [name]: value });
  };

  // Handle appointment submission
  const handleAppointmentSubmit = (e) => {
    e.preventDefault();

    const { date, time, doctor, purpose } = appointmentForm;

    if (!date || !time || !doctor || !purpose) {
      alert("Please fill in all appointment details.");
      return;
    }

    const newAppointment = {
      id: appointments.length + 1,
      date,
      time,
      doctor,
      purpose,
    };

    setAppointments([...appointments, newAppointment]);

    setAppointmentForm({
      date: "",
      time: "",
      doctor: "",
      purpose: "",
    });

    alert("Appointment scheduled successfully!");
  };

  const handleLogout = async () => {
  try {
    await signOutUser();
    alert("Logged out!");
    navigate("/login");
  } catch (err) {
    console.error("Logout error:", err);
    alert("Logout failed. Please try again.");
  }
};


  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2>MediVault</h2>
        <a href="/dashboard" className="active">
          My Reports
        </a>
        <a href="#upload">Upload Reports</a>
        <a href="#appointments">Appointments</a>
        <a href="#profile">Profile / Settings</a>
        <a href="#help">Help / Support</a>
         <button onClick={handleLogout} className="upload-button" style={{ marginTop: "auto" }}>
          Logout
         </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Welcome */}
        <section className="welcome-section">
          <h1>Welcome, {userName}!</h1>
          <small>Last login: {lastLogin}</small>
          <p>Logged in as: <strong>{userEmail}</strong></p>
          <p>Tip: Keep your reports updated for better health tracking.</p>
        </section>

        {/* Notifications */}
        <section className="notifications">
          <strong>Reminder:</strong> Please schedule your upcoming appointments.
        </section>

        {/* Reports Overview */}
        <section className="reports-section">
          <h2>Recent Medical Reports</h2>
          <div className="reports-controls">
            <input
              type="text"
              placeholder="Search by type, doctor, or date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={reportFilter}
              onChange={(e) => setReportFilter(e.target.value)}
            >
              <option value="">Filter by Type</option>
              {[...new Set(reports.map((r) => r.type))].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="reports-grid">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
              <div key={report.reportId || report.id} className="report-card">
                <h3>{report.title || report.type || "Untitled Report"}</h3>
                <p>
                  <strong>Date:</strong> {report.date || "N/A"}
                </p>
                <p>
                  <strong>Doctor:</strong> {report.doctorName || report.doctor || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong> {report.status || "Uploaded"}
                </p>
                {report.fileUrl && (
                <p>
                  <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">
                    View Report
                  </a>
                </p>
              )}
            </div>
          ))
        ) : (
          <p>No reports found.</p>
        )}
      </div>

        </section>

        {/* Upload New Report */}
        <section id="upload" className="upload-section">
          <h2>Upload New Medical Report</h2>
          <form onSubmit={handleUpload} className="upload-form">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,image/*"
              required
            />
            <input
              type="text"
              name="type"
              value={uploadDetails.type}
              placeholder="Test Type (e.g., Blood Test)"
              onChange={handleDetailChange}
              required
            />
            <input
              type="date"
              name="date"
              value={uploadDetails.date}
              onChange={handleDetailChange}
              required
            />
            <input
              type="text"
              name="doctor"
              value={uploadDetails.doctor}
              placeholder="Doctor/Hospital Name"
              onChange={handleDetailChange}
            />
            <button type="submit" className="upload-button">
              Upload Report
            </button>
          </form>
        </section>

        {/* Upcoming Appointments */}
        <section id="appointments" className="appointments-section">
          <h2>Schedule a New Appointment</h2>
          <form onSubmit={handleAppointmentSubmit} className="appointment-form">
            <input
              type="date"
              name="date"
              value={appointmentForm.date}
              onChange={handleAppointmentChange}
              required
            />
            <input
              type="time"
              name="time"
              value={appointmentForm.time}
              onChange={handleAppointmentChange}
              required
            />
            <input
              type="text"
              name="doctor"
              value={appointmentForm.doctor}
              placeholder="Doctor Name"
              onChange={handleAppointmentChange}
              required
            />
            <input
              type="text"
              name="purpose"
              value={appointmentForm.purpose}
              placeholder="Purpose (e.g., Checkup)"
              onChange={handleAppointmentChange}
              required
            />
            <button type="submit" className="upload-button">
              Schedule Appointment
            </button>
          </form>

          <h3>Your Upcoming Appointments</h3>
          {appointments.length > 0 ? (
            <ul className="appointments-list">
              {appointments.map((app) => (
                <li key={app.id}>
                  <strong>
                    {app.date} at {app.time}
                  </strong>{" "}
                  with {app.doctor} — {app.purpose}
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming appointments.</p>
          )}
        </section>

        {/* Security & Privacy Notice */}
        <section className="security-notice">
          <p>
            🔒 Your data is secure and private with MediVault. We prioritize
            your confidentiality and use top-notch encryption.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Dashboard; 