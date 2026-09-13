import Phaser from 'phaser';
import { BITE_MAX_WAIT, BITE_MIN_WAIT } from './config.js';
import { selectRarity } from './rarity.js';

const State = {
  CAST: 'CAST',
  WAIT: 'WAIT',
  BITE: 'BITE',
};

const STATE_COLORS = {
  [State.CAST]: '#ffffff',
  [State.WAIT]: '#ffff00',
  [State.BITE]: '#00ff00',
};

const CAST_PRESENTATION_MS = 500;
const WAIT_MS_MIN = BITE_MIN_WAIT * 1000;
const WAIT_MS_MAX = BITE_MAX_WAIT * 1000;

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  backgroundColor: '#1e90ff',
  scene: {
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

      this.setFishingState(State.CAST);
      this.time.delayedCall(CAST_PRESENTATION_MS, this.enterWait, [], this);
    },

    enterWait() {
      this.setFishingState(State.WAIT);
      const waitMs = Phaser.Math.Between(WAIT_MS_MIN, WAIT_MS_MAX);
      this.time.delayedCall(waitMs, this.enterBite, [], this);
    },

    enterBite() {
      this.setFishingState(State.BITE);
      this.currentRarity = selectRarity();
      this.rarityText.setText(`Rareza: ${this.currentRarity.label}`);
    },

    setFishingState(state) {
      this.stateText.setText(`Estado: ${state}`).setColor(STATE_COLORS[state]);
    },
  },
};

new Phaser.Game(config);