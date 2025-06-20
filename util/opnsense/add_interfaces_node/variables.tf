variable "proxmox_user" {
  description = "Nom d'utilisateur Proxmox (ex: root@pam)"
  type        = string
}

variable "proxmox_password" {
  description = "Mot de passe de l'utilisateur Proxmox"
  type        = string
  sensitive   = true
}

variable "bridges" {
  type = map(object({
    address = string
    comment = string
  }))
  default = {
    vmbr20 = {
      address = "10.0.1.100/16"
      comment = "Bridge 2"
    }
    vmbr30 = {
      address = "10.0.3.100/16"
      comment = "Bridge 3"
    }
    vmbr40 = {
      address = "10.0.4.100/16"
      comment = "Bridge 22"
    }
    vmbr50 = {
      address = "10.0.8.100/16"
      comment = "Bridge 22"
    }
  }
}
variable "interface_id" {
  description = "ID de l'interface à ajouter (ex: 22)"
  type        = number
  default     = 50
}