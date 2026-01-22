(function() {
  'use strict';

  const CONFIG = {
    EMAILJS_SERVICE_ID: 'service_dcw4xrc',
    EMAILJS_TEMPLATE_ID: 'template_1dhgumo',
    EMAILJS_PUBLIC_KEY: '8YV-MLuGaexQP1NTh',
    WEBHOOK_URL: 'https://webhook.site/478bdbdc-0563-4059-84fc-4bb7fc5d0d37'
  };

  function getTimestamp() {
    return new Date().toISOString();
  }

  function getVisitorInfo() {
    return fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        return {
          ip: data.ip || 'Unknown',
          country: data.country_name || data.country || 'Unknown',
          city: data.city || 'Unknown',
          region: data.region || 'Unknown',
          timezone: data.timezone || 'Unknown',
          timestamp: getTimestamp()
        };
      })
      .catch(error => {
        console.error('Error fetching visitor info:', error);
        return {
          ip: 'Unknown',
          country: 'Unknown',
          city: 'Unknown',
          region: 'Unknown',
          timezone: 'Unknown',
          timestamp: getTimestamp()
        };
      });
  }

  function sendEmail(visitorInfo) {
    if (CONFIG.EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' ||
        CONFIG.EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
        CONFIG.EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      console.log('EmailJS not configured');
      return Promise.resolve();
    }

    if (typeof emailjs === 'undefined') {
      console.error('EmailJS SDK not loaded');
      return Promise.resolve();
    }

    return emailjs.send(
      CONFIG.EMAILJS_SERVICE_ID,
      CONFIG.EMAILJS_TEMPLATE_ID,
      {
        ip_address: visitorInfo.ip,
        country: visitorInfo.country,
        city: visitorInfo.city,
        region: visitorInfo.region,
        timezone: visitorInfo.timezone,
        timestamp: visitorInfo.timestamp,
        page_url: window.location.href,
        user_agent: navigator.userAgent
      },
      CONFIG.EMAILJS_PUBLIC_KEY
    ).catch(error => {
      console.error('Error sending email:', error);
    });
  }

  function sendToWebhook(visitorInfo) {
    if (CONFIG.WEBHOOK_URL === 'YOUR_WEBHOOK_URL') {
      console.log('Webhook URL not configured');
      return Promise.resolve();
    }

    const data = {
      ip: visitorInfo.ip,
      country: visitorInfo.country,
      city: visitorInfo.city,
      region: visitorInfo.region,
      timezone: visitorInfo.timezone,
      timestamp: visitorInfo.timestamp,
      page_url: window.location.href,
      user_agent: navigator.userAgent
    };

    return fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).catch(error => {
      console.error('Error sending to webhook:', error);
    });
  }

  function trackVisitor() {
    getVisitorInfo()
      .then(visitorInfo => {
        Promise.all([
          sendEmail(visitorInfo),
          sendToWebhook(visitorInfo)
        ]).catch(error => {
          console.error('Error in tracking:', error);
        });
      })
      .catch(error => {
        console.error('Error in visitor tracking:', error);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackVisitor);
  } else {
    trackVisitor();
  }
})();
