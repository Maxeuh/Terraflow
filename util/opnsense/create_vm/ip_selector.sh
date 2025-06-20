#!/bin/bash

# Variables
IP_START=192.168.1.100
IP_END=192.168.1.200

# Hypothétique commande pour lister IPs réservées (à adapter selon ton API)
used_ips=$(curl -s -k -H "Dk9R3MjEvTZ6KnNR/sx3mGaWXiDnXzGqG7vG+X28WNjnxnjpgWq0UzfrIybwtHIIIBwvsGUCJLCB7pZZ":"0AdiFe9kakSpvNFV1H+ZpjirsJe39oTk/f9ElXETu8kgPGY9neBZ8k6TLzKM5zARacsIo5cbfhUx0eAD" https://10.0.1.100/kea/dhcp/v4/reservations | jq -r '.[].ip_address')

# Fonction pour convertir IP en entier
ip2int() {
  local a b c d
  IFS=. read -r a b c d <<< "$1"
  echo $((a * 256**3 + b * 256**2 + c * 256 + d))
}

int2ip() {
  local ui32=$1
  echo "$(( (ui32 >> 24) & 0xFF )).$(( (ui32 >> 16) & 0xFF )).$(( (ui32 >> 8) & 0xFF )).$(( ui32 & 0xFF ))"
}

start_int=$(ip2int $IP_START)
end_int=$(ip2int $IP_END)

# Cherche IP libre dans la plage
for ((ip=$start_int; ip<=$end_int; ip++)); do
  candidate=$(int2ip $ip)
  if ! grep -q "$candidate" <<< "$used_ips"; then
    echo "IP libre trouvée : $candidate"
    echo "reserved_ip = \"$candidate\"" > terraform.auto.tfvars
    exit 0
  fi
done

echo "Erreur: aucune IP libre trouvée"
exit 1
