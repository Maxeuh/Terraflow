terraform {
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = "0.78.2"
    }
    opnsense = {
      source  = "browningluke/opnsense"
      version = "0.11.0"
    }
  }
}

# ----------- Provider Proxmox ------------
provider "proxmox" {
  endpoint = "https://172.16.100.4:8006/"
  insecure = true
  username = "root@pam"
  password = var.proxmox_password
}

# ----------- Provider OPNsense ------------
provider "opnsense" {
  uri        = "https://10.0.1.100"
  api_key    = var.opnsense_api_key
  api_secret = var.opnsense_api_secret
  allow_insecure   = true
}

resource "random_id" "mac_suffix" {
  byte_length = 4
}

locals {
  mac_address = format(
    "02:00:%02x:%02x:%02x:%02x",
    parseint(substr(random_id.mac_suffix.hex, 0, 2), 16),
    parseint(substr(random_id.mac_suffix.hex, 2, 2), 16),
    parseint(substr(random_id.mac_suffix.hex, 4, 2), 16),
    parseint(substr(random_id.mac_suffix.hex, 6, 2), 16)
  )
}


# ----------- Clonage VM Proxmox ------------
resource "proxmox_virtual_environment_vm" "vm-clone" {
  name      = var.vm_name
  node_name = var.vm_node

  clone {
    vm_id = var.vm_template_id
  }

  memory {
    dedicated = 768
  }

  network_device {
    bridge      = var.bridge
    model       = "virtio"
    mac_address = local.mac_address
  }

  initialization {
    dns {
      servers = [var.dns_server]
    }
    ip_config {
      ipv4 {
        address = "dhcp"
      }
    }
  }
}

# Recherche dynamique du subnet KEA (nécessite que le subnet existe déjà)
data "opnsense_kea_subnet" "target_subnet" {
  id = "8c210c48-864c-4fae-92d0-90a69c7e3121"
}



# ----------- DHCP Static Reservation avec Kea ------------

# Réservation DHCP avec la MAC dynamique
resource "opnsense_kea_reservation" "dhcp_reservation" {
  subnet_id   = data.opnsense_kea_subnet.target_subnet.id
  mac_address = local.mac_address
  ip_address  = var.ip_address
  hostname    = var.vm_name
  description = "DHCP reservation for ${var.vm_name}"
}


# Override DNS Unbound
resource "opnsense_unbound_host_override" "dns_override" {
  enabled     = true
  hostname    = var.vm_name
  domain      = var.dns_domain
  server      = var.ip_address
  description = "DNS entry for ${var.vm_name}"
}


output "mac_address" {
  value = local.mac_address
}

output "reserved_ip" {
  value = var.ip_address
}