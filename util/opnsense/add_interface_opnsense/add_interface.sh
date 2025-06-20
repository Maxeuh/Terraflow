#!/bin/sh

if [ -z "$1" ]; then
  echo "Usage: $0 <XX>  # Exemple: $0 22"
  exit 1
fi

XX="$1"

CONFIG_FILE="/conf/config.xml"
TMP_CONFIG="/tmp/config_new.xml"
BACKUP_FILE="/conf/config.xml.bak"

# Compter les interfaces actuelles (exclut <loopback>)
interface_count=$(xmllint --xpath 'count(/opnsense/interfaces/*[starts-with(name(), "vmbr")])' "$CONFIG_FILE" | cut -d. -f1)

# Définir les variables dynamiquement

YY=$interface_count
YY=$((YY + 1))
Z=$((2 + YY))
INTERFACE_TAG="vmbr${XX}"

# Créer temporairement le bloc XML à injecter
cat > /tmp/new_interface_block.xml <<EOF
    <${INTERFACE_TAG}>
      <enable>1</enable>
      <if>vtnet${YY}</if>
      <mtu/>
      <ipaddr>10.0.${Z}.100</ipaddr>
      <ipaddrv6/>
      <subnet>24</subnet>
      <gateway>WAN_GW</gateway>
      <blockbogons>1</blockbogons>
      <dhcphostname/>
      <media/>
      <mediaopt/>
      <dhcp6-ia-pd-len>0</dhcp6-ia-pd-len>
      <subnetv6/>
      <gatewayv6/>
    </${INTERFACE_TAG}>
EOF

# Injecter le bloc après <interfaces>
awk '
  /<interfaces>/ {
    print
    while ((getline line < "/tmp/new_interface_block.xml") > 0) print line
    next
  }
  { print }
' "$CONFIG_FILE" > "$TMP_CONFIG"

# Sauvegarder et appliquer
cp "$CONFIG_FILE" "$BACKUP_FILE"
mv "$TMP_CONFIG" "$CONFIG_FILE"
echo "Interface ajoutée à config.xml. Redémarre les services OPNsense ou la VM si nécessaire."
