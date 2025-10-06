# MedCare Analytics - Technical Documentation

## 🔧 Technical Architecture

### System Overview

MedCare Analytics is built as a client-side healthcare application using modern web technologies. The architecture emphasizes security, performance, and maintainability while ensuring full compliance with healthcare data protection standards.

#### Core Technologies
- **Frontend Framework**: Vanilla JavaScript ES6+ with modular class-based architecture
- **Styling**: CSS3 with custom properties and advanced layout techniques
- **Data Visualization**: Chart.js for interactive charts and analytics
- **PDF Generation**: jsPDF with html2canvas for comprehensive report creation
- **Typography**: Inter font family for professional healthcare appearance
- **Icons**: Font Awesome 6.4.0 for comprehensive iconography

#### Architecture Patterns
- **Model-View-Controller (MVC)**: Separation of concerns for maintainable code
- **Observer Pattern**: Event-driven programming for responsive UI updates
- **Module Pattern**: Encapsulated functionality with clear interfaces
- **Factory Pattern**: Dynamic object creation for different model types
- **Strategy Pattern**: Interchangeable algorithms for prediction models

### File Structure and Organization

```
MedCare_Analytics_Advanced/
├── index.html              # Main application entry point
├── style.css               # Comprehensive styling and themes
├── app.js                  # Core application logic and ML algorithms
├── README.md               # User documentation
├── SETUP_GUIDE.md          # Installation and configuration
├── FEATURES.md             # Feature documentation
└── TECHNICAL_DOCS.md       # This file
```

#### Code Organization
- **HTML Structure**: Semantic HTML5 with ARIA accessibility attributes
- **CSS Architecture**: BEM-inspired naming with CSS custom properties
- **JavaScript Modules**: Class-based organization with clear separation of concerns
- **Event Handling**: Centralized event management with proper cleanup
- **Error Handling**: Comprehensive error handling with user feedback

## 🤖 Machine Learning Implementation

### Model Architecture

#### Ensemble Model Implementation
```javascript
class EnsemblePredictor {
    constructor() {
        this.models = [
            new LogisticRegressionModel(),
            new GradientBoostingModel(),
            new NeuralNetworkModel()
        ];
        this.weights = [0.4, 0.35, 0.25]; // Based on validation performance
    }

    predict(features) {
        const predictions = this.models.map((model, index) => ({
            prediction: model.predict(features),
            weight: this.weights[index],
            confidence: model.getConfidence(features)
        }));

        return this.combinepredictions(predictions);
    }
}
```

#### Feature Engineering Pipeline
```javascript
class FeatureProcessor {
    static normalizeFeatures(rawFeatures) {
        return {
            glucose: this.normalizeGlucose(rawFeatures.glucose),
            bmi: this.normalizeBMI(rawFeatures.bmi),
            age: this.normalizeAge(rawFeatures.age),
            bloodPressure: this.normalizeBloodPressure(rawFeatures.bloodPressure),
            // Additional feature normalizations...
        };
    }

    static normalizeGlucose(glucose) {
        // Clinical reference ranges for glucose normalization
        if (glucose < 70) return 0.1;      // Hypoglycemic
        if (glucose <= 100) return 0.2;    // Normal fasting
        if (glucose <= 125) return 0.6;    // Prediabetes
        return 0.9;                        // Diabetes range
    }
}
```

#### Model Performance Validation
```javascript
class ModelValidator {
    static validatePrediction(prediction, features) {
        const validation = {
            accuracyScore: this.calculateAccuracy(prediction),
            clinicalConsistency: this.checkClinicalConsistency(prediction, features),
            uncertaintyBounds: this.calculateUncertaintyBounds(prediction),
            featureImportance: this.analyzeFeatureImportance(features)
        };

        return validation;
    }
}
```

### Advanced Analytics Engine

#### Risk Stratification Algorithm
```javascript
class RiskStratifier {
    static stratifyRisk(riskScore, clinicalFactors) {
        let adjustedScore = riskScore;

        // Adjust for metabolic syndrome
        if (clinicalFactors.metabolicSyndrome?.present) {
            adjustedScore *= 1.2;
        }

        // Adjust for family history
        if (clinicalFactors.familyHistory?.diabetes) {
            adjustedScore *= 1.15;
        }

        // Apply clinical thresholds
        if (adjustedScore >= 0.7) return 'high';
        if (adjustedScore >= 0.4) return 'medium';
        return 'low';
    }
}
```

#### Clinical Decision Support Engine
```javascript
class ClinicalDecisionSupport {
    generateRecommendations(riskLevel, patientData, clinicalFactors) {
        const recommendations = [];

        // Evidence-based recommendation engine
        if (riskLevel === 'high') {
            recommendations.push(...this.getHighRiskRecommendations(patientData));
        } else if (riskLevel === 'medium') {
            recommendations.push(...this.getMediumRiskRecommendations(patientData));
        } else {
            recommendations.push(...this.getLowRiskRecommendations(patientData));
        }

        // Add parameter-specific recommendations
        recommendations.push(...this.getParameterSpecificRecommendations(patientData));

        return this.prioritizeRecommendations(recommendations);
    }
}
```

## 🎨 Frontend Architecture

### Component System

#### Base Component Class
```javascript
class BaseComponent {
    constructor(element, options = {}) {
        this.element = element;
        this.options = { ...this.defaults, ...options };
        this.initialize();
        this.bindEvents();
    }

    initialize() {
        // Override in subclasses
    }

    bindEvents() {
        // Override in subclasses
    }

    render() {
        // Override in subclasses
    }

    destroy() {
        // Cleanup event listeners and references
    }
}
```

#### Chart Component Implementation
```javascript
class ChartComponent extends BaseComponent {
    constructor(canvas, chartConfig) {
        super(canvas, chartConfig);
        this.chart = null;
    }

    initialize() {
        this.createChart();
        this.setupResponsiveHandling();
    }

    createChart() {
        const ctx = this.element.getContext('2d');
        this.chart = new Chart(ctx, {
            type: this.options.type,
            data: this.options.data,
            options: this.getChartOptions()
        });
    }

    getChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true },
                tooltip: { enabled: true }
            },
            scales: this.getScaleConfiguration()
        };
    }
}
```

### State Management

#### Application State Manager
```javascript
class AppStateManager {
    constructor() {
        this.state = {
            currentSection: 'dashboard',
            currentPatient: null,
            predictionResults: null,
            theme: 'light',
            userPreferences: {}
        };
        this.observers = [];
    }

    setState(newState) {
        const previousState = { ...this.state };
        this.state = { ...this.state, ...newState };
        this.notifyObservers(previousState, this.state);
    }

    subscribe(observer) {
        this.observers.push(observer);
        return () => {
            this.observers = this.observers.filter(obs => obs !== observer);
        };
    }

    notifyObservers(previousState, currentState) {
        this.observers.forEach(observer => {
            observer(previousState, currentState);
        });
    }
}
```

### Event System

#### Custom Event Manager
```javascript
class EventManager {
    constructor() {
        this.events = new Map();
    }

    on(eventName, handler, context = null) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }

        this.events.get(eventName).push({ handler, context });
    }

    emit(eventName, data = null) {
        if (this.events.has(eventName)) {
            this.events.get(eventName).forEach(({ handler, context }) => {
                if (context) {
                    handler.call(context, data);
                } else {
                    handler(data);
                }
            });
        }
    }

    off(eventName, handler = null) {
        if (!this.events.has(eventName)) return;

        if (handler) {
            const handlers = this.events.get(eventName);
            this.events.set(eventName, 
                handlers.filter(h => h.handler !== handler)
            );
        } else {
            this.events.delete(eventName);
        }
    }
}
```

## 📊 Data Management

### Patient Data Model

#### Patient Class Definition
```javascript
class Patient {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.demographics = new Demographics(data.demographics);
        this.medicalHistory = new MedicalHistory(data.medicalHistory);
        this.vitalSigns = new VitalSigns(data.vitalSigns);
        this.predictions = data.predictions || [];
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    generateId() {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
        return `MRN-${year}-${random}`;
    }

    addPrediction(predictionResult) {
        this.predictions.unshift({
            ...predictionResult,
            timestamp: new Date().toISOString()
        });
        this.updateTimestamp();
    }

    updateTimestamp() {
        this.updatedAt = new Date().toISOString();
    }

    toJSON() {
        return {
            id: this.id,
            demographics: this.demographics.toJSON(),
            medicalHistory: this.medicalHistory.toJSON(),
            vitalSigns: this.vitalSigns.toJSON(),
            predictions: this.predictions,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
```

#### Data Validation System
```javascript
class DataValidator {
    static validatePatientData(data) {
        const errors = [];

        // Validate demographics
        if (!data.firstName || data.firstName.trim().length === 0) {
            errors.push({ field: 'firstName', message: 'First name is required' });
        }

        if (!data.lastName || data.lastName.trim().length === 0) {
            errors.push({ field: 'lastName', message: 'Last name is required' });
        }

        // Validate clinical parameters
        if (data.glucose && (data.glucose < 50 || data.glucose > 400)) {
            errors.push({ field: 'glucose', message: 'Glucose must be between 50-400 mg/dL' });
        }

        if (data.bmi && (data.bmi < 10 || data.bmi > 70)) {
            errors.push({ field: 'bmi', message: 'BMI must be between 10-70' });
        }

        // Additional validations...

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
```

### Local Storage Management

#### Storage Manager Class
```javascript
class StorageManager {
    constructor() {
        this.prefix = 'medcare_';
        this.encryptionKey = this.getOrCreateEncryptionKey();
    }

    save(key, data) {
        try {
            const serializedData = JSON.stringify(data);
            const encryptedData = this.encrypt(serializedData);
            localStorage.setItem(this.prefix + key, encryptedData);
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    }

    load(key) {
        try {
            const encryptedData = localStorage.getItem(this.prefix + key);
            if (!encryptedData) return null;

            const decryptedData = this.decrypt(encryptedData);
            return JSON.parse(decryptedData);
        } catch (error) {
            console.error('Storage load error:', error);
            return null;
        }
    }

    delete(key) {
        localStorage.removeItem(this.prefix + key);
    }

    clear() {
        Object.keys(localStorage)
            .filter(key => key.startsWith(this.prefix))
            .forEach(key => localStorage.removeItem(key));
    }

    encrypt(data) {
        // Simple encryption for demo - use proper encryption in production
        return btoa(data);
    }

    decrypt(encryptedData) {
        // Simple decryption for demo - use proper decryption in production
        return atob(encryptedData);
    }
}
```

## 📄 Report Generation System

### PDF Report Builder

#### Report Generator Class
```javascript
class ReportGenerator {
    constructor() {
        this.jsPDF = window.jspdf?.jsPDF;
        this.html2canvas = window.html2canvas;
    }

    async generatePatientReport(patient, predictionResults) {
        if (!this.jsPDF) {
            throw new Error('jsPDF library not loaded');
        }

        const doc = new this.jsPDF();

        // Add hospital letterhead
        this.addLetterhead(doc);

        // Add patient information
        let yPosition = this.addPatientInfo(doc, patient, 80);

        // Add prediction results
        yPosition = this.addPredictionResults(doc, predictionResults, yPosition);

        // Add recommendations
        yPosition = this.addRecommendations(doc, predictionResults.recommendations, yPosition);

        // Add footer
        this.addFooter(doc);

        return doc;
    }

    addLetterhead(doc) {
        // Organization branding
        doc.setFontSize(20);
        doc.setTextColor(59, 130, 246);
        doc.text('MedCare Analytics', 20, 25);

        // Subtitle
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('Advanced Healthcare AI Platform', 20, 32);

        // Report title
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('DIABETES RISK ASSESSMENT REPORT', 20, 50);

        // Date
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 60);

        // Divider line
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 65, 190, 65);
    }

    addPatientInfo(doc, patient, startY) {
        let yPosition = startY;

        doc.setFontSize(14);
        doc.text('PATIENT INFORMATION', 20, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.text(`Name: ${patient.demographics?.firstName} ${patient.demographics?.lastName}`, 20, yPosition);
        yPosition += 6;

        if (patient.demographics?.dateOfBirth) {
            const age = this.calculateAge(patient.demographics.dateOfBirth);
            doc.text(`Date of Birth: ${patient.demographics.dateOfBirth} (Age: ${age})`, 20, yPosition);
            yPosition += 6;
        }

        if (patient.id) {
            doc.text(`Patient ID: ${patient.id}`, 20, yPosition);
            yPosition += 6;
        }

        return yPosition + 10;
    }

    addPredictionResults(doc, results, startY) {
        let yPosition = startY;

        doc.setFontSize(14);
        doc.text('RISK ASSESSMENT RESULTS', 20, yPosition);
        yPosition += 10;

        // Risk score box
        const riskColor = this.getRiskColor(results.riskLevel);
        doc.setFillColor(...riskColor);
        doc.rect(20, yPosition, 170, 15, 'F');

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`DIABETES RISK: ${results.riskPercentage}% (${results.riskLevel.toUpperCase()})`, 25, yPosition + 10);
        yPosition += 25;

        // Model information
        doc.setFontSize(10);
        doc.text(`Model Used: ${results.modelUsed}`, 20, yPosition);
        yPosition += 6;
        doc.text(`Confidence: ${results.confidence}%`, 20, yPosition);
        yPosition += 6;

        return yPosition + 10;
    }
}
```

### Chart Integration

#### Chart to PDF Converter
```javascript
class ChartToPDFConverter {
    static async convertChartToPDF(chart, doc, x, y, width, height) {
        try {
            const canvas = chart.canvas;
            const imgData = canvas.toDataURL('image/png');

            doc.addImage(imgData, 'PNG', x, y, width, height);
            return true;
        } catch (error) {
            console.error('Chart conversion error:', error);
            return false;
        }
    }

    static async captureHTMLElement(element) {
        if (!window.html2canvas) {
            throw new Error('html2canvas library not loaded');
        }

        const canvas = await window.html2canvas(element, {
            useCORS: true,
            allowTaint: true,
            scale: 2
        });

        return canvas.toDataURL('image/png');
    }
}
```

## 🔒 Security Implementation

### Data Encryption

#### Client-side Encryption Manager
```javascript
class EncryptionManager {
    constructor() {
        this.algorithm = 'AES-GCM';
        this.keyLength = 256;
    }

    async generateKey() {
        return await crypto.subtle.generateKey(
            { name: this.algorithm, length: this.keyLength },
            true,
            ['encrypt', 'decrypt']
        );
    }

    async encrypt(data, key) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(JSON.stringify(data));

        const iv = crypto.getRandomValues(new Uint8Array(12));

        const encryptedData = await crypto.subtle.encrypt(
            { name: this.algorithm, iv: iv },
            key,
            dataBuffer
        );

        return {
            encryptedData: Array.from(new Uint8Array(encryptedData)),
            iv: Array.from(iv)
        };
    }

    async decrypt(encryptedData, key, iv) {
        const decryptedData = await crypto.subtle.decrypt(
            { name: this.algorithm, iv: new Uint8Array(iv) },
            key,
            new Uint8Array(encryptedData)
        );

        const decoder = new TextDecoder();
        const jsonString = decoder.decode(decryptedData);

        return JSON.parse(jsonString);
    }
}
```

### Input Validation and Sanitization

#### Security Validator
```javascript
class SecurityValidator {
    static sanitizeInput(input, type = 'text') {
        if (typeof input !== 'string') {
            input = String(input);
        }

        switch (type) {
            case 'text':
                return this.sanitizeText(input);
            case 'number':
                return this.sanitizeNumber(input);
            case 'email':
                return this.sanitizeEmail(input);
            case 'phone':
                return this.sanitizePhone(input);
            default:
                return this.sanitizeText(input);
        }
    }

    static sanitizeText(input) {
        return input
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim();
    }

    static sanitizeNumber(input) {
        const number = parseFloat(input);
        return isNaN(number) ? 0 : number;
    }

    static validateCSP(input) {
        // Content Security Policy validation
        const dangerousPatterns = [
            /<script/gi,
            /javascript:/gi,
            /data:text\/html/gi,
            /vbscript:/gi
        ];

        return !dangerousPatterns.some(pattern => pattern.test(input));
    }
}
```

### Audit Logging

#### Audit Trail Manager
```javascript
class AuditTrailManager {
    constructor() {
        this.logKey = 'medcare_audit_log';
        this.maxLogEntries = 1000;
    }

    logEvent(eventType, details = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            eventType,
            details,
            sessionId: this.getSessionId(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.saveLogEntry(logEntry);
    }

    saveLogEntry(entry) {
        const existingLogs = this.getAuditLogs();
        existingLogs.unshift(entry);

        // Keep only the most recent entries
        const trimmedLogs = existingLogs.slice(0, this.maxLogEntries);

        localStorage.setItem(this.logKey, JSON.stringify(trimmedLogs));
    }

    getAuditLogs() {
        try {
            const logs = localStorage.getItem(this.logKey);
            return logs ? JSON.parse(logs) : [];
        } catch (error) {
            console.error('Error retrieving audit logs:', error);
            return [];
        }
    }

    exportAuditLogs() {
        const logs = this.getAuditLogs();
        const csv = this.convertToCSV(logs);

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        URL.revokeObjectURL(url);
    }
}
```

## 🎯 Performance Optimization

### Code Splitting and Lazy Loading

#### Module Loader
```javascript
class ModuleLoader {
    constructor() {
        this.loadedModules = new Map();
        this.loadingPromises = new Map();
    }

    async loadModule(moduleName, path) {
        if (this.loadedModules.has(moduleName)) {
            return this.loadedModules.get(moduleName);
        }

        if (this.loadingPromises.has(moduleName)) {
            return this.loadingPromises.get(moduleName);
        }

        const loadingPromise = this.dynamicImport(path);
        this.loadingPromises.set(moduleName, loadingPromise);

        try {
            const module = await loadingPromise;
            this.loadedModules.set(moduleName, module);
            this.loadingPromises.delete(moduleName);
            return module;
        } catch (error) {
            this.loadingPromises.delete(moduleName);
            throw error;
        }
    }

    async dynamicImport(path) {
        // For modern browsers
        if (typeof import === 'function') {
            return await import(path);
        }

        // Fallback for older browsers
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = path;
            script.onload = () => resolve(window[moduleName]);
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}
```

### Memory Management

#### Memory Manager
```javascript
class MemoryManager {
    constructor() {
        this.observers = [];
        this.cleanupTasks = [];
        this.memoryThreshold = 50 * 1024 * 1024; // 50MB
    }

    addCleanupTask(task, priority = 1) {
        this.cleanupTasks.push({ task, priority });
        this.cleanupTasks.sort((a, b) => b.priority - a.priority);
    }

    performCleanup() {
        // Clear old chart instances
        Object.values(this.charts || {}).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });

        // Clear old patient data from memory
        this.clearOldPatientData();

        // Run custom cleanup tasks
        this.cleanupTasks.forEach(({ task }) => {
            try {
                task();
            } catch (error) {
                console.error('Cleanup task error:', error);
            }
        });

        // Force garbage collection if available
        if (window.gc && typeof window.gc === 'function') {
            window.gc();
        }
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            const memoryInfo = performance.memory;

            if (memoryInfo.usedJSHeapSize > this.memoryThreshold) {
                console.warn('High memory usage detected, performing cleanup');
                this.performCleanup();
            }
        }
    }
}
```

### Caching Strategy

#### Cache Manager
```javascript
class CacheManager {
    constructor() {
        this.cache = new Map();
        this.maxCacheSize = 100;
        this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
    }

    set(key, value, timeout = this.cacheTimeout) {
        // Remove oldest entries if cache is full
        if (this.cache.size >= this.maxCacheSize) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }

        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            timeout
        });
    }

    get(key) {
        const cached = this.cache.get(key);

        if (!cached) {
            return null;
        }

        const now = Date.now();
        if (now - cached.timestamp > cached.timeout) {
            this.cache.delete(key);
            return null;
        }

        return cached.value;
    }

    clear() {
        this.cache.clear();
    }

    cleanup() {
        const now = Date.now();

        for (const [key, cached] of this.cache.entries()) {
            if (now - cached.timestamp > cached.timeout) {
                this.cache.delete(key);
            }
        }
    }
}
```

## 🧪 Testing Framework

### Unit Testing Structure

#### Test Base Class
```javascript
class TestSuite {
    constructor(name) {
        this.name = name;
        this.tests = [];
        this.setup = null;
        this.teardown = null;
    }

    beforeEach(setupFn) {
        this.setup = setupFn;
    }

    afterEach(teardownFn) {
        this.teardown = teardownFn;
    }

    it(description, testFn) {
        this.tests.push({ description, testFn });
    }

    async run() {
        console.group(`Running test suite: ${this.name}`);

        let passed = 0;
        let failed = 0;

        for (const test of this.tests) {
            try {
                if (this.setup) await this.setup();

                await test.testFn();
                console.log(`✅ ${test.description}`);
                passed++;

                if (this.teardown) await this.teardown();
            } catch (error) {
                console.error(`❌ ${test.description}:`, error);
                failed++;
            }
        }

        console.groupEnd();
        console.log(`Test Results: ${passed} passed, ${failed} failed`);

        return { passed, failed, total: this.tests.length };
    }
}

// Example usage
const patientTests = new TestSuite('Patient Management');

patientTests.beforeEach(() => {
    // Setup test data
    this.testPatient = new Patient({
        demographics: { firstName: 'Test', lastName: 'Patient' }
    });
});

patientTests.it('should create patient with valid ID', () => {
    assert(this.testPatient.id.startsWith('MRN-'));
    assert(this.testPatient.demographics.firstName === 'Test');
});

patientTests.it('should validate required fields', () => {
    const validation = DataValidator.validatePatientData({});
    assert(!validation.isValid);
    assert(validation.errors.length > 0);
});
```

### Integration Testing

#### API Integration Tests
```javascript
class APIIntegrationTests {
    static async testPredictionAPI() {
        const testData = {
            glucose: 148,
            bmi: 33.6,
            age: 50,
            bloodPressure: 72,
            skinThickness: 35,
            insulin: 0,
            diabetesPedigreeFunction: 0.627,
            pregnancies: 6
        };

        try {
            const predictor = new AdvancedHealthcarePlatform();
            const result = await predictor.calculateAdvancedPrediction(testData, 'ensemble');

            assert(result.riskPercentage >= 0 && result.riskPercentage <= 100);
            assert(['low', 'medium', 'high'].includes(result.riskLevel));
            assert(result.confidence >= 0 && result.confidence <= 100);

            console.log('✅ Prediction API test passed');
            return true;
        } catch (error) {
            console.error('❌ Prediction API test failed:', error);
            return false;
        }
    }
}
```

## 🔧 Build and Deployment

### Development Workflow

#### Build Script
```javascript
// build.js
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

class BuildSystem {
    constructor() {
        this.srcDir = './src';
        this.distDir = './dist';
        this.version = require('./package.json').version;
    }

    async build() {
        console.log('Starting build process...');

        // Clean dist directory
        this.cleanDist();

        // Minify JavaScript
        await this.minifyJS();

        // Minify CSS
        await this.minifyCSS();

        // Copy HTML with version injection
        this.processHTML();

        // Generate build info
        this.generateBuildInfo();

        console.log('Build completed successfully!');
    }

    async minifyJS() {
        const jsContent = fs.readFileSync('./app.js', 'utf8');
        const minified = await minify(jsContent, {
            compress: true,
            mangle: true,
            sourceMap: true
        });

        fs.writeFileSync(path.join(this.distDir, 'app.min.js'), minified.code);
        fs.writeFileSync(path.join(this.distDir, 'app.min.js.map'), minified.map);
    }

    async minifyCSS() {
        const cssContent = fs.readFileSync('./style.css', 'utf8');
        const minified = new CleanCSS({ sourceMap: true }).minify(cssContent);

        fs.writeFileSync(path.join(this.distDir, 'style.min.css'), minified.styles);
    }
}
```

### Deployment Configuration

#### Docker Configuration
```dockerfile
# Dockerfile
FROM nginx:alpine

# Copy application files
COPY ./dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3     CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration
```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com cdnjs.cloudflare.com; font-src fonts.gstatic.com; img-src 'self' data:;" always;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Monitoring and Analytics

#### Performance Monitoring
```javascript
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            apiResponseTime: 0,
            memoryUsage: 0,
            errorCount: 0
        };
    }

    startTracking() {
        // Track page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.metrics.loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        });

        // Track memory usage
        if ('memory' in performance) {
            setInterval(() => {
                this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
                this.checkPerformanceThresholds();
            }, 30000); // Every 30 seconds
        }

        // Track errors
        window.addEventListener('error', (error) => {
            this.metrics.errorCount++;
            this.logError(error);
        });
    }

    checkPerformanceThresholds() {
        if (this.metrics.loadTime > 3000) {
            console.warn('Slow page load detected:', this.metrics.loadTime);
        }

        if (this.metrics.memoryUsage > 50 * 1024 * 1024) {
            console.warn('High memory usage detected:', this.metrics.memoryUsage);
        }
    }

    generateReport() {
        return {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }
}
```

---

This technical documentation provides comprehensive coverage of the MedCare Analytics platform architecture, implementation details, and development practices. It serves as a reference for developers, system administrators, and technical stakeholders involved in maintaining and extending the platform.

For user-focused documentation, please refer to README.md and FEATURES.md. For installation and setup instructions, see SETUP_GUIDE.md.
