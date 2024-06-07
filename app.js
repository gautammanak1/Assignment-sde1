document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    let animationRunning = true;

    let arrowSpeed = 2;
    let circleRadius = 40;
    const arrowGap = 700;

    let circles = [
        { x: 100, y: 100, radius: circleRadius, color: '#ff0000', arrow: { x: arrowGap, y: 100, moving: false } },
        { x: 100, y: 200, radius: circleRadius, color: '#00ff00', arrow: { x: arrowGap, y: 200, moving: false } },
        { x: 100, y: 300, radius: circleRadius, color: '#0000ff', arrow: { x: arrowGap, y: 300, moving: false } },
        { x: 100, y: 400, radius: circleRadius, color: '#ffff00', arrow: { x: arrowGap, y: 400, moving: false } }
    ];

    function drawCircle(circle) {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
        ctx.fillStyle = circle.color;
        ctx.fill();
        ctx.stroke();
    }

    function drawArrow(arrow, targetX, targetY) {
        const arrowLength = 60;
        const arrowHeadLength = 20;
        const arrowHeadWidth = 20;

        // Calculate angle
        const angle = Math.atan2(targetY - arrow.y, targetX - arrow.x);

        // Rotate the arrow
        ctx.save();
        ctx.translate(arrow.x, arrow.y);
        ctx.rotate(angle);

        // Draw arrow shaft
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrowLength, 0);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#000';
        ctx.stroke();

        // Draw arrow head
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrowHeadLength, -arrowHeadWidth / 2);
        ctx.lineTo(-arrowHeadLength, arrowHeadWidth / 2);
        ctx.closePath();
        ctx.fillStyle = '#000';
        ctx.fill();

        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        circles.forEach(circle => {
            drawCircle(circle);
            drawArrow(circle.arrow, circle.x, circle.y);
        });
    }

    function animate() {
        if (animationRunning) {
            circles.forEach(circle => {
                if (circle.arrow.moving) {
                    const dx = circle.x - circle.arrow.x;
                    const dy = circle.y - circle.arrow.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance > circle.radius) {
                        const angle = Math.atan2(dy, dx);
                        circle.arrow.x += Math.cos(angle) * arrowSpeed;
                        circle.arrow.y += Math.sin(angle) * arrowSpeed;
                    } else {
                        circle.arrow.moving = false;
                        circle.color = 'black'; // Change color on hit
                    }
                }
            });
            draw();
        }
        requestAnimationFrame(animate);
    }

    canvas.addEventListener('click', function (e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        circles.forEach(circle => {
            const distance = Math.sqrt((mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2);
            if (distance < circle.radius) {
                circle.arrow.moving = true;
            }
        });
    });

    document.getElementById('resetButton').addEventListener('click', function () {
        circles = circles.map((circle, index) => ({
            ...circle,
            color: circle.originalColor,
            arrow: { x: arrowGap, y: circle.y, moving: false }
        }));
        draw();
    });

    document.getElementById('startStopButton').addEventListener('click', function () {
        animationRunning = !animationRunning;
    });

    document.getElementById('changeColorButton').addEventListener('click', function () {
        const newColors = [
            document.getElementById('color1').value,
            document.getElementById('color2').value,
            document.getElementById('color3').value,
            document.getElementById('color4').value
        ];
        circles = circles.map((circle, index) => ({
            ...circle,
            color: newColors[index],
            originalColor: newColors[index]
        }));
        draw();
    });

    document.getElementById('circleSize').addEventListener('input', function (e) {
        circleRadius = e.target.value;
        circles = circles.map(circle => ({
            ...circle,
            radius: circleRadius
        }));
        draw();
    });

    document.getElementById('arrowSpeed').addEventListener('input', function (e) {
        arrowSpeed = e.target.value;
    });

    // Save original colors
    circles.forEach(circle => circle.originalColor = circle.color);

    draw();
    animate();
});
