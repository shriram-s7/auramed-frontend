import { useNavigate } from "react-router-dom";

export default function Home(){

  const navigate = useNavigate();

  return(

    <div style={{textAlign:"center", marginTop:"100px"}}>

      <h1>AuraMed AI Diagnostics</h1>

      <h3>Select Disease</h3>

      <button onClick={()=>navigate("/cervical")}>
        Cervical Cancer Detection
      </button>

    </div>

  )

}