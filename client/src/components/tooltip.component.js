import "../styles/tooltip.style.css"

const Tooltip = ({x,y,data}) => {
    
  
    return <span className="tooltip" style={{left:x,top:y}}>{data.name}</span>
}

export default Tooltip;