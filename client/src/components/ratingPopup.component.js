import "../styles/ratingPopup.style.css"
import {Fragment, useState, useEffect} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faCheckCircle, faClock, faStar, faTimes, faTimesCircle, faUser } from "@fortawesome/free-solid-svg-icons"
import Loader from "./loader.component"
import {addRating_API} from '../Utils/api.util'
import { DragRotateHandler } from "mapbox-gl"


const RatingPopup = ({setOpenRatingPopup, rating, reload,centerName, typeCenter, centerId}) => {

    const [exitState, setExitState] = useState(false)
    const [addRating, setAddRating] = useState(false)
    const [start, setStart] = useState(true)
    const [score,setScore] = useState(0)
    const [waiting,setWaiting] = useState(0)
    const [comment,setComment] = useState("")
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [email, setEmail] = useState("")

    const [changingEtape,setChangingEtape] = useState(false)
    const [changingEtapeBack,setChangingEtapeBack] = useState(false)
    
    const [dragStartState, setdragStartState] = useState(0)

    const [ratingSuccessFull, setRatingSucessFull ] = useState(false)

    const [goodName, setGoodName ] = useState(false)
    const [goodSurname, setGoodSurname ] = useState(false)
    const [goodEmail, setGoodEmail ] = useState(false)

    const [onDrag,setOnDrag] = useState(false)

    const [load,setLoad] = useState(false)

    useEffect(() => {
        if(name.length > 0){
            setGoodName(true)
        } else {
            setGoodName(false)
        }
        if(surname.length > 0){
            setGoodSurname(true)
        } else {
            setGoodSurname(false)
        }
        if(email.length != 0){
            if(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)){
                setGoodEmail(true)
            } else {
                setGoodEmail(false)
            }
        } else {
            setGoodEmail(false)
        }
    }, [name,surname,email])



    const [etapeRating,setEtapeRating] = useState(0)

   

    useEffect(() => {
        if(addRating == true){
            setChangingEtape(true)
            setStart(false)
            setTimeout(() => {
                setChangingEtape(false)
            }, 1000);
        } else {
            setScore(0)
            setWaiting(0)
            setComment("")
            setName("")
            setSurname("")
            setEmail("")
        }
    }, [addRating])
   

    const exit = () => {
        setExitState(true)
        setTimeout(() => {
            setOpenRatingPopup(false)
        }, 1000);   
    }

    const clickOnOverlay = (e) => {
        e.preventDefault();
        if(e.target === e.currentTarget) {
            exit()
        }
    }

    const suivant = (t) => {
        if(t === "error"){
            setEtapeRating(6)
            setChangingEtape(true)
            setTimeout(() => {
                setChangingEtape(false)
            }, 1000);
        } else if(etapeRating < 5){
            setEtapeRating(etapeRating+1)
            setChangingEtape(true)
            setTimeout(() => {
                setChangingEtape(false)
            }, 1000);
        }
        
    }

    const precedent = () => {
        if(etapeRating > 0){
            setEtapeRating(etapeRating-1)
            setChangingEtapeBack(true)
            setTimeout(() => {
                setChangingEtapeBack(false)
            }, 1000);
        }
        
    }

    const valider = async () => {
        setLoad(true)
        let send = {
            name,
            surname,
            email,
            score,
            comment,
            waiting,
            typeCenter,
            centerId
        }
        if(goodName && goodSurname && goodEmail ){
            const result = await addRating_API(send)
            console.log(result)
            if(result.data.err){
                if(result.data.err === "email"){
                    console.log("error")
                    setRatingSucessFull(true)
                    suivant("error")
                    setLoad(false)
                    setTimeout(() => {
                        exit()
                    }, 2000);
                    

                }
            } else {
                setRatingSucessFull(true)
                suivant()
                reload()
                setLoad(false)
                setTimeout(() => {
                    exit()
                }, 2000);
                
                
            }
        }
        
        
    }

    const showStarsIcon = (score) => {
        var stars = [];
        for (let index = 1; index < 6; index++) {
            if(index <= score){
                stars.push(<FontAwesomeIcon className="starsIcon checked" icon={faStar} />)
            } else {
                stars.push(<FontAwesomeIcon className="starsIcon " icon={faStar} />)
            }
        }
        return stars
    }

    const addScoreIcon = (score) => {
        var stars = [];
        for (let index = 1; index < 6; index++) {
            if(index <= score){
                stars.push(<FontAwesomeIcon className="starsIcon addStarsIcon checked" onClick={() => suivant()} onMouseOver={() => setScore(index)} onMouseOut={() => setScore(0)} icon={faStar} />)
            } else {
                stars.push(<FontAwesomeIcon className="starsIcon addStarsIcon " onClick={() => suivant()} onMouseOver={() => setScore(index)} onMouseOut={() => setScore(0)} icon={faStar} />)
            }
        }
        return stars
    }

    const handleChangeComment = (e) =>{
        setComment(e.target.value)
    }

  

    const drag = (e) => {
        if(onDrag){
            e.preventDefault();
            if(e.clientX !== 0){
                let calc = e.clientX-dragStartState
                if(calc > 300){
                    calc=300
                }
                if(calc <0){
                    calc=0
                }
                setWaiting(calc)  
            }
        }
        
       
    
        
    }

    const dragStart = (e) => {
        setOnDrag(true)
        setdragStartState(e.clientX-waiting)
    }

    const dragEnd = (e) => {
        setOnDrag(false)
    }
  
    


    const showEtape = () => {
        switch (etapeRating) {
            case 0:
                return (<Fragment>
                    <h3>Donnez une note à ce centre</h3>
                    <span>{addScoreIcon(score)}</span>
                </Fragment>)
            case 1:
               return ( <Fragment>
                    <h3>Donnez votre temps d'attente</h3>
                    <div className="slide">
                        <span onMouseDown={dragStart.bind(this)} onMouseUp={dragEnd.bind(this)} onMouseMove={drag.bind(this)} style={{left:`${waiting}px`}} className="tips"></span>
                        <p>{waiting} min</p>
                    </div>
                </Fragment>)
            case 2:
                return (<Fragment>
                    <h3>Laissez un commentaire</h3>
                    <textarea className="commentTextArea" value={comment} onChange={handleChangeComment.bind(this)} />
                </Fragment>)
            case 3:
               return (<Fragment>
                    <h3>Identifiez-vous</h3>
                    <div className="headerSignOut">
                        <div>
                            <span>Prénom</span>
                            <input className="inputName" value={surname} onChange={(e) => setSurname(e.target.value)} />
                            {goodSurname === true && <div className="validIconContainer"><FontAwesomeIcon className="validIcon" icon={faCheckCircle} /></div>}
                        </div>
                        <div>
                            <span>Nom</span>
                            <input className="inputName" value={name} onChange={(e) => setName(e.target.value)}/>
                            {goodName && <div className="validIconContainer"><FontAwesomeIcon className="validIcon" icon={faCheckCircle} /></div>}
                        </div>
                        
                    </div>
                    <div className="emailSignOut">
                        <span>Email</span>
                        <input className="inputEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        {goodEmail === true && <div className="validIconContainer"><FontAwesomeIcon className="validIcon" icon={faCheckCircle} /></div>}
                    </div>
                    
                </Fragment>)
            case 4:
                return (<div className="sucessfulRating">
                    <FontAwesomeIcon className="validIcon" icon={faCheckCircle} />
                    <h3>Votre avis à bien été enregistré</h3>
                </div>)
            case 6:
                return (<div className="sucessfulRating">
                    <FontAwesomeIcon className="validIcon" icon={faTimesCircle} />
                    <h3>Tu as déja donné ton avis sur ce centre</h3>
                </div>)
            default:
                break;
        }
    }

    


    
  
    return (
    <div className={`overlay  ${exitState === true ? "exit" : ""}  `} onClick={e => clickOnOverlay(e)}>
         <div className={`ratingPopup ${ratingSuccessFull === true ? "ratingSucessful" : ""} ${start === true ? "start" : ""} ${exitState === true ? "exit" : ""} ${addRating === true ? "addRating" : ""}`}>
            {addRating === false ? <Fragment>
                    <div className="ratingPopup_head">
                        <h3 className="nameCenter">{centerName}</h3>
                        <span onClick={() => setAddRating(true)} className="letRating">Laissez un avis</span>
                    </div>
                    <div className="containComment">
                        {rating.map(r => {
                            return (
                            <div className="comment">
                                <div className="picture">
                                    <div className="userIconContainer">
                                        <FontAwesomeIcon className="userIcon" icon={faUser} />
                                    </div>
                                </div>
                                <div>
                                    <div className="headComment">
                                        <h4>{r.surname} {r.name}</h4>
                                        <div className="waiting">
                                            <FontAwesomeIcon className="clockIcon" icon={faClock} />
                                            <p>{r.waiting} min</p>
                                        </div>
                                        <div>
                                            <span>{showStarsIcon(r.score)}</span>
                                        </div>
                                    </div>
                                    <div className="c_comment">
                                        <p>{r.comment}</p>
                                    </div>
                                </div>

                                
                            
                            
                            </div>)
                        })}
                    </div>




             </Fragment>
             
            :

            <div>
                {etapeRating !== 4 && etapeRating !== 6 && <div className="ratingHeader">
                    {etapeRating !== 0 && <FontAwesomeIcon onClick={() => precedent()} className="ratingHeaderIco" icon={faArrowLeft} />}
                    <FontAwesomeIcon className="ratingHeaderIco" onClick={() => setAddRating(false)} icon={faTimes} />
                </div>}
                <div className={`ratingContain ${changingEtape == true ? "changing" : ""}   ${changingEtapeBack == true ? "changingRight" : ""}`}>
                    {showEtape()}
                </div>
                {etapeRating !== 4 && etapeRating !== 6 && <div className="footerContain">
                    
                    {load === false ? <span className={`ratingButton ${etapeRating !== 3 ? "good" : ""} ${goodName && goodSurname && goodEmail ? "good" :""}`} onClick={() => etapeRating === 3 ? goodName && goodSurname && goodEmail && valider() : suivant()}>{etapeRating === 3 ? "Valider" : "Suivant"}</span> :  <Loader type="second" />}
                </div>}

               
                


            </div>
            
            
            }
           

        </div>


    </div>)
}

export default RatingPopup;