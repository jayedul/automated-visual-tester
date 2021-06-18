import Spin from 'react-svg-spinner';

const Spinner=props=>
{
    let {
            allocate_space=false,
            space = true, 
            size  = "15px", 
            color = "gray", 
            center= false,
            loading
        
        }=props;

    let visibility = loading ? 'visible' : 'invisible';

    let spin=<Spin color={color} size={size}/>

    let s=space ? <span className={visibility}>&nbsp;{spin}&nbsp;</span> : spin;

    center ? s=<div className={"d-block text-center "+visibility}>{spin}</div> : 0;

    return loading ?  s : (allocate_space ? s : null);
}

export {Spinner}