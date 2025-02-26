import React, { useState } from "react";
import styles from "./css/Login.module.css";
import LogoSide from "../../assets/LogoSide.png";
import { useNavigate } from "react-router-dom";
import api from "../../axios/api";
function Login(){
  const [Email, SetEmail] = useState<string>("");
  const [Password, SetPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async(e:React.FormEvent)=>{
    e.preventDefault();
    try {
      const response = await api.post("/Auth/Login", {
        Email, 
        Password
      });
      console.log(response.data);
      console.log(`Message: ${response.data.message}`);

      localStorage.setItem('token', response.data.token);

      navigate("/profile")
    } catch (error:any) {
      console.error(error.response?.data || "Something went wrong")
    }
  }


  return(
    <>
    <div className={styles.Container}>
      <div className={styles.col}>
        <img src={LogoSide} alt="" className="image"/>
      </div>
      <div className={styles.col}>
      <div className={styles.formContainer}>
      <div className={styles.formCol1}>
      <div className={styles.text1}>
        <h2>Glad to see you back!!</h2>
      </div>
      <form action="" className={styles.Login}>
        <input type="email" className={styles.InputBox}value={Email} onChange={(e)=> {SetEmail(e.target.value)}} placeholder="Email"/>
        <input type="password"className={styles.InputBox} value={Password} onChange={(e)=> {SetPassword(e.target.value)}} placeholder="Password"/>
      </form>
      </div>
    <div className={styles.formCol2}>
      <button onClick={handleSubmit} className={styles.submitButton}>
        Login
      </button>
      <div className={styles.lowerText}>
        <a href="#" className={styles.ThinText}>Forgot Password</a>
        <div className="createAccount">
        <a href="#" className={styles.ThinText}>Don’t have a account?</a>
        <a href="#" className={styles.LinkText}>Create Account</a>
        </div>
      </div>
    </div>
      </div>
      </div>
    </div>

    </>
  )

}

export  default Login;
