<p align="center"><img src="logo.png" width="120" alt="logo"></p>

[![lazymac API Store](https://img.shields.io/badge/lazymac-API%20Store-blue?style=flat-square)](https://lazymac2x.github.io/lazymac-api-store/) [![Gumroad](https://img.shields.io/badge/Buy%20on-Gumroad-ff69b4?style=flat-square)](https://coindany.gumroad.com/) [![MCPize](https://img.shields.io/badge/MCP-MCPize-green?style=flat-square)](https://mcpize.com/mcp/cron-parser-api)

# cron-parser-api

> ⭐ **Building in public from $0 MRR.** Star if you want to follow the journey — [lazymac-mcp](https://github.com/lazymac2x/lazymac-mcp) (42 tools, one MCP install) · [lazymac-k-mcp](https://github.com/lazymac2x/lazymac-k-mcp) (Korean wedge) · [lazymac-sdk](https://github.com/lazymac2x/lazymac-sdk) (TS client) · [api.lazy-mac.com](https://api.lazy-mac.com) · [Pro $29/mo](https://coindany.gumroad.com/l/zlewvz).

[![npm](https://img.shields.io/npm/v/@lazymac/mcp.svg?label=%40lazymac%2Fmcp&color=orange)](https://www.npmjs.com/package/@lazymac/mcp)
[![Smithery](https://img.shields.io/badge/Smithery-lazymac%2Fmcp-orange)](https://smithery.ai/server/lazymac/mcp)
[![lazymac Pro](https://img.shields.io/badge/lazymac%20Pro-%2429%2Fmo-ff6b35)](https://coindany.gumroad.com/l/zlewvz)
[![api.lazy-mac.com](https://img.shields.io/badge/REST-api.lazy--mac.com-orange)](https://api.lazy-mac.com)

> 🚀 Want all 42 lazymac tools through ONE MCP install? `npx -y @lazymac/mcp` · [Pro $29/mo](https://coindany.gumroad.com/l/zlewvz) for unlimited calls.

Cron expression parser API — explain, validate, generate, and compute next run times. Supports standard 5-field cron + presets (@daily, @weekly).

## Quick Start
```bash
npm install && npm start  # http://localhost:4400
```

## Endpoints

```bash
# Explain a cron expression in plain English
curl http://localhost:4400/api/v1/explain/*/5%20*%20*%20*%20*
# → "at minutes 0, 5, 10, ..., of every hour"

# Validate
curl http://localhost:4400/api/v1/validate/0%209%20*%20*%201-5

# Next 5 run times
curl "http://localhost:4400/api/v1/next/0%209%20*%20*%20*?count=5"

# Generate cron from description
curl -X POST http://localhost:4400/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{"every":"day","at":{"hour":9,"minute":0}}'

# Common cron expressions
curl http://localhost:4400/api/v1/common
```

## License
MIT

<sub>💡 Host your own stack? <a href="https://m.do.co/c/c8c07a9d3273">Get $200 DigitalOcean credit</a> via lazymac referral link.</sub>
