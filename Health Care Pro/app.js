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
                f1Score: 0.79, 
                auc: 0.905,
                specificity: 0.92 
            },
            gradient: { 
                name: 'Gradient Boosting', 
                accuracy: 0.84, 
                precision: 0.83, 
                recall: 0.67, 
                f1Score: 0.74, 
                auc: 0.891,
                specificity: 0.89 
            },
            logistic: { 
                name: 'Advanced Logistic Regression', 
                accuracy: 0.82, 
                precision: 0.85, 
                recall: 0.58, 
                f1Score: 0.69, 
                auc: 0.873,
                specificity: 0.91 
            },
            neural: { 
                name: 'Neural Network', 
                accuracy: 0.81, 
                precision: 0.79, 
                recall: 0.71, 
                f1Score: 0.75, 
                auc: 0.885,
                specificity: 0.86 
            }
        };

        this.samplePatientData = {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1979-03-15',
            gender: 'male',
            address: '123 Main St, Anytown, ST 12345',
            phoneNumber: '(555) 123-4567',
            email: 'john.doe@email.com',
            emergencyContact: 'Jane Doe - (555) 987-6543',
            insurance: 'BlueCross BlueShield - Policy #ABC123456',
            allergies: 'Penicillin, Shellfish',
            currentMedications: 'Lisinopril 10mg daily, Metformin 500mg twice daily',
            medicalConditions: 'Hypertension, Pre-diabetes',
            familyHistory: 'Father: Type 2 Diabetes, Mother: Heart Disease',
            smokingStatus: 'former',
            alcoholUse: 'occasional',
            exerciseFrequency: '3-4',
            height: "5'10\"",
            weight: '185 lbs',
            bloodPressureSystolic: 130,
            bloodPressureDiastolic: 85,
            heartRate: 72,
            temperature: 98.6,
            respiratoryRate: 16,
            oxygenSaturation: 98
        };

        this.riskFactors = [
            {
                factor: 'Glucose Level',
                weight: 0.35,
                description: 'Primary indicator of diabetes risk',
                recommendations: ['Monitor blood glucose regularly', 'Dietary modifications']
            },
            {
                factor: 'BMI',
                weight: 0.18,
                description: 'Body mass index correlation with diabetes',
                recommendations: ['Weight management', 'Nutritional counseling']
            },
            {
                factor: 'Age',
                weight: 0.15,
                description: 'Age-related diabetes risk increase',
                recommendations: ['Regular screening', 'Preventive care']
            }
        ];

        this.init();
    }

    init() {
        this.hideLoadingScreen();
        this.setupEventListeners();
        this.setupThemeToggle();
        this.initializeCharts();
        this.loadUserPreferences();
        this.updateBreadcrumbs();
        this.initializeTooltips();
        this.setupKeyboardShortcuts();
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

        // Global search
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('input', (e) => this.handleGlobalSearch(e.target.value));
        }

        // Time range selectors
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const range = e.currentTarget.dataset.range;
                this.updateTimeRange(range);
            });
        });

        // Modal handlers
        this.setupModalHandlers();

        // Window resize handler for responsive charts
        window.addEventListener('resize', () => this.handleResize());

        // Form validation
        this.setupFormValidation();
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
        const breadcrumbList = document.getElementById('breadcrumbList');
        if (!breadcrumbList) return;

        const sectionNames = {
            dashboard: 'Dashboard',
            'patient-registration': 'Patient Registration',
            prediction: 'Risk Analysis',
            reports: 'Reports',
            education: 'Education Center',
            population: 'Population Health'
        };

        breadcrumbList.innerHTML = `
            <li><a href="#"><i class="fas fa-home"></i> Home</a></li>
            <li class="active">${sectionNames[this.currentSection] || 'Dashboard'}</li>
        `;
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

        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Additional validation for specific steps
        if (this.currentStep === 1) {
            isValid = this.validateDemographics() && isValid;
        } else if (this.currentStep === 3) {
            isValid = this.validateVitalSigns() && isValid;
        }

        return isValid;
    }

    validateDemographics() {
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phoneNumber');
        let isValid = true;

        // Email validation
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                this.showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            } else {
                this.clearFieldError(emailField);
            }
        }

        // Phone validation
        if (phoneField && phoneField.value) {
            const phoneRegex = /^[\(]?[\d\s\)\-\+]{10,}$/;
            if (!phoneRegex.test(phoneField.value.replace(/\s/g, ''))) {
                this.showFieldError(phoneField, 'Please enter a valid phone number');
                isValid = false;
            } else {
                this.clearFieldError(phoneField);
            }
        }

        return isValid;
    }

    validateVitalSigns() {
        const systolic = document.getElementById('bloodPressureSystolic');
        const diastolic = document.getElementById('bloodPressureDiastolic');
        let isValid = true;

        // Blood pressure validation
        if (systolic && diastolic && systolic.value && diastolic.value) {
            const sys = parseInt(systolic.value);
            const dia = parseInt(diastolic.value);

            if (sys <= dia) {
                this.showFieldError(systolic, 'Systolic pressure must be higher than diastolic');
                isValid = false;
            } else {
                this.clearFieldError(systolic);
                this.clearFieldError(diastolic);
            }
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');

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
        errorElement.style.marginTop = 'var(--space-1)';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');
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
                        <span>${patientInfo.firstName} ${patientInfo.lastName}</span>
                    </div>
                    <div class="review-item">
                        <label>Date of Birth:</label>
                        <span>${patientInfo.dateOfBirth} (Age: ${age})</span>
                    </div>
                    <div class="review-item">
                        <label>Gender:</label>
                        <span>${patientInfo.gender}</span>
                    </div>
                    <div class="review-item">
                        <label>Phone:</label>
                        <span>${patientInfo.phoneNumber}</span>
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

            <div class="review-section">
                <h3><i class="fas fa-notes-medical"></i> Medical History</h3>
                <div class="review-text">
                    <div class="review-item">
                        <label>Allergies:</label>
                        <span>${patientInfo.allergies || 'None reported'}</span>
                    </div>
                    <div class="review-item">
                        <label>Current Medications:</label>
                        <span>${patientInfo.currentMedications || 'None reported'}</span>
                    </div>
                    <div class="review-item">
                        <label>Medical Conditions:</label>
                        <span>${patientInfo.medicalConditions || 'None reported'}</span>
                    </div>
                </div>
            </div>

            <style>
                .review-section {
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-lg);
                }
                .review-section h3 {
                    margin-bottom: 1rem;
                    color: var(--primary-600);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
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

        const selectedModel = formData.get('selectedModel') || 'ensemble';

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
        }

        try {
            // Simulate API delay
            await this.delay(3000);

            // Calculate prediction
            const prediction = this.calculateAdvancedPrediction(inputData, selectedModel);

            // Display results
            this.displayPredictionResults(prediction);

            // Save prediction history
            this.savePredictionHistory(inputData, prediction);

        } catch (error) {
            console.error('Prediction error:', error);
            this.showToast('An error occurred during prediction', 'error');
        } finally {
            if (predictBtn) {
                predictBtn.classList.remove('loading');
            }
        }
    }

    calculateAdvancedPrediction(inputData, modelType) {
        const model = this.models[modelType];

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
            diabetesPedigreeFunction: Math.min(inputData.diabetesPedigreeFunction / 2, 1),
            pregnancies: Math.min(inputData.pregnancies / 15, 1),
            skinThickness: Math.min(inputData.skinThickness / 50, 1),
            insulin: Math.min(inputData.insulin / 300, 1)
        };

        // Calculate weighted risk score
        let riskScore = 0;
        Object.keys(weights).forEach(key => {
            riskScore += (normalized[key] || 0) * weights[key];
        });

        // Apply model-specific adjustments
        riskScore = this.applyModelAdjustments(riskScore, modelType, model);

        // Add clinical decision support
        const clinicalFactors = this.analyzeClinicalFactors(inputData);

        // Convert to percentage and determine risk level
        const riskPercentage = Math.max(5, Math.min(95, Math.round(riskScore * 100)));
        const riskLevel = this.determineRiskLevel(riskPercentage, clinicalFactors);

        // Generate detailed analysis
        const analysis = this.generateRiskAnalysis(inputData, riskPercentage, clinicalFactors);

        return {
            riskPercentage,
            riskLevel,
            confidence: Math.round(model.accuracy * 100),
            modelUsed: model.name,
            modelMetrics: model,
            analysis,
            recommendations: this.generateRecommendations(inputData, riskLevel, clinicalFactors),
            riskFactors: this.analyzeRiskFactors(inputData, weights),
            followUp: this.generateFollowUpPlan(riskLevel, clinicalFactors)
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

    applyModelAdjustments(score, modelType, model) {
        // Apply model-specific calibration
        switch (modelType) {
            case 'ensemble':
                return score * 1.1; // Ensemble typically more confident
            case 'gradient':
                return score * 1.05;
            case 'neural':
                return score * 0.95; // Neural networks can be more conservative
            default:
                return score;
        }
    }

    analyzeClinicalFactors(data) {
        const factors = {};

        // Metabolic syndrome criteria
        factors.metabolicSyndrome = this.checkMetabolicSyndrome(data);

        // Insulin resistance indicators
        factors.insulinResistance = this.checkInsulinResistance(data);

        // Cardiovascular risk
        factors.cardiovascularRisk = this.assessCardiovascularRisk(data);

        return factors;
    }

    checkMetabolicSyndrome(data) {
        let criteria = 0;

        if (data.bmi >= 30) criteria++; // Central obesity approximation
        if (data.glucose >= 100) criteria++; // Elevated glucose
        if (data.bloodPressure >= 85) criteria++; // Elevated BP

        return {
            present: criteria >= 2,
            criteriaCount: criteria,
            description: criteria >= 2 ? 'Likely metabolic syndrome' : 'Low risk for metabolic syndrome'
        };
    }

    checkInsulinResistance(data) {
        const score = (data.glucose / 100) * (data.bmi / 25) * (data.age / 40);

        return {
            score,
            level: score > 1.5 ? 'High' : score > 1.0 ? 'Moderate' : 'Low',
            description: `Insulin resistance risk: ${score > 1.5 ? 'High' : score > 1.0 ? 'Moderate' : 'Low'}`
        };
    }

    assessCardiovascularRisk(data) {
        let riskFactors = 0;

        if (data.age >= 45) riskFactors++;
        if (data.bmi >= 25) riskFactors++;
        if (data.bloodPressure >= 130) riskFactors++;
        if (data.glucose >= 100) riskFactors++;

        return {
            level: riskFactors >= 3 ? 'High' : riskFactors >= 2 ? 'Moderate' : 'Low',
            factorCount: riskFactors,
            description: `Cardiovascular risk factors present: ${riskFactors}`
        };
    }

    determineRiskLevel(percentage, clinicalFactors) {
        // Adjust risk level based on clinical factors
        let adjustedPercentage = percentage;

        if (clinicalFactors.metabolicSyndrome?.present) {
            adjustedPercentage += 10;
        }

        if (clinicalFactors.insulinResistance?.level === 'High') {
            adjustedPercentage += 5;
        }

        if (adjustedPercentage >= 70) return 'high';
        if (adjustedPercentage >= 40) return 'medium';
        return 'low';
    }

    generateRiskAnalysis(data, riskPercentage, clinicalFactors) {
        const analysis = {
            summary: '',
            keyFindings: [],
            clinicalSignificance: '',
            limitations: []
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

        if (clinicalFactors.metabolicSyndrome?.present) {
            analysis.keyFindings.push('Multiple criteria for metabolic syndrome present');
        }

        // Clinical significance
        if (riskPercentage >= 70) {
            analysis.clinicalSignificance = 'HIGH RISK: Immediate intervention recommended. Patient should be evaluated for diabetes diagnosis and treatment.';
        } else if (riskPercentage >= 40) {
            analysis.clinicalSignificance = 'MODERATE RISK: Lifestyle interventions recommended. Regular monitoring advised.';
        } else {
            analysis.clinicalSignificance = 'LOW RISK: Continue preventive measures. Routine screening appropriate.';
        }

        // Limitations
        analysis.limitations = [
            'Prediction based on limited clinical parameters',
            'Family history and genetic factors not fully assessed',
            'Laboratory results (HbA1c, lipids) not included',
            'Clinical judgment should override algorithmic predictions'
        ];

        return analysis;
    }

    generateRecommendations(data, riskLevel, clinicalFactors) {
        const recommendations = [];

        // Risk-based recommendations
        if (riskLevel === 'high') {
            recommendations.push({
                category: 'Immediate Actions',
                items: [
                    'Schedule appointment with endocrinologist within 2 weeks',
                    'Order comprehensive metabolic panel including HbA1c',
                    'Begin diabetes self-monitoring education',
                    'Consider pharmacological intervention'
                ]
            });
        } else if (riskLevel === 'medium') {
            recommendations.push({
                category: 'Preventive Measures',
                items: [
                    'Implement structured lifestyle intervention program',
                    'Schedule follow-up in 3-6 months',
                    'Annual diabetes screening',
                    'Nutritional counseling referral'
                ]
            });
        } else {
            recommendations.push({
                category: 'Maintenance',
                items: [
                    'Continue current healthy lifestyle practices',
                    'Routine diabetes screening every 3 years',
                    'Maintain healthy weight and regular exercise',
                    'Monitor for changes in risk factors'
                ]
            });
        }

        // Parameter-specific recommendations
        if (data.bmi >= 25) {
            recommendations.push({
                category: 'Weight Management',
                items: [
                    'Target 5-10% weight loss if overweight',
                    'Consider referral to dietitian',
                    'Increase physical activity to 150 min/week',
                    'Monitor progress with regular weigh-ins'
                ]
            });
        }

        if (data.bloodPressure >= 130) {
            recommendations.push({
                category: 'Blood Pressure',
                items: [
                    'Monitor blood pressure regularly',
                    'Reduce sodium intake (<2300mg/day)',
                    'Increase potassium-rich foods',
                    'Consider antihypertensive therapy if persistently elevated'
                ]
            });
        }

        return recommendations;
    }

    analyzeRiskFactors(data, weights) {
        return this.riskFactors.map(factor => {
            const weight = weights[factor.factor.toLowerCase().replace(' level', '').replace(' ', '')] || 0;
            return {
                ...factor,
                contribution: Math.round(weight * 100),
                status: this.getFactorStatus(factor.factor, data)
            };
        });
    }

    getFactorStatus(factorName, data) {
        switch (factorName) {
            case 'Glucose Level':
                if (data.glucose >= 126) return 'High Risk';
                if (data.glucose >= 100) return 'Moderate Risk';
                return 'Normal';
            case 'BMI':
                if (data.bmi >= 30) return 'Obese';
                if (data.bmi >= 25) return 'Overweight';
                return 'Normal';
            case 'Age':
                if (data.age >= 65) return 'High Risk';
                if (data.age >= 45) return 'Moderate Risk';
                return 'Low Risk';
            default:
                return 'Unknown';
        }
    }

    generateFollowUpPlan(riskLevel, clinicalFactors) {
        const plan = {
            nextAppointment: '',
            monitoring: [],
            interventions: [],
            goals: []
        };

        switch (riskLevel) {
            case 'high':
                plan.nextAppointment = '2 weeks';
                plan.monitoring = ['Weekly glucose monitoring', 'Monthly weight checks', 'BP monitoring'];
                plan.interventions = ['Diabetes education', 'Medication management', 'Intensive lifestyle counseling'];
                plan.goals = ['HbA1c <7%', '5-10% weight loss', 'BP <130/80 mmHg'];
                break;
            case 'medium':
                plan.nextAppointment = '3 months';
                plan.monitoring = ['Quarterly glucose checks', 'Semi-annual HbA1c', 'Regular weight monitoring'];
                plan.interventions = ['Lifestyle modification program', 'Nutritional counseling'];
                plan.goals = ['Prevent diabetes progression', '7% weight loss', 'Maintain healthy BP'];
                break;
            default:
                plan.nextAppointment = '1 year';
                plan.monitoring = ['Annual diabetes screening', 'Regular health maintenance'];
                plan.interventions = ['Continue preventive measures'];
                plan.goals = ['Maintain current health status', 'Prevent risk factor development'];
        }

        return plan;
    }

    displayPredictionResults(prediction) {
        const resultsContainer = document.getElementById('predictionResults');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `
            <div class="prediction-results-header">
                <h2><i class="fas fa-chart-line"></i> Diabetes Risk Assessment</h2>
                <p>Advanced ML Analysis: ${prediction.modelUsed}</p>
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
                    <div class="result-metric">
                        <span class="result-label">Clinical Significance</span>
                        <span class="result-value">${prediction.riskLevel.toUpperCase()}</span>
                    </div>
                </div>

                <div class="risk-factors">
                    <h4><i class="fas fa-exclamation-triangle"></i> Risk Factor Analysis</h4>
                    <div class="risk-factor-list">
                        ${prediction.riskFactors.map(factor => `
                            <div class="risk-factor-item">
                                <div class="factor-info">
                                    <strong>${factor.factor}</strong>
                                    <span class="factor-status ${factor.status.toLowerCase().replace(' ', '-')}">${factor.status}</span>
                                </div>
                                <div class="factor-weight">
                                    <div class="factor-bar" style="width: ${factor.contribution}%"></div>
                                </div>
                                <span class="factor-percentage">${factor.contribution}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="clinical-analysis">
                    <h4><i class="fas fa-stethoscope"></i> Clinical Analysis</h4>
                    <div class="analysis-summary">
                        <p><strong>Summary:</strong> ${prediction.analysis.summary}</p>
                        <p><strong>Clinical Significance:</strong> ${prediction.analysis.clinicalSignificance}</p>
                    </div>

                    ${prediction.analysis.keyFindings.length > 0 ? `
                        <div class="key-findings">
                            <h5>Key Findings:</h5>
                            <ul>
                                ${prediction.analysis.keyFindings.map(finding => `<li>${finding}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>

                <div class="recommendations">
                    <h4><i class="fas fa-clipboard-list"></i> Clinical Recommendations</h4>
                    ${prediction.recommendations.map(category => `
                        <div class="recommendation-category">
                            <h5>${category.category}</h5>
                            <ul>
                                ${category.items.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>

                <div class="follow-up-plan">
                    <h4><i class="fas fa-calendar-alt"></i> Follow-up Plan</h4>
                    <div class="follow-up-grid">
                        <div class="follow-up-item">
                            <label>Next Appointment:</label>
                            <span>${prediction.followUp.nextAppointment}</span>
                        </div>
                        <div class="follow-up-item">
                            <label>Monitoring:</label>
                            <span>${prediction.followUp.monitoring.join(', ')}</span>
                        </div>
                    </div>
                </div>

                <div class="result-actions">
                    <button class="btn btn--primary" onclick="app.generateReport()">
                        <i class="fas fa-file-pdf"></i> Generate PDF Report
                    </button>
                    <button class="btn btn--outline" onclick="app.printResults()">
                        <i class="fas fa-print"></i> Print Results
                    </button>
                    <button class="btn btn--outline" onclick="app.savePrediction()">
                        <i class="fas fa-save"></i> Save to Records
                    </button>
                </div>
            </div>
        `;

        resultsContainer.style.display = 'block';
        this.predictionResults = prediction;

        // Add CSS for risk factor styling
        this.addPredictionResultsStyles();
    }

    addPredictionResultsStyles() {
        if (document.getElementById('prediction-results-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'prediction-results-styles';
        styles.textContent = `
            .risk-factor-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.75rem;
                background: var(--surface);
                border-radius: var(--radius-lg);
                margin-bottom: 0.75rem;
                border-left: 4px solid var(--border-light);
            }

            .factor-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .factor-status {
                font-size: var(--font-size-xs);
                padding: 0.125rem 0.5rem;
                border-radius: var(--radius-sm);
                font-weight: var(--font-weight-semibold);
                text-transform: uppercase;
            }

            .factor-status.high-risk {
                background: var(--error-50);
                color: var(--error-600);
            }

            .factor-status.moderate-risk {
                background: var(--warning-50);
                color: var(--warning-600);
            }

            .factor-status.normal, .factor-status.low-risk {
                background: var(--success-50);
                color: var(--success-600);
            }

            .factor-weight {
                width: 100px;
                height: 8px;
                background: var(--gray-200);
                border-radius: 4px;
                position: relative;
                overflow: hidden;
            }

            .factor-bar {
                height: 100%;
                background: linear-gradient(90deg, var(--success-500), var(--warning-500), var(--error-500));
                border-radius: 4px;
                transition: width 1s ease;
            }

            .factor-percentage {
                font-weight: var(--font-weight-semibold);
                font-size: var(--font-size-sm);
                min-width: 40px;
                text-align: right;
            }

            .analysis-summary {
                background: var(--gray-50);
                padding: 1rem;
                border-radius: var(--radius-lg);
                margin-bottom: 1rem;
            }

            [data-theme="dark"] .analysis-summary {
                background: var(--gray-800);
            }

            .key-findings ul {
                list-style: none;
                padding: 0;
            }

            .key-findings li {
                padding: 0.5rem 0;
                padding-left: 1.5rem;
                position: relative;
            }

            .key-findings li::before {
                content: '•';
                color: var(--warning-500);
                font-weight: bold;
                position: absolute;
                left: 0;
            }

            .recommendation-category {
                margin-bottom: 1.5rem;
            }

            .recommendation-category h5 {
                color: var(--primary-600);
                margin-bottom: 0.75rem;
                font-weight: var(--font-weight-semibold);
            }

            .recommendation-category ul {
                list-style: none;
                padding: 0;
            }

            .recommendation-category li {
                padding: 0.5rem 0;
                padding-left: 1.5rem;
                position: relative;
                border-bottom: 1px solid var(--border-light);
            }

            .recommendation-category li:last-child {
                border-bottom: none;
            }

            .recommendation-category li::before {
                content: '→';
                color: var(--primary-500);
                font-weight: bold;
                position: absolute;
                left: 0;
            }

            .follow-up-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }

            .follow-up-item {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .follow-up-item label {
                font-weight: var(--font-weight-semibold);
                color: var(--text-secondary);
                font-size: var(--font-size-sm);
            }

            .result-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 2rem;
                flex-wrap: wrap;
            }

            .risk-circle.high {
                background: conic-gradient(var(--error-500) 0deg 270deg, var(--gray-200) 270deg 360deg);
            }

            .risk-circle.medium {
                background: conic-gradient(var(--warning-500) 0deg 180deg, var(--gray-200) 180deg 360deg);
            }

            .risk-circle.low {
                background: conic-gradient(var(--success-500) 0deg 90deg, var(--gray-200) 90deg 360deg);
            }
        `;
        document.head.appendChild(styles);
    }

    savePredictionHistory(inputData, prediction) {
        const history = JSON.parse(localStorage.getItem('predictionHistory') || '[]');

        history.unshift({
            timestamp: new Date().toISOString(),
            inputData,
            prediction,
            patientId: this.patientData?.patientId || null
        });

        // Keep only last 100 predictions
        localStorage.setItem('predictionHistory', JSON.stringify(history.slice(0, 100)));
    }

    // Report Generation
    async generateReport() {
        if (!this.predictionResults) {
            this.showToast('No prediction results available to generate report', 'error');
            return;
        }

        try {
            const { jsPDF } = window.jspdf;
            if (!jsPDF) {
                throw new Error('PDF library not loaded');
            }

            const doc = new jsPDF();

            // Add hospital letterhead
            this.addReportHeader(doc);

            // Add patient information
            this.addPatientInfo(doc);

            // Add prediction results
            this.addPredictionToReport(doc);

            // Add recommendations
            this.addRecommendationsToReport(doc);

            // Add footer
            this.addReportFooter(doc);

            // Save the PDF
            const fileName = `diabetes_risk_report_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

            this.showToast('PDF report generated successfully!', 'success');

        } catch (error) {
            console.error('Error generating PDF:', error);
            this.showToast('Error generating PDF report', 'error');
        }
    }

    addReportHeader(doc) {
        // Hospital letterhead
        doc.setFontSize(20);
        doc.setTextColor(59, 130, 246);
        doc.text('MedCare Analytics', 20, 25);

        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('Advanced Healthcare AI Platform', 20, 32);

        // Report title
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('DIABETES RISK ASSESSMENT REPORT', 20, 50);

        // Date and time
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 60);

        // Add a line
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 65, 190, 65);
    }

    addPatientInfo(doc) {
        let yPosition = 75;

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('PATIENT INFORMATION', 20, yPosition);

        yPosition += 10;
        doc.setFontSize(10);

        // Patient demographics (if available)
        if (this.patientData) {
            doc.text(`Name: ${this.patientData.firstName || ''} ${this.patientData.lastName || ''}`, 20, yPosition);
            yPosition += 6;

            if (this.patientData.dateOfBirth) {
                const age = this.calculateAge(this.patientData.dateOfBirth);
                doc.text(`Date of Birth: ${this.patientData.dateOfBirth} (Age: ${age})`, 20, yPosition);
                yPosition += 6;
            }

            if (this.patientData.gender) {
                doc.text(`Gender: ${this.patientData.gender}`, 20, yPosition);
                yPosition += 6;
            }

            if (this.patientData.patientId) {
                doc.text(`Patient ID: ${this.patientData.patientId}`, 20, yPosition);
                yPosition += 6;
            }
        } else {
            doc.text('Patient demographics not available', 20, yPosition);
            yPosition += 6;
        }

        return yPosition + 10;
    }

    addPredictionToReport(doc) {
        let yPosition = 120;

        doc.setFontSize(14);
        doc.text('RISK ASSESSMENT RESULTS', 20, yPosition);

        yPosition += 10;
        doc.setFontSize(12);

        // Risk percentage (highlighted)
        doc.setDrawColor(239, 68, 68);
        doc.setFillColor(254, 242, 242);
        if (this.predictionResults.riskLevel === 'high') {
            doc.rect(20, yPosition, 170, 15, 'F');
        } else if (this.predictionResults.riskLevel === 'medium') {
            doc.setFillColor(255, 251, 235);
            doc.rect(20, yPosition, 170, 15, 'F');
        } else {
            doc.setFillColor(240, 253, 244);
            doc.rect(20, yPosition, 170, 15, 'F');
        }

        doc.setTextColor(0, 0, 0);
        doc.text(`DIABETES RISK: ${this.predictionResults.riskPercentage}% (${this.predictionResults.riskLevel.toUpperCase()} RISK)`, 25, yPosition + 10);

        yPosition += 25;
        doc.setFontSize(10);

        // Model information
        doc.text(`Model Used: ${this.predictionResults.modelUsed}`, 20, yPosition);
        yPosition += 6;
        doc.text(`Model Confidence: ${this.predictionResults.confidence}%`, 20, yPosition);
        yPosition += 6;
        doc.text(`Analysis Date: ${new Date().toLocaleDateString()}`, 20, yPosition);

        yPosition += 15;

        // Clinical analysis
        doc.setFontSize(12);
        doc.text('CLINICAL ANALYSIS', 20, yPosition);
        yPosition += 8;

        doc.setFontSize(9);
        const analysisText = doc.splitTextToSize(this.predictionResults.analysis.summary, 170);
        doc.text(analysisText, 20, yPosition);
        yPosition += analysisText.length * 4 + 10;

        const significanceText = doc.splitTextToSize(this.predictionResults.analysis.clinicalSignificance, 170);
        doc.text(significanceText, 20, yPosition);

        return yPosition + significanceText.length * 4 + 10;
    }

    addRecommendationsToReport(doc) {
        // Add new page if needed
        if (doc.internal.pageSize.height - 50 < 180) {
            doc.addPage();
            doc.setFontSize(12);
            doc.text('CLINICAL RECOMMENDATIONS', 20, 30);
            let yPosition = 40;
        } else {
            doc.setFontSize(12);
            doc.text('CLINICAL RECOMMENDATIONS', 20, 180);
            let yPosition = 190;
        }

        doc.setFontSize(9);

        this.predictionResults.recommendations.forEach(category => {
            // Check if we need a new page
            if (yPosition > doc.internal.pageSize.height - 40) {
                doc.addPage();
                yPosition = 30;
            }

            doc.setFontSize(10);
            doc.text(`${category.category}:`, 20, yPosition);
            yPosition += 6;

            doc.setFontSize(9);
            category.items.forEach(item => {
                if (yPosition > doc.internal.pageSize.height - 30) {
                    doc.addPage();
                    yPosition = 30;
                }

                const itemText = doc.splitTextToSize(`• ${item}`, 165);
                doc.text(itemText, 25, yPosition);
                yPosition += itemText.length * 4 + 2;
            });

            yPosition += 5;
        });
    }

    addReportFooter(doc) {
        const pageCount = doc.internal.getNumberOfPages();

        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);

            // Footer line
            doc.setDrawColor(200, 200, 200);
            doc.line(20, doc.internal.pageSize.height - 20, 190, doc.internal.pageSize.height - 20);

            // Footer text
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text('This report is generated by MedCare Analytics AI system for clinical decision support.', 20, doc.internal.pageSize.height - 15);
            doc.text('Clinical judgment should always override algorithmic predictions.', 20, doc.internal.pageSize.height - 10);

            // Page number
            doc.text(`Page ${i} of ${pageCount}`, 190 - 20, doc.internal.pageSize.height - 10, { align: 'right' });
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
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
                    .risk-summary { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    .recommendations { margin-top: 20px; }
                    .recommendations h3 { color: #2563eb; }
                    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #666; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                ${printContent}
                <div class="footer">
                    <p>Generated by MedCare Analytics | ${new Date().toLocaleString()}</p>
                    <p><strong>Disclaimer:</strong> This report is for clinical decision support. Clinical judgment should always override algorithmic predictions.</p>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.print();
    }

    generatePrintableReport() {
        return `
            <div class="header">
                <h1>MedCare Analytics</h1>
                <h2>Diabetes Risk Assessment Report</h2>
                <p>Generated: ${new Date().toLocaleString()}</p>
            </div>

            <div class="risk-summary">
                <h2>Risk Assessment Results</h2>
                <p><strong>Diabetes Risk: ${this.predictionResults.riskPercentage}% (${this.predictionResults.riskLevel.toUpperCase()} RISK)</strong></p>
                <p>Model Used: ${this.predictionResults.modelUsed}</p>
                <p>Model Confidence: ${this.predictionResults.confidence}%</p>
            </div>

            <div class="analysis">
                <h3>Clinical Analysis</h3>
                <p>${this.predictionResults.analysis.summary}</p>
                <p><strong>Clinical Significance:</strong> ${this.predictionResults.analysis.clinicalSignificance}</p>
            </div>

            <div class="recommendations">
                <h3>Clinical Recommendations</h3>
                ${this.predictionResults.recommendations.map(category => `
                    <div class="recommendation-category">
                        <h4>${category.category}</h4>
                        <ul>
                            ${category.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
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
            patientId: this.patientData?.patientId || null,
            results: this.predictionResults,
            inputData: this.currentInputData
        };

        savedPredictions.unshift(predictionRecord);
        localStorage.setItem('savedPredictions', JSON.stringify(savedPredictions.slice(0, 50)));

        this.showToast('Prediction saved to patient records', 'success');
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
        if (riskCtx) {
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
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: textColor, padding: 20 }
                        }
                    }
                }
            });
        }

        // Demographics Chart
        const demoCtx = document.getElementById('demographicsChart');
        if (demoCtx) {
            if (this.charts.demographics) {
                this.charts.demographics.destroy();
            }

            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const textColor = isDark ? '#f3f4f6' : '#111827';

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
                    plugins: {
                        legend: {
                            labels: { color: textColor }
                        }
                    },
                    scales: {
                        x: { ticks: { color: textColor } },
                        y: { ticks: { color: textColor } }
                    }
                }
            });
        }
    }

    initializePopulationCharts() {
        // Age Distribution Chart
        const ageCtx = document.getElementById('ageDistributionChart');
        if (ageCtx) {
            if (this.charts.ageDistribution) {
                this.charts.ageDistribution.destroy();
            }

            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const textColor = isDark ? '#f3f4f6' : '#111827';

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
                    plugins: {
                        legend: {
                            labels: { color: textColor }
                        }
                    },
                    scales: {
                        x: { ticks: { color: textColor } },
                        y: { ticks: { color: textColor } }
                    }
                }
            });
        }

        // Risk Trends Chart
        const trendsCtx = document.getElementById('riskTrendsChart');
        if (trendsCtx) {
            if (this.charts.riskTrends) {
                this.charts.riskTrends.destroy();
            }

            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const textColor = isDark ? '#f3f4f6' : '#111827';

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
                    plugins: {
                        legend: {
                            labels: { color: textColor }
                        }
                    },
                    scales: {
                        x: { ticks: { color: textColor } },
                        y: { ticks: { color: textColor } }
                    }
                }
            });
        }
    }

    updateTimeRange(range) {
        // Update active time button
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-range="${range}"]`).classList.add('active');

        // Update chart data based on range
        // This would typically fetch new data from an API
        console.log(`Updating charts for time range: ${range}`);
    }

    handleResize() {
        // Responsive chart handling
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    // Utility Functions
    setupModalHandlers() {
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });

        // Close modals with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    showModal(title, message, confirmCallback = null) {
        const modal = document.getElementById('confirmationModal');
        if (!modal) return;

        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;

        const confirmBtn = document.getElementById('modalConfirm');
        const cancelBtn = document.getElementById('modalCancel');

        // Remove existing event listeners
        confirmBtn.onclick = null;
        cancelBtn.onclick = null;

        if (confirmCallback) {
            confirmBtn.onclick = () => {
                confirmCallback();
                this.closeModal();
            };
        }

        cancelBtn.onclick = () => this.closeModal();

        modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    showToast(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="toast-icon ${icons[type] || icons.info}"></i>
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

        // Close button handler
        toast.querySelector('.toast-close').onclick = () => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 300);
        };
    }

    setupFormValidation() {
        // Real-time form validation for all inputs
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select, textarea')) {
                this.validateField(e.target);
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const name = field.name;
        let isValid = true;
        let message = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        }

        // Type-specific validation
        else if (value) {
            switch (type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        message = 'Please enter a valid email address';
                    }
                    break;

                case 'tel':
                    const phoneRegex = /^[\(]?[\d\s\)\-\+]{10,}$/;
                    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                        isValid = false;
                        message = 'Please enter a valid phone number';
                    }
                    break;

                case 'number':
                    const num = parseFloat(value);
                    const min = parseFloat(field.getAttribute('min'));
                    const max = parseFloat(field.getAttribute('max'));

                    if (isNaN(num)) {
                        isValid = false;
                        message = 'Please enter a valid number';
                    } else if (!isNaN(min) && num < min) {
                        isValid = false;
                        message = `Value must be at least ${min}`;
                    } else if (!isNaN(max) && num > max) {
                        isValid = false;
                        message = `Value must not exceed ${max}`;
                    }
                    break;
            }
        }

        // Field-specific validation
        if (isValid && value) {
            switch (name) {
                case 'glucose':
                    if (value < 50 || value > 400) {
                        isValid = false;
                        message = 'Glucose level should be between 50-400 mg/dL';
                    }
                    break;
                case 'bmi':
                    if (value < 10 || value > 70) {
                        isValid = false;
                        message = 'BMI should be between 10-70';
                    }
                    break;
                case 'age':
                    if (value < 18 || value > 120) {
                        isValid = false;
                        message = 'Age should be between 18-120 years';
                    }
                    break;
            }
        }

        // Update field appearance
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('success');
            this.clearFieldError(field);
        } else {
            field.classList.remove('success');
            this.showFieldError(field, message);
        }

        return isValid;
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'p':
                        e.preventDefault();
                        if (this.predictionResults) {
                            this.printResults();
                        }
                        break;
                    case 's':
                        e.preventDefault();
                        if (this.predictionResults) {
                            this.savePrediction();
                        }
                        break;
                    case '/':
                        e.preventDefault();
                        document.getElementById('globalSearch')?.focus();
                        break;
                }
            }
        });
    }

    initializeTooltips() {
        // Add tooltips to help elements
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            });

            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        let tooltip = document.getElementById('tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'tooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: var(--gray-900);
                color: white;
                padding: 0.5rem;
                border-radius: 0.375rem;
                font-size: 0.875rem;
                z-index: 1000;
                pointer-events: none;
                max-width: 200px;
            `;
            document.body.appendChild(tooltip);
        }

        tooltip.textContent = text;
        tooltip.style.display = 'block';

        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 5) + 'px';
    }

    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    handleGlobalSearch(query) {
        if (query.length < 2) return;

        // Simulate search functionality
        console.log('Searching for:', query);

        // In a real app, this would search patients, reports, etc.
        const results = this.searchData(query);
        this.displaySearchResults(results);
    }

    searchData(query) {
        // Simulate search results
        const mockResults = [
            { type: 'patient', name: 'John Doe', id: 'MRN-2024-001234' },
            { type: 'report', name: 'Diabetes Risk Report', date: '2024-01-15' },
            { type: 'prediction', name: 'High Risk Assessment', date: '2024-01-10' }
        ];

        return mockResults.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase())
        );
    }

    displaySearchResults(results) {
        // Display search results in a dropdown
        console.log('Search results:', results);
    }

    loadUserPreferences() {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        }

        // Load other preferences
        const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');

        // Apply preferences
        if (preferences.defaultSection) {
            this.showSection(preferences.defaultSection);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Sample data loading functions
window.loadSampleData = function() {
    const app = window.app;
    if (!app) return;

    // Fill prediction form with sample data
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
            app.validateField(input);
        }
    });

    app.showToast('Sample data loaded successfully', 'success');
};

window.generateReport = function() {
    if (window.app && window.app.predictionResults) {
        window.app.generateReport();
    } else {
        window.app.showToast('No prediction results available', 'error');
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

// Global app instance
window.app = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AdvancedHealthcarePlatform();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedHealthcarePlatform;
}