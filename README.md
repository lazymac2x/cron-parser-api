[![lazymac API Store](https://img.shields.io/badge/lazymac-API%20Store-blue?style=flat-square)](https://lazymac2x.github.io/lazymac-api-store/) [![Gumroad](https://img.shields.io/badge/Buy%20on-Gumroad-ff69b4?style=flat-square)](https://coindany.gumroad.com/) [![MCPize](https://img.shields.io/badge/MCP-MCPize-green?style=flat-square)](https://mcpize.com/mcp/cron-parser-api)

# cron-parser-api

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
