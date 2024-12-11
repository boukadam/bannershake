to encrypt file, use the following command:

```bash
sops --encrypt --in-place secrets.yaml
```

it will use the public key from [.sops.yaml](../.sops.yaml) file.

helmfile will automatically decrypt the secrets.yaml file thanks to: 

```bash
export SOPS_AGE_KEY_FILE=/Users/mohammed/Dev/bannershake/age-key.txt
```