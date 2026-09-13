import Phaser from 'phaser';
import { BITE_MAX_WAIT, BITE_MIN_WAIT, QTE_DURATION } from './config.js';
import { selectRarity } from './rarity.js';
import { ARROWS, generateSequence } from './qte.js';

const State = {
  CAST: 'CAST',
  WAIT: 'WAIT',
  BITE: 'BITE',
  QTE: 'QTE',
  RESULT: 'RESULT',
};

const STATE_COLORS = {
  [State.CAST]: '#ffffff',
  [State.WAIT]: '#ffff00',
  [State.BITE]: '#00ff00',
  [State.QTE]: '#00ffff',
  [State.RESULT]: '#ffffff',
};

const CAST_PRESENTATION_MS = 500;
const WAIT_MS_MIN = BITE_MIN_WAIT * 1000;
const WAIT_MS_MAX = BITE_MAX_WAIT * 1000;

const KEYCODES = Phaser.Input.Keyboard.KeyCodes;

const ARROW_BY_KEYCODE = {
  [KEYCODES.UP]: 'UP',
  [KEYCODES.DOWN]: 'DOWN',
  [KEYCODES.LEFT]: 'LEFT',
  [KEYCODES.RIGHT]: 'RIGHT',
};

class FishingScene extends Phaser.Scene {
  create() {
    this.stateText = this.add
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

    this.input.keyboard.on('keydown', this.onKeyDown, this);
    this.input.keyboard.addCapture([
      KEYCODES.Z,
      KEYCODES.UP,
      KEYCODES.DOWN,
      KEYCODES.LEFT,
      KEYCODES.RIGHT,
    ]);

    this.setFishingState(State.CAST);
    this.time.delayedCall(CAST_PRESENTATION_MS, this.enterWait, [], this);
  }

  onKeyDown(event) {
    if (event.repeat) {
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
    this.time.delayedCall(waitMs, this.enterBite, [], this);
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

    this.qteTimer.remove();
    this.qteTimer = null;
    this.qteCountdownTimer.remove();
    this.qteCountdownTimer = null;

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
    this.stateText
      .setText(outcome === 'success' ? 'Estado: ÉXITO' : 'Estado: FALLO')
      .setColor(outcome === 'success' ? '#00ff00' : '#ff0000');
  }

  setFishingState(state) {
    this.fishingState = state;
    this.stateText.setText(`Estado: ${state}`).setColor(STATE_COLORS[state]);
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