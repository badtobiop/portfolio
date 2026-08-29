const lenis = new Lenis({
    duration: 2,
});

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(false);

lenis.on('scroll', ScrollTrigger.update);

ScrollTrigger.refresh();

gsap.from("#topdiv", {
    opacity: 0,
    duration: 1,
    delay: 0.5,
    x: 50,
    stagger: 2,
    scrollTrigger: {
        trigger: "#topdiv",
        scrub: 2,
        end: "top 30%"
    }
});

gsap.from("#botomdiv", {
    opacity: 0,
    duration: 1,
    delay: 0.5,
    x: -50,
    stagger: 2,
    scrollTrigger: {
        trigger: "#botomdiv",
        scrub: 2,
        end: "top 30%"
    }
});

gsap.from(".insid", {
    opacity: 0,
    duration: 0.8,
    delay: 0.5,
    x: -50,
    stagger: 2,
    scrollTrigger: {
        trigger: ".insid",
        scrub: 2,
        end: "top 30%"
    }
});

gsap.from(".insid2", {
    opacity: 0,
    duration: 0.8,
    delay: 0.5,
    x: 50,
    stagger: 2,
    scrollTrigger: {
        trigger: ".insid2",
        scrub: 2,
        end: "top 30%"
    }
});

// ==========================================
// 🚀 PROJECT DETAILS MODAL INTERACTION
// ==========================================
const projectModal = document.getElementById('project-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalBackdrop = document.getElementById('modal-backdrop');
const habitTrackerCard = document.querySelector('.project-card[data-project="habit-tracker"]');

function openProjectModal() {
    if (!projectModal) return;
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

const modalContainer = document.querySelector('.modal-container');
if (modalContainer) {
    modalContainer.addEventListener('wheel', (e) => {
        e.stopPropagation();
    }, { passive: true });
}

if (habitTrackerCard) {
    habitTrackerCard.addEventListener('click', (e) => {
        // If clicking on the direct external link inside the card, let the link open normally
        if (e.target.closest('.live-btn')) {
            return;
        }
        openProjectModal();
    });

    habitTrackerCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openProjectModal();
        }
    });
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
}

if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeProjectModal);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
        closeProjectModal();
    }
});

// ==========================================
// 🚀 DIRECT EMAIL INTEGRATION (Works 100% on Vercel)
// ==========================================
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('contact-name');
const emailInput = document.getElementById('contact-email');
const messageInput = document.getElementById('contact-message');
const sendBtn = document.getElementById('contact-btn');

function showToast(message, type = 'success') {
    const toastBox = document.getElementById('toast-box') || document.body;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

    toastBox.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 400);
    }, 4500);
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Client-side validation
        if (!name || !email || !message) {
            showToast('Please fill out all fields.', 'error');
            return;
        }

        const originalBtnText = sendBtn.innerText;
        sendBtn.disabled = true;
        sendBtn.innerText = 'SENDING...';

        try {
            const response = await fetch('https://formsubmit.co/ajax/utkarshdhakane2@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "Name": name,
                    "Email": email,
                    "Message": message,
                    "_replyto": email,
                    "_subject": `🚀 Portfolio Message from ${name} (${email})`,
                    "_template": "table",
                    "_captcha": "false"
                })
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Thank you! Your message has been sent to Utkarsh. 🚀', 'success');
                contactForm.reset();
            } else {
                showToast('Could not send message. Please try again.', 'error');
            }
        } catch (err) {
            console.error('Network Error:', err);
            showToast('Network error. Please try again.', 'error');
        } finally {
            sendBtn.disabled = false;
            sendBtn.innerText = originalBtnText;
        }
    });
}

// ==========================================
// 🚀 SMOOTH SCROLLING (Lenis integration for Buttons & Nav Links)
// ==========================================
const viewMyWorkBtn = document.getElementById('b1');
if (viewMyWorkBtn) {
    viewMyWorkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectSection = document.getElementById('project');
        if (projectSection) {
            lenis.scrollTo(projectSection, { offset: -20, duration: 1.4 });
        }
    });
}

// Smooth scroll for all internal anchor links (Home, About Me, Project, Contact, Talk to Me)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                lenis.scrollTo(targetEl, { offset: -20, duration: 1.4 });
            }
        }
    });
});

// Ensure proper trigger recalculation on load
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});


