const formatScaledValue = (value: number): string => {
  const rounded = Math.round(value * 1000) / 1000;
  const whole = Math.floor(rounded);
  const fraction = rounded - whole;
  const epsilon = 0.001;

  if (Math.abs(fraction) < epsilon) {
    return whole.toString();
  }

  if (Math.abs(fraction - 0.25) < epsilon) {
    return whole > 0 ? `${whole} 1/4` : '1/4';
  }

  if (Math.abs(fraction - 0.5) < epsilon) {
    return whole > 0 ? `${whole} 1/2` : '1/2';
  }

  if (Math.abs(fraction - 0.75) < epsilon) {
    return whole > 0 ? `${whole} 3/4` : '3/4';
  }

  return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1).replace(/\.0$/, '');
};

export const scaleAmount = (amount: string, multiplier: number): string => {
  const mixedNumberMatch = amount.match(/^(\d+)\s+(\d+)\/(\d+)\s*(.*)$/);
  if (mixedNumberMatch) {
    const [, whole, numerator, denominator, unit] = mixedNumberMatch;
    const denominatorValue = parseInt(denominator, 10);
    if (denominatorValue === 0) return amount;
    const base = parseInt(whole, 10) + parseInt(numerator, 10) / denominatorValue;
    const formatted = formatScaledValue(base * multiplier);
    return unit ? `${formatted} ${unit}` : formatted;
  }

  const fractionMatch = amount.match(/^(\d+)\/(\d+)\s*(.*)$/);
  if (fractionMatch) {
    const [, numerator, denominator, unit] = fractionMatch;
    const denominatorValue = parseInt(denominator, 10);
    if (denominatorValue === 0) return amount;
    const base = parseInt(numerator, 10) / denominatorValue;
    const formatted = formatScaledValue(base * multiplier);
    return unit ? `${formatted} ${unit}` : formatted;
  }

  const numberMatch = amount.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
  if (!numberMatch) return amount;
  const [, num, unit] = numberMatch;
  const formatted = formatScaledValue(parseFloat(num) * multiplier);
  return unit ? `${formatted} ${unit}` : formatted;
};
