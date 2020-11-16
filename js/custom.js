// This changes everything
"use strict";
let isLoading = false;
let percent = [ 
        0, 52, 70, 82, 68,
        0, 50, 65, 87, 75, 80,
        0, 60, 90, 88, 72, 76,
        0, 72, 60, 70
    ]
function percentage(){
    if (!isLoading) {
        isLoading = true;
        let element = document.querySelector(".bars");
        for (let index = 0; index < element.children.length; index++) {
            let barLoad = element.children[index].children[1]
            let width = 1;

        const barStyle = (time, color) => {
            barLoad.style.transition = `${time}ms`;
            barLoad.style.background = color;
        };

        let startFrame = setInterval(function () {
            if (width >= percent[index]) {
                clearInterval(startFrame);
                isLoading = false;
                barStyle(500, "#337ab7");
            } else if(width >= percent[index] / 2){
                width++;
                barLoad.style.width = `${width}%`;
                barStyle("", "green");
            }else {
                width++;
                barLoad.style.width = `${width}%`;
                barStyle("", "lightgreen");
            }
        }, 25);
        }
        
        
        
    }
}
function SubForm (){
    $.ajax({
        url:'https://api.apispreadsheets.com/data/3607/',
        type:'post',
        data:$("#contact").serializeArray(),
        success: function(){
            Swal.fire({
                icon: 'success',
                title: 'Sended!',
                text: 'Data recorded successfully!'
              })
        },
        error: function(){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while recording the data. Please try again.'
              })
        }
    });
}