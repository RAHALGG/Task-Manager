import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff, CloudUpload } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.dark} 0%, 
    ${theme.palette.primary.main} 50%,
    ${theme.palette.primary.light} 100%)`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at center, 
      rgba(255,255,255,0.1) 0%,
      rgba(255,255,255,0.05) 50%,
      rgba(255,255,255,0) 100%)`,
    zIndex: 1
  }
}));

const RegisterCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  padding: theme.spacing(4),
  maxWidth: 600,
  width: '100%',
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  animation: 'fadeIn 0.5s ease-out'
}));

const steps = ['معلومات المستخدم', 'معلومات الفريق', 'التأكيد'];

const Register = () => {
  const navigate = useNavigate();
  const { register, error } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // معلومات المستخدم
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // معلومات الفريق
    teamOption: 'create', // 'create' or 'join'
    teamName: '',
    teamCode: '',
    teamLogo: null,
    teamRole: 'owner', // 'owner' or 'member'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // مسح رسائل الخطأ عند الكتابة
    setValidationErrors({
      ...validationErrors,
      [name]: ''
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        teamLogo: e.target.files[0]
      }));
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!validateUserInfo()) return;
    } else if (activeStep === 1) {
      if (!validateTeamInfo()) return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const validateUserInfo = () => {
    const errors = {};
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'كلمات المرور غير متطابقة';
    }
    if (formData.password.length < 6) {
      errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateTeamInfo = () => {
    if (formData.teamOption === 'create' && !formData.teamName) {
      setValidationErrors({
        teamName: 'يرجى إدخال اسم الفريق'
      });
      return false;
    }
    if (formData.teamOption === 'join' && !formData.teamCode) {
      setValidationErrors({
        teamCode: 'يرجى إدخال رمز الفريق'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateUserInfo() || !validateTeamInfo()) return;

    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('خطأ في التسجيل:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="الاسم الكامل"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              error={!!validationErrors.name}
              helperText={validationErrors.name}
              dir="rtl"
            />
            <TextField
              fullWidth
              label="البريد الإلكتروني"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              dir="rtl"
            />
            <TextField
              fullWidth
              label="كلمة المرور"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              dir="rtl"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              label="تأكيد كلمة المرور"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
              dir="rtl"
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">اختر خيار الفريق</FormLabel>
              <RadioGroup
                name="teamOption"
                value={formData.teamOption}
                onChange={handleChange}
              >
                <FormControlLabel value="create" control={<Radio />} label="إنشاء فريق جديد" />
                <FormControlLabel value="join" control={<Radio />} label="الانضمام لفريق موجود" />
              </RadioGroup>
            </FormControl>

            {formData.teamOption === 'create' ? (
              <>
                <TextField
                  fullWidth
                  label="اسم الفريق"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!validationErrors.teamName}
                  helperText={validationErrors.teamName}
                />
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ mt: 2, mb: 2 }}
                  fullWidth
                >
                  رفع شعار الفريق
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              </>
            ) : (
              <TextField
                fullWidth
                label="رمز الفريق"
                name="teamCode"
                value={formData.teamCode}
                onChange={handleChange}
                margin="normal"
                required
                error={!!validationErrors.teamCode}
                helperText={validationErrors.teamCode || "اطلب رمز الفريق من مدير الفريق"}
              />
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              مراجعة المعلومات
            </Typography>
            <Typography>الاسم: {formData.name}</Typography>
            <Typography>البريد الإلكتروني: {formData.email}</Typography>
            <Typography>
              الفريق: {formData.teamOption === 'create' ? `إنشاء "${formData.teamName}"` : `الانضمام برمز ${formData.teamCode}`}
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <AuthWrapper>
      <RegisterCard>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          إنشاء حساب جديد
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              السابق
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'إنشاء الحساب'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                التالي
              </Button>
            )}
          </Box>
        </form>

        <Divider sx={{ my: 3 }} />

        <Typography align="center" variant="body2">
          لديك حساب بالفعل؟{' '}
          <Link component={RouterLink} to="/login" color="primary">
            تسجيل الدخول
          </Link>
        </Typography>
      </RegisterCard>
    </AuthWrapper>
  );
};

export default Register; 