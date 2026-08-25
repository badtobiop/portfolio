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
                    name: name,
                    email: email,
                    message: message,
                    _subject: `🚀 New Portfolio Message from ${name}!`
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

