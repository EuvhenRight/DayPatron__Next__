// third party
import { v4 as UIDV4 } from 'uuid';

export const invoice = [
  {
    id: 1,
    invoice_id: Date.now() + 1,
    company_name: 'OopKop',
    company_email: 'tass23@gmail.com',
    company_avatar: 5,
    mission_name: 'Rebranding OopKop	',
    discount: 0.5,
    tax: 0.2,
    invoice_date: '2022-01-05',
    due_date: '2022-01-10',
    total_amount: 40570,
    status: 'Paid',
    notes: '',
    cashierInfo: {
      name: 'Ian Carpenter',
      address: '1754 Ureate, RhodSA5 5BO',
      phone: '+91 1234567890',
      email: 'iacrpt65@gmail.com'
    },
    customerInfo: {
      name: 'Belle J. Richter',
      address: '1300 Mine RoadQuemado, NM 87829',
      phone: '305-829-7809',
      email: 'belljrc23@gmail.com'
    },
    invoice_detail: [
      {
        id: UIDV4(),
        name: 'Apple Series 4 GPS A38 MM Space',
        qty: 3,
        description: 'Apple Watch SE Smartwatch',
        price: 275
      },
      {
        id: UIDV4(),
        name: 'Boat On-Ear Wireless',
        description: 'Mic(Bluetooth 4.2, Rockerz 450R...',
        qty: 45,
        price: 81.99
      },
      {
        id: UIDV4(),
        name: 'Fitbit MX30 Smart Watch',
        description: '(MX30- waterproof) watch',
        qty: 70,
        price: 85.0
      }
    ]
  },
  {
    id: 2,
    invoice_id: Date.now() + 2,
    company_name: 'OopKop',
    company_email: 'aabsl32@gmail.com',
    company_avatar: 4,
    mission_name: 'Create launchcampaign rebranding	',
    invoice_date: '2022-07-15',
    due_date: '2022-07-20',
    total_amount: 180139,
    discount: 0,
    tax: 0.8,
    status: 'Unpaid',
    notes: '',
    cashierInfo: {
      name: 'Belle J. Richter',
      address: '1300 Mine RoadQuemado, NM 87829',
      phone: '305-829-7809',
      email: 'belljrc23@gmail.com'
    },
    customerInfo: {
      name: 'Ian Carpenter',
      address: '1754 Ureate, RhodSA5 5BO',
      phone: '+91 1234567890',
      email: 'iacrpt65@gmail.com'
    },
    invoice_detail: [
      {
        id: UIDV4(),
        name: 'Luxury Watches Centrix Gold',
        description: '7655 Couple (Refurbished)...',
        qty: 3,
        price: 29.99
      },
      {
        id: UIDV4(),
        name: 'Canon EOS 1500D 24.1 Digital SLR',
        description: 'SLR Camera (Black) with EF S18-55...',
        qty: 50,
        price: 12.99
      }
    ]
  },
  {
    id: 3,
    invoice_id: Date.now() + 3,
    company_name: 'HirePort',
    company_email: 'slbt37@gmail.com',
    company_avatar: 7,
    mission_name: 'Lead generation',
    invoice_date: '2022-07-06',
    due_date: '2022-07-10',
    total_amount: 90989,
    discount: 1,
    tax: 2,
    status: 'Cancelled',
    notes: '',
    cashierInfo: {
      name: 'Ritika Yohannan',
      address: '3488 Arbutus DriveMiami, FL',
      phone: '+91 1234567890',
      email: 'rtyhn65@gmail.com'
    },
    customerInfo: {
      name: 'Thomas D. Johnson',
      address: '4388 House DriveWestville, OH +91',
      phone: '1234567890',
      email: 'thomshj56@gmail.com'
    },
    invoice_detail: [
      {
        id: UIDV4(),
        name: 'Apple iPhone 13 Mini ',
        description: '13 cm (5.4-inch) Super',
        qty: 40,
        price: 86.99
      },
      {
        id: UIDV4(),
        name: 'Apple MacBook Pro with Iphone',
        description: '11th Generation Intel® Core™ i5-11320H ...',
        qty: 70,
        price: 14.59
      },
      {
        id: UIDV4(),
        name: 'Apple iPhone 13 Pro',
        description: '(512GB ROM, MLLH3HN/A,..',
        qty: 21,
        price: 100.0
      },
      {
        id: UIDV4(),
        name: 'Canon EOS 1500D 24.1 Digital',
        description: '(512GB ROM, MLLH3HN/A,..',
        qty: 21,
        price: 399
      }
    ]
  },
  {
    id: 4,
    invoice_id: Date.now() + 4,
    company_name: 'InShared',
    company_email: 'sabf231@gmail.com',
    company_avatar: 8,
    mission_name: 'Marketing Project Manager',
    invoice_date: '2022-02-08',
    due_date: '2022-02-15',
    total_amount: 10239,
    discount: 0.89,
    tax: 5.2,
    status: 'Unpaid',
    notes: '',
    cashierInfo: {
      name: 'Jesse G. Hassen',
      address: '3488 Arbutus DriveMiami, FL 33012',
      phone: '+91 1234567890',
      email: 'jessghs78@gmail.com'
    },
    customerInfo: {
      name: 'Christopher P. Iacovelli',
      address: '4388 House DriveWesrville, OH',
      phone: '+91 1234567890',
      email: 'crpthl643@gmail.com'
    },
    invoice_detail: [
      {
        id: UIDV4(),
        name: 'Luxury Watches Centrix Gold',
        description: '7655 Couple (Refurbished)...',
        qty: 3,
        price: 29.99
      },
      {
        id: UIDV4(),
        name: 'Canon EOS 1500D 24.1 Digital SLR',
        description: 'SLR Camera (Black) with EF S18-55...',
        qty: 50,
        price: 12.99
      },
      {
        id: UIDV4(),
        name: 'Apple iPhone 13 Pro',
        description: '(512GB ROM, MLLH3HN/A,..',
        qty: 21,
        price: 100.0
      },
      {
        id: UIDV4(),
        name: 'Canon EOS 1500D 24.1 Digital',
        description: '(512GB ROM, MLLH3HN/A,..',
        qty: 21,
        price: 399
      }
    ]
  },
  {
    id: 5,
    invoice_id: Date.now() + 5,
    company_name: 'ParkBee',
    company_email: 'mmsht23@gmail.com',
    company_avatar: 2,
    mission_name: 'Fractional Marketeer',
    discount: 0.1,
    tax: 0.52,
    invoice_date: '2022-05-05',
    due_date: '2022-05-10',
    total_amount: 83348,
    status: 'Paid',
    notes: '',
    cashierInfo: {
      name: 'Thomas D. Johnson',
      address: '4388 House DriveWestville, OH +91',
      phone: '1234567890',
      email: 'thomshj56@gmail.com'
    },
    customerInfo: {
      name: 'Ian Carpenter',
      address: '1754 Ureate, RhodSA5 5BO',
      phone: '+91 1234567890',
      email: 'iacrpt65@gmail.com'
    },
    invoice_detail: [
      {
        id: UIDV4(),
        name: 'Luxury Watches Centrix Gold',
        description: '7655 Couple (Refurbished)...',
        qty: 3,
        price: 29.99
      },
      {
        id: UIDV4(),
        name: 'Canon EOS 1500D 24.1 Digital SLR',
        description: 'SLR Camera (Black) with EF S18-55...',
        qty: 50,
        price: 12.99
      },
      {
        id: UIDV4(),
        name: 'Luxury Watches sliver',
        description: '7655 Couple (Refurbished)...',
        qty: 3,
        price: 29.99
      },
      {
        id: UIDV4(),
        name: 'Canon EOS 1800D',
        description: 'SLR Camera (Black) with EF S18-55...',
        qty: 50,
        price: 12.99
      },
      {
        id: UIDV4(),
        name: 'Apple watch 5 series',
        qty: 3,
        description: 'Apple Watch SE Smartwatch',
        price: 275
      }
    ]
  }
];
