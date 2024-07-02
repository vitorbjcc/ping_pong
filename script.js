// Get Canvas Information and Himself
const canvas = document.getElementById("canvas");
const canvas_width = canvas.width;
const canvas_height = canvas.height;
const ctx = canvas.getContext("2d");

// Get Players Div Score
const p1_score_div = document.getElementById("player_1_score");
const p2_score_div = document.getElementById("player_2_score");

// Get Score Sound
const score_sound = new Audio("./Sounds/score.wav");

// Get Background Song
const bg_song = new Audio("./Sounds/ping_pong_theme.wav");

// Create Players Class
function Player(x, y, controls, speed, color, width, height)
{
    this.x = x;
    this.y = y;
    this.controls = controls;
    this.speed = speed;
    this.color = color;
    this.width = width;
    this.height = height;
    this.pressed_down = false;
    this.pressed_up = false;
    this.score = 0;
}

// Draw Method Into Player Class
Player.prototype.draw = function()
{
    // Set Color
    ctx.fillStyle = this.color;

    // Draw Racket
    ctx.fillRect(this.x, this.y, this.width, this.height);
}

// Keydown Method Into Player Class
Player.prototype.keydown = function(e)
{
    // If Player Will Move With W A S D
    if (this.controls === "wasd")
    {
        switch (e.key)
        {
            case "s":
                // Identify Key
                this.pressed_down = true;

                break;
            
            case "w":
                // Identify Key
                this.pressed_up = true;
        }
    }
    // If Player Will Move With Arrows
    else if (this.controls === "arrows")
    {
        const DOWN = 40;
        const UP = 38;
        
        switch (e.keyCode)
        {
            case DOWN:
                // Identify Key
                this.pressed_down = true;

                break;

            case UP:
                // Identify Key
                this.pressed_up = true;

                break;
        }
    }
}

// Keyup Method Into Player Class
Player.prototype.keyup = function(e)
{
    // If Player Move With W A S D
    if (this.controls === "wasd")
    {
        switch (e.key)
        {
            case "s":
                // Identify Key
                this.pressed_down = false;

                break;

            case "w":
                // Identify Key
                this.pressed_up = false;

                break;
        }
    }
    // If Player Move With Arrows
    else if (this.controls === "arrows")
    {
        const DOWN = 40;
        const UP = 38;

        switch (e.keyCode)
        {
            case DOWN:
                // Identify Key
                this.pressed_down = false;

                break;

            case UP:
                // Identify Key
                this.pressed_up = false;

                break;
        }
    }
}

// Colliding Method Into Player Class
Player.prototype.ball_colliding = function(rect, circle)
{
    var distX = Math.abs(circle.x - rect.x - rect.width / 2);
    var distY = Math.abs(circle.y - rect.y - rect.height / 2);

    if (distX > (rect.width / 2 + circle.radius) || distY > (rect.height / 2 + circle.radius)) {
        return false;
    }

    if (distX <= (rect.width / 2) || distY <= (rect.height / 2)) {
        return true;
    }

    var dx = distX - rect.width / 2;
    var dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= (circle.radius * circle.radius));
}

// Check If Scored
Player.prototype.check_scored = function()
{
    // If Player Move With W A S D, We Are Talking About Player 1
    if (this.controls === "wasd" && ball.x > canvas_width + ball.radius)
    {
        // Increase Score
        this.score++;

        // Update Text
        p1_score_div.innerText = `PLAYER 1 SCORE = ${String(this.score)}`;

        // Play Score Sound
        score_sound.play();

        // Reset Ball
        ball.reset();
    }
    // If Player Move With Arrows, We Are Talking About Player 2
    else if (this.controls === "arrows" && ball.x < -ball.radius)
    {
        // Increase Score
        this.score++;

        // Update Text
        p2_score_div.innerText = `PLAYER 2 SCORE = ${String(this.score)}`;

        // Play Score Sound
        score_sound.play();

        // Reset Ball
        ball.reset();
    }
}

// Create Ball Class
function Ball(x, y, radius, color, speed_X, speed_Y)
{
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.speed_X = speed_X;
    this.speed_Y = speed_Y;
    this.random_X = 0;
    this.random_Y = 0;
    this.pressed_space = false;
}

// Keydown Method Into Ball Class
Ball.prototype.keydown = function(e)
{
    // If Has Pressed Space In Past, Exit
    if (this.pressed_space) return 0;

    const SPACE = 32;

    if (e.keyCode === SPACE)
    {
        this.pressed_space = true;
    }
}

// Draw Method Into Ball Class
Ball.prototype.draw = function()
{
    // Set Color
    ctx.fillStyle = this.color;

    // Draw
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

// Randomize Method Into Ball Class
Ball.prototype.randomize = function(min, max)
{
    const result = Math.random() * (max - min) + min;

    // Randomize If Negative Or Positive
    const n_p = Math.random();

    if (n_p <= 0.5) return -result
    else return result;
}

// Check Roof Method Into Ball Class
Ball.prototype.check_roof = function()
{
    if (this.y <= this.radius / 2 || this.y >= canvas_height - this.radius / 2)
    {
        this.random_Y = -this.random_Y;
    }
}

// Reset Ball Method Into Ball Class
Ball.prototype.reset = function()
{
    this.pressed_space = false;
    this.random_X = 0;
    this.random_Y = 0;
    this.x = canvas_width / 2 - this.radius;
    this.y = canvas_height / 2;
}

// Main Game Class
function Main_Game(color)
{
    this.color = color;
}

// Start Method Into Main Game Class
Main_Game.prototype.start = function()
{
    console.log("Game Initialised.");
    this.update();

    // Add Keyboard Events
    window.addEventListener("keydown", (e) =>
    {
        p1.keydown(e);
        p2.keydown(e);
        ball.keydown(e);
    });

    window.addEventListener("keyup", (e) =>
    {
        p1.keyup(e);
        p2.keyup(e);
    })
}

// Update Method Into Main Game Class
Main_Game.prototype.update = function()
{
    // Update Frame Every 75 Milliseconds
    setTimeout(() =>
    {
        // Clear Previous Frame
        this.clear_frame();

        // Move Player 1
        if (p1.pressed_down && p1.y + p1.speed !== canvas_height - p1.height) p1.y += p1.speed
        else if (p1.pressed_up && p1.y - p1.speed !== 0) p1.y -= p1.speed;

        // Move Player 2
        if (p2.pressed_down && p2.y + p2.speed !== canvas_height - p2.height) p2.y += p2.speed
        else if (p2.pressed_up && p2.y - p2.speed !== 0) p2.y -= p2.speed;

        // Move Ball
        if (ball.pressed_space)
        {
            // Create Random  Direction To Move
            if (ball.random_X === 0 && ball.random_Y === 0)
            {
                ball.random_X = ball.randomize(ball.speed_X, ball.speed_X * 1.5);
                ball.random_Y = ball.randomize(ball.speed_Y, ball.speed_Y * 1.5);
            }

            // If Background Song Isn`t Playing, Play It
            if (!bg_song.onplaying)
            {
                // Play Background Song as Loop
                bg_song.loop = true;
                bg_song.volume = 0.5;
                bg_song.play();
            }

            ball.x += ball.random_X;
            ball.y += ball.random_Y;
        }

        // Draw Player 1
        p1.draw();

        // Draw Player 2
        p2.draw();

        // Draw Ball
        ball.draw();

        // If Ball Is Colliding With Player 1
        if (p1.ball_colliding({
            x: p1.x,
            y: p1.y,
            width: p1.width,
            height: p1.height
        }, {
            x: ball.x,
            y: ball.y,
            radius: ball.radius
        }))
        {
            // Bounce Ball
            ball.random_X = -ball.random_X;
            
            ball.random_Y = ball.randomize(ball.speed_Y, ball.speed_Y * 1.5);
        }

        // If Ball Is Colliding With Player 2
        if (p2.ball_colliding({
            x: p2.x,
            y: p2.y,
            width: p2.width,
            height: p2.height
        }, {
            x: ball.x,
            y: ball.y,
            radius: ball.radius
        }))
        {
            // Bounce Ball
            ball.random_X = -ball.random_X;
            
            ball.random_Y = ball.randomize(ball.speed_Y, ball.speed_Y * 1.5);
        }

        // Check If Ball Is Colliding With Roof
        ball.check_roof();

        // Check If Players Scored
        p1.check_scored();
        p2.check_scored();

        // Call Update Again
        this.update();
    }, 25)
}

// Clear Previous Frame Method Into Main Game Class
Main_Game.prototype.clear_frame = function()
{
    // Set Color
    ctx.fillStyle = this.color;

    // Draw
    ctx.fillRect(0, 0, canvas_width, canvas_height);
}

// Initialise Players
var p1 = new Player(5, canvas_height / 2 - 50, "wasd", 4, "rgb(255, 255, 255)", 25, 100);
var p2 = new Player(canvas_width - 5 - 25, canvas_height / 2 - 50, "arrows", 4, "rgb(255, 255, 255)", 25, 100);

// Initialise Ball
var ball = new Ball(canvas_width / 2 - 10, canvas_height / 2, 20, "rgb(255, 255, 255)", 2, 2);

// Initialise Main Game
var main_game = new Main_Game("rgb(0, 0, 0)");

// Start Game
main_game.start();