
var navLinks = document.getElementById("navLinks");
function showMenu() {
    navLinks.style.right="0";
}
function hideMenu() {
    navLinks.style.right="-200px";
}
const divIntermediate = document.getElementById("divForIntermediate");

var person;

fetch("username-database-response-tasks", { 
    mode: 'no-cors' 
})  .then(response => {return response.json()})
    .then(data => {
        person=data;
        
        

        fetch("courses/intermediate", { 
            mode: 'no-cors' 
        })  .then(response => {return response.json()})
            .then(data => {
                var title1="", title2="", title3="";
                var i=0;
                while(i<data.length && i<6){
                    let count=0;
                    title1="";
                    title2="";
                    title3="";
                    while(count<3&&i<data.length && i<6){
                        const number=data[i].number;
                        const maxPoints=data[i].maxPoints;
                        if(count==0){
                            title1 = `<a href="./modules/Intermediate`+number+`.html"`+ ` class="lesson-col-begintadv module2-`+number+`">`+
                            `<h3>`+data[i].display+ `</h3>` + `<p id="m2-`+number+`" value=`+maxPoints+ `></p>`+ `</a>`;
                        }
                        else
                        if(count==1){
                            title2 = `<a href="./modules/Intermediate`+number+`.html"`+ ` class="lesson-col-begintadv module2-`+number+`">`+
                            `<h3>`+data[i].display+ `</h3>` + `<p id="m2-`+number+`" value=`+maxPoints+ `></p>`+ `</a>`;
                        }
                        else{
                            title3 = `<a href="./modules/Intermediate`+number+`.html"`+ ` class="lesson-col-begintadv module2-`+number+`">`+
                            `<h3>`+data[i].display+ `</h3>` + `<p id="m2-`+number+`" value=`+maxPoints+ `></p>`+ `</a>`;
                        }
                        count++;
                        i++;
                    }
                    const title=`<div class="row">`+title1+title2+title3+`</div>`
                    divIntermediate.insertAdjacentHTML("beforeend", title)
                }
                while(i<data.length && i>=6){
                    let count=0;
                    title1="";
                    title2="";
                    title3="";
                    while(count<3&&i<data.length && i>=6){
                        const number=data[i].number;
                        const maxPoints=data[i].maxPoints;
                        var intermediateX = "Intermediate" + number;
                        if(count==0){
                            title1 = `<form action = "/`+intermediateX+`" method="POST" class = "lesson-col-begintadv module1-3">
                            <label for="Intermediate`+number+`">
                                <h3>`+data[i].display+`</h3>
                                <p id="m2-`+number+`" value=`+maxPoints+`></p>
                            </label>
                            <input type="submit" id="Intermediate`+number+`" style="display:none;"></input>
                            </form>`;
                        }
                        else
                        if(count==1){
                            title2 = `<form action = "/`+intermediateX+`" method="POST" class = "lesson-col-begintadv module1-3">
                            <label for="Intermediate`+number+`">
                                <h3>`+data[i].display+`</h3>
                                <p id="m2-`+number+`" value=`+maxPoints+`></p>
                            </label>
                            <input type="submit" id="Intermediate`+number+`" style="display:none;"></input>
                            </form>`;  
                        }
                        else{
                            title3 = `<form action = "/`+intermediateX+`" method="POST" class = "lesson-col-begintadv module1-3">
                            <label for="Intermediate`+number+`">
                                <h3>`+data[i].display+`</h3>
                                <p id="m2-`+number+`" value=`+maxPoints+`></p>
                            </label>
                            <input type="submit" id="Intermediate`+number+`" style="display:none;"></input>
                            </form>`;
                        }
                        count++;
                        i++; 
                    }
                    const titlee=`<div class="row">`+title1+title2+title3+`</div>`
                    divIntermediate.insertAdjacentHTML("beforeend", titlee)
                }
                for(let i=0;i<data.length;i++){
                    const task="task2_"+data[i].number;
                    if(person!="Eroare"&&person!=null&&person!=undefined){
                        var element=person.tasks.filter(element => element.task==task);
                        if(element!=null&&element!=undefined&&element.length>0)
                            document.getElementById("m2-"+data[i].number).insertAdjacentHTML("beforeend", (Number(element[0].value)*100/data[i].maxPoints)+"%");
                        else
                            document.getElementById("m2-"+data[i].number).insertAdjacentHTML("beforeend", "0%");
                    }
                    else 
                    {
                        document.getElementById("m2-"+data[i].number).insertAdjacentHTML("beforeend", "0%");
                    }
                }
                const length=data.length;
                setInterval(function(){
                    $.ajax({
                        type: 'GET',
                        dataType: "json",
                        url: '/ranking2',
                        success: function (data) {
                            if(data!=null&&data!=undefined){
                                document.getElementById("2rank1").innerHTML=data.name1+`<br>`+data.points1;
                                document.getElementById("2rank2").innerHTML=data.name2+`<br>`+data.points2;
                                document.getElementById("2rank3").innerHTML=data.name3+`<br>`+data.points3;
                            }
                            else
                            {
                                document.getElementById("2rank1").innerHTML=name1+`<br>`+points1;
                                document.getElementById("2rank2").innerHTML=name2+`<br>`+points2;
                                document.getElementById("2rank3").innerHTML=name3+`<br>`+points3;
                            }
                        }
                    });
                 }, 2000)
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));

fetch("get_login", { 
    mode: 'no-cors'
})  .then(response => {return response.json()})
    .then(data => {
        if(data!=null&&data!=undefined&&data.response!=null&&data.response!=undefined&&data.response==1)
            document.getElementById("my_profile").style.display="flex";
        else
            document.getElementById("my_profile").style.display="none";
    })
    .catch(err => console.log(err));

fetch("get_admin", { 
    mode: 'no-cors'
})  .then(response => {return response.json()})
.then(data => {
    if(data!=null&&data!=undefined&&data.response!=null&&data.response!=undefined&&data.response==1)
        document.getElementById("admin").style.display="flex";
    else
        document.getElementById("admin").style.display="none";
})
.catch(err => console.log(err));