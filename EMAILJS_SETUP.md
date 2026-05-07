# EmailJS Setup for SciVerse OTP

## Steps:
1. Go to https://www.emailjs.com
2. Create free account (200 emails/month free)
3. Go to Email Services → Add New Service → Gmail
4. Connect your Gmail account
5. Go to Email Templates → Create New Template
6. Use this template:

**Subject**: SciVerse — Your Password Reset OTP

**Body**:
```text
Hello {{user_name}},

Your OTP for password reset is:

{{otp_code}}

This code expires in {{expiry_time}}.

If you did not request this, ignore this email.

— SciVerse Team
```

7. Copy these values to your `.env` file in the project root:
```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx  
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

Note: The free tier allows 200 emails/month. For a student app, this should be sufficient.
