console.log("hello");



const tokenjwt = JSON.parse(localStorage.getItem('token'));   

async function showgrpChatHelper(){
    let savingChats;    
    const chats = localStorage.getItem('chatHistory');
    const localGrpId=JSON.parse(localStorage.getItem('groupId'));
    const grpId = parseInt(localGrpId);
    console.log(grpId);
    try{
        if(JSON.parse(localStorage.getItem('groupId'))){
            const parsedChatHistory = JSON.parse(chats);
            const latestStoredTimestamp = parsedChatHistory.length > 10 ? parsedChatHistory[parsedChatHistory.length - 1].date_time : 0;
        
            let {data}= await axios.get(`http://localhost:8000/grpchat/${localGrpId}?timestamp=${latestStoredTimestamp}`,{headers:{"Authorization":token}});
            console.log(data.chat);
            let slicedData=parsedChatHistory.slice(data.chat.length)
            const apiChats = data.chat
            const mergedChats = [...slicedData, ...apiChats];
            savingChats = mergedChats.slice(-1000);
        }
        localStorage.setItem("chatHistory", JSON.stringify(savingChats));
        // console.log(savingChats);
          
         display(savingChats)
    }catch(err){
        console.log(err);
    }
}


async function showGroupChat(e){
    const listItem = e.target.closest('li');
    const itemId = listItem.getAttribute('id');
    console.log(listItem);
    const chatsubmit = document.getElementById('sub-button');  
    const grouptitle = document.getElementById('titleheader');
    chatsubmit.setAttribute('data-id',itemId);
   const localGrpId=localStorage.getItem('groupId');
   let messageText = "";   

    try{
        let savingChats
        if(!localGrpId || itemId!==localGrpId){
            console.log("lllllllllllllllllllll");
            let {data}= await axios.get(`http://localhost:8000/grpchat/${itemId}`,{headers:{"Authorization":tokenjwt}});
            localStorage.setItem("groupId", JSON.stringify(itemId));
            // grouptitle.innerHTML='';
            // grouptitle.innerHTML = `${targetElement.querySelector('.grpNameTag span').innerHTML} Group`
            messageText+=`      
            <div class="d-flex">
                    <div class="flex-grow-1"> ${listItem.querySelector('.grpNameTag').firstChild.textContent.trim()} Group </div>
                    <div> ${listItem.querySelector('.grpNameTag span').innerHTML}  </div>
                  <button class="btn btn-primary" id="editGroup" gropId="${itemId}">
                     <i class="bi-pen" ></i>Edit
                  </button>

            </div>
                `
            savingChats = data.chat;
            grouptitle.innerHTML=messageText;
            display(savingChats);
            
        }else{
            showgrpChatHelper();
        }

        localStorage.setItem("chatHistory", JSON.stringify(savingChats));
     
    }catch(err){
        console.log(err);
    }

    document.getElementById('editGroup').addEventListener('click',editGroup)
}
async function editGroup(e){
    // console.log("oppppppppppppp",e.target.getAttribute('gropId'));
    // console.log();
    const groupId = document.getElementById('editGroup').getAttribute('gropId');
    try{
        let {data}= await axios.get(`http://localhost:8000/group/${groupId}`,{headers:{"Authorization":tokenjwt}});
        console.log(data);
    }catch(err){

    }
}
async function showGroupsfun(){
    const parentDiv = document.getElementById('showGroupsList');
    parentDiv.innerHTML='';
    try{
        let {data}= await axios.get(`http://localhost:8000/group`,{headers:{"Authorization":tokenjwt}});
       
        data.groups[0].Groups.forEach((grp) => {
            

            const childParagraph = document.createElement('li');
            const groupTest = document.createElement('span');
            const groupMembers = document.createElement('span');
            // const editTag = document.createElement('i');
            // const editDiv = document.createElement('div');
            childParagraph.classList.add('grpItem');
            const tag= grp.name.slice(0, 2);
            childParagraph.setAttribute('data-letters',tag.toUpperCase());
           
            groupTest.textContent = `${grp.name}`;
            childParagraph.setAttribute('id',grp.id);
            // editDiv.appendChild(editTag)
            // childParagraph.appendChild(editDiv);
            // editTag.classList.add('bi-pen');
            // editDiv.setAttribute('id','editgroup')
            // editTag.innerHTML = 'edit';
            groupMembers.textContent = `${grp.numberOfMembers} Members`;
            groupTest.classList.add('grpNameTag');
            groupTest.appendChild(groupMembers);
            childParagraph.appendChild(groupTest);
            parentDiv.appendChild(childParagraph);
            
          
        });
    }catch(err){
        console.log(err);
    }
}

async function displayUsers (e){
    try{
        let {data}= await axios.get(`http://localhost:8000/auth/users`,{headers:{"Authorization":token}});
        const parentDiv = document.getElementById('showUsers');
        parentDiv.innerHTML='';
         data.users.forEach((user) => {
                const parentDiv = document.getElementById('showUsers');
                const childParagraph = document.createElement('p');
                const tag= user.name.slice(0, 2);
                
                childParagraph.setAttribute('data-letters',tag.toUpperCase());
                childParagraph.classList.add('userlist');
                childParagraph.textContent = `${user.name}`;
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.setAttribute('value', user.id);
                checkbox.setAttribute('name', "users");
                checkbox.classList.add('form-check-inline');
                childParagraph.append(checkbox)
                parentDiv.appendChild(childParagraph);
              
            });
    }catch(err){
        console.log(err);
    }
  }


  async function createGroup(){
                
    const groupname= document.getElementById('groupName').value;
    const user_list = document.getElementById('showUsers')
    console.log(user_list);
    const groupUsers = Array.from(user_list.querySelectorAll('input[name="users"]:checked')).map(checkbox => checkbox.value);
   
    const Grpdata = {
        name: groupname,
        numberOfMembers: groupUsers.length + 1,
        membersIds: groupUsers
     } 
     console.log(token); 
    try{
        let {data}= await axios.post(`http://localhost:8000/group`,Grpdata,{headers:{"Authorization":token}});
        if(data){
            showGroupsfun();
        }
    
    }catch(err){
        console.log(err);
    }
  }





document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('createGroup').addEventListener('click',displayUsers);
    document.getElementById('group-btn').addEventListener('click',createGroup);

   document.getElementById('showGroupsList').addEventListener('click',showGroupChat)


    showGroupsfun();
});

