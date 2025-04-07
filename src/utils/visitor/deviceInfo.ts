
// Get user device and browser information
export const getUserDeviceInfo = (): { device: string | null, browser: string | null } => {
  try {
    const userAgent = navigator.userAgent;
    
    // Simple device detection
    let device = null;
    if (/Mobi|Android/i.test(userAgent)) {
      device = "Mobile";
    } else if (/iPad|Tablet/i.test(userAgent)) {
      device = "Tablet";
    } else {
      device = "Desktop";
    }
    
    // Simple browser detection
    let browser = null;
    if (/Firefox/i.test(userAgent)) {
      browser = "Firefox";
    } else if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) {
      browser = "Chrome";
    } else if (/Edg/i.test(userAgent)) {
      browser = "Edge";
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
      browser = "Safari";
    } else {
      browser = "Other";
    }
    
    return { device, browser };
  } catch (error) {
    console.error("Error detecting device info:", error);
    return { device: null, browser: null };
  }
};
