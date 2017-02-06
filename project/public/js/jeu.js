var canvas, ctx, mousePos;

// Autres joueurs
var allPlayers = {};

function init() {
  canvas = document.querySelector("#myCanvas");
  ctx = canvas.getContext('2d');
  
  // Les écouteurs
  canvas.addEventListener("mousedown", traiteMouseDown);
  canvas.addEventListener("mousemove", traiteMouseMove);
  
  anime();
}

function traiteMouseDown(evt) {
}

function traiteMouseMove(evt) {

  mousePos = getMousePos(canvas, evt);

  allPlayers[username].x = mousePos.x;
  allPlayers[username].y = mousePos.y; 

  var pos = {'user':username, 'pos':mousePos}
  socket.emit('sendpos', pos);
}

function updatePlayerNewPos(newPos) {
  allPlayers[newPos.user].x = newPos.pos.x;
  allPlayers[newPos.user].y = newPos.pos.y;
}
// Mise à jour du tableau quand un joueur arrive
// ou se deconnecte
function updatePlayers(listOfPlayers) {
  allPlayers = listOfPlayers;
}

function drawPlayer(player) {
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 10;
  ctx.strokeRect(player.x, player.y, 100, 100);
}

function drawAllPlayers() {
  for(var name in allPlayers) {
    drawPlayer(allPlayers[name]);
  }
}

function getMousePos(canvas, evt) {
   var rect = canvas.getBoundingClientRect();
   return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
   };
}

function anime() {
  if(username != undefined ) {
    // 1 On efface l'écran
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2 On dessine des objets
    drawAllPlayers();
  }
  // 4 On rappelle la fonction d'animation à 60 im/s
  requestAnimationFrame(anime);
}