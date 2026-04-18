function SecurityTipsPage() {
  const tips = [
    {
      title: "Verify URL Authenticity",
      body: "Review the full domain before sign-in. Attackers often use lookalike addresses with minor spelling changes."
    },
    {
      title: "Look for HTTPS Lock",
      body: "Ensure the portal uses HTTPS with a valid lock icon and certificate details before credential entry."
    },
    {
      title: "Be Cautious of Urgent Requests",
      body: "Urgent warnings about account expiry or suspension are common pressure tactics in phishing campaigns."
    },
    {
      title: "Check Spelling Mistakes",
      body: "Unusual grammar, misspellings, and inconsistent wording are common warning signs of phishing content."
    },
    {
      title: "Avoid Untrusted Login Links",
      body: "Do not open credential forms from unknown emails, chat links, or unofficial redirect pages."
    },
    {
      title: "Enable Multi-Factor Authentication",
      body: "MFA introduces an additional verification layer and significantly reduces risk after password exposure."
    }
  ];

  return (
    <section className="panel fade-up detection-panel">
      <p className="eyebrow">Security Awareness Reference</p>
      <h2>Phishing Detection Guide</h2>
      <p className="muted-text">
        Apply this checklist before authenticating on institutional or academic portals.
      </p>

      <div className="tips-grid">
        {tips.map((tip) => (
          <article key={tip.title} className="tip-card">
            <h4>{tip.title}</h4>
            <p>{tip.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default SecurityTipsPage;
