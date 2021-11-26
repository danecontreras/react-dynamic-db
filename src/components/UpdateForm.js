import React, {useState, useRef, useEffect} from 'react'
import axios from 'axios';
import style from '../styles/form.module.css'
import { Toast } from 'primereact/toast';

function UpdateForm ({valueTable, propertiesColumnList}) {

    const[formData, setFormData] = useState({});
    const[recordIdList, setRecordIdList] = useState([]);
    const[actualId, setActualId] = useState(null);
    const[actualRecord, setActualRecord] = useState({});
    const[dateValue, setDateValue] = useState(null);
    
    const toast = useRef(null);

    useEffect(() => {
        axios.get("http://localhost:8080/" + valueTable + "/" + valueTable + "List")
            .then(res => {
                let result = res.data;
                let resList = [];

                for(let i=0; i<result.length; i++){
                    result[i] = JSON.stringify(result[i]).split(',')
                    resList.push(result[i].at(-1).replace( /^\D+/g, '').replace('}', ''))       
                }
                
                setRecordIdList(resList)
                setActualId(resList[0])
                let initialKey = result[0][0].at(-1).replace( /^\D+/g, '').replace('}', '')
                let initialValue = actualId
                let fData = {}
                fData[initialKey] = initialValue
                setFormData(fData)
                axios.get("http://localhost:8080/" + valueTable + "/get" + valueTable[0].toUpperCase() + valueTable.slice(1).toLowerCase() + "/" + actualId)
                    .then(res => {
                        setActualRecord(res.data)
                })
        })
    }, []); 

    
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

                result = JSON.stringify(result).split(',')
                let initialKey = result[0].replace( /^\D+/g, '').replace('}', '')
                let initialValue = result[0].replace( /^\D+/g, '').replace('}', '')
                console.log(result)
                console.log(initialKey)
                console.log(initialValue)
                let fData = {}
                fData[initialKey] = initialValue
                setDateValue(null)
                setFormData(fData)
                
            })
    }

    const handleChange = (e, name, isDate) => { 
        let fData = formData
        fData[name] = e.target.value
        
        if(isDate)
            setDateValue(e.target.value)
            
        setFormData(fData)
    }

    const inputTypeChecker = (name, type) => {
        if(type === "varchar" || type === "text") {
            return <input type="text" defaultValue={actualRecord[name]} id={name} name={name} onChange={(e) => handleChange(e, name, false)} maxLength="80" required></input>
        } else if(type === "int" || type === "tinyint" || type === "smallint" || type === "mediumint" || type === "bigint" || type === "integer" || type === "float" || type === "double" || type === "double precision" || type === "decimal" || type === "dec" || type === "int unsigned" || type === "tinyint unsigned" || type === "smallint unsigned" || type === "mediumint unsigned" || type === "bigint unsigned") {
            return <input type="number" defaultValue={actualRecord[name]} id={name} name={name}onChange={(e) => handleChange(e, name, false)} maxLength="35" required></input>
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

export default UpdateForm

