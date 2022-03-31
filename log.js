var submitbtnNode=document.getElementById("submitBtn");
var quesTitleNode=document.getElementById("subject");
var quesDescriptionnode=document.getElementById("question");
var allQuestionListNode=document.getElementById("dataList");
var createQuesFormNode=document.getElementById("toggleDisplay");
var questionDetailContainerNode = document.getElementById("respondQue");
var resolveQuestionCOntainerNode = document.getElementById("resolveHolder");    
var responseContainerNode = document.getElementById("respondAns");
var commentContainerNode = document.getElementById("commentHolder");
var commentatorNameNode = document.getElementById("pickName");
var commentNode = document.getElementById("pickComment");
var submitCommentNode = document.getElementById("commentBtn");
var quesSearchNode=document.getElementById("questionSearch");
var upvotebtn=document.getElementById("upvote");
var downvotebtn=document.getElementById("downvote");
var resolvebtn=document.getElementById("resolveQuestion");
var newquesformbtn=document.getElementById("newQuestionForm");
newquesformbtn.addEventListener("click",reloadpage);
function reloadpage(){
    location.reload();
}
quesSearchNode.addEventListener("keyup",function(event){
    filterRes(event.target.value);
})
//searching like in whatsapp seaching for name;
function filterRes(query){
    var allQuestions=getAllQues();
    if(query){
        clearQuestion();
        var ques=allQuestions.filter(function(question){
            if(question.title.includes(query)){
               return true;
            }
        })
    }
    else{
        clearQuestion();
        allQuestions.forEach(function(question){
               addQuesTopanel(question); 
        })
    }
    if(ques.length){
        ques.forEach(function(question){
            addQuesTopanel(question); 
     })
    }
     else{
        var title=document.createElement("h3");
        title.innerHTML="No Match Found";
        allQuestionListNode.appendChild(title);
     }
    }
function clearQuestion(){
    allQuestionListNode.innerHTML="";
}
submitbtnNode.addEventListener("click",onsubmitQuestion);
function onLoad(){
   var allQuestions=getAllQues();
   allQuestions=allQuestions.sort(function(currQues,NxtQues){
        if(currQues.Fav){
            return -1;
        }
        return 1;
   })
   allQuestions.forEach(function(question){
        addQuesTopanel(question);
   });
       
}
onLoad();
function onsubmitQuestion(){
    var question={
        title:quesTitleNode.value,
        description:quesDescriptionnode.value,
        responses:[],
        upvote:0,
        downvote:0,
        timeAt: Date.now(), //give current time in  milliseconds
        Fav: false,
    };
    saveQues(question);
    addQuesTopanel(question);
    clearQuestionForm(question);
}
function saveQues(question){
    if(question.title!="" && question.description!=""){
   var allQuestions=getAllQues(question);
   allQuestions.push(question);
   localStorage.setItem("questions",JSON.stringify(allQuestions));
    }
}
function addQuesTopanel(question){
    if(question.title!="" && question.description!=""){
    var questionContainer = document.createElement("div");
    questionContainer.setAttribute("id", question.title);
    questionContainer.style.background = "grey";
  
    var newQuestionTitleNode = document.createElement("h1");
    newQuestionTitleNode.innerHTML = question.title;
    questionContainer.appendChild(newQuestionTitleNode);
  
  
    var newQuestionDescriptionNode = document.createElement("p");
    newQuestionDescriptionNode.innerHTML = question.description;
    questionContainer.appendChild(newQuestionDescriptionNode);
    allQuestionListNode.appendChild(questionContainer);

    var upvoteTextNode = document.createElement("h3");
    upvoteTextNode.style.backgroundColor="Green";
  upvoteTextNode.innerHTML = "Upvote = "+ question.upvote
  questionContainer.appendChild(upvoteTextNode);

  var downvoteTextNode = document.createElement("h3");
  downvoteTextNode.style.backgroundColor="Red";
  downvoteTextNode.innerHTML = "Downvote = "+question.downvote;
  questionContainer.appendChild(downvoteTextNode);

  //var tm=document.createElement("h3");
  //tm.innerHTML=new Date(question.timeAt).toLocaleString();     //gives right time format
  //questionContainer.appendChild(tm);
 
  var timesago=document.createElement("p");
  timesago.style.fontSize="12px";
  questionContainer.appendChild(timesago);

  var favbtn=document.createElement("button");
  favbtn.style.backgroundColor="yellow";
  if(question.Fav){
    favbtn.innerHTML="Remove Fav";
    favbtn.style.backgroundColor="orange";
}
else{
    favbtn.innerHTML="ADD To Fav";
}
  questionContainer.appendChild(favbtn);

  favbtn.onclick=changeFavState(question,questionContainer);


  setInterval(function(){
    timesago.innerHTML="created "+convertToProperTime(question.timeAt)+" ago";
  },1000)

  var line=document.createElement("hr");
  questionContainer.appendChild(line);
  questionContainer.onclick=onQuesClick(question);
}
}
function clearQuestionForm(question){
     quesTitleNode.value="";
     quesDescriptionnode.value="";
}
function getAllQues(){
    var allQuestions=localStorage.getItem("questions");
    if(allQuestions){
        allQuestions=JSON.parse(allQuestions);
    }
    else{
        allQuestions=[];
    }
    return allQuestions;
}
function onQuesClick(question){
    return function(){
        hideQuestionPanel();
        clearQuestionDetail();
        clearresponsepanel();
        showDetails();
        addquestoRight(question);
        question.responses.forEach(function(response){
            addresponseInPanel(response);
        });
        submitCommentNode.onclick=onSubmiterspone(question);
        upvotebtn.onclick=upvoteQuestion(question);
        downvotebtn.onclick=downvoteQuestion(question);
        resolvebtn.onclick=resolveques(question);
    }
}
function changeFavState(question,con){
    return function(event){
        event.stopPropagation();
        reloadpage();
        question.Fav=!question.Fav;
        updateque(question);
        con.appendChild(star);
        if(question.Fav){
            event.target.innerHTML="Remove Fav";
            favbtn.style.backgroundColor="orange";
        }
        else{
            event.target.innerHTML="ADD To Fav";
        }
    }
}
function convertToProperTime(TimeofquesNode){
      var currTime=Date.now();
      var timesLapsed=currTime-new Date(TimeofquesNode).getTime();
      var secdiff=parseInt(timesLapsed/1000);
      var mindiff=parseInt(secdiff/60);
      var hourdiff=parseInt(mindiff/60);
      if(hourdiff==0 && mindiff==0) return secdiff+" seconds ";
      if(hourdiff==0 && mindiff!=0) return mindiff+" minutes ";
      if(hourdiff!=0 && mindiff!=0) return hourdiff+" hour ";
}
function resolveques(questiontoremove){
  return function(){
    var que=document.getElementById(questiontoremove.title);
    allQuestionListNode.removeChild(que);
    reloadpage();
   var allQuestions=getAllQues();
   allQuestions.forEach(function(question){
       if(questiontoremove.title===question.title){
        var index = allQuestions.indexOf(question)
        allQuestions.splice(index,1);
       }
   })
   localStorage.setItem("questions",JSON.stringify(allQuestions));
}
}
function upvoteQuestion(question){
    return function(){
    question.upvote++;
    updateque(question);
    upedateUI(question);
    }
}
function downvoteQuestion(question){
    return function(){
    question.downvote++;
    updateque(question);
    upedateUI(question);
    }
}
function upedateUI(question){
     var quescon=document.getElementById(question.title);
     quescon.childNodes[2].innerHTML="upvote = "+question.upvote;
     quescon.childNodes[3].innerHTML = "downvote = "+question.downvote;
}
function updateque(updatedquestion){
    var allQuestions=getAllQues();
    var revisedQuestions=allQuestions.map(function(question){
        if(updatedquestion.title===question.title){
            return updatedquestion;
        }
        return question;
    })
    localStorage.setItem("questions",JSON.stringify(revisedQuestions));
}
function onSubmiterspone(question){
    return function(){
        var response={
            name: commentatorNameNode.value,
            description: commentNode.value,
            TimeAt: Date.now()
        }
        saveresponses(question,response);
        addresponseInPanel(response);
    }
}
function hideQuestionPanel(){
  createQuesFormNode.innerHTML="";
}
function showDetails()
{
  questionDetailContainerNode.style.display = "block";
  resolveQuestionCOntainerNode.style.display = "block";
  responseContainerNode.style.display = "block";
  commentContainerNode.style.display = "block";
}
function addquestoRight(question){
    var d=document.createElement("div");
    d.style.backgroundColor="grey";
    var l=document.createElement("h2");
    l.innerHTML="QUESTIONS";
    l.style.fontSize="30px";
    var titleNode=document.createElement("h3");
    titleNode.innerHTML=question.title;
    var descriptionNode=document.createElement("p");
    descriptionNode.innerHTML=question.description;
    var timesago=document.createElement("p");
    timesago.style.fontSize="12px";
    d.appendChild(titleNode);
    d.appendChild(descriptionNode);
    d.appendChild(timesago);
    setInterval(function(){
        timesago.innerHTML="created "+convertToProperTime(question.timeAt)+" ago";
      },1000)
    questionDetailContainerNode.appendChild(l);
    questionDetailContainerNode.appendChild(d);
}
function saveresponses(updatedQuestion,response){
    if(response.name!="" && response.description!=""){  
  var allQuestions=getAllQues();
  var revisedQuestions=allQuestions.map(function(question)
  {
    if( updatedQuestion.title  === question.title)
    {
      question.responses.push(response)
    }

    return question;
  })

  localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}
}
function clearQuestionDetail(){
    questionDetailContainerNode.innerHTML="";
}
function addresponseInPanel(response){
    if(response.name!="" && response.description!=""){  
    var container=document.createElement("div");
    container.style.backgroundColor="grey";
    var l=document.createElement("label");
    l.style.fontSize="30px";
    var namePick=document.createElement("h4");
    namePick.innerHTML=response.name;
    var ansPick=document.createElement("p");
    ansPick.innerHTML=response.description;

    var timesago=document.createElement("p");
    timesago.style.fontSize="12px";

    setInterval(function(){
      timesago.innerHTML="created "+convertToProperTime(response.TimeAt)+" ago";
    },1000)

    container.appendChild(namePick);
    container.appendChild(ansPick);
    container.appendChild(timesago);
    responseContainerNode.appendChild(l);
    responseContainerNode.appendChild(container);

}
}
function clearresponsepanel(){
   responseContainerNode.innerHTML="";
}