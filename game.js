const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Audio Assets
const audio = {
    bgmLevel1: new Audio('assets/level1_bgm.mp3'),
    bgmLevel2: new Audio('assets/level2_bgm.mp3'),
    bgmLevel3: new Audio('assets/level3_bgm.mp3'),
    bgmLevel5: new Audio('assets/level5_bgm.mp3'),
    hits: [
        new Audio('assets/hit1.mp3'),
        new Audio('assets/hit2.mp3'),
        new Audio('assets/hit3.mp3'),
        new Audio('assets/hit4.mp3'),
        new Audio('assets/hit5.mp3')
    ],
    cloudBounce: new Audio('assets/cloud_bounce.wav'),
    jump: new Audio('assets/jump.mp3'),
    stomp: new Audio('assets/stomp.wav')
};
audio.bgmLevel1.loop = true;
audio.bgmLevel2.loop = true;
audio.bgmLevel3.loop = true;
audio.bgmLevel1.volume = 0.5; // lower volume for ambient
audio.bgmLevel2.volume = 0.5;
audio.bgmLevel3.volume = 0.5;
audio.bgmLevel5.volume = 0.5;
audio.bgmLevel5.loop = true;

let chapterTransition = { active: false, timer: 0 };
let startMenuSelection = 1; // 1 for Chapter 1, 5 for Chapter 2, 6 for Level 6

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        currentLevel = startMenuSelection;
        init(); // Ensure we load the selected level right away
        if (currentLevel === 1) {
            audio.bgmLevel1.play().catch(e => console.log('Audio autoplay blocked', e));
        } else if (currentLevel >= 5) {
            audio.bgmLevel5.play().catch(e => console.log('Audio autoplay blocked', e));
        }
    }
}

canvas.addEventListener('click', (e) => {
    if (!gameStarted) {
        startMenuSelection = 1;
        startGame();
    }
});
canvas.addEventListener('touchstart', (e) => {
    if (!gameStarted) {
        e.preventDefault();
        startMenuSelection = 1;
        startGame();
    }
}, {passive: false});

// Assets
const sprites = {
    idleLeft: new Image(),
    idleRight: new Image(),
    runLeft: [new Image(), new Image(), new Image(), new Image()],
    runRight: [new Image(), new Image(), new Image(), new Image()],
    jumpLeft: [new Image(), new Image(), new Image(), new Image()],
    jumpRight: [new Image(), new Image(), new Image(), new Image()],
    books: [new Image(), new Image(), new Image(), new Image(), new Image()],
    floor: new Image(),
    elementPillow: new Image(),
    elementBooks: new Image(),
    elementToys: new Image(),
    shelfSmall: new Image(),
    shelfLarge: new Image(),
    shelfVerySmall: new Image(),
    shelfVeryLarge: new Image(),
    raftCarti: new Image(),
    chair: new Image(),
    fourChairs: new Image(),
    bg: new Image(),
    plane: new Image(),
    earth: new Image(),
    galaxy: [new Image(), new Image(), new Image(), new Image(), new Image()],
    moonFloor: new Image(),
    bookIcon: new Image(),
    heart: new Image(),
    bg2: new Image(),
    floor2: new Image(),
    rock: new Image(),
    smallTrunk: new Image(),
    bigTrunk: new Image(),
    owl: [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()],
    nivoTalk: [new Image(), new Image(), new Image(), new Image()],
    startBg: new Image(),
    bg3: new Image(),
    floor3: new Image(),
    asteroidVerySmall: new Image(),
    asteroidSmall: new Image(),
    asteroidLarge: new Image(),
    asteroidVeryLarge: new Image(),
    cloudEnemy: [new Image(), new Image(), new Image(), new Image(), new Image()],
    leafEnemy: [new Image(), new Image(), new Image(), new Image(), new Image()],
    nivoFly: [new Image(), new Image(), new Image()],
    comet: [new Image(), new Image(), new Image(), new Image()],
    bg4: new Image(),
    bg5: new Image(),
    floor5: new Image(),
    upgroundVerySmall: new Image(),
    upgroundSmall: new Image(),
    upgroundLarge: new Image(),
    upgroundVeryLarge: new Image(),
    earth: new Image(),
    oneUp: new Image(),
    fence: new Image(),
    bg6: new Image(),
    bg7: new Image(),
    floor7: new Image(),
    cloudVerySmall: new Image(),
    cloudSmall: new Image(),
    cloudLarge: new Image(),
    cloudVeryLarge: new Image(),
    bg8: new Image(),
    floor8: new Image(),
    axelMiaHome: new Image()
};

sprites.startBg.src = 'assets/start_bg.png';
sprites.bg3.src = 'assets/level3_bg.png';
sprites.floor3.src = 'assets/moon_tile.png';
sprites.asteroidVerySmall.src = 'assets/asteroid_verysmall.png';
sprites.asteroidSmall.src = 'assets/asteroid_small.png';
sprites.asteroidLarge.src = 'assets/asteroid_large.png';
sprites.asteroidVeryLarge.src = 'assets/asteroid_verylarge.png';

for(let i = 1; i <= 5; i++) {
    sprites.cloudEnemy[i-1].src = `assets/cloud_enemy${i}.png`;
    sprites.leafEnemy[i-1].src = `assets/leaf_enemy${i}.png`;
}

sprites.bg4.src = 'assets/level4_bg.png';
sprites.bg5.src = 'assets/level5_bg.png';
sprites.floor5.src = 'assets/ground5_tile.png';
sprites.upgroundVerySmall.src = 'assets/upground_verysmall.png';
sprites.upgroundSmall.src = 'assets/upground_small.png';
sprites.upgroundLarge.src = 'assets/upground_large.png';
sprites.upgroundVeryLarge.src = 'assets/upground_verylarge.png';
sprites.earth.src = 'assets/earth.png';
sprites.oneUp.src = 'assets/1up.png';
sprites.fence.src = 'assets/fence.png';
sprites.bg6.src = 'assets/level6_bg.png';
sprites.bg7.src = 'assets/level7_bg.png';
sprites.floor7.src = 'assets/ground7_tile.png';
sprites.cloudVerySmall.src = 'assets/cloud_verysmall.png';
sprites.cloudSmall.src = 'assets/cloud_small.png';
sprites.cloudLarge.src = 'assets/cloud_large.png';
sprites.cloudVeryLarge.src = 'assets/cloud_verylarge.png';
sprites.bg8.src = 'assets/level8_bg.png';
sprites.floor8.src = 'assets/ground8_tile.png';
sprites.axelMiaHome.src = 'assets/axelmiahome.png';
for(let i = 1; i <= 3; i++) {
    sprites.nivoFly[i-1].src = `assets/nivo_fly${i}.png`;
}
for(let i = 1; i <= 4; i++) {
    sprites.comet[i-1].src = `assets/comet${i}.png`;
}

sprites.floor.src = 'assets/floor_tile.png';
sprites.floor2.src = 'assets/ground_tile.png';
sprites.bg2.src = 'assets/level2_bg.png';
sprites.rock.src = 'assets/rock_element.png';
sprites.smallTrunk.src = 'assets/small_trunk.png';
sprites.bigTrunk.src = 'assets/big_trunk.png';
sprites.heart.src = 'assets/life_heart.png';
sprites.bookIcon.src = 'assets/book1.png';
sprites.startBg.src = 'assets/start_bg.png';
sprites.earth.src = 'assets/earth.png';
for(let i = 1; i <= 5; i++) {
    sprites.galaxy[i-1].src = `assets/galaxy${i}.png`;
}
sprites.moonFloor.src = 'assets/moon_tile.png';
sprites.plane.src = 'assets/paper_plane.png';
sprites.bg.src = 'assets/level1_bg.png';
sprites.chair.src = 'assets/chair_element.png';
sprites.fourChairs.src = 'assets/4chairs_element.png';
sprites.raftCarti.src = 'assets/raft_carti.png';
sprites.shelfVeryLarge.src = 'assets/raft_verylarge.png';
sprites.shelfVerySmall.src = 'assets/raft_verysmall.png';
sprites.shelfSmall.src = 'assets/raft_small.png';
sprites.shelfLarge.src = 'assets/raft_large.png';
sprites.elementPillow.src = 'assets/pillow_element.png';
sprites.elementBooks.src = 'assets/books_element.png';
sprites.elementToys.src = 'assets/toys_element.png';

sprites.idleLeft.src = 'assets/nivo_left1.png';
sprites.idleRight.src = 'assets/nivo_right1.png';

for(let i = 1; i <= 4; i++) {
    sprites.runLeft[i-1].src = `assets/nivo_left${i}.png`;
    sprites.runRight[i-1].src = `assets/nivo_right${i}.png`;
    sprites.jumpLeft[i-1].src = `assets/jump_left${i}.png`;
    sprites.jumpRight[i-1].src = `assets/jump_right${i}.png`;
}

for(let i = 1; i <= 5; i++) {
    sprites.books[i-1].src = `assets/book${i}.png`;
}

for(let i = 1; i <= 6; i++) {
    sprites.owl[i-1].src = `assets/owl${i}.png`;
}

for(let i = 1; i <= 4; i++) {
    sprites.nivoTalk[i-1].src = `assets/nivo_talk${i}.png`;
}

// Game Constants
const GRAVITY = 0.6;
const FRICTION = 0.8;
const PLAYER_SPEED = 5;
const JUMP_FORCE = 12;

// Input handling
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    Space: false
};

window.addEventListener('keydown', (e) => {
    if (!gameStarted) {
        if (e.code === 'Enter' || e.code === 'Space') {
            startMenuSelection = 1;
            startGame();
            return;
        }
    }
    
    if (dialogueState.active && (e.code === 'Space' || e.code === 'Enter')) {
        if (dialogueState.charIndex < dialogueState.text.length) {
            dialogueState.displayedText = dialogueState.text;
            dialogueState.charIndex = dialogueState.text.length;
        } else {
            dialogueState.active = false;
            if (dialogueState.audio) dialogueState.audio.pause();
            if (dialogueState.onComplete) dialogueState.onComplete();
        }
        return; // Consume input
    }
    
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
    }
});

// Camera
const camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
};

// Player Class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        // Physical hitbox (smaller than sprite)
        this.width = 24; 
        this.height = 45;
        
        // Sprite render size and offset (to account for transparent padding)
        this.spriteWidth = 60; 
        this.spriteHeight = 60;
        this.spriteOffsetX = -18; // Shift left
        this.spriteOffsetY = -10; // Shift up slightly less, so the sprite moves down 5px
        
        this.invulnerableTimer = 0;
        
        this.vx = 0;
        this.vy = 0;
        this.isGrounded = false;
        this.jumpsLeft = 2; // For double jump
        
        // Animation states
        this.facingRight = true;
        this.frameIndex = 0;
        this.animationTimer = 0;
        this.animationSpeed = 5; // frames per animation update
    }

    update() {
        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer--;
        }

        // Horizontal movement
        if (keys.ArrowLeft) {
            this.vx = -PLAYER_SPEED;
            this.facingRight = false;
        } else if (keys.ArrowRight) {
            this.vx = PLAYER_SPEED;
            this.facingRight = true;
        } else {
            this.vx *= FRICTION; // Slide to a stop
        }
        
        // Animation timing
        if (Math.abs(this.vx) > 0.5 && this.isGrounded) {
            this.animationTimer++;
            if (this.animationTimer >= this.animationSpeed) {
                this.animationTimer = 0;
                this.frameIndex = (this.frameIndex + 1) % 4;
            }
        } else {
            this.frameIndex = 0; // Reset to idle frame
        }

        // Flying logic for Level 4
        if (currentLevel === 4) {
            // Horizontal bounds relative to camera
            let leftMargin = 50; // don't stick to the absolute edge
            if (this.x < camera.x + leftMargin) {
                this.x = camera.x + leftMargin;
                this.vx = 0;
            }
            if (this.x + this.width > camera.x + 800) {
                this.x = camera.x + 800 - this.width;
                this.vx = 0;
            }

            // Vertical movement
            if (keys.ArrowUp || keys.Space) {
                this.vy = -PLAYER_SPEED;
            } else if (keys.ArrowDown) {
                this.vy = PLAYER_SPEED;
            } else {
                this.vy *= FRICTION;
            }

            // Vertical bounds
            if (this.y < 0) {
                this.y = 0;
                this.vy = 0;
            }
            if (this.y + this.height > 600) {
                this.y = 600 - this.height;
                this.vy = 0;
            }

            // Apply velocity
            this.x += this.vx;
            this.y += this.vy;

            // Frame animation for flying
            if (Math.abs(this.vx) > 0.5 || Math.abs(this.vy) > 0.5) {
                this.animationTimer++;
                if (this.animationTimer >= this.animationSpeed) {
                    this.animationTimer = 0;
                    this.frameIndex = (this.frameIndex + 1) % 3; // 3 frames for nivoFly
                }
            } else {
                this.frameIndex = 0;
            }
        } else {
            // Existing Jumping & Gravity logic
            if ((keys.ArrowUp || keys.Space) && this.jumpsLeft > 0 && this.canJump) {
                this.vy = -JUMP_FORCE;
                this.jumpsLeft--;
                this.isGrounded = false;
                this.canJump = false; // Prevent holding key to fly
                
                audio.jump.currentTime = 0;
                audio.jump.volume = 0.22;
                audio.jump.play().catch(e => {});
            }

            if (!keys.ArrowUp && !keys.Space) {
                this.canJump = true; // Key released, can jump again
            }

            // Apply Gravity
            let currentGravity = currentLevel === 3 ? GRAVITY * 0.4 : GRAVITY;
            this.vy += currentGravity;

            // Apply velocity to position
            this.x += this.vx;
            this.y += this.vy;

            // Floor bounds (temporary safety net)
            if (this.y + this.height > 800) { // Fall off world
                lives--;
                if (lives <= 0) {
                    gameOver = true;
                    document.getElementById('restartButton').style.display = 'block';
                    this.vy = 0;
                    this.y = 100;
                } else {
                    init(); // Restart current level
                }
            }
        }

        if (Math.random() < 0.01) {
            console.log("Nivo Pos:", this.x, this.y, " Camera:", camera.x, camera.y);
        }
    }

    draw(ctx) {
        // Flicker effect when invulnerable
        if (this.invulnerableTimer > 0) {
            if (Math.floor(this.invulnerableTimer / 5) % 2 === 0) {
                ctx.globalAlpha = 0.4;
            }
        }

        let currentSprite;
        
        if (currentLevel === 4) {
            currentSprite = sprites.nivoFly[this.frameIndex];
        } else if (!this.isGrounded) {
            // Determine jump frame based on vertical velocity (vy)
            let jumpFrame = 0;
            if (this.vy < -6) {
                jumpFrame = 0; // Rising fast
            } else if (this.vy < 0) {
                jumpFrame = 1; // Near peak
            } else if (this.vy < 6) {
                jumpFrame = 2; // Falling slightly
            } else {
                jumpFrame = 3; // Falling fast
            }
            
            currentSprite = this.facingRight ? sprites.jumpRight[jumpFrame] : sprites.jumpLeft[jumpFrame];
        } else if (Math.abs(this.vx) > 0.5) {
            // Running
            currentSprite = this.facingRight ? sprites.runRight[this.frameIndex] : sprites.runLeft[this.frameIndex];
        } else {
            // Idle
            currentSprite = this.facingRight ? sprites.idleRight : sprites.idleLeft;
        }

        if (currentSprite && currentSprite.complete) {
            // Draw the sprite offset by the transparent padding
            ctx.drawImage(currentSprite, this.x + this.spriteOffsetX - camera.x, this.y + this.spriteOffsetY - camera.y, this.spriteWidth, this.spriteHeight);
        } else {
            // Fallback (draws physical hitbox)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
        }
        
        ctx.globalAlpha = 1.0; // Reset opacity
    }
}

// Platform Class
class Platform {
    constructor(x, y, width, height, color, name, sprite = null, spriteOffsetY = 0, spriteHeightOffset = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.name = name;
        this.sprite = sprite;
        this.spriteOffsetY = spriteOffsetY;
        this.spriteHeightOffset = spriteHeightOffset;
    }

    draw(ctx) {
        if (this.name === 'Floor' && currentFloor && currentFloor.complete) {
            ctx.save();
            // Translate the context so pattern's Y=0 aligns with the platform's top edge
            ctx.translate(-camera.x, this.y + this.spriteOffsetY - camera.y);
            let pattern = ctx.createPattern(currentFloor, 'repeat');
            ctx.fillStyle = pattern;
            // X is already camera-adjusted, we translated X by -camera.x, so draw at this.x
            // Y is translated by this.y - camera.y, so we draw at 0
            ctx.fillRect(this.x, 0, this.width, this.height - this.spriteOffsetY);
            ctx.restore();
        } else if (this.sprite && this.sprite.complete) {
            ctx.drawImage(this.sprite, this.x - camera.x, this.y + this.spriteOffsetY - camera.y, this.width, this.height + this.spriteHeightOffset);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
        }

        ctx.globalAlpha = 1.0; // Restore opacity
    }
}

class Collectible {
    constructor(x, y, size, type = 'book') {
        this.x = x;
        this.y = y;
        this.type = type;
        
        // Make books exactly the same size, ignoring the original size argument
        let visualSize = type === '1up' ? 50 : 40; 
        
        // Physical Hitbox
        this.width = visualSize * 0.4; // Tighter hitbox for collision
        this.height = visualSize * 0.5;
        
        // Sprite rendering
        this.spriteWidth = visualSize;
        this.spriteHeight = visualSize;
        this.spriteOffsetX = -(visualSize - this.width) / 2;
        this.spriteOffsetY = -(visualSize - this.height) / 2;
        
        this.size = visualSize; // Keeping for score logic
        this.collected = false;
        
        // Animation
        this.frameIndex = 0;
        this.animationTimer = 0;
        this.animationSpeed = 6; // frames per tick
        
        // Offset Y so the book floats exactly where the star was intended to
        this.y -= (visualSize - size);
    }
    
    update() {
        if (this.collected) return;
        this.animationTimer++;
        if (this.animationTimer >= this.animationSpeed) {
            this.animationTimer = 0;
            this.frameIndex = (this.frameIndex + 1) % 5;
        }
    }
    
    draw(ctx) {
        if (this.collected) return;
        
        if (this.type === '1up') {
            if (sprites.oneUp && sprites.oneUp.complete) {
                ctx.drawImage(sprites.oneUp, this.x + this.spriteOffsetX - camera.x, this.y + this.spriteOffsetY - camera.y, this.spriteWidth, this.spriteHeight);
            }
            return;
        }

        let sprite = sprites.books[this.frameIndex];
        if (sprite && sprite.complete) {
            ctx.drawImage(sprite, this.x + this.spriteOffsetX - camera.x, this.y + this.spriteOffsetY - camera.y, this.spriteWidth, this.spriteHeight);
        } else {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
        }
    }
}

class Enemy {
    constructor(x, y, width, height, speed, patrolDistance, sprite = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.startX = x;
        this.patrolDistance = patrolDistance;
        this.direction = 1;
        this.sprite = sprite;
        this.isDead = false;
        this.startY = y;
        
        this.frameIndex = 0;
        this.animationTimer = 0;
    }

    update() {
        if (this.isDead) return;
        this.x += this.speed * this.direction;
        
        if (this.sprite === sprites.owl && currentLevel >= 5) {
            this.y = this.startY + Math.sin(this.x / 50) * 40;
        }
        
        let hitObstacle = false;
        for (let p of platforms) {
            if (p.name !== 'Floor' && rectIntersect(this.x, this.y, this.width, this.height, p.x, p.y, p.width, p.height)) {
                hitObstacle = true;
                break;
            }
        }

        if (hitObstacle || Math.abs(this.x - this.startX) > this.patrolDistance) {
            this.direction *= -1;
            this.x += this.speed * this.direction * 2; // move away slightly
        }

        if (Array.isArray(this.sprite)) {
            this.animationTimer++;
            if (this.animationTimer > 5) { // Animation speed
                this.animationTimer = 0;
                this.frameIndex = (this.frameIndex + 1) % this.sprite.length;
                
                // Play wings sound for owls on flap (frame 1)
                if (this.sprite === sprites.owl && this.frameIndex === 1) {
                    let dist = Math.abs(this.x - player.x);
                    if (dist < 800) {
                        let vol = 0.4 * (1 - dist / 800);
                        let sfx = new Audio('assets/owl_wings.wav');
                        sfx.volume = vol;
                        sfx.play().catch(e => {});
                    }
                }
            }
        }
    }

    draw(ctx) {
        if (this.isDead) return;
        
        let currentImage = Array.isArray(this.sprite) ? this.sprite[this.frameIndex] : this.sprite;

        if (currentImage && currentImage.complete) {
            // Flip the sprite horizontally based on direction
            ctx.save();
            ctx.translate(this.x - camera.x + this.width/2, this.y - camera.y + this.height/2);
            if (this.direction < 0) {
                // If the sprite natively faces right, flip it when moving left
                ctx.scale(-1, 1);
            }
            
            // Fix for cloud floating - shift it down visually
            let offsetY = 0;
            if (this.sprite === sprites.cloudEnemy) {
                offsetY = 15;
            }
            
            ctx.drawImage(currentImage, -this.width/2, -this.height/2 + offsetY, this.width, this.height);
            ctx.restore();
        } else {
            ctx.fillStyle = '#FFFFFF'; // White paper plane color
            // Simple triangle for plane
            ctx.beginPath();
            if (this.direction > 0) {
                ctx.moveTo(this.x - camera.x, this.y - camera.y);
                ctx.lineTo(this.x - camera.x + this.width, this.y - camera.y + this.height/2);
                ctx.lineTo(this.x - camera.x, this.y - camera.y + this.height);
            } else {
                ctx.moveTo(this.x - camera.x + this.width, this.y - camera.y);
                ctx.lineTo(this.x - camera.x, this.y - camera.y + this.height/2);
                ctx.lineTo(this.x - camera.x + this.width, this.y - camera.y + this.height);
            }
            ctx.fill();
        }
    }
}

class JumpingEnemy extends Enemy {
    constructor(x, y, width, height, speed, patrolDistance, sprite = null) {
        super(x, y, width, height, speed, patrolDistance, sprite);
        this.vy = 0;
        this.isGrounded = false;
        this.jumpTimer = 0;
    }

    update() {
        if (this.isDead) return;

        if (Array.isArray(this.sprite)) {
            this.animationTimer++;
            if (this.animationTimer > 5) { // Animation speed
                this.animationTimer = 0;
                this.frameIndex = (this.frameIndex + 1) % this.sprite.length;
            }
        }
        
        let currentGravity = currentLevel === 3 ? GRAVITY * 0.4 : GRAVITY;
        this.vy += currentGravity;

        if (!this.isGrounded) {
            this.x += this.speed * this.direction;
        }

        this.y += this.vy;

        this.isGrounded = false;
        for (let p of platforms) {
            if (this.vy >= 0 && 
                this.y + this.height - this.vy <= p.y + 20 && 
                this.y + this.height >= p.y &&
                this.x + this.width > p.x && 
                this.x < p.x + p.width) {
                
                this.isGrounded = true;
                this.vy = 0;
                this.y = p.y - this.height;
            }
        }

        if (this.isGrounded) {
            this.jumpTimer++;
            if (this.jumpTimer > 60) {
                this.vy = -(JUMP_FORCE * 0.8);
                this.jumpTimer = 0;
                
                if (this.x > camera.x - 100 && this.x < camera.x + 900) {
                    audio.cloudBounce.currentTime = 0;
                    audio.cloudBounce.volume = 0.6;
                    audio.cloudBounce.play().catch(e => {});
                }
            }
        }

        // Patrol logic
        if (this.patrolDistance > 0 && Math.abs(this.x - this.startX) >= this.patrolDistance) {
            this.direction *= -1;
            // nudge to prevent getting stuck
            if (this.x > this.startX) {
                this.x = this.startX + this.patrolDistance - 1;
            } else {
                this.x = this.startX - this.patrolDistance + 1;
            }
        }
    }
}

class CometEnemy extends Enemy {
    constructor(x, y, speed) {
        // x, y, width, height, speed, patrolDistance, sprite
        super(x, y, 60, 40, speed, 0, sprites.comet);
        this.direction = 1; // 1 to prevent Enemy.draw from flipping it
    }

    update() {
        if (this.isDead) return;

        this.x -= this.speed; // Move left

        // Clean up if it goes way past camera left
        if (this.x < camera.x - 200) {
            this.isDead = true;
        }

        if (Array.isArray(this.sprite)) {
            this.animationTimer++;
            if (this.animationTimer > 3) { // Fast animation
                this.animationTimer = 0;
                this.frameIndex = (this.frameIndex + 1) % this.sprite.length;
            }
        }
    }
}

class Goal {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        
        // Physical hitbox (smaller than visual size for better gameplay feel)
        this.width = size * 0.6;
        this.height = size * 0.6;
        
        // Render properties
        this.visualSize = size;
        this.offsetX = -(size - this.width) / 2;
        this.offsetY = -(size - this.height) / 2;
        
        this.rotation = 0;
        this.animationTimer = 0;
        this.frameIndex = 0;
    }

    draw(ctx) {
        let centerX = this.x - camera.x + this.width/2;
        let centerY = this.y - camera.y + this.height/2;

        if (currentLevel === 4 && sprites.earth && sprites.earth.complete) {
            ctx.drawImage(sprites.earth, centerX - this.visualSize/2, centerY - this.visualSize/2, this.visualSize, this.visualSize);
        } else if (currentLevel === 8 && sprites.axelMiaHome && sprites.axelMiaHome.complete) {
            let w = 250; 
            let h = w * (838 / 1168);
            // Draw image starting at this.x so the hitbox (which starts at this.x) is on its left edge
            ctx.drawImage(sprites.axelMiaHome, this.x - camera.x, (this.y + this.height) - h, w, h);
        } else if (Array.isArray(sprites.galaxy)) {
            this.animationTimer++;
            if (this.animationTimer > 5) {
                this.animationTimer = 0;
                this.frameIndex = (this.frameIndex + 1) % sprites.galaxy.length;
            }
            let currentGalaxyFrame = sprites.galaxy[this.frameIndex];
            if (currentGalaxyFrame && currentGalaxyFrame.complete) {
                ctx.drawImage(currentGalaxyFrame, centerX - this.visualSize/2, centerY - this.visualSize/2, this.visualSize, this.visualSize);
            }
        } else {
            ctx.fillStyle = '#00BFFF'; // Deep Sky Blue fallback
            ctx.beginPath();
            ctx.arc(centerX, centerY, this.visualSize/2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Narrative System
const educationalQuotes = [
    "Pământul pare plat doar pentru\ncă este foarte mare.",
    "Dacă ai merge mereu înainte, într-o zi\nte-ai întoarce de unde ai plecat.",
    "Uneori adevărul este prea mare ca\nsă-l observi dintr-un singur loc.",
    "Observi cum nimic nu plutește\nprin cameră?", // Doar Level 1
    "Există o forță invizibilă care ține\ntotul la locul său.",
    "Unele lucruri nu se văd,\ndar le simți în fiecare secundă.",
    "Stelele par mici doar pentru\ncă sunt foarte departe.",
    "Unele lumini de pe cer au pornit la drum\nînainte să te naști.",
    "Universul este mai mare decât\norice îți poți imagina.",
    "Fiecare stea are propria poveste.",
    "Uneori, când privești cerul,\nprivești și trecutul.",
    "Întrebarea potrivită este mai importantă\ndecât răspunsul."
];

const moonQuotes = [
    "Observi? Picioarele tale ating solul,\ndar ceva pare diferit.",
    "Gravitația există și aici.\nDoar că nu este la fel de puternică.",
    "Uneori liniștea spune mai multe\ndecât zgomotul.",
    "Cel mai bun mod de a înțelege ceva\neste să-l trăiești."
];

const earthQuotes = [
    "Gravitația nu se vede, dar își face treaba.",
    "Cu cât mă apropii, cu atât Pământul pare mai puternic.",
    "Nu zbor la întâmplare. Sunt atras spre ceva.",
    "Toți oamenii sunt ținuți aproape de aceeași forță.",
    "Fiecare cometă își urmează drumul.\nEu îl urmez pe al meu."
];

const humanQuotes = [
    "Uneori, când suntem supărați,\nvedem doar partea noastră din poveste.",
    "Nu toate lucrurile sunt exact așa\ncum par la prima vedere.",
    "Înainte să tragi o concluzie,\nmerită să privești mai atent.",
    "Poate că nu știi încă\ntoată povestea.",
    "Când ceva doare, primul gând\nnu este mereu cel mai adevărat."
];

let dialogueState = {
    active: false,
    text: "",
    displayedText: "",
    charIndex: 0,
    timer: 0,
    onComplete: null,
    audio: null
};
let lastDialogueScore = 0;
let lastQuoteIndex = -1;

function showNextQuote() {
    let newIndex;
    let quote;
    let quoteArray = (currentLevel >= 5) ? humanQuotes : (currentLevel === 4 ? earthQuotes : (currentLevel === 3 ? moonQuotes : educationalQuotes));
    
    // Pick a random quote, ensuring it's not the same as the last one
    do {
        newIndex = Math.floor(Math.random() * quoteArray.length);
        quote = quoteArray[newIndex];
        // If it's the specific quote and we're not in level 1, pick again
        if (quote.includes("nimic nu plutește") && currentLevel !== 1) {
            continue;
        }
    } while (newIndex === lastQuoteIndex);

    lastQuoteIndex = newIndex;
    let audioSrc = null;
    if (currentLevel >= 5) {
        audioSrc = `assets/nivo_voice_${newIndex + 22}.mp3`; // Starting from 22
    } else if (currentLevel === 4) {
        audioSrc = `assets/nivo_voice_${newIndex + 17}.mp3`; // Starting from 17
    } else if (currentLevel === 3) {
        audioSrc = `assets/nivo_voice_${newIndex + 13}.mp3`;
    } else {
        audioSrc = `assets/nivo_voice_${newIndex + 1}.mp3`;
    }
    startDialogue(quote, null, audioSrc);
}

function startDialogue(text, onComplete = null, audioSrc = null) {
    dialogueState.active = true;
    dialogueState.text = text;
    dialogueState.displayedText = "";
    dialogueState.charIndex = 0;
    dialogueState.timer = 0;
    dialogueState.onComplete = onComplete;
    
    if (audioSrc) {
        if (dialogueState.audio) {
            dialogueState.audio.pause();
        }
        dialogueState.audio = new Audio(audioSrc);
        dialogueState.audio.volume = 1.0;
        dialogueState.audio.play().catch(e => {});
    }

    // reset keys so player doesn't keep running
    keys.ArrowLeft = false;
    keys.ArrowRight = false;
    keys.ArrowUp = false;
}

// Global Entities
let player;
let platforms = [];
let collectibles = [];
let enemies = [];
let goal;
let score = 0;
let lives = 3;
let oneUpCollected = false;
let currentLevel = 1;
let currentBg = null;
let currentFloor = null;
let gameOver = false;
let gameWon = false;
let gameStarted = false;

let bookAudioTimes = [];

function init() {
    // Only reset score/lives if starting fresh
    if (gameOver || gameWon) {
        score = 0;
        lives = 3;
        oneUpCollected = false;
        if (gameWon) {
            currentLevel = 1;
        } else if (currentLevel >= 5 && currentLevel <= 8) {
            currentLevel = 5;
        } else {
            currentLevel = 1;
        }
        lastDialogueScore = 0;
        lastQuoteIndex = -1;
    }
    
    gameOver = false;
    gameWon = false;
    platforms = [];
    collectibles = [];
    enemies = [];
    player = new Player(50, 400); // Start position

    const btnDown = document.getElementById('btn-down');
    if (btnDown && currentLevel !== 4) btnDown.style.display = 'none';

    if (currentLevel === 1) {
        loadLevel1();
    } else if (currentLevel === 2) {
        loadLevel2();
    } else if (currentLevel === 3) {
        loadLevel3();
    } else if (currentLevel === 4) {
        loadLevel4();
    } else if (currentLevel === 5) {
        loadLevel5();
    } else if (currentLevel === 6) {
        loadLevel6();
    } else if (currentLevel === 7) {
        loadLevel7();
    } else if (currentLevel === 8) {
        loadLevel8();
    }
    
    player.x = 100;
}

function loadLevel1() {
    currentBg = sprites.bg;
    currentFloor = sprites.floor;

    // Segment 1: Start & Pillow
    platforms.push(new Platform(0, 500, 800, 100, '#8B4513', 'Floor')); // Base floor
    platforms.push(new Platform(300, 464, 100, 40, '#4169E1', 'Pillow', sprites.elementPillow, 0));

    // Segment 2: Chair
    platforms.push(new Platform(800, 500, 600, 100, '#8B4513', 'Floor'));
    platforms.push(new Platform(1000, 400, 80, 100, '#DC143C', 'Chair', sprites.chair));

    // Segment 3: 4 Chairs Stack
    platforms.push(new Platform(1400, 500, 600, 100, '#8B4513', 'Floor'));
    platforms.push(new Platform(1600, 300, 80, 200, '#228B22', '4 Chairs Stack', sprites.fourChairs));

    // Segment 4: Chair -> Bed -> Toys
    platforms.push(new Platform(2000, 500, 400, 100, '#8B4513', 'Floor'));
    platforms.push(new Platform(2300, 400, 80, 30, '#A0522D', 'Chair Seat', sprites.shelfVerySmall));
    platforms.push(new Platform(2500, 300, 400, 50, '#FFB6C1', 'Bed', sprites.shelfVeryLarge));
    platforms.push(new Platform(2800, 260, 80, 40, '#FFF0F5', 'Toys', sprites.elementToys));

    // Segment 5: Drop from bed (floor continues)
    platforms.push(new Platform(2900, 500, 600, 100, '#8B4513', 'Floor'));

    // Segment 6: Desk (Route under and over)
    platforms.push(new Platform(3500, 500, 800, 100, '#8B4513', 'Floor'));
    platforms.push(new Platform(3700, 250, 500, 50, '#DEB887', 'Desk Top', sprites.shelfVeryLarge));

    // Segment 7: Climbing to shelves
    platforms.push(new Platform(4300, 500, 800, 100, '#8B4513', 'Floor'));
    platforms.push(new Platform(4400, 400, 80, 100, '#4682B4', 'Chair', sprites.chair));
    platforms.push(new Platform(4500, 380, 80, 30, '#F5F5DC', 'Notebook', sprites.shelfVerySmall));
    platforms.push(new Platform(4620, 280, 120, 80, '#FF4500', 'Backpack', sprites.raftCarti));

    // Segment 8: Small Shelf -> Large Shelf -> Globe (Goal)
    platforms.push(new Platform(4800, 300, 120, 30, '#D2691E', 'Small Shelf', sprites.shelfSmall));
    platforms.push(new Platform(5000, 200, 180, 40, '#8B4513', 'Large Shelf', sprites.shelfLarge));
    
    populateLevel1Entities();
}

function loadLevel2() {
    currentBg = sprites.bg2;
    currentFloor = sprites.floor2;

    // Segment 1: Start (0 - 800)
    platforms.push(new Platform(0, 500, 800, 100, '#8B4513', 'Floor'));
    platforms.push(new Platform(300, 460, 60, 40, '#8B4513', 'Rock', sprites.rock, -10, 20));
    platforms.push(new Platform(600, 430, 80, 70, '#8B4513', 'Small Trunk', sprites.smallTrunk, -15, 30));

    // Segment 2: Gap and Big Trunk (900 - 1500)
    platforms.push(new Platform(900, 500, 600, 100, '#8B4513', 'Floor'));
    // Big Trunk pillar is now thin and tall
    platforms.push(new Platform(1100, 350, 80, 150, '#8B4513', 'Big Trunk', sprites.bigTrunk, -15, 30));

    // Segment 3: Higher Ground (1700 - 2500)
    platforms.push(new Platform(1700, 450, 800, 150, '#8B4513', 'Floor'));
    platforms.push(new Platform(1900, 410, 60, 40, '#8B4513', 'Rock', sprites.rock, -10, 20));
    platforms.push(new Platform(2200, 380, 80, 70, '#8B4513', 'Small Trunk', sprites.smallTrunk, -15, 30));

    // Segment 4: Dropping down into rocks (2700 - 3200)
    platforms.push(new Platform(2700, 500, 500, 100, '#8B4513', 'Floor'));
    platforms.push(new Platform(2800, 460, 60, 40, '#8B4513', 'Rock', sprites.rock, -10, 20));
    platforms.push(new Platform(2900, 460, 60, 40, '#8B4513', 'Rock', sprites.rock, -10, 20));
    platforms.push(new Platform(3000, 460, 60, 40, '#8B4513', 'Rock', sprites.rock, -10, 20));

    // Segment 5: High peak (3400 - 4200)
    platforms.push(new Platform(3400, 400, 800, 200, '#8B4513', 'Floor'));
    platforms.push(new Platform(3800, 250, 80, 150, '#8B4513', 'Big Trunk', sprites.bigTrunk, -15, 30));

    // Segment 6: Final sprint and Goal Ascent (4400 - 5000)
    platforms.push(new Platform(4400, 500, 600, 100, '#8B4513', 'Floor'));
    
    // Trunks to step up to the galaxy
    platforms.push(new Platform(4700, 430, 80, 70, '#8B4513', 'Small Trunk', sprites.smallTrunk, -15, 30));
    platforms.push(new Platform(4850, 350, 80, 150, '#8B4513', 'Big Trunk', sprites.bigTrunk, -15, 30));

    populateLevel2Entities();
}

function populateLevel1Entities() {
    // Items - Segment 1
    collectibles.push(new Collectible(100, 470, 15));
    collectibles.push(new Collectible(150, 470, 15));
    collectibles.push(new Collectible(200, 470, 15));
    
    // Items - Segment 2
    collectibles.push(new Collectible(1020, 360, 15));
    collectibles.push(new Collectible(1050, 360, 15));
    collectibles.push(new Collectible(1080, 360, 15));

    // Items - Segment 3
    collectibles.push(new Collectible(1620, 260, 15));
    collectibles.push(new Collectible(1640, 260, 15));
    collectibles.push(new Collectible(1660, 260, 15));
    collectibles.push(new Collectible(1630, 230, 15));
    collectibles.push(new Collectible(1650, 230, 15));

    // Items - Segment 4 (Large Star)
    collectibles.push(new Collectible(2830, 210, 30));

    // Items - Segment 6 (Desk Hard Route)
    collectibles.push(new Collectible(3800, 210, 15));
    collectibles.push(new Collectible(3900, 210, 15));
    collectibles.push(new Collectible(4000, 210, 15));
    collectibles.push(new Collectible(4100, 210, 15));

    // Enemies
    enemies.push(new Enemy(650, 470, 50, 30, 1.5, 150, sprites.plane));
    enemies.push(new Enemy(3000, 470, 50, 30, 2, 200, sprites.plane)); 
    enemies.push(new Enemy(3750, 470, 50, 30, 2.5, 250, sprites.plane));
    enemies.push(new Enemy(4500, 250, 50, 30, 2, 120, sprites.plane));

    // Goal
    goal = new Goal(5060, 80, 120);
}

function populateLevel2Entities() {
    // Level 2 Specific Items
    // Seg 1
    collectibles.push(new Collectible(250, 470, 15));
    collectibles.push(new Collectible(400, 470, 15));
    
    // Gap 1
    collectibles.push(new Collectible(850, 420, 15));

    // Big Trunk
    collectibles.push(new Collectible(1150, 280, 15));
    collectibles.push(new Collectible(1190, 280, 15));

    // High Ground
    collectibles.push(new Collectible(1800, 420, 15));
    collectibles.push(new Collectible(2000, 420, 15));
    
    // Gap 2
    collectibles.push(new Collectible(2600, 450, 15));

    // Rocks section
    collectibles.push(new Collectible(2830, 380, 15));
    collectibles.push(new Collectible(2930, 380, 15));

    // High Peak Big Trunk
    collectibles.push(new Collectible(3850, 180, 15));
    collectibles.push(new Collectible(3890, 180, 15));

    // Final stretch (Moved left to avoid trunks)
    collectibles.push(new Collectible(4500, 470, 15));
    collectibles.push(new Collectible(4550, 470, 15));
    collectibles.push(new Collectible(4600, 470, 15));

    // Enemies (Owls in Level 2)
    // Making them 50x50 and adjusting Y by -20 to stand nicely since they are taller than 30
    enemies.push(new Enemy(450, 450, 50, 50, 1.5, 120, sprites.owl)); // After rock
    enemies.push(new Enemy(1350, 450, 50, 50, 2, 150, sprites.owl)); // After big trunk
    enemies.push(new Enemy(2400, 400, 50, 50, 2, 150, sprites.owl)); // High ground
    enemies.push(new Enemy(3150, 450, 50, 50, 2.5, 100, sprites.owl)); // After rocks
    enemies.push(new Enemy(4100, 350, 50, 50, 2, 150, sprites.owl)); // Near big trunk descent

    // Goal
    // Moved closer to the tall trunk and lowered so Nivo can jump into it easily
    goal = new Goal(4920, 150, 120);
}

function loadLevel3() {
    currentBg = sprites.bg3;
    currentFloor = sprites.floor3;

    // Segment 1: Starting platform
    platforms.push(new Platform(0, 500, 800, 100, '#888888', 'Floor'));

    // Segment 2: Large jump over crater
    platforms.push(new Platform(1200, 450, 400, 150, '#888888', 'Floor'));
    enemies.push(new JumpingEnemy(1300, 400, 50, 50, 2, 80, sprites.cloudEnemy));

    // Segment 3: Floating asteroids
    platforms.push(new Platform(1900, 350, 150, 40, '#888888', 'Asteroid', sprites.asteroidSmall, -10, 20));
    platforms.push(new Platform(2300, 250, 150, 40, '#888888', 'Asteroid', sprites.asteroidSmall, -10, 20));
    platforms.push(new Platform(2700, 150, 100, 40, '#888888', 'Asteroid', sprites.asteroidVerySmall, -10, 20));

    // Segment 4: High plateau
    platforms.push(new Platform(3200, 400, 800, 200, '#888888', 'Floor'));
    enemies.push(new JumpingEnemy(3400, 350, 50, 50, 1.5, 150, sprites.cloudEnemy));
    enemies.push(new JumpingEnemy(3800, 350, 50, 50, 1.5, 150, sprites.cloudEnemy));

    // Segment 5: Massive gap and small platforms
    platforms.push(new Platform(4500, 300, 250, 50, '#888888', 'Asteroid', sprites.asteroidLarge, -15, 30));
    platforms.push(new Platform(5000, 450, 250, 50, '#888888', 'Asteroid', sprites.asteroidLarge, -15, 30));
    
    // Segment 6: Final stretch
    platforms.push(new Platform(5500, 500, 1000, 100, '#888888', 'Floor'));
    enemies.push(new JumpingEnemy(5800, 450, 50, 50, 2, 200, sprites.cloudEnemy));

    // Collectibles (Books) - We need 10 to trigger narrative
    let cx = 300;
    for(let i=0; i<15; i++) {
        collectibles.push(new Collectible(cx, 300 + Math.sin(i) * 50, 15));
        cx += 400;
    }

    // Goal (Galaxy/Ship)
    goal = new Goal(6300, 300, 120);
}

function loadLevel4() {
    currentBg = sprites.bg4;
    currentFloor = null; // No floor in space

    const btnDown = document.getElementById('btn-down');
    if (btnDown) btnDown.style.display = 'flex';

    let cx = 800;
    for(let i=0; i<80; i++) {
        collectibles.push(new Collectible(cx, 100 + Math.random() * 400, 15));
        cx += 200 + Math.random() * 200;
    }

    // Goal is Earth at the end
    goal = new Goal(20000, 300, 500); // Very large Earth!
}

function loadLevel5() {
    currentBg = sprites.bg5;
    currentFloor = sprites.floor5;
    
    // 1up collectible at the beginning of level 5
    if (!oneUpCollected) {
        collectibles.push(new Collectible(850, 250, 50, '1up'));
    }

    // Segment 1: Starting platform
    platforms.push(new Platform(0, 500, 800, 100, '#888888', 'Floor'));
    
    // Segment 2: First gap and ground
    platforms.push(new Platform(1000, 450, 600, 150, '#888888', 'Floor'));
    enemies.push(new Enemy(1200, 400, 50, 50, 1.5, 150, sprites.owl));
    enemies.push(new JumpingEnemy(1400, 400, 50, 50, 2, 100, sprites.cloudEnemy));

    // Segment 3: Stepping stones
    platforms.push(new Platform(1800, 350, 250, 40, '#888888', 'Floating Ground', sprites.upgroundSmall, -28, 60));
    platforms.push(new Platform(2150, 250, 800, 40, '#888888', 'Floating Ground', sprites.upgroundVeryLarge, -45, 120));
    
    // Segment 4: High ground with mixed enemies
    enemies.push(new Enemy(2250, 100, 50, 50, 2, 150, sprites.owl));
    enemies.push(new JumpingEnemy(2550, 200, 50, 50, 1.5, 150, sprites.cloudEnemy));
    enemies.push(new Enemy(2750, 150, 50, 50, 2, 150, sprites.owl));
    enemies.push(new Enemy(2950, 50, 50, 50, 2.5, 200, sprites.owl)); // extra owl
    
    // Segment 5: Dropping down
    platforms.push(new Platform(3100, 400, 600, 40, '#888888', 'Floating Ground', sprites.upgroundLarge, -47, 127));
    enemies.push(new JumpingEnemy(3400, 350, 50, 50, 2, 120, sprites.cloudEnemy));
    enemies.push(new Enemy(3600, 180, 50, 50, 2, 150, sprites.owl)); // extra owl

    // Segment 6: Scattered floating platforms
    platforms.push(new Platform(3900, 300, 360, 40, '#888888', 'Floating Ground', sprites.upgroundLarge, -28, 60));
    enemies.push(new Enemy(4100, 100, 50, 50, 2.5, 150, sprites.owl)); // extra owl
    
    platforms.push(new Platform(4400, 200, 250, 40, '#888888', 'Floating Ground', sprites.upgroundSmall, -28, 60));
    platforms.push(new Platform(4800, 350, 500, 40, '#888888', 'Floating Ground', sprites.upgroundVeryLarge, -28, 60));
    enemies.push(new Enemy(5000, 150, 50, 50, 2, 200, sprites.owl)); // extra owl
    enemies.push(new Enemy(5300, 200, 50, 50, 3, 150, sprites.owl)); // extra owl
    
    platforms.push(new Platform(5500, 150, 160, 40, '#888888', 'Floating Ground', sprites.upgroundVerySmall, -45, 60));

    // Segment 7: Mid sprint
    platforms.push(new Platform(5850, 500, 1400, 100, '#888888', 'Floor'));
    enemies.push(new JumpingEnemy(6050, 450, 50, 50, 2, 180, sprites.cloudEnemy));
    enemies.push(new Enemy(6350, 300, 50, 50, 2, 150, sprites.owl));
    enemies.push(new Enemy(6500, 150, 50, 50, 2.5, 180, sprites.owl)); // extra owl
    enemies.push(new JumpingEnemy(6650, 450, 50, 50, 2, 180, sprites.cloudEnemy));

    // Segment 8: Gap & Stepping stones
    platforms.push(new Platform(7400, 350, 360, 40, '#888888', 'Floating Ground', sprites.upgroundLarge, -28, 60));
    platforms.push(new Platform(7900, 250, 250, 40, '#888888', 'Floating Ground', sprites.upgroundSmall, -28, 60));
    enemies.push(new Enemy(8000, 100, 50, 50, 2, 150, sprites.owl));
    platforms.push(new Platform(8350, 150, 160, 40, '#888888', 'Floating Ground', sprites.upgroundVerySmall, -45, 60));
    platforms.push(new Platform(8650, 400, 800, 100, '#888888', 'Floor'));
    
    // Segment 9: High and low paths
    enemies.push(new JumpingEnemy(8800, 350, 50, 50, 2, 150, sprites.cloudEnemy));
    enemies.push(new Enemy(9100, 100, 50, 50, 2.5, 200, sprites.owl));
    platforms.push(new Platform(8850, 200, 500, 40, '#888888', 'Floating Ground', sprites.upgroundVeryLarge, -28, 60));
    platforms.push(new Platform(9500, 300, 250, 40, '#888888', 'Floating Ground', sprites.upgroundSmall, -28, 60));
    platforms.push(new Platform(9900, 500, 600, 100, '#888888', 'Floor'));
    
    // Segment 10: Tricky jumps
    platforms.push(new Platform(10700, 400, 360, 40, '#888888', 'Floating Ground', sprites.upgroundLarge, -28, 60));
    platforms.push(new Platform(11200, 300, 250, 40, '#888888', 'Floating Ground', sprites.upgroundSmall, -28, 60));
    platforms.push(new Platform(11600, 200, 360, 40, '#888888', 'Floating Ground', sprites.upgroundLarge, -28, 60));
    enemies.push(new Enemy(11300, 150, 50, 50, 2, 150, sprites.owl));
    platforms.push(new Platform(12100, 500, 1000, 100, '#888888', 'Floor'));
    
    // Segment 11: Final sprint
    platforms.push(new Platform(12300, 350, 800, 40, '#888888', 'Floating Ground', sprites.upgroundVeryLarge, -45, 120));
    enemies.push(new Enemy(12400, 150, 50, 50, 2.5, 200, sprites.owl));
    enemies.push(new JumpingEnemy(12500, 450, 50, 50, 2, 150, sprites.cloudEnemy));
    enemies.push(new Enemy(12800, 200, 50, 50, 2, 150, sprites.owl));
    enemies.push(new JumpingEnemy(12900, 450, 50, 50, 2, 150, sprites.cloudEnemy));
    platforms.push(new Platform(13100, 500, 1000, 100, '#888888', 'Floor'));

    // Collectibles (Books) - manually positioned so they don't clip into platforms
    const bookCoords = [
        [300, 350], [600, 350], [1100, 300], [1500, 350], // Start segment
        [1850, 250], // Above upgroundSmall y=350
        [2300, 150], [2500, 100], [2800, 150], // Above upgroundVeryLarge y=250
        [3200, 300], [3500, 250], // Above upgroundLarge y=400
        [4000, 200], // Above upgroundLarge y=300
        [4450, 100], // Above upgroundSmall y=200
        [4900, 250], [5100, 200], // Above upgroundVeryLarge y=350
        [5550, 50], // Above upgroundVerySmall y=150
        [6000, 350], [6300, 300], [6600, 350], [6900, 300], // On the long floor y=500
        [7500, 250], // Above upgroundLarge y=350
        [7950, 150], // Above upgroundSmall y=250
        [8400, 50], // Above upgroundVerySmall y=150
        [8800, 300], [9100, 250], [9300, 300], // On the lower floor y=400
        [8900, 100], [9200, 100], // On the higher floating ground y=200
        [9550, 200], // Above upgroundSmall y=300
        [10000, 350], [10300, 300], // On the floor y=500
        [10800, 300], // Above upgroundLarge y=400
        [11250, 200], // Above upgroundSmall y=300
        [11700, 100], // Above upgroundLarge y=200
        [12200, 350], // On floor y=500 before final sprint
        [12400, 250], [12600, 200], [12900, 250], // Above the final sprint upgroundVeryLarge y=350
        [13300, 350] // On final floor y=500
    ];

    for (let pos of bookCoords) {
        collectibles.push(new Collectible(pos[0], pos[1], 15));
    }
    
    // Goal
    goal = new Goal(13800, 300, 120);
}

function loadLevel6() {
    currentBg = sprites.bg6; // Use actual level 6 background
    currentFloor = sprites.floor5; // Reuse level 5 floor
    
    const btnDown = document.getElementById('btn-down');
    if (btnDown) btnDown.style.display = 'none';

    // Segment 1
    platforms.push(new Platform(400, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(800, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(0, 500, 1000, 100, '#888888', 'Floor'));
    enemies.push(new Enemy(600, 450, 50, 50, 2, 100, sprites.leafEnemy));
    
    // Segment 2
    platforms.push(new Platform(1500, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(1900, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(1200, 500, 1200, 100, '#888888', 'Floor'));
    enemies.push(new Enemy(1350, 300, 50, 50, 2.5, 100, sprites.owl));
    enemies.push(new Enemy(1750, 450, 50, 50, 2, 150, sprites.leafEnemy));
    enemies.push(new Enemy(2100, 450, 50, 50, 3, 200, sprites.leafEnemy));

    // Segment 3
    platforms.push(new Platform(2800, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(3100, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(3400, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(2600, 500, 1000, 100, '#888888', 'Floor'));
    enemies.push(new Enemy(2950, 450, 50, 50, 1.5, 100, sprites.leafEnemy));
    enemies.push(new Enemy(3250, 450, 50, 50, 1.5, 100, sprites.leafEnemy));

    // Segment 4 (High and low paths)
    platforms.push(new Platform(4100, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(4500, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(5000, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(3800, 500, 1700, 100, '#888888', 'Floor'));
    
    // Moved down to 300 to be reachable with a double jump from y=500
    platforms.push(new Platform(4300, 300, 600, 40, '#888888', 'Floating Ground', sprites.upgroundLarge, -28, 60));
    enemies.push(new Enemy(4400, 200, 50, 50, 2, 100, sprites.owl)); // Owl above platform
    enemies.push(new Enemy(4700, 450, 50, 50, 2, 100, sprites.leafEnemy)); // Storm on the floor
    enemies.push(new Enemy(5200, 450, 50, 50, 3, 150, sprites.leafEnemy)); // Storm on the floor below platform

    // Segment 5
    platforms.push(new Platform(6000, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(6400, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(5800, 500, 1000, 100, '#888888', 'Floor'));
    enemies.push(new Enemy(6200, 450, 50, 50, 2, 150, sprites.leafEnemy));

    // Segment 6 (Platforming over gap)
    platforms.push(new Platform(7100, 350, 250, 40, '#888888', 'Floating Ground', sprites.upgroundSmall, -28, 60));
    platforms.push(new Platform(7400, 250, 250, 40, '#888888', 'Floating Ground', sprites.upgroundSmall, -28, 60));
    platforms.push(new Platform(7700, 300, 360, 40, '#888888', 'Floating Ground', sprites.upgroundLarge, -28, 60));
    enemies.push(new Enemy(7800, 250, 50, 50, 2, 100, sprites.owl));

    // Segment 7
    platforms.push(new Platform(8400, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(8800, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(9200, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(8200, 500, 1300, 100, '#888888', 'Floor'));
    enemies.push(new Enemy(8600, 450, 50, 50, 2, 150, sprites.leafEnemy));
    enemies.push(new Enemy(9000, 350, 50, 50, 3, 200, sprites.owl));

    // Segment 8 (High floating paths)
    platforms.push(new Platform(9800, 500, 1200, 100, '#888888', 'Floor'));
    // Moved down to 300 and 200 to be reachable with a double jump
    platforms.push(new Platform(10000, 300, 360, 40, '#888888', 'Floating Ground', sprites.upgroundLarge, -28, 60));
    platforms.push(new Platform(10500, 200, 360, 40, '#888888', 'Floating Ground', sprites.upgroundLarge, -28, 60));
    enemies.push(new Enemy(10200, 220, 50, 50, 2, 150, sprites.owl)); // Above first platform
    enemies.push(new Enemy(10600, 120, 50, 50, 2, 100, sprites.owl)); // Above second platform
    enemies.push(new Enemy(10800, 420, 50, 50, 2, 150, sprites.owl)); // Below platforms

    // Segment 9 (Fast jumping)
    platforms.push(new Platform(11400, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(11700, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(12000, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(12300, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(11200, 500, 1300, 100, '#888888', 'Floor'));
    enemies.push(new Enemy(11550, 450, 50, 50, 2, 100, sprites.leafEnemy)); // Storm on the floor
    enemies.push(new Enemy(11850, 450, 50, 50, 2, 100, sprites.leafEnemy)); // Storm on the floor

    // Segment 10 (Final sprint)
    platforms.push(new Platform(13000, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(13400, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(13800, 400, 150, 150, '#888888', 'Fence', sprites.fence, 0, 0));
    platforms.push(new Platform(12800, 500, 1400, 100, '#888888', 'Floor'));
    enemies.push(new Enemy(13200, 450, 50, 50, 2.5, 150, sprites.leafEnemy));
    enemies.push(new Enemy(13600, 350, 50, 50, 3, 150, sprites.owl));

    // Goal
    goal = new Goal(14000, 300, 120);

    // Books placement
    const bookCoords6 = [
        [300, 350], [600, 350], [1050, 350], // Seg 1 -> gap
        [1400, 350], [1700, 350], [2000, 300], [2450, 350], // Seg 2 -> gap
        [2700, 350], [2950, 250], [3250, 250], // Seg 3
        [3950, 350], [4400, 200], [4600, 200], [5100, 350], // Seg 4 (Fixed Y coords for higher platform)
        [5650, 300], // gap
        [5900, 350], [6200, 350], [6600, 350], // Seg 5
        [7150, 250], [7450, 150], [7800, 200], // Seg 6 floating
        [8300, 350], [8600, 250], [9000, 250], [9350, 350], // Seg 7
        [9650, 300], // gap
        [9900, 350], [10200, 200], [10600, 100], [10900, 350], // Seg 8 (Fixed Y coords for higher platforms)
        [11300, 350], [11550, 200], [11850, 200], [12150, 200], // Seg 9
        [12650, 350], // gap
        [12900, 350], [13200, 250], [13600, 250], [13900, 350] // Seg 10
    ];

    for (let pos of bookCoords6) {
        collectibles.push(new Collectible(pos[0], pos[1], 15));
    }
}

function loadLevel7() {
    currentBg = sprites.bg7;
    currentFloor = sprites.floor7;
    
    const btnDown = document.getElementById('btn-down');
    if (btnDown) btnDown.style.display = 'none';

    // Segment 1 (Basic intro)
    platforms.push(new Platform(0, 500, 1000, 100, '#888888', 'Floor'));
    platforms.push(new Platform(400, 350, 150, 40, '#888888', 'Cloud', sprites.cloudSmall, -20, 10));
    platforms.push(new Platform(700, 250, 250, 40, '#888888', 'Cloud', sprites.cloudLarge, -25, 15));
    enemies.push(new Enemy(600, 450, 50, 50, 2, 150, sprites.owl));
    
    // Segment 2 (Cloud jumping over gap)
    platforms.push(new Platform(1200, 500, 400, 100, '#888888', 'Floor'));
    platforms.push(new Platform(1700, 350, 360, 40, '#888888', 'Cloud', sprites.cloudVeryLarge, -20, 8));
    platforms.push(new Platform(2100, 250, 80, 40, '#888888', 'Cloud', sprites.cloudVerySmall, -10, -14));
    platforms.push(new Platform(2300, 150, 150, 40, '#888888', 'Cloud', sprites.cloudSmall, -20, 10));
    enemies.push(new Enemy(1300, 450, 50, 50, 2, 100, sprites.owl));
    enemies.push(new Enemy(1800, 250, 50, 50, 1.5, 100, sprites.owl)); // On very large cloud
    
    // Segment 3 (Long ground with aerial threats)
    platforms.push(new Platform(2600, 500, 1200, 100, '#888888', 'Floor'));
    platforms.push(new Platform(2900, 350, 250, 40, '#888888', 'Cloud', sprites.cloudLarge, -25, 15));
    platforms.push(new Platform(3400, 350, 250, 40, '#888888', 'Cloud', sprites.cloudLarge, -25, 15));
    enemies.push(new Enemy(2800, 450, 50, 50, 2.5, 200, sprites.owl));
    enemies.push(new Enemy(3200, 450, 50, 50, 3, 200, sprites.owl));
    enemies.push(new Enemy(3000, 200, 50, 50, 2, 150, sprites.owl)); // Flying above clouds
    
    // Segment 4 (Precision jumps)
    platforms.push(new Platform(4000, 350, 80, 40, '#888888', 'Cloud', sprites.cloudVerySmall, -10, -14));
    platforms.push(new Platform(4300, 250, 80, 40, '#888888', 'Cloud', sprites.cloudVerySmall, -10, -14));
    platforms.push(new Platform(4600, 150, 80, 40, '#888888', 'Cloud', sprites.cloudVerySmall, -10, -14));
    platforms.push(new Platform(4900, 300, 150, 40, '#888888', 'Cloud', sprites.cloudSmall, -20, 10));
    enemies.push(new Enemy(4200, 200, 50, 50, 2, 100, sprites.owl));
    enemies.push(new Enemy(4700, 250, 50, 50, 2, 150, sprites.owl));
    
    // Segment 5 (Safe zone and massive cloud)
    platforms.push(new Platform(5200, 500, 800, 100, '#888888', 'Floor'));
    platforms.push(new Platform(6200, 350, 360, 40, '#888888', 'Cloud', sprites.cloudVeryLarge, -20, 8));
    platforms.push(new Platform(6600, 350, 360, 40, '#888888', 'Cloud', sprites.cloudVeryLarge, -20, 8));
    enemies.push(new Enemy(5500, 450, 50, 50, 2, 200, sprites.owl));
    enemies.push(new Enemy(6400, 250, 50, 50, 2, 150, sprites.owl));
    enemies.push(new Enemy(6700, 150, 50, 50, 2.5, 200, sprites.owl));
    
    // Segment 6 (Descent and ascent)
    platforms.push(new Platform(7100, 450, 150, 40, '#888888', 'Cloud', sprites.cloudSmall, -20, 10));
    platforms.push(new Platform(7400, 500, 800, 100, '#888888', 'Floor'));
    platforms.push(new Platform(7600, 350, 150, 40, '#888888', 'Cloud', sprites.cloudSmall, -20, 10));
    platforms.push(new Platform(7900, 250, 250, 40, '#888888', 'Cloud', sprites.cloudLarge, -25, 15));
    enemies.push(new Enemy(7600, 450, 50, 50, 3, 150, sprites.owl));
    enemies.push(new Enemy(8000, 150, 50, 50, 2, 100, sprites.owl));
    
    // Segment 7 (Cloud staircase)
    platforms.push(new Platform(8400, 400, 250, 40, '#888888', 'Cloud', sprites.cloudLarge, -25, 15));
    platforms.push(new Platform(8700, 300, 150, 40, '#888888', 'Cloud', sprites.cloudSmall, -20, 10));
    platforms.push(new Platform(9000, 200, 80, 40, '#888888', 'Cloud', sprites.cloudVerySmall, -10, -14));
    platforms.push(new Platform(9300, 150, 360, 40, '#888888', 'Cloud', sprites.cloudVeryLarge, -20, 8));
    enemies.push(new Enemy(8500, 300, 50, 50, 1.5, 100, sprites.owl));
    enemies.push(new Enemy(9100, 150, 50, 50, 2, 100, sprites.owl));
    enemies.push(new Enemy(9400, 50, 50, 50, 2.5, 150, sprites.owl)); // Very high owl
    
    // Segment 8 (Long floor stretch)
    platforms.push(new Platform(9800, 500, 1500, 100, '#888888', 'Floor'));
    platforms.push(new Platform(10200, 350, 250, 40, '#888888', 'Cloud', sprites.cloudLarge, -25, 15));
    platforms.push(new Platform(10700, 250, 250, 40, '#888888', 'Cloud', sprites.cloudLarge, -25, 15));
    enemies.push(new Enemy(10000, 450, 50, 50, 3, 200, sprites.owl));
    enemies.push(new Enemy(10400, 450, 50, 50, 3, 200, sprites.owl));
    enemies.push(new Enemy(10800, 450, 50, 50, 3, 200, sprites.owl));
    enemies.push(new Enemy(10300, 250, 50, 50, 2, 100, sprites.owl));
    
    // Segment 9 (Tricky clouds)
    platforms.push(new Platform(11500, 400, 80, 40, '#888888', 'Cloud', sprites.cloudVerySmall, -10, -14));
    platforms.push(new Platform(11800, 300, 150, 40, '#888888', 'Cloud', sprites.cloudSmall, -20, 10));
    platforms.push(new Platform(12100, 200, 80, 40, '#888888', 'Cloud', sprites.cloudVerySmall, -10, -14));
    platforms.push(new Platform(12400, 300, 250, 40, '#888888', 'Cloud', sprites.cloudLarge, -25, 15));
    enemies.push(new Enemy(11650, 250, 50, 50, 2, 100, sprites.owl));
    enemies.push(new Enemy(11950, 150, 50, 50, 2, 100, sprites.owl));
    enemies.push(new Enemy(12500, 200, 50, 50, 2, 100, sprites.owl));
    
    // Segment 10 (Final sprint)
    platforms.push(new Platform(12800, 500, 1800, 100, '#888888', 'Floor'));
    platforms.push(new Platform(13200, 350, 360, 40, '#888888', 'Cloud', sprites.cloudVeryLarge, -20, 8));
    platforms.push(new Platform(13800, 250, 360, 40, '#888888', 'Cloud', sprites.cloudVeryLarge, -20, 8));
    enemies.push(new Enemy(13000, 450, 50, 50, 3, 150, sprites.owl));
    enemies.push(new Enemy(13400, 450, 50, 50, 3, 150, sprites.owl));
    enemies.push(new Enemy(13900, 450, 50, 50, 3, 150, sprites.owl));
    enemies.push(new Enemy(13300, 250, 50, 50, 2, 150, sprites.owl));
    enemies.push(new Enemy(13900, 150, 50, 50, 2, 150, sprites.owl));
    
    // Goal
    goal = new Goal(14400, 300, 120);
    
    // Books
    const bookCoords7 = [
        [450, 300], [750, 200], [900, 450], // Seg 1
        [1400, 450], [1800, 300], [2100, 200], [2350, 100], // Seg 2
        [2700, 450], [3000, 300], [3500, 300], [3700, 450], // Seg 3
        [4000, 300], [4300, 200], [4600, 100], [4950, 250], // Seg 4
        [5400, 450], [5800, 450], [6300, 300], [6700, 300], // Seg 5
        [7150, 400], [7700, 300], [8000, 200], // Seg 6
        [8500, 350], [8750, 250], [9000, 150], [9400, 50], // Seg 7
        [9900, 450], [10300, 300], [10800, 200], [11100, 450], // Seg 8
        [11500, 350], [11850, 250], [12100, 150], [12500, 250], // Seg 9
        [13000, 450], [13300, 300], [13600, 450], [13900, 200], [14200, 450] // Seg 10
    ];
    for (let pos of bookCoords7) {
        collectibles.push(new Collectible(pos[0], pos[1], 15));
    }
}

function loadLevel8() {
    currentBg = sprites.bg8;
    currentFloor = sprites.floor8;
    
    const btnDown = document.getElementById('btn-down');
    if (btnDown) btnDown.style.display = 'none';

    // A shorter, peaceful level with clouds and no enemies
    platforms.push(new Platform(0, 500, 1500, 100, '#888888', 'Floor', null, -30));
    platforms.push(new Platform(600, 350, 150, 40, '#888888', 'Cloud', sprites.cloudSmall, -20, 10));
    platforms.push(new Platform(900, 250, 250, 40, '#888888', 'Cloud', sprites.cloudLarge, -25, 15));
    
    platforms.push(new Platform(1600, 500, 1000, 100, '#888888', 'Floor', null, -30));
    platforms.push(new Platform(2000, 350, 360, 40, '#888888', 'Cloud', sprites.cloudVeryLarge, -20, 8));
    platforms.push(new Platform(2500, 250, 150, 40, '#888888', 'Cloud', sprites.cloudSmall, -20, 10));
    
    platforms.push(new Platform(2800, 500, 1000, 100, '#888888', 'Floor', null, -30));
    platforms.push(new Platform(3200, 300, 80, 40, '#888888', 'Cloud', sprites.cloudVerySmall, -10, -14));
    platforms.push(new Platform(3500, 200, 250, 40, '#888888', 'Cloud', sprites.cloudLarge, -25, 15));
    
    platforms.push(new Platform(3900, 500, 1500, 100, '#888888', 'Floor', null, -30));
    platforms.push(new Platform(4300, 350, 360, 40, '#888888', 'Cloud', sprites.cloudVeryLarge, -20, 8));
    
    // Final stretch with the house
    platforms.push(new Platform(5500, 500, 1500, 100, '#888888', 'Floor', null, -30));
    
    // Y=380 so that bottom of goal (380 + 120 = 500) aligns with the floor
    goal = new Goal(6500, 380, 200); 
    
    // Some books
    const bookCoords8 = [
        [650, 300], [1000, 200], [2150, 300], [2550, 200],
        [3220, 250], [3600, 150], [4400, 300], [5000, 450], [6000, 450]
    ];
    for (let pos of bookCoords8) {
        collectibles.push(new Collectible(pos[0], pos[1], 15));
    }
}

// Helper for AABB collision
function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
}

function checkCollisions() {
    player.isGrounded = false;

    // Very basic AABB collision detection for platforms
    for (let platform of platforms) {
        let px = player.x;
        let py = player.y;
        let pw = player.width;
        let ph = player.height;

        let rectX = platform.x;
        let rectY = platform.y;
        let rectW = platform.width;
        let rectH = platform.height;

        // Check AABB
        if (px < rectX + rectW &&
            px + pw > rectX &&
            py < rectY + rectH &&
            py + ph > rectY) {
            
            let overlapLeft = (px + pw) - rectX;
            let overlapRight = (rectX + rectW) - px;
            let overlapTop = (py + ph) - rectY;
            let overlapBottom = (rectY + rectH) - py;

            let minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            if (minOverlap === overlapTop) {
                // Landed on top
                player.y = rectY - player.height;
                player.vy = 0;
                player.isGrounded = true;
                player.jumpsLeft = 2; // Reset double jump
            } else if (minOverlap === overlapBottom) {
                // Hit head
                player.y = rectY + rectH;
                player.vy = 0;
            } else if (minOverlap === overlapLeft) {
                // Hit left wall
                player.x = rectX - player.width;
                player.vx = 0;
            } else if (minOverlap === overlapRight) {
                // Hit right wall
                player.x = rectX + rectW;
                player.vx = 0;
            }
        }
    }
}

function updateCamera() {
    // Camera follow player
    if (currentLevel === 4) {
        let maxDist = goal.x - 500;
        let progress = Math.min(1, Math.max(0, camera.x / maxDist));
        
        // Dynamic speed: from 3 (start) to 10 (end)
        let currentSpeed = 3 + (progress * 7);

        // Auto scroller stops when Earth is on screen
        if (camera.x < goal.x - 500) {
            camera.x += currentSpeed; 
        }
        
        // Spawn comets periodically (spawn rate increases from 2% to 7%)
        let spawnChance = 0.02 + (progress * 0.05);
        if (Math.random() < spawnChance && camera.x < goal.x - 800) { // Stop spawning near Earth
            // Cover the absolute top and bottom edges as well
            let y = -10 + Math.random() * 580; 
            let cometSpeed = 4 + (progress * 4) + Math.random() * 4;
            enemies.push(new CometEnemy(camera.x + 900, y, cometSpeed));
        }
    } else {
        camera.x = player.x - camera.width / 2 + player.width / 2;
        if (camera.x < 0) camera.x = 0;
    }
    camera.y = 0; // Fixed vertical
}

function update() {
    if (gameOver || gameWon) return;

    if (dialogueState.active) {
        dialogueState.timer++;
        if (dialogueState.timer > 2) {
            dialogueState.timer = 0;
            if (dialogueState.charIndex < dialogueState.text.length) {
                dialogueState.displayedText += dialogueState.text[dialogueState.charIndex];
                dialogueState.charIndex++;
            }
        }
        return; // Pause rest of the game
    }

    player.update();
    checkCollisions();
    
    // Update enemies
    for (let enemy of enemies) {
        enemy.update();
        
        // Enemy collision
        if (!enemy.isDead && rectIntersect(player.x, player.y, player.width, player.height, enemy.x, enemy.y, enemy.width, enemy.height)) {
            // Did player stomp on enemy? (Disabled in Level 4)
            if (currentLevel !== 4 && player.vy > 0 && player.y + player.height - player.vy <= enemy.y + 10) {
                enemy.isDead = true;
                player.vy = -10; // Bounce
                
                audio.stomp.currentTime = 0;
                audio.stomp.volume = 0.6;
                audio.stomp.play().catch(e => {});
                // No points awarded for defeating enemies
            } else {
                // Player hit by enemy
                if (player.invulnerableTimer <= 0) {
                    lives--;
                    
                    // Play random hit sound
                    let randomHit = audio.hits[Math.floor(Math.random() * audio.hits.length)];
                    randomHit.currentTime = 0;
                    randomHit.play().catch(e => console.log('Audio blocked', e));

                    if (lives <= 0) {
                        gameOver = true;
                        document.getElementById('restartButton').style.display = 'block';
                    } else {
                        player.invulnerableTimer = 120; // 2 seconds of invulnerability
                    }
                }
            }
        }
    }

    // Update and Collectibles collision
    for (let item of collectibles) {
        item.update();
        if (!item.collected && rectIntersect(player.x, player.y, player.width, player.height, item.x, item.y, item.width, item.height)) {
            item.collected = true;
            
            if (item.type === '1up') {
                oneUpCollected = true;
                lives += 2;
                let sfx = new Audio('assets/book_page_flip.wav'); // We can reuse the sound
                sfx.volume = 0.5;
                sfx.play().catch(e => {});
            } else {
                score += 1; // 1 point per book
                
                // Extra life every 50 books
                if (score > 0 && score % 50 === 0) {
                    lives += 1;
                }
            }
            
            // Play sound with throttling
            let now = Date.now();
            bookAudioTimes = bookAudioTimes.filter(t => now - t < 300);
            if (bookAudioTimes.length < 2) {
                bookAudioTimes.push(now);
                let sfx = new Audio('assets/book_page_flip.wav');
                sfx.volume = 0.27;
                sfx.play().catch(e => {});
            }
            
            // Check narrative trigger
            if (score >= lastDialogueScore + 10) {
                lastDialogueScore = score;
                showNextQuote();
            }
        }
    }

    // Check goal
    if (goal && rectIntersect(player.x, player.y, player.width, player.height, goal.x, goal.y, goal.width, goal.height)) {
        if (currentLevel === 1) {
            startDialogue("Dacă Pământul este rotund...\nde ce nu cad oamenii?", () => {
                currentLevel = 2;
                audio.bgmLevel1.pause();
                audio.bgmLevel1.currentTime = 0;
                audio.bgmLevel2.play().catch(e => console.log(e));
                init(); // Load Level 2
            }, "assets/nivo_voice_end1.mp3");
            return;
        } else if (currentLevel === 2) {
            startDialogue("Pădurea se termină aici...\ndar unde ne duce mai departe?", () => {
                currentLevel = 3;
                audio.bgmLevel2.pause();
                audio.bgmLevel2.currentTime = 0;
                if (audio.bgmLevel3) audio.bgmLevel3.play().catch(e => console.log(e));
                init(); // Load Level 3
            }, "assets/nivo_voice_end2.mp3");
            return;
        } else if (currentLevel === 3) {
            startDialogue("Ce e dincolo de Lună?\nSimt că sunt atras de o forță uriașă...", () => {
                currentLevel = 4;
                init(); // Properly clear arrays and reload
            }, "assets/nivo_voice_end3.mp3");
        } else if (currentLevel === 4) {
            startDialogue("Nimeni nu cade de pe Pământ, pentru că gravitația\nîi atrage pe toți spre centrul lui.\nFelicitări, ai terminat primul capitol!", () => {
                if (audio.bgmLevel3) {
                    audio.bgmLevel3.pause();
                    audio.bgmLevel3.currentTime = 0;
                }
                chapterTransition.active = true;
                chapterTransition.timer = 0;
                currentLevel = 5;
            }, "assets/nivo_voice_end4.mp3");
        } else if (currentLevel === 5) {
            startDialogue("E timpul să căutăm și\ncealaltă parte a poveștii.", () => {
                currentLevel = 6;
                init();
            }, "assets/nivo_voice_end5.mp3");
        } else if (currentLevel === 6) {
            startDialogue("Ai terminat Level 6!", () => {
                gameWon = true;
            });
        } else if (currentLevel === 7) {
            startDialogue("Ai terminat Level 7!", () => {
                currentLevel = 8;
                init();
            });
        } else if (currentLevel === 8) {
            startDialogue("Emoțiile sunt normale.\nPrietenia crește atunci când alegem\nsă vorbim și să ascultăm.\nFelicitări, ai terminat capitolul 2!", () => {
                gameWon = true;
                document.getElementById('restartButton').style.display = 'block';
            });
        }
    }

    updateCamera();
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    if (currentBg && currentBg.complete) {
        // Calculate proper scaling to maintain aspect ratio, fitting the canvas height
        let scale = canvas.height / currentBg.height;
        let bgWidth = currentBg.width * scale;
        
        // Ensure background is at least as wide as the canvas
        if (bgWidth < canvas.width) {
            scale = canvas.width / currentBg.width;
            bgWidth = canvas.width;
        }
        let bgHeight = currentBg.height * scale;

        // Parallax background
        let maxCameraX = (currentLevel === 4 ? 20000 : (currentLevel === 3 ? 6500 : 5100)) - canvas.width;
        let cameraPercent = Math.max(0, Math.min(1, camera.x / maxCameraX));
        let maxBgScroll = bgWidth - canvas.width;
        let bgX = -(maxBgScroll * cameraPercent);

        ctx.drawImage(currentBg, bgX, 0, bgWidth, bgHeight);
    } else {
        ctx.fillStyle = '#87CEEB'; // Sky Blue fallback
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw platforms
    try {
        for (let platform of platforms) {
            platform.draw(ctx);
        }
    } catch(e) { console.error("Crash in platforms: ", e); }

    // Draw collectibles
    try {
        for (let item of collectibles) {
            item.draw(ctx);
        }
    } catch(e) { console.error("Crash in collectibles: ", e); }

    // Draw enemies
    try {
        for (let enemy of enemies) {
            enemy.draw(ctx);
        }
    } catch(e) { console.error("Crash in enemies: ", e); }

    // Draw goal
    try {
        if (goal) goal.draw(ctx);
    } catch(e) { console.error("Crash in goal: ", e); }

    // Draw player
    try {
        player.draw(ctx);
    } catch(e) { console.error("Crash in player: ", e); }

    // UI
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '28px "VT323", monospace';
    ctx.textAlign = 'left';
    
    // Draw Lives
    if (sprites.heart && sprites.heart.complete) {
        for (let i = 0; i < lives; i++) {
            ctx.drawImage(sprites.heart, canvas.width - 40 - (i * 35), 10, 30, 30);
        }
    }
    
    // Add a slight drop shadow for readability against the background
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    
    ctx.fillText('Cărți Adunate:', 20, 35);
    let textWidth = ctx.measureText('Cărți Adunate: ').width;
    
    if (sprites.bookIcon && sprites.bookIcon.complete) {
        ctx.shadowColor = 'transparent'; // No shadow for the icon
        ctx.drawImage(sprites.bookIcon, 20 + textWidth, 10, 26, 26);
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'; // Restore shadow
        ctx.fillText('x' + score, 20 + textWidth + 32, 35);
    } else {
        ctx.fillText('x ' + score, 20 + textWidth, 35);
    }
    
    ctx.shadowColor = 'transparent'; // Reset for rest of rendering

    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FF0000';
        ctx.font = '60px "VT323", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 20);
        document.getElementById('restartButton').innerText = 'Încearcă din nou';
    }

    if (gameWon) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00FF00';
        ctx.font = '60px "VT323", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CAPITOL COMPLET!', canvas.width/2, canvas.height/2 - 40);
        ctx.font = '30px "VT323", monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('Felicitări, ai terminat jocul!', canvas.width/2, canvas.height/2);
        document.getElementById('restartButton').innerText = 'Joacă din nou';
    }

    // Draw Dialogue Box
    if (dialogueState.active) {
        // Dialogue Box background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        let boxX = 80, boxY = canvas.height - 160, boxW = canvas.width - 160, boxH = 140;
        ctx.fillRect(boxX, boxY, boxW, boxH);
        ctx.strokeStyle = '#87CEEB';
        ctx.lineWidth = 4;
        ctx.strokeRect(boxX, boxY, boxW, boxH);
        
        // Draw Nivo Portrait
        if (sprites.nivoTalk[0] && sprites.nivoTalk[0].complete) {
            let talkFrameIndex = 0; // default to idle/closed mouth
            if (dialogueState.charIndex < dialogueState.text.length) {
                // Change frame every ~150ms
                talkFrameIndex = Math.floor(Date.now() / 150) % sprites.nivoTalk.length;
            }
            ctx.drawImage(sprites.nivoTalk[talkFrameIndex], boxX + 15, boxY + 15, 80, 80);
        }
        
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.font = '24px "VT323", monospace';
        let lines = dialogueState.displayedText.split('\n');
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], boxX + 110, boxY + 35 + (i * 28));
        }
        
        if (dialogueState.charIndex >= dialogueState.text.length) {
            ctx.font = '18px "VT323", monospace';
            ctx.fillStyle = '#AAAAAA';
            if (Math.floor(Date.now() / 500) % 2 === 0) {
                ctx.fillText("Apasă SPACE pentru a continua", boxX + boxW - 250, boxY + boxH - 15);
            }
        }
    }
}

function drawStartMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (sprites.startBg && sprites.startBg.complete) {
        let scale = Math.max(canvas.width / sprites.startBg.width, canvas.height / sprites.startBg.height);
        let finalWidth = sprites.startBg.width * scale;
        let finalHeight = sprites.startBg.height * scale;
        ctx.drawImage(sprites.startBg, (canvas.width - finalWidth)/2, (canvas.height - finalHeight)/2, finalWidth, finalHeight);
    } else {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Overlay to make text pop
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 80px "VT323", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('AXEL & NIVO', canvas.width / 2, 90);

    // Subtitle
    ctx.font = '30px "VT323", monospace';
    ctx.fillStyle = '#87CEEB';
    ctx.fillText('Descoperă lumea prin ochii lor', canvas.width / 2, 130);

    // Start instruction
    if (Math.floor(Date.now() / 500) % 2 === 0) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '36px "VT323", monospace';
        ctx.fillText('Apasă ENTER sau TAP pentru START', canvas.width / 2, canvas.height / 2 + 50);
    }
    
    ctx.restore();
}

let lastTime = 0;
let accumulator = 0;
const timeStep = 1000 / 60;

function gameLoop(currentTime) {
    requestAnimationFrame(gameLoop);

    if (!lastTime) lastTime = currentTime;
    let deltaTime = currentTime - lastTime;
    if (deltaTime > 250) deltaTime = 250; // Cap to prevent death spiral if tab is inactive
    lastTime = currentTime;

    if (!gameStarted) {
        drawStartMenu();
        return;
    }

    if (chapterTransition.active) {
        chapterTransition.timer++;
        
        // Draw black background with fade in
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, chapterTransition.timer / 60)})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (chapterTransition.timer > 60 && chapterTransition.timer <= 300) {
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.font = 'bold 80px "VT323", monospace';
            ctx.fillText('CAPITOLUL 2', canvas.width / 2, canvas.height / 2 - 20);
            
            ctx.fillStyle = '#87CEEB';
            ctx.font = '40px "VT323", monospace';
            ctx.fillText('CUM FUNCȚIONEAZĂ OAMENII?', canvas.width / 2, canvas.height / 2 + 40);
        } else if (chapterTransition.timer > 300 && chapterTransition.timer <= 1000) {
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.font = '30px "VT323", monospace';
            let lines = "Axel se ceartă cu prietena lui, Mia, și se simte ignorat\nși neimportant. Alături de Nivo, pornește într-o călătorie\npentru a înțelege ce s-a întâmplat cu adevărat.\nPe drum descoperă că fiecare om vede lumea diferit,\ncă emoțiile pot schimba felul în care interpretăm lucrurile\nși că empatia înseamnă să încerci să privești\nprin ochii celuilalt.".split('\n');
            for (let i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], canvas.width / 2, 180 + (i * 45));
            }
        }

        if (chapterTransition.timer > 1000) {
            chapterTransition.active = false;
            init();
            audio.bgmLevel5.play().catch(e => console.log(e));
        }
        return;
    }

    accumulator += deltaTime;

    let updated = false;
    while (accumulator >= timeStep) {
        update();
        accumulator -= timeStep;
        updated = true;
    }

    // Only draw if we actually updated the game state
    if (updated) {
        draw();
    }
}

function setupMobileControls() {
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnJump = document.getElementById('btn-jump');
    const btnDown = document.getElementById('btn-down');

    // Make sure btnDown is handled if it exists
    if (!btnDown) return;

    if (!btnLeft) return;

    const bindButton = (btn, keyName) => {
        const press = (e) => {
            e.preventDefault();
            if (!gameStarted) {
                startGame();
                return;
            }
            keys[keyName] = true;
            
            // Advance dialogue on jump button press
            if (keyName === 'Space' && dialogueState.active) {
                if (dialogueState.charIndex < dialogueState.text.length) {
                    dialogueState.displayedText = dialogueState.text;
                    dialogueState.charIndex = dialogueState.text.length;
                } else {
                    dialogueState.active = false;
                    if (dialogueState.audio) dialogueState.audio.pause();
                    if (dialogueState.onComplete) dialogueState.onComplete();
                }
            }
        };
        const release = (e) => {
            e.preventDefault();
            keys[keyName] = false;
        };

        btn.addEventListener('touchstart', press, {passive: false});
        btn.addEventListener('mousedown', press);
        
        btn.addEventListener('touchend', release, {passive: false});
        btn.addEventListener('mouseup', release);
        btn.addEventListener('mouseleave', release);
    };

    bindButton(btnLeft, 'ArrowLeft');
    bindButton(btnRight, 'ArrowRight');
    bindButton(btnJump, 'Space');
    bindButton(btnDown, 'ArrowDown');
}

setupMobileControls();

// Start game
init();
gameLoop();

// Restart button logic
document.getElementById('restartButton').addEventListener('click', () => {
    document.getElementById('restartButton').style.display = 'none';
    // Let init() and loadLevelX() handle resetting audio
    init();
});
