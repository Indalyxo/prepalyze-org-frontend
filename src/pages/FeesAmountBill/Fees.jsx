import React, { useState, useEffect } from "react";
import "./Fees.scss";
import jsPDF from "jspdf";
import apiClient from "../../utils/api";
import useAuthStore from "../../context/auth-store";
import { 
  TextInput, 
  NumberInput, 
  Select, 
  Checkbox, 
  Container, 
  Paper, 
  Title, 
  Button, 
  Stack, 
  Group, 
  Box,
  Text,
  Divider
} from "@mantine/core";
import { IconReceipt, IconUser, IconPhone, IconAt, IconSchool, IconCreditCard } from "@tabler/icons-react";

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

  const addWatermark = (doc) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const watermarkText = "OFFICIAL RECEIPT - PREPALYZE";
    
    doc.saveGraphicsState();
    
    const GState = doc.GState || (jsPDF && jsPDF.GState);
    if (GState) {
      doc.setGState(new GState({ opacity: 0.15 }));
    } else {
      doc.setTextColor(230, 230, 230);
    }

    doc.setFontSize(50);
    doc.setFont("helvetica", "bold");
    
    const x = pageWidth / 2;
    const y = pageHeight / 2;
    const angle = 45;

    doc.text(watermarkText, x, y, { align: "center", angle: angle });
    doc.text(watermarkText, x - 200, y - 250, { align: "center", angle: angle });
    doc.text(watermarkText, x + 200, y + 250, { align: "center", angle: angle });
    
    doc.restoreGraphicsState();
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

    addWatermark(doc);

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

  const setFieldValue = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="xl" radius="lg" withBorder className="fees-modern-card">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Stack gap={0}>
              <Title order={2} className="fees-title-modern">Fees Bill Generation</Title>
              <Text size="sm" c="dimmed">Generate professional receipts for student payments</Text>
            </Stack>
            {orgLogo && (
              <Box className="fees-logo-badge">
                <img src={orgLogo} alt="Org Logo" style={{ height: 40, width: 'auto' }} />
              </Box>
            )}
          </Group>

          <Divider />

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <Group grow>
                <TextInput
                  label="Student Name"
                  placeholder="John Doe"
                  required
                  leftSection={<IconUser size={16} />}
                  value={form.name}
                  onChange={(e) => setFieldValue("name", e.target.value)}
                />
                <TextInput
                  label="Phone Number"
                  placeholder="+91 9876543210"
                  required
                  leftSection={<IconPhone size={16} />}
                  value={form.phoneNumber}
                  onChange={(e) => setFieldValue("phoneNumber", e.target.value)}
                />
              </Group>

              <TextInput
                label="Email Address"
                placeholder="john@example.com"
                required
                leftSection={<IconAt size={16} />}
                value={form.email}
                onChange={(e) => setFieldValue("email", e.target.value)}
              />

              <Group grow align="flex-end">
                <Select
                  label="Exam Option"
                  placeholder="Pick one"
                  data={[
                    { value: 'JEE', label: 'JEE' },
                    { value: 'NEET', label: 'NEET' },
                    { value: 'Others', label: 'Others' },
                  ]}
                  value={form.examType}
                  onChange={(val) => {
                    setFieldValue("examType", val);
                  }}
                  leftSection={<IconSchool size={16} />}
                />
                
                {form.examType === "Others" ? (
                  <TextInput
                    label="Custom Course Name"
                    placeholder="Enter course name"
                    required
                    value={form.courseType}
                    onChange={(e) => setFieldValue("courseType", e.target.value)}
                  />
                ) : (
                  <Select
                    label="Course Type"
                    placeholder="Select course"
                    data={[
                      { value: 'Crash Course', label: 'Crash Course' },
                      { value: 'Full Course', label: 'Full Course' },
                      { value: 'Part-time Course', label: 'Part-time Course' },
                    ]}
                    value={form.courseType}
                    onChange={(val) => setFieldValue("courseType", val)}
                  />
                )}
              </Group>

              <Divider variant="dashed" label="Payment Details" labelPosition="center" />

              <Group grow>
                <NumberInput
                  label="Total Fees Amount"
                  placeholder="0.00"
                  prefix="₹ "
                  required
                  thousandSeparator=","
                  hideControls
                  value={form.totalFees}
                  onChange={(val) => setFieldValue("totalFees", val)}
                  leftSection={<IconCreditCard size={16} />}
                />
                <NumberInput
                  label="Amount Paid"
                  placeholder="0.00"
                  prefix="₹ "
                  required
                  thousandSeparator=","
                  hideControls
                  disabled={form.fullPayment}
                  value={form.amountPaid}
                  onChange={(val) => setFieldValue("amountPaid", val)}
                  leftSection={<IconReceipt size={16} />}
                />
              </Group>

              <Checkbox
                label="Full Fees Payment"
                checked={form.fullPayment}
                onChange={(e) => {
                  const checked = e.currentTarget.checked;
                  setForm(prev => ({
                    ...prev,
                    fullPayment: checked,
                    amountPaid: checked ? prev.totalFees : prev.amountPaid
                  }));
                }}
              />

              <Paper p="md" radius="md" withBorder style={{ background: 'var(--mantine-color-gray-0)' }}>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>Total Fees:</Text>
                    <Text fw={700}>₹{(parseFloat(form.totalFees) || 0).toLocaleString('en-IN')}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" fw={500}>Amount Paid:</Text>
                    <Text fw={700} c="green">₹{(parseFloat(form.amountPaid) || 0).toLocaleString('en-IN')}</Text>
                  </Group>
                  <Divider />
                  <Group justify="space-between">
                    <Text size="sm" fw={700}>Remaining Balance:</Text>
                    <Text fw={900} c="red" size="lg">₹{calculateRemainingAmount().toLocaleString('en-IN')}</Text>
                  </Group>
                </Stack>
              </Paper>

              <Button 
                fullWidth 
                size="lg" 
                radius="md" 
                type="submit"
                leftSection={<IconReceipt size={18} />}
                className="fees-generate-btn-modern"
              >
                Generate Professional Bill
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Fees;
