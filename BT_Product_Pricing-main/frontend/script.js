// Credexa Product Pricing Management System - Advanced JavaScript

// Application State Management
const AppState = {
    currentPage: 'dashboard',
    currentCurrency: 'INR',
    currencyRates: {
        INR: { symbol: '₹', code: 'INR', rate: 1 },
        USD: { symbol: '$', code: 'USD', rate: 83.5 },
        JPY: { symbol: '¥', code: 'JPY', rate: 0.56 }
    },
    data: {
        products: [],
        roles: [],
        charges: [],
        businessRules: [],
        transactionTypes: []
    },
    pagination: {
        products: { current: 1, total: 1, pageSize: 10 },
        roles: { current: 1, total: 1, pageSize: 10 },
        charges: { current: 1, total: 1, pageSize: 10 },
        businessRules: { current: 1, total: 1, pageSize: 10 },
        transactionTypes: { current: 1, total: 1, pageSize: 10 }
    },
    sort: {
        products: { field: 'id', direction: 'asc' },
        roles: { field: 'id', direction: 'asc' },
        charges: { field: 'id', direction: 'asc' },
        businessRules: { field: 'id', direction: 'asc' },
        transactionTypes: { field: 'id', direction: 'asc' }
    },
    filters: {
        products: { search: '', category: '', status: '' },
        roles: { search: '', status: '' },
        charges: { search: '', type: '' },
        businessRules: { search: '' },
        transactionTypes: { search: '', category: '' }
    },
    notifications: [],
    charts: {},
    realTimeUpdates: true
};

// API Configuration
const API_CONFIG = {
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Currency Management
class CurrencyManager {
    constructor() {
        this.currentCurrency = 'INR';
        this.rates = {
            INR: { symbol: '₹', code: 'INR', rate: 1, name: 'Indian Rupee' },
            USD: { symbol: '$', code: 'USD', rate: 83.5, name: 'US Dollar' },
            JPY: { symbol: '¥', code: 'JPY', rate: 0.56, name: 'Japanese Yen' }
        };
    }

    convert(amount, fromCurrency = 'INR', toCurrency = this.currentCurrency) {
        if (fromCurrency === toCurrency) return amount;
        const fromRate = this.rates[fromCurrency]?.rate || 1;
        const toRate = this.rates[toCurrency]?.rate || 1;
        return (amount / fromRate) * toRate;
    }

    format(amount, currency = this.currentCurrency) {
        const currencyInfo = this.rates[currency];
        const convertedAmount = this.convert(amount, 'INR', currency);
        
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: currency === 'JPY' ? 0 : 2,
            maximumFractionDigits: currency === 'JPY' ? 0 : 2
        }).format(convertedAmount).replace(currency, currencyInfo.symbol);
    }

    getSymbol(currency = this.currentCurrency) {
        return this.rates[currency]?.symbol || '₹';
    }

    setCurrency(currency) {
        this.currentCurrency = currency;
        AppState.currentCurrency = currency;
        this.updateCurrencyDisplay();
        this.updateAllPriceDisplays();
    }

    updateCurrencyDisplay() {
        const selector = document.getElementById('currencySelector');
        if (selector) {
            selector.value = this.currentCurrency;
        }
    }

    updateAllPriceDisplays() {
        // Update dashboard stats
        this.updateDashboardPrices();
        // Update table prices
        this.updateTablePrices();
        // Update modal prices
        this.updateModalPrices();
    }

    updateDashboardPrices() {
        const avgPriceElement = document.getElementById('avgPrice');
        if (avgPriceElement) {
            const currentPrice = avgPriceElement.textContent.replace(/[^\d.]/g, '');
            if (currentPrice) {
                avgPriceElement.textContent = this.format(parseFloat(currentPrice));
            }
        }
    }

    updateTablePrices() {
        document.querySelectorAll('.price-cell').forEach(cell => {
            const amount = parseFloat(cell.dataset.amount);
            if (!isNaN(amount)) {
                cell.textContent = this.format(amount);
            }
        });
    }

    updateModalPrices() {
        // Update any price inputs in modals
        document.querySelectorAll('input[data-price]').forEach(input => {
            const amount = parseFloat(input.value);
            if (!isNaN(amount)) {
                input.placeholder = this.format(amount);
            }
        });
    }
}

// API Service
class APIService {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
        this.timeout = API_CONFIG.timeout;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            timeout: this.timeout,
            headers: { ...API_CONFIG.headers, ...options.headers },
            ...options
        };

        try {
            const response = await axios(url, config);
            return response.data;
        } catch (error) {
            console.error(`API Error for ${endpoint}:`, error);
            throw this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response) {
            return {
                message: error.response.data?.message || 'Server error occurred',
                status: error.response.status,
                data: error.response.data
            };
        } else if (error.request) {
            return {
                message: 'Network error - please check your connection',
                status: 0,
                data: null
            };
        } else {
            return {
                message: 'Request failed',
                status: 0,
                data: null
            };
        }
    }

    // Products API
    async getProducts(params = {}) {
        return this.request('/products', { params });
    }

    async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    async createProduct(data) {
        return this.request('/products', {
            method: 'POST',
            data
        });
    }

    async updateProduct(id, data) {
        return this.request(`/products/${id}`, {
            method: 'PUT',
            data
        });
    }

    async deleteProduct(id) {
        return this.request(`/products/${id}`, {
            method: 'DELETE'
        });
    }

    // Roles API
    async getRoles(params = {}) {
        return this.request('/roles', { params });
    }

    async createRole(data) {
        return this.request('/roles', {
            method: 'POST',
            data
        });
    }

    async updateRole(id, data) {
        return this.request(`/roles/${id}`, {
            method: 'PUT',
            data
        });
    }

    async deleteRole(id) {
        return this.request(`/roles/${id}`, {
            method: 'DELETE'
        });
    }

    // Charges API
    async getCharges(params = {}) {
        return this.request('/charges', { params });
    }

    async createCharge(data) {
        return this.request('/charges', {
            method: 'POST',
            data
        });
    }

    async updateCharge(id, data) {
        return this.request(`/charges/${id}`, {
            method: 'PUT',
            data
        });
    }

    async deleteCharge(id) {
        return this.request(`/charges/${id}`, {
            method: 'DELETE'
        });
    }

    // Business Rules API
    async getBusinessRules(params = {}) {
        return this.request('/business-rules', { params });
    }

    async createBusinessRule(data) {
        return this.request('/business-rules', {
            method: 'POST',
            data
        });
    }

    async updateBusinessRule(id, data) {
        return this.request(`/business-rules/${id}`, {
            method: 'PUT',
            data
        });
    }

    async deleteBusinessRule(id) {
        return this.request(`/business-rules/${id}`, {
            method: 'DELETE'
        });
    }

    // Transaction Types API
    async getTransactionTypes(params = {}) {
        return this.request('/transaction-types', { params });
    }

    async createTransactionType(data) {
        return this.request('/transaction-types', {
            method: 'POST',
            data
        });
    }

    async updateTransactionType(id, data) {
        return this.request(`/transaction-types/${id}`, {
            method: 'PUT',
            data
        });
    }

    async deleteTransactionType(id) {
        return this.request(`/transaction-types/${id}`, {
            method: 'DELETE'
        });
    }

    // Dashboard API
    async getDashboardStats() {
        return this.request('/dashboard/stats');
    }

    async getRecentActivity() {
        return this.request('/dashboard/activity');
    }
}

// Chart Manager
class ChartManager {
    constructor() {
        this.charts = {};
        this.colors = {
            primary: '#4a70e0',
            success: '#28a745',
            warning: '#ffc107',
            danger: '#dc3545',
            info: '#17a2b8',
            gradient: {
                primary: 'linear-gradient(135deg, #4a70e0 0%, #1a2b6b 100%)',
                success: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                warning: 'linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)'
            }
        };
    }

    createRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        this.charts.revenue = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateDateLabels(7),
                datasets: [{
                    label: 'Revenue',
                    data: this.generateRevenueData(7),
                    borderColor: this.colors.primary,
                    backgroundColor: `${this.colors.primary}20`,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: this.colors.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: this.colors.primary,
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6c757d',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        display: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#6c757d',
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return currencyManager.format(value);
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                elements: {
                    point: {
                        hoverBackgroundColor: this.colors.primary
                    }
                }
            }
        });
    }

    createProductChart() {
        const ctx = document.getElementById('productChart');
        if (!ctx) return;

        this.charts.products = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['FD Products', 'Savings', 'Current', 'Loans', 'Insurance'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        this.colors.primary,
                        this.colors.success,
                        this.colors.warning,
                        this.colors.danger,
                        this.colors.info
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                cutout: '60%',
                elements: {
                    arc: {
                        borderWidth: 0
                    }
                }
            }
        });
    }

    updateCharts() {
        if (this.charts.revenue) {
            this.charts.revenue.update();
        }
        if (this.charts.products) {
            this.charts.products.update();
        }
    }

    generateDateLabels(days) {
        const labels = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
        }
        return labels;
    }

    generateRevenueData(days) {
        const data = [];
        let baseRevenue = 100000;
        for (let i = 0; i < days; i++) {
            baseRevenue += (Math.random() - 0.5) * 20000;
            data.push(Math.max(50000, baseRevenue));
        }
        return data;
    }

    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
}

// Notification Manager
class NotificationManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        this.createContainer();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            z-index: 9999;
            max-width: 400px;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.container.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);

        return notification;
    }

    getIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Real-time Updates Manager
class RealTimeManager {
    constructor() {
        this.isEnabled = true;
        this.intervals = {};
        this.init();
    }

    init() {
        if (this.isEnabled) {
            this.startDashboardUpdates();
            this.startActivityUpdates();
        }
    }

    startDashboardUpdates() {
        this.intervals.dashboard = setInterval(() => {
            if (AppState.currentPage === 'dashboard') {
                this.updateDashboardStats();
            }
        }, 30000); // Update every 30 seconds
    }

    startActivityUpdates() {
        this.intervals.activity = setInterval(() => {
            this.updateRecentActivity();
        }, 60000); // Update every minute
    }

    async updateDashboardStats() {
        try {
            const stats = await apiService.getDashboardStats();
            this.updateStatsDisplay(stats);
        } catch (error) {
            console.warn('Failed to update dashboard stats:', error);
        }
    }

    async updateRecentActivity() {
        try {
            const activity = await apiService.getRecentActivity();
            this.updateActivityDisplay(activity);
        } catch (error) {
            console.warn('Failed to update recent activity:', error);
        }
    }

    updateStatsDisplay(stats) {
        // Update dashboard statistics with animation
        Object.keys(stats).forEach(key => {
            const element = document.getElementById(`${key}Count`);
            if (element) {
                this.animateNumber(element, parseInt(element.textContent), stats[key]);
            }
        });
    }

    updateActivityDisplay(activity) {
        const container = document.getElementById('activityList');
        if (!container || !activity.length) return;

        container.innerHTML = activity.map(item => `
            <div class="activity-item">
                <div class="activity-icon" style="background: ${this.getActivityColor(item.type)}">
                    <i class="fas fa-${this.getActivityIcon(item.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${item.message}</div>
                    <div class="activity-time">${this.formatTime(item.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    getActivityColor(type) {
        const colors = {
            create: '#28a745',
            update: '#ffc107',
            delete: '#dc3545',
            login: '#17a2b8',
            system: '#6c757d'
        };
        return colors[type] || '#6c757d';
    }

    getActivityIcon(type) {
        const icons = {
            create: 'plus',
            update: 'edit',
            delete: 'trash',
            login: 'sign-in-alt',
            system: 'cog'
        };
        return icons[type] || 'info';
    }

    formatTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return time.toLocaleDateString();
    }

    animateNumber(element, start, end, duration = 1000) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    stop() {
        Object.values(this.intervals).forEach(interval => clearInterval(interval));
        this.intervals = {};
    }

    start() {
        this.isEnabled = true;
        this.init();
    }
}

// Global instances
const currencyManager = new CurrencyManager();
const apiService = new APIService();
const chartManager = new ChartManager();
const notificationManager = new NotificationManager();
const realTimeManager = new RealTimeManager();

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Credexa Product Pricing Management System');
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
    
    // Initialize theme before app to avoid FOUC
    initTheme();
    initializeApp();
    setupEventListeners();
    loadInitialData();
});

// Initialize Application
async function initializeApp() {
    try {
        // Set active page
        showPage('dashboard');
        
        // Initialize navigation
        initializeNavigation();
        
        // Setup mobile menu
        setupMobileMenu();
        
        // Initialize currency selector
        setupCurrencySelector();
        
        // Initialize search and filters
        setupSearchAndFilters();
        
        // Load initial data
        await loadDashboardData();
        
        // Initialize charts
        setTimeout(() => {
            chartManager.createRevenueChart();
            chartManager.createProductChart();
        }, 1000);
        
        console.log('✅ Application initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
        notificationManager.error('Failed to initialize application');
    }
}

// Navigation Management
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            showPage(page);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Update breadcrumb
            updateBreadcrumb(page);
            
            // Close mobile menu if open
            closeMobileMenu();
        });
    });
}

// Page Management
async function showPage(pageId) {
    try {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show selected page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            AppState.currentPage = pageId;
            
            // Load page-specific data
            await loadPageData(pageId);
            
            console.log(`📄 Switched to ${pageId} page`);
        }
    } catch (error) {
        console.error(`Failed to switch to ${pageId} page:`, error);
        notificationManager.error(`Failed to load ${pageId} page`);
    }
}

// Load page-specific data
async function loadPageData(pageId) {
    showLoading(true);
    
    try {
        switch(pageId) {
            case 'products':
                await loadProductsData();
                break;
            case 'roles':
                await loadRolesData();
                break;
            case 'charges':
                await loadChargesData();
                break;
            case 'business-rules':
                await loadBusinessRulesData();
                break;
            case 'transaction-types':
                await loadTransactionTypesData();
                break;
            case 'dashboard':
                await loadDashboardData();
                break;
        }
    } catch (error) {
        console.error(`Error loading ${pageId} data:`, error);
        notificationManager.error(`Error loading ${pageId} data`);
    } finally {
        showLoading(false);
    }
}

// Mobile Menu Setup
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

function closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('open');
}

// Currency Selector Setup
function setupCurrencySelector() {
    const selector = document.getElementById('currencySelector');
    if (selector) {
        selector.addEventListener('change', function() {
            const selectedCurrency = this.value;
            currencyManager.setCurrency(selectedCurrency);
            notificationManager.info(`Currency changed to ${selectedCurrency}`);
        });
    }
}

// Search and Filters Setup
function setupSearchAndFilters() {
    // Product search
    const productSearch = document.getElementById('productSearch');
    if (productSearch) {
        productSearch.addEventListener('input', debounce(function() {
            AppState.filters.products.search = this.value;
            filterProducts();
        }, 300));
    }
    
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            AppState.filters.products.category = this.value;
            filterProducts();
        });
    }
    
    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            AppState.filters.products.status = this.value;
            filterProducts();
        });
    }
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        const firstInput = modal.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Reset form
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        event.target.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// Data Loading Functions
async function loadDashboardData() {
    try {
        const [stats, activity] = await Promise.all([
            apiService.getDashboardStats().catch(() => getSampleStats()),
            apiService.getRecentActivity().catch(() => getSampleActivity())
        ]);
        
        updateDashboardStats(stats);
        updateRecentActivity(activity);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Fallback to sample data
        updateDashboardStats(getSampleStats());
        updateRecentActivity(getSampleActivity());
    }
}

async function loadProductsData() {
    try {
        const products = await apiService.getProducts().catch(() => getSampleData('/products'));
        AppState.data.products = products;
        renderProductsTable(products);
        updateProductsSummary(products);
    } catch (error) {
        console.error('Error loading products:', error);
        notificationManager.error('Error loading products');
    }
}

async function loadRolesData() {
    try {
        const roles = await apiService.getRoles().catch(() => getSampleData('/roles'));
        AppState.data.roles = roles;
        renderRolesTable(roles);
    } catch (error) {
        console.error('Error loading roles:', error);
        notificationManager.error('Error loading roles');
    }
}

async function loadChargesData() {
    try {
        const charges = await apiService.getCharges().catch(() => getSampleData('/charges'));
        AppState.data.charges = charges;
        renderChargesTable(charges);
    } catch (error) {
        console.error('Error loading charges:', error);
        notificationManager.error('Error loading charges');
    }
}

async function loadBusinessRulesData() {
    try {
        const rules = await apiService.getBusinessRules().catch(() => getSampleData('/business-rules'));
        AppState.data.businessRules = rules;
        renderBusinessRulesTable(rules);
    } catch (error) {
        console.error('Error loading business rules:', error);
        notificationManager.error('Error loading business rules');
    }
}

async function loadTransactionTypesData() {
    try {
        const transactions = await apiService.getTransactionTypes().catch(() => getSampleData('/transaction-types'));
        AppState.data.transactionTypes = transactions;
        renderTransactionTypesTable(transactions);
    } catch (error) {
        console.error('Error loading transaction types:', error);
        notificationManager.error('Error loading transaction types');
    }
}

// Sample Data Functions
function getSampleStats() {
    return {
        products: 6,
        roles: 15,
        charges: 2,
        rules: 1,
        transactions: 4,
        revenue: 1250000
    };
}

function getSampleActivity() {
    return [
        {
            type: 'create',
            message: 'New product "Premium FD" created',
            timestamp: new Date(Date.now() - 5 * 60000).toISOString()
        },
        {
            type: 'update',
            message: 'Role "Manager" permissions updated',
            timestamp: new Date(Date.now() - 15 * 60000).toISOString()
        },
        {
            type: 'system',
            message: 'System backup completed successfully',
            timestamp: new Date(Date.now() - 30 * 60000).toISOString()
        },
        {
            type: 'create',
            message: 'New charge "Processing Fee" added',
            timestamp: new Date(Date.now() - 45 * 60000).toISOString()
        },
        {
            type: 'update',
            message: 'Business rule "Volume Discount" modified',
            timestamp: new Date(Date.now() - 60 * 60000).toISOString()
        }
    ];
}

function getSampleData(endpoint) {
    const sampleData = {
        '/products': [
            { productId: 1, productCode: 'FD001', productName: 'Premium FD', productType: 'FD', effectiveDate: '2024-01-01', expiryDate: '2025-01-01', branch: 'MUMBAI', currency: 'INR', status: 'ACTIVE', description: 'Premium Fixed Deposit with competitive rates' },
            { productId: 2, productCode: 'FD002', productName: 'TaxShield FD', productType: 'FD', effectiveDate: '2024-01-01', expiryDate: '2025-01-01', branch: 'DELHI', currency: 'INR', status: 'ACTIVE', description: 'Tax-saving Fixed Deposit' },
            { productId: 3, productCode: 'FD003', productName: 'FlexiGain FD', productType: 'FD', effectiveDate: '2024-01-01', expiryDate: '2025-01-01', branch: 'BANGALORE', currency: 'INR', status: 'ACTIVE', description: 'Flexible Fixed Deposit with sweep facility' },
            { productId: 4, productCode: 'FD004', productName: 'StepUp FD', productType: 'FD', effectiveDate: '2024-01-01', expiryDate: '2025-01-01', branch: 'CHENNAI', currency: 'INR', status: 'ACTIVE', description: 'Step-up interest rate Fixed Deposit' },
            { productId: 5, productCode: 'FD005', productName: 'GlobalConnect FD', productType: 'FD', effectiveDate: '2024-01-01', expiryDate: '2025-01-01', branch: 'MUMBAI', currency: 'USD', status: 'ACTIVE', description: 'Multi-currency Fixed Deposit' },
            { productId: 6, productCode: 'SAV001', productName: 'Premium Savings', productType: 'SAVINGS', effectiveDate: '2024-01-01', branch: 'ALL', currency: 'INR', status: 'INACTIVE', description: 'Premium Savings Account' }
        ],
        '/roles': [
            { roleId: 1, roleName: 'Admin', description: 'Full system access', permissions: ['read', 'write', 'delete', 'admin'], status: 'ACTIVE' },
            { roleId: 2, roleName: 'Manager', description: 'Management level access', permissions: ['read', 'write'], status: 'ACTIVE' },
            { roleId: 3, roleName: 'Analyst', description: 'Read-only access with reporting', permissions: ['read'], status: 'ACTIVE' }
        ],
        '/charges': [
            { chargeId: 1, chargeName: 'Processing Fee', chargeType: 'PERCENTAGE', chargeAmount: 2.5, status: 'ACTIVE' },
            { chargeId: 2, chargeName: 'Fixed Fee', chargeType: 'FIXED', chargeAmount: 0.50, status: 'ACTIVE' }
        ],
        '/business-rules': [
            { ruleId: 1, ruleName: 'Volume Discount', condition: 'quantity > 100', action: 'apply 10% discount', priority: 1 }
        ],
        '/transaction-types': [
            { txnTypeId: 1, txnName: 'Credit Card', description: 'Credit card payments', category: 'PAYMENT', status: 'ACTIVE' },
            { txnTypeId: 2, txnName: 'Bank Transfer', description: 'Direct bank transfers', category: 'PAYMENT', status: 'ACTIVE' },
            { txnTypeId: 3, txnName: 'Refund', description: 'Payment refunds', category: 'ADJUSTMENT', status: 'ACTIVE' },
            { txnTypeId: 4, txnName: 'Chargeback', description: 'Disputed transactions', category: 'ADJUSTMENT', status: 'ACTIVE' }
        ]
    };
    
    return sampleData[endpoint] || [];
}

// Table Rendering Functions
function renderProductsTable(products) {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    const filteredProducts = filterProductsData(products);
    
    tbody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td>
                <input type="checkbox" class="product-checkbox" data-id="${product.productId}">
            </td>
            <td>${product.productId}</td>
            <td>
                <div class="product-name">
                    <strong>${product.productName}</strong>
                    <small class="product-code">${product.productCode}</small>
                </div>
            </td>
            <td><span class="status-badge status-active">${product.productType}</span></td>
            <td class="price-cell" data-amount="0">-</td>
            <td><span class="status-badge ${product.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}">${product.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary btn-icon" onclick="editProduct(${product.productId})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-info btn-icon" onclick="viewProduct(${product.productId})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-icon" onclick="deleteProduct(${product.productId})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updatePagination('products', filteredProducts.length);
}

function renderRolesTable(roles) {
    const tbody = document.getElementById('rolesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = roles.map(role => `
        <tr>
            <td>${role.roleId}</td>
            <td><strong>${role.roleName}</strong></td>
            <td>${role.description}</td>
            <td>
                <div class="permissions">
                    ${role.permissions.map(perm => `<span class="permission-badge">${perm}</span>`).join('')}
                </div>
            </td>
            <td><span class="status-badge ${role.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}">${role.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary btn-icon" onclick="editRole(${role.roleId})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-icon" onclick="deleteRole(${role.roleId})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderChargesTable(charges) {
    const tbody = document.getElementById('chargesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = charges.map(charge => `
        <tr>
            <td>${charge.chargeId}</td>
            <td><strong>${charge.chargeName}</strong></td>
            <td><span class="status-badge status-active">${charge.chargeType}</span></td>
            <td class="price-cell" data-amount="${charge.chargeAmount}">${currencyManager.format(charge.chargeAmount)}</td>
            <td><span class="status-badge ${charge.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}">${charge.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary btn-icon" onclick="editCharge(${charge.chargeId})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-icon" onclick="deleteCharge(${charge.chargeId})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderBusinessRulesTable(rules) {
    const tbody = document.getElementById('rulesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = rules.map(rule => `
        <tr>
            <td>${rule.ruleId}</td>
            <td><strong>${rule.ruleName}</strong></td>
            <td><code class="rule-condition">${rule.condition}</code></td>
            <td>${rule.action}</td>
            <td><span class="status-badge status-active">${rule.priority}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary btn-icon" onclick="editRule(${rule.ruleId})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-icon" onclick="deleteRule(${rule.ruleId})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderTransactionTypesTable(transactions) {
    const tbody = document.getElementById('transactionsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = transactions.map(transaction => `
        <tr>
            <td>${transaction.txnTypeId}</td>
            <td><strong>${transaction.txnName}</strong></td>
            <td>${transaction.description}</td>
            <td><span class="status-badge status-active">${transaction.category}</span></td>
            <td><span class="status-badge ${transaction.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}">${transaction.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary btn-icon" onclick="editTransactionType(${transaction.txnTypeId})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-icon" onclick="deleteTransactionType(${transaction.txnTypeId})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Dashboard Updates
function updateDashboardStats(stats) {
    const statElements = {
        products: document.getElementById('productsCount'),
        roles: document.getElementById('rolesCount'),
        charges: document.getElementById('chargesCount'),
        rules: document.getElementById('rulesCount'),
        transactions: document.getElementById('transactionsCount'),
        reports: document.getElementById('reportsCount')
    };
    
    Object.keys(stats).forEach(key => {
        const element = statElements[key];
        if (element) {
            animateNumber(element, parseInt(element.textContent) || 0, stats[key]);
        }
    });
}

function updateRecentActivity(activity) {
    const container = document.getElementById('activityList');
    if (!container) return;
    
    container.innerHTML = activity.map(item => `
        <div class="activity-item">
            <div class="activity-icon" style="background: ${getActivityColor(item.type)}">
                <i class="fas fa-${getActivityIcon(item.type)}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-text">${item.message}</div>
                <div class="activity-time">${formatTime(item.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

function updateProductsSummary(products) {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'ACTIVE').length;
    const avgPrice = 2450; // Sample average price
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('activeProducts').textContent = activeProducts;
    document.getElementById('avgPrice').textContent = currencyManager.format(avgPrice);
}

// Utility Functions
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.toggle('show', show);
    }
}

function animateNumber(element, start, end, duration = 1000) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

function updateBreadcrumb(pageId) {
    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
        const pageNames = {
            dashboard: 'Dashboard',
            products: 'Products',
            roles: 'Roles',
            charges: 'Charges',
            'business-rules': 'Business Rules',
            'transaction-types': 'Transaction Types'
        };
        
        breadcrumb.innerHTML = `
            <span class="breadcrumb-item">Dashboard</span>
            <i class="fas fa-chevron-right"></i>
            <span class="breadcrumb-item active">${pageNames[pageId] || pageId}</span>
        `;
    }
}

function filterProductsData(products) {
    const filters = AppState.filters.products;
    return products.filter(product => {
        const matchesSearch = !filters.search || 
            product.productName.toLowerCase().includes(filters.search.toLowerCase()) ||
            product.productCode.toLowerCase().includes(filters.search.toLowerCase());
        
        const matchesCategory = !filters.category || product.productType === filters.category;
        const matchesStatus = !filters.status || product.status === filters.status;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
}

function filterProducts() {
    const products = AppState.data.products;
    renderProductsTable(products);
}

function updatePagination(entity, totalItems) {
    const pagination = AppState.pagination[entity];
    pagination.total = Math.ceil(totalItems / pagination.pageSize);
    
    // Update pagination display
    const startElement = document.getElementById(`${entity}Start`);
    const endElement = document.getElementById(`${entity}End`);
    const totalElement = document.getElementById(`${entity}Total`);
    
    if (startElement) startElement.textContent = ((pagination.current - 1) * pagination.pageSize) + 1;
    if (endElement) endElement.textContent = Math.min(pagination.current * pagination.pageSize, totalItems);
    if (totalElement) totalElement.textContent = totalItems;
}

function getActivityColor(type) {
    const colors = {
        create: '#28a745',
        update: '#ffc107',
        delete: '#dc3545',
        login: '#17a2b8',
        system: '#6c757d'
    };
    return colors[type] || '#6c757d';
}

function getActivityIcon(type) {
    const icons = {
        create: 'plus',
        update: 'edit',
        delete: 'trash',
        login: 'sign-in-alt',
        system: 'cog'
    };
    return icons[type] || 'info';
}

function formatTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return time.toLocaleDateString();
}

// Event Listeners Setup
function setupEventListeners() {
    // Form submissions
    document.querySelectorAll('.modal-form').forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Window events
    window.addEventListener('resize', debounce(handleWindowResize, 250));
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Theme toggle
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
}

function handleKeyboardShortcuts(event) {
    if (event.ctrlKey || event.metaKey) {
        switch(event.key) {
            case '1':
                event.preventDefault();
                showPage('dashboard');
                break;
            case '2':
                event.preventDefault();
                showPage('products');
                break;
            case '3':
                event.preventDefault();
                showPage('roles');
                break;
            case '4':
                event.preventDefault();
                showPage('charges');
                break;
            case '5':
                event.preventDefault();
                showPage('business-rules');
                break;
            case '6':
                event.preventDefault();
                showPage('transaction-types');
                break;
            case 'k':
                event.preventDefault();
                document.querySelector('.search-input')?.focus();
                break;
            case 'Escape':
                // Close any open modals
                document.querySelectorAll('.modal.show').forEach(modal => {
                    modal.style.display = 'none';
                    modal.classList.remove('show');
                });
                break;
        }
    }
}

function handleWindowResize() {
    // Update charts on resize
    chartManager.updateCharts();
}

function handleBeforeUnload(event) {
    // Save any pending changes
    realTimeManager.stop();
}

// THEME MANAGEMENT
const THEME_STORAGE_KEY = 'credexa-theme'; // 'light' | 'dark' | 'system'

function initTheme() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    applyTheme(initial);

    // React to system changes when user selected system (not stored)
    if (!stored && window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            applyTheme(e.matches ? 'dark' : 'light', false);
        });
    }
}

function applyTheme(theme, persist = true) {
    const html = document.documentElement;
    html.classList.remove('theme-dark');

    if (theme === 'dark') {
        html.classList.add('theme-dark');
    }

    updateThemeToggleIcon(theme);
    updateMetaThemeColor(theme);
    if (persist) localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('theme-dark');
    applyTheme(isDark ? 'light' : 'dark');
}

function updateThemeToggleIcon(theme) {
    const icon = document.getElementById('themeToggleIcon');
    if (!icon) return;
    icon.classList.remove('fa-moon', 'fa-sun');
    icon.classList.add(theme === 'dark' ? 'fa-sun' : 'fa-moon');
}

function updateMetaThemeColor(theme) {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    // Use existing brand colors for light, darker for dark
    meta.setAttribute('content', theme === 'dark' ? '#0f0f0f' : '#1a2b6b');
}

// Form Handling
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Determine entity type from modal ID
    const modalId = form.closest('.modal').id;
    const entityType = modalId.replace('Modal', '');
    
    showLoading(true);
    
    try {
        let result;
        switch(entityType) {
            case 'product':
                result = await apiService.createProduct(data);
                break;
            case 'role':
                result = await apiService.createRole(data);
                break;
            case 'charge':
                result = await apiService.createCharge(data);
                break;
            case 'rule':
                result = await apiService.createBusinessRule(data);
                break;
            case 'transaction':
                result = await apiService.createTransactionType(data);
                break;
        }
        
        notificationManager.success(`${entityType} created successfully!`);
        closeModal(modalId);
        
        // Refresh current page data
        await loadPageData(AppState.currentPage);
        
    } catch (error) {
        console.error(`Error creating ${entityType}:`, error);
        notificationManager.error(`Failed to create ${entityType}: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

// CRUD Operations
async function editProduct(id) {
    try {
        const product = await apiService.getProduct(id);
        // Open edit modal with product data
        notificationManager.info('Edit product functionality coming soon!');
    } catch (error) {
        notificationManager.error('Failed to load product details');
    }
}

async function viewProduct(id) {
    try {
        const product = await apiService.getProduct(id);
        // Open view modal with product data
        notificationManager.info('View product functionality coming soon!');
    } catch (error) {
        notificationManager.error('Failed to load product details');
    }
}

async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        showLoading(true);
        try {
            await apiService.deleteProduct(id);
            notificationManager.success('Product deleted successfully!');
            await loadProductsData();
        } catch (error) {
            notificationManager.error('Failed to delete product');
        } finally {
            showLoading(false);
        }
    }
}

// Similar functions for other entities
async function editRole(id) {
    notificationManager.info('Edit role functionality coming soon!');
}

async function deleteRole(id) {
    if (confirm('Are you sure you want to delete this role?')) {
        showLoading(true);
        try {
            await apiService.deleteRole(id);
            notificationManager.success('Role deleted successfully!');
            await loadRolesData();
        } catch (error) {
            notificationManager.error('Failed to delete role');
        } finally {
            showLoading(false);
        }
    }
}

async function editCharge(id) {
    notificationManager.info('Edit charge functionality coming soon!');
}

async function deleteCharge(id) {
    if (confirm('Are you sure you want to delete this charge?')) {
        showLoading(true);
        try {
            await apiService.deleteCharge(id);
            notificationManager.success('Charge deleted successfully!');
            await loadChargesData();
        } catch (error) {
            notificationManager.error('Failed to delete charge');
        } finally {
            showLoading(false);
        }
    }
}

async function editRule(id) {
    notificationManager.info('Edit rule functionality coming soon!');
}

async function deleteRule(id) {
    if (confirm('Are you sure you want to delete this rule?')) {
        showLoading(true);
        try {
            await apiService.deleteBusinessRule(id);
            notificationManager.success('Rule deleted successfully!');
            await loadBusinessRulesData();
        } catch (error) {
            notificationManager.error('Failed to delete rule');
        } finally {
            showLoading(false);
        }
    }
}

async function editTransactionType(id) {
    notificationManager.info('Edit transaction type functionality coming soon!');
}

async function deleteTransactionType(id) {
    if (confirm('Are you sure you want to delete this transaction type?')) {
        showLoading(true);
        try {
            await apiService.deleteTransactionType(id);
            notificationManager.success('Transaction type deleted successfully!');
            await loadTransactionTypesData();
        } catch (error) {
            notificationManager.error('Failed to delete transaction type');
        } finally {
            showLoading(false);
        }
    }
}

// Additional Functions
function refreshActivity() {
    loadDashboardData();
    notificationManager.info('Activity refreshed');
}

function exportData() {
    notificationManager.info('Export functionality coming soon!');
}

function showReports() {
    notificationManager.info('Reports functionality coming soon!');
}

function exportProducts() {
    notificationManager.info('Export products functionality coming soon!');
}

function refreshProducts() {
    loadProductsData();
    notificationManager.info('Products refreshed');
}

// Global Functions for HTML onclick handlers
window.showPage = showPage;
window.openModal = openModal;
window.closeModal = closeModal;
window.editProduct = editProduct;
window.viewProduct = viewProduct;
window.deleteProduct = deleteProduct;
window.editRole = editRole;
window.deleteRole = deleteRole;
window.editCharge = editCharge;
window.deleteCharge = deleteCharge;
window.editRule = editRule;
window.deleteRule = deleteRule;
window.editTransactionType = editTransactionType;
window.deleteTransactionType = deleteTransactionType;
window.refreshActivity = refreshActivity;
window.exportData = exportData;
window.showReports = showReports;
window.exportProducts = exportProducts;
window.refreshProducts = refreshProducts;

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}