import "../styles/popup.style.css"

const Popup = ({x,x,data}) => {
    return <span className="popup" style={{left:x,top:y-90}}>{data.name}</span>
}

export default Popup;