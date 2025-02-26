
import styles from "./css/Profile.module.css";
import "../../App.css";
import SideBar from "../componentSM/Sidebar";


function Profile(){
return(
    <>
   <div className={styles.body}>
    <SideBar/>
    <div className={styles.content}>
    <div className={styles.container}>
        <h1>Profile</h1>

        <form action="" className={styles.FormContainer}>
        <div className={styles.inputArea}>
            <label className={styles.labelText}>Name</label>
            <input type="text" name="name" className={styles.inputBox} />
        </div>
        <div className={styles.inputArea}>
            <label className={styles.labelText}>Email</label>
            <input type="text" name="name" className={styles.inputBox}  />
        </div>          
        <div className={styles.inputArea}>
            <label className={styles.labelText}>Password</label>
            <input type="text" name="name" className={styles.inputBox}   />
        </div>
        </form>

        <div className={styles.buttons}>
            <div className={styles.deleteButton}>
                Delete Account
            </div>
            <div className={styles.saveChanges}>
                Save Changes
            </div>
        </div>
    </div>
    </div>
   </div>
    
    </>
)
}


export default Profile;