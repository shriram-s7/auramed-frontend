import axios from "axios";
import { useState } from "react";

export default function UploadScan(){

  const [file,setFile] = useState(null);
  const [result,setResult] = useState(null);

  const upload = async () => {

    const formData = new FormData();
    formData.append("file",file);

    const response = await axios.post(
      "https://bnlmyh19gb.execute-api.eu-north-1.amazonaws.com/predict/cervical",
      formData
    );

    setResult(response.data.prediction);

  }

  return(

    <div>

      <input
        type="file"
        onChange={(e)=>setFile(e.target.files[0])}
      />

      <br/><br/>

      <button onClick={upload}>
        Run AI Analysis
      </button>

      {result && (
        <h2>Prediction: {result}</h2>
      )}

    </div>

  )

}