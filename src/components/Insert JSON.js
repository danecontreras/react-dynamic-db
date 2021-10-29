import React, { Component } from 'react'
import axios from 'axios';
import style from '../styles/form.module.css'

export default class Insert extends Component {
    constructor(props){
        super(props)
        this.state = {
            
        }
    }

    
        /*
        let dict = {};
        formData.forEach((value, key) => object[key] = value);
        var json = JSON.stringify(object);
        axios.post("http://localhost:8080/sakila/addActor", json)
        .then(res => {
            
        }) 
        */
    
    submitForm = (e) => {

        let formData = new FormData(document.querySelector("form"))
        var object = {};
        formData.forEach(function(value, key){
            object[key] = value;
        });
        var json = JSON.stringify(object);

        axios.post("http://localhost:8080/" + this.props.valueTable + "/addActor", json, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) =>
            alert("Inserito con successo")  
        )
        
    }

    render() {
        return (
            <>  
                <div className={style.container}>                
                    <form className={style.form} onSubmit={(e) => this.submitForm(e)}>
                        {this.props.columnNameList.map(columnNameList => 
                        <>
                            <p>{columnNameList}</p>
                            <input type="text" id={columnNameList} name={columnNameList} maxLength="35" required></input>
                        </>
                        )}
                        <br/><br/>
                        <button type="submit">Insert</button>
                    </form>
                </div>
            </>
        )
    }

    /*
        varchar = text
        timestamp = calendar (vedere doc calendar tag)
        int/long/double/float = numeric
        
    */
}
