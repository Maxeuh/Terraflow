terraform {
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = "0.78.2"
    }
  }
}

provider "proxmox" {
  endpoint   = "https://172.16.100.4:8006/api2/json"
  username   = var.proxmox_user
  password   = var.proxmox_password
  insecure   = true
}

resource "proxmox_virtual_environment_vm" "opnsense_vm" {
  name      = "opnsense"
  vm_id     = 107
  node_name = var.node_name
  started   = false # obligatoire pour modifier les NICs

  dynamic "network_device" {
    for_each = var.network_interfaces
    content {
      bridge  = network_device.value.bridge
      model   = network_device.value.model
      #comment = lookup(network_device.value, "comment", null)
    }
  }
}

#ne pas oublier avant d'importer la vm 107 : 
#Ligne de commande : terraform import proxmox_virtual_environment_vm.opnsense_vm proxmox-projet3a/107

resource "null_resource" "configure_opnsense_interface" {
  depends_on = [proxmox_virtual_environment_vm.opnsense_vm]

  connection {
    type     = "ssh"
    host     = var.opnsense_ip  # IP de la VM OPNsense
    user     = "root"
    password = var.opnsense_password
    # Si tu utilises une clé privée à la place :
    # private_key = file("~/.ssh/id_rsa")
  }

  provisioner "remote-exec" {
    inline = [
      "sh /root/add_interface.sh ${var.interface_id}" # ex: 22
    ]
  }
}
