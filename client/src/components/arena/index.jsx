import React, { Component } from 'react';
import './arena.css';
import controls from '../../constants/controls';
import Modal from '../modal';

const {
  PlayerOneAttack,
  PlayerOneBlock,
  PlayerTwoAttack,
  PlayerTwoBlock,
  PlayerOneCriticalHitCombination: crit1,
  PlayerTwoCriticalHitCombination: crit2,
} = controls;

// ******************************************

class Arena extends Component {
  //
  playerOne = this.props.rivals.fighter1;
  playerTwo = this.props.rivals.fighter2;

  playerOneInitialHealth = this.playerOne.health;
  playerTwoInitialHealth = this.playerTwo.health;

  coolDownInterval = 10000;
  events = ['keydown', 'keyup'];

  state = {
    pressedCombo1Keys: [],
    pressedCombo2Keys: [],

    playerOneCoolDown: false,
    playerTwoCoolDown: false,

    playerOneBlocks: false,
    playerTwoBlocks: false,

    playerOneHealth: this.playerOneInitialHealth,
    playerTwoHealth: this.playerTwoInitialHealth,

    winner: null,
  };

  // **************** Lifecycle ****************

  componentDidMount() {
    this.events.forEach((eventType) =>
      document.addEventListener(eventType, this.keyPressHandler)
    );
  }

  componentDidUpdate(_, prevState) {
    const {
      playerOneHealth,
      playerTwoHealth,
      playerOneCoolDown,
      playerTwoCoolDown,
    } = this.state;

    const playerOneHealthBar = document.querySelector(
      `#left-fighter-indicator`
    );
    const playerTwoHealthBar = document.querySelector(
      `#right-fighter-indicator`
    );

    // Power strike cooldown reset

    if (prevState.playerOneCoolDown !== playerOneCoolDown) {
      setTimeout(() => {
        this.setState({ playerOneCoolDown: false });
      }, this.coolDownInterval);
    }

    if (prevState.playerTwoCoolDown !== playerTwoCoolDown) {
      setTimeout(() => {
        this.setState({ playerTwoCoolDown: false });
      }, this.coolDownInterval);
    }

    // Health indicator update and/or end of fight

    if (prevState.playerOneHealth !== playerOneHealth) {
      if (playerOneHealth > 0) {
        playerOneHealthBar.style.width = `${
          (playerOneHealth * 100) / this.playerOneInitialHealth
        }%`;
      } else {
        playerOneHealthBar.style.width = '0%';
        this.setState({ winner: this.playerTwo.name });
      }
    }

    if (prevState.playerTwoHealth !== playerTwoHealth) {
      if (playerTwoHealth > 0) {
        playerTwoHealthBar.style.width = `${
          (playerTwoHealth * 100) / this.playerTwoInitialHealth
        }%`;
      } else {
        playerTwoHealthBar.style.width = '0%';
        this.setState({ winner: this.playerOne.name });
      }
    }
  }

  componentWillUnmount() {
    this.events.forEach((eventType) =>
      document.removeEventListener(eventType, this.keyPressHandler)
    );
  }

  // **************** Methods ****************

  getChance(min, max) {
    return Math.random() * (max - min) + min;
  }

  getHitPower(player) {
    const criticalHitChance = this.getChance(1, 2);
    const hitPower = (player.power / 10) * criticalHitChance;

    return hitPower;
  }

  getBlockPower(player) {
    const dodgeChance = this.getChance(1, 2);
    const blockPower = player.defense * dodgeChance;

    return blockPower;
  }

  getDamage(attacker, defender) {
    let damage;

    const hitPower = this.getHitPower(attacker);
    const blockPower = this.getBlockPower(defender);

    if (hitPower > blockPower) {
      damage = hitPower - blockPower;
    } else {
      damage = 0;
    }

    return damage;
  }

  keyPressHandler = (event) => {
    const playerOne = this.playerOne;
    const playerTwo = this.playerTwo;

    const {
      pressedCombo1Keys,
      pressedCombo2Keys,
      playerOneCoolDown,
      playerTwoCoolDown,
      playerOneBlocks,
      playerTwoBlocks,
    } = this.state;

    const { type, code, repeat } = event;

    if (repeat) return;

    if (type === 'keydown') {
      //
      // REGULAR ATTACKS

      // Player 1 regular attack
      if (!playerOneBlocks && code === PlayerOneAttack) {
        const damage = playerTwoBlocks
          ? this.getDamage(playerOne, playerTwo)
          : this.getHitPower(playerOne);

        this.setState((prevState) => {
          return { playerTwoHealth: prevState.playerTwoHealth - damage };
        });
      }

      // Player 2 regular attack
      if (!playerTwoBlocks && code === PlayerTwoAttack) {
        const damage = playerOneBlocks
          ? this.getDamage(playerTwo, playerOne)
          : this.getHitPower(playerTwo);

        this.setState((prevState) => {
          return { playerOneHealth: prevState.playerOneHealth - damage };
        });
      }

      // BLOCKS
      if (code === PlayerOneBlock) this.setState({ playerOneBlocks: true });
      if (code === PlayerTwoBlock) this.setState({ playerTwoBlocks: true });

      // COMBOS

      // Player 1 combo

      // Track if one of combo keys is pressed:
      const oneOfCombo1 =
        code === crit1[0] || code === crit1[1] || code === crit1[2];

      // If pressed, add the key to player's combo array:
      const condition =
        !playerOneCoolDown && !pressedCombo1Keys.includes(code) && oneOfCombo1;

      if (condition) {
        this.setState((prevState) => {
          return { pressedCombo1Keys: prevState.pressedCombo1Keys.push(code) };
        });
      }

      // Upon complete combo
      if (pressedCombo1Keys.length === 3) {
        const damage = playerOne.attack * 2;

        this.setState((prevState) => {
          return {
            playerTwoHealth: prevState.playerTwoHealth - damage,
            pressedCombo1Keys: [],
            playerOneCoolDown: true,
          };
        });
      }

      // Player 2 combo

      // Track if one of combo keys is pressed:
      const oneOfCombo2 =
        code === crit2[0] || code === crit2[1] || code === crit2[2];

      // If pressed, add the key to player's combo array:
      if (
        !playerTwoCoolDown &&
        oneOfCombo2 &&
        !pressedCombo2Keys.includes(code)
      ) {
        this.setState((prevState) => {
          return { pressedCombo2Keys: prevState.pressedCombo2Keys.push(code) };
        });
      }

      // Upon complete combo
      if (pressedCombo2Keys.length === 3) {
        const damage = playerTwo.attack * 2;

        this.setState((prevState) => {
          return {
            playerOneHealth: prevState.playerOneHealth - damage,
            pressedCombo2Keys: [],
            playerTwoCoolDown: true,
          };
        });
      }
    }

    if (type === 'keyup') {
      //
      // Remove key code from the combo array on keyup - player 1
      if (pressedCombo1Keys.includes(code)) {
        const index = pressedCombo1Keys.indexOf(code);

        this.setState((prevState) => {
          return {
            pressedCombo1Keys: prevState.pressedCombo1Keys.splice(index, 1),
          };
        });
      }

      // Remove key code from the combo array on keyup - player 2
      if (pressedCombo2Keys.includes(code)) {
        const index = pressedCombo2Keys.indexOf(code);

        this.setState((prevState) => {
          return {
            pressedCombo2Keys: prevState.pressedCombo2Keys.splice(index, 1),
          };
        });
      }

      // Lift block
      if (code === PlayerOneBlock) this.setState({ playerOneBlocks: false });
      if (code === PlayerTwoBlock) this.setState({ PlayerTwoBlocks: false });
    }
  };

  // **************** Render ****************

  render() {
    const { fighter1, fighter2 } = this.props.rivals;
    const { winner } = this.state;

    return (
      <div className="arena___root">
        {winner && <Modal winner={winner} onClose={this.props.onGameOver} />}

        <div className="arena___fight-status">
          {/*  */}
          <div className="arena___fighter-indicator">
            <span className="arena___fighter-name">{fighter1.name}</span>
            <div className="arena___health-indicator">
              <div
                className="arena___health-bar"
                id="left-fighter-indicator"
              ></div>
            </div>
          </div>

          <div className="arena___versus-sign"></div>

          <div className="arena___fighter-indicator">
            <span className="arena___fighter-name">{fighter2.name}</span>
            <div className="arena___health-indicator">
              <div
                className="arena___health-bar"
                id="right-fighter-indicator"
              ></div>
            </div>
          </div>
        </div>

        <div className="arena___battlefield">
          {/*  */}
          <div className="arena___fighter arena___left-fighter">
            <img
              className="fighter-preview___img"
              src={fighter1.source}
              title={fighter1.name}
              alt={fighter1.name}
            />
          </div>

          <div className="arena___fighter arena___right-fighter">
            <img
              className="fighter-preview___img"
              src={fighter2.source}
              title={fighter2.name}
              alt={fighter2.name}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Arena;
