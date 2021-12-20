import React, {useState, useRef, useEffect} from 'react'
import axios from 'axios';
import style from '../styles/form.module.css'
import { Toast } from 'primereact/toast';
import jwt from 'jwt-decode'
import { connect } from 'react-redux'
import { getToken, setToken, reset } from '../redux'

function JwtAuth({dispatch, token}) {

    const[formData, setFormData] = useState({});
    const toast = useRef(null);
    
    useEffect(() => {
        if (token !== '' || token !== undefined || token !== null) {
            axios.get('http://localhost:8081/verify/' + token)
            .then(res => {
                let isExpired = res.data
                if (isExpired){
                    console.log("Il token non è più valido... Verrai disconnessa dalla sessione!")
                    dispatch(reset())
                } else {
                    console.log("Il token è ancora valido :) Puoi mantenere la sessione.")
                }
            }).catch(error => 
                console.log(error)
            )
        }
    }, [token]); 

    const submitForm = async (formData) => {
        //e.preventDefault();
        axios.post("http://localhost:8081/authenticate", formData, {
        }).then((response) => {
            showSuccess()
            let decodedToken = jwt(response.data.jwt)
            //var date = new Date(decodedToken.exp);
            //console.log(date.toUTCString())
            //console.log(decodedToken)
            //setUsername(token.sub)
            //setRolesList(token.roles)
            dispatch(setToken(response.data.jwt))
            dispatch(getToken(decodedToken))
        }).catch(error => {
            showError()
        });
          
    } 

    const handleChange = (e, name) => { 
        let fData = formData
        fData[name] = e.target.value
        setFormData(fData)
    }

    const showSuccess = () => {
        toast.current.show({severity: 'success', summary: 'Autenticato con successo! '});
    }

    const showError = (error) => {
        toast.current.show({severity: 'error', summary: "C'è stato un errore :( "});
    }
    
    const logout = () => {
        toast.current.show({severity: 'success', summary: 'Sloggato con successo! '});
        dispatch(reset()) 
    }

    return (
        <div>
             <Toast ref={toast} />
            <div className={style.container}>                
                <div className={style.form}>
                    <h3 className={style.h3}> Login </h3>
                    <form>
                        <div>
                            <label>Username</label>
                            <input type="text" id="username" name="username" onChange={(e) => handleChange(e, "username")} maxLength="40" required></input>
                        </div>
                        <div>
                            <label>Password</label>
                            <input type="password" id="password" name="password" onChange={(e) => handleChange(e, "password")} maxLength="40" required></input>
                        </div>
                        <br/>
                        <button type="button" className={style.submitButton} onClick={(e) => submitForm(formData)}>Login</button>
                        <button type="button" className={style.logoutButton} onClick={(e) => logout()}>Logout</button>
                        
                    </form>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
      token: state.jwtToken.token,
      username: state.jwtToken.username,
      roles: state.jwtToken.roles
    }
  }

export default connect(
    mapStateToProps
  )(JwtAuth)
