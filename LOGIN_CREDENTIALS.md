# 🔐 Cars.na - Login Credentials Reference

**⚠️ IMPORTANT SECURITY NOTE**: This file contains test credentials for development and testing purposes only. Do NOT use these credentials in production environments.

---

## 🏠 **WEBSITE ACCESS**

**Local Development**: http://localhost:3000
**Network Access**: http://192.168.1.109:3000
**Production URL**: [Update with actual domain]

---

## 👤 **USER ACCOUNTS**

### **Regular User Account**
```
Email:    test@example.com
Password: password123
Role:     Standard User
Access:   Browse vehicles, save favorites, contact dealers
```

### **Test User Account 2**
```
Email:    user@example.com
Password: user123
Role:     Standard User
Access:   Browse vehicles, inquiries, profile management
```

---

## 🏪 **DEALER ACCOUNTS**

### **Premium Motors Dealer**
```
Email:    dealer@premium-motors.com
Password: dealer123
Role:     Dealer
Access:   Dealer dashboard, vehicle management, analytics
Subscription: Premium tier
```

### **City Cars Dealer**
```
Email:    dealer@citycars.na
Password: dealer123
Role:     Dealer
Access:   Dealer dashboard, basic features
Subscription: Basic tier
```

### **Sales Executive Account**
```
Email:    sales@citycars.na
Password: sales123
Role:     Sales Executive
Access:   Sales dashboard, lead management, customer inquiries
```

---

## 🛡️ **ADMIN ACCOUNTS**

### **Main Admin Account**
```
Email:    admin@cars.na
Password: admin123
Role:     Administrator
Access:   Full admin panel, user management, system settings
```

### **Super Admin Account**
```
Email:    superadmin@cars.na
Password: superadmin123
Role:     Super Administrator
Access:   Complete system access, server management, database admin
```

### **Content Moderator**
```
Email:    moderator@cars.na
Password: moderator123
Role:     Content Moderator
Access:   Vehicle approval, content moderation, user reports
```

---

## 🔗 **LOGIN URLS**

### **Public Authentication**
- **User Login**: http://localhost:3000/auth/login
- **User Registration**: http://localhost:3000/auth/register
- **Dealer Registration**: http://localhost:3000/dealers/register

### **Admin Authentication**
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Auth Page**: http://localhost:3000/admin-auth

### **Dashboard Access** (Post-Login)
- **User Dashboard**: http://localhost:3000/dashboard
- **Dealer Dashboard**: http://localhost:3000/dealer/dashboard
- **Dealer Analytics**: http://localhost:3000/dealer/analytics
- **Add Vehicle**: http://localhost:3000/dealer/add-vehicle
- **Admin Panel**: http://localhost:3000/admin

---

## 🔑 **API TESTING CREDENTIALS**

### **Database Access** (If needed for testing)
```
Database: cars_na_development
Username: [Check .env file]
Password: [Check .env file]
Host: localhost
Port: 5432 (PostgreSQL) / 3306 (MySQL)
```

### **Payment Testing** (Paystack)
```
Test Public Key: pk_test_... (from .env)
Test Secret Key: sk_test_... (from .env)
Webhook Secret: [from .env]
Test Card: 4084084084084081 (Paystack test card)
CVV: 408
PIN: 0000
```

---

## 📧 **EMAIL TESTING ACCOUNTS**

### **Email Service Configuration**
```
SMTP Server: [Check email service config]
Test Email 1: testuser1@cars.na
Test Email 2: testuser2@cars.na
Admin Email: admin-notifications@cars.na
```

---

## 🧪 **TESTING SCENARIOS**

### **User Journey Testing**
1. **New User Flow**: Register → Browse → Save Vehicle → Contact Dealer
2. **Dealer Flow**: Register → Setup Profile → Add Vehicles → Manage Inquiries
3. **Admin Flow**: Login → Approve Dealers → Moderate Content → Manage Users

### **Payment Testing**
1. **Subscription Flow**: Choose Plan → Enter Details → Process Payment → Activate
2. **Failed Payment**: Test declined cards → Error handling → Retry flow

---

## ⚠️ **SECURITY REMINDERS**

- ✅ These are **TEST CREDENTIALS ONLY**
- ✅ Change all passwords before production deployment
- ✅ Use strong, unique passwords for production
- ✅ Enable 2FA for admin accounts in production
- ✅ Regularly rotate API keys and secrets
- ✅ Never commit real credentials to version control

---

## 🔄 **PASSWORD RESET TESTING**

### **Reset Flow Testing**
```
1. Go to forgot password page
2. Enter test email addresses above
3. Check email service logs/console
4. Test reset token validation
5. Verify new password setting
```

---

**Last Updated**: September 25, 2025
**Environment**: Development/Testing
**Status**: Ready for comprehensive testing

---

**📝 QUICK COPY-PASTE LOGINS**:
```
User:     test@example.com / password123
Dealer:   dealer@premium-motors.com / dealer123
Admin:    admin@cars.na / admin123
```