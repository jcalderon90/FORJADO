const fs = require('fs');
const path = require('path');

const kb = fs.readFileSync(path.join(__dirname, '../callacar-knowledge-base.md'), 'utf8');
const sp = fs.readFileSync(path.join(__dirname, '../cally-system-prompt.md'), 'utf8');

const fullSystemPrompt = sp + '\n\n---\n# CALLACAR KNOWLEDGE BASE (SINGLE SOURCE OF TRUTH)\n\n' + kb + '\n\n## INSTRUCCIÓN TÉCNICA DE INTEGRACIÓN:\nRecibes el mensaje del usuario en el input y debes generar la respuesta que se le enviará por Chatwoot. Responde DIRECTAMENTE con el texto final que verá el visitante (sin formato JSON, sin envoltorios adicionales). Mantén respuestas concisas y directas.';

const workflow = {
  name: "CALLACAR - Cally Agent (Chatwoot)",
  nodes: [
    {
      parameters: {
        httpMethod: "POST",
        path: "callacar-agent-bot",
        options: {}
      },
      id: "wh-trigger-callacar",
      name: "Webhook Chatwoot",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [100, 300],
      webhookId: "callacar-agent-bot"
    },
    {
      parameters: {
        conditions: {
          options: {
            caseSensitive: true,
            leftValue: "",
            typeValidation: "strict",
            version: 2
          },
          conditions: [
            {
              id: "cond-event",
              leftValue: "={{ $json.body.event }}",
              rightValue: "message_created",
              operator: {
                type: "string",
                operation: "equals",
                name: "filter.operator.equals"
              }
            },
            {
              id: "cond-msg-type",
              leftValue: "={{ $json.body.message_type }}",
              rightValue: "incoming",
              operator: {
                type: "string",
                operation: "equals",
                name: "filter.operator.equals"
              }
            },
            {
              id: "cond-content",
              leftValue: "={{ $json.body.content }}",
              rightValue: "",
              operator: {
                type: "string",
                operation: "notEmpty",
                singleValue: true
              }
            }
          ],
          combinator: "and"
        },
        options: {}
      },
      id: "filter-incoming-callacar",
      name: "Filter Incoming Messages",
      type: "n8n-nodes-base.if",
      typeVersion: 2.2,
      position: [320, 300]
    },
    {
      parameters: {
        jsCode: 'const b = $input.first().json.body || {};\nconst conv = b.conversation || {};\nconst sender = b.sender || {};\n\nreturn [{\n  json: {\n    conversationId: conv.id,\n    inboxId: conv.inbox_id,\n    accountId: conv.account_id || 1,\n    contactId: sender.id,\n    contactName: sender.name || "Visitor",\n    contactEmail: sender.email || "",\n    contactPhone: sender.phone_number || "",\n    message: (b.content || "").trim(),\n    messageId: b.id\n  }\n}];'
      },
      id: "extract-context-callacar",
      name: "Extract Context",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [540, 200]
    },
    {
      parameters: {
        promptType: "define",
        text: "={{ $json.message }}",
        options: {
          systemMessage: fullSystemPrompt
        }
      },
      id: "cally-agent-node",
      name: "Cally Agent",
      type: "@n8n/n8n-nodes-langchain.agent",
      typeVersion: 1.7,
      position: [780, 200]
    },
    {
      parameters: {
        model: "deepseek/deepseek-v4.1-flash",
        options: {
          temperature: 0.3,
          maxTokens: 1000
        }
      },
      id: "openrouter-model-callacar",
      name: "OpenRouter Model",
      type: "@n8n/n8n-nodes-langchain.lmChatOpenRouter",
      typeVersion: 1,
      position: [740, 420],
      credentials: {
        openRouterApi: {
          id: "KNEcvGOGnJM5hUjH",
          name: "OpenRouter CALLACAR"
        }
      }
    },
    {
      parameters: {
        sessionIdType: "customKey",
        sessionKey: "={{ $('Extract Context').item.json.conversationId }}",
        contextWindowLength: 10
      },
      id: "win-memory-callacar",
      name: "Window Buffer Memory",
      type: "@n8n/n8n-nodes-langchain.memoryBufferWindow",
      typeVersion: 1.4,
      position: [592, 336]
    },
    {
      parameters: {
        method: "POST",
        url: '={{ "https://forjado-chatwoot.duckdns.org/api/v1/accounts/" + $("Extract Context").first().json.accountId + "/conversations/" + $("Extract Context").first().json.conversationId + "/messages" }}',
        sendHeaders: true,
        headerParameters: {
          parameters: [
            {
              name: "api_access_token",
              value: "6pcnQ6N1Wpn8ytdxN9CTsv2A"
            },
            {
              name: "Content-Type",
              value: "application/json"
            }
          ]
        },
        sendBody: true,
        specifyBody: "json",
        jsonBody: '={{ { content: $json.output || $json.text, message_type: "outgoing", private: false } }}',
        options: {}
      },
      id: "send-reply-callacar",
      name: "Reply to Chatwoot",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [1040, 200]
    }
  ],
  connections: {
    "Webhook Chatwoot": {
      main: [
        [
          {
            node: "Filter Incoming Messages",
            type: "main",
            index: 0
          }
        ]
      ]
    },
    "Filter Incoming Messages": {
      main: [
        [
          {
            node: "Extract Context",
            type: "main",
            index: 0
          }
        ]
      ]
    },
    "Extract Context": {
      main: [
        [
          {
            node: "Cally Agent",
            type: "main",
            index: 0
          }
        ]
      ]
    },
    "OpenRouter Model": {
      ai_languageModel: [
        [
          {
            node: "Cally Agent",
            type: "ai_languageModel",
            index: 0
          }
        ]
      ]
    },
    "Window Buffer Memory": {
      ai_memory: [
        [
          {
            node: "Cally Agent",
            type: "ai_memory",
            index: 0
          }
        ]
      ]
    },
    "Cally Agent": {
      main: [
        [
          {
            node: "Reply to Chatwoot",
            type: "main",
            index: 0
          }
        ]
      ]
    }
  },
  settings: {
    executionOrder: "v1"
  }
};

const targetPath = path.join(__dirname, 'CALLACAR-CALLY-AGENT.json');
fs.writeFileSync(targetPath, JSON.stringify(workflow, null, 2), 'utf8');
console.log('Successfully written:', targetPath);
