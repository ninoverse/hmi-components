/* The inbox's static data: what reached the Line 3 supervisor over a few
   days. Newest first, which is the order the page lists them in. */

export type Category =
    | 'handover'
    | 'maintenance'
    | 'quality'
    | 'safety'
    | 'planning';

export type Team = 'supervisors' | 'maintenance' | 'quality' | 'system';

export type Mailbox = 'inbox' | 'archive' | 'trash';

export interface Message {
    id: number;
    from: string;
    role: string;
    team: Team;
    category: Category;
    subject: string;
    body: string[];
    time: string;
    unread?: boolean;
    flagged?: boolean;
    mention?: boolean;
    attachment?: string;
    mailbox: Mailbox;
}

export const CATEGORIES: { value: Category; label: string }[] = [
    { value: 'handover', label: 'Handover' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'quality', label: 'Quality' },
    { value: 'safety', label: 'Safety' },
    { value: 'planning', label: 'Planning' },
];

export const TEAMS: { value: 'anyone' | Team; label: string }[] = [
    { value: 'anyone', label: 'Anyone' },
    { value: 'supervisors', label: 'Supervisors' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'quality', label: 'Quality' },
    { value: 'system', label: 'The line, automatically' },
];

const CHIARA = { from: 'Chiara Lombardi', role: 'Night-shift supervisor' };
const MARCO = { from: 'Marco Bianchi', role: 'Production manager' };
const GIULIA = { from: 'Giulia Conti', role: 'Maintenance lead' };
const DAVIDE = { from: 'Davide Romano', role: 'Maintenance technician' };
const LUCA = { from: 'Luca Ferri', role: 'Quality engineer' };
const PAOLO = { from: 'Paolo Ricci', role: 'Safety officer' };
const ELENA = { from: 'Elena Moretti', role: 'Production planner' };
const PLC = { from: 'Line 3 PLC', role: 'Automatic message' };

export const MESSAGES: Message[] = [
    {
        id: 1,
        ...CHIARA,
        team: 'supervisors',
        category: 'handover',
        subject: 'Night-shift handover: Line 3',
        body: [
            'Press 2 ran at 94% through the night. Batch 4471 is half done, 1,180 of 2,400 parts, and the counter is in the log.',
            'The scrap bin at station 4 is full and needs emptying before 08:00. @Alessandra the die change on press 1 slipped to 07:30: maintenance has the parts.',
            'The handover sheet is attached, signed on my side.',
        ],
        time: '06:02',
        unread: true,
        mention: true,
        attachment: 'handover-2026-10-20-night.pdf',
        mailbox: 'inbox',
    },
    {
        id: 2,
        ...PLC,
        team: 'system',
        category: 'safety',
        subject: 'Light curtain fault cleared at station 3',
        body: [
            'The light curtain at station 3 tripped three times between 04:10 and 04:25, then reset. No stop was longer than 40 seconds.',
            'If it trips again in the next 24 hours, the station locks out until maintenance signs it off.',
        ],
        time: '05:47',
        unread: true,
        mailbox: 'inbox',
    },
    {
        id: 3,
        ...GIULIA,
        team: 'maintenance',
        category: 'maintenance',
        subject: 'Pump P-2 seal: replacement on Thursday',
        body: [
            'The seal on hydraulic pump P-2 is weeping again. We replace it on Thursday at 14:00, which needs press 2 stopped for two hours.',
            '@Alessandra can you move the batch that would be running? Elena has the plan.',
        ],
        time: 'Yesterday',
        unread: true,
        flagged: true,
        mention: true,
        mailbox: 'inbox',
    },
    {
        id: 4,
        ...LUCA,
        team: 'quality',
        category: 'quality',
        subject: 'Batch 4466: two parts out of tolerance',
        body: [
            'Two parts from batch 4466 measured 0.14 mm of flatness, over the 0.10 mm limit. Both came off press 2 within ten minutes of each other.',
            'The rest of the sample passed. The report is attached; the parts are on hold at the quality bench.',
        ],
        time: 'Yesterday',
        flagged: true,
        attachment: 'batch-4466-report.pdf',
        mailbox: 'inbox',
    },
    {
        id: 5,
        ...ELENA,
        team: 'supervisors',
        category: 'planning',
        subject: 'Next week’s plan for lines 3 and 4',
        body: [
            'Next week Line 3 runs the bracket family on Monday to Wednesday, and the new hinge on Thursday and Friday.',
            'Thursday afternoon is already blocked for the P-2 seal.',
        ],
        time: 'Yesterday',
        unread: true,
        attachment: 'plan-week-44.xlsx',
        mailbox: 'inbox',
    },
    {
        id: 6,
        ...PAOLO,
        team: 'supervisors',
        category: 'safety',
        subject: 'Fire drill on Friday at 10:30',
        body: [
            'There is a fire drill on Friday at 10:30. The lines stop at the alarm and restart once the assembly points have been counted.',
            'Please remind your shift that the east door is closed for the works.',
        ],
        time: 'Yesterday',
        mailbox: 'inbox',
    },
    {
        id: 7,
        ...DAVIDE,
        team: 'maintenance',
        category: 'maintenance',
        subject: 'Cooling fan on press 2 back in service',
        body: [
            'The cooling fan on press 2 is back in service. The bearing was dry; it is greased and the vibration is back to normal.',
        ],
        time: 'Sun',
        mailbox: 'inbox',
    },
    {
        id: 8,
        ...PLC,
        team: 'system',
        category: 'quality',
        subject: 'Batch 4465 complete: 2,400 parts',
        body: [
            'Batch 4465 is complete: 2,400 parts in 7 h 12 min, with 18 scrapped (0.75%).',
        ],
        time: 'Sun',
        mailbox: 'inbox',
    },
    {
        id: 9,
        ...MARCO,
        team: 'supervisors',
        category: 'planning',
        subject: 'October output review on Wednesday',
        body: [
            'We review October’s output on Wednesday at 15:00 in the meeting room by the canteen.',
            '@Alessandra please bring Line 3’s scrap figures by station.',
        ],
        time: 'Sun',
        mention: true,
        mailbox: 'inbox',
    },
    {
        id: 10,
        ...CHIARA,
        team: 'supervisors',
        category: 'handover',
        subject: 'Night-shift handover: Line 3',
        body: [
            'A quiet night. Press 2 stopped twice for the light curtain at station 3, a few seconds each time. Batch 4466 finished at 05:20.',
        ],
        time: 'Sat',
        attachment: 'handover-2026-10-17-night.pdf',
        mailbox: 'inbox',
    },
    {
        id: 11,
        ...LUCA,
        team: 'quality',
        category: 'quality',
        subject: 'New gauge for the bracket family',
        body: [
            'The new go/no-go gauge for the bracket family is at the quality bench. It replaces the old one from Monday; please make sure every operator has seen it.',
        ],
        time: 'Sat',
        mailbox: 'inbox',
    },
    {
        id: 12,
        ...GIULIA,
        team: 'maintenance',
        category: 'maintenance',
        subject: 'Monthly lubrication: lines 3 and 4',
        body: [
            'The monthly lubrication round is on Tuesday during the shift change. Each press needs ten minutes, starting from press 1.',
        ],
        time: 'Fri',
        mailbox: 'inbox',
    },
    {
        id: 13,
        ...PLC,
        team: 'system',
        category: 'safety',
        subject: 'Emergency stop tested at every station',
        body: [
            'The weekly emergency stop test passed at all six stations of Line 3. The longest stop time was 180 ms, at station 5.',
        ],
        time: 'Fri',
        mailbox: 'inbox',
    },
    {
        id: 14,
        ...ELENA,
        team: 'supervisors',
        category: 'planning',
        subject: 'Hinge samples needed by the customer',
        body: [
            'The customer wants 50 samples of the new hinge by the 30th. Could Line 3 run them on Thursday, after the P-2 seal?',
        ],
        time: 'Fri',
        flagged: true,
        mailbox: 'inbox',
    },
    {
        id: 15,
        ...PAOLO,
        team: 'supervisors',
        category: 'safety',
        subject: 'Hearing protection near press 2',
        body: [
            'The last noise survey put press 2 at 87 dB. Hearing protection is now required within the yellow line, and the signs go up tomorrow.',
        ],
        time: 'Thu',
        mailbox: 'inbox',
    },
    {
        id: 16,
        ...DAVIDE,
        team: 'maintenance',
        category: 'maintenance',
        subject: 'Spare die for press 1 has arrived',
        body: [
            'The spare die for press 1 arrived this morning and is in the store, rack C4.',
        ],
        time: 'Thu',
        mailbox: 'inbox',
    },
    {
        id: 17,
        ...CHIARA,
        team: 'supervisors',
        category: 'handover',
        subject: 'Night-shift handover: Line 3',
        body: [
            'Batch 4464 finished at 03:40. The coil on press 2 runs out around 09:00, and the next one is already by the uncoiler.',
        ],
        time: 'Thu',
        mailbox: 'inbox',
    },
    {
        id: 18,
        ...MARCO,
        team: 'supervisors',
        category: 'planning',
        subject: 'Overtime on Saturday',
        body: [
            'We need two operators on Saturday morning to catch up on the bracket order. Please ask your shift and let me know by Thursday.',
        ],
        time: 'Wed',
        mailbox: 'inbox',
    },
    {
        id: 19,
        ...LUCA,
        team: 'quality',
        category: 'quality',
        subject: 'Audit next month: the documents we need',
        body: [
            'The customer audit is on 12 November. Please check that every station has its current work instruction and control plan on display.',
        ],
        time: 'Wed',
        mailbox: 'inbox',
    },
    {
        id: 20,
        ...PLC,
        team: 'system',
        category: 'maintenance',
        subject: 'Tool wear at 80% on press 1',
        body: [
            'The punch on press 1 reached 80% of its expected life: 160,000 of 200,000 strokes. Plan the change within the next three shifts.',
        ],
        time: 'Wed',
        mailbox: 'inbox',
    },
    {
        id: 21,
        ...GIULIA,
        team: 'maintenance',
        category: 'maintenance',
        subject: 'Compressed air leak by station 5',
        body: [
            'There is a compressed air leak on the drop to station 5. We fix it at the next stop; it does not affect the station yet.',
        ],
        time: 'Tue',
        mailbox: 'inbox',
    },
    {
        id: 22,
        ...ELENA,
        team: 'supervisors',
        category: 'planning',
        subject: 'Coil delivery moved to Friday',
        body: [
            'The steel coil delivery moved from Thursday to Friday morning. We have stock for Line 3 until Friday evening.',
        ],
        time: 'Tue',
        mailbox: 'inbox',
    },
    {
        id: 23,
        ...PAOLO,
        team: 'supervisors',
        category: 'safety',
        subject: 'Near miss at the uncoiler',
        body: [
            'An operator’s sleeve caught on the uncoiler guard on Monday. Nobody was hurt; the guard has been extended. Please brief your shift.',
        ],
        time: '13 Oct',
        mailbox: 'archive',
    },
    {
        id: 24,
        ...CHIARA,
        team: 'supervisors',
        category: 'handover',
        subject: 'Night-shift handover: Line 3',
        body: [
            'Press 1 stopped for 25 minutes at 01:10 for a misfeed. Cleared and running.',
        ],
        time: '12 Oct',
        mailbox: 'archive',
    },
    {
        id: 25,
        ...MARCO,
        team: 'supervisors',
        category: 'planning',
        subject: 'September output: thank you',
        body: [
            'Line 3 hit 102% of its September target with the lowest scrap of the plant. Thank you to every shift.',
        ],
        time: '2 Oct',
        mailbox: 'archive',
    },
    {
        id: 26,
        ...PLC,
        team: 'system',
        category: 'quality',
        subject: 'Batch 4410 complete: 2,400 parts',
        body: ['Batch 4410 is complete: 2,400 parts in 7 h 3 min.'],
        time: '1 Oct',
        mailbox: 'archive',
    },
];

/** What the supervisor plans to get through this shift, in order. */
export const PRIORITIES = [
    {
        id: 'die',
        title: 'Die change on press 1',
        subtitle: '07:30, with maintenance',
    },
    {
        id: 'scrap',
        title: 'Empty the scrap bin at station 4',
        subtitle: 'Before 08:00',
    },
    {
        id: 'rejects',
        title: 'Look at the batch 4466 rejects',
        subtitle: 'At the quality bench',
    },
    {
        id: 'sign',
        title: 'Sign the night-shift handover',
        subtitle: 'Sheet in the inbox',
    },
];
