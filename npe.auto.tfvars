######################
# Common Variables
######################

base_name             = "it"                        
resource_group_name   = "it-cloud-orchestrator-npe"
location              = "Australia East"            
create_resource_group = false                       

key_vault_name = "abc"      
key_vault_rg   = "cde"

app_service_network_config = {
  "1" = {
    application_subnet_name = "sub-abc"                    
    integration_subnet_name = "sub-cde"             
    resource_group_name     = "it-aue1-abc-cde-"     
    spoke_vnet_name         = "it-aue1-npe-abc"
  }
}

############################################################
# Deploys App Service only - Mandatory Variables
############################################################

app_service_plan = {
  "1" = {
    name                = "conpe-appplan"          
    os_type             = "Linux"                  
    sku_name            = "S1"                     
    deploy              = true                    
    resource_group_name = "cloud-orchestrator-npe" 
  }
}


