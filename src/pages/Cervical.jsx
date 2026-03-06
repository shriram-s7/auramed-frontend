import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Cervical() {
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

            const response = await axios.post(
                "https://dle4nmrf06.execute-api.eu-north-1.amazonaws.com/predict/cervical",
                formData
            );

            setResult(response.data);

            if (patientData) {
                const record = {
                    ...patientData,
                    disease: "Cervical Cancer",
                    result: response.data.prediction
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

    const classes = [
        { name: "Normal", description: "Healthy epithelial cells with no abnormal morphology." },
        { name: "Parabasal", description: "Cells often seen during hormonal changes or inflammation. Found in the deeper layers of the epithelium." },
        { name: "Intermediate", description: "Cells from the middle layer of the squamous epithelium, typically presenting with a folded or boat shape." },
        { name: "Superficial", description: "Mature cells from the outermost layer of the epithelium, often seen during the estrogen-dominant phase." },
        { name: "Dysplastic", description: "Pre-cancerous abnormal cells requiring immediate further clinical investigation and biopsy." }
    ];

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h1 className="page-title" style={{ fontSize: "2rem" }}>AURA-MED – Cervical Cancer</h1>
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
                    <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Upload Microscopic Sample</h3>
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                <div className="card" style={{
                    backgroundColor: "#fef2f2",
                    border: "2px solid var(--danger)",
                    minHeight: "300px"
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
                                alt="Microscopic sample preview"
                                style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
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
                    backgroundColor: "#fef2f2",
                    border: "2px solid var(--danger)",
                    minHeight: "300px"
                }}>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
                        Output Description
                    </h3>
                    {loading ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "2rem" }}>
                            <div style={{
                                width: "40px",
                                height: "40px",
                                border: "4px solid var(--border-color)",
                                borderTop: "4px solid var(--danger)",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite"
                            }} />
                            <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Running AI Analysis...</p>
                            <style>{`
                                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                            `}</style>
                        </div>
                    ) : result ? (
                        <div style={{ padding: "1rem" }}>
                            <p style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Prediction: {result.prediction}
                            </p>
                            <div style={{
                                fontSize: "2rem",
                                fontWeight: "700",
                                color: result.prediction === 'Normal' ? 'var(--success)' :
                                    result.prediction === 'Dysplastic' ? 'var(--danger)' : 'var(--warning)'
                            }}>
                                {result.prediction}
                            </div>
                            <p style={{ fontSize: "1rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                                Confidence: {(result.confidence * 100).toFixed(2)}%
                            </p>
                        </div>
                    ) : (
                        <div style={{ color: "var(--text-muted)", padding: "2rem", textAlign: "center" }}>
                            Upload an image and run the analysis to view results.
                        </div>
                    )}
                </div>
            </div>

            <div className="card" style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Cervical Class Information</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                    {classes.map((c, index) => (
                        <div key={index} style={{
                            padding: "1rem",
                            borderLeft: `4px solid ${c.name === 'Normal' ? 'var(--success)' : c.name === 'Dysplastic' ? 'var(--danger)' : 'var(--warning)'}`,
                            backgroundColor: "#f8fafc",
                            borderRadius: "0 var(--radius-sm) var(--radius-sm) 0"
                        }}>
                            <h4 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>{c.name}</h4>
                            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>{c.description}</p>
                        </div>
                    ))}
                </div>
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
