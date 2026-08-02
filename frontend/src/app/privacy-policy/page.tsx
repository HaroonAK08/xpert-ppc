import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'How Xpert PPC collects, uses, and protects the personal information you share through our website and advertising services.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="2 August 2026"
      intro={`This policy explains what information ${siteConfig.name} collects, why we collect it, and the choices you have.`}
      sections={[
        {
          heading: 'Information We Collect',
          body: [
            'When you submit a form on this site — a free audit request, a contact enquiry, or a course enrolment — we collect the details you provide: your name, email address, phone number, the advertising platform you are interested in, and any message you write.',
            'We also record limited technical information alongside each submission (IP address, browser user-agent, and the page you submitted from) so we can detect spam and understand which pages generate enquiries.',
            'If you arrive from an advertising campaign, we store the UTM parameters present in the URL so we can attribute the enquiry to the correct campaign.',
          ],
        },
        {
          heading: 'How We Use Your Information',
          body: [
            'We use your contact details to respond to your enquiry, deliver the free audit you requested, and follow up about our services. We do not sell your personal information to third parties.',
            'Aggregated, non-identifying data may be used to improve our website and marketing.',
          ],
        },
        {
          heading: 'Analytics and Advertising Cookies',
          body: [
            'This site uses Google Tag Manager, which may load analytics and advertising tags such as Google Analytics and platform conversion pixels. These tools set cookies that help us measure traffic and campaign performance.',
            'You can control cookies through your browser settings. Blocking them will not prevent you from using the site.',
          ],
        },
        {
          heading: 'Data Storage and Security',
          body: [
            'Form submissions are stored in a MongoDB database with access restricted to authorised team members. We apply reasonable technical and organisational measures to protect your data, but no method of transmission over the internet is completely secure.',
          ],
        },
        {
          heading: 'Data Retention',
          body: [
            'We keep enquiry records for as long as needed to serve you and to meet our legal and accounting obligations. You may ask us to delete your record at any time.',
          ],
        },
        {
          heading: 'Your Rights',
          body: [
            'Depending on where you live, you may have the right to access, correct, export, or delete the personal data we hold about you, and to object to certain processing.',
            `To exercise any of these rights, email us at ${siteConfig.contact.email} and we will respond within 30 days.`,
          ],
        },
        {
          heading: 'Third-Party Services',
          body: [
            'We work with advertising platforms including Google Ads, Meta, TikTok, Amazon Ads, LinkedIn, and Microsoft Advertising. When we manage campaigns on your behalf, those platforms process data under their own privacy policies.',
          ],
        },
        {
          heading: 'Changes to This Policy',
          body: [
            'We may update this policy from time to time. The "last updated" date at the top of this page always reflects the current version.',
          ],
        },
        {
          heading: 'Contact Us',
          body: [
            `Questions about this policy? Email ${siteConfig.contact.email} or call ${siteConfig.contact.phonePrimary}.`,
          ],
        },
      ]}
    />
  );
}
