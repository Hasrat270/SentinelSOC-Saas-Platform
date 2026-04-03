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
  return async (req, res, next) => {
    // 1. Prepare search area
    const searchContext = JSON.stringify({
      url: req.url,
      body: req.body,
      query: req.query,
      params: req.params,
    });

    let detectedThreat = null;

    // 2. Perform Regex Analytics
    for (const [threatType, patterns] of Object.entries(THREAT_PATTERNS)) {
      if (patterns.some(pattern => pattern.test(searchContext))) {
        detectedThreat = threatType;
        break;
      }
    }

    // 3. If threat detected, async report to SOC Backend
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

      // Non-blocking report
      fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
        },
        body: JSON.stringify(logData),
      }).catch(() => {});

      // 4. Block the request if Protection Mode is ON
      if (config.block) {
        return res.status(403).json({
          status: 'error',
          code: 'SENTINEL_BLOCK',
          message: 'Security threat detected and blocked by SentinelSOC.'
        });
      }
    }

    next();
  };
};

module.exports = { sentinelAgent };
