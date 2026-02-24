// Zip 3-digit prefix → state code
// Covers all 50 states + DC
const ZIP3: Record<string, string> = {};
function r(lo: number, hi: number, st: string) { for (let i = lo; i <= hi; i++) ZIP3[String(i).padStart(3, "0")] = st; }

// New England
r(10, 27, "MA"); r(28, 29, "RI"); r(30, 38, "NH"); r(39, 49, "ME");
r(50, 54, "VT"); r(56, 59, "VT"); r(55, 55, "MA"); // 055 = MA
r(60, 69, "CT");

// Mid-Atlantic
r(70, 89, "NJ"); r(100, 149, "NY");
r(150, 196, "PA"); r(197, 199, "DE");

// DC / South Atlantic
r(200, 205, "DC"); r(206, 219, "MD"); r(220, 246, "VA");
r(247, 268, "WV"); r(270, 289, "NC"); r(290, 299, "SC");
r(300, 319, "GA"); r(398, 399, "GA");
r(320, 349, "FL");
r(350, 369, "AL");
r(370, 385, "TN");
r(386, 397, "MS");

// East North Central
r(400, 427, "KY"); r(430, 458, "OH"); r(460, 479, "IN");
r(480, 499, "MI");

// West North Central
r(500, 528, "IA"); r(530, 549, "WI"); r(550, 567, "MN");
r(570, 577, "SD"); r(580, 588, "ND"); r(590, 599, "MT");

// West South Central
r(600, 629, "IL"); r(630, 658, "MO"); r(660, 679, "KS");
r(680, 693, "NE");
r(700, 714, "LA"); r(716, 729, "AR"); r(730, 749, "OK");
r(750, 799, "TX");

// Mountain
r(800, 816, "CO"); r(820, 831, "WY"); r(832, 838, "ID");
r(840, 847, "UT"); r(850, 865, "AZ"); r(870, 884, "NM");
r(889, 898, "NV");

// Pacific
r(900, 961, "CA"); r(967, 968, "HI"); r(970, 979, "OR");
r(980, 994, "WA"); r(995, 999, "AK");

export function zipToState(zip: string): string | null {
  if (!zip || zip.length < 3) return null;
  return ZIP3[zip.substring(0, 3)] || null;
}
