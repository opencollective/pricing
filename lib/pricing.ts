/**
 * Function to calculate the best tier based on usage metrics
 */
export function calculateBestTier(
  expenses: number,
  collectives: number
): string {
  if (collectives <= 1 && expenses <= 5) {
    return "Free";
  } else if (collectives <= 5 && expenses <= 25) {
    return "Basic S";
  } else if (collectives <= 10 && expenses <= 50) {
    return "Basic M";
  } else if (collectives <= 25 && expenses <= 100) {
    return "Basic L";
  } else if (collectives <= 50 && expenses <= 150) {
    return "Basic XL";
  } else {
    return "Pro";
  }
}
