import React, { useState, useEffect } from "react";
import "./fees.scss";
import jsPDF from "jspdf";
import apiClient from "../../utils/api";
import useAuthStore from "../../context/auth-store";

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
    totalFees: "",
    amountPaid: "",
    fullPayment: false,
    examType: "JEE",
    courseType: "Crash Course",
  });

  const calculateRemainingAmount = () => {
    const total = parseFloat(form.totalFees) || 0;
    const paid = parseFloat(form.amountPaid) || 0;
    return total - paid;
  };
  const [orgLogo, setOrgLogo] = useState("");
  const [orgLogoBase64, setOrgLogoBase64] = useState("");
  const [orgName, setOrgName] = useState("Prepalyze Organization");
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        setLoading(true);

        // First try to get from user context (like Sidebar does)
        if (user?.organization) {
          const name = user.organization.name || "Prepalyze Organization";
          const logo = user.organization.logo || user.organization.logoUrl;

          setOrgName(name);
          console.log("Organization name from user context:", name);

          if (logo) {
            setOrgLogo(logo);
            console.log("Organization logo from user context:", logo);

            // Convert logo to base64 if it's a URL
            if (!logo.startsWith("data:image")) {
              try {
                const base64 = await urlToBase64(logo);
                setOrgLogoBase64(base64);
                console.log("Logo converted to base64 successfully");
              } catch (err) {
                console.error("Error converting logo to base64:", err);
                setOrgLogoBase64("");
              }
            } else {
              setOrgLogoBase64(logo);
            }
          }
        } else {
          // Fallback: fetch from API if not in user context
          const res = await apiClient.get("/api/organization/me");

          if (res.data) {
            const name = res.data.name || "Prepalyze Organization";
            setOrgName(name);
            console.log("Organization name fetched from API:", name);

            const logo = res.data.logo;
            if (logo) {
              setOrgLogo(logo);
              console.log("Organization logo URL from API:", logo);

              if (!logo.startsWith("data:image")) {
                try {
                  const base64 = await urlToBase64(logo);
                  setOrgLogoBase64(base64);
                  console.log("Logo converted to base64 successfully");
                } catch (err) {
                  console.error("Error converting logo to base64:", err);
                  setOrgLogoBase64("");
                }
              } else {
                setOrgLogoBase64(logo);
              }
            } else {
              console.warn("No logo found in API response");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching organization data:", err);
        // Use default values on error
        setOrgName("Prepalyze Organization");
        setOrgLogo("");
        setOrgLogoBase64("");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "fullPayment") {
      if (checked) {
        setForm((prev) => ({
          ...prev,
          fullPayment: true,
          amountPaid: prev.totalFees,
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          fullPayment: false,
        }));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePDF();
  };

  const generatePDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const totalPaid = parseFloat(form.amountPaid) || 0;
    const remaining = calculateRemainingAmount();
    const today = new Date();
    const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;

    // Blue header background
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 120, "F");

    // Logo - only add if available
    let logoX = 40;
    let nameX = 120;

    if (orgLogoBase64) {
      try {
        doc.addImage(orgLogoBase64, "PNG", logoX, 30, 60, 60);
        console.log("Logo added to PDF successfully");
      } catch (err) {
        console.error("Error adding logo to PDF:", err);
        // If logo fails, adjust text position
        nameX = 50;
      }
    } else {
      console.warn("No logo available for PDF");
      // No logo, start text from left
      nameX = 50;
    }

    // Organization name and title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont(undefined, "bold");
    doc.text(orgName || "Prepalyze Organization", nameX, 55);
    doc.setFontSize(14);
    doc.setFont(undefined, "normal");
    doc.text("FEES RECEIPT", nameX, 80);

    // White info box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(40, 140, 350, 100, 8, 8, "F");
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(1);
    doc.roundedRect(40, 140, 350, 100, 8, 8, "S");

    // Invoice details
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Invoice No:", 55, 170);
    doc.text("Issue Date:", 55, 195);
    doc.text("Payment Status:", 55, 220);

    doc.setFont(undefined, "normal");
    doc.setTextColor(17, 24, 39);
    doc.text(invoiceNo, 160, 170);
    doc.text(today.toLocaleDateString("en-IN", { day: '2-digit', month: '2-digit', year: 'numeric' }), 160, 195);
    doc.setFont(undefined, "bold");
    doc.setTextColor(remaining > 0 ? 234 : 16, remaining > 0 ? 88 : 185, remaining > 0 ? 12 : 129);
    doc.text(remaining > 0 ? "Partial Payment" : "Paid in Full", 160, 220);

    // Total paid box
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(pageWidth - 190, 140, 150, 100, 8, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text("TOTAL PAID", pageWidth - 115, 170, { align: "center" });

    doc.setFontSize(22);
    doc.setFont(undefined, "bold");
    doc.text("Rs. " + totalPaid.toString(), pageWidth - 115, 205, { align: "center" });

    // Student details section
    let yPos = 270;
    doc.setFillColor(243, 244, 246);
    doc.rect(40, yPos, pageWidth - 80, 35, "F");
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.text("STUDENT DETAILS", 50, yPos + 22);

    yPos += 55;
    doc.setFontSize(11);
    doc.setTextColor(55, 65, 81);

    // Student info in two columns
    doc.setFont(undefined, "bold");
    doc.text("Name:", 50, yPos);
    doc.setFont(undefined, "normal");
    doc.setTextColor(17, 24, 39);
    doc.text(form.name, 140, yPos);

    doc.setTextColor(55, 65, 81);
    doc.setFont(undefined, "bold");
    doc.text("Phone:", 330, yPos);
    doc.setFont(undefined, "normal");
    doc.setTextColor(17, 24, 39);
    doc.text(form.phoneNumber, 390, yPos);

    yPos += 25;
    doc.setTextColor(55, 65, 81);
    doc.setFont(undefined, "bold");
    doc.text("Email:", 50, yPos);
    doc.setFont(undefined, "normal");
    doc.setTextColor(17, 24, 39);
    doc.text(form.email, 140, yPos);

    yPos += 25;
    doc.setTextColor(55, 65, 81);
    doc.setFont(undefined, "bold");
    doc.text("Exam Type:", 50, yPos);
    doc.setFont(undefined, "normal");
    doc.setTextColor(17, 24, 39);
    doc.text(form.examType, 140, yPos);

    doc.setTextColor(55, 65, 81);
    doc.setFont(undefined, "bold");
    doc.text("Course Type:", 330, yPos);
    doc.setFont(undefined, "normal");
    doc.setTextColor(17, 24, 39);
    doc.text(form.courseType, 420, yPos);

    // Payment breakdown section
    yPos += 50;
    doc.setFillColor(243, 244, 246);
    doc.rect(40, yPos, pageWidth - 80, 35, "F");
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.text("PAYMENT BREAKDOWN", 50, yPos + 22);

    yPos += 50;

    // Table header
    doc.setFillColor(59, 130, 246);
    doc.rect(40, yPos, pageWidth - 80, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Description", 50, yPos + 20);
    doc.text("Amount (₹)", pageWidth - 110, yPos + 20, { align: "right" });

    yPos += 30;

    // Table rows
    const drawTableRow = (label, amount, bgColor = null) => {
      if (bgColor) {
        doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        doc.rect(40, yPos, pageWidth - 80, 30, "F");
      } else {
        doc.setFillColor(255, 255, 255);
        doc.rect(40, yPos, pageWidth - 80, 30, "F");
      }

      doc.setDrawColor(229, 231, 235);
      doc.line(40, yPos, pageWidth - 40, yPos);

      doc.setTextColor(bgColor ? 255 : 55, bgColor ? 255 : 65, bgColor ? 255 : 81);
      doc.setFontSize(11);
      doc.setFont(undefined, bgColor ? "bold" : "normal");
      doc.text(label, 50, yPos + 20);

      const amountStr = "Rs. " + amount.toString();
      const amountTextWidth = doc.getTextWidth(amountStr);
      doc.text(amountStr, pageWidth - 50 - amountTextWidth, yPos + 20);

      yPos += 30;
    };

    drawTableRow("Total Course Fees", parseFloat(form.totalFees) || 0);
    drawTableRow("Amount Paid", totalPaid);

    // Total paid row (green)
    drawTableRow("TOTAL PAID", totalPaid, [16, 185, 129]);

    // Remaining amount
    yPos += 10;
    if (remaining > 0) {
      doc.setFillColor(254, 243, 199);
      doc.roundedRect(40, yPos, pageWidth - 80, 40, 5, 5, "F");
      doc.setDrawColor(251, 191, 36);
      doc.setLineWidth(2);
      doc.roundedRect(40, yPos, pageWidth - 80, 40, 5, 5, "S");

      doc.setTextColor(146, 64, 14);
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text("REMAINING AMOUNT", 50, yPos + 25);

      const remainingStr = "Rs. " + remaining.toString();
      const remainingWidth = doc.getTextWidth(remainingStr);
      doc.text(remainingStr, pageWidth - 50 - remainingWidth, yPos + 25);
      yPos += 50;
    } else {
      doc.setFillColor(209, 250, 229);
      doc.roundedRect(40, yPos, pageWidth - 80, 40, 5, 5, "F");
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(2);
      doc.roundedRect(40, yPos, pageWidth - 80, 40, 5, 5, "S");

      doc.setTextColor(5, 150, 105);
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("✓ FULLY PAID", pageWidth / 2, yPos + 26, { align: "center" });
      yPos += 50;
    }

    // Footer
    yPos += 30;
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(40, yPos, pageWidth - 40, yPos);

    yPos += 20;
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.setFont(undefined, "italic");
    doc.text("Thank you for your payment!", pageWidth / 2, yPos, { align: "center" });

    yPos += 15;
    doc.setFont(undefined, "normal");
    doc.text(`Generated on ${today.toLocaleDateString("en-IN")} at ${today.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}`, pageWidth / 2, yPos, { align: "center" });

    // Page border
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(2);
    doc.rect(20, 20, pageWidth - 40, pageHeight - 40, "S");

    doc.save(`Fees-Receipt-${form.name.replace(/\s+/g, "-")}-${invoiceNo}.pdf`);
  };

  return (
    <div className="fees-container">
      {loading && (
        <div style={{ textAlign: 'center', padding: '1rem', color: '#6b7280' }}>
          Loading organization details...
        </div>
      )}
      {orgLogo && (
        <div className="fees-logo-area">
          <img src={orgLogo} alt="Organization Logo" className="fees-logo" />
        </div>
      )}
      <h1 className="fees-title">{orgName} - Fees Bill</h1>
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
            <label>Total Fees Amount:</label>
            <input
              type="number"
              name="totalFees"
              value={form.totalFees}
              onChange={handleChange}
              placeholder="Enter total fees"
              required
            />
          </div>
        </div>
        <div className="fees-row">
          <div className="fees-field">
            <label>Amount Paid:</label>
            <input
              type="number"
              name="amountPaid"
              value={form.amountPaid}
              onChange={handleChange}
              placeholder="Enter amount paid"
              disabled={form.fullPayment}
              required
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
        <div className="fees-summary">
          <div className="fees-summary-row">
            <span className="fees-summary-label">Total Fees:</span>
            <span className="fees-summary-value">₹{(parseFloat(form.totalFees) || 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="fees-summary-row fees-summary-total">
            <span className="fees-summary-label">Amount Paid:</span>
            <span className="fees-summary-value">₹{(parseFloat(form.amountPaid) || 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="fees-summary-row fees-summary-remaining">
            <span className="fees-summary-label">Remaining Amount:</span>
            <span className="fees-summary-value">₹{calculateRemainingAmount().toLocaleString('en-IN')}</span>
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
