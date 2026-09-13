import Phaser from 'phaser';
import { BITE_MAX_WAIT, BITE_MIN_WAIT, GAME_DURATION, QTE_DURATION } from './config.js';
import { selectRarity } from './rarity.js';
import { ARROWS, generateSequence } from './qte.js';

const State = {
  CAST: 'CAST',
  WAIT: 'WAIT',
  BITE: 'BITE',
  QTE: 'QTE',
  RESULT: 'RESULT',
  GAME_OVER: 'GAME_OVER',
};

const STATE_COLORS = {
  [State.CAST]: '#ffffff',
  [State.WAIT]: '#ffff00',
  [State.BITE]: '#00ff00',
  [State.QTE]: '#00ffff',
  [State.RESULT]: '#ffffff',
  [State.GAME_OVER]: '#ff0000',
};

const CAST_PRESENTATION_MS = 500;
const RESULT_FEEDBACK_MS = 1500;
const WAIT_MS_MIN = BITE_MIN_WAIT * 1000;
const WAIT_MS_MAX = BITE_MAX_WAIT * 1000;

const KEYCODES = Phaser.Input.Keyboard.KeyCodes;

const ARROW_BY_KEYCODE = {
  [KEYCODES.UP]: 'UP',
  [KEYCODES.DOWN]: 'DOWN',
  [KEYCODES.LEFT]: 'LEFT',
  [KEYCODES.RIGHT]: 'RIGHT',
};

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const rest = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${rest}`;
}

class FishingScene extends Phaser.Scene {
  create() {
    this.money = 0;
    this.gameEndTime = this.time.now + GAME_DURATION * 1000;
    this.hudLastSecond = GAME_DURATION;

    this.hudMoneyText = this.add
      .text(20, 30, `Dinero: $${this.money}`, {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0, 0);

    this.hudTimeText = this.add
      .text(400, 30, `Tiempo: ${formatTime(GAME_DURATION)}`, {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0.5, 0);

    this.hudStateText = this.add
      .text(780, 30, '', {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#ffffff',
      })
      .setOrigin(1, 0);

    this.messageText = this.add
      .text(400, 260, '', {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.rarityText = this.add
      .text(400, 320, '', {
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.sequenceText = this.add
      .text(400, 370, '', {
        fontSize: '32px',
        fontFamily: 'monospace',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.progressText = this.add
      .text(400, 410, '', {
        fontSize: '20px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.qteTimerText = this.add
      .text(400, 440, '', {
        fontSize: '20px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.gameOverTitleText = this.add
      .text(400, 200, 'PARTIDA TERMINADA', {
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#ff0000',
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.gameOverMoneyText = this.add
      .text(400, 280, '', {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.gameOverHintText = this.add
      .text(400, 340, 'Presiona ENTER para reiniciar', {
        fontSize: '24px',
        color: '#ffff00',
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.input.keyboard.on('keydown', this.onKeyDown, this);
    this.input.keyboard.addCapture([
      KEYCODES.Z,
      KEYCODES.UP,
      KEYCODES.DOWN,
      KEYCODES.LEFT,
      KEYCODES.RIGHT,
      KEYCODES.ENTER,
    ]);

    this.startNewGame();
  }

  update() {
    if (this.fishingState === State.GAME_OVER) {
      return;
    }

    const remainingMs = Math.max(0, this.gameEndTime - this.time.now);
    const remainingSeconds = Math.ceil(remainingMs / 1000);

    if (remainingSeconds !== this.hudLastSecond) {
      this.hudLastSecond = remainingSeconds;
      this.hudTimeText.setText(`Tiempo: ${formatTime(remainingSeconds)}`);
    }

    if (this.isTimeUp()) {
      this.endGame();
    }
  }

  startCastCycle() {
    this.currentRarity = null;
    this.rarityText.setText('');
    this.messageText.setText('');
    this.setFishingState(State.CAST);
    this.castTimer = this.time.delayedCall(CAST_PRESENTATION_MS, this.enterWait, [], this);
  }

  onKeyDown(event) {
    if (event.repeat) {
      return;
    }

    if (this.fishingState === State.GAME_OVER) {
      if (event.keyCode === KEYCODES.ENTER) {
        this.startNewGame();
      }
      return;
    }

    if (this.fishingState === State.BITE && event.keyCode === KEYCODES.Z) {
      this.startQte();
      return;
    }

    if (this.fishingState === State.QTE) {
      const arrow = ARROW_BY_KEYCODE[event.keyCode];
      if (arrow !== undefined) {
        this.handleQteInput(arrow);
      }
    }
  }

  enterWait() {
    this.setFishingState(State.WAIT);
    const waitMs = Phaser.Math.Between(WAIT_MS_MIN, WAIT_MS_MAX);
    this.waitTimer = this.time.delayedCall(waitMs, this.enterBite, [], this);
  }

  enterBite() {
    this.setFishingState(State.BITE);
    this.currentRarity = selectRarity();
    this.rarityText.setText(`Rareza: ${this.currentRarity.label}`);
  }

  startQte() {
    this.setFishingState(State.QTE);
    this.sequence = generateSequence(this.currentRarity.sequenceLength);
    this.qteIndex = 0;
    this.qteStartTime = this.time.now;

    this.qteTimer = this.time.addEvent({
      delay: QTE_DURATION * 1000,
      callback: this.onQteTimeout,
      callbackScope: this,
    });

    this.qteCountdownTimer = this.time.addEvent({
      delay: 1000,
      repeat: QTE_DURATION - 1,
      callback: this.updateQteCountdown,
      callbackScope: this,
    });

    this.updateQteDisplay();
  }

  onQteTimeout() {
    if (this.fishingState === State.QTE) {
      this.resolveQte('timeout');
    }
  }

  handleQteInput(arrow) {
    if (arrow === this.sequence[this.qteIndex]) {
      this.qteIndex++;

      if (this.qteIndex === this.sequence.length) {
        this.resolveQte('success');
        return;
      }

      this.updateQteDisplay();
      return;
    }

    this.resolveQte('wrongKey');
  }

  updateQteDisplay() {
    const parts = this.sequence.map((token, index) => {
      const arrow = ARROWS.find((item) => item.token === token);
      return index === this.qteIndex ? `[${arrow.symbol}]` : arrow.symbol;
    });

    this.sequenceText.setText(parts.join(' '));
    this.progressText.setText(`Paso ${this.qteIndex + 1} de ${this.sequence.length}`);
    this.updateQteCountdown();
  }

  updateQteCountdown() {
    const remainingMs = QTE_DURATION * 1000 - (this.time.now - this.qteStartTime);
    const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
    this.qteTimerText.setText(`Tiempo: ${remainingSeconds}s`);
  }

  resolveQte(outcome) {
    if (this.fishingState !== State.QTE) {
      return;
    }

    if (this.isTimeUp()) {
      this.endGame();
      return;
    }

    this.qteTimer = this.cancelTimer(this.qteTimer);
    this.qteCountdownTimer = this.cancelTimer(this.qteCountdownTimer);

    const reason = {
      success: 'completed',
      wrongKey: 'wrongKey',
      timeout: 'timeout',
    }[outcome];

    this.qteResult = {
      outcome,
      rarity: this.currentRarity,
      reason,
      sequence: this.sequence,
      stepsDone: this.qteIndex,
    };

    this.sequenceText.setText('');
    this.progressText.setText('');
    this.qteTimerText.setText('');

    this.setFishingState(State.RESULT);

    if (outcome === 'success') {
      this.money += this.currentRarity.reward;
      this.hudMoneyText.setText(`Dinero: $${this.money}`);
      this.messageText
        .setText(`ÉXITO (+${this.currentRarity.reward})`)
        .setColor('#00ff00');
    } else {
      this.messageText.setText('FALLO').setColor('#ff0000');
    }

    this.recastTimer = this.time.delayedCall(RESULT_FEEDBACK_MS, this.startCastCycle, [], this);
  }

  endGame() {
    if (this.fishingState === State.GAME_OVER) {
      return;
    }

    this.castTimer = this.cancelTimer(this.castTimer);
    this.waitTimer = this.cancelTimer(this.waitTimer);
    this.recastTimer = this.cancelTimer(this.recastTimer);
    this.qteTimer = this.cancelTimer(this.qteTimer);
    this.qteCountdownTimer = this.cancelTimer(this.qteCountdownTimer);

    this.sequenceText.setText('');
    this.progressText.setText('');
    this.qteTimerText.setText('');

    this.hudLastSecond = 0;
    this.hudTimeText.setText(`Tiempo: ${formatTime(0)}`);
    this.setFishingState(State.GAME_OVER);

    this.hudMoneyText.setVisible(false);
    this.hudTimeText.setVisible(false);
    this.hudStateText.setVisible(false);

    this.rarityText.setText('');
    this.messageText.setText('');

    this.gameOverTitleText.setVisible(true);
    this.gameOverMoneyText.setText(`Dinero total: $${this.money}`).setVisible(true);
    this.gameOverHintText.setVisible(true);
  }

  startNewGame() {
    this.money = 0;
    this.currentRarity = null;
    this.qteResult = null;
    this.sequence = null;
    this.qteIndex = 0;

    this.castTimer = this.cancelTimer(this.castTimer);
    this.waitTimer = this.cancelTimer(this.waitTimer);
    this.recastTimer = this.cancelTimer(this.recastTimer);
    this.qteTimer = this.cancelTimer(this.qteTimer);
    this.qteCountdownTimer = this.cancelTimer(this.qteCountdownTimer);

    this.gameEndTime = this.time.now + GAME_DURATION * 1000;
    this.hudLastSecond = GAME_DURATION;

    this.hudMoneyText.setVisible(true);
    this.hudTimeText.setVisible(true);
    this.hudStateText.setVisible(true);
    this.gameOverTitleText.setVisible(false);
    this.gameOverMoneyText.setVisible(false);
    this.gameOverHintText.setVisible(false);

    this.hudMoneyText.setText(`Dinero: $${this.money}`);
    this.hudTimeText.setText(`Tiempo: ${formatTime(GAME_DURATION)}`);
    this.rarityText.setText('');
    this.messageText.setText('');
    this.sequenceText.setText('');
    this.progressText.setText('');
    this.qteTimerText.setText('');

    this.startCastCycle();
  }

  isTimeUp() {
    return this.time.now >= this.gameEndTime;
  }

  cancelTimer(timer) {
    if (timer) {
      timer.remove();
    }
    return null;
  }

  setFishingState(state) {
    this.fishingState = state;
    this.hudStateText.setText(`Estado: ${state}`).setColor(STATE_COLORS[state]);
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  backgroundColor: '#1e90ff',
  scene: FishingScene,
};

new Phaser.Game(config);