import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PCOS() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [patientData, setPatientData] = useState(null);
    const [pcosData, setPcosData] = useState({
        lh: "",
        fsh: "",
        amh: "",
        bmi: "",
        height: "",
        pcosHistory: false
    });

    useEffect(() => {
        const data = sessionStorage.getItem("currentPatient");
        if (data) {
            setPatientData(JSON.parse(data));
        }
    }, [navigate]);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    const handleUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPcosData(prev => ({ 
            ...prev, 
            [name]: type === "checkbox" ? checked : value 
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (patientData) {
            const record = {
                ...patientData,
                disease: "PCOS",
                result: "Pending Analysis"
            };

            const existingHistory = JSON.parse(localStorage.getItem("patientHistory") || "[]");
            localStorage.setItem("patientHistory", JSON.stringify([...existingHistory, record]));
            alert("Patient data saved successfully!");
        }
    };

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h1 className="page-title" style={{ fontSize: "2rem" }}>AURA-MED – PCOS</h1>
                {patientData && (
                    <p className="page-subtitle" style={{ marginBottom: 0 }}>
                        Patient: {patientData.patientName} ({patientData.patientID})
                    </p>
                )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                <div>
                    <div className="card" style={{ marginBottom: "2rem" }}>
                        <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Clinical Data Input</h3>
                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">LH</label>
                                    <input
                                        type="number"
                                        name="lh"
                                        className="form-input"
                                        placeholder="LH value"
                                        value={pcosData.lh}
                                        onChange={handleChange}
                                        step="0.01"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">FSH</label>
                                    <input
                                        type="number"
                                        name="fsh"
                                        className="form-input"
                                        placeholder="FSH value"
                                        value={pcosData.fsh}
                                        onChange={handleChange}
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">AMH</label>
                                    <input
                                        type="number"
                                        name="amh"
                                        className="form-input"
                                        placeholder="AMH value"
                                        value={pcosData.amh}
                                        onChange={handleChange}
                                        step="0.01"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">BMI</label>
                                    <input
                                        type="number"
                                        name="bmi"
                                        className="form-input"
                                        placeholder="BMI"
                                        value={pcosData.bmi}
                                        onChange={handleChange}
                                        step="0.1"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Height (cm)</label>
                                <input
                                    type="number"
                                    name="height"
                                    className="form-input"
                                    placeholder="Height in cm"
                                    value={pcosData.height}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        name="pcosHistory"
                                        checked={pcosData.pcosHistory}
                                        onChange={handleChange}
                                        style={{ width: "20px", height: "20px" }}
                                    />
                                    <span className="form-label" style={{ margin: 0 }}>PCOS Family History</span>
                                </label>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: "fit-content", marginTop: "0.5rem" }}>
                                SAVE
                            </button>
                        </form>
                    </div>
                </div>

                <div>
                    <div className="card" style={{ marginBottom: "2rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Upload Ultrasound Image</h3>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            className="form-input"
                        />
                    </div>

                    <div className="card" style={{ 
                        backgroundColor: "#fef2f2",
                        border: "2px solid var(--danger)",
                        minHeight: "250px",
                        marginBottom: "2rem"
                    }}>
                        <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
                            Image Output
                        </h3>
                        {preview ? (
                            <div style={{ 
                                width: "100%", 
                                display: "flex", 
                                justifyContent: "center",
                                padding: "1rem",
                                backgroundColor: "#fff",
                                borderRadius: "var(--radius-md)"
                            }}>
                                <img
                                    src={preview}
                                    alt="Ultrasound preview"
                                    style={{ maxWidth: "100%", maxHeight: "250px", objectFit: "contain" }}
                                />
                            </div>
                        ) : (
                            <div style={{ 
                                width: "100%", 
                                height: "150px", 
                                border: "2px dashed var(--border-color)", 
                                borderRadius: "var(--radius-md)", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                color: "var(--text-muted)" 
                            }}>
                                No image uploaded
                            </div>
                        )}
                    </div>

                    <div className="card" style={{ 
                        backgroundColor: "#fef2f2",
                        border: "2px solid var(--danger)",
                        minHeight: "120px"
                    }}>
                        <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
                            Prediction Description
                        </h3>
                        <p style={{ color: "var(--text-muted)" }}>
                            Run analysis to view prediction results
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}
