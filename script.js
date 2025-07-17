// Слайд-шоу
const slides = document.querySelectorAll('.slide');
const button = document.getElementById('next');
let current = 0;

button.addEventListener('click', () => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
});

// Фейерверки
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let w, h;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let fireworks = [];
let hearts = [];

function drawHeart(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x, y - size / 2, x - size, y - size / 2, x - size, y);
    ctx.bezierCurveTo(x - size, y + size, x, y + size * 1.5, x, y + size * 2);
    ctx.bezierCurveTo(x, y + size * 1.5, x + size, y + size, x + size, y);
    ctx.bezierCurveTo(x + size, y - size / 2, x, y - size / 2, x, y);
    ctx.fillStyle = 'rgba(255, 105, 180, 0.8)';
    ctx.fill();
}

function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, w, h);

    // Фейерверки
    fireworks.forEach((f, index) => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${f.hue}, 100%, 60%)`;
        ctx.fill();
        f.x += f.vx;
        f.y += f.vy;
        f.vy += 0.02;
        f.alpha -= 0.005;
        if (f.alpha <= 0) fireworks.splice(index, 1);
    });

    if (Math.random() < 0.01) {
        for (let i = 0; i < 30; i++) {
            fireworks.push({
                x: Math.random() * w,
                y: Math.random() * h / 2,
                vx: Math.cos(i) * Math.random() * 1.5,
                vy: Math.sin(i) * Math.random() * 1.5,
                hue: Math.random() * 360,
                alpha: 1
            });
        }
    }

    // Сердечки
    hearts.forEach((h, index) => {
        drawHeart(h.x, h.y, h.size);
        h.y += h.speed;
        if (h.y > h.endY) {
            h.y = -20;
            h.x = Math.random() * w;
        }
    });

    if (hearts.length < 30) {
        hearts.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 8 + 4,
            speed: Math.random() * 0.4 + 0.1,
            endY: h + 50
        });
    }

    requestAnimationFrame(draw);
}

// Музыка
document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('bg-music');
    
    if (music) {
        music.volume = 0.3;
        
        // Попытка автовоспроизведения с обработкой ошибок
        const playPromise = music.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Автовоспроизведение заблокировано - ждем первого взаимодействия
                const handleFirstInteraction = () => {
                    music.play().catch(e => console.log("Не удалось воспроизвести музыку"));
                    document.removeEventListener('click', handleFirstInteraction);
                    document.removeEventListener('touchstart', handleFirstInteraction);
                };
                
                document.addEventListener('click', handleFirstInteraction, { once: true });
                document.addEventListener('touchstart', handleFirstInteraction, { once: true });
            });
        }
    }

    // Запуск анимации
    draw();
});