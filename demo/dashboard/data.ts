/* Made-up data for one production line over a day shift. */

/** The hour each value starts at; short, so twelve fit on a phone. */
export const HOURS = [
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
];

/** Units per hour. */
export const THROUGHPUT = {
    actual: [
        1080, 1190, 1240, 1265, 1210, 1302, 980, 1150, 1275, 1290, 1268, 1284,
    ],
    target: [
        1250, 1250, 1250, 1250, 1250, 1250, 1250, 1250, 1250, 1250, 1250, 1250,
    ],
};

export const STATIONS = ['Press', 'Weld', 'Paint', 'Trim', 'Test', 'Pack'];

/** Units since the start of the shift. */
export const OUTPUT = {
    good: [12420, 12310, 12160, 12090, 11980, 11960],
    scrap: [140, 230, 380, 95, 120, 20],
};

export interface Kpi {
    id: string;
    label: string;
    value: string;
    delta: string;
    trend: 'up' | 'down' | 'neutral';
    help: string;
    spark: number[];
    color: string;
}

export const KPIS: Kpi[] = [
    {
        id: 'throughput',
        label: 'Throughput',
        value: '1,284 u/h',
        delta: '4.2%',
        trend: 'up',
        help: 'vs. last shift',
        spark: THROUGHPUT.actual,
        color: 'var(--primary)',
    },
    {
        id: 'oee',
        label: 'OEE',
        value: '82.6%',
        delta: '1.1 pt',
        trend: 'up',
        help: 'target 85%',
        spark: [78, 79, 80, 81, 80, 82, 76, 79, 82, 83, 82, 82.6],
        color: 'var(--tertiary)',
    },
    {
        id: 'downtime',
        label: 'Unplanned downtime',
        value: '18 min',
        delta: '6 min',
        trend: 'neutral',
        help: '1 stop, at 12:00',
        spark: [0, 0, 2, 2, 2, 2, 14, 16, 16, 18, 18, 18],
        color: 'var(--warning)',
    },
    {
        id: 'energy',
        label: 'Energy',
        value: '412 kWh',
        delta: '2.3%',
        trend: 'down',
        help: 'per 1,000 units',
        spark: [36, 35, 35, 34, 34, 33, 35, 34, 33, 33, 32, 32],
        color: 'var(--success)',
    },
];

export type Severity = 'critical' | 'warning' | 'info';

export interface Alarm {
    [key: string]: unknown;
    id: string;
    time: string;
    station: string;
    message: string;
    /** 1 is the most severe, so the column sorts by urgency. */
    level: 1 | 2 | 3;
    severity: Severity;
    status: 'Active' | 'Acknowledged';
}

export const ALARMS: Alarm[] = [
    {
        id: 'a-118',
        time: '14:28',
        station: 'Paint',
        message: 'Booth humidity above 70%',
        level: 2,
        severity: 'warning',
        status: 'Active',
    },
    {
        id: 'a-117',
        time: '14:05',
        station: 'Weld',
        message: 'Electrode tip wear at 92%',
        level: 2,
        severity: 'warning',
        status: 'Active',
    },
    {
        id: 'a-116',
        time: '13:41',
        station: 'Press',
        message: 'Hydraulic pressure drop, line stopped 4 s',
        level: 1,
        severity: 'critical',
        status: 'Active',
    },
    {
        id: 'a-115',
        time: '12:02',
        station: 'Trim',
        message: 'Conveyor jam cleared after 12 min',
        level: 1,
        severity: 'critical',
        status: 'Acknowledged',
    },
    {
        id: 'a-114',
        time: '10:17',
        station: 'Test',
        message: 'Calibration due in 2 days',
        level: 3,
        severity: 'info',
        status: 'Acknowledged',
    },
    {
        id: 'a-113',
        time: '08:50',
        station: 'Pack',
        message: 'Label roll at 15%',
        level: 3,
        severity: 'info',
        status: 'Active',
    },
];
