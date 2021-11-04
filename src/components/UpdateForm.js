import React, { Component } from 'react'
import axios from 'axios'
import style from '../styles/updateForm.module.css'
import formStyle from '../styles/form.module.css'

export default class UpdateForm extends Component {
    constructor(props){
        super(props)
        this.state = {
           recordIdList: [],
           formData: {},
           actualId: null,
           actualRecord: {}
        }      
    }

    componentDidMount(){
        axios.get("http://localhost:8080/" + this.props.valueTable + "/" + this.props.valueTable + "List")
            .then(res => {
                let result = res.data;
                let resList = [];
                
                for(let i=0; i<result.length; i++){
                    result[i] = JSON.stringify(result[i]).split(',')
                    
                    resList.push(result[i][0].replace( /^\D+/g, ''))
                    
                }

                this.setState({recordIdList: resList})
                this.setState({actualId: resList[0]})

                let initialKey = result[0][0].replace( /[^a-zA-Z]+/g, '')
                let initialValue = this.state.actualId
                let formData = {}
                formData[initialKey] = initialValue

                this.setState({formData})

                axios.get("http://localhost:8080/" + this.props.valueTable + "/get" + this.props.valueTable[0].toUpperCase() + this.props.valueTable.slice(1).toLowerCase() + "/" + this.state.actualId)
                    .then(res => {
                        this.setState({actualRecord: res.data})
                    })
            })
    
    }

    submitForm = async (formData) => {
        //e.preventDefault();

        axios.post("http://localhost:8080/" + this.props.valueTable + "/add" + this.props.valueTable[0].toUpperCase() + this.props.valueTable.slice(1).toLowerCase(), formData, {
        }).then((response) =>
            // TODO: TOAST PRIMEREACT per il messaggio con timeout di successo / errore
            alert("Aggiornato con successo")  
        ).catch(error => {
            alert('There was an error!', error);
        });
          
    }   

    handleSelectChange = (event) => {
        
        axios.get("http://localhost:8080/" + this.props.valueTable + "/get" + this.props.valueTable[0].toUpperCase() + this.props.valueTable.slice(1).toLowerCase() + "/" + event.target.value)
            .then(res => {

                let result = res.data;
                this.setState({actualRecord: result})

                result = JSON.stringify(result).split(',')
                let initialKey = result[0].replace( /[^a-zA-Z]+/g, '')
                let initialValue = result[0].replace( /^\D+/g, '')
                let formData = {}
                formData[initialKey] = initialValue
                console.log(formData)
         
                this.setState({formData})
                
                
            })

    }

    handleFormChange = (e, name) => {
        
        //console.log(e.target.value) value
        //console.log(name) key

        let formData = this.state.formData;
        formData[name] = e.target.value;

        this.setState({formData})
        console.log(this.state.formData) 

    }
    
    inputTypeChecker = (name, type, i) => {
        if(type === "varchar" || type === "text") {
            return <input type="text" placeholder={this.state.actualRecord[name]} id={name} name={name} onChange={(e) => this.handleFormChange(e, name)} maxLength="35" required></input>
        } else if(type === "int" || type === "tinyint" || type === "smallint" || type === "mediumint" || type === "bigint" || type === "integer" || type === "float" || type === "double" || type === "double precision" || type === "decimal" || type === "dec" || type === "int unsigned" || type === "tinyint unsigned" || type === "smallint unsigned" || type === "mediumint unsigned" || type === "bigint unsigned") {
            return <input type="number" placeholder={this.state.actualRecord[name]}  id={name} name={name}onChange={(e) => this.handleFormChange(e, name)} maxLength="35" required></input>
        } else if(type === "timestamp") {
            return <input type="datetime-local" id={name} name={name} onChange={(e) => this.handleFormChange(e, name)} required></input>
        }
        
    }

    render() {
        return (
            <>
                <select onChange={this.handleSelectChange} className={style.selectContainer} ref={ref => this._select = ref}>
                    {this.state.recordIdList.map(recordId => <option value={recordId}>{recordId}</option>)}
                </select>
                <div className={formStyle.container}>                
                    <div className={formStyle.form}>
                        <h3> Update </h3>
                        {   
                                JSON.parse(this.props.propertiesColumnList).map((propertiesColumn, i) => 
                                    <div key={i}>
                                        <label>{propertiesColumn.name}</label>
                                        {this.inputTypeChecker(propertiesColumn.name, propertiesColumn.type, i)}
                                    </div>
                                )
                        }
                        <button type="button" onClick={(e) => this.submitForm(this.state.formData)}>Insert</button>
                    </div>
                </div>
            </>
        )
    }
}

