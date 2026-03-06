import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function History() {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem("patientHistory") || "[]");
        setRecords(history.reverse());
    }, []);

    const clearHistory = () => {
        if (window.confirm("Are you sure you want to clear all patient history?")) {
            localStorage.removeItem("patientHistory");
            setRecords([]);
        }
    };

    return (
        <div style={{ paddingTop: "2rem" }}>
            <div style={{ marginBottom: "2rem" }}>
                <h1 className="page-title" style={{ fontSize: "2rem" }}>Patient History</h1>
            </div>

            <div style={{ marginBottom: "2rem" }}>
                <button 
                    className="btn btn-secondary" 
                    onClick={() => navigate("/dashboard")}
                    style={{ marginRight: "1rem" }}
                >
                    Back to Dashboard
                </button>
                {records.length > 0 && (
                    <button className="btn btn-secondary" onClick={clearHistory}>
                        Clear History
                    </button>
                )}
            </div>

            <div className="table-container">
                {records.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Patient ID</th>
                                <th>Name</th>
                                <th>Disease</th>
                                <th>Prediction</th>
                                <th>Date</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record, index) => (
                                <tr key={index}>
                                    <td style={{ fontWeight: 500 }}>{record.patientID}</td>
                                    <td>{record.patientName}</td>
                                    <td>{record.disease}</td>
                                    <td>
                                        <span style={{
                                            fontWeight: 600,
                                            color: record.result === 'Normal' ? 'var(--success)' : 
                                                   record.result === 'Dysplastic' ? 'var(--danger)' : 
                                                   record.result === 'PCOS' ? 'var(--warning)' : 'var(--text-muted)'
                                        }}>
                                            {record.result || "Pending"}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{record.date}</td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{record.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                        No patient history found. Run an analysis to store records.
                    </div>
                )}
            </div>
        </div>
    );
}
