export const calculateFairPrice = (sizeCategory, bodyType, distanceKm) => {
    const baseRatePerKm = 35; // INR per KM
  
    const bodyTypeMultipliers = {
      container: 1.1,
      tipper: 1.2,
      open: 1.0,
      tanker: 1.3,
      reefer: 1.4,
      flatbed: 1.05,
      other: 1.0,
    };
  
    const sizeCategoryMultipliers = {
      MINI: 0.7,
      LCV: 1.0,
      MCV: 1.2,
      HCV: 1.4,
      "MULTI-AXLE": 1.6,
    };
  
    const normalizedBodyType = (bodyType || '').toLowerCase();
    const normalizedSizeCategory = (sizeCategory || '').toUpperCase();
  
    const bodyFactor = bodyTypeMultipliers[normalizedBodyType] || 1.0;
    const sizeFactor = sizeCategoryMultipliers[normalizedSizeCategory] || 1.0;
  
    const baseRate = baseRatePerKm;
    const price = baseRate * distanceKm * bodyFactor * sizeFactor;
  
    return {
      baseRate,
      price: Math.round(price),
      bodyFactor,
      sizeFactor,
    };
  };
  