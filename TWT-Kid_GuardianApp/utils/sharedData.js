import * as Keychain from 'react-native-keychain';

let cachedDeviceID = null; // Cache variable to store the device ID

export const getDeviceID = async () => {
  // Return cached device ID if available
  if (cachedDeviceID) {
    console.log('Using cached Device ID:', cachedDeviceID);
    return cachedDeviceID;
  }

  try {
    // Retrieve the device ID stored in Keychain with the label 'adtoken'
    const credentials = await Keychain.getGenericPassword({ service: 'deviceId' });

    if (credentials) {
      const deviceId = credentials.password;  // The device ID is stored as the password
      console.log('Device ID retrieved from Keychain:', deviceId);
      
      // Store the retrieved device ID in cache
      cachedDeviceID = deviceId;  
      return deviceId;  // Return the deviceId
    
    } else {
      console.log('No device ID found for label: deviceId');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving device ID from Keychain:', error);
    return null;
  }
};

export const getCountryCodes = () => {
  return [
    { code: "+1", country: "US", flag: "🇺🇸" },
    { code: "+1", country: "CA", flag: "🇨🇦" },
    { code: "+93", country: "AF", flag: "🇦🇫" },
    { code: "+355", country: "AL", flag: "🇦🇱" },
    { code: "+213", country: "DZ", flag: "🇩🇿" },
    { code: "+1-684", country: "AS", flag: "🇦🇸" },
    { code: "+376", country: "AD", flag: "🇦🇩" },
    { code: "+244", country: "AO", flag: "🇦🇴" },
    { code: "+1-264", country: "AI", flag: "🇦🇮" },
    { code: "+672", country: "AQ", flag: "🇦🇶" },
    { code: "+1264", country: "AG", flag: "🇦🇬" },
    { code: "+54", country: "AR", flag: "🇦🇷" },
    { code: "+374", country: "AM", flag: "🇦🇲" },
    { code: "+297", country: "AW", flag: "🇦🇼" },
    { code: "+61", country: "AU", flag: "🇦🇺" },
    { code: "+43", country: "AT", flag: "🇦🇹" },
    { code: "+994", country: "AZ", flag: "🇦🇿" },
    { code: "+1-242", country: "BS", flag: "🇧🇸" },
    { code: "+973", country: "BH", flag: "🇧🇭" },
    { code: "+880", country: "BD", flag: "🇧🇩" },
    { code: "+1-246", country: "BB", flag: "🇧🇧" },
    { code: "+375", country: "BY", flag: "🇧🇾" },
    { code: "+32", country: "BE", flag: "🇧🇪" },
    { code: "+501", country: "BZ", flag: "🇧🇿" },
    { code: "+229", country: "BJ", flag: "🇧🇯" },
    { code: "+1-441", country: "BM", flag: "🇧🇲" },
    { code: "+975", country: "BT", flag: "🇧🇹" },
    { code: "+591", country: "BO", flag: "🇧🇴" },
    { code: "+387", country: "BA", flag: "🇧🇦" },
    { code: "+267", country: "BW", flag: "🇧🇼" },
    { code: "+55", country: "BR", flag: "🇧🇷" },
    { code: "+246", country: "IO", flag: "🇮🇴" },
    { code: "+1-284", country: "VG", flag: "🇻🇬" },
    { code: "+673", country: "BN", flag: "🇧🇳" },
    { code: "+359", country: "BG", flag: "🇧🇬" },
    { code: "+226", country: "BF", flag: "🇧🇫" },
    { code: "+257", country: "BI", flag: "🇧🇮" },
    { code: "+855", country: "KH", flag: "🇰🇭" },
    { code: "+237", country: "CM", flag: "🇨🇲" },
    { code: "+1", country: "CA", flag: "🇨🇦" },
    { code: "+238", country: "CV", flag: "🇨🇻" },
    { code: "+1-345", country: "KY", flag: "🇰🇾" },
    { code: "+236", country: "CF", flag: "🇨🇫" },
    { code: "+235", country: "TD", flag: "🇹🇩" },
    { code: "+56", country: "CL", flag: "🇨🇱" },
    { code: "+86", country: "CN", flag: "🇨🇳" },
    { code: "+61", country: "CX", flag: "🇨🇽" },
    { code: "+61", country: "CC", flag: "🇨🇨" },
    { code: "+57", country: "CO", flag: "🇨🇴" },
    { code: "+269", country: "KM", flag: "🇰🇲" },
    { code: "+243", country: "CD", flag: "🇨🇩" },
    { code: "+242", country: "CG", flag: "🇨🇬" },
    { code: "+682", country: "CK", flag: "🇨🇰" },
    { code: "+506", country: "CR", flag: "🇨🇷" },
    { code: "+225", country: "CI", flag: "🇨🇮" },
    { code: "+385", country: "HR", flag: "🇭🇷" },
    { code: "+53", country: "CU", flag: "🇨🇺" },
    { code: "+599", country: "CW", flag: "🇨🇼" },
    { code: "+537", country: "CY", flag: "🇨🇾" },
    { code: "+420", country: "CZ", flag: "🇨🇿" },
    { code: "+45", country: "DK", flag: "🇩🇰" },
    { code: "+253", country: "DJ", flag: "🇩🇯" },
    { code: "+1-767", country: "DM", flag: "🇩🇲" },
    { code: "+1-809", country: "DO", flag: "🇩🇴" },
    { code: "+593", country: "EC", flag: "🇪🇨" },
    { code: "+20", country: "EG", flag: "🇪🇬" },
    { code: "+503", country: "SV", flag: "🇸🇻" },
    { code: "+240", country: "GQ", flag: "🇬🇶" },
    { code: "+291", country: "ER", flag: "🇪🇷" },
    { code: "+372", country: "EE", flag: "🇪🇪" },
    { code: "+251", country: "ET", flag: "🇪🇹" },
    { code: "+500", country: "FK", flag: "🇫🇰" },
    { code: "+298", country: "FO", flag: "🇫🇴" },
    { code: "+679", country: "FJ", flag: "🇫🇯" },
    { code: "+358", country: "FI", flag: "🇫🇮" },
    { code: "+33", country: "FR", flag: "🇫🇷" },
    { code: "+594", country: "GF", flag: "🇬🇫" },
    { code: "+689", country: "PF", flag: "🇵🇫" },
    { code: "+241", country: "GA", flag: "🇬🇦" },
    { code: "+220", country: "GM", flag: "🇬🇲" },
    { code: "+995", country: "GE", flag: "🇬🇪" },
    { code: "+49", country: "DE", flag: "🇩🇪" },
    { code: "+233", country: "GH", flag: "🇬🇭" },
    { code: "+350", country: "GI", flag: "🇬🇮" },
    { code: "+30", country: "GR", flag: "🇬🇷" },
    { code: "+299", country: "GL", flag: "🇬🇱" },
    { code: "+1-473", country: "GD", flag: "🇬🇩" },
    { code: "+590", country: "GP", flag: "🇬🇵" },
    { code: "+1-671", country: "GU", flag: "🇬🇺" },
    { code: "+502", country: "GT", flag: "🇬🇹" },
    { code: "+44-1481", country: "GG", flag: "🇬🇬" },
    { code: "+224", country: "GN", flag: "🇬🇳" },
    { code: "+245", country: "GW", flag: "🇬🇼" },
    { code: "+592", country: "GY", flag: "🇬🇾" },
    { code: "+509", country: "HT", flag: "🇭🇹" },
    { code: "+0", country: "HM", flag: "🇭🇲" },
    { code: "+504", country: "HN", flag: "🇭🇳" },
    { code: "+36", country: "HU", flag: "🇭🇺" },
    { code: "+354", country: "IS", flag: "🇮🇸" },
    { code: "+91", country: "IN", flag: "🇮🇳" },
    { code: "+62", country: "ID", flag: "🇮🇩" },
    { code: "+98", country: "IR", flag: "🇮🇷" },
    { code: "+964", country: "IQ", flag: "🇮🇶" },
    { code: "+353", country: "IE", flag: "🇮🇪" },
    { code: "+44", country: "IM", flag: "🇮🇲" },
    { code: "+972", country: "IL", flag: "🇮🇱" },
    { code: "+39", country: "IT", flag: "🇮🇹" },
    { code: "+1-876", country: "JM", flag: "🇯🇲" },
    { code: "+81", country: "JP", flag: "🇯🇵" },
    { code: "+44", country: "JE", flag: "🇯🇪" },
    { code: "+962", country: "JO", flag: "🇯🇴" },
    { code: "+7", country: "KZ", flag: "🇰🇿" },
    { code: "+254", country: "KE", flag: "🇰🇪" },
    { code: "+686", country: "KI", flag: "🇰🇮" },
    { code: "+850", country: "KP", flag: "🇰🇵" },
    { code: "+82", country: "KR", flag: "🇰🇷" },
    { code: "+383", country: "XK", flag: "🇽🇰" },
    { code: "+965", country: "KW", flag: "🇰🇼" },
    { code: "+996", country: "KG", flag: "🇰🇬" },
    { code: "+856", country: "LA", flag: "🇱🇦" },
    { code: "+371", country: "LV", flag: "🇱🇻" },
    { code: "+961", country: "LB", flag: "🇱🇧" },
    { code: "+266", country: "LS", flag: "🇱🇸" },
    { code: "+231", country: "LR", flag: "🇱🇷" },
    { code: "+218", country: "LY", flag: "🇱🇾" },
    { code: "+423", country: "LI", flag: "🇱🇮" },
    { code: "+370", country: "LT", flag: "🇱🇹" },
    { code: "+352", country: "LU", flag: "🇱🇺" },
    { code: "+853", country: "MO", flag: "🇲🇴" },
    { code: "+389", country: "MK", flag: "🇲🇰" },
    { code: "+261", country: "MG", flag: "🇲🇬" },
    { code: "+265", country: "MW", flag: "🇲🇼" },
    { code: "+60", country: "MY", flag: "🇲🇾" },
    { code: "+960", country: "MV", flag: "🇲🇻" },
    { code: "+223", country: "ML", flag: "🇲🇱" },
    { code: "+356", country: "MT", flag: "🇲🇹" },
    { code: "+692", country: "MH", flag: "🇲🇭" },
    { code: "+222", country: "MR", flag: "🇲🇷" },
    { code: "+230", country: "MU", flag: "🇲🇺" },
    { code: "+262", country: "YT", flag: "🇾🇹" },
    { code: "+52", country: "MX", flag: "🇲🇽" },
    { code: "+691", country: "FM", flag: "🇫🇲" },
    { code: "+373", country: "MD", flag: "🇲🇩" },
    { code: "+377", country: "MC", flag: "🇲🇨" },
    { code: "+976", country: "MN", flag: "🇲🇳" },
    { code: "+382", country: "ME", flag: "🇲🇪" },
    { code: "+1-664", country: "MS", flag: "🇲🇸" },
    { code: "+212", country: "MA", flag: "🇲🇦" },
    { code: "+258", country: "MZ", flag: "🇲🇿" },
    { code: "+95", country: "MM", flag: "🇲🇲" },
    { code: "+264", country: "NA", flag: "🇳🇦" },
    { code: "+674", country: "NR", flag: "🇳🇷" },
    { code: "+977", country: "NP", flag: "🇳🇵" },
    { code: "+31", country: "NL", flag: "🇳🇱" },
    { code: "+599", country: "BQ", flag: "🇧🇶" },
    { code: "+687", country: "NC", flag: "🇳🇨" },
    { code: "+64", country: "NZ", flag: "🇳🇿" },
    { code: "+505", country: "NI", flag: "🇳🇮" },
    { code: "+227", country: "NE", flag: "🇳🇪" },
    { code: "+234", country: "NG", flag: "🇳🇬" },
    { code: "+683", country: "NU", flag: "🇳🇺" },
    { code: "+672", country: "NF", flag: "🇳🇫" },
    { code: "+1-670", country: "MP", flag: "🇲🇵" },
    { code: "+47", country: "NO", flag: "🇳🇴" },
    { code: "+968", country: "OM", flag: "🇴🇲" },
    { code: "+92", country: "PK", flag: "🇵🇰" },
    { code: "+680", country: "PW", flag: "🇵🇼" },
    { code: "+970", country: "PS", flag: "🇵🇸" },
    { code: "+507", country: "PA", flag: "🇵🇦" },
    { code: "+675", country: "PG", flag: "🇵🇬" },
    { code: "+595", country: "PY", flag: "🇵🇾" },
    { code: "+51", country: "PE", flag: "🇵🇪" },
    { code: "+63", country: "PH", flag: "🇵🇭" },
    { code: "+48", country: "PL", flag: "🇵🇱" },
    { code: "+351", country: "PT", flag: "🇵🇹" },
    { code: "+1-787", country: "PR", flag: "🇵🇷" },
    { code: "+974", country: "QA", flag: "🇶🇦" },
    { code: "+40", country: "RO", flag: "🇷🇴" },
    { code: "+7", country: "RU", flag: "🇷🇺" },
    { code: "+250", country: "RW", flag: "🇷🇼" },
    { code: "+1-684", country: "WS", flag: "🇼🇸" },
    { code: "+685", country: "SM", flag: "🇸🇲" },
    { code: "+378", country: "VA", flag: "🇻🇦" },
    { code: "+239", country: "ST", flag: "🇸🇹" },
    { code: "+966", country: "SA", flag: "🇸🇦" },
    { code: "+221", country: "SN", flag: "🇸🇳" },
    { code: "+381", country: "RS", flag: "🇷🇸" },
    { code: "+248", country: "SC", flag: "🇸🇨" },
    { code: "+232", country: "SL", flag: "🇸🇱" },
    { code: "+65", country: "SG", flag: "🇸🇬" },
    { code: "+1-721", country: "SX", flag: "🇸🇽" },
    { code: "+421", country: "SK", flag: "🇸🇰" },
    { code: "+386", country: "SI", flag: "🇸🇮" },
    { code: "+677", country: "SB", flag: "🇸🇧" },
    { code: "+252", country: "SO", flag: "🇸🇴" },
    { code: "+27", country: "ZA", flag: "🇿🇦" },
    { code: "+211", country: "SS", flag: "🇸🇸" },
    { code: "+34", country: "ES", flag: "🇪🇸" },
    { code: "+94", country: "LK", flag: "🇱🇰" },
    { code: "+249", country: "SD", flag: "🇸🇩" },
    { code: "+597", country: "SR", flag: "🇸🇷" },
    { code: "+46", country: "SE", flag: "🇸🇪" },
    { code: "+41", country: "CH", flag: "🇨🇭" },
    { code: "+963", country: "SY", flag: "🇸🇾" },
    { code: "+886", country: "TW", flag: "🇹🇼" },
    { code: "+992", country: "TJ", flag: "🇹🇯" },
    { code: "+255", country: "TZ", flag: "🇹🇿" },
    { code: "+66", country: "TH", flag: "🇹🇭" },
    { code: "+670", country: "TL", flag: "🇹🇱" },
    { code: "+228", country: "TG", flag: "🇹🇬" },
    { code: "+690", country: "TK", flag: "🇹🇰" },
    { code: "+676", country: "TO", flag: "🇹🇴" },
    { code: "+1-868", country: "TT", flag: "🇹🇹" },
    { code: "+216", country: "TN", flag: "🇹🇳" },
    { code: "+90", country: "TR", flag: "🇹🇷" },
    { code: "+993", country: "TM", flag: "🇹🇲" },
    { code: "+1649", country: "TC", flag: "🇹🇨" },
    { code: "+688", country: "TV", flag: "🇹🇻" },
    { code: "+256", country: "UG", flag: "🇺🇬" },
    { code: "+380", country: "UA", flag: "🇺🇦" },
    { code: "+971", country: "AE", flag: "🇦🇪" },
    { code: "+44-1624", country: "GB", flag: "🇬🇧" },
    { code: "+1", country: "US", flag: "🇺🇸" },
    { code: "+598", country: "UY", flag: "🇺🇾" },
    { code: "+998", country: "UZ", flag: "🇺🇿" },
    { code: "+678", country: "VU", flag: "🇻🇺" },
    { code: "+58", country: "VE", flag: "🇻🇪" },
    { code: "+84", country: "VN", flag: "🇻🇳" },
    { code: "+1-284", country: "VG", flag: "🇻🇬" },
    { code: "+1-340", country: "VI", flag: "🇻🇮" },
    { code: "+681", country: "WF", flag: "🇼🇫" },
    { code: "+685", country: "WS", flag: "🇼🇸" },
    { code: "+967", country: "YE", flag: "🇾🇪" },
    { code: "+260", country: "ZM", flag: "🇿🇲" },
    { code: "+263", country: "ZW", flag: "🇿🇼" },
  ];
}