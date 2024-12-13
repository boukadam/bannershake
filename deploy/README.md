Start by generating an age key:
```bash
age-keygen -o age-key.txt
```

Create `.sops.yaml` file in the root of the project with the following content:
```yaml
creation_rules:
  - age: "<public_key_part>"
```

to encrypt file, use the following command:

```bash
sops --encrypt --in-place secrets.yaml
```

it will use the public key from [.sops.yaml](../.sops.yaml) file.

helmfile will automatically decrypt the secrets.yaml file thanks to: 

```bash
export SOPS_AGE_KEY_FILE=/Users/mohammed/Dev/bannershake/age-key.txt
```