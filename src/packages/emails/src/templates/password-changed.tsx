import {
  Body,
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
} from "@react-email/components";

interface PasswordChangedEmailProps {
  userName?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
  : "";

export function PasswordChangedEmail({
  userName,
}: PasswordChangedEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Your Helsa password was changed</Preview>
        <Container style={container}>
          <Section style={coverSection}>
            <Section style={imageSection}>
              <Img
                src={`${baseUrl}/image/logo-mobile-helsa.png`}
                height="45"
                alt="Helsa Logo"
              />
            </Section>
            <Section style={upperSection}>
              <Heading style={h1}>Your password has been changed</Heading>
              <Text style={mainText}>
                {userName ? `Hi ${userName}, ` : ""}this is a confirmation that the
                password for your Helsa account was successfully changed.
              </Text>
              <Text style={text}>
                If you did not make this change, please reset your password
                immediately and secure your account.
              </Text>
              <Section style={actionsSection}>
                <Link href={baseUrl || "https://helsa.com"} target="_blank" style={primaryLink}>
                  Secure your account
                </Link>
              </Section>
            </Section>
            <Hr />
            <Section style={lowerSection}>
              <Text style={cautionText}>
                Need help? Contact our support team at
                {" "}
                <Link href="mailto:support@helsa.com" style={link}>
                  support@helsa.com
                </Link>
                .
              </Text>
            </Section>
          </Section>
          <Text style={footerText}>
            &copy; 2024 Helsa Healthcare, Inc. All rights reserved. Helsa is a
            trademark of{" "}
            <Link href="https://helsa.com" target="_blank" style={link}>
              Helsa.com
            </Link>
            , Inc. View our{" "}
            <Link href="https://helsa.com" target="_blank" style={link}>
              privacy policy
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

PasswordChangedEmail.PreviewProps = {
  userName: "Alex",
} satisfies PasswordChangedEmailProps;

const main = {
  backgroundColor: "#fff",
  color: "#212121",
};

const container = {
  padding: "20px",
  margin: "0 auto",
  backgroundColor: "#eee",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "15px",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const primaryLink = {
  ...link,
  display: "inline-block",
  backgroundColor: "#2754C5",
  color: "#ffffff",
  textDecoration: "none",
  padding: "10px 16px",
  borderRadius: "6px",
  fontWeight: "600",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const imageSection = {
  backgroundColor: "#8167ec",
  display: "flex",
  padding: "20px 0",
  alignItems: "center",
  justifyContent: "center",
};

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 35px" };

const lowerSection = { padding: "25px 35px" };

const footerText = {
  ...text,
  fontSize: "12px",
  padding: "0 20px",
};

const mainText = { ...text, marginBottom: "14px" };

const cautionText = { ...text, margin: "0px" };

const actionsSection = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "8px",
};

