// Global variables and configuration
let currentLanguage = 'en';
let isOnline = navigator.onLine;
let db;
let currentUser = null;
let recognition;
let isListening = false;
let salesChart = null;
let currentTheme = 'auto';
let charts = {};

// Sample data and translations
const sampleProducts = [
    {
        id: "1",
        name: "Basmati Rice",
        category: "Rice",
        currentStock: 50,
        minStock: 10,
        costPrice: 80,
        sellingPrice: 100,
        unit: "kg",
        lastUpdated: "2025-01-15"
    },
    {
        id: "2",
        name: "Moong Dal",
        category: "Dal",
        currentStock: 25,
        minStock: 5,
        costPrice: 120,
        sellingPrice: 150,
        unit: "kg",
        lastUpdated: "2025-01-15"
    },
    {
        id: "3",
        name: "Sunflower Oil",
        category: "Oil",
        currentStock: 30,
        minStock: 8,
        costPrice: 140,
        sellingPrice: 170,
        unit: "liter",
        lastUpdated: "2025-01-15"
    },
    {
        id: "4",
        name: "Turmeric Powder",
        category: "Spices",
        currentStock: 15,
        minStock: 3,
        costPrice: 200,
        sellingPrice: 250,
        unit: "kg",
        lastUpdated: "2025-01-15"
    },
    {
        id: "5",
        name: "Wheat Flour",
        category: "Flour",
        currentStock: 40,
        minStock: 10,
        costPrice: 35,
        sellingPrice: 45,
        unit: "kg",
        lastUpdated: "2025-01-15"
    }
];

const sampleSales = [
    {
        id: "1",
        productId: "1",
        productName: "Basmati Rice",
        quantity: 5,
        pricePerUnit: 100,
        totalAmount: 500,
        costPrice: 80,
        date: "2025-01-15",
        time: "10:30:00"
    },
    {
        id: "2",
        productId: "2",
        productName: "Moong Dal",
        quantity: 2,
        pricePerUnit: 150,
        totalAmount: 300,
        costPrice: 120,
        date: "2025-01-15",
        time: "11:15:00"
    },
    {
        id: "3",
        productId: "3",
        productName: "Sunflower Oil",
        quantity: 1,
        pricePerUnit: 170,
        totalAmount: 170,
        costPrice: 140,
        date: "2025-01-14",
        time: "14:20:00"
    },
    {
        id: "4",
        productId: "1",
        productName: "Basmati Rice",
        quantity: 3,
        pricePerUnit: 100,
        totalAmount: 300,
        costPrice: 80,
        date: "2025-01-14",
        time: "16:45:00"
    },
    {
        id: "5",
        productId: "4",
        productName: "Turmeric Powder",
        quantity: 1,
        pricePerUnit: 250,
        totalAmount: 250,
        costPrice: 200,
        date: "2025-01-13",
        time: "09:15:00"
    }
];

const categories = ["Rice", "Dal", "Oil", "Spices", "Flour", "Sugar", "Biscuits", "Snacks", "Dairy", "Eggs", "Soap", "Detergent","Beverages"];

const translations = {
    en: {
        dashboard: "Dashboard",
        products: "Products",
        sales: "Sales",
        inventory: "Inventory",
        analytics: "Analytics",
        totalSales: "Total Sales",
        lowStock: "Low Stock",
        todaySales: "Today's Sales",
        addProduct: "Add Product",
        productName: "Product Name",
        category: "Category",
        quantity: "Quantity",
        price: "Price",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        search: "Search",
        voiceInput: "Voice Input",
        settings: "Settings",
        language: "Language",
        backup: "Backup",
        restore: "Restore",
        logout: "Logout",
        login: "Login",
        register: "Register",
        email: "Email",
        password: "Password",
        storeName: "Store Name",
        storeAddress: "Store Address",
        phoneNumber: "Phone Number",
        reorderPoint: "Reorder Point",
        safetyStock: "Safety Stock",
        leadTime: "Lead Time",
        dailySales: "Daily Sales",
        weeklyReport: "Weekly Report",
        monthlyReport: "Monthly Report",
        topProducts: "Top Products",
        stockAlert: "Stock Alert",
        offline: "Offline",
        online: "Online",
        syncPending: "Sync Pending",
        syncComplete: "Sync Complete",
        listening: "Listening...",
        processing: "Processing...",
        noSalesData: "No sales data available",
        noProductsFound: "No products found",
        productAddedSuccess: "Product added successfully",
        saleRecordedSuccess: "Sale recorded successfully",
        outOfStock: "Out of Stock",
        reorderSuggested: "Reorder Suggested",
        selectCategory: "Select Category",
        selectProduct: "Select Product"
    },
    hi: {
        dashboard: "डैशबोर्ड",
        products: "उत्पाद",
        sales: "बिक्री",
        inventory: "इन्वेंटरी",
        analytics: "विश्लेषण",
        totalSales: "कुल बिक्री",
        lowStock: "कम स्टॉक",
        todaySales: "आज की बिक्री",
        addProduct: "उत्पाद जोड़ें",
        productName: "उत्पाद का नाम",
        category: "श्रेणी",
        quantity: "मात्रा",
        price: "मूल्य",
        save: "सेव करें",
        cancel: "रद्द करें",
        delete: "हटाएं",
        edit: "संपादित करें",
        search: "खोजें",
        voiceInput: "आवाज़ इनपुट",
        settings: "सेटिंग्स",
        language: "भाषा",
        backup: "बैकअप",
        restore: "पुनर्स्थापित करें",
        logout: "लॉगआउट",
        login: "लॉगिन",
        register: "पंजीकरण",
        email: "ईमेल",
        password: "पासवर्ड",
        storeName: "दुकान का नाम",
        storeAddress: "दुकान का पता",
        phoneNumber: "फोन नंबर",
        reorderPoint: "रीऑर्डर पॉइंट",
        safetyStock: "सुरक्षा स्टॉक",
        leadTime: "लीड टाइम",
        dailySales: "दैनिक बिक्री",
        weeklyReport: "साप्ताहिक रिपोर्ट",
        monthlyReport: "मासिक रिपोर्ट",
        topProducts: "शीर्ष उत्पाद",
        stockAlert: "स्टॉक अलर्ट",
        offline: "ऑफलाइन",
        online: "ऑनलाइन",
        syncPending: "सिंक पेंडिंग",
        syncComplete: "सिंक पूर्ण",
        listening: "सुन रहा है...",
        processing: "प्रोसेसिंग...",
        noSalesData: "बिक्री डेटा उपलब्ध नहीं",
        noProductsFound: "कोई उत्पाद नहीं मिला",
        productAddedSuccess: "उत्पाद सफलतापूर्वक जोड़ा गया",
        saleRecordedSuccess: "बिक्री सफलतापूर्वक रिकॉर्ड की गई",
        outOfStock: "स्टॉक समाप्त",
        reorderSuggested: "रीऑर्डर सुझाया गया",
        selectCategory: "श्रेणी चुनें",
        selectProduct: "उत्पाद चुनें"
    },
    te: {
        dashboard: "డాష్‌బోర్డ్",
        products: "ఉత్పత్తులు",
        sales: "అమ్మకాలు",
        inventory: "ఇన్వెంటరీ",
        analytics: "విశ్లేషణ",
        totalSales: "మొత్తం అమ్మకాలు",
        lowStock: "తక్కువ స్టాక్",
        todaySales: "నేటి అమ్మకాలు",
        addProduct: "ఉత్పత్తిని జోడించు",
        productName: "ఉత్పత్తి పేరు",
        category: "వర్గం",
        quantity: "పరిమాణం",
        price: "ధర",
        save: "భద్రపరచు",
        cancel: "రద్దు చేయి",
        delete: "తొలగించు",
        edit: "సవరించు",
        search: "వెతకండి",
        voiceInput: "వాయిస్ ఇన్‌పుట్",
        settings: "సెట్టింగ్‌లు",
        language: "భాష",
        backup: "బ్యాకప్",
        restore: "పునరుద్ధరించు",
        logout: "లాగౌట్",
        login: "లాగిన్",
        register: "నమోదు",
        email: "ఇమెయిల్",
        password: "పాస్‌వర్డ్",
        storeName: "దుకాణం పేరు",
        storeAddress: "దుకాణం చిరునామా",
        phoneNumber: "ఫోన్ నంబర్",
        reorderPoint: "రీఆర్డర్ పాయింట్",
        safetyStock: "సేఫ్టీ స్టాక్",
        leadTime: "లీడ్ టైమ్",
        dailySales: "దైనిక అమ్మకాలు",
        weeklyReport: "వారపు నివేదిక",
        monthlyReport: "నెలవారీ నివేదిక",
        topProducts: "టాప్ ఉత్పత్తులు",
        stockAlert: "స్టాక్ అలర్ట్",
        offline: "ఆఫ్‌లైన్",
        online: "ఆన్‌లైన్",
        syncPending: "సింక్ పెండింగ్",
        syncComplete: "సింక్ పూర్తి",
        listening: "వింటుంది...",
        processing: "ప్రాసెసింగ్...",
        noSalesData: "అమ్మకాల డేటా అందుబాటులో లేదు",
        noProductsFound: "ఉత్పత్తులు కనుగొనబడలేదు",
        productAddedSuccess: "ఉత్పత్తి విజయవంతంగా జోడించబడింది",
        saleRecordedSuccess: "అమ్మకం విజయవంతంగా రికార్డ్ చేయబడింది",
        outOfStock: "స్టాక్ అయిపోయింది",
        reorderSuggested: "రీఆర్డర్ సూచించబడింది",
        selectCategory: "వర్గం ఎంచుకోండి",
        selectProduct: "ఉత్పత్తిని ఎంచుకోండి"
    }
};

// IndexedDB setup
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('KiranaStoreDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Create stores
            const productStore = db.createObjectStore('products', { keyPath: 'id' });
            const salesStore = db.createObjectStore('sales', { keyPath: 'id' });
            const settingsStore = db.createObjectStore('settings', { keyPath: 'key' });
            
            // Create indexes
            productStore.createIndex('category', 'category');
            productStore.createIndex('name', 'name');
            salesStore.createIndex('date', 'date');
            salesStore.createIndex('productId', 'productId');
        };
    });
}

// Database operations
function saveToIndexedDB(storeName, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

function getFromIndexedDB(storeName, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

function getAllFromIndexedDB(storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

function deleteFromIndexedDB(storeName, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    currentTheme = savedTheme;
    applyTheme(savedTheme);
    
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = savedTheme;
    }
}

function applyTheme(theme) {
    const root = document.documentElement;
    const themeIcon = document.getElementById('themeIcon');
    
    if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.textContent = '🌙';
    } else {
        root.removeAttribute('data-theme');
        if (themeIcon) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            themeIcon.textContent = prefersDark ? '☀️' : '🌙';
        }
    }
}

function toggleTheme() {
    const themes = ['auto', 'light', 'dark'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    currentTheme = nextTheme;
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
    
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = nextTheme;
    }
}

// Login functionality
function showLogin() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('mainApp').classList.add('hidden');
}

function hideLogin() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainApp').classList.remove('hidden');
}

function handleLogin(storeName, ownerName) {
    currentUser = { storeName, ownerName };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update store name in header
    document.getElementById('headerStoreName').textContent = storeName;
    document.getElementById('storeNameInput').value = storeName;
    document.getElementById('ownerNameInput').value = ownerName;
    
    hideLogin();
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLogin();
}

// Language and translation functions
function translate(key) {
    return translations[currentLanguage][key] || key;
}

function updateLanguage() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translate(key);
    });
    
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        element.placeholder = translate(key);
    });
    
    // Update dropdowns that need translation
    populateCategories();
    updateProductSelect();
}

// Navigation functions
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // Load section-specific data
    switch(sectionId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'products':
            loadProducts();
            break;
        case 'sales':
            loadSales();
            break;
        case 'inventory':
            loadInventory();
            break;
        case 'analytics':
            loadAnalytics();
            break;
    }
}

// Dashboard functions
async function loadDashboard() {
    const products = await getAllFromIndexedDB('products');
    const sales = await getAllFromIndexedDB('sales');
    
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(sale => sale.date === today);
    const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalProfit = sales.reduce((sum, sale) => {
        const profit = (sale.pricePerUnit - (sale.costPrice || 0)) * sale.quantity;
        return sum + profit;
    }, 0);
    const lowStockProducts = products.filter(product => product.currentStock <= product.minStock);
    
    document.getElementById('todaySalesValue').textContent = `₹${todayRevenue}`;
    document.getElementById('totalSalesValue').textContent = `₹${totalRevenue}`;
    document.getElementById('totalProfitValue').textContent = `₹${totalProfit}`;
    document.getElementById('lowStockValue').textContent = lowStockProducts.length;
    document.getElementById('totalProductsValue').textContent = products.length;
    
    // Update current date
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString();
    
    // Show stock alerts
    showStockAlerts(lowStockProducts);
}

function showStockAlerts(lowStockProducts) {
    const alertsContainer = document.getElementById('stockAlerts');
    
    if (lowStockProducts.length === 0) {
        alertsContainer.innerHTML = '<p class="empty-state-text">No stock alerts</p>';
        return;
    }
    
    alertsContainer.innerHTML = lowStockProducts.map(product => `
        <div class="stock-alert">
            <div class="stock-alert-info">
                <div class="stock-alert-icon">⚠️</div>
                <div class="stock-alert-text">
                    <strong>${product.name}</strong> is running low
                    <br>Current: <span class="stock-alert-quantity">${product.currentStock} ${product.unit}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Products functions
async function loadProducts() {
    const products = await getAllFromIndexedDB('products');
    const productsGrid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <div class="empty-state-text">${translate('noProductsFound')}</div>
                <div class="empty-state-subtext">Add your first product to get started</div>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = products.map(product => {
        const stockPercentage = (product.currentStock / (product.minStock * 3)) * 100;
        const stockClass = stockPercentage < 33 ? 'critical' : stockPercentage < 66 ? 'low' : '';
        
        return `
            <div class="product-card">
                <div class="product-header">
                    <h3 class="product-name">${product.name}</h3>
                    <span class="product-category">${product.category}</span>
                </div>
                <div class="product-body">
                    <div class="product-details">
                        <div class="product-detail">
                            <span class="product-detail-label">Stock</span>
                            <span class="product-detail-value">${product.currentStock} ${product.unit}</span>
                        </div>
                        <div class="product-detail">
                            <span class="product-detail-label">Price</span>
                            <span class="product-detail-value">₹${product.sellingPrice}</span>
                        </div>
                        <div class="product-detail">
                            <span class="product-detail-label">Cost</span>
                            <span class="product-detail-value">₹${product.costPrice}</span>
                        </div>
                        <div class="product-detail">
                            <span class="product-detail-label">Min Stock</span>
                            <span class="product-detail-value">${product.minStock} ${product.unit}</span>
                        </div>
                    </div>
                    <div class="stock-indicator">
                        <div class="stock-fill ${stockClass}" style="width: ${Math.min(stockPercentage, 100)}%"></div>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn--secondary btn--sm" onclick="editProduct('${product.id}')">
                            ${translate('edit')}
                        </button>
                        <button class="btn btn--outline btn--sm" onclick="deleteProduct('${product.id}')">
                            ${translate('delete')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function addProduct(productData) {
    const product = {
        id: Date.now().toString(),
        ...productData,
        lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    await saveToIndexedDB('products', product);
    showToast(translate('productAddedSuccess'));
    loadProducts();
    updateProductSelect();
}

async function editProduct(productId) {
    const product = await getFromIndexedDB('products', productId);
    if (!product) return;
    
    // Fill form with existing data
    document.getElementById('productNameInput').value = product.name;
    document.getElementById('productCategoryInput').value = product.category;
    document.getElementById('costPriceInput').value = product.costPrice;
    document.getElementById('sellingPriceInput').value = product.sellingPrice;
    document.getElementById('quantityInput').value = product.currentStock;
    document.getElementById('unitInput').value = product.unit;
    document.getElementById('minStockInput').value = product.minStock;
    
    // Update form to edit mode
    const form = document.getElementById('addProductForm');
    form.dataset.editId = productId;
    
    // Populate categories before showing modal
    populateCategories();
    showModal('addProductModal');
}

async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        await deleteFromIndexedDB('products', productId);
        showToast('Product deleted successfully');
        loadProducts();
        updateProductSelect();
    }
}

// Sales functions
async function loadSales() {
    const sales = await getAllFromIndexedDB('sales');
    const recentSales = sales.slice(-10).reverse();
    
    const salesContainer = document.getElementById('recentSales');
    
    if (recentSales.length === 0) {
        salesContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💰</div>
                <div class="empty-state-text">${translate('noSalesData')}</div>
                <div class="empty-state-subtext">Record your first sale to get started</div>
            </div>
        `;
        return;
    }
    
    salesContainer.innerHTML = recentSales.map(sale => `
        <div class="sale-item">
            <div class="sale-info">
                <div class="sale-product">${sale.productName}</div>
                <div class="sale-details">
                    ${sale.quantity} ${sale.unit || 'units'} × ₹${sale.pricePerUnit} - ${sale.date} ${sale.time}
                </div>
            </div>
            <div class="sale-amount">₹${sale.totalAmount}</div>
        </div>
    `).join('');
}

async function recordSale(saleData) {
    // Get product details for cost price
    const product = await getFromIndexedDB('products', saleData.productId);
    
    const sale = {
        id: Date.now().toString(),
        ...saleData,
        costPrice: product ? product.costPrice : 0,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString()
    };
    
    await saveToIndexedDB('sales', sale);
    
    // Update product stock
    if (product) {
        product.currentStock -= saleData.quantity;
        await saveToIndexedDB('products', product);
    }
    
    showToast(translate('saleRecordedSuccess'));
    loadSales();
    loadDashboard();
    loadInventory();
}

// Enhanced Voice recognition functions
function initVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('Speech recognition not supported');
        showToast('Speech recognition not supported in this browser');
        return false;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'te' ? 'te-IN' : 'en-US';
    
    recognition.onstart = function() {
        isListening = true;
        const voiceBtn = document.getElementById('voiceInputBtn');
        const voiceStatus = document.getElementById('voiceStatus');
        const voiceTranscript = document.getElementById('voiceTranscript');
        
        voiceBtn.classList.add('listening');
        voiceStatus.textContent = translate('listening');
        voiceStatus.classList.add('listening');
        voiceTranscript.textContent = 'Listening for your command...';
        
        console.log('Voice recognition started');
    };
    
    recognition.onresult = function(event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        
        document.getElementById('voiceTranscript').textContent = transcript;
        
        if (event.results[event.results.length - 1].isFinal) {
            console.log('Final transcript:', transcript);
            processVoiceCommand(transcript);
        }
    };
    
    recognition.onend = function() {
        isListening = false;
        const voiceBtn = document.getElementById('voiceInputBtn');
        const voiceStatus = document.getElementById('voiceStatus');
        
        voiceBtn.classList.remove('listening');
        voiceStatus.textContent = '';
        voiceStatus.classList.remove('listening');
        
        console.log('Voice recognition ended');
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        isListening = false;
        
        const voiceBtn = document.getElementById('voiceInputBtn');
        const voiceStatus = document.getElementById('voiceStatus');
        const voiceTranscript = document.getElementById('voiceTranscript');
        
        voiceBtn.classList.remove('listening');
        voiceStatus.textContent = 'Error: ' + event.error;
        voiceStatus.classList.remove('listening');
        voiceTranscript.textContent = 'Error occurred. Please try again.';
        
        showToast('Voice recognition error: ' + event.error);
    };
    
    return true;
}

function startVoiceRecognition() {
    if (!recognition) {
        if (!initVoiceRecognition()) {
            return;
        }
    }
    
    if (isListening) {
        recognition.stop();
    } else {
        try {
            recognition.start();
        } catch (error) {
            console.error('Error starting voice recognition:', error);
            showToast('Error starting voice recognition');
        }
    }
}

async function processVoiceCommand(transcript) {
    const voiceStatus = document.getElementById('voiceStatus');
    const voiceTranscript = document.getElementById('voiceTranscript');
    
    voiceStatus.textContent = translate('processing');
    voiceTranscript.textContent = `Processing: "${transcript}"`;
    
    // Enhanced voice command processing with better pattern matching
    const command = transcript.toLowerCase().trim();
    console.log('Processing command:', command);
    
    // Multiple patterns for sale commands
    const salePatterns = [
        /(?:sold|sale|sell)\s+(\d+)\s+(.+)/i,
        /(\d+)\s+(.+)\s+(?:sold|sale|sell)/i,
        /(?:record|add)\s+(?:sale|sold)\s+(\d+)\s+(.+)/i,
        /(?:बेचा|बिक्री)\s+(\d+)\s+(.+)/i, // Hindi
        /(\d+)\s+(.+)\s+(?:बेचा|बिक्री)/i, // Hindi
        /(?:అమ్మాను|అమ్మకం)\s+(\d+)\s+(.+)/i, // Telugu
        /(\d+)\s+(.+)\s+(?:అమ్మాను|అమ్మకం)/i // Telugu
    ];
    
    let saleMatch = null;
    for (const pattern of salePatterns) {
        saleMatch = command.match(pattern);
        if (saleMatch) break;
    }
    
    if (saleMatch) {
        const quantity = parseInt(saleMatch[1]);
        let productName = saleMatch[2].trim();
        
        // Clean up product name
        productName = productName.replace(/[^\w\s]/g, '').trim();
        
        console.log('Parsed sale:', { quantity, productName });
        
        if (isNaN(quantity) || quantity <= 0) {
            showToast('Invalid quantity specified');
            voiceTranscript.textContent = 'Invalid quantity. Please try again.';
            return;
        }
        
        const products = await getAllFromIndexedDB('products');
        
        // Enhanced product matching
        const product = products.find(p => {
            const pName = p.name.toLowerCase();
            const searchName = productName.toLowerCase();
            
            // Exact match
            if (pName === searchName) return true;
            
            // Contains match
            if (pName.includes(searchName) || searchName.includes(pName)) return true;
            
            // Word match
            const pWords = pName.split(' ');
            const sWords = searchName.split(' ');
            
            return pWords.some(pw => sWords.some(sw => 
                pw.includes(sw) || sw.includes(pw)
            ));
        });
        
        if (product) {
            if (product.currentStock >= quantity) {
                const saleData = {
                    productId: product.id,
                    productName: product.name,
                    quantity: quantity,
                    pricePerUnit: product.sellingPrice,
                    totalAmount: quantity * product.sellingPrice
                };
                
                await recordSale(saleData);
                const message = `Sale recorded: ${quantity} ${product.name} for ₹${saleData.totalAmount}`;
                showToast(message);
                voiceTranscript.textContent = `✅ ${message}`;
            } else {
                const message = `Insufficient stock for ${product.name}. Available: ${product.currentStock} ${product.unit}`;
                showToast(message);
                voiceTranscript.textContent = `❌ ${message}`;
            }
        } else {
            const message = `Product not found: "${productName}". Available products: ${products.map(p => p.name).join(', ')}`;
            showToast(message);
            voiceTranscript.textContent = `❌ ${message}`;
        }
    } else {
        const message = `Command not recognized: "${transcript}". Try saying "sold 5 rice" or "sale 2 oil"`;
        showToast(message);
        voiceTranscript.textContent = `❌ ${message}`;
    }
    
    voiceStatus.textContent = '';
}

// Inventory functions
async function loadInventory() {
    const products = await getAllFromIndexedDB('products');
    const inventoryList = document.getElementById('inventoryList');
    
    if (products.length === 0) {
        inventoryList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-text">No inventory items</div>
                <div class="empty-state-subtext">Add products to track inventory</div>
            </div>
        `;
        return;
    }
    
    inventoryList.innerHTML = products.map(product => {
        const reorderPoint = calculateReorderPoint(product);
        const needsReorder = product.currentStock <= reorderPoint;
        
        return `
            <div class="inventory-item">
                <div class="inventory-info">
                    <div class="inventory-name">${product.name}</div>
                    <div class="inventory-meta">
                        ${product.category} • Min: ${product.minStock} ${product.unit}
                    </div>
                </div>
                <div class="inventory-stock">
                    <div class="inventory-quantity">${product.currentStock} ${product.unit}</div>
                    ${needsReorder ? '<div class="reorder-suggestion">Reorder needed</div>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

function calculateReorderPoint(product) {
    // Simple reorder calculation: (Daily Sales × Lead Time) + Safety Stock
    const dailySales = 2; // Simplified assumption
    const leadTime = 7; // 7 days
    const safetyStock = product.minStock;
    
    return (dailySales * leadTime) + safetyStock;
}

// Enhanced Analytics functions
async function loadAnalytics() {
    const sales = await getAllFromIndexedDB('sales');
    const products = await getAllFromIndexedDB('products');
    
    // Destroy existing charts
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    charts = {};
    
    // Create all charts
    await createSalesTrendChart(sales);
    await createTopProductsChart(sales);
    await createMostSoldChart(sales);
    await createProfitChart(sales);
    await createCategoryChart(sales, products);
    await createStockChart(products);
}

async function createSalesTrendChart(sales) {
    const canvas = document.getElementById('salesTrendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Prepare data for the last 7 days
    const last7Days = [];
    const salesData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        last7Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        const daySales = sales
            .filter(sale => sale.date === dateString)
            .reduce((sum, sale) => sum + sale.totalAmount, 0);
        
        salesData.push(daySales);
    }
    
    charts.salesTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Sales (₹)',
                data: salesData,
                borderColor: 'rgb(33, 128, 141)',
                backgroundColor: 'rgba(33, 128, 141, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(33, 128, 141)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            }
        }
    });
}

async function createTopProductsChart(sales) {
    const canvas = document.getElementById('topProductsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Calculate top products by revenue
    const productRevenue = {};
    sales.forEach(sale => {
        if (!productRevenue[sale.productName]) {
            productRevenue[sale.productName] = 0;
        }
        productRevenue[sale.productName] += sale.totalAmount;
    });
    
    const topProducts = Object.entries(productRevenue)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const labels = topProducts.map(item => item[0]);
    const data = topProducts.map(item => item[1]);
    
    charts.topProducts = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(33, 128, 141, 0.8)',
                    'rgba(168, 75, 47, 0.8)',
                    'rgba(50, 184, 198, 0.8)',
                    'rgba(255, 84, 89, 0.8)',
                    'rgba(230, 129, 97, 0.8)'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

async function createMostSoldChart(sales) {
    const canvas = document.getElementById('mostSoldChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Calculate most sold items by quantity
    const productQuantity = {};
    sales.forEach(sale => {
        if (!productQuantity[sale.productName]) {
            productQuantity[sale.productName] = 0;
        }
        productQuantity[sale.productName] += sale.quantity;
    });
    
    const mostSold = Object.entries(productQuantity)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const labels = mostSold.map(item => item[0]);
    const data = mostSold.map(item => item[1]);
    
    charts.mostSold = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantity Sold',
                data: data,
                backgroundColor: 'rgba(33, 128, 141, 0.8)',
                borderColor: 'rgb(33, 128, 141)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function createProfitChart(sales) {
    const canvas = document.getElementById('profitChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Calculate profit by product
    const productProfit = {};
    sales.forEach(sale => {
        if (!productProfit[sale.productName]) {
            productProfit[sale.productName] = 0;
        }
        const profit = (sale.pricePerUnit - (sale.costPrice || 0)) * sale.quantity;
        productProfit[sale.productName] += profit;
    });
    
    const topProfitProducts = Object.entries(productProfit)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const labels = topProfitProducts.map(item => item[0]);
    const data = topProfitProducts.map(item => item[1]);
    
    charts.profit = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Profit (₹)',
                data: data,
                backgroundColor: 'rgba(168, 75, 47, 0.8)',
                borderColor: 'rgb(168, 75, 47)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            }
        }
    });
}

async function createCategoryChart(sales, products) {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Calculate sales by category
    const categoryRevenue = {};
    sales.forEach(sale => {
        const product = products.find(p => p.id === sale.productId);
        const category = product ? product.category : 'Unknown';
        
        if (!categoryRevenue[category]) {
            categoryRevenue[category] = 0;
        }
        categoryRevenue[category] += sale.totalAmount;
    });
    
    const labels = Object.keys(categoryRevenue);
    const data = Object.values(categoryRevenue);
    
    charts.category = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(33, 128, 141, 0.6)',
                    'rgba(168, 75, 47, 0.6)',
                    'rgba(50, 184, 198, 0.6)',
                    'rgba(255, 84, 89, 0.6)',
                    'rgba(230, 129, 97, 0.6)',
                    'rgba(98, 108, 113, 0.6)'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

async function createStockChart(products) {
    const canvas = document.getElementById('stockChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Categorize products by stock status
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    
    products.forEach(product => {
        if (product.currentStock === 0) {
            outOfStock++;
        } else if (product.currentStock <= product.minStock) {
            lowStock++;
        } else {
            inStock++;
        }
    });
    
    charts.stock = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['In Stock', 'Low Stock', 'Out of Stock'],
            datasets: [{
                data: [inStock, lowStock, outOfStock],
                backgroundColor: [
                    'rgba(33, 128, 141, 0.8)',
                    'rgba(230, 129, 97, 0.8)',
                    'rgba(255, 84, 89, 0.8)'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Utility functions
function updateConnectionStatus() {
    const statusElement = document.getElementById('connectionStatus');
    if (navigator.onLine) {
        statusElement.textContent = translate('online');
        statusElement.className = 'status status--success';
    } else {
        statusElement.textContent = translate('offline');
        statusElement.className = 'status status--warning';
    }
}

async function updateProductSelect() {
    const products = await getAllFromIndexedDB('products');
    const select = document.getElementById('saleProductSelect');
    
    if (select) {
        select.innerHTML = `<option value="">${translate('selectProduct')}</option>` +
            products.map(product => `
                <option value="${product.id}" data-price="${product.sellingPrice}">
                    ${product.name} (₹${product.sellingPrice})
                </option>
            `).join('');
    }
}

function populateCategories() {
    const categorySelect = document.getElementById('productCategoryInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    const categoryOptions = categories.map(category => 
        `<option value="${category}">${category}</option>`
    ).join('');
    
    if (categorySelect) {
        categorySelect.innerHTML = `<option value="">${translate('selectCategory')}</option>` + categoryOptions;
    }
    
    if (categoryFilter) {
        categoryFilter.innerHTML = '<option value="">All Categories</option>' + categoryOptions;
    }
}

// Initialize sample data
async function initializeSampleData() {
    const existingProducts = await getAllFromIndexedDB('products');
    const existingSales = await getAllFromIndexedDB('sales');
    
    if (existingProducts.length === 0) {
        for (const product of sampleProducts) {
            await saveToIndexedDB('products', product);
        }
    }
    
    if (existingSales.length === 0) {
        for (const sale of sampleSales) {
            await saveToIndexedDB('sales', sale);
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await initDB();
        await initializeSampleData();
        
        // Check if user is already logged in
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            document.getElementById('headerStoreName').textContent = currentUser.storeName;
            document.getElementById('storeNameInput').value = currentUser.storeName;
            document.getElementById('ownerNameInput').value = currentUser.ownerName;
            hideLogin();
        } else {
            showLogin();
        }
        
        // Initialize theme
        initTheme();
        
        // Initialize voice recognition
        initVoiceRecognition();
        
        // Login form
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const storeName = document.getElementById('storeNameLogin').value;
            const ownerName = document.getElementById('ownerNameLogin').value;
            handleLogin(storeName, ownerName);
        });
        
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                handleLogout();
            }
        });
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', toggleTheme);
        
        // Theme select
        document.getElementById('themeSelect').addEventListener('change', function() {
            currentTheme = this.value;
            localStorage.setItem('theme', currentTheme);
            applyTheme(currentTheme);
        });
        
        // Language select
        document.getElementById('languageSelect').addEventListener('change', function() {
            currentLanguage = this.value;
            updateLanguage();
            if (recognition) {
                recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'te' ? 'te-IN' : 'en-US';
            }
        });
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                const section = this.dataset.section;
                showSection(section);
            });
        });
        
        // Add product button
        document.getElementById('addProductBtn').addEventListener('click', function() {
            document.getElementById('addProductForm').reset();
            delete document.getElementById('addProductForm').dataset.editId;
            populateCategories();
            showModal('addProductModal');
        });
        
        // Add product form
        document.getElementById('addProductForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const productData = {
                name: document.getElementById('productNameInput').value,
                category: document.getElementById('productCategoryInput').value,
                costPrice: parseFloat(document.getElementById('costPriceInput').value),
                sellingPrice: parseFloat(document.getElementById('sellingPriceInput').value),
                currentStock: parseInt(document.getElementById('quantityInput').value),
                unit: document.getElementById('unitInput').value,
                minStock: parseInt(document.getElementById('minStockInput').value)
            };
            
            const editId = this.dataset.editId;
            if (editId) {
                productData.id = editId;
                await saveToIndexedDB('products', productData);
                showToast('Product updated successfully');
            } else {
                await addProduct(productData);
            }
            
            hideModal('addProductModal');
            loadProducts();
            updateProductSelect();
        });
        
        // Quick sale button
        document.getElementById('quickSaleBtn').addEventListener('click', async function() {
            await updateProductSelect();
            showModal('quickSaleModal');
        });
        
        // FAB button
        document.getElementById('fabBtn').addEventListener('click', async function() {
            await updateProductSelect();
            showModal('quickSaleModal');
        });
        
        // Quick sale form
        document.getElementById('quickSaleForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const productId = document.getElementById('saleProductSelect').value;
            const quantity = parseInt(document.getElementById('saleQuantityInput').value);
            
            if (!productId || !quantity) {
                showToast('Please select product and quantity');
                return;
            }
            
            const product = await getFromIndexedDB('products', productId);
            if (!product) {
                showToast('Product not found');
                return;
            }
            
            if (product.currentStock < quantity) {
                showToast('Insufficient stock');
                return;
            }
            
            const saleData = {
                productId: productId,
                productName: product.name,
                quantity: quantity,
                pricePerUnit: product.sellingPrice,
                totalAmount: quantity * product.sellingPrice
            };
            
            await recordSale(saleData);
            hideModal('quickSaleModal');
            this.reset();
        });
        
        // Sale product select change
        document.getElementById('saleProductSelect').addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const price = selectedOption.dataset.price;
            const quantity = document.getElementById('saleQuantityInput').value;
            
            if (price && quantity) {
                document.getElementById('totalAmountInput').value = price * quantity;
            }
        });
        
        // Sale quantity input change
        document.getElementById('saleQuantityInput').addEventListener('input', function() {
            const productSelect = document.getElementById('saleProductSelect');
            const selectedOption = productSelect.options[productSelect.selectedIndex];
            const price = selectedOption.dataset.price;
            
            if (price && this.value) {
                document.getElementById('totalAmountInput').value = price * this.value;
            }
        });
        
        // Voice input button
        document.getElementById('voiceInputBtn').addEventListener('click', function() {
            startVoiceRecognition();
        });
        
        // Voice search button
        document.getElementById('voiceSearchBtn').addEventListener('click', function() {
            showToast('Voice search feature coming soon');
        });
        
        // Modal close buttons
        document.querySelectorAll('.modal-close, [data-dismiss="modal"]').forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    hideModal(modal.id);
                }
            });
        });
        
        // Toast close button
        document.querySelector('.toast-close').addEventListener('click', function() {
            document.getElementById('toast').classList.remove('show');
        });
        
        // Product search
        document.getElementById('productSearch').addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const productCards = document.querySelectorAll('.product-card');
            
            productCards.forEach(card => {
                const productName = card.querySelector('.product-name').textContent.toLowerCase();
                if (productName.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
        
        // Store info save
        document.getElementById('saveStoreInfo').addEventListener('click', function() {
            const storeName = document.getElementById('storeNameInput').value;
            const ownerName = document.getElementById('ownerNameInput').value;
            
            if (currentUser) {
                currentUser.storeName = storeName;
                currentUser.ownerName = ownerName;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                document.getElementById('headerStoreName').textContent = storeName;
                showToast('Store information updated successfully');
            }
        });
        
        // Connection status
        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);
        
        // System theme change detection
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (currentTheme === 'auto') {
                applyTheme('auto');
            }
        });
        
        // Initialize app
        populateCategories();
        await updateProductSelect();
        updateConnectionStatus();
        updateLanguage();
        
        // Only show dashboard if user is logged in
        if (currentUser) {
            showSection('dashboard');
        }
        
    } catch (error) {
        console.error('Error initializing app:', error);
        showToast('Error initializing app. Please refresh the page.');
    }
});

// Export functions for global access
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.showModal = showModal;
window.hideModal = hideModal;
