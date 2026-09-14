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

    this.makeHookTexture();
    this.makeArrowTexture();
    this.makeFishTexture();

    this.waterGfx = this.add.graphics();
    this.waterGfx.fillStyle(0x0a4d8a, 0.55).fillRect(0, 470, 800, 130);
    this.waterGfx.fillStyle(0x7fd0ff, 0.25).fillRect(0, 470, 800, 6);

    this.lineGfx = this.add.graphics();

    this.hookImage = this.add.image(ROD_X, ROD_Y, 'hook');
    this.hookImage.setVisible(false);

    this.fishImage = this.add.image(HOOK_X, WATER_Y, 'fish');
    this.fishImage.setVisible(false);

    this.hudPanel = this.add.graphics();
    this.hudPanel.fillStyle(0x000000, 0.35).fillRect(0, 0, 800, 56);

    this.hudMoneyText = this.add
      .text(20, 30, `Dinero: $${this.money}`, {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0, 0);

    this.hudTimeBar = this.add.graphics();
    this.updateTimeBar(GAME_DURATION * 1000);

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

    this.biteText = this.add
      .text(400, 210, '', {
        fontSize: '40px',
        fontWeight: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.qteContainer = this.add.container(0, 0).setVisible(false);

    this.qtePanel = this.add.graphics();
    this.qtePanel.fillStyle(0x000000, 0.3).fillRoundedRect(240, 330, 320, 130, 12);

    this.sequenceText = this.add
      .text(400, 350, '', {
        fontSize: '28px',
        fontFamily: 'monospace',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.progressText = this.add
      .text(400, 388, '', {
        fontSize: '18px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.qteTimerText = this.add
      .text(400, 422, '', {
        fontSize: '18px',
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
        color: '#ff4444',
      })
      .setOrigin(0.5);

    this.gameOverMoneyText = this.add
      .text(400, 260, '', {
        fontSize: '30px',
        fontWeight: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.gameOverHintText = this.add
      .text(400, 330, 'Presiona ENTER para reiniciar', {
        fontSize: '22px',
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
        fontSize: '64px',
        fontWeight: 'bold',
        color: '#ffff00',
      })
      .setOrigin(0.5)
      .setStroke('#000000', 8);

    this.titleFish = this.add.graphics();
    this.titleFish.fillStyle(0xffffff, 1).fillCircle(0, 0, 26);
    this.titleFish.fillTriangle(-26, 0, -62, -18, -62, 18);
    this.titleFish.fillStyle(0x000000, 1).fillCircle(12, -8, 4);
    this.titleFish.setPosition(400, 330);

    this.titleHintText = this.add
      .text(400, 470, 'Presiona ENTER para continuar', {
        fontSize: '24px',
        color: '#ffff00',
      })
      .setOrigin(0.5);

    this.titleScreen.add([
      this.titleDecor,
      this.titleMainText,
      this.titleFish,
      this.titleHintText,
    ]);

    this.controlsScreen = this.add.container(0, 0).setVisible(false);

    this.controlsPanel = this.add.graphics();
    this.controlsPanel.fillStyle(0x000000, 0.35).fillRoundedRect(120, 180, 560, 260, 16);

    this.controlsTitleText = this.add
      .text(400, 140, '¿CÓMO JUGAR?', {
        fontSize: '44px',
        fontWeight: 'bold',
        color: '#ffff00',
      })
      .setOrigin(0.5)
      .setStroke('#000000', 6);

    this.controlsLineZ = this.add
      .text(400, 240, 'Z — Reaccioná cuando el pez muerda', {
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.controlsLineArrows = this.add
      .text(400, 300, '↑ ↓ ← → — Completá la secuencia', {
        fontSize: '24px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.controlsLineObjective = this.add
      .text(400, 360, 'Objetivo: juntá la mayor cantidad de dinero\nantes de que termine el tiempo', {
        fontSize: '22px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);

    this.controlsHintText = this.add
      .text(400, 480, 'Presiona ENTER para comenzar', {
        fontSize: '24px',
        color: '#ffff00',
      })
      .setOrigin(0.5);

    this.controlsScreen.add([
      this.controlsPanel,
      this.controlsTitleText,
      this.controlsLineZ,
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

    const remainingMs = Math.max(0, this.gameEndTime - this.time.now);
    this.updateTimeBar(remainingMs);

    if (this.isTimeUp()) {
      this.endGame();
    }
  }

  updateTimeBar(remainingMs) {
    const fraction = Math.max(0, Math.min(1, remainingMs / (GAME_DURATION * 1000)));

    this.hudTimeBar.clear();
    this.hudTimeBar.fillStyle(0x000000, 0.6).fillRoundedRect(200, 22, 400, 12, 6);
    this.hudTimeBar.fillStyle(0x00ccff, 1).fillRoundedRect(200, 22, 400 * fraction, 12, 6);
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
    this.rarityText.setVisible(false);
    this.biteText.setVisible(false);

    this.hideFishingVisuals();
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
    this.rarityText.setVisible(false);
    this.biteText.setVisible(false);

    this.hideFishingVisuals();
  }

  startCastCycle() {
    this.qteFailed = false;
    this.qteFailTimer = this.cancelTimer(this.qteFailTimer);

    this.currentRarity = null;
    this.rarityText.setText('');
    this.messageText.setText('');
    this.messageText.setScale(1);
    this.biteText.setVisible(false);

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

    this.rarityText.setText(`Rareza: ${this.currentRarity.label}`);
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
      this.hudMoneyText.setText(`Dinero: $${this.money}`);
      this.messageText
        .setText(`ÉXITO (+${this.currentRarity.reward})`)
        .setColor('#00ff00');
      this.showRewardFloat(this.currentRarity.reward);
      this.flashMoney();
      this.showFishCapture();
    } else {
      this.messageText.setText('FALLO').setColor('#ff0000');
      this.showLineBreak();
    }

    this.messageText.setScale(0.8);
    this.tweens.add({
      targets: this.messageText,
      scale: 1,
      duration: 220,
      ease: 'Back.easeOut',
    });

    this.recastTimer = this.time.delayedCall(RESULT_FEEDBACK_MS, this.startCastCycle, [], this);
  }

  showRewardFloat(reward) {
    const floatText = this.add
      .text(400, 300, `+$${reward}`, {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#ffd700',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: floatText,
      y: 230,
      alpha: 0,
      duration: 1200,
      onComplete: () => floatText.destroy(),
    });
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

  makeFishTexture() {
    const g = this.add.graphics();
    g.fillStyle(0xffcc33, 1);
    g.fillTriangle(8, 17, 0, 6, 0, 28);
    g.fillEllipse(24, 17, 32, 24);
    g.fillStyle(0xffffff, 1).fillCircle(34, 12, 4);
    g.fillStyle(0x000000, 1).fillCircle(35, 12, 2);
    g.generateTexture('fish', 48, 34);
    g.destroy();
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
    this.fishImage.setPosition(HOOK_X, WATER_Y + 8).setAngle(0).setScale(0.8).setAlpha(1).setVisible(true);
    this.updateLine();

    this.tweens.add({
      targets: [this.hookImage, this.fishImage],
      y: 340,
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
    this.qteFailTimer = this.cancelTimer(this.qteFailTimer);
    this.tweens.killTweensOf([this.hookImage, this.fishImage]);

    this.hookImage.setVisible(false);
    this.fishImage.setVisible(false);
    this.waterGfx.setVisible(false);
    this.lineGfx.setVisible(false);
  }

  showFishingVisuals() {
    this.waterGfx.setVisible(true);
    this.lineGfx.setVisible(true);
    this.resetHook();
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

    this.rarityText.setText('');
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
    this.rarityText.setVisible(true);

    this.hudMoneyText.setScale(1).setText(`Dinero: $${this.money}`);
    this.rarityText.setText('');
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