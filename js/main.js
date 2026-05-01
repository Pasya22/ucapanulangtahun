// main.js - Happy Birthday Web App

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initFallingLeaves();
    initDateDisplay();
    initScrollReveal();
    initNavDots();
    initMusicPlayer();
    initGalleryUpload();
    initKesanMessage();
});

// ========== FALLING LEAVES ==========
function initFallingLeaves() {
    const leavesContainer = document.getElementById('leaves');
    const svgs = [
        '<svg width="12" height="16" viewBox="0 0 12 16"><path d="M6 1 C2 5 1 10 6 15 C11 10 10 5 6 1Z" fill="COLOR" opacity="0.6"/></svg>',
        '<svg width="10" height="14" viewBox="0 0 10 14"><ellipse cx="5" cy="7" rx="4" ry="6" fill="COLOR" opacity="0.5" transform="rotate(-20 5 7)"/></svg>'
    ];
    const colors = ['#7EC89A', '#4A8C68', '#B8E3C8', '#A8C5A0', '#2D5E45'];

    for (let i = 0; i < 20; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        const color = colors[Math.floor(Math.random() * colors.length)];
        const svg = svgs[i % 2].replace('COLOR', color);
        leaf.innerHTML = svg;
        leaf.style.cssText = `left:${Math.random() * 100}%;animation-duration:${7 + Math.random() * 10}s;animation-delay:${Math.random() * 10}s;`;
        leavesContainer.appendChild(leaf);
    }
}

// ========== DATE DISPLAY ==========
function initDateDisplay() {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const today = new Date();
    const coverDate = document.getElementById('coverDate');
    if (coverDate) {
        coverDate.textContent = `— ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()} —`;
    }
}

// ========== SCROLL REVEAL ANIMATION ==========
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });
    reveals.forEach(r => observer.observe(r));
}

// ========== NAVIGATION DOTS ==========
function initNavDots() {
    const sections = ['cover', 'ucapan', 'doa', 'gallery', 'kesan'];
    const dots = document.querySelectorAll('.nav-dot');

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetId = dot.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                dots.forEach(dot => {
                    dot.classList.toggle('active', dot.dataset.target === entry.target.id);
                    if (dot.classList.contains('active')) {
                        dot.style.background = '#4A8C68';
                        dot.style.transform = 'scale(1.4)';
                    } else {
                        dot.style.background = 'rgba(74, 140, 104, 0.3)';
                        dot.style.transform = 'scale(1)';
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => {
        const section = document.getElementById(s);
        if (section) sectionObserver.observe(section);
    });
}

// ========== MUSIC PLAYER ==========
let currentAudio = null;
let currentTrack = 1;
let isPlaying = false;
let userStarted = false;

function initMusicPlayer() {
    const audio1 = document.getElementById('audio1');
    const audio2 = document.getElementById('audio2');
    const playBtn = document.getElementById('playBtn');
    const progressBar = document.getElementById('progressBar');
    const musicBar = document.getElementById('musicBar');

    if (!audio1 || !audio2) return;

    currentAudio = audio1;

    // Load audio files
    audio1.load();
    audio2.load();

    // Toggle play/pause
    playBtn.addEventListener('click', togglePlay);

    // Progress bar
    progressBar.addEventListener('input', function (e) {
        if (currentAudio.duration) {
            currentAudio.currentTime = (e.target.value / 100) * currentAudio.duration;
        }
    });

    // Update progress
    const updateProgress = () => {
        if (currentAudio.duration) {
            const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
            progressBar.value = percent;
        }
    };

    audio1.addEventListener('timeupdate', updateProgress);
    audio2.addEventListener('timeupdate', updateProgress);

    // Handle end of track
    const onEnded = () => {
        isPlaying = false;
        playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>';
        const artistEl = document.getElementById('musicArtist');
        if (artistEl) artistEl.textContent = '✅ Selesai';
    };

    audio1.addEventListener('ended', onEnded);
    audio2.addEventListener('ended', onEnded);

    // Section-based track switching
    const sectionTrackMap = { cover: 1, ucapan: 1, doa: 2, gallery: 2, kesan: 2 };
    const trackObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && userStarted) {
                const trackId = sectionTrackMap[entry.target.id];
                if (trackId && trackId !== currentTrack) {
                    switchTrack(trackId);
                }
            }
        });
    }, { threshold: 0.5 });

    ['cover', 'ucapan', 'doa', 'gallery', 'kesan'].forEach(s => {
        const section = document.getElementById(s);
        if (section) trackObserver.observe(section);
    });

    // Show music bar on first scroll
    window.addEventListener('scroll', () => {
        if (!musicBar.classList.contains('visible')) {
            musicBar.classList.add('visible');
        }
    }, { once: true });

    function togglePlay() {
        userStarted = true;
        musicBar.classList.add('visible');

        if (isPlaying) {
            currentAudio.pause();
            isPlaying = false;
            playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>';
            const artistEl = document.getElementById('musicArtist');
            if (artistEl) artistEl.textContent = '⏸ Dijeda';
        } else {
            currentAudio.volume = 0.7;
            currentAudio.play().catch(e => console.log('Audio play error:', e));
            isPlaying = true;
            playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
            const artistEl = document.getElementById('musicArtist');
            if (artistEl) artistEl.textContent = '🎵 Sedang memutar...';
        }
    }

    function switchTrack(trackNum) {
        if (currentTrack === trackNum || !userStarted) return;

        const wasPlaying = isPlaying;
        currentAudio.pause();
        currentAudio.currentTime = 0;

        currentTrack = trackNum;
        currentAudio = trackNum === 1 ? audio1 : audio2;

        const titleEl = document.getElementById('musicTitle');
        const badgeEl = document.getElementById('musicBadge');

        if (trackNum === 1) {
            if (titleEl) titleEl.textContent = 'Selamat Ulang Tahun — Jamrud';
            if (badgeEl) badgeEl.innerHTML = '🎂 Lagu 1';
        } else {
            if (titleEl) titleEl.textContent = 'Instrumental Sholawat';
            if (badgeEl) badgeEl.innerHTML = '🤲 Lagu 2';
        }

        if (progressBar) progressBar.value = 0;

        if (wasPlaying) {
            currentAudio.play().catch(e => console.log('Audio play error:', e));
        }
        isPlaying = wasPlaying;
    }
}

// ========== GALLERY UPLOAD ==========
function initGalleryUpload() {
    const uploadInput = document.getElementById('galleryUpload');
    const galleryGrid = document.getElementById('galleryGrid');

    if (!uploadInput || !galleryGrid) return;

    uploadInput.addEventListener('change', function (e) {
        const files = Array.from(e.target.files);
        const items = galleryGrid.querySelectorAll('.gallery-item');
        let idx = 0;

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                let item;
                if (idx < items.length) {
                    item = items[idx];
                    item.innerHTML = '';
                } else {
                    item = document.createElement('div');
                    item.className = 'gallery-item rounded-2xl overflow-hidden bg-green-mist border border-green-pale cursor-pointer';
                    galleryGrid.appendChild(item);
                }
                const img = document.createElement('img');
                img.src = ev.target.result;
                img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;border-radius:15px';
                item.appendChild(img);
                idx++;
            };
            reader.readAsDataURL(file);
        });
    });
}

// ========== KESAN MESSAGE (Local Storage Fallback) ==========
let selectedEmoji = '💚';

function initKesanMessage() {
    const emojiBtns = document.querySelectorAll('.emoji-btn');
    const submitBtn = document.getElementById('submitKesan');
    const kesanName = document.getElementById('kesanName');
    const kesanMsg = document.getElementById('kesanMsg');
    const kesanList = document.getElementById('kesanList');
    const kesanEmpty = document.getElementById('kesanEmpty');

    // Emoji selection
    emojiBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            emojiBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedEmoji = btn.dataset.emoji;
        });
    });

    // Load messages from localStorage
    function loadMessages() {
        const saved = localStorage.getItem('birthday_messages');
        let messages = saved ? JSON.parse(saved) : [];

        if (messages.length === 0) {
            if (kesanEmpty) kesanEmpty.style.display = 'block';
            if (kesanList) kesanList.innerHTML = '';
            if (kesanEmpty) kesanList.appendChild(kesanEmpty);
            return;
        }

        if (kesanEmpty) kesanEmpty.style.display = 'none';
        if (kesanList) {
            kesanList.innerHTML = '';
            messages.slice().reverse().forEach(msg => {
                const initials = msg.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                const card = document.createElement('div');
                card.className = 'kesan-card bg-white border border-green-pale rounded-2xl p-[18px] relative overflow-hidden animate-slide-in';
                card.innerHTML = `
                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-light to-green-soft"></div>
                    <div class="flex items-center gap-2.5 mb-2.5">
                        <div class="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-green-light to-green-soft flex items-center justify-center font-semibold text-white">${initials}</div>
                        <div>
                            <div class="font-medium text-green-deep">${escapeHtml(msg.name)}</div>
                            ${msg.relation ? '<div class="text-xs text-text-light">' + escapeHtml(msg.relation) + '</div>' : ''}
                        </div>
                        <div class="ml-auto text-xl">${msg.emoji || '💚'}</div>
                    </div>
                    <p class="font-lora text-[clamp(13px,3.6vw,15px)] text-green-mid leading-[1.8]">${escapeHtml(msg.msg).replace(/\n/g, '<br>')}</p>
                `;
                kesanList.appendChild(card);
            });
        }
    }

    // Save message
    submitBtn.addEventListener('click', () => {
        const name = kesanName.value.trim();
        const msg = kesanMsg.value.trim();

        if (!name || !msg) {
            alert('Nama dan pesan wajib diisi ya 🌿');
            return;
        }

        const newMessage = {
            name: name,
            relation: '',
            msg: msg,
            emoji: selectedEmoji,
            timestamp: new Date().toISOString()
        };

        const saved = localStorage.getItem('birthday_messages');
        const messages = saved ? JSON.parse(saved) : [];
        messages.push(newMessage);
        localStorage.setItem('birthday_messages', JSON.stringify(messages));

        kesanName.value = '';
        kesanMsg.value = '';

        loadMessages();
        alert('Pesanmu terkirim! Terima kasih 💚');
    });

    loadMessages();
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}