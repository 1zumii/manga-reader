type FilterArray<T> = T extends Array<unknown> ? T : never;
type Thresholds = FilterArray<IntersectionObserverInit["threshold"]>;

const generateObserveThresholds = (stepLength: number): Thresholds => {
  if (stepLength <= 0 || stepLength >= 1) {
    return [];
  }
  const thresholds: Thresholds = [];
  let lastThreshold = 0;
  while (lastThreshold < 1) {
    thresholds.push(lastThreshold);
    lastThreshold += stepLength;
  }
  thresholds.push(1);
  return thresholds;
};

export default generateObserveThresholds;
