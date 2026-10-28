import { Department, Resident, Disruption, NotificationRecord } from '../src/types';

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Roads & Transport', contact: '+91 44 2538 0001', departmentType: 'Roads & Transport' },
  { id: 'dept-2', name: 'Chennai Water Supply Board', contact: '+91 44 2845 1122', departmentType: 'Water Department' },
  { id: 'dept-3', name: 'Electricity Distribution Board', contact: '+91 44 2852 3344', departmentType: 'Electricity Department' },
  { id: 'dept-4', name: 'Public Works Department', contact: '+91 44 2536 7788', departmentType: 'Public Works' },
  { id: 'dept-5', name: 'Events & Permits Cell', contact: '+91 44 2539 9900', departmentType: 'Events & Permits' },
];

export const INITIAL_RESIDENTS: Resident[] = [
  // Anna Nagar Residents
  { id: 'res-1', name: 'Arun Kumar', location: 'Anna Nagar West, 2nd Avenue', latitude: 13.0855, longitude: 80.2105, zone: 'Anna Nagar', assignedRoute: 'Route 27', preferredLanguage: 'Tamil', accessibilityNeeds: 'Screen reader friendly', notificationChannel: 'SMS' },
  { id: 'res-2', name: 'Priya Sharma', location: 'Anna Nagar East, 5th Main Rd', latitude: 13.0870, longitude: 80.2160, zone: 'Anna Nagar', assignedRoute: 'Route 40', preferredLanguage: 'English', accessibilityNeeds: 'Large text', notificationChannel: 'App notification' },
  { id: 'res-3', name: 'Rajesh Patel', location: 'Anna Nagar Tower Park Area', latitude: 13.0840, longitude: 80.2120, zone: 'Anna Nagar', assignedRoute: 'Route 42', preferredLanguage: 'Hindi', accessibilityNeeds: 'Standard', notificationChannel: 'Email' },
  { id: 'res-4', name: 'Srinivasan Raman', location: 'Shanti Colony, Anna Nagar', latitude: 13.0830, longitude: 80.2150, zone: 'Anna Nagar', assignedRoute: 'Route 27', preferredLanguage: 'Tamil', accessibilityNeeds: 'High contrast', notificationChannel: 'SMS' },
  { id: 'res-5', name: 'Deepa V', location: 'Anna Nagar Roundtana', latitude: 13.0862, longitude: 80.2140, zone: 'Anna Nagar', assignedRoute: 'Route 19B', preferredLanguage: 'Tamil', accessibilityNeeds: 'Easy-read', notificationChannel: 'App notification' },

  // Adyar Residents
  { id: 'res-6', name: 'Kavitha Murugan', location: 'Adyar Signal Area', latitude: 13.0070, longitude: 80.2575, zone: 'Adyar', assignedRoute: 'Route 19B', preferredLanguage: 'Tamil', accessibilityNeeds: 'Audio-ready', notificationChannel: 'SMS' },
  { id: 'res-7', name: 'David Miller', location: 'Gandhi Nagar, Adyar', latitude: 13.0090, longitude: 80.2550, zone: 'Adyar', assignedRoute: 'Route 47', preferredLanguage: 'English', accessibilityNeeds: 'Standard', notificationChannel: 'Email' },
  { id: 'res-8', name: 'Meena Nair', location: 'Kasturba Nagar, Adyar', latitude: 13.0050, longitude: 80.2530, zone: 'Adyar', assignedRoute: 'Route 19B', preferredLanguage: 'Malayalam', accessibilityNeeds: 'Large text', notificationChannel: 'App notification' },
  { id: 'res-9', name: 'Venkat Rao', location: 'Indira Nagar, Adyar', latitude: 13.0040, longitude: 80.2580, zone: 'Adyar', assignedRoute: 'Route 21G', preferredLanguage: 'Telugu', accessibilityNeeds: 'Standard', notificationChannel: 'SMS' },

  // T Nagar Residents
  { id: 'res-10', name: 'Suresh Chandran', location: 'Pondy Bazaar, T Nagar', latitude: 13.0420, longitude: 80.2345, zone: 'T Nagar', assignedRoute: 'Route 45B', preferredLanguage: 'Tamil', accessibilityNeeds: 'Screen reader friendly', notificationChannel: 'SMS' },
  { id: 'res-11', name: 'Anita Roy', location: 'Usman Road, T Nagar', latitude: 13.0400, longitude: 80.2330, zone: 'T Nagar', assignedRoute: 'Route 47', preferredLanguage: 'Hindi', accessibilityNeeds: 'Easy-read', notificationChannel: 'App notification' },
  { id: 'res-12', name: 'Gopalakrishnan N', location: 'G N Chetty Road, T Nagar', latitude: 13.0440, longitude: 80.2380, zone: 'T Nagar', assignedRoute: 'Route 45B', preferredLanguage: 'Tamil', accessibilityNeeds: 'Standard', notificationChannel: 'Email' },

  // Velachery Residents
  { id: 'res-13', name: 'Lakshmi Narayanan', location: 'Velachery Bypass Road', latitude: 12.9820, longitude: 80.2185, zone: 'Velachery', assignedRoute: 'Route 570', preferredLanguage: 'Tamil', accessibilityNeeds: 'Large text', notificationChannel: 'SMS' },
  { id: 'res-14', name: 'Vikram Singh', location: 'Phoenix Mall Junction, Velachery', latitude: 12.9840, longitude: 80.2170, zone: 'Velachery', assignedRoute: 'Route 21G', preferredLanguage: 'Hindi', accessibilityNeeds: 'Standard', notificationChannel: 'App notification' },
  { id: 'res-15', name: 'Ananya Hegde', location: 'Taramani Link Rd, Velachery', latitude: 12.9800, longitude: 80.2200, zone: 'Velachery', assignedRoute: 'Route 570', preferredLanguage: 'English', accessibilityNeeds: 'High contrast', notificationChannel: 'Email' },

  // Tambaram Residents
  { id: 'res-16', name: 'Karthik Subramanian', location: 'West Tambaram Station Rd', latitude: 12.9250, longitude: 80.1010, zone: 'Tambaram', assignedRoute: 'Route 70', preferredLanguage: 'Tamil', accessibilityNeeds: 'Standard', notificationChannel: 'SMS' },
  { id: 'res-17', name: 'Fatima Zohra', location: 'East Tambaram MPO Area', latitude: 12.9230, longitude: 80.1030, zone: 'Tambaram', assignedRoute: 'Route 70', preferredLanguage: 'English', accessibilityNeeds: 'Audio-ready', notificationChannel: 'App notification' },

  // Porur Residents
  { id: 'res-18', name: 'Manoj Kumar', location: 'Porur Junction, Mount Poonamallee Rd', latitude: 13.0385, longitude: 80.1570, zone: 'Porur', assignedRoute: 'Route 27', preferredLanguage: 'Tamil', accessibilityNeeds: 'Standard', notificationChannel: 'SMS' },
  { id: 'res-19', name: 'Ramesh Sundaram', location: 'Ramachandra Hospital Area, Porur', latitude: 13.0360, longitude: 80.1550, zone: 'Porur', assignedRoute: 'Route 54', preferredLanguage: 'Tamil', accessibilityNeeds: 'Large text', notificationChannel: 'Email' },

  // OMR Corridor Residents
  { id: 'res-20', name: 'Siddharth V', location: 'Kandanchavadi, OMR', latitude: 12.9650, longitude: 80.2450, zone: 'OMR', assignedRoute: 'Route 570', preferredLanguage: 'English', accessibilityNeeds: 'Standard', notificationChannel: 'App notification' },
  { id: 'res-21', name: 'Bhavana Reddy', location: 'Perungudi Toll Plaza, OMR', latitude: 12.9550, longitude: 80.2420, zone: 'OMR', assignedRoute: 'Route 19B', preferredLanguage: 'Telugu', accessibilityNeeds: 'Screen reader friendly', notificationChannel: 'SMS' },
  { id: 'res-22', name: 'Nikhil Prabhu', location: 'Thoraipakkam Junction, OMR', latitude: 12.9350, longitude: 80.2370, zone: 'OMR', assignedRoute: 'Route 570', preferredLanguage: 'English', accessibilityNeeds: 'Easy-read', notificationChannel: 'Email' },

  // Mylapore Residents
  { id: 'res-23', name: 'Sundaramurthy K', location: 'Mada Street, Mylapore', latitude: 13.0340, longitude: 80.2690, zone: 'Mylapore', assignedRoute: 'Route 21G', preferredLanguage: 'Tamil', accessibilityNeeds: 'High contrast', notificationChannel: 'SMS' },
  { id: 'res-24', name: 'Gita R', location: 'Luz Church Road, Mylapore', latitude: 13.0350, longitude: 80.2670, zone: 'Mylapore', assignedRoute: 'Route 45B', preferredLanguage: 'Tamil', accessibilityNeeds: 'Standard', notificationChannel: 'App notification' },

  // --- SPECIFIC EDGE CASE RESIDENTS ---
  // Edge Case 1: Missing location coordinates (location unknown, route match fallback)
  { id: 'res-25', name: 'Harish V (Missing Location Edge Case)', location: 'Unmapped Area (Pending Survey)', latitude: null, longitude: null, zone: 'Anna Nagar', assignedRoute: 'Route 27', preferredLanguage: 'Tamil', accessibilityNeeds: 'Standard', notificationChannel: 'SMS' },
  
  // Edge Case 2: Unsupported language selection (e.g. French, fallback to English)
  { id: 'res-26', name: 'Jean Dupont (Unsupported Language Edge Case)', location: 'Anna Nagar West', latitude: 13.0860, longitude: 80.2110, zone: 'Anna Nagar', assignedRoute: 'Route 40', preferredLanguage: 'French', accessibilityNeeds: 'Standard', notificationChannel: 'Email' },
  
  // Edge Case 3: Missing accessibility preferences (Unknown, fallback to Accessible Default)
  { id: 'res-27', name: 'Radha K (Missing Accessibility Edge Case)', location: 'Adyar Signal', latitude: 13.0068, longitude: 80.2571, zone: 'Adyar', assignedRoute: 'Route 19B', preferredLanguage: 'Tamil', accessibilityNeeds: 'Unknown', notificationChannel: 'SMS' },

  // Edge Case 4: Overlapping disruption recipient (affected by Anna Nagar road closure AND Porur maintenance Route 27)
  { id: 'res-28', name: 'Vijay Anand (Overlapping Disruption Edge Case)', location: 'Anna Nagar 2nd Ave', latitude: 13.0850, longitude: 80.2100, zone: 'Anna Nagar', assignedRoute: 'Route 27', preferredLanguage: 'Tamil', accessibilityNeeds: 'Standard', notificationChannel: 'SMS' },

  // Additional realistic residents to round to 35
  { id: 'res-29', name: 'Sunil Verma', location: 'Anna Nagar East', latitude: 13.0880, longitude: 80.2180, zone: 'Anna Nagar', assignedRoute: 'Route 42', preferredLanguage: 'Hindi', accessibilityNeeds: 'Standard', notificationChannel: 'App notification' },
  { id: 'res-30', name: 'Geetha Swaminathan', location: 'Adyar Depot Area', latitude: 13.0030, longitude: 80.2520, zone: 'Adyar', assignedRoute: 'Route 47', preferredLanguage: 'Tamil', accessibilityNeeds: 'Large text', notificationChannel: 'SMS' },
  { id: 'res-31', name: 'Tariq Ahmed', location: 'T Nagar Bus Terminus', latitude: 13.0410, longitude: 80.2320, zone: 'T Nagar', assignedRoute: 'Route 47', preferredLanguage: 'English', accessibilityNeeds: 'Audio-ready', notificationChannel: 'Email' },
  { id: 'res-32', name: 'Revathi S', location: 'Velachery 100ft Road', latitude: 12.9830, longitude: 80.2160, zone: 'Velachery', assignedRoute: 'Route 21G', preferredLanguage: 'Tamil', accessibilityNeeds: 'Screen reader friendly', notificationChannel: 'SMS' },
  { id: 'res-33', name: 'Daniel Raj', location: 'Tambaram Sanatorium', latitude: 12.9270, longitude: 80.1050, zone: 'Tambaram', assignedRoute: 'Route 70', preferredLanguage: 'English', accessibilityNeeds: 'Standard', notificationChannel: 'App notification' },
  { id: 'res-34', name: 'Swati Joshi', location: 'Porur DLF IT Park', latitude: 13.0370, longitude: 80.1580, zone: 'Porur', assignedRoute: 'Route 54', preferredLanguage: 'Hindi', accessibilityNeeds: 'Standard', notificationChannel: 'Email' },
  { id: 'res-35', name: 'Muralidharan P', location: 'Mylapore Temple Area', latitude: 13.0330, longitude: 80.2680, zone: 'Mylapore', assignedRoute: 'Route 21G', preferredLanguage: 'Tamil', accessibilityNeeds: 'Easy-read', notificationChannel: 'SMS' },
];

export const INITIAL_DISRUPTIONS: Disruption[] = [
  {
    id: 'dis-1',
    title: 'Anna Nagar Main Road Closure & Culvert Repair',
    department: 'Roads & Transport',
    disruptionType: 'Road closure',
    description: 'Emergency culvert repair work on Anna Nagar Main Road requires full road closure between 2nd Avenue and Roundtana.',
    affectedArea: 'Anna Nagar',
    affectedRoutes: ['Route 27', 'Route 40', 'Route 42'],
    latitude: 13.0850,
    longitude: 80.2120,
    radius: 1.5, // 1.5 km radius
    startTime: '2026-09-07T10:00:00.000Z',
    endTime: '2026-09-07T16:00:00.000Z',
    severity: 'High',
    status: 'Active',
    requiresApproval: false,
    approvedBy: 'Officer S. Ramesh',
  },
  {
    id: 'dis-2',
    title: 'Adyar Trunk Pipeline Replacement',
    department: 'Chennai Water Supply Board',
    disruptionType: 'Water interruption',
    description: 'Scheduled replacement of main drinking water feeder pipe in Gandhi Nagar & Kasturba Nagar.',
    affectedArea: 'Adyar',
    affectedRoutes: ['Route 19B'],
    latitude: 13.0067,
    longitude: 80.2570,
    radius: 2.0,
    startTime: '2026-09-07T08:00:00.000Z',
    endTime: '2026-09-07T20:00:00.000Z',
    severity: 'Medium',
    status: 'Active',
    requiresApproval: false,
    approvedBy: 'Officer K. Lakshmi',
  },
  {
    id: 'dis-3',
    title: 'T Nagar Festive Pedestrian Zone & Route Diversion',
    department: 'Events & Permits Cell',
    disruptionType: 'Public event',
    description: 'Pondy Bazaar and Usman Road converted to pedestrian-only zone for cultural festival.',
    affectedArea: 'T Nagar',
    affectedRoutes: ['Route 47', 'Route 45B'],
    latitude: 13.0418,
    longitude: 80.2341,
    radius: 1.2,
    startTime: '2026-09-07T12:00:00.000Z',
    endTime: '2026-09-07T22:00:00.000Z',
    severity: 'Low',
    status: 'Active',
    requiresApproval: false,
    approvedBy: 'Officer M. Sundar',
  },
  {
    id: 'dis-4',
    title: 'Velachery Stormwater Drain Trench Excavation',
    department: 'Public Works Department',
    disruptionType: 'Road construction',
    description: 'Heavy machinery operating on Velachery Bypass Road. One lane closed completely.',
    affectedArea: 'Velachery',
    affectedRoutes: ['Route 570', 'Route 21G'],
    latitude: 12.9815,
    longitude: 80.2180,
    radius: 2.5,
    startTime: '2026-09-07T06:00:00.000Z',
    endTime: '2026-09-08T18:00:00.000Z',
    severity: 'Critical',
    status: 'Active',
    requiresApproval: true,
    approvedBy: 'Superintending Engineer V. Anand',
  },
  {
    id: 'dis-5',
    title: 'Tambaram High-Voltage Transformer Maintenance',
    department: 'Electricity Distribution Board',
    disruptionType: 'Electricity interruption',
    description: 'Urgent maintenance at West Tambaram Substation causing temporary power outage.',
    affectedArea: 'Tambaram',
    affectedRoutes: ['Route 70'],
    latitude: 12.9249,
    longitude: 80.1000,
    radius: 1.8,
    startTime: '2026-09-07T11:00:00.000Z',
    endTime: '2026-09-07T15:00:00.000Z',
    severity: 'High',
    status: 'Active',
    requiresApproval: false,
    approvedBy: 'Officer P. Reddy',
  },
  {
    id: 'dis-6',
    title: 'Porur Flyover Expansion Joint Resurfacing',
    department: 'Roads & Transport',
    disruptionType: 'Utility work',
    description: 'Resurfacing work on Porur junction ramp. Expect heavy traffic delays.',
    affectedArea: 'Porur',
    affectedRoutes: ['Route 27', 'Route 54'],
    latitude: 13.0382,
    longitude: 80.1565,
    radius: 1.5,
    startTime: '2026-09-07T09:00:00.000Z',
    endTime: '2026-09-07T17:00:00.000Z',
    severity: 'Medium',
    status: 'Active',
    requiresApproval: false,
    approvedBy: 'Officer S. Ramesh',
  },
  {
    id: 'dis-7',
    title: 'OMR IT Corridor Fiber Cable Laying Permit',
    department: 'Roads & Transport',
    disruptionType: 'Permit-related closure',
    description: 'Underground optical fiber deployment near Thoraipakkam junction.',
    affectedArea: 'OMR',
    affectedRoutes: ['Route 19B', 'Route 570'],
    latitude: 12.9350,
    longitude: 80.2370,
    radius: 2.0,
    startTime: '2026-09-07T14:00:00.000Z',
    endTime: '2026-09-07T19:00:00.000Z',
    severity: 'Low',
    status: 'Active',
    requiresApproval: false,
    approvedBy: 'Officer R. Balaji',
  },
  {
    id: 'dis-8',
    title: 'Mylapore Temple Tank Annual Procession (Expired)',
    department: 'Events & Permits Cell',
    disruptionType: 'Public event',
    description: 'Religious chariot procession around Mylapore Mada Streets (Edge Case 5 test).',
    affectedArea: 'Mylapore',
    affectedRoutes: ['Route 21G', 'Route 45B'],
    latitude: 13.0339,
    longitude: 80.2686,
    radius: 1.0,
    startTime: '2026-09-06T06:00:00.000Z',
    endTime: '2026-09-06T18:00:00.000Z',
    severity: 'Medium',
    status: 'Expired',
    requiresApproval: false,
    approvedBy: 'Officer M. Sundar',
  },
];
