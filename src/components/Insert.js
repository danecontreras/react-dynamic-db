import React, {useState, useRef} from 'react'
import axios from 'axios';
import style from '../styles/form.module.css'
import { Toast } from 'primereact/toast';

function Insert ({valueTable, propertiesColumnList}) {

    const[formData, setFormData] = useState({});
    const toast = useRef(null);

    const submitForm = async (formData) => {
        //e.preventDefault();
        axios.post("http://localhost:8080/" + valueTable + "/add" + valueTable[0].toUpperCase() + valueTable.slice(1).toLowerCase(), formData, {
        }).then((response) => {
            showSuccess()
        }).catch(error => {
            showError()
        });
          
    } 

    const handleChange = (e, name) => { 
        let fData = formData
        fData[name] = e.target.value
        setFormData(fData)
        console.log(formData)
    }

    const inputTypeChecker = (name, type) => {
        if(type === "varchar" || type === "text") {
            return <input type="text" id={name} name={name} onChange={(e) => handleChange(e, name)} maxLength="80" required></input>
        } else if(type === "int" || type === "tinyint" || type === "smallint" || type === "mediumint" || type === "bigint" || type === "integer" || type === "float" || type === "double" || type === "double precision" || type === "decimal" || type === "dec" || type === "int unsigned" || type === "tinyint unsigned" || type === "smallint unsigned" || type === "mediumint unsigned" || type === "bigint unsigned") {
            return <input type="number" id={name} name={name}onChange={(e) => handleChange(e, name)} maxLength="35" required></input>
        } else if(type === "timestamp") {
            return <input type="datetime-local" id={name} name={name} onChange={(e) => handleChange(e, name)} required></input>
        }
    }

    const showSuccess = () => {
        toast.current.show({severity: 'success', summary: 'Inserito con successo! '});
    }

    const showError = (error) => {
        toast.current.show({severity: 'error', summary: "C'è stato un errore :( "});
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className={style.container}>                
                <div className={style.form}>
                    <h3 className={style.h3}> Insert </h3>
                    <form>
                        {JSON.parse(propertiesColumnList).map((propertiesColumn, i) => 
                            <div key={i}>
                                <label>{propertiesColumn.name}</label>
                                {inputTypeChecker(propertiesColumn.name, propertiesColumn.type)}
                            </div>)}
                            <br/>
                                <button type="button" className={style.submitButton} onClick={(e) => submitForm(formData)}>Save</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Insert
