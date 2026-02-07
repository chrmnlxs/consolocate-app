// Campus Locations Database with Specific Coordinates
let locations = [
    { id: 1, name: "Main Administration Building", description: "President's Office, Board Room, Executive Offices", category: "admin", floor: "All Floors", contact: "(044) 791-0883", lat: 14.8532, lng: 120.8129 },
    { id: 2, name: "Registrar's Office", description: "Enrollment, transcripts, academic records", category: "admin", floor: "Ground Floor, Admin Bldg", contact: "registrar@lcup.edu.ph", lat: 14.8530, lng: 120.8128 },
    { id: 3, name: "College of Nursing Building", description: "Nursing Department, Skills Lab, Faculty Offices", category: "all", floor: "1st-3rd Floor", contact: "nursing@lcup.edu.ph", lat: 14.8535, lng: 120.8132 },
    { id: 4, name: "IT Building", description: "Computer Studies, Computer Labs, Server Room", category: "all", floor: "Ground-3rd Floor", contact: "computerlab@lcup.edu.ph", lat: 14.8528, lng: 120.8125 },
    { id: 5, name: "Business Building", description: "Business Admin, Accountancy, Faculty Rooms", category: "all", floor: "1st-4th Floor", contact: "business@lcup.edu.ph", lat: 14.8537, lng: 120.8130 },
    { id: 6, name: "Student Affairs Office", description: "Student services, guidance, scholarships", category: "services", floor: "2nd Floor, Main Bldg", contact: "studentaffairs@lcup.edu.ph", lat: 14.8531, lng: 120.8127 },
    { id: 7, name: "University Library", description: "Books, digital resources, study areas", category: "facilities", floor: "Ground-2nd Floor", contact: "library@lcup.edu.ph", lat: 14.8534, lng: 120.8131 },
    { id: 8, name: "Finance Office", description: "Cashier, payments, financial aid", category: "admin", floor: "Ground Floor, Admin", contact: "finance@lcup.edu.ph", lat: 14.8529, lng: 120.8126 },
    { id: 9, name: "Health & Wellness Center", description: "Campus clinic, first aid, health services", category: "support", floor: "Ground Floor", contact: "clinic@lcup.edu.ph", lat: 14.8533, lng: 120.8124 },
    { id: 10, name: "Cafeteria & Food Court", description: "Student dining, food services, canteen", category: "facilities", floor: "Ground Floor", contact: "N/A", lat: 14.8527, lng: 120.8133 },
    { id: 11, name: "Gymnasium & Sports Complex", description: "Indoor sports, basketball court, fitness", category: "facilities", floor: "Ground Floor", contact: "sports@lcup.edu.ph", lat: 14.8538, lng: 120.8128 },
    { id: 12, name: "Campus Security Office", description: "Safety, security, lost and found", category: "support", floor: "Main Gate", contact: "security@lcup.edu.ph", lat: 14.8525, lng: 120.8122 },
    { id: 13, name: "Chapel / Prayer Room", description: "Campus ministry, religious activities", category: "facilities", floor: "2nd Floor, Main Bldg", contact: "ministry@lcup.edu.ph", lat: 14.8536, lng: 120.8129 },
    { id: 14, name: "Guidance & Counseling Office", description: "Student counseling, psychological support", category: "services", floor: "3rd Floor, Main Bldg", contact: "guidance@lcup.edu.ph", lat: 14.8530, lng: 120.8130 },
    { id: 15, name: "Science Laboratories", description: "Chemistry, Physics, Biology labs", category: "all", floor: "Science Building", contact: "science@lcup.edu.ph", lat: 14.8539, lng: 120.8126 }
];

let currentFilter = 'all';
let campusMap; // Global map variable
let mapMarkers = []; // Store markers for cleanup
let isLoggedIn = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 CONSOLOCATE System Initialized');
    console.log(`📍 Loaded ${locations.length} campus locations`);
    
    // Load data from localStorage if available
    loadFromLocalStorage();
    loadBuildingsFromLocalStorage();
    
    // Pre-load building data so admin panel can access it
    loadBuildingData();
    console.log(`🏢 Loaded ${buildingsData.length} buildings`);
    
    // Show welcome screen on load
    showScreen('welcome');
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Setup scroll behavior
    setupScrollBehavior();
});

/* ==========================================================================
   LOCAL STORAGE FUNCTIONS
   ========================================================================== */
function saveToLocalStorage() {
    localStorage.setItem('consolocateLocations', JSON.stringify(locations));
    console.log('💾 Data saved to localStorage');
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('consolocateLocations');
    if (saved) {
        locations = JSON.parse(saved);
        console.log('📥 Data loaded from localStorage');
    }
}

/* ==========================================================================
   AUTHENTICATION FUNCTIONS
   ========================================================================== */
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple hardcoded authentication
    if (username === 'admin' && password === 'admin123') {
        isLoggedIn = true;
        showScreen('admin');
        // Load building data if not already loaded
        if (buildingsData.length === 0) {
            loadBuildingData();
            loadBuildingsFromLocalStorage();
        }

        renderBuildingAdminTable();
        updateStats();
        alert('✅ Login successful! Welcome, Administrator.');
    } else {
        alert('❌ Invalid credentials. Please try again.\n\nDefault credentials:\nUsername: admin\nPassword: admin123');
    }
}

function handleLogout() {
    isLoggedIn = false;
    showScreen('dashboard');
    // Clear form fields
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

/* ==========================================================================
   ADMIN PANEL FUNCTIONS
   ========================================================================== */
function renderBuildingAdminTable() {
    const tbody = document.getElementById('adminTableBody');
    tbody.innerHTML = locations.map(loc => `
        <tr>
            <td>${loc.id}</td>
            <td><strong>${loc.name}</strong></td>
            <td>${loc.description}</td>
            <td><span class="category-badge ${loc.category}">${loc.category}</span></td>
            <td>${loc.floor}</td>
            <td>${loc.contact}</td>
            <td>
                <button class="action-btn edit" onclick="editLocation(${loc.id})" title="Edit">✏️</button>
                <button class="action-btn delete" onclick="deleteLocation(${loc.id})" title="Delete">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function updateStats() {
    document.getElementById('totalLocations').textContent = buildingsData.length;
}

function showAddModal() {
    document.getElementById('modalTitle').textContent = 'Add New Location';
    document.getElementById('editId').value = '';
    document.getElementById('editName').value = '';
    document.getElementById('editDescription').value = '';
    document.getElementById('editCategory').value = 'all';
    document.getElementById('editFloor').value = '';
    document.getElementById('editContact').value = '';
    document.getElementById('editModal').classList.add('active');
}

function editLocation(id) {
    const location = locations.find(loc => loc.id === id);
    if (!location) return;
    
    document.getElementById('modalTitle').textContent = 'Edit Location';
    document.getElementById('editId').value = location.id;
    document.getElementById('editName').value = location.name;
    document.getElementById('editDescription').value = location.description;
    document.getElementById('editCategory').value = location.category;
    document.getElementById('editFloor').value = location.floor;
    document.getElementById('editContact').value = location.contact;
    document.getElementById('editModal').classList.add('active');
}

function deleteLocation(id) {
    if (!confirm('⚠️ Are you sure you want to delete this location?')) return;
    
    locations = locations.filter(loc => loc.id !== id);
    saveToLocalStorage();
    renderBuildingAdminTable();
    updateStats();
    alert('✅ Location deleted successfully!');
}

function saveLocation(event) {
    event.preventDefault();
    
    const id = document.getElementById('editId').value;
    const newLocation = {
        id: id ? parseInt(id) : getNextId(),
        name: document.getElementById('editName').value,
        description: document.getElementById('editDescription').value,
        category: document.getElementById('editCategory').value,
        floor: document.getElementById('editFloor').value,
        contact: document.getElementById('editContact').value,
        lat: 14.8532, // Default latitude for LCUP
        lng: 120.8129  // Default longitude for LCUP
    };
    
    if (id) {
        // Update existing
        const index = locations.findIndex(loc => loc.id === parseInt(id));
        locations[index] = newLocation;
    } else {
        // Add new
        locations.push(newLocation);
    }
    
    saveToLocalStorage();
    renderBuildingAdminTable();
    updateStats();
    closeModal();
    alert('✅ Location saved successfully!');
}

function getNextId() {
    return Math.max(...locations.map(loc => loc.id)) + 1;
}

function closeModal() {
    document.getElementById('editModal').classList.remove('active');
}

/* ==========================================================================
   SCREEN NAVIGATION SYSTEM
   ========================================================================== */
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
        'faqs': 'faqsScreen',
        'map': 'mapScreen',
        'login': 'loginScreen',
        'admin': 'adminScreen'
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

    // Initialize map screen with TIMEOUT FIX
    if (screenName === 'map') {
        initCampusMap();
        
        // Wait for the CSS transition/display change to finish before resizing
        setTimeout(() => {
            if (campusMap) {
                campusMap.resize();
                console.log('🗺️ Map resized successfully');
            }
        }, 200);
    }

    console.log(`📱 Navigated to: ${screenName}`);
}

/* ==========================================================================
   LOCATION SEARCH & FILTER
   ========================================================================== */
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
}

function filterByTab(category) {
    currentFilter = category;
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    event.target.classList.add('active');
    renderLocations();
}

function filterLocations() { 
    renderLocations(); 
}

function clearSearch() {
    document.getElementById('locationSearch').value = '';
    renderLocations();
}

function selectLocation(id) {
    const location = locations.find(loc => loc.id === id);
    if (location) {
        const message = `
📍 ${location.name}

📋 Description: ${location.description}
🏢 Location: ${location.floor}
📞 Contact: ${location.contact}

Would you like to see the LED path navigation?`;
        
        if (confirm(message)) {
            alert('🎯 Activating LED path on 3D model...\n\nFollow the illuminated path on the physical campus model!');
        }
    }
}

/* ==========================================================================
   MAP FUNCTIONS WITH BUILDING PANEL
   ========================================================================== */

// Store building data
let buildingsData = [];

// Function to add a building to the map
function addBuilding(buildingData) {
    buildingsData.push(buildingData);
}

function initCampusMap() {
    if (campusMap) return;

    // Set Mapbox Token
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXlvd21paCIsImEiOiJjbWo1eW5yMm4wOWozM2ZwdWp5bGJvbmJ5In0.P2OctDtdjbLsVMVMcVLjrw';

    // Define bounds
    const lcupBounds = [
        [120.8115, 14.8521],
        [120.8145, 14.8545]
    ];

    // Initialize Map
    campusMap = new mapboxgl.Map({
        container: 'campusMap',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [120.8129, 14.8532],
        zoom: 20,
        minZoom: 19,
        maxZoom: 22,
        pitch: 0,
        maxBounds: lcupBounds,
        antialias: true
    });

    campusMap.addControl(new mapboxgl.NavigationControl());

    // Add markers with click handlers
    campusMap.on('load', () => {
        console.log('🗺️ Map loaded within LCUP bounds');
        
        // Only load building data if not already loaded
        // This preserves any edits made in admin panel
        if (buildingsData.length === 0) {
            console.log('📥 Loading initial building data...');
            loadBuildingData();
            loadBuildingsFromLocalStorage();
        } else {
            console.log('✅ Using existing building data (may include edits)');
        }
        
        // Add building polygons to map
        addBuildingPolygons();
        
        // Add pin markers
        // addMarkers() - Pin markers removed, buildings are clickable directly;
    });
}

function addMarkers() {
    // Clear existing markers
    mapMarkers.forEach(marker => marker.remove());
    mapMarkers = [];

    locations.forEach(loc => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerHTML = '📍';
        el.style.fontSize = '24px';
        el.style.cursor = 'pointer';

        const marker = new mapboxgl.Marker(el)
            .setLngLat([loc.lng, loc.lat])
            .addTo(campusMap);

        // Click handler to show building panel
        el.addEventListener('click', () => {
            showBuildingPanel(loc);
        });

        mapMarkers.push(marker);
    });
}

// Function to load all building polygon data
function loadBuildingData() {
    // This is where you'll paste all your addBuilding() calls
    // For now, I'll add a few examples. You can paste your full list here.
    
    // You can paste all your addBuilding() calls here from the document you provided
    // Example:
    /*
    addBuilding({
        id:'SA-building',
        name:'St. Augustine Administration Building',
        color: '#0080ff',
        coordinates: [...],
        info: {...}
    });
    */

    addBuilding({
    id:'SA-building',
    name:'St. Augustine Administration Building',
    color: '#0080ff',
    coordinates: [
        [120.8127945241639, 14.85391026664972],
        [120.81275693338233, 14.853572244530937],
        [120.81279908062339, 14.853565638230634],
        [120.8127865503622, 14.853445623731488],
        [120.81274819424101, 14.853449190420477],
        [120.81273691238607, 14.853356994699837],
        [120.81262306821594, 14.85336789957229],
        [120.81264460630206, 14.853568152581943],
        [120.8126128119847, 14.853574100687922],
        [120.8126281963315, 14.853728751395948],
        [120.81265999065062, 14.853726768694813],
        [120.81268255435884, 14.853925038673324],
        [120.81269486183766, 14.853926030022578],
        [120.81269588745965, 14.853939908914683],
        [120.812759476096, 14.853935943517143],
        [120.81275742485013, 14.853915125179114],
        [120.81279434728299, 14.85391115978112]
    ],
    info: {
        title:"Saint Augustine Administration Building",
        description:"Heart of the university.",
        image:"/images/SAbuilding.jpg",
        offices: [
            "Office of the President",
            "Registrar",
            "Finance",
            "HR"
        ]
    }
});

addBuilding({
    id:'barcie-building',
    name:'Barcie International Hotel',
    color:'#ff6600',
    coordinates: [
        [120.81307862595372, 14.85422201708323],
        [120.81307556164853, 14.854181537787639],
        [120.81309088317289, 14.854178082237226],
        [120.81308781886776, 14.854135134682622],
        [120.81306994375711, 14.854137109283243],
        [120.81306432586439, 14.854099591873208],
        [120.81258323001549, 14.85414204578474],
        [120.81259753010488, 14.854279774114715],
        [120.81275380964803, 14.854266939220011],
        [120.81275432036557, 14.854254104324596],
        [120.81307862595372, 14.85422201708323]
    ],
    info: {
        title:"Barcie International Center",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'vmc-open-stage-building',
    name:'VMC Open Stage',
    color:'#ff2200',
    coordinates: [
        [120.81282284373663, 14.853905478151546],
        [120.81281391574947, 14.85380808652019],
        [120.812953574961, 14.853794525656582],
        [120.81296377837327, 14.853891300892116],
        [120.81282284373663, 14.853905478151546]
    ],
    info: {
        title:"VMC Open Stage",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'consuelo-academic-building',
    name:'Venerable Mo. Consuelo Academic Building',
    color:'#ff2200',
    coordinates: [
        [120.81297874609902, 14.853897016176205],
        [120.81309991162618, 14.853886537331007],
        [120.8130836264072, 14.853681110913584],
        [120.81314383022129, 14.853674949405487],
        [120.81313816397926, 14.853581157536382],
        [120.81309354232889, 14.853581157536382],
        [120.81308787608697, 14.853534603892399],
        [120.8130588366073, 14.853535288500055],
        [120.81303662303492, 14.85332519517452],
        [120.81292542305016, 14.85333683359815],
        [120.81298019089576, 14.853897888369545]
    ],
    info: {
        title:"Venerable Mo. Consuelo Academic Building",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'barcie-center-building',
    name:'Barcie International Center',
    color:'#ff2200',
    coordinates: [
        [120.8125406202845, 14.85411983399456],
        [120.81257674258336, 14.854146533812127],
        [120.81258240882511, 14.854187628249122],
        [120.81250874768813, 14.854268412262584],
        [120.81242871202892, 14.854202689677692],
        [120.81232247000406, 14.854203374288105],
        [120.81229059739638, 14.85391309929932],
        [120.81250166488564, 14.853890507125811],
        [120.8125285795333, 14.85413080557683],
        [120.8125406202958, 14.854118482586117],
        [120.81256824322196, 14.854141759346447]
    ],
    info: {
        title:"Barcie International Center",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'barcie-pool-building',
    name:'Barcie Pool',
    color:'#ff2200',
    coordinates: [
        [120.81232441122393, 14.854298121540054],
        [120.81238116770731, 14.854336338427757],
        [120.81243218477033, 14.854330790815567],
        [120.8124583310152, 14.854298737941605],
        [120.81245322930988, 14.854259288243952],
        [120.81239392197307, 14.854216756530192],
        [120.81234290491005, 14.854222304145338],
        [120.81231612095178, 14.854251275023046],
        [120.81232377351068, 14.854297505138504]
    ],
    info: {
        title:"Barcie Pool",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'barcelo-cafe-building',
    name:'Barcelo Cafe Malolos',
    color:'#ff2200',
    coordinates: [
        [120.81229443335621, 14.853903296856586],
        [120.81228814011189, 14.853754264728323],
        [120.81235815246896, 14.853748181782393],
        [120.81242423154708, 14.853799886819843],
        [120.81240613846603, 14.85382726007009],
        [120.8124084984334, 14.853837905221198],
        [120.81239355197539, 14.853849310740841],
        [120.81240220518708, 14.853861476626818],
        [120.81236995230375, 14.853871361409318],
        [120.8123707389596, 14.853897213914834],
        [120.8122960066678, 14.853903296856586]
    ],
    info: {
        title: "Barcelo Cafe Malolos",
        description: "Engineering and Technology Institute.",
        image: "/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'agostino-building',
    name:'Agostino - CITHM Laboratory',
    color:'#ff2200',
    coordinates: [
        [120.81227251965043, 14.853740251442673],
        [120.81227251965043, 14.853547117804595],
        [120.81236849164645, 14.853547117804595],
        [120.81236849164645, 14.853740251442673],
        [120.81227251965043, 14.853740251442673]
    ],
    info: {
        title:"Agostino - CITHM Laboratory",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'andrada-building',
    name:'Mo. Theresa Andrada OSA Gymnasium',
    color:'#ff2200',
    coordinates: [
        [120.8131561855543, 14.854303160898624],
        [120.81310920107569, 14.853994656655203],
        [120.81330523976527, 14.853964902414944],
        [120.81335546455313, 14.85427497271256],
        [120.81315942586355, 14.854306292919517]
    ],
    info: {
        title:"Mo. Theresa Andrada OSA Gymnasium",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
        ]
    }
});

addBuilding({
    id:'ezekiel-moreno-building',
    name:'St. Ezekiel Moreno Building',
    color:'#ff2200',
    coordinates: [
        [120.81341475050982, 14.854139859237264],
        [120.81336429051026, 14.85400010376084],
        [120.81344968435837, 14.853970089150081],
        [120.81350208512754, 14.854111720558194],
        [120.81341669127937, 14.854143611061318]
    ],
    info: {
        title:"St. Ezekiel Moreno Building",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Human Anatomy Laboratory",
        ]
    }
});

addBuilding({
    id:'ostia-student-lounge-building',
    name:'Ostia Student Lounge',
    color:'#ff2200',
    coordinates: [
        [120.8135405740909, 14.85393575332111],
        [120.81350395800217, 14.853902046203999],
        [120.8135167445729, 14.853848676590871],
        [120.81356963447939, 14.853834631953376],
        [120.81360973781506, 14.853872833364818],
        [120.81359346399734, 14.853921708689981],
        [120.8135405740909, 14.853936876891737]
    ],
    info: {
        title:"Ostia Student Lounge",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
        ]
    }
});

addBuilding({
    id:'cafe-monica-building',
    name:'Cafe Monica Building',
    color:'#ff2200',
    coordinates: [
        [120.81356657633563, 14.853706526009091],
        [120.81355372886935, 14.853675184963592],
        [120.81353568123666, 14.85367902867668],
        [120.81350815095306, 14.853611615847697],
        [120.81352283377038, 14.853603041407112],
        [120.8135127393337, 14.853571109005713],
        [120.81348857389247, 14.853505195305232],
        [120.81349530351696, 14.853498099213894],
        [120.81348123248227, 14.853455522656446],
        [120.81368159177981, 14.853382787685291],
        [120.81371829882613, 14.853480654652813],
        [120.81372227589219, 14.853493073181554],
        [120.81376907737683, 14.853475628620842],
        [120.81377611289412, 14.853493073181554],
        [120.81384524988886, 14.853467540019011],
        [120.81387793580632, 14.853481855916172],
        [120.81389325732943, 14.853530233766406],
        [120.81387333934867, 14.853537638539407],
        [120.8138942787644, 14.853595889404005],
        [120.81382584262565, 14.853624027527744],
        [120.81382022473292, 14.853615141804966],
        [120.813566392334, 14.85370648993053]
    ],
    info: {
        title:"Cafe Monica Building",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "University Bookstore",
            "Cafeteria"
        ]
    }
});

addBuilding({
    id:'olgc-building',
    name:'Our Lady of Good Counsel Building',
    color:'#ff2200',
    coordinates: [
        [120.81342704920195, 14.853403961975829],
        [120.8133886192573, 14.853246853438606],
        [120.81368282883483, 14.853176824402112],
        [120.81371873878436, 14.853312619816961],
        [120.81375212873564, 14.853305312442515],
        [120.81376031872486, 14.853342458259462],
        [120.81347051913986, 14.85341126934695],
        [120.81346484914741, 14.85339543670905],
        [120.81342767920114, 14.853403961975829]
    ],
    info: {
        title:"Our Lady of Good Counsel Building",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "CITHM Office",
            "CITHM Faculty Room",
            "Function Hall",
            "Bar Area",
            "Hot Kitchen Laboratory",
            "Cold Kitchen Laboratory"
        ]
    }
});

addBuilding({
    id:'canteen-building',
    name:'Mini Canteen',
    color:'#ff2200',
    coordinates: [
        [120.81337988906557, 14.853525493034752],
        [120.81334880347413, 14.853499202042784],
        [120.81335735201287, 14.853467652848607],
        [120.81339076902395, 14.853457887620706],
        [120.81342107747548, 14.853474413390472],
        [120.81341408321651, 14.853511220781783],
        [120.81337911192765, 14.853526244206009]
    ],
    info: {
        title:"Mini Canteen",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
        ]
    }
});

addBuilding({
    id:'kalinangan-building',
    name:'Kalinangan Auditorium',
    color:'#ff2200',
    coordinates: [
        [120.81231747083638, 14.853021861563079],
        [120.81231747083933, 14.853049660005354],
        [120.81236636179545, 14.853055219691583],
        [120.81236923773446, 14.853023714799306],
        [120.8124919444515, 14.853031127715482],
        [120.8125092000833, 14.852627123396488],
        [120.81245551589541, 14.852622490314502],
        [120.81245839183447, 14.852554847314607],
        [120.81227720769783, 14.852545581148647],
        [120.81227433175883, 14.852615077384343],
        [120.81221585433934, 14.852614150767891],
        [120.81219955735156, 14.853013522038694],
        [120.81231747083933, 14.853014448652246]
    ],
    info: {
        title:"Kalinangan Auditorium",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "UBMSS Office"
        ]
    }
});

addBuilding({
    id:'chapel-building',
    name:'Chapel of Our Lady of Consolation',
    color:'#ff2200',
    coordinates: [
        [120.81295400576028, 14.853081881301861],
        [120.812919683102, 14.852992520628959],
        [120.81290695050274, 14.852899414259369],
        [120.81319481796089, 14.852825571247507],
        [120.81324464117358, 14.853017670043286],
        [120.8129816853226, 14.853085091864685],
        [120.81295400576028, 14.853081346208072]
    ],
    info: {
        title:"Chapel of Our Lady of Consolation",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'mother-rita-building',
    name:'Mo. Rita Barcelo Building',
    color:'#ff2200',
    coordinates: [
        [120.8135761632119, 14.852711583778557],
        [120.81363297870723, 14.85293751811362],
        [120.81341269057145, 14.852995890240763],
        [120.8133476011497, 14.85277078346762],
        [120.81357420961587, 14.85271325828451],
        [120.81376535330452, 14.852489197432064],
        [120.81323568305766, 14.852617239466454],
        [120.81325430847517, 14.85271217538434],
        [120.81322578248728, 14.852721893995792],
        [120.81332308196107, 14.853085631805854],
        [120.8133490187933, 14.85308243528172],
        [120.81337628214317, 14.853175122158902],
        [120.81391186142491, 14.853045894640289],
        [120.81386810853041, 14.8528771269159],
        [120.8138326385029, 14.852890319177476],
        [120.81380938453435, 14.852813153549135],
        [120.81384488368082, 14.852803641721238],
        [120.81383033399487, 14.852731644610103],
        [120.8137921787843, 14.85273702067586],
        [120.8137713338113, 14.852662111519237],
        [120.81380751845757, 14.852651663037136],
        [120.81376858370317, 14.852489343249914]
    ],
    info: {
        title:"Mo. Rita Barcelo Building",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});


addBuilding({
    id:'cloister-building',
    name:'Cloister',
    color:'#ff2200',
    coordinates: [
        [120.81304358142842, 14.852526257822603],
        [120.81303759271111, 14.852631886860905],
        [120.81305918042409, 14.852700568206657],
        [120.81283289481632, 14.852752472131996],
        [120.81280397176027, 14.85263123577974],
        [120.81293903275736, 14.852592436227567],
        [120.81294028440993, 14.852528852596578],
        [120.81304443617512, 14.852527455451323]
    ],
    info: {
        title:"Cloister",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});


addBuilding({
    id:'motor-pool-building',
    name:'Motor Pool',
    color:'#ff2200',
    coordinates: [
        [120.81270145317137, 14.852572674389307],
        [120.81257888558946, 14.852569365154679],
        [120.81256792990717, 14.852746351987548],
        [120.81269636664751, 14.852748690493826],
        [120.81270255527028, 14.852574962523036]
    ],
    info: {
        title:"Motor Pool",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'olympic-swimming-pool-building',
    name:'Adeotatus Mini Olympic Swimming Pool',
    color:'#ff2200',
    coordinates: [
        [120.81277209846053, 14.852201596387175],
        [120.81275309955402, 14.852520737912954],
        [120.81246530878082, 14.852507379360091],
        [120.81248492319554, 14.85218499622998],
        [120.81277095230024, 14.852203068443856]
    ],
    info: {
        title:"Adeotatus Mini Olympic Swimming Pool",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'fish-pond-building',
    name:'Fish Pond',
    color:'#ff2200',
    coordinates: [
        [120.8135642407837, 14.852025456383402],
        [120.81366016661747, 14.85237422215333],
        [120.81310611233238, 14.85257372107965],
        [120.81303508855387, 14.852122273465255],
        [120.81355796934236, 14.85200867065197],
        [120.8135687251825, 14.852044537280165]
    ],
    info: {
        title:"Fish Pond",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'padre-pio-building',
    name:'St. Padre Pio Building',
    color:'#ff2200',
    coordinates: [
        [120.81419694466706, 14.852175006807244],
        [120.8142724992573, 14.852455304436461],
        [120.81447133022027, 14.852376617578287],
        [120.81430020222297, 14.85212998116765],
        [120.8142696082216, 14.852141305619938],
        [120.8141917077429, 14.852017695211629],
        [120.81415812940014, 14.852019545779783],
        [120.81413871055321, 14.851969037714127],
        [120.81404118136118, 14.851992386987035],
        [120.8140115370137, 14.851960416713965],
        [120.81364088034513, 14.852082177387956],
        [120.81368308528647, 14.852199158637191],
        [120.81404188349376, 14.852081959015791],
        [120.81408441126109, 14.852195275527833],
        [120.81419726749306, 14.852171342070363]
    ],
    info:{
        title:"St. Padre Pio Building",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "St. Padre Pio Canteen"
        ]
    }
});

addBuilding({
    id:'sto-niño-building',
    name:'Sto. Niño Building',
    color:'#ff2200',
    coordinates: [
        [120.8141715637804, 14.852172467591345],
        [120.8140365970097, 14.852216018751292],
        [120.81408402940355, 14.852364293264898],
        [120.81382515009125, 14.85243109030796],
        [120.81386007334811, 14.852561837497518],
        [120.8141269966502, 14.85249438005718],
        [120.81411904943656, 14.852475574710368],
        [120.81416093097943, 14.852463521637958],
        [120.81414669815655, 14.852417160050123],
        [120.81422615494932, 14.852392985772767],
        [120.81421361477067, 14.85235666593158],
        [120.81422641897927, 14.852349891766565],
        [120.81417226019448, 14.852172591137233]
    ],
    info: {
        title:"Sto. Niño Building",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});
addBuilding({
    id:'sto-grounds-building',
    name:'Sto. Niño Grounds and Sta. Rita de Casia Student Lounge',
    color:'#ff2200',
    coordinates: [
        [120.81398892826229, 14.852151086463948],
        [120.81406220296844, 14.852355859164618],
        [120.81380412316548, 14.85242534562532],
        [120.81373730967249, 14.852222685191506],
        [120.81398853957899, 14.852152527339669]
    ],
    info: {
        title:"Sto. Niño Grounds and Sta. Rita de Casia Student Lounge",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'cassiciacum-builduing',
    name:'Cassiciacum Student Center',
    color:'#ff2200',
    coordinates: [
        [120.81451690477371, 14.852688561669567],
        [120.81427699446874, 14.852471430226942],
        [120.81409681231287, 14.852669458328762],
        [120.81433119881359, 14.852889360681843],
        [120.81451735829995, 14.852687904640305]
    ],
    info: {
        title:"Cassiciacum Student Center",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'student-lounge-builduing',
    name:'Madaura, Milan, and Hippo Student Lounge',
    color:'#ff2200',
    coordinates: [
        [120.81433966224563, 14.852939738563478],
        [120.81417528050548, 14.852796112225448],
        [120.81405259667554, 14.852953022012912],
        [120.81418757430527, 14.853082462478355],
        [120.81433943720168, 14.852938679312416]
    ],
    info: {
        title:"Madaura, Milan, and Hippo Student Lounge",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'our-lady-grace-building',
    name:'Our Lady of Grace Building',
    color:'#ff2200',
    coordinates: [
        [120.81411609751336, 14.853142687633678],
        [120.81407912673143, 14.85311277038862],
        [120.81391262827003, 14.85313123752043],
        [120.81393170958785, 14.8532661464332],
        [120.81411520895671, 14.853142843351065]
    ],
    info: {
        title:"Our Lady of Grace Building",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'our-lady-consolation-building',
    name:'Our Lady of Consolation Building',
    color:'#ff2200',
    coordinates: [
        [120.813902246206, 14.853131267865137],
        [120.81393005596408, 14.853302719122993],
        [120.81376571602914, 14.853339272038966],
        [120.81372655421382, 14.853171328365534],
        [120.81389929146445, 14.853131001620355]
    ],
    info: {
        title:"Our Lady of Consolation Building",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'saint-agustine-garden-building',
    name:'St. Agustine Inner Garden',
    color:'#00FF00',
    coordinates: [
        [120.81357312121179, 14.852722081886697],
        [120.81362160162752, 14.852931002470825],
        [120.81342139532461, 14.852985241026758],
        [120.81335772635691, 14.85277779451053],
        [120.81357106843728, 14.85272015328755]
    ],
    info: {
        title:"St. Agustine Inner Garden",
        description:"Engineering and Technology Institute.",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'carthage-activity-building',
    name:'Carthage Student Activity Hub',
    color:'#00FF00',
    coordinates: [
        [120.81261642212968, 14.853135924777504],
        [120.81258251376772, 14.853000726414564],
        [120.81285095496503, 14.852931078740781],
        [120.81288910187249, 14.853063545866803],
        [120.81261783497695, 14.853135924777504]
    ],
    info: {
        title:"Agustino Farm",
        description:"Carthage Student Activity Hub",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'tagaste-mini-forest-building1',
    name:'Tagaste Mini Forest',
    color:'#00FF00',
    coordinates: [
        [120.81327920069845, 14.853066784016036],
        [120.81320881182808, 14.8531808776264],
        [120.81268179516417, 14.853238741694952],
        [120.81263810804637, 14.85314738712475],
        [120.8132817589738, 14.853066180039178],
        [120.8129366560758, 14.853110444805168]
    ],
    info: {
        title:"Tagaste Mini Forest",
        description:"Carthage Student Activity Hub",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'tagaste-mini-forest-building2',
    name:'Tagaste Mini Forest',
    color:'#00FF00',
    coordinates: [
        [120.8125886781176, 14.852985357852688],
        [120.8125936492869, 14.85283939547054],
        [120.8127813160549, 14.852785863532361],
        [120.81279796621976, 14.8528401321215],
        [120.81286365867288, 14.852818235416947],
        [120.81288255071041, 14.85290462317738],
        [120.81258676853133, 14.852986518424828]
    ],
    info: {
        title:"Tagaste Mini Forest",
        description:"Carthage Student Activity Hub",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'mary-of-mediatrix-building',
    name:'Mary of Mediatrix',
    color:'#00FF00',
    coordinates: [
        [120.81179160500346, 14.853112014214489],
        [120.81154220392858, 14.853075375299213],
        [120.81152109051317, 14.85318609925207],
        [120.8118965148401, 14.853251301404939],
        [120.8119243118507, 14.8530886930577],
        [120.81179836180382, 14.853068042658094],
        [120.81179021189337, 14.853112218438582]
    ],
    info: {
        title:"Mary of Mediatrix",
        description:"Carthage Student Activity Hub",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'sto-niño-garden-building',
    name:'Sto. Niño Garden',
    color:'#00FF00',
    coordinates: [
        [120.81193010991484, 14.85307426173516],
        [120.8118198155525, 14.853051530767601],
        [120.81185921197391, 14.852844542604302],
        [120.81196532689194, 14.852847510092658],
        [120.81193010991836, 14.8530742617329]
    ],
    info: {
        title:"Sto. Niño Garden",
        description:"Carthage Student Activity Hub",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'grotto-lady-lourdes-building',
    name:'Grotto of Our Lady of Lourdes',
    color:'#00FF00',
    coordinates: [
        [120.81191810758185, 14.85283962927646],
        [120.8118631499367, 14.852832849082489],
        [120.81186576828236, 14.852775940762797],
        [120.8119253207704, 14.852784239246745],
        [120.81192055396735, 14.852838686929672]
    ],
    info: {
        title:"Grotto of Our Lady of Lourdes",
        description:"Carthage Student Activity Hub",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'villa-sta-monica-building',
    name:'Villa Santa Monica Building',
    color:'#00FF00',
    coordinates: [
        [120.81184329502565, 14.852817426859886],
        [120.81176888378354, 14.852803343196939],
        [120.81180290905706, 14.852590203206887],
        [120.81171334113543, 14.85257373732641],
        [120.81171820724705, 14.852518155249157],
        [120.81170237357168, 14.852510005414132],
        [120.81171201497824, 14.852467380886623],
        [120.811728245886, 14.852470993408701],
        [120.811734032429, 14.852458899756385],
        [120.81176337086663, 14.852461299516833],
        [120.8117716667748, 14.85247454505398],
        [120.81190847412228, 14.852491447572433],
        [120.81184671633036, 14.852818849157458]
    ],
    info: {
        title:"Villa Santa Monica Building",
        description:"Carthage Student Activity Hub",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});


addBuilding({
    id:'rotonda-building',
    name:'Our Lady of Consolacion Rotonda',
    color:'#00FF00',
    coordinates: [
        [120.81239996482714,14.853319126906179],
        [120.81238904806123,14.853318608520144],
        [120.81237823642991,14.853317058354378],
        [120.81236763405525,14.853314491337853],
        [120.81235734304401,14.853310932192374],
        [120.81234746250445,14.853306415194504],
        [120.81233808759158,14.853300983845468],
        [120.81232930859106,14.853294690452186],
        [120.8123212100495,14.853287595623549],
        [120.81231386996032,14.853279767686711],
        [120.81230735901256,14.853271282029057],
        [120.81230173991015,14.853262220372185],
        [120.81229706676804,14.853252669984872],
        [120.81229338459104,14.85324272284262],
        [120.81229072884045,14.853232474741903],
        [120.81228912509243,14.853222024377558],
        [120.81228858879179,14.853211472392342],
        [120.81228912510326,14.85320092040764],
        [120.8122907288617,14.853190470044824],
        [120.81229338462188,14.853180221946586],
        [120.81229706680729,14.853170274807667],
        [120.8123017399563,14.853160724424418],
        [120.81230735906385,14.853151662772182],
        [120.81231387001475,14.853143177119561],
        [120.81232121010504,14.853135349187959],
        [120.81232930864549,14.853128254364552],
        [120.81233808764286,14.853121960976305],
        [120.81234746255056,14.853116529631905],
        [120.81235734308325,14.853112012638098],
        [120.81236763408609,14.853108453495954],
        [120.81237823645115,14.85310588648191],
        [120.81238904807205,14.853104336317669],
        [120.81239996482714,14.853103817932148],
        [120.81241088158221,14.853104336317669],
        [120.8124216932031,14.85310588648191],
        [120.81243229556817,14.853108453495954],
        [120.81244258657101,14.853112012638098],
        [120.81245246710368,14.853116529631905],
        [120.8124618420114,14.853121960976305],
        [120.81247062100876,14.853128254364552],
        [120.81247871954922,14.853135349187959],
        [120.81248605963948,14.853143177119561],
        [120.81249257059042,14.853151662772182],
        [120.81249818969796,14.853160724424418],
        [120.81250286284697,14.853170274807667],
        [120.81250654503236,14.853180221946586],
        [120.81250920079256,14.853190470044824],
        [120.812510804551,14.85320092040764],
        [120.81251134086247,14.853211472392342],
        [120.81251080456182,14.853222024377558],
        [120.8125092008138,14.853232474741903],
        [120.81250654506321,14.85324272284262],
        [120.81250286288622,14.853252669984872],
        [120.8124981897441,14.853262220372185],
        [120.8124925706417,14.853271282029057],
        [120.81248605969391,14.853279767686711],
        [120.81247871960473,14.853287595623549],
        [120.81247062106318,14.853294690452186],
        [120.81246184206266,14.853300983845468],
        [120.81245246714981,14.853306415194504],
        [120.81244258661023,14.853310932192374],
        [120.81243229559901,14.853314491337853],
        [120.81242169322435,14.853317058354378],
        [120.81241088159302,14.853318608520144],
        [120.81239996482714,14.853319126906179]
    ],
    info: {
        title:"Our Lady of Consolacion Rotonda",
        description:"Carthage Student Activity Hub",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});

addBuilding({
    id:'fabrication-area-building',
    name:'UBMSS Fabrication Area',
    color:'#00FF00',
    coordinates: [
        [120.81200337297793, 14.852451490707168],
        [120.81183421431786, 14.852407967225872],
        [120.81188336236409, 14.852227011486107],
        [120.81204608951504, 14.852269241272793],
        [120.81200375662513, 14.852453754498157]
    ],
    info: {
        title:"UBMSS Fabrication Area",
        description:"Carthage Student Activity Hub",
        image:"/images/eti_building.jpg",
        offices: [
            "Engineering Labs",
            "IT Offices",
            "Lecture Rooms"
        ]
    }
});
}

// Function to add building polygons to the map
function addBuildingPolygons() {
    if (!campusMap) {
        console.error('Map not initialized');
        return;
    }

    if (buildingsData.length === 0) {
        console.error('No buildings data available');
        return;
    }

    // Create GeoJSON from building data
    const features = buildingsData.map(building => ({
        type: 'Feature',
        properties: {
            id: building.id,
            title: building.info.title,
            description: building.info.description,
            offices: JSON.stringify(building.info.offices || []),
            image: building.info.image || ''
        },
        geometry: {
            type: 'Polygon',
            coordinates: [building.coordinates]
        }
    }));

    const geojson = {
        type: 'FeatureCollection',
        features: features
    };

    console.log('📊 Created GeoJSON with', features.length, 'buildings');

    // Remove existing source and layers if they exist
    if (campusMap.getSource('campus-buildings')) {
        if (campusMap.getLayer('building-labels')) campusMap.removeLayer('building-labels');
        if (campusMap.getLayer('building-fills')) campusMap.removeLayer('building-fills');
        if (campusMap.getLayer('building-outlines')) campusMap.removeLayer('building-outlines');
        campusMap.removeSource('campus-buildings');
    }

    // Add the source
    campusMap.addSource('campus-buildings', {
        type: 'geojson',
        data: geojson
    });

    // Add fill layer for building footprints
    campusMap.addLayer({
        id: 'building-fills',
        type: 'fill',
        source: 'campus-buildings',
        paint: {
            'fill-color': '#1a4d8f',
            'fill-opacity': 0.5
        }
    });

    // Add outline layer
    campusMap.addLayer({
        id: 'building-outlines',
        type: 'line',
        source: 'campus-buildings',
        paint: {
            'line-color': '#0d2d5a',
            'line-width': 2
        }
    });

    // Add label layer
    campusMap.addLayer({
        id: 'building-labels',
        type: 'symbol',
        source: 'campus-buildings',
        layout: {
            'text-field': ['get', 'title'],
            'text-size': 12,
            'text-anchor': 'center',
            'text-offset': [0, 0]
        },
        paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#1a4d8f',
            'text-halo-width': 2
        }
    });

    // Add click handler - SINGLE HANDLER WITH CORRECT LOGIC
    campusMap.on('click', 'building-fills', (e) => {
        const clickedBuildingId = e.features[0].properties.id;
        console.log('🏢 Building clicked:', clickedBuildingId);
        
        // Find the actual building object from buildingsData
        const building = buildingsData.find(b => b.id === clickedBuildingId);
        
        if (building) {
            console.log('✅ Found building:', building.info.title);
            showBuildingPanel(building);
        } else {
            console.error('❌ Building not found in buildingsData:', clickedBuildingId);
        }
    });

    // Change cursor on hover
    campusMap.on('mouseenter', 'building-fills', () => {
        campusMap.getCanvas().style.cursor = 'pointer';
    });

    campusMap.on('mouseleave', 'building-fills', () => {
        campusMap.getCanvas().style.cursor = '';
    });

    console.log(`✅ Added ${buildingsData.length} buildings to map with click handlers`);
}

// Update the renderAdminTable to show buildings instead of locations
function renderBuildingAdminTable() {
    const tbody = document.getElementById('adminTableBody');
    
    console.log('📊 Rendering admin table, buildingsData length:', buildingsData.length);
    
    if (buildingsData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #666;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🏢</div>
                    <div style="font-size: 18px; margin-bottom: 8px;">No buildings loaded</div>
                    <div style="font-size: 14px;">Building data will load when you visit the map</div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = buildingsData.map(building => `
        <tr>
            <td>${building.id}</td>
            <td><strong>${building.info.title}</strong></td>
            <td>${building.info.description}</td>
            <td>${building.info.offices ? building.info.offices.join(', ') : 'N/A'}</td>
            <td>
                <button class="action-btn edit" onclick="editBuildingInfo('${building.id}')" title="Edit">✏️</button>
            </td>
        </tr>
    `).join('');
    
    console.log('✅ Admin table rendered with', buildingsData.length, 'buildings');
}

// Function to edit building information
// Floor Management Functions

let floorCounter = 0;

// Function to edit building information with floors
function editBuildingInfo(buildingId) {
    console.log('📝 Edit building clicked:', buildingId);
    const building = buildingsData.find(b => b.id === buildingId);
    if (!building) {
        console.error('Building not found:', buildingId);
        return;
    }
    
    console.log('Building found:', building);
    
    document.getElementById('modalTitle').textContent = 'Edit Building Information';
    document.getElementById('editId').value = building.id;
    document.getElementById('editName').value = building.info.title;
    document.getElementById('editDescription').value = building.info.description;
    
    // Load floors
    loadFloorsToForm(building);
    
    document.getElementById('editModal').classList.add('active');
    
    console.log('✅ Modal opened with building data');
}

// Load floors into the form
function loadFloorsToForm(building) {
    floorCounter = 0;
    const container = document.getElementById('floorsContainer');
    container.innerHTML = '';
    
    // Check if building has floors data structure
    if (!building.info.floors || building.info.floors.length === 0) {
        // Convert old offices array to floors if exists
        if (building.info.offices && building.info.offices.length > 0) {
            // Create a single floor with all offices
            addFloorInput('Ground Floor', building.info.offices);
        } else {
            // Show empty state
            container.innerHTML = `
                <div class="floors-empty">
                    <div class="floors-empty-icon">🏢</div>
                    <p>No floors added yet. Click "Add Floor" to get started.</p>
                </div>
            `;
        }
    } else {
        // Load existing floors
        building.info.floors.forEach(floor => {
            addFloorInput(floor.name, floor.rooms);
        });
    }
}

// Add a floor input group
function addFloorInput(floorName = '', rooms = []) {
    floorCounter++;
    const container = document.getElementById('floorsContainer');
    
    // Remove empty state if exists
    const emptyState = container.querySelector('.floors-empty');
    if (emptyState) {
        emptyState.remove();
    }
    
    const floorDiv = document.createElement('div');
    floorDiv.className = 'floor-input-group';
    floorDiv.dataset.floorId = floorCounter;
    
    floorDiv.innerHTML = `
        <div class="floor-header">
            <span class="floor-number">Floor ${floorCounter}</span>
            <button type="button" class="btn-remove-floor" onclick="removeFloor(${floorCounter})">
                Remove Floor
            </button>
        </div>
        <input 
            type="text" 
            class="floor-name-input" 
            placeholder="Floor name (e.g., Ground Floor, 2nd Floor)" 
            value="${floorName}"
            data-floor-id="${floorCounter}"
        >
        <div class="rooms-list" data-floor-id="${floorCounter}">
            ${rooms.length > 0 ? rooms.map((room, idx) => createRoomInputHTML(floorCounter, idx, room)).join('') : ''}
        </div>
        <button type="button" class="btn-add-room" onclick="addRoomInput(${floorCounter})">
            + Add Room/Office
        </button>
    `;
    
    container.appendChild(floorDiv);
    
    // Add initial room if no rooms exist
    if (rooms.length === 0) {
        addRoomInput(floorCounter);
    }
}

// Create room input HTML
function createRoomInputHTML(floorId, roomIdx, roomValue = '') {
    return `
        <div class="room-input-row" data-room-idx="${roomIdx}">
            <input 
                type="text" 
                class="room-input" 
                placeholder="Room/Office name" 
                value="${roomValue}"
                data-floor-id="${floorId}"
                data-room-idx="${roomIdx}"
            >
            <button type="button" class="btn-remove-room" onclick="removeRoom(${floorId}, ${roomIdx})">
                ✕
            </button>
        </div>
    `;
}

// Add room input to a floor
function addRoomInput(floorId) {
    const roomsList = document.querySelector(`.rooms-list[data-floor-id="${floorId}"]`);
    const roomIdx = roomsList.querySelectorAll('.room-input-row').length;
    
    const roomDiv = document.createElement('div');
    roomDiv.className = 'room-input-row';
    roomDiv.dataset.roomIdx = roomIdx;
    roomDiv.innerHTML = `
        <input 
            type="text" 
            class="room-input" 
            placeholder="Room/Office name"
            data-floor-id="${floorId}"
            data-room-idx="${roomIdx}"
        >
        <button type="button" class="btn-remove-room" onclick="removeRoom(${floorId}, ${roomIdx})">
            ✕
        </button>
    `;
    
    roomsList.appendChild(roomDiv);
}

// Remove a room
function removeRoom(floorId, roomIdx) {
    const roomRow = document.querySelector(`.room-input-row[data-room-idx="${roomIdx}"]`);
    if (roomRow && roomRow.closest('.rooms-list').dataset.floorId == floorId) {
        roomRow.remove();
    }
}

// Remove a floor
function removeFloor(floorId) {
    const floorDiv = document.querySelector(`.floor-input-group[data-floor-id="${floorId}"]`);
    if (floorDiv) {
        floorDiv.remove();
    }
    
    // Check if no floors left, show empty state
    const container = document.getElementById('floorsContainer');
    if (container.children.length === 0) {
        container.innerHTML = `
            <div class="floors-empty">
                <div class="floors-empty-icon">🏢</div>
                <p>No floors added yet. Click "Add Floor" to get started.</p>
            </div>
        `;
    }
}

// Save building information with floors - ENHANCED VERSION
function saveBuildingInfo(event) {
    console.log('🔥 saveBuildingInfo called');
    
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const buildingId = document.getElementById('editId').value;
    console.log('Building ID from form:', buildingId);
    
    const building = buildingsData.find(b => b.id === buildingId);
    
    if (!building) {
        console.error('❌ Building not found:', buildingId);
        alert('❌ Error: Building not found!');
        return false;
    }
    
    const newTitle = document.getElementById('editName').value;
    const newDescription = document.getElementById('editDescription').value;
    
    // Collect floors data
    const floors = [];
    const floorGroups = document.querySelectorAll('.floor-input-group');
    
    floorGroups.forEach(floorGroup => {
        const floorId = floorGroup.dataset.floorId;
        const floorNameInput = floorGroup.querySelector('.floor-name-input');
        const floorName = floorNameInput ? floorNameInput.value.trim() : '';
        
        if (!floorName) return; // Skip floors without names
        
        const roomInputs = floorGroup.querySelectorAll('.room-input');
        const rooms = [];
        
        roomInputs.forEach(input => {
            const roomName = input.value.trim();
            if (roomName) {
                rooms.push(roomName);
            }
        });
        
        if (rooms.length > 0) {
            floors.push({
                name: floorName,
                rooms: rooms
            });
        }
    });
    
    console.log('💾 Saving building:', buildingId);
    console.log('  Old title:', building.info.title);
    console.log('  New title:', newTitle);
    console.log('  Old description:', building.info.description);
    console.log('  New description:', newDescription);
    console.log('  Floors:', floors);
    
    // Update building data
    building.info.title = newTitle;
    building.info.description = newDescription;
    building.info.floors = floors;
    
    // Also update offices for backward compatibility
    const allRooms = floors.flatMap(f => f.rooms);
    building.info.offices = allRooms;
    
    // Save to localStorage
    saveBuildingsToLocalStorage();
    
    // Refresh the map
    refreshMapBuildings();
    
    // Refresh admin table
    renderBuildingAdminTable();
    updateStats();
    
    // Close modal
    closeModal();
    
    // Show success message
    alert('✅ Building information updated successfully!');
    
    console.log('✅ Building updated in buildingsData');
    console.log('  Current title:', building.info.title);
    console.log('  Current description:', building.info.description);
    console.log('  Current floors:', building.info.floors);
    
    return false; // Prevent form submission
}

// Display building panel with floor tabs
function showBuildingPanel(building) {
    selectedBuildingId = building.id;
    const panel = document.getElementById('buildingPanel');
    
    // Update panel content
    document.getElementById('panelName').textContent = building.info.title;
    document.getElementById('panelDescription').textContent = building.info.description;
    
    // Create floor tabs and details
    createFloorTabs(building);
    
    // Show panel with animation
    panel.classList.add('active');
    
    // Highlight building on map
    highlightBuilding(building.id);
}

// Create floor tabs
function createFloorTabs(building) {
    const tabsContainer = document.getElementById('floorTabs');
    const detailsContainer = document.getElementById('floorDetails');
    
    // Check if building has floors
    if (!building.info.floors || building.info.floors.length === 0) {
        // Show legacy offices view if no floors
        tabsContainer.innerHTML = '';
        detailsContainer.innerHTML = `
            <div class="floor-title">Offices & Rooms</div>
            <div class="floor-rooms">
                ${building.info.offices && building.info.offices.length > 0 
                    ? building.info.offices.map(office => `
                        <div class="room-item">
                            <span class="room-icon">📍</span>
                            <span>${office}</span>
                        </div>
                    `).join('')
                    : '<div class="floor-empty"><div class="floor-empty-icon">🏢</div><p>No information available</p></div>'
                }
            </div>
        `;
        return;
    }
    
    // Create tabs
    tabsContainer.innerHTML = building.info.floors.map((floor, idx) => `
        <div class="floor-tab ${idx === 0 ? 'active' : ''}" onclick="switchFloor(${idx})">
            ${floor.name}
        </div>
    `).join('');
    
    // Show first floor by default
    displayFloorDetails(building.info.floors[0]);
}

// Switch floor tab
let currentFloorIndex = 0;
function switchFloor(floorIdx) {
    currentFloorIndex = floorIdx;
    
    // Update active tab
    document.querySelectorAll('.floor-tab').forEach((tab, idx) => {
        tab.classList.toggle('active', idx === floorIdx);
    });
    
    // Get current building
    const building = buildingsData.find(b => b.id === selectedBuildingId);
    if (building && building.info.floors && building.info.floors[floorIdx]) {
        displayFloorDetails(building.info.floors[floorIdx]);
    }
}

// Display floor details
function displayFloorDetails(floor) {
    const detailsContainer = document.getElementById('floorDetails');
    
    detailsContainer.innerHTML = `
        <div class="floor-title">${floor.name}</div>
        <div class="floor-rooms">
            ${floor.rooms && floor.rooms.length > 0 
                ? floor.rooms.map(room => `
                    <div class="room-item">
                        <span class="room-icon">📍</span>
                        <span>${room}</span>
                    </div>
                `).join('')
                : '<div class="floor-empty"><div class="floor-empty-icon">🚪</div><p>No rooms on this floor</p></div>'
            }
        </div>
    `;
}

// Save buildings to localStorage
function saveBuildingsToLocalStorage() {
    localStorage.setItem('consolocateBuildings', JSON.stringify(buildingsData));
    console.log('💾 Building data saved to localStorage');
}

// Load buildings from localStorage
function loadBuildingsFromLocalStorage() {
    const saved = localStorage.getItem('consolocateBuildings');
    if (saved) {
        try {
            const savedBuildings = JSON.parse(saved);
            // Merge saved data with existing buildingsData
            savedBuildings.forEach(savedBuilding => {
                const existingBuilding = buildingsData.find(b => b.id === savedBuilding.id);
                if (existingBuilding) {
                    existingBuilding.info = savedBuilding.info;
                }
            });
            console.log('📥 Building data loaded from localStorage');
        } catch (err) {
            console.error('Error loading buildings from localStorage:', err);
        }
    }
}

// Refresh map buildings
function refreshMapBuildings() {
    if (!campusMap) {
        console.log('⚠️ Map not initialized yet, changes will appear when map loads');
        return;
    }
    
    console.log('🔄 Refreshing map buildings...');
    
    // Remove existing layers and sources
    if (campusMap.getLayer('building-highlight')) {
        campusMap.removeLayer('building-highlight');
        campusMap.removeSource('building-highlight');
    }
    if (campusMap.getLayer('building-labels')) campusMap.removeLayer('building-labels');
    if (campusMap.getLayer('building-fills')) campusMap.removeLayer('building-fills');
    if (campusMap.getSource('campus-buildings')) campusMap.removeSource('campus-buildings');
    
    // Re-add buildings with updated data
    addBuildingPolygons();
    
    console.log('✅ Map buildings refreshed with latest data');
}

/* ==========================================================================
   DIRECTORY & FAQ FUNCTIONS
   ========================================================================== */
function toggleCollege(element) {
    const item = element.closest('.college-item');
    document.querySelectorAll('.college-item').forEach(c => {
        if (c !== item) c.classList.remove('expanded');
    });
    item.classList.toggle('expanded');
}

function toggleFaq(element) {
    const card = element.closest('.faq-card');
    document.querySelectorAll('.faq-card').forEach(f => {
        if (f !== card) f.classList.remove('active');
    });
    card.classList.toggle('active');
}

function showAbout() {
    alert(`🎓 La Consolacion University Philippines\nFounded: 1937\n\n"Unitas • Caritas • Veritas"\n\nCONSOLOCATE is our state-of-the-art interactive campus navigation system.`);
}

/* ==========================================================================
   KEYBOARD SHORTCUTS & SCROLL BEHAVIOR
   ========================================================================== */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        const isTyping = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT';
        
        if (!isTyping) {
            if (e.key === 'h' || e.key === 'H') { 
                if (!e.ctrlKey && !e.altKey) showScreen('welcome'); 
            }
            if (e.key === 'd' || e.key === 'D') { 
                if (!e.ctrlKey && !e.altKey) showScreen('dashboard'); 
            }
        }
        
        if (e.key === 'Escape') {
            if (document.getElementById('editModal').classList.contains('active')) {
                closeModal();
                return;
            }
            if (document.getElementById('buildingPanel').classList.contains('active')) {
                closeBuildingPanel();
                return;
            }
            if (!isTyping) {
                const activeScreen = document.querySelector('.screen.active');
                if (activeScreen && activeScreen.id !== 'welcomeScreen') {
                    showScreen('dashboard');
                }
            }
        }
    });
}

function setupScrollBehavior() {
    window.addEventListener('scroll', function() {
        const fab = document.getElementById('fabButton');
        if (fab && fab.classList.contains('visible')) {
            fab.style.opacity = window.scrollY > 200 ? '1' : '0.9';
        }
    });
}

let selectedBuildingId = null;

function highlightBuilding(buildingId) {
    selectedBuildingId = buildingId;
    
    if (campusMap.getLayer('building-highlight')) {
        campusMap.removeLayer('building-highlight');
        campusMap.removeSource('building-highlight');
    }
    
    const selectedBuilding = buildingsData.find(b => b.id === buildingId);
    if (!selectedBuilding) return;
    
    const highlightData = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [selectedBuilding.coordinates]
            }
        }]
    };
    
    campusMap.addSource('building-highlight', {
        type: 'geojson',
        data: highlightData
    });
    
    campusMap.addLayer({
        id: 'building-highlight',
        type: 'line',
        source: 'building-highlight',
        paint: {
            'line-color': '#FFD700',
            'line-width': 4,
            'line-opacity': 1
        }
    });
}

function clearBuildingHighlight() {
    selectedBuildingId = null;
    if (campusMap.getLayer('building-highlight')) {
        campusMap.removeLayer('building-highlight');
        campusMap.removeSource('building-highlight');
    }
}

function closeBuildingPanel() {
    document.getElementById('buildingPanel').classList.remove('active');
    clearBuildingHighlight();
}

function activateLEDPath() {
    const panel = document.getElementById('buildingPanel');
    const buildingName = document.getElementById('panelName').textContent;
    
    if (buildingName) {
        alert(`🎯 Activating LED path to:\n${buildingName}\n\nFollow the illuminated path on the physical campus model!`);
    } else {
        alert('🎯 LED path activated!\n\nFollow the illuminated path on the physical campus model!');
    }
}