import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Breast() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [patientData, setPatientData] = useState(null);

    useEffect(() => {
        const data = sessionStorage.getItem("currentPatient");
        if (data) {
            setPatientData(JSON.parse(data));
        }
    }, []);

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
            if (!selectedFile.name.toLowerCase().endsWith('.bmp')) {
                alert("Please upload a .bmp file");
                return;
            }
            setFile(selectedFile);
            setResult(null);
        }
    };

    const runAnalysis = async () => {
        if (!file) {
            alert("Please upload a .bmp file first.");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(
                "https://bnlmyh19gb.execute-api.eu-north-1.amazonaws.com/predict/cervical",
                {
                    method: "POST",
                    body: formData
                }
            );
            
            const data = await response.json();
            const prediction = data.prediction;
            setResult(prediction);

            if (patientData) {
                const record = {
                    ...patientData,
                    disease: "Breast Cancer",
                    result: prediction
                };

                const existingHistory = JSON.parse(localStorage.getItem("patientHistory") || "[]");
                localStorage.setItem("patientHistory", JSON.stringify([...existingHistory, record]));
            }
        } catch (error) {
            console.error("Analysis Failed", error);
            alert("Analysis Failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h1 className="page-title" style={{ fontSize: "2rem" }}>AURA-MED – Breast Cancer</h1>
                {patientData && (
                    <p className="page-subtitle" style={{ marginBottom: 0 }}>
                        Patient: {patientData.patientName} ({patientData.patientID})
                    </p>
                )}
            </div>

            <div className="card" style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Image Upload</h3>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <input
                        type="file"
                        accept=".bmp"
                        onChange={handleUpload}
                        className="form-input"
                        style={{ flex: 1 }}
                    />
                    <button className="btn btn-primary">
                        Upload
                    </button>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                    Accepts .bmp file format
                </p>
            </div>

            <div className="card" style={{ 
                marginBottom: "2rem", 
                backgroundColor: "#fef2f2",
                border: "2px solid var(--danger)",
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", width: "100%", textAlign: "left" }}>
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
                            alt="Breast cancer sample preview"
                            style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }}
                        />
                    </div>
                ) : (
                    <div style={{ 
                        width: "100%", 
                        height: "200px", 
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
                marginBottom: "2rem", 
                backgroundColor: "#fef2f2",
                border: "2px solid var(--danger)",
                minHeight: "150px"
            }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
                    Output Description
                </h3>
                {loading ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{
                            width: "30px",
                            height: "30px",
                            border: "3px solid var(--border-color)",
                            borderTop: "3px solid var(--danger)",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite"
                        }} />
                        <p style={{ color: "var(--text-muted)" }}>Running AI Analysis...</p>
                        <style>{`
                            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                        `}</style>
                    </div>
                ) : result ? (
                    <div style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "var(--danger)"
                    }}>
                        {result}
                    </div>
                ) : (
                    <p style={{ color: "var(--text-muted)" }}>
                        Run analysis to view prediction results
                    </p>
                )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button 
                    className="btn btn-primary" 
                    onClick={runAnalysis}
                    disabled={loading || !file}
                    style={{ marginRight: "auto" }}
                >
                    {loading ? "Processing..." : "Run AI Analysis"}
                </button>
                <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}
