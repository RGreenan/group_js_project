const PubSub = require('../helpers/pub_sub.js');
const DiceView = require('./dice_view.js');

const RollView = function (rollContainer) {
  this.rollContainer = rollContainer;
  this.diceElement = new DiceView();
  this.currentPlayer;
};

RollView.prototype.bindEvents = function () {
  PubSub.subscribe('Game:current-player', (evt) => {
    this.currentPlayer = evt.detail;
    this.render(this.currentPlayer);
    this.diceElement.active = true;
  })

  PubSub.subscribe('Player:roll-result', (evt) => {

    this.diceElement.render(evt.detail.diceroll);
    // const numRolled = evt.detail;
    // const numRolledElement = document.createElement('p');
    // numRolledElement.id = "roll-result";
    // numRolledElement.textContent = `${numRolled}`;
    // this.rollContainer.appendChild(numRolledElement);

  });
};

RollView.prototype.render = function (player) {

  this.rollContainer.innerHTML = '';

  const instructionA = document.createElement('p');
  instructionA.classList.add('roll-instruction');

  const nameBold = document.createElement('strong');
  nameBold.textContent = player.name;

  const lineBreak = document.createElement('br');

  const turnLine = document.createElement('div');
  turnLine.classList.add('roll-instruction-second-line');
  turnLine.textContent = "It is your turn!"

  instructionA.appendChild(nameBold);
  instructionA.appendChild(lineBreak);
  instructionA.appendChild(turnLine);

  this.rollContainer.appendChild(instructionA);

  const rollButton = document.getElementById('dice-result');

  const rollInstruction = document.querySelector(".roll-click-text");
  rollInstruction.style.display = 'inherit';

  rollButton.addEventListener('click', (evt) => {
    if (this.diceElement.active) {
      const rollInstruction = document.querySelector(".roll-click-text");
      const turnInstruction = document.querySelector(".roll-instruction-second-line");

      rollInstruction.style.display = 'none';
      turnInstruction.style.display = 'none';
      
      PubSub.publish('RollView:dice-clicked', this.currentPlayer.id);
      // rollButton.disabled = true;
      this.diceElement.active = false;
    }
  });
};

module.exports = RollView;
