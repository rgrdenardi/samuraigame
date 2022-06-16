const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './samurai assets/background.png'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 133
  },
  imageSrc: './samurai assets/shop.png',
  scale: 2.7,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 200,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './samurai assets/zacarias/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155
  },
  sprites: {
    idle: {
      imageSrc: './samurai assets/zacarias/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './samurai assets/zacarias/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './samurai assets/zacarias/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './samurai assets/zacarias/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './samurai assets/zacarias/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './samurai assets/zacarias/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './samurai assets/zacarias/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 130,
      y: 50
    },
    width: 120,
    height: 50
  }
})

const enemy = new Fighter({
  position: {
    x: 700,
    y: 100
  },
  velocity: {
    x: 0,
    y: 10
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './samurai assets/jubileu/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: './samurai assets/jubileu/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './samurai assets/jubileu/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './samurai assets/jubileu/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './samurai assets/jubileu/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './samurai assets/jubileu/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './samurai assets/jubileu/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './samurai assets/jubileu/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  }
}
let lastKey

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255,255, 0.16)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // player movement

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -7
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 7
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'w') {
    player.velocity.x = 7
    player.switchSprite('run')
  } else if (keys.a.pressed && player.lastKey === 'w') {
    player.velocity.x = -7
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  //jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }
  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -7
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 7
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowUp') {
    enemy.velocity.x = 7
    enemy.switchSprite('run')
  } else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowUp') {
    enemy.velocity.x = -7
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  //jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  //detect for collision && hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit()
    player.isAttacking = false
    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false
    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  //errooooooooo
  if (player.isAttacking && player.framesCurrent === 4)
    player.isAttacking = false

  if (enemy.isAttacking && enemy.framesCurrent === 2) enemy.isAttacking = false

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate(animate)

window.addEventListener('keydown', event => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        player.velocity.y = -20
        player.lastKey = 'w'
        break
      case ' ':
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -20
        enemy.lastKey = 'ArrowUp'
        break
      case 'ArrowDown':
        enemy.attack()
        break
    }
  }
})

window.addEventListener('keyup', event => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 'w':
      keys.w.pressed = false
      break
  }
  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
    case 'ArrowUp':
      keys.ArrowUp.pressed = false
      break
  }
})
