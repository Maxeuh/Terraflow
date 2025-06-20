variable "proxmox_password" {
  type      = string
  sensitive = true
}

variable "opnsense_api_key" {
  type      = string
  sensitive = true
}

variable "opnsense_api_secret" {
  type      = string
  sensitive = true
}

variable "vm_template_id" {
  type    = number
  default = 108
}

variable "vm_node" {
  type    = string
  default = "proxmox-projet3a"
}

variable "vm_name" {
  type    = string
  default = "new-vm"
}

variable "ip_address" {
  type    = string
  default = "192.168.1.102"
}

variable "dns_domain" {
  type    = string
  default = "projet3a.local"
}

variable "dns_server" {
  type    = string
  default = "1.1.1.1"
}

variable "bridge" {
  type    = string
  default = "vmbr1"
}

variable "ip_range_start" {
  description = "Début de la plage d'adresses IP"
  default     = "192.168.1.100"
}

variable "ip_range_end" {
  description = "Fin de la plage d'adresses IP"
  default     = "192.168.1.200"
}

