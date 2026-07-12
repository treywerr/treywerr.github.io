// Project Data
const projects = [
    {
        id: 'acadental',
        title: 'XR Simulation Platform (Acadental)',
        summary: 'A modular multi-user VR training platform supporting authentication, licensing, persistence, analytics, and real-time procedural simulation.',
        role: 'Senior Software Engineer | Research & Development',
        techStack: ['Unity', 'C#', 'HLSL', 'OpenXR', 'Netcode'],
        image: 'public/Teo.png', // TODO
        video: null, // TODO
        keyContributions: [
            'Performed performance profiling and optimization targeting standalone VR hardware constraints.',
            'Designed multi-user state synchronization architecture for high-fidelity training.',
            'Built persistent save-state and replay system for educational review.',
            'Implemented voxel-based procedural simulation for realistic surgical feedback.',
            'Integrated production error reporting and analytics for enterprise stability.'
        ]
    },
    {
        id: 'raytracer',
        title: 'Raytracer',
        summary: 'Custom raytracing renderer, implemented in Unity. Can handle complex models, multiple surface materials and textures, and accurately handles reflection and refraction.',
        role: 'Sole Developer',
        techStack: ['HLSL', 'C#', 'Rendering', 'Unity'],
        image: 'public/RaytraceDragonSphere.png', // TODO: Two images
        video: null,
        url: null,
        keyContributions: [
            'Researched and implemented raytracing rendering pipeline.',
            'Experimented with different spatial subdivision structures to improve render time on complex models.',
            'Studied real-life optics formulae to replicate the behavior of light in different mediums, particularly dielectrics (e.g. glass, water).'
        ]
    },
    {
        id: 'uncertainty-propagation',
        title: 'Uncertainty Propagation (2021)',
        summary: 'An interactive browser-based tool that demonstrates propagation of uncertainty using graphs.',
        role: 'Sole Developer',
        techStack: ['JavaScript', 'HTML', 'Education', 'Graphing'],
        image: 'public/uncertainty-propagation.png',
        video: null,
        url: 'UncertaintyPropagation/simulation-1.html',
        keyContributions: [
            'Worked with professor to identify areas students struggled.',
            'Created visual design and content.',
            'Conducted research on a group of volunteers to gauge effectiveness of developed tool.'
        ]
    },
    {
        id: 'dragon-curve',
        title: 'Dragon Curve (2022)',
        summary: 'Personal project that procedurally generates a dragon curve fractal based on an arbitrary input line.',
        role: 'Sole Developer',
        techStack: ['JavaScript', 'HTML'],
        image: 'public/dragon-curve.png',
        video: null,
        url: null, // TODO
        keyContributions: [
            'Developed algorithm for procedurally generating a dragon curve by inspection.',
            'Designed system to render generated curves, both layer-by-layer and via animation.',
            'Created system for users to input their own base line to generate custom dragon curves.'
        ]
    },
];

// Skills Data
const skillCategories = [
    {
        title: 'Real-Time Systems Engineering',
        skills: ['Unity / C#', 'Multi-User Synchronization', 'Performance Optimization', 'Modular Architecture', 'Physics & Procedural Simulation']
    },
    {
        title: 'Algorithms',
        skills: ['Mesh Boolean / Slicing', 'Position-based Dynamics', 'Shape Registration', 'Rootfinding / Optimization Algorithms', 'Genetic Algorithm']
    },
    {
        title: 'Core Development',
        skills: ['Research', 'Software Design Patterns', 'Version Control (Git)', 'Analytical Troubleshooting', 'Technical Leadership', 'Enterprise Software Design']
    }
];

// DOM Elements
const projectsContainer = document.getElementById('projects-container');
const skillsContainer = document.getElementById('skills-container');
const header = document.getElementById('header');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeLightbox = document.querySelector('.close-lightbox');

// Initialize Website
document.addEventListener('DOMContentLoaded', () => {
    initProjects();
    initMediaHover();
    initSkills();
    initScrollLogic();
    initRevealAnimations();
    initActiveNavTracking();
    initLightbox();
});

// Reusable Media Hover Logic Component
function initMediaHover() {
    const mediaElements = document.querySelectorAll('.project-media');
    
    mediaElements.forEach(mediaEl => {
        const video = mediaEl.querySelector('.media-vid');
        const img = mediaEl.querySelector('.media-img');
        
        if (!video) return;

        // State trackers for debouncing and cleanup
        let hoverEnterTimer = null;
        let hoverExitTimer = null;
        const hoverDelay = 300; // Delay before video plays
        
        mediaEl.addEventListener('mouseenter', () => {
            // Cancel any pending exit actions if user re-enters quickly
            if (hoverEnterTimer) clearTimeout(hoverEnterTimer);
            if (hoverExitTimer) clearTimeout(hoverExitTimer);
            
            // Start the hover delay timer. If the user leaves before this completes,
            // the timer is cleared and the video never plays.
            hoverEnterTimer = setTimeout(() => {
                video.play().then(() => {
                    // Only perform the crossfade if the video successfully starts playing
                    img.style.opacity = '0';
                    video.style.opacity = '1';
                }).catch(err => {
                    console.warn("Video autoplay prevented or interrupted", err);
                });
            }, hoverDelay);
        });
        
        mediaEl.addEventListener('mouseleave', () => {
            // Cancel the play trigger if user left before the delay finished
            if (hoverEnterTimer) {
                clearTimeout(hoverEnterTimer);
                hoverEnterTimer = null;
            }
            if (hoverExitTimer) clearTimeout(hoverExitTimer);
            
            // Immediately start fading image back in and video out
            img.style.opacity = '0.85'; // original image opacity
            video.style.opacity = '0';
            
            // Wait for the fade transition to complete before freezing the video frame
            hoverExitTimer = setTimeout(() => {
                video.pause();
                video.currentTime = 0;
            }, 400); // 400ms matches the --transition-smooth duration in CSS
        });
    });
}

// Active Nav Tracking
function initActiveNavTracking() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    const options = {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const targetLink = document.querySelector(`.nav-links a[href="#${id}"]`);

                if (targetLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    targetLink.classList.add('active');
                }
            }
        });
    }, options);

    sections.forEach(section => observer.observe(section));

    // Fallback for bottom of page (Contact section)
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            const contactLink = document.querySelector('.nav-links a[href="#contact"]');
            if (contactLink) {
                navLinks.forEach(link => link.classList.remove('active'));
                contactLink.classList.add('active');
            }
        }
    });
}

// Inject Projects
function initProjects() {
    projectsContainer.innerHTML = projects.map(p => `
        <div class="project-card reveal">
            ${p.url ? `<div class="project-media" onclick="location.href='${p.url}'">` :
                      `<div class="project-media" onclick="openLightbox('${p.image}', '${p.video || ''}', '${p.title}')">`}
                <div class="media-container">
                    <img src="${p.image}" alt="${p.title}" loading="lazy" class="media-img">
                    ${p.video ? `<video src="${p.video}" preload="metadata" muted loop playsinline class="media-vid"></video>` : ''}
                </div>
            </div>
            <div class="project-content">
                <div class="project-header">
                    <div class="title-row">
                        <h3>${p.title}</h3>
                    </div>
                    <p class="project-summary">${p.summary}</p>
                    <div class="role-label">${p.role}</div>
                </div>

                <div class="tech-stack">
                    ${p.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>

                <div class="key-contributions">
                    <h4>Key Systems Developed</h4>
                    <ul class="contribution-list">
                        ${p.keyContributions.map(bullet => `<li>${bullet}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `).join('');
}

// Inject Skills
function initSkills() {
    skillsContainer.innerHTML = skillCategories.map(cat => `
        <div class="skill-category reveal">
            <h4>${cat.title}</h4>
            <ul class="skill-list">
                ${cat.skills.map(s => `<li>${s}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

// Global Accordion Handler
window.toggleAccordion = (element) => {
    const content = element.nextElementSibling;
    const icon = element.querySelector('.icon');

    content.classList.toggle('active');
    icon.textContent = content.classList.contains('active') ? '−' : '+';
};

// Scroll Effects
function initScrollLogic() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth Scroll Offset for Fixed Header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#hero') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetElement = document.querySelector(targetId);
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Intersection Observer for Reveal Animations
function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Lightbox Logic
function initLightbox() {
    const closeLightboxHandler = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
    };

    closeLightbox.addEventListener('click', closeLightboxHandler);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightboxHandler();
        }
    });
}

window.openLightbox = (imgSrc, videoSrc, caption) => {
    lightboxCaption.textContent = caption;

    if (videoSrc) {
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = videoSrc;
        lightboxVideo.play().catch(e => console.warn(e));
    } else {
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
        lightboxImg.style.display = 'block';
        lightboxImg.src = imgSrc;
    }

    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};
