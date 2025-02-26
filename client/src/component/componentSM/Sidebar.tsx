import { useNavigate } from "react-router-dom";
import TaskHive from "../../assets/TaskHive.png";

function SideBar() {
    const navigate = useNavigate();

    const logout = () =>{
        localStorage.removeItem("token");
        navigate("/logout");
    }
    return(
        <>
        <div className="container">
            <img src={TaskHive} alt=""  />

            <div className="menu">
                <ul>
                    <li>
                    <i className='fas fa-columns'><a href="#">DashBoard</a></i>

                    </li>
                    <li>
                    <i className='fas fa-columns'><a href="#">DashBoard</a></i>
                    </li>
                    <li>
                    <i className='fas fa-columns'><a href="#">DashBoard</a></i>

                    </li>
                </ul>
            </div>

            <div className="logout">
            <li>
                    <i className='fas fa-columns'><a onClick={logout}>Log Out</a></i>

                    </li>
            </div>

        </div>
        
        </>
    )
}


export default SideBar;