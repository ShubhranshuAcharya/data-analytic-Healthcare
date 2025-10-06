// MedCare Analytics - Advanced Healthcare Platform JavaScript

class AdvancedHealthcarePlatform {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentStep = 1;
        this.maxSteps = 4;
        this.patientData = {};
        this.predictionResults = null;
        this.charts = {};

        this.models = {
            ensemble: { 
                name: 'Ensemble Model', 
                accuracy: 0.86, 
                precision: 0.87, 
                recall: 0.73, 
                f1Score: 0.79 
            },
            gradient: { 
                name: 'Gradient Boosting', 
                accuracy: 0.84, 
                precision: 0.83, 
                recall: 0.67, 
                f1Score: 0.74 
            },
            logistic: { 
                name: 'Advanced Logistic Regression', 
                accuracy: 0.82, 
                precision: 0.85, 
                recall: 0.58, 
                f1Score: 0.69 
            }
        };

        this.init();
    }

    init() {
        this.hideLoadingScreen();
        this.setupEventListeners();
        this.setupThemeToggle();
        this.initializeCharts();
        this.updateBreadcrumbs();
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => loadingScreen.remove(), 500);
            }
        }, 2000);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mainNav = document.querySelector('.main-nav');

        if (mobileMenuBtn && mainNav) {
            mobileMenuBtn.addEventListener('click', () => {
                mainNav.classList.toggle('show');
            });
        }

        // Registration form steps
        const nextStepBtn = document.getElementById('nextStep');
        const prevStepBtn = document.getElementById('prevStep');
        const submitBtn = document.getElementById('submitRegistration');

        if (nextStepBtn) nextStepBtn.addEventListener('click', () => this.nextStep());
        if (prevStepBtn) prevStepBtn.addEventListener('click', () => this.prevStep());
        if (submitBtn) submitBtn.addEventListener('click', (e) => this.submitRegistration(e));

        // Prediction form
        const predictionForm = document.getElementById('predictionForm');
        if (predictionForm) {
            predictionForm.addEventListener('submit', (e) => this.handlePrediction(e));
        }

        // Education category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.showEducationCategory(category);
            });
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');

        this.setTheme(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(newTheme);
            });
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }

        // Reinitialize charts with new theme colors
        setTimeout(() => this.initializeCharts(), 100);
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;

            // Update navigation
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            const activeBtn = document.querySelector(`[data-section="${sectionName}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }

            // Hide mobile menu
            const mainNav = document.querySelector('.main-nav');
            if (mainNav) {
                mainNav.classList.remove('show');
            }

            this.updateBreadcrumbs();

            // Section-specific initialization
            if (sectionName === 'dashboard') {
                this.initializeDashboardCharts();
            } else if (sectionName === 'population') {
                this.initializePopulationCharts();
            }
        }
    }

    updateBreadcrumbs() {
        const sectionNames = {
            dashboard: 'Dashboard',
            'patient-registration': 'Patient Registration',
            prediction: 'Risk Analysis',
            reports: 'Reports',
            education: 'Education Center',
            population: 'Population Health'
        };
    }

    // Registration Form Management
    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.maxSteps) {
                this.currentStep++;
                this.updateFormStep();

                if (this.currentStep === 4) {
                    this.generatePatientReview();
                }
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateFormStep();
        }
    }

    updateFormStep() {
        // Update progress indicators
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');

            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Update form steps
        document.querySelectorAll('.form-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active');

            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Update navigation buttons
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const submitBtn = document.getElementById('submitRegistration');

        if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        if (nextBtn) nextBtn.style.display = this.currentStep < this.maxSteps ? 'block' : 'none';
        if (submitBtn) submitBtn.style.display = this.currentStep === this.maxSteps ? 'block' : 'none';
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector('.form-step.active');
        if (!currentStepElement) return true;

        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    generatePatientReview() {
        const reviewContainer = document.getElementById('patientReview');
        if (!reviewContainer) return;

        const formData = new FormData(document.getElementById('patientRegistrationForm'));
        const patientInfo = {};

        for (let [key, value] of formData.entries()) {
            patientInfo[key] = value;
        }

        const age = this.calculateAge(patientInfo.dateOfBirth);

        reviewContainer.innerHTML = `
            <div class="review-section">
                <h3>Patient Demographics</h3>
                <p><strong>Name:</strong> ${patientInfo.firstName} ${patientInfo.lastName}</p>
                <p><strong>Date of Birth:</strong> ${patientInfo.dateOfBirth} (Age: ${age})</p>
                <p><strong>Gender:</strong> ${patientInfo.gender}</p>
                <p><strong>Phone:</strong> ${patientInfo.phoneNumber}</p>
            </div>
            <div class="review-section">
                <h3>Medical Information</h3>
                <p><strong>Allergies:</strong> ${patientInfo.allergies || 'None reported'}</p>
                <p><strong>Current Medications:</strong> ${patientInfo.currentMedications || 'None reported'}</p>
                <p><strong>Medical Conditions:</strong> ${patientInfo.medicalConditions || 'None reported'}</p>
            </div>
        `;
    }

    calculateAge(dateOfBirth) {
        if (!dateOfBirth) return null;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    submitRegistration(e) {
        e.preventDefault();

        if (!this.validateCurrentStep()) {
            return;
        }

        // Generate patient ID
        const patientId = this.generatePatientId();

        // Collect form data
        const formData = new FormData(document.getElementById('patientRegistrationForm'));
        const patientData = { patientId };

        for (let [key, value] of formData.entries()) {
            patientData[key] = value;
        }

        // Save patient data
        this.savePatientData(patientData);

        // Show success message
        this.showToast('Patient registered successfully!', 'success');

        setTimeout(() => {
            this.showSection('dashboard');
            this.resetRegistrationForm();
        }, 2000);
    }

    generatePatientId() {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
        return `MRN-${year}-${random}`;
    }

    savePatientData(patientData) {
        localStorage.setItem(`patient_${patientData.patientId}`, JSON.stringify(patientData));
    }

    resetRegistrationForm() {
        this.currentStep = 1;
        this.updateFormStep();
        document.getElementById('patientRegistrationForm').reset();
    }

    // Prediction Analysis
    async handlePrediction(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const inputData = {};

        for (let [key, value] of formData.entries()) {
            inputData[key] = parseFloat(value) || 0;
        }

        const predictBtn = document.getElementById('predictBtn');
        if (predictBtn) {
            predictBtn.classList.add('loading');
        }

        try {
            // Simulate API delay
            await this.delay(2000);

            // Calculate prediction
            const prediction = this.calculatePrediction(inputData);

            // Display results
            this.displayPredictionResults(prediction);

        } catch (error) {
            console.error('Prediction error:', error);
            this.showToast('An error occurred during prediction', 'error');
        } finally {
            if (predictBtn) {
                predictBtn.classList.remove('loading');
            }
        }
    }

    calculatePrediction(inputData) {
        // Simplified prediction algorithm
        const weights = {
            glucose: 0.35,
            bmi: 0.18,
            age: 0.15,
            bloodPressure: 0.12,
            diabetesPedigreeFunction: 0.10,
            pregnancies: 0.05,
            skinThickness: 0.03,
            insulin: 0.02
        };

        // Normalize inputs
        const normalized = {
            glucose: Math.min(inputData.glucose / 200, 1),
            bmi: Math.min(inputData.bmi / 50, 1),
            age: Math.min(inputData.age / 100, 1),
            bloodPressure: Math.min(inputData.bloodPressure / 150, 1),
            diabetesPedigreeFunction: Math.min(inputData.diabetesPedigreeFunction / 2, 1),
            pregnancies: Math.min(inputData.pregnancies / 15, 1),
            skinThickness: Math.min(inputData.skinThickness / 50, 1),
            insulin: Math.min(inputData.insulin / 300, 1)
        };

        // Calculate weighted score
        let score = 0;
        Object.keys(weights).forEach(key => {
            score += (normalized[key] || 0) * weights[key];
        });

        const riskPercentage = Math.max(5, Math.min(95, Math.round(score * 100)));
        const riskLevel = riskPercentage >= 70 ? 'high' : riskPercentage >= 40 ? 'medium' : 'low';

        return {
            riskPercentage,
            riskLevel,
            confidence: Math.round(this.models.ensemble.accuracy * 100),
            modelUsed: this.models.ensemble.name,
            recommendations: this.generateRecommendations(riskLevel)
        };
    }

    generateRecommendations(riskLevel) {
        const recommendations = {
            high: [
                'Schedule immediate consultation with endocrinologist',
                'Begin comprehensive diabetes screening',
                'Implement strict dietary modifications',
                'Start regular blood glucose monitoring'
            ],
            medium: [
                'Schedule follow-up in 3-6 months',
                'Implement lifestyle modifications',
                'Regular exercise program',
                'Annual comprehensive screening'
            ],
            low: [
                'Continue healthy lifestyle practices',
                'Routine screening every 3 years',
                'Maintain healthy weight',
                'Regular physical activity'
            ]
        };

        return recommendations[riskLevel] || recommendations.low;
    }

    displayPredictionResults(prediction) {
        const resultsContainer = document.getElementById('predictionResults');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `
            <div class="prediction-results-header">
                <h2>Diabetes Risk Assessment</h2>
                <p>ML Analysis: ${prediction.modelUsed}</p>
            </div>

            <div class="risk-indicator">
                <div class="risk-circle ${prediction.riskLevel}">
                    <span class="risk-percentage">${prediction.riskPercentage}%</span>
                </div>
                <div class="risk-level ${prediction.riskLevel}">
                    ${prediction.riskLevel.charAt(0).toUpperCase() + prediction.riskLevel.slice(1)} Risk
                </div>
            </div>

            <div class="result-details">
                <div class="result-metrics">
                    <div class="result-metric">
                        <span class="result-label">Model Confidence</span>
                        <span class="result-value">${prediction.confidence}%</span>
                    </div>
                    <div class="result-metric">
                        <span class="result-label">Model Used</span>
                        <span class="result-value">${prediction.modelUsed}</span>
                    </div>
                </div>

                <div class="recommendations">
                    <h4>Clinical Recommendations</h4>
                    <ul>
                        ${prediction.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>

                <div class="result-actions">
                    <button class="btn btn--primary" onclick="app.generateReport()">
                        <i class="fas fa-file-pdf"></i> Generate PDF Report
                    </button>
                    <button class="btn btn--outline" onclick="app.printResults()">
                        <i class="fas fa-print"></i> Print Results
                    </button>
                </div>
            </div>
        `;

        resultsContainer.style.display = 'block';
        this.predictionResults = prediction;
    }

    // Education Section Management
    showEducationCategory(category) {
        // Update tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.education-content').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"].education-content`).classList.add('active');
    }

    // Chart Management
    initializeCharts() {
        this.initializeDashboardCharts();
        this.initializePopulationCharts();
    }

    initializeDashboardCharts() {
        // Risk Distribution Chart
        const riskCtx = document.getElementById('riskDistributionChart');
        if (riskCtx && window.Chart) {
            if (this.charts.riskDistribution) {
                this.charts.riskDistribution.destroy();
            }

            this.charts.riskDistribution = new Chart(riskCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
                    datasets: [{
                        data: [9087, 4752, 2108],
                        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
                        borderWidth: 0,
                        cutout: '70%'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { padding: 20 }
                        }
                    }
                }
            });
        }

        // Demographics Chart
        const demoCtx = document.getElementById('demographicsChart');
        if (demoCtx && window.Chart) {
            if (this.charts.demographics) {
                this.charts.demographics.destroy();
            }

            this.charts.demographics = new Chart(demoCtx, {
                type: 'bar',
                data: {
                    labels: ['18-29', '30-39', '40-49', '50-59', '60-69', '70+'],
                    datasets: [{
                        label: 'Male',
                        data: [1200, 1800, 2100, 1900, 1400, 800],
                        backgroundColor: '#3b82f6'
                    }, {
                        label: 'Female',
                        data: [1100, 1700, 2000, 1800, 1300, 700],
                        backgroundColor: '#0d9488'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }
    }

    initializePopulationCharts() {
        // Age Distribution Chart
        const ageCtx = document.getElementById('ageDistributionChart');
        if (ageCtx && window.Chart) {
            if (this.charts.ageDistribution) {
                this.charts.ageDistribution.destroy();
            }

            this.charts.ageDistribution = new Chart(ageCtx, {
                type: 'line',
                data: {
                    labels: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'],
                    datasets: [{
                        label: 'Patient Count',
                        data: [1500, 2800, 3200, 4100, 2900, 1347],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }

        // Risk Trends Chart
        const trendsCtx = document.getElementById('riskTrendsChart');
        if (trendsCtx && window.Chart) {
            if (this.charts.riskTrends) {
                this.charts.riskTrends.destroy();
            }

            this.charts.riskTrends = new Chart(trendsCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'High Risk',
                        data: [2200, 2150, 2180, 2120, 2090, 2108],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: false
                    }, {
                        label: 'Moderate Risk',
                        data: [4900, 4850, 4820, 4800, 4780, 4752],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        fill: false
                    }, {
                        label: 'Low Risk',
                        data: [8800, 8900, 8950, 9000, 9050, 9087],
                        borderColor: '#22c55e',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }
    }

    // Utility Functions
    async generateReport() {
        if (!this.predictionResults) {
            this.showToast('No prediction results available to generate report', 'error');
            return;
        }

        try {
            if (typeof window.jspdf === 'undefined') {
                this.showToast('PDF library not loaded. Please refresh the page.', 'error');
                return;
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Add header
            doc.setFontSize(20);
            doc.setTextColor(59, 130, 246);
            doc.text('MedCare Analytics', 20, 25);

            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text('DIABETES RISK ASSESSMENT REPORT', 20, 40);

            // Add date
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 50);

            // Add results
            doc.setFontSize(14);
            doc.text('RISK ASSESSMENT RESULTS', 20, 70);

            doc.setFontSize(12);
            doc.text(`Diabetes Risk: ${this.predictionResults.riskPercentage}% (${this.predictionResults.riskLevel.toUpperCase()} RISK)`, 20, 85);
            doc.text(`Model Used: ${this.predictionResults.modelUsed}`, 20, 95);
            doc.text(`Model Confidence: ${this.predictionResults.confidence}%`, 20, 105);

            // Add recommendations
            doc.setFontSize(14);
            doc.text('CLINICAL RECOMMENDATIONS', 20, 125);

            doc.setFontSize(10);
            let yPosition = 135;
            this.predictionResults.recommendations.forEach(rec => {
                doc.text(`• ${rec}`, 25, yPosition);
                yPosition += 10;
            });

            // Save the PDF
            const fileName = `diabetes_risk_report_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

            this.showToast('PDF report generated successfully!', 'success');

        } catch (error) {
            console.error('Error generating PDF:', error);
            this.showToast('Error generating PDF report', 'error');
        }
    }

    printResults() {
        if (!this.predictionResults) {
            this.showToast('No prediction results available to print', 'error');
            return;
        }

        const printContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #2563eb;">MedCare Analytics</h1>
                <h2>Diabetes Risk Assessment Report</h2>
                <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>

                <h3>Risk Assessment Results</h3>
                <p><strong>Diabetes Risk:</strong> ${this.predictionResults.riskPercentage}% (${this.predictionResults.riskLevel.toUpperCase()} RISK)</p>
                <p><strong>Model Used:</strong> ${this.predictionResults.modelUsed}</p>
                <p><strong>Confidence:</strong> ${this.predictionResults.confidence}%</p>

                <h3>Clinical Recommendations</h3>
                <ul>
                    ${this.predictionResults.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    }

    showToast(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 300);
        }, duration);

        // Close button
        toast.querySelector('.toast-close').onclick = () => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 300);
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Sample data loading function
window.loadSampleData = function() {
    const sampleData = {
        pregnancies: 6,
        glucose: 148,
        bloodPressure: 72,
        skinThickness: 35,
        insulin: 0,
        bmi: 33.6,
        diabetesPedigreeFunction: 0.627,
        age: 50
    };

    Object.entries(sampleData).forEach(([key, value]) => {
        const input = document.getElementById(key);
        if (input) {
            input.value = value;
        }
    });

    window.app.showToast('Sample data loaded successfully', 'success');
};

// Global functions for button clicks
window.generateReport = function() {
    if (window.app && window.app.predictionResults) {
        window.app.generateReport();
    }
};

window.previewReport = function() {
    window.app.showToast('Report preview functionality coming soon', 'info');
};

window.downloadReport = function() {
    if (window.app && window.app.predictionResults) {
        window.app.generateReport();
    }
};

window.printReport = function() {
    if (window.app && window.app.predictionResults) {
        window.app.printResults();
    }
};

window.showSection = function(sectionName) {
    if (window.app) {
        window.app.showSection(sectionName);
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AdvancedHealthcarePlatform();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedHealthcarePlatform;
}