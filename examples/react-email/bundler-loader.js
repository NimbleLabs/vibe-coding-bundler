/**
 * React Email Editor - Live Template Builder
 *
 * Uses vibe-coding-bundler to compile React Email templates
 * in real-time and preview them instantly.
 */

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

const TEMPLATES = {
  welcome: `import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export default function WelcomeEmail() {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform! We're excited to have you.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://react.email/brand/example-logo.png"
            width="48"
            height="48"
            alt="Logo"
            style={logo}
          />
          <Heading style={heading}>Welcome to Acme Inc!</Heading>
          <Text style={paragraph}>
            Hi there! We're thrilled to have you join our community. Your account
            has been successfully created and you're all set to get started.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href="https://example.com/dashboard">
              Go to Dashboard
            </Button>
          </Section>
          <Text style={paragraph}>
            If you have any questions, feel free to reply to this email or visit
            our <Link style={link} href="https://example.com/help">Help Center</Link>.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            © 2024 Acme Inc. All rights reserved.
            <br />
            123 Main Street, San Francisco, CA 94102
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
};

const logo = {
  margin: '0 auto 24px',
  display: 'block',
};

const heading = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#1a1a1a',
  textAlign: 'center',
  margin: '0 0 16px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#4a5568',
  margin: '0 0 24px',
};

const buttonContainer = {
  textAlign: 'center',
  margin: '32px 0',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '12px 24px',
};

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 0',
};

const footer = {
  fontSize: '12px',
  lineHeight: '20px',
  color: '#718096',
  textAlign: 'center',
};`,

  receipt: `import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

export default function ReceiptEmail() {
  const items = [
    { name: 'Premium Plan (Annual)', price: '$199.00' },
    { name: 'Extra Storage (100GB)', price: '$24.00' },
    { name: 'Priority Support', price: '$49.00' },
  ];

  return (
    <Html>
      <Head />
      <Preview>Your receipt from Acme Inc - Order #12345</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://react.email/brand/example-logo.png"
              width="40"
              height="40"
              alt="Logo"
            />
            <Text style={headerText}>Acme Inc</Text>
          </Section>

          <Heading style={heading}>Receipt</Heading>
          <Text style={orderNumber}>Order #12345</Text>
          <Text style={date}>January 15, 2024</Text>

          <Hr style={hr} />

          <Section>
            {items.map((item, i) => (
              <Row key={i} style={itemRow}>
                <Column style={itemName}>{item.name}</Column>
                <Column style={itemPrice}>{item.price}</Column>
              </Row>
            ))}
          </Section>

          <Hr style={hr} />

          <Row style={totalRow}>
            <Column style={totalLabel}>Subtotal</Column>
            <Column style={totalValue}>$272.00</Column>
          </Row>
          <Row style={totalRow}>
            <Column style={totalLabel}>Tax (8%)</Column>
            <Column style={totalValue}>$21.76</Column>
          </Row>
          <Row style={grandTotalRow}>
            <Column style={grandTotalLabel}>Total</Column>
            <Column style={grandTotalValue}>$293.76</Column>
          </Row>

          <Hr style={hr} />

          <Section style={paymentInfo}>
            <Text style={paymentLabel}>Payment Method</Text>
            <Text style={paymentValue}>Visa ending in 4242</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Questions? Contact us at support@acme.com
            <br />
            © 2024 Acme Inc. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
  borderRadius: '8px',
};

const header = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '32px',
};

const headerText = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#1a1a1a',
  margin: '0',
};

const heading = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#1a1a1a',
  margin: '0 0 8px',
};

const orderNumber = {
  fontSize: '14px',
  color: '#718096',
  margin: '0 0 4px',
};

const date = {
  fontSize: '14px',
  color: '#718096',
  margin: '0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '24px 0',
};

const itemRow = {
  marginBottom: '12px',
};

const itemName = {
  fontSize: '14px',
  color: '#4a5568',
};

const itemPrice = {
  fontSize: '14px',
  color: '#1a1a1a',
  textAlign: 'right',
  fontWeight: '500',
};

const totalRow = {
  marginBottom: '8px',
};

const totalLabel = {
  fontSize: '14px',
  color: '#718096',
};

const totalValue = {
  fontSize: '14px',
  color: '#4a5568',
  textAlign: 'right',
};

const grandTotalRow = {
  marginTop: '16px',
};

const grandTotalLabel = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#1a1a1a',
};

const grandTotalValue = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#1a1a1a',
  textAlign: 'right',
};

const paymentInfo = {
  textAlign: 'center',
};

const paymentLabel = {
  fontSize: '12px',
  color: '#718096',
  margin: '0 0 4px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const paymentValue = {
  fontSize: '14px',
  color: '#1a1a1a',
  margin: '0',
};

const footer = {
  fontSize: '12px',
  lineHeight: '20px',
  color: '#718096',
  textAlign: 'center',
};`,

  newsletter: `import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

export default function NewsletterEmail() {
  const articles = [
    {
      title: '10 Tips for Better Productivity',
      excerpt: 'Discover proven strategies to boost your productivity and get more done in less time.',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=200&fit=crop',
    },
    {
      title: 'The Future of Remote Work',
      excerpt: 'How companies are adapting to the new normal and what it means for employees.',
      image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=400&h=200&fit=crop',
    },
  ];

  return (
    <Html>
      <Head />
      <Preview>This week: Productivity tips, remote work trends, and more!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://react.email/brand/example-logo.png"
              width="40"
              height="40"
              alt="Logo"
            />
            <Text style={headerText}>The Weekly Digest</Text>
          </Section>

          <Heading style={heading}>Hello, Reader! 👋</Heading>
          <Text style={intro}>
            Here's what's trending this week. We've curated the best articles
            just for you.
          </Text>

          <Hr style={hr} />

          {articles.map((article, i) => (
            <Section key={i} style={articleSection}>
              <Img
                src={article.image}
                width="100%"
                height="200"
                alt={article.title}
                style={articleImage}
              />
              <Heading as="h2" style={articleTitle}>{article.title}</Heading>
              <Text style={articleExcerpt}>{article.excerpt}</Text>
              <Button style={readMoreButton} href="#">
                Read More →
              </Button>
              {i < articles.length - 1 && <Hr style={hr} />}
            </Section>
          ))}

          <Hr style={hr} />

          <Section style={cta}>
            <Heading as="h2" style={ctaHeading}>Share the Knowledge</Heading>
            <Text style={ctaText}>
              Know someone who'd enjoy this newsletter? Share it with them!
            </Text>
            <Button style={shareButton} href="#">
              Share Newsletter
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            You're receiving this because you subscribed to our newsletter.
            <br />
            <Link style={unsubscribe} href="#">Unsubscribe</Link> ·
            <Link style={unsubscribe} href="#">Preferences</Link>
            <br /><br />
            © 2024 Acme Inc. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  borderRadius: '8px',
};

const header = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '32px',
};

const headerText = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#1a1a1a',
  margin: '0',
};

const heading = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#1a1a1a',
  margin: '0 0 16px',
};

const intro = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#4a5568',
  margin: '0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 0',
};

const articleSection = {
  marginBottom: '24px',
};

const articleImage = {
  borderRadius: '8px',
  marginBottom: '16px',
};

const articleTitle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#1a1a1a',
  margin: '0 0 8px',
};

const articleExcerpt = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#4a5568',
  margin: '0 0 16px',
};

const readMoreButton = {
  backgroundColor: 'transparent',
  color: '#3b82f6',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '0',
};

const cta = {
  backgroundColor: '#f0f9ff',
  padding: '24px',
  borderRadius: '8px',
  textAlign: 'center',
};

const ctaHeading = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#1a1a1a',
  margin: '0 0 8px',
};

const ctaText = {
  fontSize: '14px',
  color: '#4a5568',
  margin: '0 0 16px',
};

const shareButton = {
  backgroundColor: '#3b82f6',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '10px 20px',
};

const footer = {
  fontSize: '12px',
  lineHeight: '20px',
  color: '#718096',
  textAlign: 'center',
};

const unsubscribe = {
  color: '#718096',
  textDecoration: 'underline',
};`,

  'password-reset': `import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export default function PasswordResetEmail() {
  return (
    <Html>
      <Head />
      <Preview>Reset your password for Acme Inc</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://react.email/brand/example-logo.png"
            width="48"
            height="48"
            alt="Logo"
            style={logo}
          />
          <Heading style={heading}>Reset Your Password</Heading>
          <Text style={paragraph}>
            We received a request to reset the password for your account. If you
            didn't make this request, you can safely ignore this email.
          </Text>
          <Text style={paragraph}>
            Click the button below to create a new password. This link will
            expire in 24 hours.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href="https://example.com/reset?token=abc123">
              Reset Password
            </Button>
          </Section>
          <Text style={securityNote}>
            🔒 For security, this request was received from a Chrome browser on
            macOS. If this wasn't you, please{' '}
            <Link style={link} href="https://example.com/security">
              secure your account
            </Link>.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            If the button above doesn't work, copy and paste this URL into your
            browser:
          </Text>
          <Text style={urlText}>
            https://example.com/reset?token=abc123xyz789
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            © 2024 Acme Inc. All rights reserved.
            <br />
            123 Main Street, San Francisco, CA 94102
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
  borderRadius: '8px',
};

const logo = {
  margin: '0 auto 24px',
  display: 'block',
};

const heading = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#1a1a1a',
  textAlign: 'center',
  margin: '0 0 24px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#4a5568',
  margin: '0 0 16px',
};

const buttonContainer = {
  textAlign: 'center',
  margin: '32px 0',
};

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '12px 32px',
};

const securityNote = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#718096',
  backgroundColor: '#f7fafc',
  padding: '16px',
  borderRadius: '6px',
  margin: '24px 0',
};

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '24px 0',
};

const footer = {
  fontSize: '12px',
  lineHeight: '20px',
  color: '#718096',
  textAlign: 'center',
};

const urlText = {
  fontSize: '12px',
  color: '#3b82f6',
  wordBreak: 'break-all',
  textAlign: 'center',
};`,

  notification: `import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export default function NotificationEmail() {
  return (
    <Html>
      <Head />
      <Preview>You have a new notification from Acme Inc</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={notificationCard}>
            <Section style={iconContainer}>
              <Text style={icon}>🔔</Text>
            </Section>
            <Heading style={heading}>New Activity</Heading>
            <Text style={subheading}>Just now</Text>
          </Section>

          <Section style={content}>
            <Section style={activityItem}>
              <Img
                src="https://i.pravatar.cc/40?img=1"
                width="40"
                height="40"
                alt="Avatar"
                style={avatar}
              />
              <Section style={activityContent}>
                <Text style={activityText}>
                  <strong>Sarah Johnson</strong> commented on your post
                </Text>
                <Text style={activityTime}>2 minutes ago</Text>
              </Section>
            </Section>

            <Hr style={hr} />

            <Section style={activityItem}>
              <Img
                src="https://i.pravatar.cc/40?img=2"
                width="40"
                height="40"
                alt="Avatar"
                style={avatar}
              />
              <Section style={activityContent}>
                <Text style={activityText}>
                  <strong>Mike Chen</strong> liked your photo
                </Text>
                <Text style={activityTime}>15 minutes ago</Text>
              </Section>
            </Section>

            <Hr style={hr} />

            <Section style={activityItem}>
              <Img
                src="https://i.pravatar.cc/40?img=3"
                width="40"
                height="40"
                alt="Avatar"
                style={avatar}
              />
              <Section style={activityContent}>
                <Text style={activityText}>
                  <strong>Emily Davis</strong> started following you
                </Text>
                <Text style={activityTime}>1 hour ago</Text>
              </Section>
            </Section>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href="https://example.com/notifications">
              View All Notifications
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            You can manage your notification preferences in{' '}
            <a style={link} href="https://example.com/settings">Settings</a>.
            <br /><br />
            © 2024 Acme Inc. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  maxWidth: '560px',
  borderRadius: '8px',
  overflow: 'hidden',
};

const notificationCard = {
  backgroundColor: '#3b82f6',
  padding: '32px 20px',
  textAlign: 'center',
};

const iconContainer = {
  marginBottom: '12px',
};

const icon = {
  fontSize: '32px',
  margin: '0',
};

const heading = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#ffffff',
  margin: '0 0 4px',
};

const subheading = {
  fontSize: '14px',
  color: 'rgba(255, 255, 255, 0.8)',
  margin: '0',
};

const content = {
  padding: '24px 20px',
};

const activityItem = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
};

const avatar = {
  borderRadius: '50%',
};

const activityContent = {
  flex: '1',
};

const activityText = {
  fontSize: '14px',
  color: '#1a1a1a',
  margin: '0 0 4px',
  lineHeight: '20px',
};

const activityTime = {
  fontSize: '12px',
  color: '#718096',
  margin: '0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '16px 0',
};

const buttonContainer = {
  textAlign: 'center',
  padding: '0 20px 24px',
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '10px 20px',
  width: '100%',
};

const footer = {
  fontSize: '12px',
  lineHeight: '20px',
  color: '#718096',
  textAlign: 'center',
  padding: '0 20px 24px',
};

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
};`,
};

// =============================================================================
// IMPORT MAP
// =============================================================================

const IMPORT_MAP = {
  imports: {
    'react': 'https://esm.sh/react@18.2.0',
    'react/': 'https://esm.sh/react@18.2.0/',
    'react/jsx-runtime': 'https://esm.sh/react@18.2.0/jsx-runtime',
    'react-dom': 'https://esm.sh/react-dom@18.2.0',
    'react-dom/server': 'https://esm.sh/react-dom@18.2.0/server',
    '@react-email/components': 'https://esm.sh/@react-email/components@0.0.31?external=react',
  }
};

// =============================================================================
// GLOBALS
// =============================================================================

let bundler = null;
let editor = null;
let compileTimeout = null;
let currentHtml = '';
let isCompiling = false;

// =============================================================================
// DOM ELEMENTS
// =============================================================================

const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.getElementById('loading-text');
const templateSelect = document.getElementById('template-select');
const previewFrame = document.getElementById('preview-frame');
const previewWrapper = document.getElementById('preview-wrapper');
const htmlOutput = document.getElementById('html-output');
const htmlCode = document.getElementById('html-code');
const errorDisplay = document.getElementById('error-display');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const compileStatus = document.getElementById('compile-status');
const previewTab = document.getElementById('preview-tab');
const htmlTab = document.getElementById('html-tab');
const desktopBtn = document.getElementById('desktop-btn');
const mobileBtn = document.getElementById('mobile-btn');
const copyHtmlBtn = document.getElementById('copy-html-btn');
const copyNotification = document.getElementById('copy-notification');

// =============================================================================
// UTILITIES
// =============================================================================

function setStatus(status, text) {
  statusDot.className = 'status-dot ' + status;
  statusText.textContent = text;
  compileStatus.textContent = text;
}

function showError(message) {
  errorDisplay.textContent = message;
  errorDisplay.classList.add('visible');
  previewWrapper.classList.add('hidden');
  setStatus('error', 'Error');
}

function hideError() {
  errorDisplay.classList.remove('visible');
  previewWrapper.classList.remove('hidden');
}

function hideLoading() {
  loadingOverlay.classList.add('hidden');
}

function escapeHtml(html) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// =============================================================================
// COMPILATION
// =============================================================================

async function compileAndRender(code) {
  if (isCompiling) return;
  isCompiling = true;
  setStatus('compiling', 'Compiling...');

  try {
    // Bundle the user's code as-is (it already has export default)
    const wrappedCode = code;

    // Bundle the code
    const result = await bundler.bundle(
      '/email.tsx',
      { '/email.tsx': wrappedCode },
      IMPORT_MAP,
      {
        format: 'esm',
        jsx: 'automatic',
        jsxImportSource: 'react',
        minify: false,
      }
    );

    if (result.errors && result.errors.length > 0) {
      const errorMsg = result.errors.map(e => e.text || e.message || String(e)).join('\n');
      showError(errorMsg);
      isCompiling = false;
      return;
    }

    // Get the bundled code
    const outputCode = result.outputFiles['email.js'] ||
                       result.outputFiles['/email.js'] ||
                       Object.values(result.outputFiles)[0];

    if (!outputCode) {
      showError('No output generated');
      isCompiling = false;
      return;
    }

    // Execute the bundle to get the HTML
    const blob = new Blob([outputCode], { type: 'text/javascript' });
    const blobUrl = URL.createObjectURL(blob);

    try {
      const module = await import(blobUrl);

      // Import React and ReactDOMServer to render the component
      let html = '';
      if (module.default) {
        const React = await import('https://esm.sh/react@18.2.0');
        const ReactDOMServer = await import('https://esm.sh/react-dom@18.2.0/server');
        html = ReactDOMServer.renderToStaticMarkup(React.createElement(module.default));
      } else {
        throw new Error('No default export found. Make sure your email component uses "export default".');
      }

      // Add doctype and basic HTML structure if not present
      if (!html.includes('<!DOCTYPE')) {
        html = '<!DOCTYPE html>' + html;
      }

      currentHtml = html;

      // Update preview
      previewFrame.srcdoc = html;
      htmlCode.textContent = formatHtml(html);

      hideError();
      setStatus('', 'Ready');
    } catch (execError) {
      showError('Runtime error: ' + execError.message);
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (error) {
    showError('Compilation error: ' + error.message);
  }

  isCompiling = false;
}

function formatHtml(html) {
  // Simple HTML formatting
  let formatted = html;
  let indent = 0;
  const tab = '  ';

  formatted = formatted.replace(/></g, '>\n<');

  const lines = formatted.split('\n');
  formatted = lines.map(line => {
    line = line.trim();
    if (!line) return '';

    if (line.match(/^<\/\w/)) {
      indent = Math.max(0, indent - 1);
    }

    const result = tab.repeat(indent) + line;

    if (line.match(/^<\w[^>]*[^\/]>$/) && !line.match(/^<(meta|link|img|br|hr|input)/i)) {
      indent++;
    }

    return result;
  }).filter(line => line).join('\n');

  return formatted;
}

function scheduleCompile() {
  if (compileTimeout) {
    clearTimeout(compileTimeout);
  }
  compileTimeout = setTimeout(() => {
    const code = editor.getValue();
    compileAndRender(code);
  }, 500);
}

// =============================================================================
// EVENT HANDLERS
// =============================================================================

function setupEventHandlers() {
  // Template selection
  templateSelect.addEventListener('change', (e) => {
    const template = TEMPLATES[e.target.value];
    if (template) {
      editor.setValue(template);
      scheduleCompile();
    }
  });

  // Preview/HTML tabs
  previewTab.addEventListener('click', () => {
    previewTab.classList.add('active');
    htmlTab.classList.remove('active');
    previewWrapper.classList.remove('hidden');
    htmlOutput.classList.remove('visible');
  });

  htmlTab.addEventListener('click', () => {
    htmlTab.classList.add('active');
    previewTab.classList.remove('active');
    previewWrapper.classList.add('hidden');
    htmlOutput.classList.add('visible');
  });

  // Device toggle
  desktopBtn.addEventListener('click', () => {
    desktopBtn.classList.add('active');
    mobileBtn.classList.remove('active');
    previewWrapper.classList.remove('mobile');
  });

  mobileBtn.addEventListener('click', () => {
    mobileBtn.classList.add('active');
    desktopBtn.classList.remove('active');
    previewWrapper.classList.add('mobile');
  });

  // Copy HTML
  copyHtmlBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(currentHtml);
      copyNotification.classList.add('visible');
      setTimeout(() => {
        copyNotification.classList.remove('visible');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  });
}

// =============================================================================
// INITIALIZATION
// =============================================================================

async function init() {
  try {
    loadingText.textContent = 'Loading bundler...';

    // Import the bundler
    let module;
    try {
      module = await import('/dist/index.browser.js');
    } catch (e1) {
      console.log('Trying alternate path...');
      module = await import('../../dist/index.browser.js');
    }

    const { createBundler, initialize } = module;

    loadingText.textContent = 'Initializing esbuild...';
    await initialize();

    loadingText.textContent = 'Setting up editor...';

    // Create bundler
    bundler = createBundler({
      fetcher: async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return { contents: await response.text() };
      },
    });

    // Initialize CodeMirror
    editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
      mode: 'jsx',
      theme: 'dracula',
      lineNumbers: true,
      lineWrapping: true,
      tabSize: 2,
      indentWithTabs: false,
      autoCloseBrackets: true,
      matchBrackets: true,
    });

    // Set initial template
    editor.setValue(TEMPLATES.welcome);

    // Listen for changes
    editor.on('change', scheduleCompile);

    // Setup event handlers
    setupEventHandlers();

    // Hide loading and compile initial template
    hideLoading();
    compileAndRender(TEMPLATES.welcome);

  } catch (error) {
    loadingText.textContent = 'Error: ' + error.message;
    console.error('Initialization error:', error);
  }
}

// Start
init();
