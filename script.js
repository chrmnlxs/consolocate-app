// Campus Locations Database
const locations = [
    {
        id: 1,
        name: "Main Administration Building",
        description: "President's Office, Board Room, Executive Offices",
        category: "admin",
        floor: "All Floors",
        contact: "(044) 791-0883"
    },
    {
        id: 2,
        name: "Registrar's Office",
        description: "Enrollment, transcripts, academic records",
        category: "admin",
        floor: "Ground Floor, Admin Bldg",
        contact: "registrar@lcup.edu.ph"
    },
    {
        id: 3,
        name: "College of Nursing Building",
        description: "Nursing Department, Skills Lab, Faculty Offices",
        category: "all",
        floor: "1st-3rd Floor",
        contact: "nursing@lcup.edu.ph"
    },
    {
        id: 4,
        name: "IT Building",
        description: "Computer Studies, Computer Labs, Server Room",
        category: "all",
        floor: "Ground-3rd Floor",
        contact: "computerlab@lcup.edu.ph"
    },
    {
        id: 5,
        name: "Business Building",
        description: "Business Admin, Accountancy, Faculty Rooms",
        category: "all",
        floor: "1st-4th Floor",
        contact: "business@lcup.edu.ph"
    },
    {
        id: 6,
        name: "Student Affairs Office",
        description: "Student services, guidance, scholarships",
        category: "services",
        floor: "2nd Floor, Main Bldg",
        contact: "studentaffairs@lcup.edu.ph"
    },
    {
        id: 7,
        name: "University Library",
        description: "Books, digital resources, study areas",
        category: "facilities",
        floor: "Ground-2nd Floor",
        contact: "library@lcup.edu.ph"
    },
    {
        id: 8,
        name: "Finance Office",
        description: "Cashier, payments, financial aid",
        category: "admin",
        floor: "Ground Floor, Admin",
        contact: "finance@lcup.edu.ph"
    },
    {
        id: 9,
        name: "Health & Wellness Center",
        description: "Campus clinic, first aid, health services",
        category: "support",
        floor: "Ground Floor",
        contact: "clinic@lcup.edu.ph"
    },
    {
        id: 10,
        name: "Cafeteria & Food Court",
        description: "Student dining, food services, canteen",
        category: "facilities",
        floor: "Ground Floor",
        contact: "N/A"
    },
    {
        id: 11,
        name: "Gymnasium & Sports Complex",
        description: "Indoor sports, basketball court, fitness",
        category: "facilities",
        floor: "Ground Floor",
        contact: "sports@lcup.edu.ph"
    },
    {
        id: 12,
        name: "Campus Security Office",
        description: "Safety, security, lost and found",
        category: "support",
        floor: "Main Gate",
        contact: "security@lcup.edu.ph"
    },
    {
        id: 13,
        name: "Chapel / Prayer Room",
        description: "Campus ministry, religious activities",
        category: "facilities",
        floor: "2nd Floor, Main Bldg",
        contact: "ministry@lcup.edu.ph"
    },
    {
        id: 14,
        name: "Guidance & Counseling Office",
        description: "Student counseling, psychological support",
        category: "services",
        floor: "3rd Floor, Main Bldg",
        contact: "guidance@lcup.edu.ph"
    },
    {
        id: 15,
        name: "Science Laboratories",
        description: "Chemistry, Physics, Biology labs",
        category: "all",
        floor: "Science Building",
        contact: "science@lcup.edu.ph"
    }
];

let currentFilter = 'all';

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 CONSOLOCATE System Initialized');
    console.log(`📍 Loaded ${locations.length} campus locations`);
    
    // Show welcome screen on load
    showScreen('welcome');
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Setup scroll behavior
    setupScrollBehavior();
});

// Screen Navigation System
function showScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Screen mapping
    const screens = {
        'welcome': 'welcomeScreen',
        'dashboard': 'dashboardScreen',
        'search': 'searchScreen',
        'directory': 'directoryScreen',
        'faqs': 'faqsScreen'
    };

    // Show selected screen
    const targetScreen = document.getElementById(screens[screenName]);
    if (targetScreen) {
        targetScreen.classList.add('active');
        window.scrollTo(0, 0);
    }

    // Manage FAB visibility
    const fab = document.getElementById('fabButton');
    if (fab) {
        if (screenName === 'welcome') {
            fab.classList.remove('visible');
        } else {
            fab.classList.add('visible');
        }
    }

    // Initialize screen-specific content
    if (screenName === 'search') {
        renderLocations();
    }

    // Log navigation
    console.log(`📱 Navigated to: ${screenName}`);
}

// Render Locations with Filtering
function renderLocations() {
    const container = document.getElementById('locationsList');
    const searchTerm = document.getElementById('locationSearch').value.toLowerCase();

    // Filter locations
    const filtered = locations.filter(loc => {
        const matchesCategory = currentFilter === 'all' || loc.category === currentFilter;
        const matchesSearch = 
            loc.name.toLowerCase().includes(searchTerm) || 
            loc.description.toLowerCase().includes(searchTerm) ||
            loc.floor.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    // Generate HTML
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 64px; margin-bottom: 20px;">🔍</div>
                <h3 style="font-size: 24px; color: #1e293b; margin-bottom: 10px;">No Results Found</h3>
                <p style="font-size: 16px; color: #64748b;">Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(loc => `
        <div class="result-card" onclick="selectLocation(${loc.id})">
            <div class="result-badge">${loc.id}</div>
            <div class="result-info">
                <h4>${loc.name}</h4>
                <p>📍 ${loc.floor} • ${loc.description}</p>
            </div>
        </div>
    `).join('');

    console.log(`📊 Displaying ${filtered.length} locations`);
}

// Filter by Category Tab
function filterByTab(category) {
    currentFilter = category;

    // Update active state
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    event.target.classList.add('active');

    // Re-render
    renderLocations();
}

// Search Filter Handler
function filterLocations() {
    renderLocations();
}

// Clear Search
function clearSearch() {
    const searchInput = document.getElementById('locationSearch');
    searchInput.value = '';
    renderLocations();
}

// Select Location
function selectLocation(id) {
    const location = locations.find(loc => loc.id === id);
    
    if (location) {
        // Create detailed modal or alert
        const message = `
📍 ${location.name}

📋 Description: ${location.description}
🏢 Location: ${location.floor}
📞 Contact: ${location.contact}

Would you like to see the LED path navigation?
        `;
        
        if (confirm(message)) {
            alert('🎯 Activating LED path on 3D model...\n\nFollow the illuminated path on the physical campus model!');
        }
        
        console.log(`✅ Selected: ${location.name}`);
    }
}

// Toggle College Accordion
function toggleCollege(element) {
    const item = element.closest('.college-item');
    
    // Close other items
    document.querySelectorAll('.college-item').forEach(c => {
        if (c !== item) {
            c.classList.remove('expanded');
        }
    });

    // Toggle current item
    item.classList.toggle('expanded');
}

// Toggle FAQ Accordion
function toggleFaq(element) {
    const card = element.closest('.faq-card');
    
    // Close other FAQs
    document.querySelectorAll('.faq-card').forEach(f => {
        if (f !== card) {
            f.classList.remove('active');
        }
    });

    // Toggle current FAQ
    card.classList.toggle('active');
}

// Show About Modal
function showAbout() {
    const aboutMessage = `
🎓 La Consolacion University Philippines
Founded: 1937

"Unitas • Caritas • Veritas"
(Unity • Charity • Truth)

Located in Malolos, Bulacan, LCUP is a prestigious Catholic educational institution dedicated to academic excellence and character formation.

CONSOLOCATE is our state-of-the-art interactive campus navigation system featuring:
• Interactive 3D digital map
• LED path guidance on physical model
• Real-time building and office location
• Comprehensive college directory

For more information, visit:
📧 info@lcup.edu.ph
📞 (044) 791-0883
🌐 www.lcup.edu.ph
    `;
    
    alert(aboutMessage);
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // H key - Home
        if (e.key === 'h' || e.key === 'H') {
            if (!e.ctrlKey && !e.altKey) {
                showScreen('welcome');
            }
        }
        
        // D key - Dashboard
        if (e.key === 'd' || e.key === 'D') {
            if (!e.ctrlKey && !e.altKey) {
                showScreen('dashboard');
            }
        }
        
        // Escape - Go back
        if (e.key === 'Escape') {
            const activeScreen = document.querySelector('.screen.active');
            if (activeScreen && activeScreen.id !== 'welcomeScreen') {
                showScreen('dashboard');
            }
        }
    });
    
    console.log('⌨️ Keyboard shortcuts enabled: H (Home), D (Dashboard), ESC (Back)');
}

// Scroll Behavior
function setupScrollBehavior() {
    window.addEventListener('scroll', function() {
        const fab = document.getElementById('fabButton');
        if (fab && fab.classList.contains('visible')) {
            if (window.scrollY > 200) {
                fab.style.opacity = '1';
            } else {
                fab.style.opacity = '0.9';
            }
        }
    });
}

// Utility: Smooth Scroll
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Analytics (placeholder)
function logAnalytics(action, data) {
    console.log(`📊 Analytics: ${action}`, data);
}

// Export functions for debugging
window.consolocate = {
    showScreen,
    locations,
    currentFilter,
    version: '1.0.0',
    build: '2025-01-17'
};

console.log('✅ CONSOLOCATE ready for operation');
console.log('💡 Type "consolocate" in console for system info');