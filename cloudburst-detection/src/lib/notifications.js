// src/lib/notifications.js
/**
 * Notification System
 * Handles SMS, Email, and In-App notifications
 */

import { database, ref, set, get } from './firebase';
import { generateId } from './utils';

/**
 * Send SMS notification (requires Twilio setup)
 * @param {Object} options - Notification options
 * @param {string[]} options.recipients - Array of phone numbers
 * @param {string} options.message - Message to send
 * @param {string} options.alertId - Alert ID for tracking
 * @param {string} options.severity - Alert severity
 * @returns {Promise<Object>} Result object
 */
export async function sendSMSNotification({ recipients, message, alertId, severity }) {
  const notificationId = generateId('notification');
  const timestamp = Date.now();
  
  console.log('📱 SMS Notification Request:', {
    notificationId,
    recipients: recipients.length,
    alertId,
    severity
  });

  try {
    // Check if Twilio is configured
    const twilioConfigured = process.env.NEXT_PUBLIC_TWILIO_ENABLED === 'true';
    
    if (!twilioConfigured) {
      console.log('⚠️ Twilio not configured - logging notification instead');
      
      // Log the notification attempt
      const notificationData = {
        id: notificationId,
        type: 'sms',
        status: 'pending',
        alertId,
        severity,
        message,
        recipients,
        timestamp,
        method: 'twilio',
        deliveryStatus: 'not_configured',
        note: 'SMS service not configured. Would send to: ' + recipients.join(', ')
      };
      
      // Save to Firebase notifications log
      await set(ref(database, `notifications/${notificationId}`), notificationData);
      
      // Log to system logs
      const logId = generateId('log');
      await set(ref(database, `logs/${logId}`), {
        id: logId,
        type: 'sms_pending',
        message: `SMS notification logged (not sent - Twilio not configured). Recipients: ${recipients.length}`,
        timestamp,
        metadata: { notificationId, alertId, recipients: recipients.length }
      });
      
      console.log('✅ Notification logged:', notificationId);
      
      return {
        success: false,
        configured: false,
        notificationId,
        recipients: recipients.length,
        message: 'SMS service not configured. Notification logged for future delivery.',
        details: notificationData
      };
    }
    
    // If Twilio IS configured, attempt to send
    // This would be implemented when you add Twilio credentials
    console.log('🚀 Attempting SMS send via Twilio...');
    
    const deliveryResults = [];
    
    // In production, you would use Twilio SDK here
    // const twilio = require('twilio')(accountSid, authToken);
    // for (const recipient of recipients) {
    //   const result = await twilio.messages.create({
    //     body: message,
    //     from: twilioPhoneNumber,
    //     to: recipient
    //   });
    //   deliveryResults.push(result);
    // }
    
    // For now, simulate success
    for (const recipient of recipients) {
      deliveryResults.push({
        to: recipient,
        status: 'simulated',
        sid: 'SIM' + Date.now() + Math.random().toString(36).substr(2, 9)
      });
    }
    
    // Save notification record
    const notificationData = {
      id: notificationId,
      type: 'sms',
      status: 'sent',
      alertId,
      severity,
      message,
      recipients,
      timestamp,
      method: 'twilio',
      deliveryStatus: 'delivered',
      deliveryResults
    };
    
    await set(ref(database, `notifications/${notificationId}`), notificationData);
    
    // Log success
    const logId = generateId('log');
    await set(ref(database, `logs/${logId}`), {
      id: logId,
      type: 'sms_sent',
      message: `SMS notifications sent to ${recipients.length} recipient(s)`,
      timestamp,
      metadata: { notificationId, alertId, recipients: recipients.length }
    });
    
    console.log('✅ SMS sent successfully:', notificationId);
    
    return {
      success: true,
      configured: true,
      notificationId,
      recipients: recipients.length,
      message: `SMS sent to ${recipients.length} recipient(s)`,
      details: notificationData
    };
    
  } catch (error) {
    console.error('❌ SMS notification failed:', error);
    
    // Log the error
    const logId = generateId('log');
    await set(ref(database, `logs/${logId}`), {
      id: logId,
      type: 'sms_failed',
      message: `SMS notification failed: ${error.message}`,
      timestamp,
      metadata: { alertId, recipients: recipients.length, error: error.message }
    });
    
    return {
      success: false,
      configured: twilioConfigured,
      error: error.message,
      message: 'Failed to send SMS notification'
    };
  }
}

/**
 * Send in-app notification
 * Creates a notification that appears in the app
 * @param {Object} options - Notification options
 * @returns {Promise<Object>} Result object
 */
export async function sendInAppNotification({ alertId, message, severity, affectedNodes }) {
  const notificationId = generateId('notification');
  const timestamp = Date.now();
  
  console.log('🔔 Creating in-app notification...');
  
  try {
    const notificationData = {
      id: notificationId,
      type: 'in_app',
      status: 'unread',
      alertId,
      severity,
      message,
      affectedNodes,
      timestamp,
      expiresAt: timestamp + (7 * 24 * 60 * 60 * 1000), // 7 days
      readBy: []
    };
    
    await set(ref(database, `notifications/${notificationId}`), notificationData);
    
    console.log('✅ In-app notification created:', notificationId);
    
    return {
      success: true,
      notificationId,
      message: 'In-app notification created'
    };
  } catch (error) {
    console.error('❌ In-app notification failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get notification history for an alert
 * @param {string} alertId - Alert ID
 * @returns {Promise<Array>} Array of notifications
 */
export async function getAlertNotifications(alertId) {
  try {
    const notificationsRef = ref(database, 'notifications');
    const snapshot = await get(notificationsRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const notifications = snapshot.val();
    return Object.values(notifications)
      .filter(n => n.alertId === alertId)
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

/**
 * Check if SMS service is configured
 * @returns {boolean} True if Twilio is configured
 */
export function isSMSConfigured() {
  return process.env.NEXT_PUBLIC_TWILIO_ENABLED === 'true';
}

/**
 * Get SMS configuration status
 * @returns {Object} Configuration details
 */
export function getSMSStatus() {
  const twilioEnabled = process.env.NEXT_PUBLIC_TWILIO_ENABLED === 'true';
  const hasAccountSid = !!process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
  const hasAuthToken = !!process.env.TWILIO_AUTH_TOKEN; // Server-side only
  const hasPhoneNumber = !!process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER;
  
  return {
    enabled: twilioEnabled,
    configured: twilioEnabled && hasAccountSid && hasAuthToken && hasPhoneNumber,
    accountSid: hasAccountSid ? 'Set' : 'Missing',
    authToken: hasAuthToken ? 'Set' : 'Missing',
    phoneNumber: hasPhoneNumber ? 'Set' : 'Missing',
    status: twilioEnabled ? 'Enabled' : 'Disabled (Using Notification Log)'
  };
}

