# compare_packages.py
import tomllib
import subprocess

with open('gen.toml', 'rb') as f:
    data = tomllib.load(f)

gen_packages = set(data['managers']['system']['items'])
gen_packages = {x.strip().split()[0] for x in gen_packages}  # remove args like --noconfirm

installed = subprocess.run(['pacman', '-Qq'], capture_output=True, text=True)
installed_packages = set(installed.stdout.strip().split('\n'))

print("🔻 Missing packages:")
print("\n".join(sorted(gen_packages - installed_packages)))

print("\n🔺 Extra packages:")
print("\n".join(sorted(installed_packages - gen_packages)))
