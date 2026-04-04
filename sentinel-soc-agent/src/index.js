const { generateBlockPage } = require('./block-template');

/**
 * SentinelSOC Security Agent (CommonJS)
 * ------------------------------------
 * Middleware to intercept threats and report to the SOC Real-Time Engine.
 */

const THREAT_PATTERNS = {
  SQL_Injection: [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /UNION\s+SELECT/i,
  ],
  XSS: [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i,
    /document\.cookie/i,
  ],
  Path_Traversal: [
    /\.\.\//g,
    /\.\.\\/g,
    /\/etc\/passwd/i,
    /C:\\Windows\\System32/i,
  ]
};

const sentinelAgent = (config) => {
  // Use production Render URL by default if not provided
  const endpoint = config.endpoint || 'https://sentinel-soc-backend.onrender.com/api/v1/logs';
  const apiKey = config.apiKey;
  const shouldBlockLocally = config.block !== undefined ? config.block : true;

  return async (req, res, next) => {
    // 1. Prepare search area
    const searchContext = JSON.stringify({
      url: req.url,
      body: req.body,
      query: req.query,
      params: req.params,
    });

    let detectedThreat = null;

    // 2. Perform Regex Analytics locally
    for (const [threatType, patterns] of Object.entries(THREAT_PATTERNS)) {
      if (patterns.some(pattern => pattern.test(searchContext))) {
        detectedThreat = threatType;
        break;
      }
    }

    // 3. If threat detected locally, report to SOC Backend and decide on redirection
    if (detectedThreat) {
      const logData = {
        threatType: detectedThreat,
        method: req.method,
        url: req.url,
        sourceIp: req.ip || req.get('x-forwarded-for') || req.socket.remoteAddress,
        payload: {
          query: req.query,
          body: req.body,
        }
      };

      try {
        // Report to backend and wait for response to handle the 'redirect' flow
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
          body: JSON.stringify(logData),
        });

        const data = await response.json();

        // 4. Production Redirection Logic (WAF Flow)
        if (data.isThreat && data.redirectUrl) {
          console.log(`[SentinelSOC] Blocking attack of type ${detectedThreat}. Redirecting to safety.`);
          return res.redirect(data.redirectUrl);
        }

        // Fallback to local block page if redirected hasn't happened and local blocking is ON
        if (shouldBlockLocally) {
          return res.status(403).send(generateBlockPage(detectedThreat, logData.sourceIp));
        }
      } catch (err) {
        console.error('[SentinelSOC Agent] Failed to report threat or redirect:', err.message);
        // Fallback to local blocking logic on connection error 
        if (shouldBlockLocally) {
          return res.status(403).send(generateBlockPage(detectedThreat, logData.sourceIp));
        }
      }
    }

    // Pass control to the next middleware if safe or not blocking
    next();
  };
};

module.exports = { sentinelAgent };
