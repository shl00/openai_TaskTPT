import bot from './assets/bot.svg';
import user from './assets/user.svg';
const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
let questions = [];
let awnsers = [];
let pCount = 0;
let loadInterval;
var name = "";
var task = "";
const taskNames = ["TaskMoralDilemma", "TaskHealthChat", "TaskSQL", "TaskTPT"];

function isValid(input){
  const regEx =   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const string = input.toLowerCase();
  if(string.match(regEx)){
    return true;
  }
  else{
    alert("Keine gültige  E-Mail-Adresse!")
    return false;
  }
}

name = window.prompt("Geben Sie Ihre E-Mail-Adresse ein:");

task = taskNames[3];
function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';
    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return (
    `
      <div class ="wrapper ${isAi && 'ai'}">
        <div class = "chat">
          <div class = "profile">
            <img 
              src ="${isAi ? bot : user}"
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div class = "message" id = ${uniqueId}>${value}</div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  chatContainer.innerHTML += chatStripe(false, data.get('promt'));
  questions[pCount] = data.get('promt');

  form.reset();

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);
  const input = name + " " + data.get('promt');
  //https://chatbot-pbxf.onrender.com
  const response = await fetch('https://chatbot-tpt.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('promt'),
      na: name,
      ta: taskNames[3],
    })

  })
  clearInterval(loadInterval);
  messageDiv.innerHTML = '';
  if (response.ok) {
    const data = await response.json();
    console.log(data.bot)
    const parsedData = data.bot.content.trim();
    awnsers[pCount] = parsedData;
    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";

    alert(err);
  }

  pCount++;
}


form.addEventListener('submit', (e) => {
  if (name.trim() != "" && isValid(name)) {
    handleSubmit(e);
  }
    else {
      name = window.prompt("Geben Sie Ihre E-Mail-Adresse ein:");
    }
  });
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    if (name.trim() != "" && isValid(name) ) {

      handleSubmit(e);
    }
      else{
        name = window.prompt("Geben Sie Ihre E-Mail-Adresse ein:");
      }
    
    }
  }

);

const click = function () {
  if (pCount >= 6) {
    alert("");
  }
  else {
    alert("Mindestens 6 prompts!");
  }
}
document.getElementById("code").addEventListener('click', click);