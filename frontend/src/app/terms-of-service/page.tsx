import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service',
  description:
    'The terms that govern your use of the Xpert PPC website and the advertising management services we provide.',
  path: '/terms-of-service',
});

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="2 August 2026"
      intro={`These terms govern your use of the ${siteConfig.name} website and any services you engage us to provide.`}
      sections={[
        {
          heading: 'Acceptance of Terms',
          body: [
            'By accessing this website or engaging our services, you agree to these terms. If you do not agree, please do not use the site.',
          ],
        },
        {
          heading: 'Our Services',
          body: [
            'Xpert PPC provides paid advertising management, search engine optimisation, consulting, and training across platforms including Google Ads, Meta Ads, TikTok Ads, Amazon Ads, LinkedIn Ads, and Microsoft Ads.',
            'The specific scope, deliverables, fees, and term of any engagement are set out in a separate written proposal or service agreement, which takes precedence over these terms where the two conflict.',
          ],
        },
        {
          heading: 'No Guarantee of Results',
          body: [
            'Performance figures shown on this site — including ROI, ROAS, CPA, and traffic improvements — are historical results from specific client accounts. Advertising performance depends on your market, offer, budget, creative, landing pages, and platform changes outside our control.',
            'We do not guarantee any specific result, ranking, or revenue outcome.',
          ],
        },
        {
          heading: 'Client Responsibilities',
          body: [
            'You are responsible for providing timely access to advertising accounts, analytics, and assets; for the accuracy and legality of the products, claims, and creative you ask us to promote; and for paying advertising platforms directly for media spend unless agreed otherwise in writing.',
          ],
        },
        {
          heading: 'Account Ownership',
          body: [
            'You retain full ownership of, and administrative access to, your advertising accounts, business manager profiles, and the data within them. We operate as an authorised agency partner on those accounts.',
          ],
        },
        {
          heading: 'Fees and Payment',
          body: [
            'Management fees are billed as a flat monthly retainer or a percentage of ad spend, as set out in your service agreement. Fees are exclusive of advertising spend paid to the platforms.',
            'Late payment may result in campaign management being paused until the account is brought current.',
          ],
        },
        {
          heading: 'Intellectual Property',
          body: [
            'All content on this website — text, design, graphics, and code — is owned by Xpert PPC and may not be copied or reproduced without written permission.',
            'Campaign assets we create specifically for you under a paid engagement become yours on full payment, excluding our underlying frameworks, templates, and know-how.',
          ],
        },
        {
          heading: 'Confidentiality',
          body: [
            'Each party agrees to keep the other party&rsquo;s non-public business information confidential and to use it only to perform the engagement.',
          ],
        },
        {
          heading: 'Limitation of Liability',
          body: [
            'To the maximum extent permitted by law, our total liability arising from any engagement is limited to the management fees you paid us in the three months preceding the claim. We are not liable for indirect or consequential losses, including lost profits or lost advertising spend.',
          ],
        },
        {
          heading: 'Termination',
          body: [
            'Either party may terminate an ongoing engagement with 30 days written notice unless the service agreement states otherwise. Fees for work already performed remain payable.',
          ],
        },
        {
          heading: 'Third-Party Platforms',
          body: [
            'Our services depend on third-party advertising platforms. We are not responsible for platform outages, policy changes, account suspensions, or algorithm updates that affect performance.',
          ],
        },
        {
          heading: 'Contact',
          body: [
            `Questions about these terms? Email ${siteConfig.contact.email} or call ${siteConfig.contact.phonePrimary}.`,
          ],
        },
      ]}
    />
  );
}
