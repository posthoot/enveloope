import { EmailElement, ElementType } from '../components/email-editor/elements';
import { emailTemplates } from '../components/email-editor/templates';

interface GeneratedTemplate {
  elements: EmailElement[];
  bodySettings: {
    backgroundColor: string;
    fontFamily: string;
    textColor: string;
    width: number;
    padding: number;
    lineHeight: number;
    backdropColor: string;
  };
}

const systemPrompt = `You are an expert email template designer. Design highly professional emails. Minimal looking. Nice colors, fonts, and spacing. Your task is to generate a JSON structure for an email template based on the user's description. The template should be visually appealing and follow modern email design best practices.

The response should be a valid JSON object containing:
1. An array of email elements with properties like type, position, size, and settings
2. Body settings for the overall email template

Available element types are: text, heading, image, button, divider, spacer, social, video, html, columns

Each element must have:
- id (string)
- type (ElementType)
- x (number) - horizontal position
- y (number) - vertical position
- width (any)
- height (any)
- settings (specific to each element type)

The email should be responsive and adapt to different screen sizes. The email should be designed for mobile, tablet, and desktop.

Make sure to follow the user's description and make the email look great. 
Response example:
${JSON.stringify(emailTemplates)}
Do not include any other text than the JSON object.

Use different background colors for emailSettings if required backrgound should be pastel colors. think wisely about the colors.
emailSettings should be a valid object.
example:
{
  "elements": [],
  "bodySettings": {
    "backgroundColor": "#ffffff",
    "fontFamily": "Arial, sans-serif",
    "textColor": "#000000",
    "width": 600,
    "padding": 20,
    "lineHeight": 1.5,
    "backdropColor": "#f0f0f0"
  }
}
`;

export async function generateEmailTemplate(prompt: string): Promise<GeneratedTemplate> {
  try {
    const baseURL = import.meta.env?.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const apiKey = import.meta.env?.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "claude-3.5-sonnet",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate template');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const template = JSON.parse(content) as GeneratedTemplate;

    // Validate the template structure
    if (!template.elements || !Array.isArray(template.elements)) {
      throw new Error('Invalid template structure: missing elements array');
    }

    if (!template.bodySettings) {
      template.bodySettings = {
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        textColor: '#000000',
        width: 600,
        padding: 20,
        lineHeight: 1.5,
        backdropColor: '#f7f7f7'
      };
    }

    // Ensure backdropColor exists
    if (!template.bodySettings.backdropColor) {
      template.bodySettings.backdropColor = '#f7f7f7';
    }

    // Ensure all elements have required properties
    template.elements = template.elements.map((element, index) => ({
      ...element,
      id: element.id || `ai-${element.type}-${Date.now()}-${index}`,
      x: element.x || 0,
      y: element.y || (index * 100), // Stack elements vertically if no position specified
      width: element.width || 600,
      height: element.height || 100,
    }));

    return template;
  } catch (error) {
    console.error('Error generating email template:', error);
    throw error;
  }
} 