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

    let spin=<img style={{display: 'inline-block'}} src={window.avt_object.loading_icon_url}/>

    let s=space ? <span style={{visibility, verticalAlign:'middle'}}>&nbsp;{spin}&nbsp;</span> : spin;

    center ? s=<div style={{display: 'block', textAlign: 'center', visibility}}>{spin}</div> : 0;

    return loading ?  s : (allocate_space ? s : null);
}


const avtToast = (title, description) => {

    if(!window.jQuery('.avt-toast-parent').length) {
        window.jQuery('body').append('<div class="avt-toast-parent"></div>');
    }
    
    let content = window.jQuery('\
        <div>\
            <div>\
                <div>\
                    <b>'+title+'</b>\
                    <span>'+description+'</span>\
                </div>\
            </div>\
        </div>');

    let is_hovered = false;
    content
        .mouseover(function() {
            is_hovered=true
        }).mouseout(function() {
            is_hovered=false
        }).find('.avt-toast-close').click(function() {
            content.remove();
        });

    window.jQuery('.avt-toast-parent').append(content);

    let waiter = function() {
        setTimeout(function() {
            if(content) {
                if(is_hovered) {
                    waiter();
                    return;
                }

                content.fadeOut('fast', function() {
                    window.jQuery(this).remove();
                });
            }
        }, 3000);
    }
    
    waiter();
}

const copyText=text=> {
    let $ = window.jQuery;
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();

    avtToast('Copied!', text);
}

export {Spinner, getRandomString, avtToast, copyText}