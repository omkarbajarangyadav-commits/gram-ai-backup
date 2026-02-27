/**
 * Calculates Reference Evapotranspiration (ET0) using the Hargreaves-Samani equation.
 * Simpler to implement than Penman-Monteith when only min/max temps are available.
 * 
 * @param {number} tmin - Minimum daily temperature (°C)
 * @param {number} tmax - Maximum daily temperature (°C)
 * @param {number} ra - Extraterrestrial radiation (MJ m-2 day-1) based on latitude and day of year
 * @returns {number} ET0 (mm/day)
 */
export function calculateET0(tmin, tmax, ra) {
    const tmean = (tmax + tmin) / 2;
    const et0 = 0.0023 * 0.408 * ra * (tmean + 17.8) * Math.sqrt(Math.abs(tmax - tmin));
    return et0; // mm/day
}

/**
 * Calculates crop water requirement.
 * @param {number} et0 - Reference Evapotranspiration (mm/day)
 * @param {number} kc - Crop coefficient (depends on growth stage)
 * @param {number} effectiveRainfall - Rainfall that is effectively entering the soil (mm)
 * @param {number} areaSqm - Area of the farm in square meters
 * @returns {number} Water required in Liters
 */
export function calculateIrrigationRequirement(et0, kc, effectiveRainfall, areaSqm) {
    // Crop evapotranspiration
    const etc = et0 * kc;

    // Net irrigation requirement (mm)
    const netIrrigationReq = etc - effectiveRainfall;

    if (netIrrigationReq <= 0) return 0; // No irrigation needed

    // Convert mm over an area to Liters
    // 1 mm over 1 sq meter = 1 Liter
    return netIrrigationReq * areaSqm;
}
