import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  backgroundColor: '#1e90ff',
  scene: {
    create() {
      this.add
        .text(400, 300, 'Silly Fishing', {
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#ffffff',
        })
        .setOrigin(0.5);
    },
  },
};

new Phaser.Game(config);