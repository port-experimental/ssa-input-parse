######################
# Common Variables
######################

base_name             = "{{properties.baseName}}"                        # base name can either be "it" or "ot"
resource_group_name   = "{{properties.resourceGroupName}}" # rename for your region, environment and solution name
location              = "{{properties.location}}"            # The primary location where the resources will be deployed
create_resource_group = {{properties.createResourceGroup}}                       # Create new resource group? Defaults to false

key_vault_name = "{{properties.keyVault.name}}"       # Name of keyvault to store identities
key_vault_rg   = "{{properties.keyVault.resourceGroup}}" # Name of resource group where keyvault is located

app_service_network_config = {
  "1" = {
    application_subnet_name = "{{properties.appServiceNetworkConfig.applicationSubnetName}}"                    # Subnet where private endpoint will be created
    integration_subnet_name = "{{properties.appServiceNetworkConfig.integrationSubnetName}}"             # Subnet where vnet integration will be created
    resource_group_name     = "{{properties.appServiceNetworkConfig.resourceGroupName}}"     # Name of the Virtual Network resource group 
    spoke_vnet_name         = "{{properties.appServiceNetworkConfig.spokeVnetName}}" # Virtual Network name
  }
}

############################################################
# Deploys App Service only - Mandatory Variables
############################################################

app_service_plan = {
  "1" = {
    name                = "{{properties.appServicePlan.name}}"          # App service plan name without prefix
    os_type             = "{{properties.appServicePlan.osType}}"                  # The O/S type for the App Services to be hosted in this plan
    sku_name            = "{{properties.appServicePlan.skuName}}"                     # The SKU for the plan, use the SKU that have vnet integration support
    deploy              = {{properties.appServicePlan.deploy}}                     # Set to >>true<<  to create app service plan
    resource_group_name = "{{properties.appServicePlan.resourceGroupName}}" # resource group name without prefix (it-)
  }
}

{{#ifExists context.runId}}
# Deployment metadata
# Run ID: {{context.runId}}
# Entity: {{context.entity}}
# Blueprint: {{context.blueprint}}
{{/ifExists}}

