import "../styles/popup.style.css"

const Popup = ({x,y,data}) => {
    return <span className="popup">{data.name}</span>
}

export default Popup;