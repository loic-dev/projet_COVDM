import { Fragment } from "react"
import '../styles/loader.style.scss';

const Loader = ({type}) => {
   


    return (
        type === "first" ? <div>
            <svg className="loader" viewBox="0 0 24 24">
                <circle className="loader__value" cx="12" cy="12" r="10" />
                <circle className="loader__value" cx="12" cy="12" r="10" />
                <circle className="loader__value" cx="12" cy="12" r="10" />
                <circle className="loader__value" cx="12" cy="12" r="10" />
                <circle className="loader__value" cx="12" cy="12" r="10" />
                <circle className="loader__value" cx="12" cy="12" r="10" />
            </svg>
            <p className="loader_text">Loading</p>
        </div> :  <svg className="loader" viewBox="0 0 24 24">
        <circle className="loader__value" cx="12" cy="12" r="10" />
                <circle className="loader__value" cx="12" cy="12" r="10" />
                <circle className="loader__value" cx="12" cy="12" r="10" />
                <circle className="loader__value" cx="12" cy="12" r="10" />
                <circle className="loader__value" cx="12" cy="12" r="10" />
                <circle className="loader__value" cx="12" cy="12" r="10" />
            </svg>

    )
}

export default Loader;