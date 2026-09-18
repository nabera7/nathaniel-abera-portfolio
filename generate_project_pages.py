import os

projects = [
    {
        "file": "project-incident-response.html",
        "title": "Incident Response &amp; Remediation",
        "desc": "A complete incident response engagement beginning with a phishing alert and following the compromise through detection, investigation, containment, eradication, and recovery. This project documents the full investigative chain: tracing lateral movement between systems, analyzing Kerberos authentication anomalies, removing rogue accounts and malware, and verifying that every remediation step was effective before closing the incident.",
        "pdf": "assets/pdfs/incident-response-remediation.pdf",
    },
    {
        "file": "project-information-security.html",
        "title": "Information Systems Security",
        "desc": "A layered approach to securing an organization's applications, systems, and networks. This project applies access control principles, security architecture, and defense-in-depth strategies, delivering security controls and operational artifacts that demonstrate how to protect enterprise environments against a range of threats.",
        "pdf": "assets/pdfs/information-systems-security.pdf",
    },
    {
        "file": "project-ethics.html",
        "title": "Ethics in Technology",
        "desc": "An examination of the ethical responsibilities that come with security work. This project works through realistic scenarios involving privacy, responsible disclosure, and the tension between security objectives and individual rights, arriving at defensible, professionally grounded decisions.",
        "pdf": "assets/pdfs/ethics-in-technology.pdf",
    },
    {
        "file": "project-cryptography.html",
        "title": "Cryptography",
        "desc": "Hands-on work with the cryptographic primitives that secure modern systems: symmetric and asymmetric encryption, hashing, and public key infrastructure. This project demonstrates how these mechanisms protect data at rest and in transit and how to apply them correctly in real scenarios.",
        "pdf": "assets/pdfs/cryptography.pdf",
    },
    {
        "file": "project-policy-compliance.html",
        "title": "Information Security Policy &amp; Compliance",
        "desc": "Building actionable information security policies from the ground up. This project translates legal and regulatory obligations into governance documents that a real organization could adopt, addressing privacy, acceptable use, incident response, and compliance requirements.",
        "pdf": "assets/pdfs/security-policy-compliance.pdf",
    },
    {
        "file": "project-security-program.html",
        "title": "Security Program Management",
        "desc": "Managing information security strategically rather than reactively. This project covers risk assessment, security program design, and aligning technical controls with business goals, producing a management-level view of how security should operate across an organization.",
        "pdf": "assets/pdfs/security-program-management.pdf",
    },
    {
        "file": "project-network-automation.html",
        "title": "Network Automation &amp; Monitoring",
        "desc": "Automating routine IT operations with Python. This project builds scripts that monitor DNS health, read network device inventories, detect outages, generate tickets, and send email alerts, turning a manual, error-prone workflow into an automated monitoring pipeline. The full source code is available in its own repository below.",
        "pdf": "assets/pdfs/network-automation.pdf",
        "repo_embed": True,
    },
    {
        "file": "project-secure-software.html",
        "title": "Secure Software Development",
        "desc": "A security audit of a web application followed by remediation. This project identifies vulnerabilities such as hardcoded secrets, plaintext passwords, and broken authentication, then fixes them using secure coding practices and validates the fixes through automated security testing and static analysis tools.",
        "pdf": "assets/pdfs/secure-software-development.pdf",
    },
]

template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} — Cybersecurity Portfolio</title>
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/project.css">
</head>
<body>
    <div class="project-container">
        <a href="catalog.html" class="back-link">← Back to Projects</a>
        <header class="project-header">
            <h1>{title}</h1>
            <p class="description">{desc}</p>
        </header>
{repo_embed}
        <div class="pdf-viewer">
            <iframe src="{pdf}#toolbar=0&navpanes=0" title="{title}"></iframe>
        </div>
    </div>
    <script>
        // Prevent right-click download on the PDF viewer
        document.addEventListener('contextmenu', function(e) {
            if (e.target.closest('.pdf-viewer') || e.target.tagName === 'IFRAME') {
                e.preventDefault();
            }
        });
    </script>
</body>
</html>
"""

repo_embed_html = """        <div class="repo-section" style="margin-bottom:30px;">
            <h2 style="color:#0ea5e9; margin-bottom:15px;">Source Code Repository</h2>
            <p style="color:#b0b0b0; line-height:1.7; margin-bottom:20px;">The Python automation scripts are available to browse in the repository below.</p>
            <div style="width:100%; height:500px; border:2px solid #1a1a1a; border-radius:8px; overflow:hidden;">
                <iframe src="https://nabera7.github.io/python-network-automation/" style="width:100%; height:100%; border:none;"></iframe>
            </div>
            <p style="margin-top:10px;"><a href="https://github.com/nabera7/python-network-automation" target="_blank" style="color:#0ea5e9; font-weight:600; text-decoration:none;">View on GitHub →</a></p>
        </div>
"""

out_dir = r"C:\Users\hanak\.openclaw\workspace\nathaniel-portfolio"

for p in projects:
    content = template.replace('{title}', p["title"]).replace('{desc}', p["desc"]).replace('{pdf}', p["pdf"]).replace('{repo_embed}', repo_embed_html if p.get("repo_embed") else "")
    path = os.path.join(out_dir, p["file"])
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Wrote", p["file"])
