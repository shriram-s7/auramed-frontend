import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const [patientData, setPatientData] = useState({
        patientName: "",
        patientID: "",
        phone: "",
        age: "",
        date: "",
        time: ""
    });
    const [isSaved, setIsSaved] = useState(false);
    const [latestResult, setLatestResult] = useState(null);

    useEffect(() => {
        const now = new Date();
        const dateStr = now.toLocaleDateString();
        const timeStr = now.toLocaleTimeString();
        
        setPatientData(prev => ({
            ...prev,
            date: dateStr,
            time: timeStr
        }));

        const history = JSON.parse(localStorage.getItem("patientHistory") || "[]");
        if (history.length > 0) {
            setLatestResult(history[history.length - 1]);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientData(prev => ({ ...prev, [name]: value }));
        setIsSaved(false);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!patientData.patientName || !patientData.age || !patientData.patientID || !patientData.phone) {
            alert("Please fill in all fields.");
            return;
        }
        sessionStorage.setItem("currentPatient", JSON.stringify(patientData));
        setIsSaved(true);
    };

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h1 className="page-title" style={{ fontSize: "2rem" }}>AURA-MED – Dashboard</h1>
            </div>

            {latestResult && (
                <div className="card" style={{ 
                    marginBottom: "2rem", 
                    backgroundColor: "#fef2f2",
                    border: "2px solid var(--danger)"
                }}>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "var(--danger)" }}>
                        Latest Result
                    </h3>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <p style={{ margin: "0.25rem 0" }}>
                                <strong>Patient:</strong> {latestResult.patientName} ({latestResult.patientID})
                            </p>
                            <p style={{ margin: "0.25rem 0" }}>
                                <strong>Disease:</strong> {latestResult.disease}
                            </p>
                        </div>
                        <div style={{
                            fontSize: "1.5rem",
                            fontWeight: "700",
                            color: latestResult.result === 'Normal' ? 'var(--success)' : 
                                   latestResult.result === 'Dysplastic' ? 'var(--danger)' : 'var(--warning)'
                        }}>
                            {latestResult.result}
                        </div>
                    </div>
                </div>
            )}

            <div className="card" style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Patient Input Form</h2>
                
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                name="patientName"
                                className="form-input"
                                placeholder="Patient Name"
                                value={patientData.patientName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Patient ID</label>
                            <input
                                type="text"
                                name="patientID"
                                className="form-input"
                                placeholder="Patient ID"
                                value={patientData.patientID}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-input"
                                placeholder="Phone Number"
                                value={patientData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Age</label>
                            <input
                                type="number"
                                name="age"
                                className="form-input"
                                placeholder="Age"
                                value={patientData.age}
                                onChange={handleChange}
                                required
                                min="0"
                                max="120"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input
                                type="text"
                                name="date"
                                className="form-input"
                                value={patientData.date}
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Time</label>
                            <input
                                type="text"
                                name="time"
                                className="form-input"
                                value={patientData.time}
                                readOnly
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: "fit-content", marginTop: "0.5rem" }}>
                        SAVE
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <button
                    className="card disease-card"
                    onClick={() => isSaved && navigate("/breast")}
                    disabled={!isSaved}
                    style={{
                        cursor: isSaved ? "pointer" : "not-allowed",
                        opacity: isSaved ? 1 : 0.5
                    }}
                >
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🧬</div>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Breast Cancer</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        Mammogram and ultrasound analysis
                    </p>
                </button>

                <button
                    className="card disease-card"
                    onClick={() => isSaved && navigate("/cervical")}
                    disabled={!isSaved}
                    style={{
                        cursor: isSaved ? "pointer" : "not-allowed",
                        opacity: isSaved ? 1 : 0.5
                    }}
                >
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔬</div>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Cervical Cancer</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        Microscopic cell image analysis
                    </p>
                </button>

                <button
                    className="card disease-card"
                    onClick={() => isSaved && navigate("/pcos")}
                    disabled={!isSaved}
                    style={{
                        cursor: isSaved ? "pointer" : "not-allowed",
                        opacity: isSaved ? 1 : 0.5
                    }}
                >
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🩸</div>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>PCOS</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        Ultrasound and clinical data analysis
                    </p>
                </button>
            </div>

            <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <button 
                    className="btn btn-secondary" 
                    onClick={() => navigate("/history")}
                >
                    View Patient History
                </button>
            </div>
        </div>
    );
}
