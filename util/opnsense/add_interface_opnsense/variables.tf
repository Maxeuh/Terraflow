variable "proxmox_user" {
  type        = string
  description = "Nom d'utilisateur Proxmox (ex: root@pam)"
}

variable "proxmox_password" {
  type        = string
  description = "Mot de passe"
  sensitive   = true
}

variable "node_name" {
  type        = string
  description = "Nom du nœud Proxmox"
}

variable "vm_id" {
  type        = number
  description = "ID de la VM OPNsense"
}

variable "bridge_name" {
  type        = string
  description = "Nom du bridge auquel connecter l'interface (ex: vmbr15)"
}

# Liste des interfaces réseau à gérer
variable "network_interfaces" {
  type = list(object({
    bridge  = string
    model   = string
    comment = optional(string)
  }))
  default = [
    { bridge = "vmbr2", model = "virtio" },        # Interface existante
    { bridge = "vmbr3", model = "virtio", comment = "Nouvelle interface" },
      # Ajoutée
    { bridge = "vmbr40", model = "virtio", comment = "Nouvelle interface" },
    { bridge = "vmbr50", model = "virtio", comment = "Nouvelle interface" },
  ]
}

variable "interface_id" {
  description = "ID de l'interface à ajouter (ex: 22)"
  type        = number
  default     = 50
}

variable "opnsense_password" {
  description = "Mot de passe de l'utilisateur admin d'OPNsense"
  type        = string
  sensitive   = true
}

variable "opnsense_ip" {
  description = "Adresse IP de l'instance OPNsense"
  type        = string
}