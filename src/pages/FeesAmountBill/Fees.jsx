import React, { useState, useEffect } from "react";
import "./fees.scss";
import jsPDF from "jspdf";
import apiClient from "../../utils/api";

function urlToBase64(url) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      try {
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = function () {
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

const Fees = () => {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    firstInstallment: "",
    secondInstallment: "",
    fullPayment: false,
    examType: "JEE",
    courseType: "Crash Course",
  });
  const [orgLogo, setOrgLogo] = useState("");
  const [orgLogoBase64, setOrgLogoBase64] = useState("");
  const [orgName, setOrgName] = useState("Prepalyze Organization");

  useEffect(() => {
    apiClient.get("/api/organization/me").then(async (res) => {
      setOrgName(res.data.name || "Prepalyze Organization");
      const logo = res.data.logo;
      setOrgLogo(logo);
      if (logo && !logo.startsWith("data:image")) {
        // If logo is a URL, convert to base64
        try {
          const base64 = await urlToBase64(logo);
          setOrgLogoBase64(base64);
        } catch (err) {
          setOrgLogoBase64("");
        }
      } else {
        setOrgLogoBase64(logo);
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePDF();
  };

  const generatePDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    // Header
    if (orgLogoBase64) {
      try {
        doc.addImage(orgLogoBase64, "PNG", 40, 30, 60, 60);
      } catch (err) {}
    }
    doc.setFontSize(22);
    doc.setTextColor("#22223b");
    doc.text(orgName, 120, 60);
    doc.setFontSize(14);
    doc.setTextColor("#222");
    doc.text(`Invoice No.`, 40, 120);
    doc.text(`Issue date`, 160, 120);
    doc.text(`Due date`, 260, 120);
    doc.text(`Total due`, 370, 120);
    doc.setFillColor("#ffe066");
    doc.rect(40, 130, 80, 30, "F");
    doc.rect(160, 130, 80, 30, "F");
    doc.rect(260, 130, 80, 30, "F");
    doc.setFillColor("#22223b");
    doc.rect(370, 130, 120, 30, "F");
    doc.setTextColor("#fff");
    doc.text(`₹${form.firstInstallment && form.secondInstallment ? (+form.firstInstallment + +form.secondInstallment) : (form.firstInstallment || form.secondInstallment || 0)}`, 430, 150, { align: "center" });
    doc.setTextColor("#222");
    doc.text("2022435", 60, 150);
    const today = new Date();
    doc.text(today.toLocaleDateString(), 180, 150);
    doc.text(today.toLocaleDateString(), 280, 150);
    // Table header
    doc.setFontSize(12);
    doc.text("Description", 40, 200);
    doc.text("Quantity", 220, 200);
    doc.text("Unit price (₹)", 300, 200);
    doc.text("Amount (₹)", 420, 200);
    // Table row
    doc.setFontSize(11);
    doc.text("Course Fees", 40, 220);
    doc.text("1", 230, 220);
    doc.text(`${form.firstInstallment && form.secondInstallment ? (+form.firstInstallment + +form.secondInstallment) : (form.firstInstallment || form.secondInstallment || 0)}`, 320, 220);
    doc.text(`${form.firstInstallment && form.secondInstallment ? (+form.firstInstallment + +form.secondInstallment) : (form.firstInstallment || form.secondInstallment || 0)}`, 440, 220);
    // Details
    doc.setFontSize(11);
    doc.text(`Name: ${form.name}`, 40, 260);
    doc.text(`Phone: ${form.phoneNumber}`, 40, 280);
    doc.text(`Email: ${form.email}`, 40, 300);
    doc.text(`Exam: ${form.examType}`, 40, 320);
    doc.text(`Course: ${form.courseType}`, 40, 340);
    doc.text(`Full Payment: ${form.fullPayment ? "Yes" : "No"}`, 40, 360);
    doc.save("student-fees-bill.pdf");
  };

  return (
    <div className="fees-container">
      {orgLogo && (
        <div className="fees-logo-area">
          <img src={orgLogo} alt="Organization Logo" className="fees-logo" />
        </div>
      )}
      <h1 className="fees-title">Student Fees Bill</h1>
      <form className="fees-form" onSubmit={handleSubmit}>
        <div className="fees-row">
          <div className="fees-field">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="fees-field">
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="fees-row">
          <div className="fees-field">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="fees-field">
            <label>Exam Option:</label>
            <select
              name="examType"
              value={form.examType}
              onChange={handleChange}
            >
              <option value="JEE">JEE</option>
              <option value="NEET">NEET</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>
        <div className="fees-row">
          <div className="fees-field">
            <label>Course Type:</label>
            <select
              name="courseType"
              value={form.courseType}
              onChange={handleChange}
            >
              <option value="Crash Course">Crash Course</option>
              <option value="Full Course">Full Course</option>
              <option value="Part-time Course">Part-time Course</option>
            </select>
          </div>
          <div className="fees-field">
            <label>First Installment:</label>
            <input
              type="number"
              name="firstInstallment"
              value={form.firstInstallment}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="fees-row">
          <div className="fees-field">
            <label>Second Installment:</label>
            <input
              type="number"
              name="secondInstallment"
              value={form.secondInstallment}
              onChange={handleChange}
            />
          </div>
          <div className="fees-field checkbox-label">
            <input
              type="checkbox"
              name="fullPayment"
              checked={form.fullPayment}
              onChange={handleChange}
            />
            <label>Full Fees Payment</label>
          </div>
        </div>
        <button className="fees-generate-btn" type="submit">
          Generate Bill
        </button>
      </form>
    </div>
  );
};

export default Fees;
