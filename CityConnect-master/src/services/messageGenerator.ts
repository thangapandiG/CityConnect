import { Disruption, Resident, NotificationRecord, SupportedLanguage, AccessibilityPreference } from '../types';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam'];

export function generateBaselineMessage(disruption: Disruption): string {
  return "Please be aware that there is a temporary city service disruption today. Check city updates for more information.";
}

export function generatePersonalizedMessage(
  disruption: Disruption,
  resident: Resident,
  isApiFallback: boolean = false
): {
  message: string;
  language: string;
  accessibilityFormat: AccessibilityPreference;
  isLanguageFallback: boolean;
  isLocationUnknown: boolean;
  isAccessibilityDefault: boolean;
  isApiFallback: boolean;
} {
  // Check Edge Case 2: Unsupported language check
  let selectedLanguage = resident.preferredLanguage;
  let isLanguageFallback = false;

  if (!SUPPORTED_LANGUAGES.includes(selectedLanguage as SupportedLanguage)) {
    selectedLanguage = 'English';
    isLanguageFallback = true;
  }

  // Check Edge Case 3: Missing accessibility preferences
  let selectedAccessibility = resident.accessibilityNeeds;
  let isAccessibilityDefault = false;

  if (!selectedAccessibility || selectedAccessibility === 'Unknown') {
    selectedAccessibility = 'Standard';
    isAccessibilityDefault = true;
  }

  // Check Edge Case 1: Missing location
  const isLocationUnknown = resident.latitude === null || resident.longitude === null;

  // Format action recommendation based on disruption type
  const actionText = getActionText(disruption.disruptionType, selectedLanguage);
  const formattedTimes = formatTimeRange(disruption.startTime, disruption.endTime, selectedLanguage);

  // Generate localized text based on language and priority structure
  let messageContent = '';

  switch (selectedLanguage) {
    case 'Tamil':
      messageContent = generateTamilMessage(disruption, resident, formattedTimes, actionText, selectedAccessibility);
      break;

    case 'Hindi':
      messageContent = generateHindiMessage(disruption, resident, formattedTimes, actionText, selectedAccessibility);
      break;

    case 'Telugu':
      messageContent = generateTeluguMessage(disruption, resident, formattedTimes, actionText, selectedAccessibility);
      break;

    case 'Malayalam':
      messageContent = generateMalayalamMessage(disruption, resident, formattedTimes, actionText, selectedAccessibility);
      break;

    case 'English':
    default:
      messageContent = generateEnglishMessage(disruption, resident, formattedTimes, actionText, selectedAccessibility);
      break;
  }

  return {
    message: messageContent,
    language: selectedLanguage,
    accessibilityFormat: selectedAccessibility,
    isLanguageFallback,
    isLocationUnknown,
    isAccessibilityDefault,
    isApiFallback,
  };
}

function formatTimeRange(startTime: string, endTime: string, lang: string): string {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const startStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (lang === 'Tamil') return `இன்று ${startStr} முதல் ${endStr} வரை`;
    if (lang === 'Hindi') return `आज ${startStr} से ${endStr} तक`;
    if (lang === 'Telugu') return `ఈ రోజు ${startStr} నుండి ${endStr} వరకు`;
    if (lang === 'Malayalam') return `ഇന്ന് ${startStr} മുതൽ ${endStr} വരെ`;
    return `Today, ${startStr} – ${endStr}`;
  } catch (e) {
    return '10:00 AM – 4:00 PM';
  }
}

function getActionText(disruptionType: string, lang: string): string {
  const actions: Record<string, Record<string, string>> = {
    'Road closure': {
      English: 'Please use an alternate route and allow extra travel time.',
      Tamil: 'தயவுசெய்து மாற்று வழியைப் பயன்படுத்தவும் மற்றும் கூடுதல் பயண நேரத்தை திட்டமிடுங்கள்.',
      Hindi: 'कृपया वैकल्पिक मार्ग का उपयोग करें और अतिरिक्त समय रखें।',
      Telugu: 'దయచేసి ప్రత్యామ్నాయ మార్గాన్ని ఉపయోగించండి.',
      Malayalam: 'ദയവായി ഇതര വഴി ഉപയോഗിക്കുക.',
    },
    'Water interruption': {
      English: 'Please store required drinking water in advance.',
      Tamil: 'முன்னதாகவே தேவையான குடிநீரை சேமித்து வைக்கவும்.',
      Hindi: 'कृपया पहले से आवश्यक पेयजल का भंडारण करें।',
      Telugu: 'దయచేసి ముందుగానే అవసరమైన తాగునీటిని నిల్వ చేసుకోండి.',
      Malayalam: 'ദയവായി ആവശ്യത്തിന് കുടിവെള്ളം മുൻകൂട്ടി ശേഖരിക്കുക.',
    },
    'Electricity interruption': {
      English: 'Backup generators recommended. Charge essential electronic devices.',
      Tamil: 'அத்தியாவசிய மின் சாதனங்களை சார்ஜ் செய்து வைக்கவும்.',
      Hindi: 'आवश्यक इलेक्ट्रॉनिक उपकरणों को चार्ज रखें।',
      Telugu: 'అవసరమైన ఎలక్ట్రానిక్ పరికరాలను ఛార్జ్ చేసుకోండి.',
      Malayalam: 'അത്യാവശ്യ ഇലക്ട്രോണിക് ഉപകരണങ്ങൾ ചാർജ്ജ് ചെയ്തു വെക്കുക.',
    },
    'Public event': {
      English: 'Expect crowded pedestrian streets. Public transport recommended.',
      Tamil: 'கூட்ட நெரிசல் இருக்கும். பொதுப் போக்குவரத்தைப் பயன்படுத்தவும்.',
      Hindi: 'सार्वजनिक परिवहन का उपयोग करने की सलाह दी जाती है।',
      Telugu: 'ప్రజా రవాణాను ఉపయోగించమని సూచించబడింది.',
      Malayalam: 'പൊതുഗതാഗതം ഉപയോഗിക്കാൻ നിർദ്ദേശിക്കുന്നു.',
    },
    'Road construction': {
      English: 'Single-lane traffic active. Exercise caution near construction zone.',
      Tamil: 'ஒரு வழிப் பாதை இயங்குகிறது. கட்டுமானப் பகுதி அருகே எச்சரிக்கையுடன் செல்லவும்.',
      Hindi: 'निर्माण क्षेत्र के पास सावधानी बरतें।',
      Telugu: 'నిర్మాణ ప్రాంతం వద్ద జాగ్రత్తగా ఉండండి.',
      Malayalam: 'നിർമ്മാണ പ്രദേശത്തിന് സമീപം ശ്രദ്ധിക്കുക.',
    },
    'Utility work': {
      English: 'Work in progress. Slow down and follow traffic signs.',
      Tamil: 'பணிகள் நடைபெறுகின்றன. மெதுவாகச் சென்று போக்குவரத்து குறிகாட்டிகளைப் பின்தொடரவும்.',
      Hindi: 'कार्य प्रगति पर है। गति धीमी रखें।',
      Telugu: 'పనులు జరుగుతున్నాయి. వేగం తగ్గించండి.',
      Malayalam: 'പ്രവൃത്തി നടക്കുന്നു. വേഗത കുറയ്ക്കുക.',
    },
    'Permit-related closure': {
      English: 'Temporary lane restriction in effect.',
      Tamil: 'தற்காலிக பாதை கட்டுப்பாடு அமலில் உள்ளது.',
      Hindi: 'अस्थायी लेन प्रतिबंध लागू है।',
      Telugu: 'తాత్కాలిక ప్రత్యామ్നాయ మార్గం అమల్లో ఉంది.',
      Malayalam: 'താൽക്കാലിക ഗതാഗത നിയന്ത്രണം ഉണ്ട്.',
    },
  };

  const defaultAction = {
    English: 'Check local guidelines for updates.',
    Tamil: 'மேலதிக தகவலுக்கு உள்ளூர் அறிவிப்புகளைப் பார்க்கவும்.',
    Hindi: 'अद्यतन जानकारी के लिए स्थानीय घोषणाएं देखें।',
    Telugu: 'అప్‌డేట్‌ల కోసం స్థానిక సూచనలను చూడండి.',
    Malayalam: 'അപ്‌ഡേറ്റുകൾക്കായി തദ്ദേശീയ വിവരങ്ങൾ കാണുക.',
  };

  const actionsForType = actions[disruptionType] as Record<string, string> | undefined;
  const defaultActionsMap = defaultAction as Record<string, string>;

  return (actionsForType && actionsForType[lang]) || defaultActionsMap[lang] || defaultAction['English'];
}

function generateEnglishMessage(
  disruption: Disruption,
  resident: Resident,
  formattedTimes: string,
  actionText: string,
  accessibility: AccessibilityPreference
): string {
  const routesStr = disruption.affectedRoutes.join(', ');

  if (accessibility === 'Easy-read') {
    return `NOTICE: ${disruption.title.toUpperCase()}
• WHAT: ${disruption.disruptionType}
• WHERE: ${disruption.affectedArea}
• WHEN: ${formattedTimes}
• BUS ROUTES: ${routesStr}
• WHAT TO DO: ${actionText}
• CONTACT: ${disruption.department}`;
  }

  return `[${disruption.severity.toUpperCase()} PRIORITY ALERT - ${disruption.department.toUpperCase()}]
1. Disruption: ${disruption.title}
2. Affected Location: ${disruption.affectedArea} (${disruption.affectedRoutes.includes(resident.assignedRoute) ? `Your Route ${resident.assignedRoute} is affected` : 'Nearby area affected'})
3. Timing: ${formattedTimes}
4. Affected Routes: ${routesStr}
5. Action Required: ${actionText}
6. Department Helpline: ${disruption.department}`;
}

function generateTamilMessage(
  disruption: Disruption,
  resident: Resident,
  formattedTimes: string,
  actionText: string,
  accessibility: AccessibilityPreference
): string {
  const routesStr = disruption.affectedRoutes.join(', ');

  if (accessibility === 'Easy-read') {
    return `அறிவிப்பு: ${disruption.affectedArea} பகுதியில் சேவை பாதிப்பு
• என்ன நடந்தது: ${disruption.title}
• இடம்: ${disruption.affectedArea}
• நேரம்: ${formattedTimes}
• பாதிக்கப்பட்ட பேருந்து பாதைகள்: ${routesStr}
• நீங்கள் செய்ய வேண்டியது: ${actionText}
• தொடர்பு: ${disruption.department}`;
  }

  return `[${disruption.severity.toUpperCase()} முக்கிய அறிவிப்பு - ${disruption.department}]
1. சேவை பாதிப்பு: ${disruption.title}
2. பாதிக்கப்பட்ட இடம்: ${disruption.affectedArea} (உங்கள் பாதை ${resident.assignedRoute} பாதிக்கப்பட்டுள்ளது)
3. காலம்: ${formattedTimes}
4. பாதிக்கப்பட்ட பேருந்து பாதைகள்: ${routesStr}
5. நடவடிக்கை: ${actionText}
6. உதவி எண் / துறை: ${disruption.department}`;
}

function generateHindiMessage(
  disruption: Disruption,
  resident: Resident,
  formattedTimes: string,
  actionText: string,
  accessibility: AccessibilityPreference
): string {
  const routesStr = disruption.affectedRoutes.join(', ');

  if (accessibility === 'Easy-read') {
    return `सूचना: ${disruption.affectedArea} में सार्वजनिक सेवा व्यवधान
• क्या हुआ: ${disruption.title}
• स्थान: ${disruption.affectedArea}
• समय: ${formattedTimes}
• प्रभावित मार्ग: ${routesStr}
• आपको क्या करना है: ${actionText}
• संपर्क: ${disruption.department}`;
  }

  return `[${disruption.severity.toUpperCase()} महत्वपूर्ण सूचना - ${disruption.department}]
1. व्यवधान: ${disruption.title}
2. प्रभावित क्षेत्र: ${disruption.affectedArea} (आपका मार्ग ${resident.assignedRoute} प्रभावित है)
3. समय: ${formattedTimes}
4. प्रभावित बस मार्ग: ${routesStr}
5. आवश्यक कार्रवाई: ${actionText}
6. हेल्पलाइन / विभाग: ${disruption.department}`;
}

function generateTeluguMessage(
  disruption: Disruption,
  resident: Resident,
  formattedTimes: string,
  actionText: string,
  accessibility: AccessibilityPreference
): string {
  const routesStr = disruption.affectedRoutes.join(', ');

  return `[${disruption.severity.toUpperCase()} ముఖ్యమైన సమాచారం - ${disruption.department}]
1. సేవా ఆటంకం: ${disruption.title}
2. ప్రభావిత ప్రాంతం: ${disruption.affectedArea} (మీ మార్గం ${resident.assignedRoute} ప్రభావితమైంది)
3. సమయం: ${formattedTimes}
4. ప్రభావిత బస్సు మార్గాలు: ${routesStr}
5. చర్య: ${actionText}
6. హెల్ప్‌లైన్: ${disruption.department}`;
}

function generateMalayalamMessage(
  disruption: Disruption,
  resident: Resident,
  formattedTimes: string,
  actionText: string,
  accessibility: AccessibilityPreference
): string {
  const routesStr = disruption.affectedRoutes.join(', ');

  return `[${disruption.severity.toUpperCase()} പ്രധാന അറിയിപ്പ് - ${disruption.department}]
1. തടസ്സം: ${disruption.title}
2. ബാധിക്കപ്പെട്ട പ്രദേശം: ${disruption.affectedArea} (നിങ്ങളുടെ റൂട്ട് ${resident.assignedRoute} ബാധിക്കപ്പെട്ടു)
3. സമയം: ${formattedTimes}
4. ബാധിക്കപ്പെട്ട റൂട്ടുകൾ: ${routesStr}
5. സ്വീകരിക്കേണ്ട നടപടി: ${actionText}
6. ഹെൽപ്പ് ലൈൻ: ${disruption.department}`;
}
