import { Fragment } from "react";
import '../styles/switcher.style.css';
const Switcher = ({switchCenter}) => {
    return (
        <div className="switcher">
            <input type="checkbox" id="switch"/>
            <label onMouseUp={() => switchCenter()} for="switch">Toggle</label>

        </div>
        
    )
}

export default Switcher;