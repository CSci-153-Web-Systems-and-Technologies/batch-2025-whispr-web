export const getCurrentLocation = () => {
  return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
    // 1. Check if browser supports Geolocation
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    // 2. Request position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = "Unknown error";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable it in settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true, // Uses GPS (slower, accurate) instead of IP (fast, inaccurate)
        timeout: 10000,           // Wait max 10 seconds
        maximumAge: 0             // Do not use cached location
      }
    );
  });
};