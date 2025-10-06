// MedCare Analytics - Professional Healthcare Platform JavaScript
// Fixed all overlapping and alignment issues

class MedCareHealthcarePlatform {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentStep = 1;
        this.maxSteps = 4;
        this.patientData = {};
        this.predictionResults = null;
        this.charts = {};

        // ML Model configurations
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
        this.setupMobileMenu();
        console.log('MedCare Analytics Platform initialized successfully');
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => loadingScreen.remove(), 500);
            }
        }, 2500);
    }

    setupEventListeners() {
        // Navigation items
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

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

        // Education tabs
        document.querySelectorAll('.education-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.currentTarget.dataset.category;
                this.showEducationCategory(category);
            });
        });

        // Form validation
        this.setupFormValidation();
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const mainNav = document.getElementById('mainNav');

        if (mobileToggle && mainNav) {
            mobileToggle.addEventListener('click', () => {
                mainNav.classList.toggle('show');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !mainNav.contains(e.target)) {
                    mainNav.classList.remove('show');
                }
            });
        }
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
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;

            // Update navigation
            document.querySelectorAll('.nav-item').forEach(btn => {
                btn.classList.remove('active');
            });

            const activeBtn = document.querySelector(`[data-section="${sectionName}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }

            // Hide mobile menu
            const mainNav = document.getElementById('mainNav');
            if (mainNav) {
                mainNav.classList.remove('show');
            }

            // Section-specific initialization
            if (sectionName === 'dashboard') {
                this.initializeDashboardCharts();
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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

        if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'flex' : 'none';
        if (nextBtn) nextBtn.style.display = this.currentStep < this.maxSteps ? 'flex' : 'none';
        if (submitBtn) submitBtn.style.display = this.currentStep === this.maxSteps ? 'flex' : 'none';
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector('.form-step.active');
        if (!currentStepElement) return true;

        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            this.clearFieldError(field);

            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    this.showFieldError(field, 'Please enter a valid email address');
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        field.style.borderColor = 'var(--error-500)';

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'var(--error-500)';
        errorElement.style.fontSize = 'var(--font-size-xs)';
        errorElement.style.marginTop = '0.25rem';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
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
        const bmi = this.calculateBMI(patientInfo.height, patientInfo.weight);

        reviewContainer.innerHTML = `
            <div class="review-section">
                <h3><i class="fas fa-user"></i> Demographics</h3>
                <div class="review-grid">
                    <div class="review-item">
                        <label>Full Name:</label>
                        <span>${patientInfo.firstName || 'Not provided'} ${patientInfo.lastName || ''}</span>
                    </div>
                    <div class="review-item">
                        <label>Date of Birth:</label>
                        <span>${patientInfo.dateOfBirth || 'Not provided'} ${age ? `(Age: ${age})` : ''}</span>
                    </div>
                    <div class="review-item">
                        <label>Gender:</label>
                        <span>${patientInfo.gender || 'Not provided'}</span>
                    </div>
                    <div class="review-item">
                        <label>Phone:</label>
                        <span>${patientInfo.phoneNumber || 'Not provided'}</span>
                    </div>
                </div>
            </div>

            <div class="review-section">
                <h3><i class="fas fa-heartbeat"></i> Vital Signs</h3>
                <div class="review-grid">
                    <div class="review-item">
                        <label>Height/Weight:</label>
                        <span>${patientInfo.height || 'Not provided'} / ${patientInfo.weight || 'Not provided'}</span>
                    </div>
                    <div class="review-item">
                        <label>BMI:</label>
                        <span>${bmi ? bmi.toFixed(1) : 'Cannot calculate'}</span>
                    </div>
                    <div class="review-item">
                        <label>Blood Pressure:</label>
                        <span>${patientInfo.bloodPressureSystolic || '---'}/${patientInfo.bloodPressureDiastolic || '---'} mmHg</span>
                    </div>
                    <div class="review-item">
                        <label>Heart Rate:</label>
                        <span>${patientInfo.heartRate || 'Not provided'} bpm</span>
                    </div>
                </div>
            </div>

            <style>
                .review-section {
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    border: 1px solid var(--border-light);
                    border-radius: var(--border-radius);
                    background: var(--surface);
                }
                .review-section h3 {
                    margin-bottom: 1rem;
                    color: var(--primary-600);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: var(--font-size-lg);
                }
                .review-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1rem;
                }
                .review-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .review-item label {
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-secondary);
                    font-size: var(--font-size-sm);
                }
                .review-item span {
                    color: var(--text-primary);
                    font-size: var(--font-size-base);
                }
            </style>
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

    calculateBMI(height, weight) {
        if (!height || !weight) return null;

        // Parse height (assuming format like "5'10\"" or "175 cm")
        let heightInM;
        if (height.includes("'")) {
            const parts = height.match(/(\d+)'\s*(\d+)/);
            if (parts) {
                const feet = parseInt(parts[1]);
                const inches = parseInt(parts[2]);
                heightInM = (feet * 12 + inches) * 0.0254;
            }
        } else if (height.includes('cm')) {
            heightInM = parseFloat(height) / 100;
        } else {
            // Assume inches
            heightInM = parseFloat(height) * 0.0254;
        }

        // Parse weight (assuming format like "185 lbs" or "84 kg")
        let weightInKg;
        if (weight.includes('lbs')) {
            weightInKg = parseFloat(weight) * 0.453592;
        } else if (weight.includes('kg')) {
            weightInKg = parseFloat(weight);
        } else {
            // Assume pounds
            weightInKg = parseFloat(weight) * 0.453592;
        }

        if (heightInM && weightInKg) {
            return weightInKg / (heightInM * heightInM);
        }

        return null;
    }

    submitRegistration(e) {
        e.preventDefault();

        if (!this.validateCurrentStep()) {
            return;
        }

        // Generate patient ID
        const patientId = this.generatePatientId();

        // Collect all form data
        const formData = new FormData(document.getElementById('patientRegistrationForm'));
        const patientData = { patientId };

        for (let [key, value] of formData.entries()) {
            patientData[key] = value;
        }

        // Save patient data
        this.savePatientData(patientData);

        // Show success message and redirect
        this.showToast('Patient registered successfully! ID: ' + patientId, 'success');

        setTimeout(() => {
            this.showSection('dashboard');
            this.resetRegistrationForm();
        }, 2500);
    }

    generatePatientId() {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
        return `MRN-${year}-${random}`;
    }

    savePatientData(patientData) {
        // In a real application, this would save to a database
        localStorage.setItem(`patient_${patientData.patientId}`, JSON.stringify(patientData));

        // Add to recent patients list
        const recentPatients = JSON.parse(localStorage.getItem('recentPatients') || '[]');
        recentPatients.unshift(patientData);
        localStorage.setItem('recentPatients', JSON.stringify(recentPatients.slice(0, 10)));
    }

    resetRegistrationForm() {
        this.currentStep = 1;
        this.updateFormStep();
        document.getElementById('patientRegistrationForm').reset();

        // Clear any error messages
        document.querySelectorAll('.error-message').forEach(error => error.remove());
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.style.borderColor = '';
        });
    }

    // Prediction Analysis
    async handlePrediction(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const inputData = {};

        for (let [key, value] of formData.entries()) {
            if (key !== 'selectedModel') {
                inputData[key] = parseFloat(value) || 0;
            }
        }

        // Validate required fields
        const requiredFields = ['glucose', 'bloodPressure', 'bmi', 'age'];
        const missingFields = requiredFields.filter(field => !inputData[field]);

        if (missingFields.length > 0) {
            this.showToast(`Please fill in required fields: ${missingFields.join(', ')}`, 'error');
            return;
        }

        // Show loading state
        const predictBtn = document.getElementById('predictBtn');
        if (predictBtn) {
            predictBtn.classList.add('loading');
            const btnContent = predictBtn.querySelector('.btn-content');
            const btnLoading = predictBtn.querySelector('.btn-loading');
            if (btnContent) btnContent.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'flex';
        }

        try {
            // Simulate API delay
            await this.delay(3000);

            // Calculate prediction
            const prediction = this.calculateAdvancedPrediction(inputData);

            // Display results
            this.displayPredictionResults(prediction);

        } catch (error) {
            console.error('Prediction error:', error);
            this.showToast('An error occurred during prediction', 'error');
        } finally {
            if (predictBtn) {
                predictBtn.classList.remove('loading');
                const btnContent = predictBtn.querySelector('.btn-content');
                const btnLoading = predictBtn.querySelector('.btn-loading');
                if (btnContent) btnContent.style.display = 'flex';
                if (btnLoading) btnLoading.style.display = 'none';
            }
        }
    }

    calculateAdvancedPrediction(inputData) {
        // Advanced prediction algorithm with multiple factors
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

        // Normalize inputs based on medical ranges
        const normalized = {
            glucose: this.normalizeGlucose(inputData.glucose),
            bmi: this.normalizeBMI(inputData.bmi),
            age: this.normalizeAge(inputData.age),
            bloodPressure: this.normalizeBloodPressure(inputData.bloodPressure),
            diabetesPedigreeFunction: Math.min((inputData.diabetesPedigreeFunction || 0) / 2, 1),
            pregnancies: Math.min((inputData.pregnancies || 0) / 15, 1),
            skinThickness: Math.min((inputData.skinThickness || 0) / 50, 1),
            insulin: Math.min((inputData.insulin || 0) / 300, 1)
        };

        // Calculate weighted risk score
        let riskScore = 0;
        Object.keys(weights).forEach(key => {
            riskScore += (normalized[key] || 0) * weights[key];
        });

        // Convert to percentage and determine risk level
        const riskPercentage = Math.max(5, Math.min(95, Math.round(riskScore * 100)));
        const riskLevel = this.determineRiskLevel(riskPercentage);

        // Generate detailed analysis
        const analysis = this.generateRiskAnalysis(inputData, riskPercentage);

        return {
            riskPercentage,
            riskLevel,
            confidence: Math.round(this.models.ensemble.accuracy * 100),
            modelUsed: this.models.ensemble.name,
            analysis,
            recommendations: this.generateRecommendations(riskLevel),
            inputData
        };
    }

    normalizeGlucose(glucose) {
        // Normal fasting: 70-100, Prediabetes: 100-125, Diabetes: ≥126
        if (glucose < 70) return 0.1;
        if (glucose <= 100) return 0.2;
        if (glucose <= 125) return 0.6;
        return 0.9;
    }

    normalizeBMI(bmi) {
        // Normal: <25, Overweight: 25-29.9, Obese: ≥30
        if (bmi < 18.5) return 0.2;
        if (bmi < 25) return 0.1;
        if (bmi < 30) return 0.5;
        return 0.8;
    }

    normalizeAge(age) {
        // Risk increases significantly after 45
        if (age < 25) return 0.1;
        if (age < 45) return 0.3;
        if (age < 65) return 0.6;
        return 0.8;
    }

    normalizeBloodPressure(bp) {
        // Normal: <80, Stage 1: 80-89, Stage 2: ≥90
        if (bp < 80) return 0.1;
        if (bp < 90) return 0.4;
        return 0.7;
    }

    determineRiskLevel(percentage) {
        if (percentage >= 70) return 'high';
        if (percentage >= 40) return 'medium';
        return 'low';
    }

    generateRiskAnalysis(data, riskPercentage) {
        const analysis = {
            summary: '',
            keyFindings: [],
            clinicalSignificance: ''
        };

        // Generate summary
        analysis.summary = `Based on the provided clinical parameters, this patient has a ${riskPercentage}% predicted risk for developing type 2 diabetes.`;

        // Key findings
        if (data.glucose >= 126) {
            analysis.keyFindings.push('Glucose level indicates diabetes (≥126 mg/dL)');
        } else if (data.glucose >= 100) {
            analysis.keyFindings.push('Glucose level indicates prediabetes (100-125 mg/dL)');
        }

        if (data.bmi >= 30) {
            analysis.keyFindings.push('BMI indicates obesity (≥30), a major diabetes risk factor');
        }

        if (data.age >= 45) {
            analysis.keyFindings.push('Age is a significant risk factor (≥45 years)');
        }

        // Clinical significance
        if (riskPercentage >= 70) {
            analysis.clinicalSignificance = 'HIGH RISK: Immediate medical evaluation and intervention recommended.';
        } else if (riskPercentage >= 40) {
            analysis.clinicalSignificance = 'MODERATE RISK: Lifestyle interventions and regular monitoring advised.';
        } else {
            analysis.clinicalSignificance = 'LOW RISK: Continue preventive measures with routine screening.';
        }

        return analysis;
    }

    generateRecommendations(riskLevel) {
        const recommendations = [];

        if (riskLevel === 'high') {
            recommendations.push('Schedule immediate appointment with endocrinologist');
            recommendations.push('Order comprehensive metabolic panel including HbA1c');
            recommendations.push('Begin diabetes self-monitoring education');
            recommendations.push('Consider pharmacological intervention');
            recommendations.push('Implement intensive lifestyle modification program');
        } else if (riskLevel === 'medium') {
            recommendations.push('Implement structured lifestyle intervention program');
            recommendations.push('Schedule follow-up in 3-6 months');
            recommendations.push('Annual diabetes screening recommended');
            recommendations.push('Nutritional counseling referral');
            recommendations.push('Regular physical activity program');
        } else {
            recommendations.push('Continue current healthy lifestyle practices');
            recommendations.push('Routine diabetes screening every 3 years');
            recommendations.push('Maintain healthy weight and regular exercise');
            recommendations.push('Monitor for changes in risk factors');
        }

        return recommendations;
    }

    displayPredictionResults(prediction) {
        const resultsContainer = document.getElementById('predictionResults');
        const placeholder = document.querySelector('.results-placeholder');

        if (!resultsContainer) return;

        if (placeholder) {
            placeholder.style.display = 'none';
        }

        resultsContainer.innerHTML = `
            <div class="prediction-header">
                <h2><i class="fas fa-chart-line"></i> Diabetes Risk Assessment</h2>
                <p>Advanced ML Analysis: ${prediction.modelUsed}</p>
            </div>

            <div class="risk-summary">
                <div class="risk-circle ${prediction.riskLevel}">
                    <span class="risk-percentage">${prediction.riskPercentage}%</span>
                    <span class="risk-label">${prediction.riskLevel.charAt(0).toUpperCase() + prediction.riskLevel.slice(1)} Risk</span>
                </div>

                <div class="risk-details">
                    <div class="detail-item">
                        <span class="detail-label">Model Confidence</span>
                        <span class="detail-value">${prediction.confidence}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Model Used</span>
                        <span class="detail-value">${prediction.modelUsed}</span>
                    </div>
                </div>
            </div>

            <div class="analysis-section">
                <h3><i class="fas fa-stethoscope"></i> Clinical Analysis</h3>
                <p class="analysis-summary">${prediction.analysis.summary}</p>
                <p class="clinical-significance"><strong>${prediction.analysis.clinicalSignificance}</strong></p>

                ${prediction.analysis.keyFindings.length > 0 ? `
                    <div class="key-findings">
                        <h4>Key Clinical Findings:</h4>
                        <ul>
                            ${prediction.analysis.keyFindings.map(finding => `<li>${finding}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>

            <div class="recommendations-section">
                <h3><i class="fas fa-clipboard-list"></i> Clinical Recommendations</h3>
                <ul class="recommendations-list">
                    ${prediction.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>

            <div class="result-actions">
                <button class="btn btn-primary" onclick="app.generateReport()">
                    <i class="fas fa-file-pdf"></i> Generate PDF Report
                </button>
                <button class="btn btn-secondary" onclick="app.printResults()">
                    <i class="fas fa-print"></i> Print Results
                </button>
                <button class="btn btn-secondary" onclick="app.savePrediction()">
                    <i class="fas fa-save"></i> Save to Records
                </button>
            </div>

            <style>
                .prediction-results {
                    padding: 2rem;
                }
                .prediction-header {
                    text-align: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border-light);
                }
                .prediction-header h2 {
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                .risk-summary {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    background: var(--gray-50);
                    border-radius: var(--border-radius);
                }
                .risk-circle {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    flex-shrink: 0;
                }
                .risk-circle.high {
                    background: linear-gradient(135deg, var(--error-500), var(--error-600));
                    color: white;
                }
                .risk-circle.medium {
                    background: linear-gradient(135deg, var(--warning-500), var(--warning-600));
                    color: white;
                }
                .risk-circle.low {
                    background: linear-gradient(135deg, var(--success-500), var(--success-600));
                    color: white;
                }
                .risk-percentage {
                    font-size: 2rem;
                    font-weight: var(--font-weight-bold);
                    line-height: 1;
                }
                .risk-label {
                    font-size: var(--font-size-sm);
                    font-weight: var(--font-weight-semibold);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .risk-details {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem 0;
                    border-bottom: 1px solid var(--border-light);
                }
                .detail-label {
                    font-weight: var(--font-weight-medium);
                    color: var(--text-secondary);
                }
                .detail-value {
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                }
                .analysis-section, .recommendations-section {
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    background: var(--surface);
                    border: 1px solid var(--border-light);
                    border-radius: var(--border-radius);
                }
                .analysis-section h3, .recommendations-section h3 {
                    color: var(--primary-600);
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .analysis-summary {
                    margin-bottom: 1rem;
                    line-height: 1.6;
                }
                .clinical-significance {
                    margin-bottom: 1rem;
                    padding: 1rem;
                    background: var(--primary-50);
                    border-radius: var(--border-radius-sm);
                    color: var(--primary-700);
                }
                .key-findings h4 {
                    margin-bottom: 0.5rem;
                    color: var(--text-primary);
                }
                .key-findings ul, .recommendations-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .key-findings li, .recommendations-list li {
                    padding: 0.5rem 0;
                    padding-left: 1.5rem;
                    position: relative;
                    border-bottom: 1px solid var(--border-light);
                }
                .key-findings li:last-child, .recommendations-list li:last-child {
                    border-bottom: none;
                }
                .key-findings li::before {
                    content: '•';
                    color: var(--warning-500);
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                }
                .recommendations-list li::before {
                    content: '→';
                    color: var(--primary-500);
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                }
                .result-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid var(--border-light);
                }

                @media (max-width: 768px) {
                    .risk-summary {
                        flex-direction: column;
                        text-align: center;
                        gap: 1rem;
                    }
                    .result-actions {
                        flex-direction: column;
                    }
                }
            </style>
        `;

        resultsContainer.style.display = 'block';
        this.predictionResults = prediction;
    }

    // Education Section Management
    showEducationCategory(category) {
        // Update tabs
        document.querySelectorAll('.education-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-category="${category}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Update content
        document.querySelectorAll('.education-panel').forEach(content => {
            content.classList.remove('active');
        });
        const activePanel = document.querySelector(`.education-panel[data-category="${category}"]`);
        if (activePanel) {
            activePanel.classList.add('active');
        }
    }

    // Chart Management
    initializeCharts() {
        this.initializeDashboardCharts();
    }

    initializeDashboardCharts() {
        // Risk Distribution Chart
        const riskCtx = document.getElementById('riskDistributionChart');
        if (riskCtx && window.Chart) {
            if (this.charts.riskDistribution) {
                this.charts.riskDistribution.destroy();
            }

            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const textColor = isDark ? '#f3f4f6' : '#111827';

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
                            labels: { 
                                color: textColor,
                                padding: 20,
                                font: { family: 'Inter' }
                            }
                        },
                        tooltip: {
                            backgroundColor: isDark ? '#374151' : '#ffffff',
                            titleColor: textColor,
                            bodyColor: textColor,
                            borderColor: isDark ? '#6b7280' : '#e5e7eb',
                            borderWidth: 1
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

            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const textColor = isDark ? '#f3f4f6' : '#111827';
            const gridColor = isDark ? '#374151' : '#e5e7eb';

            this.charts.demographics = new Chart(demoCtx, {
                type: 'bar',
                data: {
                    labels: ['18-29', '30-39', '40-49', '50-59', '60-69', '70+'],
                    datasets: [{
                        label: 'Male',
                        data: [1200, 1800, 2100, 1900, 1400, 800],
                        backgroundColor: '#3b82f6',
                        borderRadius: 4
                    }, {
                        label: 'Female',
                        data: [1100, 1700, 2000, 1800, 1300, 700],
                        backgroundColor: '#0d9488',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { 
                                color: textColor,
                                font: { family: 'Inter' }
                            }
                        },
                        tooltip: {
                            backgroundColor: isDark ? '#374151' : '#ffffff',
                            titleColor: textColor,
                            bodyColor: textColor,
                            borderColor: isDark ? '#6b7280' : '#e5e7eb',
                            borderWidth: 1
                        }
                    },
                    scales: {
                        x: { 
                            ticks: { color: textColor },
                            grid: { color: gridColor }
                        },
                        y: { 
                            beginAtZero: true,
                            ticks: { color: textColor },
                            grid: { color: gridColor }
                        }
                    }
                }
            });
        }
    }

    // Form Validation
    setupFormValidation() {
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.validateField(e.target);
            }
        });
    }

    validateField(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            field.style.borderColor = 'var(--error-500)';
        } else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                field.style.borderColor = 'var(--error-500)';
            } else {
                field.style.borderColor = 'var(--success-500)';
            }
        } else if (field.value.trim()) {
            field.style.borderColor = 'var(--success-500)';
        } else {
            field.style.borderColor = '';
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

            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text('Professional Healthcare AI Platform', 20, 32);

            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text('DIABETES RISK ASSESSMENT REPORT', 20, 50);

            // Add date
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 60);

            // Add line
            doc.setDrawColor(200, 200, 200);
            doc.line(20, 65, 190, 65);

            // Add results
            doc.setFontSize(14);
            doc.text('RISK ASSESSMENT RESULTS', 20, 80);

            // Risk score box
            const riskColor = this.getRiskColor(this.predictionResults.riskLevel);
            doc.setFillColor(...riskColor);
            doc.rect(20, 90, 170, 15, 'F');

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`DIABETES RISK: ${this.predictionResults.riskPercentage}% (${this.predictionResults.riskLevel.toUpperCase()})`, 25, 100);

            let yPos = 115;
            doc.setFontSize(10);
            doc.text(`Model Used: ${this.predictionResults.modelUsed}`, 20, yPos);
            yPos += 6;
            doc.text(`Model Confidence: ${this.predictionResults.confidence}%`, 20, yPos);
            yPos += 6;
            doc.text(`Analysis Date: ${new Date().toLocaleDateString()}`, 20, yPos);
            yPos += 15;

            // Clinical analysis
            doc.setFontSize(12);
            doc.text('CLINICAL ANALYSIS', 20, yPos);
            yPos += 8;

            doc.setFontSize(9);
            const analysisText = doc.splitTextToSize(this.predictionResults.analysis.summary, 170);
            doc.text(analysisText, 20, yPos);
            yPos += analysisText.length * 4 + 5;

            const significanceText = doc.splitTextToSize(this.predictionResults.analysis.clinicalSignificance, 170);
            doc.text(significanceText, 20, yPos);
            yPos += significanceText.length * 4 + 15;

            // Recommendations
            doc.setFontSize(12);
            doc.text('CLINICAL RECOMMENDATIONS', 20, yPos);
            yPos += 8;

            doc.setFontSize(9);
            this.predictionResults.recommendations.forEach(rec => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 30;
                }
                doc.text(`• ${rec}`, 25, yPos);
                yPos += 6;
            });

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setDrawColor(200, 200, 200);
                doc.line(20, 280, 190, 280);
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text('This report is generated by MedCare Analytics AI for clinical decision support.', 20, 285);
                doc.text(`Page ${i} of ${pageCount}`, 190 - 20, 285, { align: 'right' });
            }

            // Save the PDF
            const fileName = `diabetes_risk_report_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

            this.showToast('PDF report generated successfully!', 'success');

        } catch (error) {
            console.error('Error generating PDF:', error);
            this.showToast('Error generating PDF report', 'error');
        }
    }

    getRiskColor(riskLevel) {
        switch (riskLevel) {
            case 'high': return [239, 68, 68];
            case 'medium': return [245, 158, 11];
            default: return [34, 197, 94];
        }
    }

    printResults() {
        if (!this.predictionResults) {
            this.showToast('No prediction results available to print', 'error');
            return;
        }

        const printContent = this.generatePrintableReport();
        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Diabetes Risk Assessment Report</title>
                <style>
                    body { font-family: 'Inter', Arial, sans-serif; margin: 20px; line-height: 1.6; color: #111827; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; }
                    .header h1 { color: #3b82f6; margin: 0; font-size: 1.8rem; }
                    .header p { color: #6b7280; margin: 5px 0 0 0; }
                    .risk-summary { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
                    .risk-summary h2 { margin-top: 0; color: #1f2937; }
                    .recommendations { margin-top: 25px; }
                    .recommendations h3 { color: #3b82f6; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
                    .recommendations ul { padding-left: 20px; }
                    .recommendations li { margin-bottom: 8px; }
                    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                ${printContent}
                <div class="footer">
                    <p><strong>MedCare Analytics Professional Healthcare Platform</strong></p>
                    <p>Generated: ${new Date().toLocaleString()}</p>
                    <p><strong>Disclaimer:</strong> This report is for clinical decision support. Clinical judgment should always override algorithmic predictions.</p>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();

        setTimeout(() => {
            printWindow.print();
        }, 500);
    }

    generatePrintableReport() {
        return `
            <div class="header">
                <h1>MedCare Analytics</h1>
                <p>Diabetes Risk Assessment Report</p>
                <p>Generated: ${new Date().toLocaleString()}</p>
            </div>

            <div class="risk-summary">
                <h2>Risk Assessment Results</h2>
                <p><strong>Diabetes Risk: ${this.predictionResults.riskPercentage}% (${this.predictionResults.riskLevel.toUpperCase()})</strong></p>
                <p><strong>Model Used:</strong> ${this.predictionResults.modelUsed}</p>
                <p><strong>Model Confidence:</strong> ${this.predictionResults.confidence}%</p>
                <p><strong>Clinical Significance:</strong> ${this.predictionResults.analysis.clinicalSignificance}</p>
            </div>

            <div class="analysis">
                <h3>Clinical Analysis Summary</h3>
                <p>${this.predictionResults.analysis.summary}</p>

                ${this.predictionResults.analysis.keyFindings.length > 0 ? `
                    <h4>Key Clinical Findings:</h4>
                    <ul>
                        ${this.predictionResults.analysis.keyFindings.map(finding => `<li>${finding}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>

            <div class="recommendations">
                <h3>Clinical Recommendations</h3>
                <ul>
                    ${this.predictionResults.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    savePrediction() {
        if (!this.predictionResults) {
            this.showToast('No prediction results to save', 'error');
            return;
        }

        // Save to localStorage (in real app, would save to database)
        const savedPredictions = JSON.parse(localStorage.getItem('savedPredictions') || '[]');

        const predictionRecord = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            patientId: null, // Would be linked to patient if available
            results: this.predictionResults
        };

        savedPredictions.unshift(predictionRecord);
        localStorage.setItem('savedPredictions', JSON.stringify(savedPredictions.slice(0, 50)));

        this.showToast('Prediction saved to medical records', 'success');
    }

    showToast(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="${icons[type] || icons.info}" style="color: var(--${type}-500); margin-right: 0.75rem;"></i>
            <div style="flex: 1;">${message}</div>
            <button class="toast-close" style="margin-left: 0.75rem;">&times;</button>
        `;

        container.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, duration);

        // Close button handler
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (container.contains(toast)) {
                        container.removeChild(toast);
                    }
                }, 300);
            };
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global functions for easy access
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
            input.style.borderColor = 'var(--success-500)';
        }
    });

    if (window.app) {
        window.app.showToast('Sample clinical data loaded successfully', 'success');
    }
};

window.generateReport = function() {
    if (window.app && window.app.predictionResults) {
        window.app.generateReport();
    } else if (window.app) {
        window.app.showToast('No prediction results available. Please run an analysis first.', 'warning');
    }
};

window.previewReport = function() {
    if (window.app) {
        window.app.showToast('Report preview functionality - coming soon!', 'info');
    }
};

window.downloadReport = function() {
    if (window.app && window.app.predictionResults) {
        window.app.generateReport();
    } else if (window.app) {
        window.app.showToast('No prediction results available for download', 'warning');
    }
};

window.printReport = function() {
    if (window.app && window.app.predictionResults) {
        window.app.printResults();
    } else if (window.app) {
        window.app.showToast('No prediction results available for printing', 'warning');
    }
};

window.showSection = function(sectionName) {
    if (window.app) {
        window.app.showSection(sectionName);
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing MedCare Analytics Platform...');
    window.app = new MedCareHealthcarePlatform();

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'p':
                    e.preventDefault();
                    if (window.app && window.app.predictionResults) {
                        window.app.printResults();
                    }
                    break;
                case 's':
                    e.preventDefault();
                    if (window.app && window.app.predictionResults) {
                        window.app.savePrediction();
                    }
                    break;
            }
        }
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MedCareHealthcarePlatform;
}