# 📱 SMS Notification Setup Guide

## Current Status

**SMS Notification System**: ✅ **FULLY IMPLEMENTED**

- ✅ Notification logging system (works now)
- ✅ SMS service integration ready
- ⚠️ Requires Twilio configuration to send actual SMS

---

## How It Works NOW

### **Without Twilio Configuration** (Current State)

When you create an alert with "Send SMS" checked:

1. ✅ Alert is created and saved to Firebase
2. ✅ Recipients are identified from contacts
3. ✅ SMS notification is **logged** in `/notifications` 
4. ✅ System log entry created
5. ⚠️ Message shows: "SMS service not configured. Notification logged"
6. ✅ You can view logged notifications in Firebase Console

**What You See**:
```
Console: "⚠️ SMS service not configured - notification logged"
Toast: "SMS service not configured. Notification logged for future delivery."
```

**Data Saved** (`/notifications/{id}`):
```json
{
  "id": "notification_1736934620",
  "type": "sms",
  "status": "pending",
  "alertId": "alert_...",
  "message": "[CRITICAL] Heavy rainfall detected...",
  "recipients": ["555-0101", "555-0102"],
  "deliveryStatus": "not_configured",
  "note": "SMS service not configured. Would send to: 555-0101, 555-0102"
}
```

### **With Twilio Configured** (After Setup)

Once you configure Twilio:

1. ✅ Alert created and saved
2. ✅ Recipients identified
3. ✅ SMS **actually sent** via Twilio API
4. ✅ Delivery confirmation saved
5. ✅ Success message shows actual sending

**What You'll See**:
```
Console: "✅ SMS sent successfully"
Toast: "SMS sent to 5 recipient(s)!"
```

---

## Setting Up Twilio SMS (Optional)

### **Prerequisites**

1. **Twilio Account** (Free trial available)
2. **Twilio Phone Number** (Get from Twilio console)
3. **Account SID and Auth Token** (From Twilio dashboard)

### **Step 1: Create Twilio Account**

1. Go to https://www.twilio.com/try-twilio
2. Sign up for free account
3. Verify your phone number
4. You get **$15 free credit**

### **Step 2: Get Twilio Phone Number**

1. Log in to Twilio Console
2. Go to **Phone Numbers** → **Buy a number**
3. Select country (e.g., United States)
4. Choose a number with **SMS capabilities**
5. Purchase (uses free credit)

### **Step 3: Get API Credentials**

1. Go to Twilio Console Dashboard
2. Find **Account SID** (starts with `AC...`)
3. Find **Auth Token** (click to reveal)
4. Copy both values

### **Step 4: Configure Environment Variables**

#### **Option A: Create `.env.local` File** (Recommended)

Create file `cloudburst-detection/.env.local`:

```bash
# Twilio SMS Configuration
NEXT_PUBLIC_TWILIO_ENABLED=true
NEXT_PUBLIC_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
NEXT_PUBLIC_TWILIO_PHONE_NUMBER=+1234567890
```

**Important**:
- ✅ `NEXT_PUBLIC_` prefix = accessible in browser
- ✅ No prefix (`TWILIO_AUTH_TOKEN`) = server-side only (more secure)
- ✅ Use actual phone number with country code (+1 for US)

#### **Option B: Use Environment Variables Template**

Copy the provided template:

```bash
# In cloudburst-detection directory
cp .env.local.example .env.local
# Edit .env.local with your Twilio credentials
```

### **Step 5: Restart Development Server**

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### **Step 6: Verify Configuration**

1. Open http://localhost:3000/admin
2. Scroll to "Manual Alert Creation"
3. Look at the blue info box
4. Should show: "✅ SMS service is configured and ready"

---

## Testing SMS Sending

### **Test 1: Check Configuration**

Open browser console (F12):
```javascript
📱 SMS Configuration Status: {
  enabled: true,
  configured: true,
  accountSid: "Set",
  authToken: "Set",
  phoneNumber: "Set",
  status: "Enabled"
}
```

### **Test 2: Send Test Alert**

1. **Add test contact**:
   - Go to http://localhost:3000/contacts
   - Add contact with YOUR phone number
   - Link to a node

2. **Create test alert**:
   - Go to http://localhost:3000/admin
   - Fill in alert form
   - Select node linked to your contact
   - ☑️ Check "Send SMS to recipients"
   - Click "Create & Send Alert"

3. **Watch console logs**:
```javascript
🚨 Creating alert...
✅ Alert saved to Firebase
📱 Sending SMS notifications...
🚀 Attempting SMS send via Twilio...
✅ SMS sent successfully
```

4. **Check your phone** - you should receive SMS!

### **Test 3: Verify in Twilio Console**

1. Go to Twilio Console
2. Navigate to **Messaging** → **Logs**
3. See your sent message
4. Check delivery status

---

## Pricing & Limits

### **Twilio Free Trial**

- **$15 Free Credit** (no credit card required for trial)
- **SMS Cost**: ~$0.0075 per SMS in US
- **Can send**: ~2,000 messages with free credit
- **Limitations**:
  - Can only send to verified phone numbers
  - Must verify recipient numbers in Twilio console

### **After Trial**

- **Pay-as-you-go** pricing
- Add credit card to send to any number
- Same per-message cost

### **Cost Estimates**

| Recipients | Cost per Alert | 100 Alerts |
|------------|----------------|------------|
| 5 contacts | $0.04 | $4.00 |
| 10 contacts | $0.08 | $8.00 |
| 50 contacts | $0.38 | $38.00 |

---

## Troubleshooting

### **"SMS service not configured"**

**Cause**: Environment variables not set

**Solution**:
1. Create `.env.local` file
2. Add Twilio credentials
3. Restart server (`npm run dev`)

### **"Twilio error: Account SID invalid"**

**Cause**: Wrong Account SID or Auth Token

**Solution**:
1. Go to Twilio Console
2. Copy Account SID again (starts with `AC`)
3. Update `.env.local`
4. Restart server

### **"Phone number not verified"**

**Cause**: Using Twilio trial account

**Solution**:
1. Go to Twilio Console
2. **Phone Numbers** → **Verified Caller IDs**
3. Add recipient phone number
4. Verify via code sent to phone
5. Try sending again

### **SMS not received**

**Check**:
1. ✅ Twilio Console logs show "delivered"
2. ✅ Phone number format correct (+1234567890)
3. ✅ Recipient number verified (trial accounts)
4. ✅ Check spam/filtered messages

---

## Environment Variables Reference

### **Required Variables**

```bash
# Enable SMS service
NEXT_PUBLIC_TWILIO_ENABLED=true

# Twilio credentials
NEXT_PUBLIC_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_secret_auth_token

# Your Twilio phone number (with country code)
NEXT_PUBLIC_TWILIO_PHONE_NUMBER=+1234567890
```

### **Variable Explanations**

| Variable | Purpose | Where to Find |
|----------|---------|---------------|
| `TWILIO_ENABLED` | Turn SMS on/off | Set to `true` |
| `ACCOUNT_SID` | Twilio account ID | Console Dashboard |
| `AUTH_TOKEN` | Secret API key | Console Dashboard (click to reveal) |
| `PHONE_NUMBER` | Your Twilio number | Phone Numbers section |

### **Security Notes**

- ✅ `NEXT_PUBLIC_` = Client-side (safe for Account SID, Phone Number)
- ✅ No prefix = Server-side only (keeps Auth Token secret)
- ❌ Never commit `.env.local` to Git
- ✅ `.env.local` is in `.gitignore` by default

---

## Alternative Solutions

### **If You Don't Want SMS**

The system works perfectly without Twilio! You get:

1. ✅ **Notification Logging** - All SMS attempts logged to Firebase
2. ✅ **In-App Notifications** - Created for dashboard
3. ✅ **Alert System** - Fully functional
4. ✅ **Contact Management** - Recipients identified
5. ✅ **Audit Trail** - System logs track everything

**Benefits**:
- Free (no Twilio costs)
- No external dependencies
- Privacy-friendly
- Everything logged in Firebase

### **Other Options**

1. **Email Notifications** (Future feature)
   - Send emails instead of SMS
   - Cheaper than SMS
   - No character limits

2. **Web Push Notifications** (Future feature)
   - Browser notifications
   - Free
   - Real-time

3. **WhatsApp Integration** (Future feature)
   - Via Twilio WhatsApp API
   - Similar to SMS

---

## Notification System Architecture

### **Data Flow**

```
Alert Created
    ↓
Recipients Identified (from contacts)
    ↓
┌─────────────────┬─────────────────┐
│                 │                 │
│   SMS Service   │   In-App        │
│   Configured?   │   Notification  │
│                 │                 │
├─────────────────┼─────────────────┤
│                 │                 │
│   YES → Send    │   Always        │
│   via Twilio    │   Created       │
│                 │                 │
│   NO → Log      │   Saved to      │
│   Notification  │   Firebase      │
│                 │                 │
└─────────────────┴─────────────────┘
    ↓                   ↓
Firebase Notification Log
```

### **Firebase Structure**

```
/notifications
  /{notificationId}
    - id
    - type: "sms" | "in_app"
    - status: "sent" | "pending" | "failed"
    - alertId
    - message
    - recipients: [...]
    - timestamp
    - deliveryStatus
    - deliveryResults (if sent)
```

---

## Advanced Configuration

### **Custom SMS Templates**

Edit `src/lib/notifications.js`:

```javascript
// Customize SMS message format
const smsMessage = `
[${severity.toUpperCase()}]
${message}

Node: ${affectedNodes.join(', ')}
Time: ${new Date().toLocaleString()}

CloudburstAlert System
`;
```

### **Rate Limiting**

Prevent SMS spam:

```javascript
// Add to notifications.js
const recentNotifications = await getRecentNotifications(recipients);
if (recentNotifications.length > 5) {
  throw new Error('Too many notifications in past hour');
}
```

### **Retry Logic**

Auto-retry failed SMS:

```javascript
// Add to notifications.js
let retries = 3;
while (retries > 0) {
  try {
    await sendViaTwilio();
    break;
  } catch (error) {
    retries--;
    if (retries === 0) throw error;
    await sleep(1000);
  }
}
```

---

## Summary

### **Current State (No Twilio)**
- ✅ Alert system fully functional
- ✅ Notifications logged to Firebase
- ✅ In-app notifications created
- ✅ Recipients identified
- ⚠️ SMS logged but not sent

### **With Twilio Configured**
- ✅ Everything above PLUS
- ✅ Actual SMS sent to recipients
- ✅ Delivery confirmation
- ✅ Twilio console logs
- ✅ Professional SMS service

### **Setup Time**
- Twilio account: 5 minutes
- Configuration: 2 minutes
- Testing: 3 minutes
- **Total**: ~10 minutes

### **Cost**
- Trial: Free ($15 credit)
- Per SMS: ~$0.01
- 1000 alerts to 5 people: ~$50

---

## Quick Start Checklist

- [ ] Sign up for Twilio account
- [ ] Get Twilio phone number
- [ ] Copy Account SID and Auth Token
- [ ] Create `.env.local` file
- [ ] Add all 4 environment variables
- [ ] Restart development server
- [ ] Check admin panel info box shows "✅ configured"
- [ ] Add test contact with your phone number
- [ ] Create test alert with SMS enabled
- [ ] Verify SMS received on your phone
- [ ] Check Twilio console logs

---

**Your SMS notification system is ready - just add Twilio credentials to enable!** 📱

Without Twilio: Notifications are logged ✅  
With Twilio: SMS actually sent ✅✅

Both options work perfectly for your alert system!

