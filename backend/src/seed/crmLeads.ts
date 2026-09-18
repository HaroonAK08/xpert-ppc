import { Lead } from '../models/Lead';
import { normalizePhone } from '../../../shared/crm/normalize';

const DEMO_LEADS = [
  {
    name: 'Ali Khan',
    email: 'ali.khan@demo-xpertppc.local',
    phone: '03001234567',
    businessName: 'ABC Restaurant',
    source: 'google-sheets',
    message: 'Need Google Ads help for restaurant leads in Lahore.',
    status: 'interested',
    replied: true,
    notes: 'Client interested in SEO + Google Ads package. Follow up Friday.',
  },
  {
    name: 'Sara Ahmed',
    email: 'sara.ahmed@demo-xpertppc.local',
    phone: '+923001112233',
    businessName: 'Glow Clinic',
    source: 'hero-audit',
    message: 'Looking for Meta Ads for dermatology clinic.',
    status: 'new',
    replied: false,
  },
  {
    name: 'Hassan Raza',
    email: 'hassan@demo-xpertppc.local',
    phone: '00923005556677',
    businessName: 'Raza Traders',
    source: 'contact-page',
    message: 'Want Amazon Ads management.',
    status: 'contacted',
    replied: false,
    contactedAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    name: 'Fatima Noor',
    email: 'fatima@demo-xpertppc.local',
    phone: '03219876543',
    businessName: 'Noor Boutique',
    source: 'academy',
    message: 'Interested in TikTok Ads training.',
    status: 'follow_up',
    replied: true,
    repliedAt: new Date(Date.now() - 86400000),
    followUpAt: new Date(new Date().setHours(19, 0, 0, 0)),
  },
  {
    name: 'Bilal Sheikh',
    email: 'bilal@demo-xpertppc.local',
    phone: '03331234567',
    businessName: 'Sheikh Motors',
    source: 'industry',
    message: 'Car dealership lead gen.',
    status: 'converted',
    replied: true,
  },
  {
    name: 'Ayesha Malik',
    email: 'ayesha@demo-xpertppc.local',
    phone: '03111222333',
    businessName: 'Malik Dental',
    source: 'other',
    message: 'Need local Google Ads.',
    status: 'replied',
    replied: true,
    repliedAt: new Date(),
  },
  {
    name: 'Usman Tariq',
    email: 'usman@demo-xpertppc.local',
    phone: '03450001122',
    businessName: 'Tariq Electronics',
    source: 'google-sheets',
    message: 'Ecom Meta Ads.',
    status: 'not_interested',
    replied: true,
  },
  {
    name: 'Hina Qureshi',
    email: 'hina@demo-xpertppc.local',
    phone: '03007654321',
    businessName: 'Qureshi Law',
    source: 'service-page',
    message: 'LinkedIn Ads for law firm.',
    status: 'new',
  },
  {
    name: 'Omar Farooq',
    email: 'omar@demo-xpertppc.local',
    phone: '03225554433',
    businessName: 'Farooq Logistics',
    source: 'footer',
    message: 'B2B lead generation.',
    status: 'contacted',
    contactedAt: new Date(),
  },
  {
    name: 'Nadia Iqbal',
    email: 'nadia@demo-xpertppc.local',
    phone: '03145556677',
    businessName: 'Iqbal Academy',
    source: 'academy-meeting',
    message: 'Want Digital Academy cohort info.',
    status: 'interested',
    replied: true,
  },
];

const EXTRA_NAMES = [
  ['Zain Ali', 'Zain Studio'],
  ['Maryam Shah', 'Shah Skincare'],
  ['Imran Haider', 'Haider Foods'],
  ['Sana Javed', 'Javed Interiors'],
  ['Kamran Latif', 'Latif Pharma'],
  ['Rabia Anwar', 'Anwar Salon'],
  ['Taha Mehmood', 'Mehmood Autos'],
  ['Iqra Yousaf', 'Yousaf Tutors'],
  ['Danish Butt', 'Butt Sports'],
  ['Maham Zafar', 'Zafar Jewels'],
  ['Waqas Nadeem', 'Nadeem Travels'],
  ['Laiba Saeed', 'Saeed Apparel'],
  ['Asad Ullah', 'Ullah Construction'],
  ['Mehwish Rauf', 'Rauf Cafe'],
  ['Shahzad Amin', 'Amin Hardware'],
  ['Kiran Bashir', 'Bashir Optics'],
  ['Noman Ghani', 'Ghani Real Estate'],
  ['Sobia Nisar', 'Nisar Events'],
  ['Farhan Adeel', 'Adeel IT'],
  ['Amina Rasheed', 'Rasheed Bakery'],
];

export async function seedCrmDemoLeads() {
  let created = 0;

  for (const lead of DEMO_LEADS) {
    const phoneNormalized = normalizePhone(lead.phone);
    const existing = await Lead.findOne({ email: lead.email });
    if (existing) continue;
    await Lead.create({
      ...lead,
      company: lead.businessName,
      phoneNormalized,
      source: lead.source,
      meta: { ip: '', userAgent: 'crm-seed', referer: '' },
    });
    created += 1;
  }

  for (let i = 0; i < EXTRA_NAMES.length; i++) {
    const [name, businessName] = EXTRA_NAMES[i];
    const email = `demo${i + 1}@demo-xpertppc.local`;
    const existing = await Lead.findOne({ email });
    if (existing) continue;
    const phone = `0300${String(1000000 + i).slice(-7)}`;
    await Lead.create({
      name,
      email,
      phone,
      phoneNormalized: normalizePhone(phone),
      businessName,
      company: businessName,
      source: 'google-sheets',
      message: `[DEMO] Sample inquiry from ${businessName}.`,
      status: (['new', 'contacted', 'replied', 'interested', 'follow_up'] as const)[i % 5],
      replied: i % 3 === 0,
      notes: 'Development/demo data — safe to delete.',
      meta: { ip: '', userAgent: 'crm-seed', referer: '' },
    });
    created += 1;
  }

  return created;
}
