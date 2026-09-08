const lenis = new Lenis({
    duration: 1.8,
});

// Modal Container & Elements
const projectModal = document.getElementById('project-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalContainer = document.querySelector('.modal-container');
const modalBody = document.querySelector('.modal-body');
const habitTrackerCard = document.querySelector('.project-card[data-project="habit-tracker"]');

// Sub-instance of Lenis for buttery-smooth modal scrolling
let modalLenis = null;
if (modalContainer) {
    modalLenis = new Lenis({
        wrapper: modalContainer,
        content: modalBody || modalContainer,
        duration: 1.4,
        smoothWheel: true,
        smoothTouch: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
    });
}

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
    if (modalLenis && projectModal && projectModal.classList.contains('active')) {
        modalLenis.raf(time * 1000);
    }
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

//masking 
// --- Anime Image Mask Effect (Smooth / Slow GSAP Transition) ---
const animeBox = document.querySelector("#anime");
const uimg2 = document.querySelector("#uimg2");

if (animeBox && uimg2) {
    animeBox.addEventListener("mouseenter", function (dets) {
        const rect = animeBox.getBoundingClientRect();
        const x = dets.clientX - rect.left;
        const y = dets.clientY - rect.top;

        // Entry spot par set karo taaki mask dur se fly na kare
        gsap.set(uimg2, {
            "--x": x + "px",
            "--y": y + "px"
        });

        // Mask ko smoothly fade in karo
        gsap.to(uimg2, {
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto"
        });
    });

    animeBox.addEventListener("mousemove", function (dets) {
        const rect = animeBox.getBoundingClientRect();
        const x = dets.clientX - rect.left;
        const y = dets.clientY - rect.top;

        // Mask ko mouse ke peeche smooth glide karao
        gsap.to(uimg2, {
            opacity: 1,
            "--x": x + "px",
            "--y": y + "px",
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto"
        });
    });

    animeBox.addEventListener("mouseleave", function () {
        // Mouse div se bahar jate hi mask turant smooth fade-out (gayab) hoga
        gsap.to(uimg2, {
            opacity: 0,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto"
        });
    });
}



// ==========================================
// 🚀 PROJECT DETAILS MODAL INTERACTION
// ==========================================
function openProjectModal() {
    if (!projectModal) return;
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Pause main page scroll and activate smooth modal scrolling
    lenis.stop();
    if (modalLenis) {
        modalLenis.scrollTo(0, { immediate: true });
        modalLenis.resize();
        modalLenis.start();
    }
}

function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Stop modal scroll and resume page scroll
    if (modalLenis) {
        modalLenis.stop();
    }
    lenis.start();
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




// ==========================================
// AMBIENT GLOW CURSOR TRACKER
// ==========================================
(function initCursorGlow() {
    const wrapper = document.getElementById("cursor-glow-wrapper");
    if (!wrapper) return;

    let isHidden = false;

    // 1. Mouse Follow with GSAP smooth spring easing
    window.addEventListener("mousemove", function (dets) {
        gsap.to(wrapper, {
            x: dets.clientX,
            y: dets.clientY,
            opacity: isHidden ? 0 : 1,
            duration: 0.55,
            ease: "power2.out",
            overwrite: "auto"
        });
    });

    // Window se bahar jane par gayab
    document.addEventListener("mouseleave", function () {
        gsap.to(wrapper, { opacity: 0, duration: 0.3, overwrite: "auto" });
    });

    // 2. Mask wali Image (#anime) aur images pe GAYAB ho jaye
    const hiddenTargets = document.querySelectorAll("#anime, #circleimg1, .project-thumb, #uimg, #uimg2");
    hiddenTargets.forEach(function (el) {
        el.addEventListener("mouseenter", function () {
            isHidden = true;
            wrapper.classList.add("hidden-on-img");
            gsap.to(wrapper, { opacity: 0, duration: 0.25, overwrite: "auto" });
        });
        el.addEventListener("mouseleave", function () {
            isHidden = false;
            wrapper.classList.remove("hidden-on-img");
            gsap.to(wrapper, { opacity: 1, duration: 0.35, overwrite: "auto" });
        });
    });

    // 3. Name, Headings, Links, Buttons pe Transparent + Bada Circle
    const textTargets = "#utkarsh, #Dhakane, #hi, #developer, #p1, .Aboutme1, #span1, #span2, #project-title, #contact-title, a, button, .tag, .proj-btn";
    document.querySelectorAll(textTargets).forEach(function (el) {
        el.addEventListener("mouseenter", function () {
            if (!isHidden) {
                wrapper.classList.add("hovering-text");
            }
        });
        el.addEventListener("mouseleave", function () {
            wrapper.classList.remove("hovering-text");
        });
    });
})();
