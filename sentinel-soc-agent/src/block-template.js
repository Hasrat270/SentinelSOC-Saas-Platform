/**
 * SentinelSOC - Premium Block Page Template
 * ---------------------------------------
 * This is a standalone HTML template for the security agent's blocking response.
 */

function generateBlockPage(threatType, ip) {
  const eventId = Math.random().toString(36).substring(2, 15).toUpperCase();
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Access Denied | SentinelSOC Protection</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            
            :root {
                --bg: #0d1117;
                --card: #161b22;
                --primary: #4f46e5;
                --danger: #ef4444;
                --text: #c9d1d9;
                --text-muted: #8b949e;
            }

            body {
                margin: 0;
                padding: 0;
                font-family: 'Inter', sans-serif;
                background-color: var(--bg);
                color: var(--text);
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
            }

            .container {
                background-color: var(--card);
                padding: 3rem;
                border-radius: 1rem;
                border: 1px solid rgba(239, 68, 68, 0.2);
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                max-width: 500px;
                text-align: center;
                animation: fadeIn 0.5s ease-out;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .shield-icon {
                font-size: 5rem;
                color: var(--danger);
                margin-bottom: 1.5rem;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(239, 68, 68, 0)); }
                50% { transform: scale(1.05); filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.4)); }
                100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(239, 68, 68, 0)); }
            }

            h1 {
                margin: 0;
                font-size: 1.8rem;
                font-weight: 700;
                color: #ffffff;
            }

            p {
                color: var(--text-muted);
                line-height: 1.6;
                margin: 1rem 0 2rem;
            }

            .details {
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 0.5rem;
                padding: 1rem;
                text-align: left;
                font-family: monospace;
                font-size: 0.9rem;
                border-left: 3px solid var(--danger);
                margin-bottom: 2rem;
            }

            .detail-item { margin: 0.3rem 0; }
            .label { color: var(--text-muted); }
            .value { color: var(--danger); font-weight: 600; }

            .btn {
                display: inline-block;
                background-color: var(--primary);
                color: white;
                text-decoration: none;
                padding: 0.8rem 2rem;
                border-radius: 0.5rem;
                font-weight: 600;
                transition: transform 0.2s, background-color 0.2s;
            }

            .btn:hover {
                background-color: #4338ca;
                transform: translateY(-2px);
            }

            .footer {
                margin-top: 3rem;
                font-size: 0.8rem;
                color: var(--text-muted);
                letter-spacing: 0.05em;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }

            .dot { width: 4px; height: 4px; background-color: var(--primary); border-radius: 50%; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="shield-icon">🛡️</div>
            <h1>Access Denied</h1>
            <p>Your request has been audited and blocked by <strong>SentinelSOC</strong> security filters due to suspicious activity.</p>
            
            <div class="details">
                <div class="detail-item"><span class="label">Event ID:</span> <span class="value" style="color: var(--text)">${eventId}</span></div>
                <div class="detail-item"><span class="label">Threat Type:</span> <span class="value">${threatType}</span></div>
                <div class="detail-item"><span class="label">Source IP:</span> <span class="value">${ip}</span></div>
            </div>

            <a href="/" class="btn">Return to Safety</a>

            <div class="footer">
                <span>SENTINEL SOC</span>
                <div class="dot"></div>
                <span>CYBER DEFENSE ENGINE</span>
            </div>
        </div>
    </body>
    </html>
  `;
}

module.exports = { generateBlockPage };
