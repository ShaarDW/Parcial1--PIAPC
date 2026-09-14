import Phaser from 'phaser';
import { BITE_MAX_WAIT, BITE_MIN_WAIT, GAME_DURATION, QTE_DURATION } from './config.js';
import { selectRarity } from './rarity.js';
import { generateSequence } from './qte.js';

const State = {
  CAST: 'CAST',
  WAIT: 'WAIT',
  BITE: 'BITE',
  QTE: 'QTE',
  RESULT: 'RESULT',
  GAME_OVER: 'GAME_OVER',
};

const Screen = {
  TITLE: 'TITLE',
  CONTROLS: 'CONTROLS',
  PLAY: 'PLAY',
};

const STATE_COLORS = {
  [State.CAST]: 0xffffff,
  [State.WAIT]: 0xffff00,
  [State.BITE]: 0x00ff00,
  [State.QTE]: 0x00ffff,
  [State.RESULT]: 0xffffff,
  [State.GAME_OVER]: 0xff0000,
};

const FONT_FAMILY = "'Comic Sans MS', 'Comic Sans', Cursive";

const RARITY_COLORS = {
  common: '#9fb4c7',
  rare: '#4ade80',
  epic: '#7c8cff',
  legendary: '#ffb300',
  mythic: '#ff5df0',
};

const RARITY_HEX = {
  common: 0x9fb4c7,
  rare: 0x4ade80,
  epic: 0x7c8cff,
  legendary: 0xffb300,
  mythic: 0xff5df0,
};

const TIER_LEVEL = {
  common: 0,
  rare: 1,
  epic: 2,
  legendary: 3,
  mythic: 4,
};

const FISH_STYLE = {
  common: { scale: 0.7 },
  rare: { scale: 0.8 },
  epic: { scale: 0.95 },
  legendary: { scale: 1.1 },
  mythic: { scale: 1.3 },
};

const CAST_PRESENTATION_MS = 500;
const RESULT_FEEDBACK_MS = 1500;
const WRONGKEY_RED_MS = 1000;
const WAIT_MS_MIN = BITE_MIN_WAIT * 1000;
const WAIT_MS_MAX = BITE_MAX_WAIT * 1000;

const ROD_X = 70;
const ROD_Y = 120;
const HOOK_X = 400;
const WATER_Y = 492;

const KEYCODES = Phaser.Input.Keyboard.KeyCodes;

const ARROW_BY_KEYCODE = {
  [KEYCODES.UP]: 'UP',
  [KEYCODES.DOWN]: 'DOWN',
  [KEYCODES.LEFT]: 'LEFT',
  [KEYCODES.RIGHT]: 'RIGHT',
};

const ANGLE_BY_TOKEN = {
  UP: 0,
  LEFT: -90,
  DOWN: 180,
  RIGHT: 90,
};

class FishingScene extends Phaser.Scene {
  create() {
    this.money = 0;
    this.gameEndTime = this.time.now + GAME_DURATION * 1000;
    this.marineFish = [];

    this.makeHookTexture();
    this.makeArrowTexture();
    this.makeFishTextures();

    this.shoreGfx = this.add.graphics();
    this.shoreGfx.fillStyle(0x0a3d5f, 0.5).fillRect(0, 430, 800, 40);

    this.waterGfx = this.add.graphics();
    this.waterGfx.fillStyle(0x0a4d8a, 0.55).fillRect(0, 470, 800, 130);
    this.waterGfx.fillStyle(0x7fd0ff, 0.25).fillRect(0, 470, 800, 6);

    this.seaweedGfx = this.add.graphics();
    this.makeSeaweed();

    this.rodGfx = this.add.graphics();
    this.rodGfx.lineStyle(7, 0x8b5a2b, 1);
    this.rodGfx.beginPath();
    this.rodGfx.moveTo(0, 150);
    this.rodGfx.lineTo(ROD_X, ROD_Y);
    this.rodGfx.strokePath();
    this.rodGfx.fillStyle(0x666666, 1).fillCircle(12, 136, 10);
    this.rodGfx.lineStyle(4, 0x334455, 1);
    this.rodGfx.strokeCircle(12, 136, 10);

    this.waveGfx = this.add.graphics();
    this.waveGfx.setVisible(false);

    this.lineGfx = this.add.graphics();

    this.hookImage = this.add.image(ROD_X, ROD_Y, 'hook');
    this.hookImage.setVisible(false);

    this.fishImage = this.add.image(HOOK_X, WATER_Y, 'fish-common');
    this.fishImage.setVisible(false);

    this.hudPanel = this.add.graphics();
    this.hudPanel.fillStyle(0x000000, 0.35).fillRect(0, 0, 800, 56);

    this.hudMoneyText = this.add
      .text(20, 16, `$${this.money}`, {
        fontSize: '28px',
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY,
        color: '#39ff14',
      })
      .setOrigin(0, 0)
      .setStroke('#003300', 3);

    this.hudTimeBar = this.add.graphics();
    this.updateTimeBar(GAME_DURATION * 1000);

    this.messageText = this.add
      .text(400, 260, '', {
        fontSize: '40px',
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY,
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.biteText = this.add
      .text(400, 210, '', {
        fontSize: '40px',
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY,
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.qteContainer = this.add.container(0, 0).setVisible(false);

    this.qtePanel = this.add.graphics();
    this.updateQtePanel(0xffffff);

    this.sequenceText = this.add
      .text(400, 350, '', {
        fontSize: '28px',
        fontFamily: FONT_FAMILY,
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.progressText = this.add
      .text(400, 388, '', {
        fontSize: '20px',
        fontFamily: FONT_FAMILY,
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.qteTimerText = this.add
      .text(400, 422, '', {
        fontSize: '20px',
        fontFamily: FONT_FAMILY,
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.qteProgressBar = this.add.graphics();
    this.qteTimeBar = this.add.graphics();

    this.qteContainer.add([
      this.qtePanel,
      this.sequenceText,
      this.progressText,
      this.qteTimerText,
      this.qteProgressBar,
      this.qteTimeBar,
    ]);

    this.gameOverScreen = this.add.container(0, 0).setVisible(false);

    this.gameOverPanel = this.add.graphics();
    this.gameOverPanel.fillStyle(0x000000, 0.45).fillRoundedRect(170, 130, 460, 260, 16);

    this.gameOverTitleText = this.add
      .text(400, 190, 'PARTIDA TERMINADA', {
        fontSize: '44px',
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY,
        color: '#ff4444',
      })
      .setOrigin(0.5);

    this.gameOverMoneyText = this.add
      .text(400, 260, '', {
        fontSize: '36px',
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY,
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.gameOverHintText = this.add
      .text(400, 330, 'Presiona ENTER para reiniciar', {
        fontSize: '22px',
        fontFamily: FONT_FAMILY,
        color: '#ffff00',
      })
      .setOrigin(0.5);

    this.gameOverScreen.add([
      this.gameOverPanel,
      this.gameOverTitleText,
      this.gameOverMoneyText,
      this.gameOverHintText,
    ]);

    this.titleScreen = this.add.container(0, 0);

    this.titleDecor = this.add.graphics();
    this.titleDecor.fillStyle(0x1f4f8f, 0.35).fillCircle(120, 120, 80);
    this.titleDecor.fillStyle(0x185e9e, 0.3).fillCircle(700, 500, 110);
    this.titleDecor.fillStyle(0x155e8f, 0.3).fillRoundedRect(0, 420, 800, 180, 0);

    this.titleMainText = this.add
      .text(400, 220, 'SILLY FISHING', {
        fontSize: '84px',
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY,
        color: '#ffff00',
      })
      .setOrigin(0.5)
      .setStroke('#000000', 10)
      .setShadow(5, 6, '#000000', 8, true, true);

    this.titleFish = this.add.graphics();
    this.titleFish.fillStyle(0xffcc33, 1);
    this.titleFish.fillEllipse(0, 0, 130, 74);
    this.titleFish.fillStyle(0xff9f1c, 1);
    this.titleFish.fillTriangle(-58, -22, -120, -34, -105, 8);
    this.titleFish.fillTriangle(-58, 20, -120, 34, -105, -8);
    this.titleFish.fillTriangle(-12, -30, 4, -60, 20, -30);
    this.titleFish.fillStyle(0xff9f1c, 0.85);
    this.titleFish.fillRect(-26, -32, 7, 64);
    this.titleFish.fillRect(-10, -34, 7, 68);
    this.titleFish.lineStyle(2, 0xcc8800, 1);
    this.titleFish.beginPath();
    this.titleFish.arc(-4, -6, 26, -0.7, 0.7, false);
    this.titleFish.strokePath();
    this.titleFish.lineStyle(3, 0x8a5a00, 1);
    this.titleFish.beginPath();
    this.titleFish.moveTo(50, 4);
    this.titleFish.lineTo(62, 10);
    this.titleFish.strokePath();
    this.titleFish.fillStyle(0xffffff, 1).fillCircle(38, -12, 9);
    this.titleFish.fillStyle(0x000000, 1).fillCircle(40, -12, 5);
    this.titleFish.fillStyle(0xffffff, 1).fillCircle(43, -14, 2);
    this.titleFish.setPosition(400, 330);

    this.titleSwimmerA = this.add.image(-40, 300, 'fish-rare').setAngle(-15).setScale(0.72);
    this.titleSwimmerB = this.add.image(840, 370, 'fish-epic').setAngle(15).setScale(0.6);

    this.titleHintText = this.add
      .text(400, 470, 'Presiona ENTER para continuar', {
        fontSize: '24px',
        fontFamily: FONT_FAMILY,
        color: '#ffff00',
      })
      .setOrigin(0.5);

    this.titleScreen.add([
      this.titleDecor,
      this.titleMainText,
      this.titleFish,
      this.titleSwimmerA,
      this.titleSwimmerB,
      this.titleHintText,
    ]);

    this.controlsScreen = this.add.container(0, 0).setVisible(false);

    this.controlsPanel = this.add.graphics();
    this.controlsPanel.fillStyle(0x000000, 0.35).fillRoundedRect(100, 160, 600, 320, 16);

    this.controlsTitleText = this.add
      .text(400, 130, '¿CÓMO JUGAR?', {
        fontSize: '44px',
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY,
        color: '#ffff00',
      })
      .setOrigin(0.5)
      .setStroke('#000000', 6);

    this.controlsZBadge = this.add.graphics();
    this.controlsZBadge.fillStyle(0x222222, 1).fillRoundedRect(302, 216, 56, 56, 12);
    this.controlsZBadge.lineStyle(3, 0xffffff, 1).strokeRoundedRect(302, 216, 56, 56, 12);

    this.controlsZText = this.add
      .text(330, 244, 'Z', {
        fontSize: '34px',
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY,
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.controlsLineZ = this.add
      .text(390, 244, 'Reaccioná cuando el pez muerda', {
        fontSize: '20px',
        fontFamily: FONT_FAMILY,
        color: '#ffffff',
      })
      .setOrigin(0, 0.5);

    this.controlsArrowSprites = [];
    const arrowXs = [285, 325, 365, 405];
    const arrowAngles = [0, -90, 180, 90];
    arrowXs.forEach((ax, i) => {
      const img = this.add.image(ax, 322, 'arrow').setAngle(arrowAngles[i]).setOrigin(0.5).setTint(0xffffff);
      this.controlsArrowSprites.push(img);
    });

    this.controlsLineArrows = this.add
      .text(445, 322, 'Completá la secuencia', {
        fontSize: '20px',
        fontFamily: FONT_FAMILY,
        color: '#ffffff',
      })
      .setOrigin(0, 0.5);

    this.controlsLineObjective = this.add
      .text(400, 420, 'Objetivo: juntá la mayor cantidad de dinero\nantes de que termine el tiempo', {
        fontSize: '20px',
        fontFamily: FONT_FAMILY,
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);

    this.controlsHintText = this.add
      .text(400, 498, 'Presiona ENTER para comenzar', {
        fontSize: '24px',
        fontFamily: FONT_FAMILY,
        color: '#ffff00',
      })
      .setOrigin(0.5);

    this.controlsScreen.add([
      this.controlsPanel,
      this.controlsTitleText,
      this.controlsZBadge,
      this.controlsZText,
      this.controlsLineZ,
      ...this.controlsArrowSprites,
      this.controlsLineArrows,
      this.controlsLineObjective,
      this.controlsHintText,
    ]);

    this.input.keyboard.on('keydown', this.onKeyDown, this);
    this.input.keyboard.addCapture([
      KEYCODES.Z,
      KEYCODES.UP,
      KEYCODES.DOWN,
      KEYCODES.LEFT,
      KEYCODES.RIGHT,
      KEYCODES.ENTER,
    ]);

    this.tweens.add({
      targets: this.titleMainText,
      y: '+=12',
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.tweens.add({
      targets: this.titleFish,
      y: '+=8',
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.tweens.add({
      targets: this.titleSwimmerA,
      x: 840,
      angle: 15,
      duration: 14000,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.tweens.add({
      targets: this.titleSwimmerB,
      x: -40,
      angle: -15,
      duration: 16000,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.pulseHint(this.titleHintText);
    this.pulseHint(this.controlsHintText);
    this.pulseHint(this.gameOverHintText);

    this.cameras.main.fadeIn(400, 0, 0, 0);

    this.showTitle();
  }

  update() {
    if (this.screen !== Screen.PLAY) {
      return;
    }

    if (this.fishingState === State.GAME_OVER) {
      return;
    }

    this.drawWaves();

    const remainingMs = Math.max(0, this.gameEndTime - this.time.now);
    this.updateTimeBar(remainingMs);

    if (this.isTimeUp()) {
      this.endGame();
    }
  }

  drawWaves() {
    const g = this.waveGfx;
    const t = this.time.now;
    g.clear();

    for (let pass = 0; pass < 2; pass++) {
      const yBase = 470 + pass * 8;
      const amp = pass === 0 ? 4 : 3;
      g.lineStyle(3, 0x9fd8ff, pass === 0 ? 0.6 : 0.4);
      g.beginPath();
      for (let x = 0; x <= 800; x += 8) {
        const y = yBase + Math.sin(x * 0.03 + t * 0.002 + pass * 2) * amp;
        if (x === 0) {
          g.moveTo(x, y);
        } else {
          g.lineTo(x, y);
        }
      }
      g.strokePath();
    }
  }

  updateTimeBar(remainingMs) {
    const fraction = Math.max(0, Math.min(1, remainingMs / (GAME_DURATION * 1000)));

    this.hudTimeBar.clear();
    this.hudTimeBar.fillStyle(0x000000, 0.6).fillRoundedRect(420, 22, 360, 12, 6);
    this.hudTimeBar.fillStyle(0x00ccff, 1).fillRoundedRect(420, 22, 360 * fraction, 12, 6);
  }

  updateQtePanel(color) {
    this.qtePanel.clear();
    this.qtePanel.fillStyle(0x000000, 0.35).fillRoundedRect(240, 330, 320, 130, 12);
    this.qtePanel.lineStyle(3, color, 1);
    this.qtePanel.strokeRoundedRect(240, 330, 320, 130, 12);
  }

  showTitle() {
    this.screen = Screen.TITLE;

    this.titleScreen.setVisible(true);
    this.controlsScreen.setVisible(false);
    this.gameOverScreen.setVisible(false);
    this.qteContainer.setVisible(false);

    this.hudPanel.setVisible(false);
    this.hudMoneyText.setVisible(false);
    this.hudTimeBar.setVisible(false);

    this.messageText.setVisible(false);
    this.biteText.setVisible(false);

    this.hideFishingVisuals();
    this.startBubbles();
  }

  showControls() {
    this.screen = Screen.CONTROLS;

    this.titleScreen.setVisible(false);
    this.controlsScreen.setVisible(true);
    this.gameOverScreen.setVisible(false);
    this.qteContainer.setVisible(false);

    this.hudPanel.setVisible(false);
    this.hudMoneyText.setVisible(false);
    this.hudTimeBar.setVisible(false);

    this.messageText.setVisible(false);
    this.biteText.setVisible(false);

    this.hideFishingVisuals();
  }

  startCastCycle() {
    this.qteFailed = false;
    this.qteFailTimer = this.cancelTimer(this.qteFailTimer);

    this.currentRarity = null;
    this.messageText.setText('');
    this.messageText.setScale(1);
    this.biteText.setVisible(false);
    this.updateQtePanel(0xffffff);

    this.setFishingState(State.CAST);
    this.showHookCast();

    this.castTimer = this.time.delayedCall(CAST_PRESENTATION_MS, this.enterWait, [], this);
  }

  onKeyDown(event) {
    if (event.repeat) {
      return;
    }

    if (this.screen === Screen.TITLE) {
      if (event.keyCode === KEYCODES.ENTER) {
        this.showControls();
      }
      return;
    }

    if (this.screen === Screen.CONTROLS) {
      if (event.keyCode === KEYCODES.ENTER) {
        this.startNewGame();
      }
      return;
    }

    if (this.fishingState === State.GAME_OVER) {
      if (event.keyCode === KEYCODES.ENTER) {
        this.showTitle();
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
    this.showHookWait();
    const waitMs = Phaser.Math.Between(WAIT_MS_MIN, WAIT_MS_MAX);
    this.waitTimer = this.time.delayedCall(waitMs, this.enterBite, [], this);
  }

  enterBite() {
    this.setFishingState(State.BITE);
    this.currentRarity = selectRarity();

    this.showHookBite();

    this.biteText.setText('¡PICA!').setVisible(true).setAlpha(1).setScale(0.6).setColor('#ffffff');
    this.tweens.add({
      targets: this.biteText,
      scale: 1.1,
      alpha: 0,
      duration: 900,
      ease: 'Back.easeOut',
      onComplete: () => this.biteText.setVisible(false),
    });
  }

  startQte() {
    this.setFishingState(State.QTE);
    this.qteFailed = false;
    this.sequence = generateSequence(this.currentRarity.sequenceLength);
    this.qteIndex = 0;
    this.qteStartTime = this.time.now;

    this.biteText.setVisible(false);
    this.qteContainer.setVisible(true);
    this.updateQtePanel(RARITY_HEX[this.currentRarity.id]);
    this.showHookQte();

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
    if (this.qteFailed) {
      return;
    }

    if (arrow === this.sequence[this.qteIndex]) {
      this.qteIndex++;

      if (this.qteIndex === this.sequence.length) {
        this.resolveQte('success');
        return;
      }

      this.updateQteDisplay();
      return;
    }

    this.qteTimer = this.cancelTimer(this.qteTimer);
    this.qteCountdownTimer = this.cancelTimer(this.qteCountdownTimer);
    this.qteFailed = true;

    const currentSprite = this.qteArrowSprites && this.qteArrowSprites[this.qteIndex];
    if (currentSprite) {
      currentSprite.setTint(0xff0000);
    }

    this.qteFailTimer = this.time.delayedCall(
      WRONGKEY_RED_MS,
      () => {
        this.qteFailed = false;
        this.qteFailTimer = this.cancelTimer(this.qteFailTimer);
        this.resolveQte('wrongKey');
      },
      [],
      this
    );
  }

  renderQteSequence() {
    if (this.qteArrowSprites) {
      this.qteArrowSprites.forEach((sprite) => sprite.destroy());
    }
    if (this.qteArrowSlots) {
      this.qteArrowSlots.forEach((slot) => slot.destroy());
    }
    this.qteArrowSprites = [];
    this.qteArrowSlots = [];

    const count = this.sequence.length;
    const slotW = 56;
    const gap = 14;
    const total = count * slotW + (count - 1) * gap;
    const y = 350;
    let x = 400 - total / 2 + slotW / 2;

    for (let i = 0; i < count; i++) {
      const token = this.sequence[i];
      const isCurrent = i === this.qteIndex;
      const isDone = i < this.qteIndex;

      const slot = this.add.graphics();
      if (isCurrent) {
        slot.fillStyle(0xffffff, 0.35).fillRoundedRect(x - slotW / 2, y - 24, slotW, 48, 8);
      } else {
        slot.fillStyle(0x000000, 0.3).fillRoundedRect(x - slotW / 2, y - 20, slotW, 40, 8);
      }

      const sprite = this.add.image(x, y, 'arrow').setAngle(ANGLE_BY_TOKEN[token]).setOrigin(0.5);

      if (isDone) {
        sprite.setTint(0x44ff66);
      } else if (isCurrent) {
        sprite.setTint(0xffff00);
        sprite.setScale(1.15);
      } else {
        sprite.setTint(0xffffff);
      }

      this.qteContainer.add([slot, sprite]);
      this.qteArrowSlots.push(slot);
      this.qteArrowSprites.push(sprite);
      x += slotW + gap;
    }
  }

  updateQteDisplay() {
    this.renderQteSequence();
    this.updateQteProgressBar();
    this.updateQteCountdown();
  }

  updateQteProgressBar() {
    this.qteProgressBar.clear();
    this.qteProgressBar.fillStyle(0x333333, 1).fillRoundedRect(300, 402, 200, 8, 4);

    const fraction = this.sequence.length ? this.qteIndex / this.sequence.length : 0;
    this.qteProgressBar.fillStyle(0x00ff88, 1).fillRoundedRect(300, 402, 200 * fraction, 8, 4);
  }

  updateQteCountdown() {
    const remainingMs = QTE_DURATION * 1000 - (this.time.now - this.qteStartTime);
    const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
    this.qteTimerText.setText(`Tiempo: ${remainingSeconds}s`);

    this.qteTimeBar.clear();
    this.qteTimeBar.fillStyle(0x333333, 1).fillRoundedRect(300, 432, 200, 8, 4);

    const fraction = Math.max(0, Math.min(1, remainingMs / (QTE_DURATION * 1000)));
    this.qteTimeBar.fillStyle(0xffcc33, 1).fillRoundedRect(300, 432, 200 * fraction, 8, 4);
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

    this.qteContainer.setVisible(false);
    this.sequenceText.setText('');
    this.progressText.setText('');
    this.qteTimerText.setText('');

    this.setFishingState(State.RESULT);

    if (outcome === 'success') {
      this.money += this.currentRarity.reward;
      this.hudMoneyText.setText(`$${this.money}`);
      this.messageText
        .setText(`ÉXITO (+${this.currentRarity.reward})`)
        .setColor(RARITY_COLORS[this.currentRarity.id]);
      this.messageText.setScale(0.8);
      this.tweens.add({
        targets: this.messageText,
        scale: 1,
        duration: 220,
        ease: 'Back.easeOut',
      });
      this.showRewardFloat(this.currentRarity.reward, RARITY_COLORS[this.currentRarity.id]);
      this.flashMoney();
      this.showFishCapture();
      const tier = TIER_LEVEL[this.currentRarity.id];
      this.celebrate(RARITY_HEX[this.currentRarity.id], tier);
      if (tier >= 3) {
        this.cameras.main.shake(200, 0.01);
      }
    } else {
      this.messageText.setText('FALLO').setColor('#ff0000').setScale(0.6);
      this.tweens.add({
        targets: this.messageText,
        scale: 1,
        duration: 120,
        yoyo: true,
        repeat: 1,
        ease: 'Sine.easeInOut',
      });
      this.showLineBreak();
    }

    this.recastTimer = this.time.delayedCall(RESULT_FEEDBACK_MS, this.startCastCycle, [], this);
  }

  showRewardFloat(reward, color) {
    const floatText = this.add
      .text(400, 300, `+$${reward}`, {
        fontSize: '38px',
        fontWeight: 'bold',
        fontFamily: FONT_FAMILY,
        color: color || '#ffd700',
      })
      .setOrigin(0.5)
      .setScale(0.7);

    this.tweens.add({
      targets: floatText,
      y: 210,
      scale: 1.4,
      alpha: 0,
      duration: 1400,
      ease: 'Cubic.easeOut',
      onComplete: () => floatText.destroy(),
    });
  }

  celebrate(color, tier) {
    const amount = 8 + tier * 2;
    const size = 3 + tier;
    for (let i = 0; i < amount; i++) {
      const p = this.add.graphics();
      p.fillStyle(color, 1).fillCircle(0, 0, size);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.Between(50, 90 + tier * 25);
      p.setPosition(HOOK_X, WATER_Y);
      this.tweens.add({
        targets: p,
        x: HOOK_X + Math.cos(angle) * dist,
        y: WATER_Y + Math.sin(angle) * dist - 40,
        alpha: 0,
        scale: 0.3,
        duration: Phaser.Math.Between(600, 1000),
        ease: 'Cubic.easeOut',
        onComplete: () => p.destroy(),
      });
    }
  }

  flashMoney() {
    this.tweens.add({
      targets: this.hudMoneyText,
      scale: 1.2,
      duration: 120,
      yoyo: true,
    });
  }

  pulseHint(target) {
    this.tweens.add({
      targets: target,
      alpha: 0.2,
      duration: 550,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  makeHookTexture() {
    const g = this.add.graphics();
    g.lineStyle(5, 0xd0d0d0, 1);
    g.beginPath();
    g.moveTo(24, 2);
    g.lineTo(24, 26);
    g.strokePath();
    g.beginPath();
    g.arc(24, 36, 10, Math.PI * 1.5, Math.PI * 2, false);
    g.strokePath();
    g.fillStyle(0xd0d0d0, 1);
    g.fillTriangle(30, 33, 42, 43, 29, 43);
    g.generateTexture('hook', 48, 48);
    g.destroy();
  }

  makeArrowTexture() {
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(24, 2, 40, 26, 8, 26);
    g.fillRect(19, 24, 10, 20);
    g.generateTexture('arrow', 48, 46);
    g.destroy();
  }

  makeFishTextures() {
    const styles = [
      { key: 'fish-common', color: 0x8ba7bf, w: 34, h: 24, fin: false, belly: null, long: false, crown: false, stripe: null },
      { key: 'fish-rare', color: 0x4ade80, w: 40, h: 28, fin: true, belly: 0x2f9e51, long: false, crown: false, stripe: null },
      { key: 'fish-epic', color: 0x7c8cff, w: 44, h: 30, fin: false, belly: 0x4a56c9, long: false, crown: false, stripe: null },
      { key: 'fish-legendary', color: 0xffb300, w: 50, h: 32, fin: false, belly: 0xcc8a00, long: true, crown: false, stripe: 0x8a5a00 },
      { key: 'fish-mythic', color: 0xff5df0, w: 56, h: 40, fin: false, belly: 0xb83ba8, long: true, crown: true, stripe: null },
    ];

    for (const s of styles) {
      const g = this.add.graphics();
      const cx = s.w / 2;
      const cy = s.h / 2;

      g.fillStyle(s.color, 1);
      g.fillTriangle(cx - s.w * 0.22, cy, cx - s.w * 0.62, cy - s.h * 0.3, cx - s.w * 0.62, cy + s.h * 0.3);
      g.fillEllipse(cx, cy, s.w * 0.78, s.h * 0.9);

      if (s.belly) {
        g.fillStyle(s.belly, 1);
        g.fillEllipse(cx + s.w * 0.04, cy + s.h * 0.12, s.w * 0.6, s.h * 0.5);
      }

      if (s.fin) {
        g.fillStyle(s.color, 1);
        g.fillTriangle(cx - s.w * 0.05, cy - s.h * 0.08, cx - s.w * 0.02, cy - s.h * 0.62, cx + s.w * 0.12, cy - s.h * 0.12);
      }

      if (s.stripe) {
        g.fillStyle(s.stripe, 1);
        g.fillRect(cx - s.w * 0.05, cy - s.h * 0.2, s.w * 0.07, s.h * 0.4);
      }

      if (s.crown) {
        g.fillStyle(0xffd700, 1);
        g.fillTriangle(cx + s.w * 0.28, cy - s.h * 0.1, cx + s.w * 0.2, cy - s.h * 0.62, cx + s.w * 0.02, cy - s.h * 0.1);
        g.fillTriangle(cx + s.w * 0.38, cy - s.h * 0.12, cx + s.w * 0.44, cy - s.h * 0.5, cx + s.w * 0.26, cy - s.h * 0.16);
      }

      g.fillStyle(0xffffff, 1).fillCircle(cx + s.w * 0.2, cy - s.h * 0.18, Math.max(2, s.h * 0.12));
      g.fillStyle(0x000000, 1).fillCircle(cx + s.w * 0.22, cy - s.h * 0.18, Math.max(1.5, s.h * 0.06));

      g.generateTexture(s.key, s.w, s.h);
      g.destroy();
    }
  }

  makeSeaweed() {
    const blades = [
      [30, 150, 0x1f9e4f],
      [55, 200, 0x27b664],
      [80, 120, 0x1f9e4f],
      [720, 180, 0x27b664],
      [750, 130, 0x1f9e4f],
      [770, 210, 0x27b664],
    ];

    for (const [x, h, color] of blades) {
      this.seaweedGfx.lineStyle(5, color, 0.8);
      this.seaweedGfx.beginPath();
      this.seaweedGfx.moveTo(x, 600);
      for (let i = 1; i <= 5; i++) {
        this.seaweedGfx.lineTo(x + Math.sin(i * 2.1) * 9, 600 - (h * i) / 5);
      }
      this.seaweedGfx.strokePath();
    }

    this.seaweedGfx.fillStyle(0x6b4a2b, 1).fillRoundedRect(15, 585, 40, 15, 6);
    this.seaweedGfx.fillStyle(0x6b4a2b, 1).fillRoundedRect(705, 585, 50, 15, 6);
  }

  makeBubble() {
    const makeOne = () => {
      const bubble = this.add.graphics();
      const x = Phaser.Math.Between(80, 720);
      const y = Phaser.Math.Between(500, 580);
      bubble.lineStyle(2, 0xffffff, 0.55).strokeCircle(0, 0, Phaser.Math.Between(4, 9));
      bubble.setPosition(x, y);
      this.tweens.add({
        targets: bubble,
        y: y - Phaser.Math.Between(70, 130),
        alpha: 0,
        duration: Phaser.Math.Between(1400, 2200),
        ease: 'Sine.easeOut',
        onComplete: () => bubble.destroy(),
      });
    };

    makeOne();
    if (Math.random() < 0.5) {
      makeOne();
    }
  }

  startBubbles() {
    this.bubbleTimer = this.cancelTimer(this.bubbleTimer);
    this.bubbleTimer = this.time.addEvent({
      delay: 450,
      loop: true,
      callback: this.makeBubble,
      callbackScope: this,
    });
  }

  makeMarineFish() {
    const f = this.add.image(0, 0, 'fish-common');
    f.setTexture('fish-' + Phaser.Utils.Array.GetRandom(['common', 'rare', 'epic', 'mythic']));
    f.setScale(Phaser.Math.FloatBetween(0.25, 0.5)).setAlpha(0.45);
    const dir = Phaser.Utils.Array.GetRandom([1, -1]);
    f.setFlipX(dir === -1);
    f.setPosition(dir === 1 ? -40 : 840, Phaser.Math.Between(500, 575));
    this.marineFish.push(f);
    this.tweens.add({
      targets: f,
      x: dir === 1 ? 840 : -40,
      duration: Phaser.Math.Between(7000, 11000),
      ease: 'Linear',
      onComplete: () => {
        this.marineFish = this.marineFish.filter((m) => m !== f);
        f.destroy();
      },
    });
  }

  makeRipple(x, y) {
    const ripple = this.add.graphics();
    ripple.lineStyle(2, 0xffffff, 0.7).strokeCircle(0, 0, 10);
    ripple.setPosition(x, y);
    this.tweens.add({
      targets: ripple,
      scale: 2.4,
      alpha: 0,
      duration: 750,
      ease: 'Sine.easeOut',
      onComplete: () => ripple.destroy(),
    });
  }

  updateLine() {
    this.lineGfx.clear();
    this.lineGfx.lineStyle(2, 0xdddddd, 1);
    this.lineGfx.beginPath();
    this.lineGfx.moveTo(ROD_X, ROD_Y);
    this.lineGfx.lineTo(this.hookImage.x, this.hookImage.y);
    this.lineGfx.strokePath();
  }

  resetHook() {
    this.tweens.killTweensOf([this.hookImage, this.fishImage]);
    this.rippleTimer = this.cancelTimer(this.rippleTimer);

    this.fishImage.setVisible(false);
    this.hookImage.setVisible(true).setPosition(ROD_X, ROD_Y).setAngle(0).setScale(1).setAlpha(1);
    this.hookImage.setTint(STATE_COLORS[State.CAST]);
    this.updateLine();
  }

  showHookCast() {
    this.resetHook();
    this.tweens.add({
      targets: this.hookImage,
      x: HOOK_X,
      y: WATER_Y,
      duration: CAST_PRESENTATION_MS,
      ease: 'Quad.easeIn',
      onUpdate: () => this.updateLine(),
      onComplete: () => this.makeRipple(HOOK_X, WATER_Y - 8),
    });
  }

  showHookWait() {
    this.tweens.killTweensOf(this.hookImage);
    this.hookImage.setTint(STATE_COLORS[State.WAIT]);

    this.tweens.add({
      targets: this.hookImage,
      y: '+=6',
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => this.updateLine(),
    });

    this.rippleTimer = this.time.addEvent({
      delay: 1200,
      loop: true,
      callback: () => this.makeRipple(HOOK_X, WATER_Y - 8),
      callbackScope: this,
    });
  }

  showHookBite() {
    this.rippleTimer = this.cancelTimer(this.rippleTimer);
    this.tweens.killTweensOf(this.hookImage);
    this.hookImage.setTint(STATE_COLORS[State.BITE]);

    this.tweens.add({
      targets: this.hookImage,
      x: HOOK_X - 7,
      duration: 70,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => this.updateLine(),
    });
  }

  showHookQte() {
    this.rippleTimer = this.cancelTimer(this.rippleTimer);
    this.tweens.killTweensOf(this.hookImage);
    this.hookImage.setTint(STATE_COLORS[State.QTE]);
    this.hookImage.setPosition(HOOK_X, WATER_Y);

    this.tweens.add({
      targets: this.hookImage,
      angle: 6,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => this.updateLine(),
    });
  }

  showFishCapture() {
    this.tweens.killTweensOf([this.hookImage, this.fishImage]);
    this.hookImage.setTint(0xffffff);
    this.hookImage.setPosition(HOOK_X, WATER_Y);
    this.fishImage.setTexture('fish-' + this.currentRarity.id);
    this.fishImage.setPosition(HOOK_X, WATER_Y + 8).setAngle(0).setScale(FISH_STYLE[this.currentRarity.id].scale).setAlpha(1).setVisible(true);
    this.updateLine();

    this.tweens.add({
      targets: [this.hookImage, this.fishImage],
      y: 300,
      angle: 35,
      duration: 520,
      ease: 'Back.easeOut',
      onUpdate: () => this.updateLine(),
    });

    this.tweens.add({
      targets: [this.hookImage, this.fishImage],
      y: WATER_Y + 40,
      angle: -20,
      duration: 340,
      delay: 520,
      ease: 'Sine.easeIn',
      onUpdate: () => this.updateLine(),
      onComplete: () => {
        this.fishImage.setVisible(false);
        this.hookImage.setPosition(HOOK_X, WATER_Y);
      },
    });
  }

  showLineBreak() {
    this.tweens.killTweensOf(this.hookImage);
    this.tweens.add({
      targets: this.hookImage,
      x: ROD_X,
      y: ROD_Y,
      duration: 450,
      ease: 'Quart.easeIn',
      onUpdate: () => this.updateLine(),
    });
  }

  hideFishingVisuals() {
    this.rippleTimer = this.cancelTimer(this.rippleTimer);
    this.bubbleTimer = this.cancelTimer(this.bubbleTimer);
    this.marineTimer = this.cancelTimer(this.marineTimer);
    this.qteFailTimer = this.cancelTimer(this.qteFailTimer);
    this.tweens.killTweensOf([this.hookImage, this.fishImage]);

    this.marineFish.forEach((m) => m.destroy());
    this.marineFish = [];

    this.hookImage.setVisible(false);
    this.fishImage.setVisible(false);
    this.shoreGfx.setVisible(false);
    this.waterGfx.setVisible(false);
    this.seaweedGfx.setVisible(false);
    this.rodGfx.setVisible(false);
    this.waveGfx.setVisible(false);
    this.lineGfx.setVisible(false);
  }

  showFishingVisuals() {
    this.shoreGfx.setVisible(true);
    this.waterGfx.setVisible(true);
    this.seaweedGfx.setVisible(true);
    this.rodGfx.setVisible(true);
    this.waveGfx.setVisible(true);
    this.lineGfx.setVisible(true);
    this.resetHook();
    this.startBubbles();
    this.marineTimer = this.cancelTimer(this.marineTimer);
    this.marineTimer = this.time.addEvent({
      delay: 1800,
      loop: true,
      callback: this.makeMarineFish,
      callbackScope: this,
    });
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
    this.qteFailTimer = this.cancelTimer(this.qteFailTimer);

    this.qteContainer.setVisible(false);
    this.sequenceText.setText('');
    this.progressText.setText('');
    this.qteTimerText.setText('');

    this.updateTimeBar(0);
    this.setFishingState(State.GAME_OVER);

    this.messageText.setText('');
    this.biteText.setVisible(false);

    this.hideFishingVisuals();

    this.gameOverMoneyText.setText(`Dinero total: $${this.money}`);
    this.gameOverScreen.setVisible(true);
  }

  startNewGame() {
    this.screen = Screen.PLAY;

    this.money = 0;
    this.currentRarity = null;
    this.qteResult = null;
    this.sequence = null;
    this.qteIndex = 0;
    this.qteFailed = false;

    this.castTimer = this.cancelTimer(this.castTimer);
    this.waitTimer = this.cancelTimer(this.waitTimer);
    this.recastTimer = this.cancelTimer(this.recastTimer);
    this.qteTimer = this.cancelTimer(this.qteTimer);
    this.qteCountdownTimer = this.cancelTimer(this.qteCountdownTimer);
    this.qteFailTimer = this.cancelTimer(this.qteFailTimer);

    this.gameEndTime = this.time.now + GAME_DURATION * 1000;

    this.titleScreen.setVisible(false);
    this.controlsScreen.setVisible(false);
    this.gameOverScreen.setVisible(false);
    this.qteContainer.setVisible(false);

    this.hudPanel.setVisible(true);
    this.hudMoneyText.setVisible(true);
    this.hudTimeBar.setVisible(true);
    this.updateTimeBar(GAME_DURATION * 1000);

    this.messageText.setVisible(true);

    this.hudMoneyText.setScale(1).setText(`$${this.money}`);
    this.messageText.setText('').setScale(1);
    this.sequenceText.setText('');
    this.progressText.setText('');
    this.qteTimerText.setText('');

    this.showFishingVisuals();

    this.cameras.main.fadeIn(250, 0, 0, 0);

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