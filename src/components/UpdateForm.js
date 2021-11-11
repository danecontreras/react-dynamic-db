import React, { Component } from 'react'
import axios from 'axios'
import style from '../styles/updateForm.module.css'
import formStyle from '../styles/form.module.css'
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default class UpdateForm extends Component {
    constructor(props){
        super(props)
        this.state = {
           recordIdList: [],
           formData: {},
           actualId: null,
           actualRecord: {},
           dateValue: null
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
        axios.post("http://localhost:8080/" + this.props.valueTable + "/add" + this.props.valueTable[0].toUpperCase() + this.props.valueTable.slice(1).toLowerCase(), formData, {
        }).then((response) =>
            this.showSuccess()
        ).catch(error => {
            this.showError()
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
                this.setState({dateValue: null})
                this.setState({formData})
                
                
            })

    }

    handleFormChange = (e, name, isDate) => {
        
        //console.log(e.target.value) value
        //console.log(name) key

        let formData = this.state.formData;
        formData[name] = e.target.value;
        
        if(isDate)
            this.setState({dateValue: e.target.value})
            
        this.setState({formData})

    }
    
    inputTypeChecker = (name, type) => {
        if(type === "varchar" || type === "text") {

            return <input type="text" defaultValue={this.state.actualRecord[name]} id={name} name={name} onChange={(e) => this.handleFormChange(e, name, false)} maxLength="35" required></input>
        } else if(type === "int" || type === "tinyint" || type === "smallint" || type === "mediumint" || type === "bigint" || type === "integer" || type === "float" || type === "double" || type === "double precision" || type === "decimal" || type === "dec" || type === "int unsigned" || type === "tinyint unsigned" || type === "smallint unsigned" || type === "mediumint unsigned" || type === "bigint unsigned") {
       
            return <input type="number" defaultValue={this.state.actualRecord[name]}  id={name} name={name}onChange={(e) => this.handleFormChange(e, name, false)} maxLength="35" required></input>
        } else if(type === "timestamp") {
            if(this.state.actualRecord[name] !== undefined){
                if(this.state.dateValue === null){
                    this.setState({dateValue: this.state.actualRecord[name].substring(0, this.state.actualRecord[name].length-5)})
                }
                return <input type="datetime-local" value={this.state.dateValue} id={name} name={name} onChange={(e) => this.handleFormChange(e, name, true)} required></input>
            } else {
                return  <input type="datetime-local" value={this.state.dateValue} id={name} name={name} onChange={(e) => this.handleFormChange(e, name, true)} required></input>
            }
        }
    }

    showSuccess() {
        this.toast.show({severity: 'success', summary: 'Aggiornato con successo! '});
    }

    showError(error) {
        this.toast.show({severity: 'error', summary: "C'è stato un errore :( "});
    }

    render() {
        return (
            <>
                <Toast ref={(el) => this.toast = el} />
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
                                        {this.inputTypeChecker(propertiesColumn.name, propertiesColumn.type)}
                                    </div>
                                )
                        }
                        <button type="button" onClick={(e) => this.submitForm(this.state.formData)}>Save</button>
                    </div>
                </div>
            </>
        )
    }
}

