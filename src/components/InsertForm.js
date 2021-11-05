import React, { Component } from 'react'
import axios from 'axios';
import style from '../styles/form.module.css'

// TODO: cambiare nome componente con uno più attinente
export default class InsertForm extends Component {
    constructor(props){
        super(props)
        this.state = {
           formData: {}
        }      
    }

    submitForm = async (formData) => {
        //e.preventDefault();

        axios.post("http://localhost:8080/" + this.props.valueTable + "/add" + this.props.valueTable[0].toUpperCase() + this.props.valueTable.slice(1).toLowerCase(), formData, {
        }).then((response) =>
            // TODO: TOAST PRIMEREACT per il messaggio con timeout di successo / errore
            alert("Inserito con successo")  
        ).catch(error => {
            alert('There was an error!', error);
        });
          
    }   

    handleChange = (e, name) => {
        
        //console.log(e.target.value) value
        //console.log(name) key

        let formData = this.state.formData;
        formData[name] = e.target.value;

        this.setState({formData})
        console.log(this.state.formData) 

    }

    inputTypeChecker = (name, type) => {
        if(type === "varchar" || type === "text") {
            return <input type="text" id={name} name={name} onChange={(e) => this.handleChange(e, name)} maxLength="35" required></input>
        } else if(type === "int" || type === "tinyint" || type === "smallint" || type === "mediumint" || type === "bigint" || type === "integer" || type === "float" || type === "double" || type === "double precision" || type === "decimal" || type === "dec" || type === "int unsigned" || type === "tinyint unsigned" || type === "smallint unsigned" || type === "mediumint unsigned" || type === "bigint unsigned") {
            return <input type="number" id={name} name={name}onChange={(e) => this.handleChange(e, name)} maxLength="35" required></input>
        } else if(type === "timestamp") {
            return <input type="datetime-local" id={name} name={name} onChange={(e) => this.handleChange(e, name)} required></input>
        }
        
    }
    
    render() {
        return (
            <>  
                <div className={style.container}>                
                    <div className={style.form}>
                        <h3> Insert </h3>
                        {   
                            JSON.parse(this.props.propertiesColumnList).map((propertiesColumn, i) => 
                                <div key={i}>                
                                    <label>{propertiesColumn.name}</label>
                                    {this.inputTypeChecker(propertiesColumn.name, propertiesColumn.type)}
                                </div>
                            )
                        }
                        <br/>
                        <button type="button" onClick={(e) => this.submitForm(this.state.formData)}>Save</button>
                    </div>
                </div>
            </>
        )
    }
}
