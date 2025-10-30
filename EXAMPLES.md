# SSA Inputs Parser - Usage Examples

This document provides comprehensive examples of using the SSA Inputs Parser CLI tool.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Azure App Service Deployment](#azure-app-service-deployment)
- [AWS Infrastructure](#aws-infrastructure)
- [Kubernetes Configuration](#kubernetes-configuration)
- [Advanced Template Techniques](#advanced-template-techniques)
- [Error Handling](#error-handling)
- [CI/CD Integration](#cicd-integration)

## Basic Usage

### Simple Variable Substitution

**Input JSON:**
```json
{
  "properties": {
    "projectName": "my-app",
    "environment": "production"
  }
}
```

**Template:**
```hcl
project_name = "{{properties.projectName}}"
environment  = "{{properties.environment}}"
```

**Command:**
```bash
ssa-parser generate \
  -i examples/simple-input.json \
  -t examples/simple-template.tfvars \
  -o output/simple.tfvars
```

**Output:**
```hcl
project_name = "my-app"
environment  = "production"
```

## Azure App Service Deployment

### Complete Azure Configuration

**Input JSON:**
```json
{
  "properties": {
    "baseName": "it",
    "resourceGroupName": "it-cloud-orchestrator-npe",
    "location": "Australia East",
    "createResourceGroup": false,
    "keyVault": {
      "name": "abc",
      "resourceGroup": "cde"
    },
    "appServicePlan": {
      "name": "conpe-appplan",
      "osType": "Linux",
      "skuName": "S1",
      "deploy": true
    }
  },
  "context": {
    "entity": "app-service-deployment",
    "blueprint": "azure-app-service",
    "runId": "run-2024-001"
  }
}
```

**Template:**
```hcl
######################
# Common Variables
######################

base_name             = "{{properties.baseName}}"
resource_group_name   = "{{properties.resourceGroupName}}"
location              = "{{properties.location}}"
create_resource_group = {{properties.createResourceGroup}}

key_vault_name = "{{properties.keyVault.name}}"
key_vault_rg   = "{{properties.keyVault.resourceGroup}}"

app_service_plan = {
  "1" = {
    name    = "{{properties.appServicePlan.name}}"
    os_type = "{{properties.appServicePlan.osType}}"
    sku_name = "{{properties.appServicePlan.skuName}}"
    deploy  = {{properties.appServicePlan.deploy}}
  }
}
```

**Command:**
```bash
ssa-parser generate \
  -i examples/port-ssa-input.json \
  -t examples/template.tfvars \
  -o output/azure-app-service.tfvars \
  --verbose
```

## AWS Infrastructure

### EC2 Instance Configuration

**Input JSON:**
```json
{
  "properties": {
    "instanceType": "t3.medium",
    "amiId": "ami-12345678",
    "region": "us-west-2",
    "tags": {
      "Name": "web-server",
      "Environment": "production",
      "Team": "platform"
    },
    "securityGroups": ["sg-12345", "sg-67890"],
    "enableMonitoring": true
  }
}
```

**Template:**
```hcl
# EC2 Instance Configuration

instance_type = "{{properties.instanceType}}"
ami_id        = "{{properties.amiId}}"
region        = "{{properties.region}}"

tags = {
  Name        = "{{properties.tags.Name}}"
  Environment = "{{properties.tags.Environment}}"
  Team        = "{{properties.tags.Team}}"
}

security_group_ids = [
  {{#each properties.securityGroups}}
  "{{this}}",
  {{/each}}
]

monitoring = {{properties.enableMonitoring}}
```

**Command:**
```bash
ssa-parser generate \
  -i examples/aws-ec2-input.json \
  -t examples/aws-ec2-template.tfvars \
  -o output/aws-ec2.tfvars
```

## Kubernetes Configuration

### Namespace and Resource Limits

**Input JSON:**
```json
{
  "properties": {
    "namespace": "production",
    "resourceLimits": {
      "cpu": "2000m",
      "memory": "4Gi"
    },
    "resourceRequests": {
      "cpu": "500m",
      "memory": "1Gi"
    },
    "replicas": 3,
    "autoScaling": {
      "enabled": true,
      "minReplicas": 2,
      "maxReplicas": 10
    }
  }
}
```

**Template:**
```hcl
namespace = "{{properties.namespace}}"

resource_limits = {
  cpu    = "{{properties.resourceLimits.cpu}}"
  memory = "{{properties.resourceLimits.memory}}"
}

resource_requests = {
  cpu    = "{{properties.resourceRequests.cpu}}"
  memory = "{{properties.resourceRequests.memory}}"
}

replicas = {{properties.replicas}}

{{#if properties.autoScaling.enabled}}
autoscaling = {
  enabled      = true
  min_replicas = {{properties.autoScaling.minReplicas}}
  max_replicas = {{properties.autoScaling.maxReplicas}}
}
{{/if}}
```

## Advanced Template Techniques

### Using Custom Helpers

#### Conditional Rendering with ifExists

**Template:**
```hcl
# Required fields
project_name = "{{properties.projectName}}"

{{#ifExists properties.description}}
# Optional description
description = "{{properties.description}}"
{{/ifExists}}

{{#ifExists properties.tags}}
# Tags
tags = {
  {{#each properties.tags}}
  {{@key}} = "{{this}}"
  {{/each}}
}
{{/ifExists}}
```

#### Case Conversion

**Template:**
```hcl
# Original case
environment = "{{properties.environment}}"

# Uppercase for naming conventions
resource_prefix = "{{uppercase properties.environment}}"

# Lowercase for DNS names
dns_name = "{{lowercase properties.dnsName}}"
```

#### Equality Checks

**Template:**
```hcl
environment = "{{properties.environment}}"

{{#if (eq properties.environment "production")}}
# Production-specific configuration
enable_backup = true
backup_retention_days = 30
{{else}}
# Non-production configuration
enable_backup = false
backup_retention_days = 7
{{/if}}
```

### Nested Object Access

**Input JSON:**
```json
{
  "properties": {
    "network": {
      "vpc": {
        "cidr": "10.0.0.0/16",
        "subnets": {
          "public": ["10.0.1.0/24", "10.0.2.0/24"],
          "private": ["10.0.10.0/24", "10.0.11.0/24"]
        }
      }
    }
  }
}
```

**Template:**
```hcl
# Using nested access
vpc_cidr = "{{properties.network.vpc.cidr}}"

# Using flattened access
vpc_cidr_flat = "{{flat.properties.network.vpc.cidr}}"

# Public subnets
public_subnets = [
  {{#each properties.network.vpc.subnets.public}}
  "{{this}}",
  {{/each}}
]

# Private subnets
private_subnets = [
  {{#each properties.network.vpc.subnets.private}}
  "{{this}}",
  {{/each}}
]
```

## Error Handling

### Handling Missing Files

```bash
# This will fail gracefully with a clear error message
ssa-parser generate \
  -i nonexistent.json \
  -t template.tfvars \
  -o output.tfvars

# Output:
# ❌ Failed to generate TFVars file: Failed to read input JSON from nonexistent.json
```

### Handling Invalid JSON

**Invalid input (missing comma):**
```json
{
  "properties": {
    "name": "test"
    "value": 123
  }
}
```

```bash
ssa-parser generate \
  -i invalid.json \
  -t template.tfvars \
  -o output.tfvars

# Output:
# ❌ Failed to generate TFVars file: Failed to read input JSON...
```

### Verbose Mode for Debugging

```bash
ssa-parser generate \
  -i input.json \
  -t template.tfvars \
  -o output.tfvars \
  --verbose

# Output includes detailed logs:
# 2024-10-30 10:00:00 [info]: Reading input JSON file { inputPath: 'input.json' }
# 2024-10-30 10:00:00 [info]: Input JSON validated successfully { inputPath: 'input.json' }
# 2024-10-30 10:00:00 [info]: Reading template file { templatePath: 'template.tfvars' }
# ...
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Generate TFVars and Deploy

on:
  workflow_dispatch:
    inputs:
      port_payload:
        description: 'Port.io SSA Payload'
        required: true

jobs:
  generate-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build CLI
        run: pnpm build
      
      - name: Save Port payload
        run: echo '${{ github.event.inputs.port_payload }}' > input.json
      
      - name: Generate TFVars
        run: |
          ./bin/run.js generate \
            -i input.json \
            -t templates/production.tfvars \
            -o generated.tfvars \
            --verbose
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
      
      - name: Terraform Init
        run: terraform init
      
      - name: Terraform Plan
        run: terraform plan -var-file=generated.tfvars -out=tfplan
      
      - name: Terraform Apply
        run: terraform apply -auto-approve tfplan
```

### GitLab CI

```yaml
stages:
  - generate
  - deploy

variables:
  PORT_PAYLOAD: $CI_PIPELINE_SOURCE == "trigger" ? $TRIGGER_PAYLOAD : ""

generate_tfvars:
  stage: generate
  image: node:18
  script:
    - npm install -g pnpm
    - pnpm install
    - pnpm build
    - echo "$PORT_PAYLOAD" > input.json
    - ./bin/run.js generate -i input.json -t templates/prod.tfvars -o generated.tfvars
  artifacts:
    paths:
      - generated.tfvars
    expire_in: 1 hour

terraform_deploy:
  stage: deploy
  image: hashicorp/terraform:latest
  dependencies:
    - generate_tfvars
  script:
    - terraform init
    - terraform plan -var-file=generated.tfvars -out=tfplan
    - terraform apply -auto-approve tfplan
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    parameters {
        text(name: 'PORT_PAYLOAD', description: 'Port.io SSA Payload JSON')
    }
    
    stages {
        stage('Setup') {
            steps {
                sh 'npm install -g pnpm'
                sh 'pnpm install'
                sh 'pnpm build'
            }
        }
        
        stage('Generate TFVars') {
            steps {
                writeFile file: 'input.json', text: params.PORT_PAYLOAD
                sh '''
                    ./bin/run.js generate \
                        -i input.json \
                        -t templates/production.tfvars \
                        -o generated.tfvars \
                        --verbose
                '''
            }
        }
        
        stage('Terraform Plan') {
            steps {
                sh 'terraform init'
                sh 'terraform plan -var-file=generated.tfvars -out=tfplan'
            }
        }
        
        stage('Terraform Apply') {
            steps {
                input message: 'Apply Terraform changes?', ok: 'Apply'
                sh 'terraform apply -auto-approve tfplan'
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'generated.tfvars,logs/**/*.log', allowEmptyArchive: true
        }
    }
}
```

## Best Practices

### 1. Template Organization

Keep templates modular and well-commented:

```hcl
######################
# Network Configuration
######################

vpc_id = "{{properties.network.vpcId}}"
subnet_ids = [
  {{#each properties.network.subnetIds}}
  "{{this}}",
  {{/each}}
]

######################
# Compute Configuration
######################

instance_type = "{{properties.compute.instanceType}}"
instance_count = {{properties.compute.count}}
```

### 2. Input Validation

Always validate Port.io payloads before processing:

```typescript
import { PortSsaInputSchema } from 'ssa-inputs-parser';

const result = PortSsaInputSchema.safeParse(portPayload);
if (!result.success) {
  console.error('Invalid payload:', result.error);
  process.exit(1);
}
```

### 3. Use Strict Mode in Production

```bash
# Always use strict mode for production
ssa-parser generate \
  -i input.json \
  -t template.tfvars \
  -o output.tfvars \
  --strict
```

### 4. Version Control Templates

Keep templates in version control and use semantic versioning:

```
templates/
├── v1/
│   ├── aws-ec2.tfvars
│   └── azure-app.tfvars
├── v2/
│   ├── aws-ec2.tfvars
│   └── azure-app.tfvars
└── current -> v2/
```

## Troubleshooting

### Issue: Template Not Rendering Variables

**Problem:** Variables show as `{{variable}}` in output

**Solution:** Check property path in input JSON matches template

```bash
# Enable verbose logging to see data structure
ssa-parser generate -i input.json -t template.tfvars -o output.tfvars --verbose
```

### Issue: Boolean Values as Strings

**Problem:** `"true"` instead of `true`

**Solution:** Don't use quotes around boolean placeholders

```hcl
# Wrong:
enabled = "{{properties.enabled}}"

# Correct:
enabled = {{properties.enabled}}
```

### Issue: Missing Nested Properties

**Problem:** Deep nested properties not accessible

**Solution:** Use flattened access

```hcl
# If {{properties.deep.nested.value}} doesn't work, try:
value = "{{flat.properties.deep.nested.value}}"
```

---

For more examples, see the `examples/` directory in the repository.

