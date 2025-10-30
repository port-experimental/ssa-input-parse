######################
# Common Variables
######################

base_name             = "it"                        # base name can either be "it" or "ot"
resource_group_name   = "it-cloud-orchestrator-npe" # rename for your region, environment and solution name: remove prefix (it-) if the rg needs to be created
location              = "Australia East"            # The primary location where the resources will be deployed
create_resource_group = false                       # Create new resource group? Defaults to false

key_vault_name = "abc"       # Name of keyvault to store identities
key_vault_rg   = "cde" # Name of resource group where keyvault is located

app_service_network_config = {
  "1" = {
    application_subnet_name = "sub-abc"                    # Subnet where private endpoint will be created
    integration_subnet_name = "sub-cde"             # Subnet where vnet integration will be created
    resource_group_name     = "it-aue1-abc-cde-"     # Name of the Virtual Network resource group 
    spoke_vnet_name         = "it-aue1-npe-abc" # Virtual Network name
  }
}

############################################################
# Deploys App Service only - Mandatory Variables
############################################################

app_service_plan = {
  "1" = {
    name                = "conpe-appplan"          # App service plan name without prefix
    os_type             = "Linux"                  # The O/S type for the App Services to be hosted in this plan, allowed values are Windows and Linux, empty string if deploy = false
    sku_name            = "S1"                     # The SKU for the plan, use the SKU that have vnet integration support, empty string if deploy = false
    deploy              = true                     # Set to >>true<<  to create app service plan, >>false<< for exsiting app service plan 
    resource_group_name = "cloud-orchestrator-npe" # resource group name without prefix (it-)
  }
}


