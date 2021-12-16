import React, {useState, useRef, useEffect} from 'react'
import axios from 'axios';
import style from '../styles/form.module.css'
import { Toast } from 'primereact/toast';
import jwt from 'jwt-decode'
import { connect } from 'react-redux'
import { getToken, reset } from '../redux'

function JwtAuth({dispatch}) {

    const[formData, setFormData] = useState({});
    const toast = useRef(null);
    
    useEffect(() => {
    }, []); 

    const submitForm = async (formData) => {
        //e.preventDefault();
        axios.post("http://localhost:8081/authenticate", formData, {
        }).then((response) => {
            showSuccess()
            let token = jwt(response.data.jwt)
            //console.log(token)
            //setUsername(token.sub)
            //setRolesList(token.roles)
            dispatch(getToken(token))
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
      username: state.jwtToken.username,
      roles: state.jwtToken.roles
    }
  }

export default connect(
    mapStateToProps
  )(JwtAuth)
