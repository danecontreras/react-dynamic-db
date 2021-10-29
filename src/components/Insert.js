import React, { Component } from 'react'
import axios from 'axios';
import style from '../styles/form.module.css'

// TODO: cambiare nome componente con uno più attinente
export default class Insert extends Component {
    constructor(props){
        super(props)
        this.state = {
           formData: null
        }
    }
    
    componentDidMount(){
        
        let formData = {}
        /*
        this.props.columnNameList.forEach(elem => {
            formData[elem] = null;
        });
        */
        this.setState({formData})
        
        
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

    handleChange = (e, columnNameList) => {
        
        //console.log(e.target.value) value
        //console.log(columnNameList) key

        let formData = this.state.formData;
        //formData[columnNameList] = e.target.value;

        this.setState({formData})
        //console.log(this.state.formData) HashMap
    }

    render() {
        return (
            <>  
                <div className={style.container}>                
                    <div className={style.form}>
                        {this.props.propertiesColumnList}

                        {this.props.propertiesColumnList.map(propertiesColumnList => 
                        <div> 
                            {/* TODO: CONVERTIRE ARRAY DI JSON IN JSONARRAY */}
                            <p>{propertiesColumnList}</p>
                            {/* TODO: dinamicizzare il tipo di input a seconda del tipo della colonna */}
                            <input type="text" id={propertiesColumnList.name} name={propertiesColumnList.name} value={propertiesColumnList.type} onChange={(e) => this.handleChange(e, propertiesColumnList.name)} maxLength="35" required></input>
                        </div>
                        )}
                   
                        <br/><br/>
                        <button type="button" onClick={(e) => this.submitForm(this.state.formData)}>Insert</button>
                    </div>
                </div>
            </>
        )
    }

    /*
        varchar = text
        timestamp = datetime-local
        int/long/double/float = number
        
    */
}
