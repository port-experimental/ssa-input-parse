# Simple template demonstrating basic variable substitution

environment = "{{properties.environment}}"
project_name = "{{properties.projectName}}"
region = "{{properties.region}}"

{{#ifExists properties.tags}}
# Tags
tags = {
  team = "{{properties.tags.team}}"
  cost_center = "{{properties.tags.cost-center}}"
}
{{/ifExists}}

{{#ifExists context}}
# Deployment Context
# Entity: {{context.entity}}
# Blueprint: {{context.blueprint}}
# Run ID: {{context.runId}}
{{/ifExists}}

