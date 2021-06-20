import React from 'react';

const getRandomString = p=>'k'+Math.random().toString(16).substring(2, 5)+new Date().getTime();

const Spinner=props=>
{
    let {
            allocate_space=false,
            space = true, 
            center= false,
            loading
        
        }=props;

    let visibility = loading ? 'visible' : 'hidden';

    let spin=<img src={window.avt_object.loading_icon_url}/>

    let s=space ? <span style={{visibility, verticalAlign:'middle'}}>&nbsp;{spin}&nbsp;</span> : spin;

    center ? s=<div style={{display: 'block', textAlign: 'center', visibility}}>{spin}</div> : 0;

    return loading ?  s : (allocate_space ? s : null);
}

export {Spinner, getRandomString}