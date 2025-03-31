
import { EmailElement } from './elements';

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  elements: EmailElement[];
  thumbnail?: string;
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'welcome-email',
    name: 'Welcome Email',
    description: 'Simple introduction email',
    elements: [
      {
        id: 'header-1',
        type: 'text',
        x: 0,
        y: 0,
        width: 500,
        height: 60,
        settings: {
          content: 'Welcome to Our Service!',
          fontSize: 24,
          fontWeight: 'bold',
          color: '#1A1F2C',
          align: 'center',
          fontFamily: 'Inter, sans-serif',
        },
      },
      {
        id: 'body-1',
        type: 'text',
        x: 0,
        y: 70,
        width: 500,
        height: 80,
        settings: {
          content: 'Hi {{name}}, we\'re thrilled to have you join us. Here\'s what you need to know to get started.',
          fontSize: 16,
          fontWeight: 'normal',
          color: '#403E43',
          align: 'left',
          fontFamily: 'Inter, sans-serif',
        },
      },
      {
        id: 'image-1',
        type: 'image',
        x: 100,
        y: 160,
        width: 300,
        height: 200,
        settings: {
          src: 'https://ouch-cdn2.icons8.com/hQYEZ_PeIWBUZl-BHUhF6T7jlvglw5CwTh1DkFfHD4I/rs:fit:455:456/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvOTA1/L2Q3MjdhZWI1LTdh/M2QtNDY3Ni1hNzNh/LTMzN2Q2MWNlMTZm/YS5zdmc.png',
          alt: 'Welcome Image',
          borderRadius: 8,
          width: 300,
          height: 200,
        },
      },
      {
        id: 'cta-button',
        type: 'button',
        x: 150,
        y: 380,
        width: 200,
        height: 50,
        settings: {
          text: 'Get Started',
          url: '{{dashboard_url}}',
          backgroundColor: '#9b87f5',
          color: '#FFFFFF',
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 'medium',
          align: 'center',
        },
      },
      {
        id: 'social-1',
        type: 'social',
        x: 150,
        y: 450,
        width: 200,
        height: 50,
        settings: {
          networks: [
            {
              type: 'facebook',
              url: 'https://www.facebook.com/example',
            },
            {
              type: 'twitter',
              url: 'https://www.twitter.com/example',
            },
            {
              type: 'instagram',
              url: 'https://www.instagram.com/example',
            },
            {
              type: 'linkedin',
              url: 'https://www.linkedin.com/example',
            },
          ],
          iconSize: 24,
          iconSpacing: 8,
          align: 'center',
          iconColor: '#3B82F6',
        },
      }
    ],
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Two column newsletter layout',
    elements: [
      {
        id: 'header-2',
        type: 'text',
        x: 0,
        y: 0,
        width: 500,
        height: 60,
        settings: {
          content: 'Monthly Newsletter',
          fontSize: 24,
          fontWeight: 'bold',
          color: '#1A1F2C',
          align: 'center',
          fontFamily: 'Inter, sans-serif',
        },
      },
      {
        id: 'date',
        type: 'text',
        x: 0,
        y: 70,
        width: 500,
        height: 30,
        settings: {
          content: '{{current_month}} {{current_year}}',
          fontSize: 14,
          fontWeight: 'medium',
          color: '#8E9196',
          align: 'center',
          fontFamily: 'Inter, sans-serif',
        },
      },
      {
        id: 'divider-1',
        type: 'divider',
        x: 0,
        y: 110,
        width: 500,
        height: 20,
        settings: {
          color: '#E5DEFF',
          thickness: 2,
          style: 'solid',
        },
      },
      {
        id: 'col1-title',
        type: 'text',
        x: 0,
        y: 140,
        width: 240,
        height: 40,
        settings: {
          content: 'Latest Updates',
          fontSize: 18,
          fontWeight: 'bold',
          color: '#7E69AB',
          align: 'left',
          fontFamily: 'Inter, sans-serif',
        },
      },
      {
        id: 'col1-content',
        type: 'text',
        x: 0,
        y: 190,
        width: 240,
        height: 140,
        settings: {
          content: '{{latest_news}} Check out our latest features and updates that will enhance your experience.',
          fontSize: 14,
          fontWeight: 'normal',
          color: '#403E43',
          align: 'left',
          fontFamily: 'Inter, sans-serif',
        },
      },
      {
        id: 'col2-title',
        type: 'text',
        x: 260,
        y: 140,
        width: 240,
        height: 40,
        settings: {
          content: 'Upcoming Events',
          fontSize: 18,
          fontWeight: 'bold',
          color: '#7E69AB',
          align: 'left',
          fontFamily: 'Inter, sans-serif',
        },
      },
      {
        id: 'col2-content',
        type: 'text',
        x: 260,
        y: 190,
        width: 240,
        height: 140,
        settings: {
          content: '{{upcoming_events}} Join us for these exciting events and connect with our community.',
          fontSize: 14,
          fontWeight: 'normal',
          color: '#403E43',
          align: 'left',
          fontFamily: 'Inter, sans-serif',
        },
      },
    ],
  },
];

export interface EmailVariable {
  id: string;
  name: string;
  description: string;
  placeholder: string;
  example: string;
}

export const emailVariables: EmailVariable[] = [
  {
    id: 'name',
    name: 'Name',
    description: 'Recipient\'s name',
    placeholder: '{{name}}',
    example: 'John Smith',
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Recipient\'s email address',
    placeholder: '{{email}}',
    example: 'john@example.com',
  },
  {
    id: 'company',
    name: 'Company',
    description: 'Recipient\'s company name',
    placeholder: '{{company}}',
    example: 'Acme Inc.',
  },
  {
    id: 'dashboard_url',
    name: 'Dashboard URL',
    description: 'Link to user dashboard',
    placeholder: '{{dashboard_url}}',
    example: 'https://app.example.com/dashboard',
  },
  {
    id: 'current_month',
    name: 'Current Month',
    description: 'Current month name',
    placeholder: '{{current_month}}',
    example: 'September',
  },
  {
    id: 'current_year',
    name: 'Current Year',
    description: 'Current year',
    placeholder: '{{current_year}}',
    example: '2023',
  },
  {
    id: 'latest_news',
    name: 'Latest News',
    description: 'Latest company news and updates',
    placeholder: '{{latest_news}}',
    example: 'We just launched our new product!',
  },
  {
    id: 'upcoming_events',
    name: 'Upcoming Events',
    description: 'List of upcoming events',
    placeholder: '{{upcoming_events}}',
    example: 'Webinar: June 15th at 2pm EST',
  },
];
