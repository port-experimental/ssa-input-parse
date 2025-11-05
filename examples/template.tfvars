######################
# Common Variables
######################

base_name             = "{{properties.baseName}}"                        
resource_group_name   = "{{properties.resourceGroupName}}" 
location              = "{{properties.location}}"            
create_resource_group = {{properties.createResourceGroup}}                       

key_vault_name = "{{properties.keyVault.name}}"       
key_vault_rg   = "{{properties.keyVault.resourceGroup}}" 

app_service_network_config = {
  "1" = {
    application_subnet_name = "{{properties.appServiceNetworkConfig.applicationSubnetName}}"                    
    integration_subnet_name = "{{properties.appServiceNetworkConfig.integrationSubnetName}}"            
    resource_group_name     = "{{properties.appServiceNetworkConfig.resourceGroupName}}"    
    spoke_vnet_name         = "{{properties.appServiceNetworkConfig.spokeVnetName}}" 
  }
}

############################################################
# Deploys App Service only - Mandatory Variables
############################################################

app_service_plan = {
  "1" = {
    name                = "{{properties.appServicePlan.name}}"          
    os_type             = "{{properties.appServicePlan.osType}}"                  
    sku_name            = "{{properties.appServicePlan.skuName}}"                     
    deploy              = {{properties.appServicePlan.deploy}}                    
    resource_group_name = "{{properties.appServicePlan.resourceGroupName}}" 
  }
}

{{#ifExists context.runId}}
# Deployment metadata
# Run ID: {{context.runId}}
# Entity: {{context.entity}}
# Blueprint: {{context.blueprint}}
{{/ifExists}}

