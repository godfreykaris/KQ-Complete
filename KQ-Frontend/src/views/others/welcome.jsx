
import { useState } from "react"
import Popup from "../../components/homeelements/welcome";

export default function Dashboard() {
  const [showPopup, setShowPopup] = useState(true);

  const handleClosePopup = () =>{
    setShowPopup(!showPopup);
  }

  return (
    <div>
      {showPopup && <Welcome show={showPopup} handleClose={handleClosePopup}/>}
    </div>
  )
}