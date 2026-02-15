document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1️⃣ LIVE TIMER
    // ==========================================
    function updateLiveTimer() {

        const weddingDate = new Date(2004, 1, 15, 0, 0, 0); // Feb 15 2004
        const now = new Date();

        let years = now.getFullYear() - weddingDate.getFullYear();
        let months = now.getMonth() - weddingDate.getMonth();
        let days = now.getDate() - weddingDate.getDate();

        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        if (days < 0) {
            months--;
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        document.getElementById("years").innerHTML = years + " Years";
        document.getElementById("months").innerHTML = months + " Months";
        document.getElementById("days").innerHTML = days + " Days";
        document.getElementById("hours").innerHTML = hours + " Hrs";
        document.getElementById("minutes").innerHTML = minutes + " Min";
        document.getElementById("seconds").innerHTML = seconds + " Sec";
    }

    setInterval(updateLiveTimer, 1000);
    updateLiveTimer();


    // ==========================================
    // 2️⃣ CONFETTI ON LOAD
    // ==========================================
    setTimeout(() => {
        if (typeof confetti === "function") {
            confetti({
                particleCount: 150,
                spread: 90,
                origin: { y: 0.6 }
            });
        }
    }, 600);


    // ==========================================
    // 3️⃣ SCROLL REVEAL
    // ==========================================
    function revealSections() {
        document.querySelectorAll(".timeline-item").forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add("visible");
            }
        });
    }
    window.addEventListener("scroll", revealSections);


    // ==========================================
    // 🎞️ LOAD CAROUSEL
    // ==========================================
    fetch("/timeline")
        .then(res => res.json())
        .then(data => {

            const carouselContent = document.getElementById("carouselContent");
            if (!carouselContent) return;

            let currentIndex = 0;

            function renderSlide(index) {
                const item = data[index];

                carouselContent.innerHTML = `
                    <h3>${item.year}</h3>
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                `;

                if (index === 0 && typeof confetti === "function") {
                    confetti({
                        particleCount: 120,
                        spread: 80,
                        origin: { y: 0.6 }
                    });
                }
            }

            renderSlide(currentIndex);

            const nextBtn = document.querySelector(".next");
            const prevBtn = document.querySelector(".prev");

            if (nextBtn) {
                nextBtn.addEventListener("click", () => {
                    currentIndex = (currentIndex + 1) % data.length;
                    renderSlide(currentIndex);
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener("click", () => {
                    currentIndex = (currentIndex - 1 + data.length) % data.length;
                    renderSlide(currentIndex);
                });
            }

            setInterval(() => {
                currentIndex = (currentIndex + 1) % data.length;
                renderSlide(currentIndex);
            }, 5000);
        });


    // ==========================================
    // 5️⃣ LOAD TIMELINE
    // ==========================================
    fetch("/timeline")
        .then(res => res.json())
        .then(data => {

            const container = document.getElementById("timeline");
            if (!container) return;

            container.innerHTML = "";

            data.forEach(event => {

                const div = document.createElement("div");
                div.className = "timeline-item";
                div.innerHTML = `
                    <h3>${event.year}</h3>
                    <h4>${event.title}</h4>
                    <p>${event.description}</p>
                `;

                container.appendChild(div);
            });

            revealSections();
        });


    // ==========================================
    // 6️⃣ CHAT TOGGLE
    // ==========================================
    const toggle = document.getElementById("chatToggleHero");
    const widget = document.getElementById("chatWidget");
    const closeBtn = document.getElementById("closeChat");

    if (toggle && widget) {
        toggle.addEventListener("click", () => {
            widget.classList.toggle("open");
        });
    }

    if (closeBtn && widget) {
        closeBtn.addEventListener("click", () => {
            widget.classList.remove("open");
        });
    }


    // ==========================================
    // 7️⃣ CHAT SEND
    // ==========================================
    window.sendMessage = function () {

        const input = document.getElementById("userInput");
        const chat = document.getElementById("chatMessages");

        if (!input || !chat) return;

        const message = input.value.trim();
        if (!message) return;

        chat.innerHTML += `<div class="user-message">${message}</div>`;
        input.value = "";

        const typing = document.createElement("div");
        typing.className = "bot-message";
        typing.innerHTML = "Typing<span class='dot'>.</span><span class='dot'>.</span><span class='dot'>.</span>";
        chat.appendChild(typing);

        fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        })
        .then(res => res.json())
        .then(data => {
            typing.remove();
            chat.innerHTML += `<div class="bot-message">${data.response}</div>`;
            chat.scrollTop = chat.scrollHeight;
        })
        .catch(() => {
            typing.remove();
            chat.innerHTML += `<div class="bot-message">Connection error.</div>`;
        });
    };


    // ==========================================
    // ENTER KEY SUPPORT
    // ==========================================
    const inputBox = document.getElementById("userInput");
    if (inputBox) {
        inputBox.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                sendMessage();
            }
        });
    }


    // ==========================================
    // QUICK QUESTIONS
    // ==========================================
    document.querySelectorAll(".quick-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const question = this.innerText;
            document.getElementById("userInput").value = question;
            sendMessage();
        });
    });


    // ==========================================
    // 💌 LETTER REVEAL + TYPEWRITER
    // ==========================================
    const envelopeContainer = document.getElementById("envelopeContainer");
    const typewriterText = document.getElementById("typewriterText");

    if (envelopeContainer && typewriterText) {

        const message = `You didn’t just build a family.

You built a foundation of strength,
sacrifice,
and unconditional love.

Every challenge you faced,
every decision you made,
was always for us.

And today,
we stand proud
because of you both.

Happy Wedding Anniversary to my dear Mummy & Daddy!❤️`;

        function typeWriter(text, element, speed = 35) {
            let i = 0;
            element.innerHTML = "";

            function typing() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(typing, speed);
                }
            }
            typing();
        }

        envelopeContainer.addEventListener("click", function () {

            envelopeContainer.classList.add("open");

            setTimeout(() => {
                typeWriter(message, typewriterText);

                if (typeof confetti === "function") {
                    confetti({
                        particleCount: 120,
                        spread: 70,
                        origin: { y: 0.7 }
                    });
                }
            }, 600);
        });
    }


    // ==========================================
    // ❤️ FLOATING HEARTS
    // ==========================================
    function createHeart() {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerHTML = "❤️";

        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = (4 + Math.random() * 3) + "s";

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 7000);
    }

    setInterval(createHeart, 1200);

});
