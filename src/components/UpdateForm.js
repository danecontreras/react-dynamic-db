import React, {useState, useRef, useEffect} from 'react'
import axios from 'axios';
import style from '../styles/form.module.css'
import { Toast } from 'primereact/toast';

function UpdateForm ({valueTable, propertiesColumnList}) {

    const[formData, setFormData] = useState({});
    const[recordIdList, setRecordIdList] = useState([]);
    const[actualRecord, setActualRecord] = useState({});
    const[dateValue, setDateValue] = useState(null);
    
    const toast = useRef(null);

    useEffect(() => {
        //chiamata rest per prendere gli elementi dal Database
        axios.get("http://localhost:8080/" + valueTable + "/" + valueTable + "List")
            .then(res => {
                let result = res.data;
                let resList = [];

                //Prendo la lista di ID dalla tabella
                for(let i=0; i<result.length; i++){
                    resList.push(result[i][Object.keys(result[i])[0]])       
                }

                //Assegno la lista allo state
                setRecordIdList(resList)

                //Chiamata resto per prendere il primo record al carimento della pagina
                axios.get("http://localhost:8080/" + valueTable + "/get" + valueTable[0].toUpperCase() + valueTable.slice(1).toLowerCase() + "/" + resList[0].toString())
                    .then(res => {
                        let result = res.data
                        setActualRecord(result)
                        setFormData(result)
                })
        })
    }, []); 

    //Chiamata POST per inserire i valore dalla form nel Database
    const submitForm = async (formData) => {
        axios.post("http://localhost:8080/" + valueTable + "/add" + valueTable[0].toUpperCase() + valueTable.slice(1).toLowerCase(), formData, {
        }).then((response) => {
            showSuccess()
        }).catch(error => {
            showError()
        });
          
    } 

    const handleSelectChange = (event) => {
        axios.get("http://localhost:8080/" + valueTable + "/get" + valueTable[0].toUpperCase() + valueTable.slice(1).toLowerCase() + "/" + event.target.value)
            .then(res => {

                let result = res.data;
                setActualRecord(result)

                setDateValue(null)
                setFormData(result)
                
                
            })
            //svuoto il value di ogni paramatro per far vedere il placeholder
            JSON.parse(propertiesColumnList).map((propertiesColumn) => 
                    document.forms["myForm"][propertiesColumn.name].value = ""
                )
    }

    const handleChange = (e, name, isDate) => { 
        let fData = formData
        fData[name] = e.target.value
        
        if(isDate)
            setDateValue(e.target.value)
        
        console.log(fData)
        setFormData(fData)
    }

    const inputTypeChecker = (name, type) => {
        if(type === "varchar" || type === "text") {
            return <input className={style.input} type="text" placeholder={actualRecord[name]} id={name} name={name} onChange={(e) => handleChange(e, name, false)} maxLength="80" required></input>
        } else if(type === "int" || type === "tinyint" || type === "smallint" || type === "mediumint" || type === "bigint" || type === "integer" || type === "float" || type === "double" || type === "double precision" || type === "decimal" || type === "dec" || type === "int unsigned" || type === "tinyint unsigned" || type === "smallint unsigned" || type === "mediumint unsigned" || type === "bigint unsigned") {
            return <input type="number" placeholder={actualRecord[name]} id={name} name={name}onChange={(e) => handleChange(e, name, false)} maxLength="35" required></input>
        } else if(type === "timestamp") {
            if(actualRecord[name] !== undefined){   
                if(dateValue === null){
                    setDateValue(actualRecord[name].substring(0, actualRecord[name].length-5)) 
                }
                return <input type="datetime-local" value={dateValue} id={name} name={name} onChange={(e) => handleChange(e, name, true)} required></input>
            } else {
                return  <input type="datetime-local" value={dateValue} id={name} name={name} onChange={(e) => handleChange(e, name, true)} required></input>
            }
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
            
            <select onChange={(e) => handleSelectChange(e)} className={style.selectContainer} >
                {recordIdList.map(recordId => <option value={recordId}>{recordId}</option>)}
            </select>

            <div className={style.container}>                
                <div className={style.form}>
                    <h3 className={style.h3}> Update </h3>
                    <form name = "myForm">
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

export default UpdateForm

