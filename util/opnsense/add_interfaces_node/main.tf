terraform {
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = "0.78.2"
    }
  }
}

provider "proxmox" {
  endpoint       = "https://...:8006/api2/json"
  username         = "root@pam"
  password     = var.proxmox_password
  insecure = true
}

resource "proxmox_virtual_environment_network_linux_bridge" "bridge" {
  for_each  = var.bridges

  node_name = "proxmox-projet3a"
  name      = each.key
  address   = each.value.address
  comment   = each.value.comment
}

