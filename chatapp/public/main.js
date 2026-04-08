const socket=io();
const clientsTotal=document.getElementById('client-total');
const messageContainer=document.getElementById('message-container');
const nameInput=document.getElementById('name-input');
const messageForm=document.getElementById('message-form');
const messageInput=document.getElementById('message-input');


socket.on('client Total',(total)=>{
    clientsTotal.innerText="Total Clients Connected:"+total;
})
messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    sendMessage(e.target.elements.message.value);

    
})
function sendMessage(e){
 
    const data={
        name:nameInput.value,
        message:e,
        dateTime:new Date()
    }
    socket.emit('message',data);
    addMessageToUI(true,data);
    messageInput.value="";

}

socket.on('chat-message',(data)=>{
    console.log(data);
    addMessageToUI(false,data);
  
})
function addMessageToUI(isOwnMessage,data){
    const element=`  <li class="${isOwnMessage?'message-right':'message-left'}">
            <p class="message">
            ${data.message}
            <span>${data.name}:${moment(data.dateTime).format('YYYY-MM-DD HH:mm')}</span>
                </p>
        </li>`
        messageContainer.innerHTML+=element;
}

