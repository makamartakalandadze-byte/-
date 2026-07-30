/* ==========================================================================
   INCLUSION AND TECHNOLOGY - JAVASCRIPT LOGIC
   Project: "არ დაიჯერო, რომ შენ მარტო ხარ!"
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------------
    // 1. Accessibility Controls (Font sizing, High Contrast, Text-to-Speech)
    // --------------------------------------------------------------------------
    let currentFontSize = 16;
    const btnFontInc = document.getElementById('btn-font-inc');
    const btnFontDec = document.getElementById('btn-font-dec');
    const btnFontReset = document.getElementById('btn-font-reset');
    const btnContrast = document.getElementById('btn-contrast');
    const btnTTS = document.getElementById('btn-tts');

    btnFontInc.addEventListener('click', () => {
        if (currentFontSize < 24) {
            currentFontSize += 2;
            document.documentElement.style.fontSize = `${currentFontSize}px`;
        }
    });

    btnFontDec.addEventListener('click', () => {
        if (currentFontSize > 12) {
            currentFontSize -= 2;
            document.documentElement.style.fontSize = `${currentFontSize}px`;
        }
    });

    btnFontReset.addEventListener('click', () => {
        currentFontSize = 16;
        document.documentElement.style.fontSize = '16px';
    });

    btnContrast.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
    });

    // Web Speech API - Text to speech
    function speakText(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop ongoing speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ka-GE'; // Georgian if supported by OS, falls back smoothly
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        } else {
            alert('თქვენს ბრაუზერს არ აქვს ხმოვანი გაჟღერების მხარდაჭერა.');
        }
    }

    btnTTS.addEventListener('click', () => {
        const activeSection = document.querySelector('.content-section.active-section');
        if (activeSection) {
            speakText(activeSection.innerText);
        }
    });


    // --------------------------------------------------------------------------
    // 2. Navigation & Tabs Logic
    // --------------------------------------------------------------------------
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    function switchSection(targetId) {
        sections.forEach(sec => {
            if (sec.id === targetId) {
                sec.classList.add('active-section');
            } else {
                sec.classList.remove('active-section');
            }
        });

        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${targetId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').replace('#', '');
            switchSection(targetId);
            window.scrollTo({ top: 300, behavior: 'smooth' });
        });
    });

    // Launch game buttons from Groups section
    document.querySelectorAll('.launch-game-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const gameType = btn.getAttribute('data-game');
            switchSection('games');
            switchGameTab(gameType);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        });
    });

    document.querySelector('.open-ebook-btn').addEventListener('click', () => {
        switchSection('ebook');
        window.scrollTo({ top: 400, behavior: 'smooth' });
    });


    // --------------------------------------------------------------------------
    // 3. AI Prompts Category Tabs & Copy Button
    // --------------------------------------------------------------------------
    const promptTabBtns = document.querySelectorAll('.prompt-category-tabs .tab-btn');
    const promptTabContents = document.querySelectorAll('.prompt-tab-content');

    promptTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            promptTabBtns.forEach(b => b.classList.remove('active'));
            promptTabContents.forEach(c => c.classList.remove('active-tab'));

            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            document.getElementById(target).classList.add('active-tab');
        });
    });

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i> დაკოპირდა!';
                btn.style.background = '#10b981';
                btn.style.color = '#ffffff';

                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.style.background = '';
                    btn.style.color = '';
                }, 2000);
            });
        });
    });


    // --------------------------------------------------------------------------
    // 4. Games Hub Switcher
    // --------------------------------------------------------------------------
    const gameTabBtns = document.querySelectorAll('.game-tab-btn');
    const gameWindows = document.querySelectorAll('.game-window');

    function switchGameTab(gameId) {
        gameTabBtns.forEach(b => {
            if (b.getAttribute('data-gametab') === gameId) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        gameWindows.forEach(w => {
            if (w.id === `game-${gameId}`) {
                w.classList.add('active-game');
            } else {
                w.classList.remove('active-game');
            }
        });
    }

    gameTabBtns.forEach(b => {
        b.addEventListener('click', () => {
            switchGameTab(b.getAttribute('data-gametab'));
        });
    });


    // --------------------------------------------------------------------------
    // 5. Game 1: Memory Match Game ("მეხსიერების სავარჯიშო")
    // --------------------------------------------------------------------------
    const memoryGrid = document.getElementById('memory-grid');
    const memoryScoreDisplay = document.getElementById('memory-score');
    const resetMemoryBtn = document.getElementById('reset-memory-btn');

    const cardIcons = ['❤️', '📚', '🧩', '💻', '❤️', '📚', '🧩', '💻'];
    let flippedCards = [];
    let matchedPairs = 0;
    let movesCount = 0;

    function initMemoryGame() {
        memoryGrid.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        movesCount = 0;
        memoryScoreDisplay.innerText = `სვლა: 0 | წყვილი: 0/4`;

        // Shuffle cards
        const shuffled = [...cardIcons].sort(() => 0.5 - Math.random());

        shuffled.forEach((icon, idx) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.icon = icon;
            card.dataset.index = idx;
            card.innerHTML = `<span style="display:none">${icon}</span><i class="fa-solid fa-question"></i>`;

            card.addEventListener('click', () => handleCardClick(card));
            memoryGrid.appendChild(card);
        });
    }

    function handleCardClick(card) {
        if (card.classList.contains('flipped') || flippedCards.length === 2) return;

        card.classList.add('flipped');
        card.innerHTML = card.dataset.icon;
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            movesCount++;
            checkMemoryMatch();
        }
    }

    function checkMemoryMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.icon === card2.dataset.icon) {
            matchedPairs++;
            flippedCards = [];
            memoryScoreDisplay.innerText = `სვლა: ${movesCount} | წყვილი: ${matchedPairs}/4`;

            if (matchedPairs === 4) {
                setTimeout(() => {
                    alert(`🎉 გილოცავთ! თქვენ წარმატებით დაასრულეთ მეხსიერების თამაში ${movesCount} სვლაში!`);
                }, 300);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.innerHTML = `<i class="fa-solid fa-question"></i>`;
                card2.innerHTML = `<i class="fa-solid fa-question"></i>`;
                flippedCards = [];
                memoryScoreDisplay.innerText = `სვლა: ${movesCount} | წყვილი: ${matchedPairs}/4`;
            }, 900);
        }
    }

    resetMemoryBtn.addEventListener('click', initMemoryGame);
    initMemoryGame();


    // --------------------------------------------------------------------------
    // 6. Game 2: Labyrinth Game ("ლაბირინთი") Canvas
    // --------------------------------------------------------------------------
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const mazeStatus = document.getElementById('maze-status');
    const resetMazeBtn = document.getElementById('reset-maze-btn');

    const tileSize = 40;
    const map = [
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,1],
        [1,0,1,0,1,0,1,1,0,1],
        [1,0,1,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,1,0,1,0,1],
        [1,1,1,1,0,1,0,1,0,1],
        [1,0,0,1,0,0,0,1,0,1],
        [1,0,0,0,0,1,0,0,2,1],
        [1,1,1,1,1,1,1,1,1,1]
    ];

    let player = { x: 1, y: 1 };

    function drawMaze() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                if (map[r][c] === 1) {
                    ctx.fillStyle = '#1e293b';
                    ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
                } else if (map[r][c] === 2) {
                    ctx.fillStyle = '#f59e0b';
                    ctx.font = '24px sans-serif';
                    ctx.fillText('⭐️', c * tileSize + 8, r * tileSize + 30);
                }
            }
        }

        // Draw Player
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(player.x * tileSize + tileSize/2, player.y * tileSize + tileSize/2, 14, 0, Math.PI * 2);
        ctx.fill();
    }

    function movePlayer(dx, dy) {
        const newX = player.x + dx;
        const newY = player.y + dy;

        if (map[newY][newX] !== 1) {
            player.x = newX;
            player.y = newY;
            drawMaze();

            if (map[newY][newX] === 2) {
                mazeStatus.innerText = '🏆 გილოცავთ! მიაღწიეთ ფინიშს!';
                setTimeout(() => {
                    alert('🌟 ყოჩაღ! ლაბირინთი წარმატებით გაიარეთ!');
                }, 200);
            }
        }
    }

    // Keyboard & On-screen controls
    window.addEventListener('keydown', (e) => {
        if (!document.getElementById('game-maze').classList.contains('active-game')) return;
        if (e.key === 'ArrowUp') movePlayer(0, -1);
        if (e.key === 'ArrowDown') movePlayer(0, 1);
        if (e.key === 'ArrowLeft') movePlayer(-1, 0);
        if (e.key === 'ArrowRight') movePlayer(1, 0);
    });

    document.getElementById('m-up').addEventListener('click', () => movePlayer(0, -1));
    document.getElementById('m-down').addEventListener('click', () => movePlayer(0, 1));
    document.getElementById('m-left').addEventListener('click', () => movePlayer(-1, 0));
    document.getElementById('m-right').addEventListener('click', () => movePlayer(1, 0));

    resetMazeBtn.addEventListener('click', () => {
        player = { x: 1, y: 1 };
        mazeStatus.innerText = 'სტატუსი: ითამაშეთ!';
        drawMaze();
    });

    drawMaze();


    // --------------------------------------------------------------------------
    // 7. Game 3: Inclusive Quiz Game ("კითხვარი")
    // --------------------------------------------------------------------------
    const quizQuestions = [
        {
            q: "რა არის პროექტის 'არ დაიჯერო, რომ შენ მარტო ხარ!' მთავარი მიზანი?",
            options: [
                "მხოლოდ კომპიუტერული თამაშების თამაში",
                "ტექნოლოგიების გამოყენება სსსმ პირთა მხარდასაჭერად და ემპათიის გაღრმავება",
                "ინტერნეტის გათიშვა სკოლაში"
            ],
            correct: 1
        },
        {
            q: "რომელ რიცხვში აღინიშნება შეზღუდული შესაძლებლობების მქონე პირთა საერთაშორისო დღე?",
            options: [
                "3 დეკემბერს",
                "1 მაისს",
                "31 ოქტომბერს"
            ],
            correct: 0
        },
        {
            q: "რომელი პროგრამით შექმნა II ჯგუფმა ილუსტრირებული ელექტრონული წიგნი?",
            options: [
                "BookCreator",
                "Excel",
                "Calculator"
            ],
            correct: 0
        }
    ];

    let currentQuizIndex = 0;
    let quizScore = 0;

    const quizQuestionEl = document.getElementById('quiz-question');
    const quizOptionsEl = document.getElementById('quiz-options');
    const quizFeedbackEl = document.getElementById('quiz-feedback');
    const quizScoreEl = document.getElementById('quiz-score');

    function loadQuizQuestion() {
        if (currentQuizIndex >= quizQuestions.length) {
            quizQuestionEl.innerText = '🎉 ვიქტორინა დასრულებულია!';
            quizOptionsEl.innerHTML = `<button class="btn btn-primary" onclick="resetQuiz()">თავიდან დაწყება</button>`;
            quizFeedbackEl.innerText = `თქვენ დააგროვეთ ${quizScore} / ${quizQuestions.length * 10} ქულა!`;
            return;
        }

        const qData = quizQuestions[currentQuizIndex];
        quizQuestionEl.innerText = `${currentQuizIndex + 1}. ${qData.q}`;
        quizOptionsEl.innerHTML = '';
        quizFeedbackEl.innerText = '';

        qData.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.classList.add('quiz-opt-btn');
            btn.innerText = opt;
            btn.addEventListener('click', () => handleQuizAnswer(idx, qData.correct));
            quizOptionsEl.appendChild(btn);
        });
    }

    function handleQuizAnswer(selectedIdx, correctIdx) {
        if (selectedIdx === correctIdx) {
            quizScore += 10;
            quizScoreEl.innerText = `ქულა: ${quizScore}`;
            quizFeedbackEl.innerHTML = `<span style="color:#10b981"><i class="fa-solid fa-circle-check"></i> სწორია! +10 ქულა</span>`;
        } else {
            quizFeedbackEl.innerHTML = `<span style="color:#ef4444"><i class="fa-solid fa-circle-xmark"></i> არასწორია!</span>`;
        }

        setTimeout(() => {
            currentQuizIndex++;
            loadQuizQuestion();
        }, 1200);
    }

    window.resetQuiz = function() {
        currentQuizIndex = 0;
        quizScore = 0;
        quizScoreEl.innerText = `ქულა: 0`;
        loadQuizQuestion();
    };

    loadQuizQuestion();


    // --------------------------------------------------------------------------
    // 8. E-Book Viewer & Audio Narration
    // --------------------------------------------------------------------------
    const ebookPages = [
        {
            num: "გვერდი 1 / 3",
            title: "1. საბა აღმოაჩენს ციფრულ სამყაროს",
            img: "saba_magic_screen.jpg",
            text: "ერთ ჩვეულებრივ დღეს, 11 წლის საბამ საკლასო ოთახში მბზინავი ციფრული ტაბლეტი იპოვა. მანამდე საბას ეგონა, რომ კომპიუტერი მხოლოდ გასართობი თამაშებისთვის არსებობდა, თუმცა ეკრანზე უცნაური, ჯადოსნური ღილაკი გამოჩნდა..."
        },
        {
            num: "გვერდი 2 / 3",
            title: "2. ინკლუზიური მეგობრობა და თამაშები",
            img: "inclusive_game_kids.jpg",
            text: "ღილაკზე დაჭერისას საბამ დაინახა, თუ როგორ შეუძლია Scratch-ისა და BookCreator-ის საშუალებით შექმნას ხმოვანი წიგნები და მეხსიერების თამაშები თავისი მეგობრებისთვის, რომლებსაც განსაკუთრებული საჭიროებები აქვთ."
        },
        {
            num: "გვერდი 3 / 3",
            title: "3. 3 დეკემბერი - ერთად უკეთესი მომავლისთვის",
            img: "saba_magic_screen.jpg",
            text: "3 დეკემბერს საბამ და მისმა თანაკლასელებმა სკოლაში მოაწყვეს დიდი პრეზენტაცია. მათ დაამტკიცეს, რომ ტექნოლოგიების სწორი გამოყენებით არავინ რჩება მარტო!"
        }
    ];

    let currentEbookIndex = 0;

    const ebookImg = document.getElementById('ebook-img');
    const ebookPageNum = document.getElementById('ebook-page-num');
    const ebookTitle = document.getElementById('ebook-title');
    const ebookText = document.getElementById('ebook-text');
    const btnPrevPage = document.getElementById('btn-prev-page');
    const btnNextPage = document.getElementById('btn-next-page');
    const btnReadPage = document.getElementById('btn-read-page');

    function updateEbookPage() {
        const page = ebookPages[currentEbookIndex];
        ebookImg.src = page.img;
        ebookPageNum.innerText = page.num;
        ebookTitle.innerText = page.title;
        ebookText.innerText = page.text;

        btnPrevPage.disabled = currentEbookIndex === 0;
        btnNextPage.disabled = currentEbookIndex === ebookPages.length - 1;
    }

    btnPrevPage.addEventListener('click', () => {
        if (currentEbookIndex > 0) {
            currentEbookIndex--;
            updateEbookPage();
        }
    });

    btnNextPage.addEventListener('click', () => {
        if (currentEbookIndex < ebookPages.length - 1) {
            currentEbookIndex++;
            updateEbookPage();
        }
    });

    btnReadPage.addEventListener('click', () => {
        const p = ebookPages[currentEbookIndex];
        speakText(`${p.title}. ${p.text}`);
    });

    updateEbookPage();


    // --------------------------------------------------------------------------
    // 9. Teacher Rubric Score Calculator
    // --------------------------------------------------------------------------
    const calcRubricBtn = document.getElementById('calc-rubric-btn');
    const rubricResultBox = document.getElementById('rubric-result');

    calcRubricBtn.addEventListener('click', () => {
        const studentName = document.getElementById('student-name').value || 'მოსწავლე / ჯგუფი';
        const c1 = parseInt(document.getElementById('crit-1').value);
        const c2 = parseInt(document.getElementById('crit-2').value);
        const c3 = parseInt(document.getElementById('crit-3').value);
        const c4 = parseInt(document.getElementById('crit-4').value);

        const totalScore = c1 + c2 + c3 + c4;
        let gradeLevel = '';
        let badgeClass = '';

        if (totalScore >= 32) {
            gradeLevel = 'მაღალი დონე (8-10 ქულა)';
            badgeClass = '#10b981';
        } else if (totalScore >= 20) {
            gradeLevel = 'საშუალო დონე (5-7 ქულა)';
            badgeClass = '#f59e0b';
        } else {
            gradeLevel = 'დაბალი დონე (1-4 ქულა)';
            badgeClass = '#ef4444';
        }

        rubricResultBox.classList.remove('hidden');
        rubricResultBox.innerHTML = `
            <h4><i class="fa-solid fa-award"></i> შეფასების შედეგი: <strong>${studentName}</strong></h4>
            <p style="margin: 10px 0; font-size: 1.1rem;">ჯამური ქულა: <strong>${totalScore} / 40</strong> — <span style="background:${badgeClass}; color:#fff; padding:3px 10px; border-radius:12px;">${gradeLevel}</span></p>
            <p><strong>განმავითარებელი კომენტარი:</strong> მოსწავლემ/ჯგუფმა გამოავლინა ისტ ინსტრუმენტების ფუნქციური გამოყენების უნარი, განსაკუთრებული ყურადღება დაუთმო ინკლუზიურ ხელმისაწვდომობას და წარმატებით წარადგინა რესურსი 3 დეკემბრის ღონისძიებისთვის.</p>
        `;
    });

});
