import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

def get_installed_packages():
    result = subprocess.run(["paru", "-Qq"], capture_output=True, text=True)
    return result.stdout.splitlines()

def get_aur_packages():
    print("🌐 Pobieram listę zainstalowanych pakietów z AUR (paru -Qm)...")
    result = subprocess.run(["paru", "-Qm"], capture_output=True, text=True)
    aur_packages = set()
    for line in result.stdout.splitlines():
        pkg = line.split()[0]
        aur_packages.add(pkg)
    print(f"  - Pakietów w AUR: {len(aur_packages)}")
    return aur_packages

def is_in_official_repo(pkg):
    try:
        proc = subprocess.run(["pacman", "-Si", pkg], capture_output=True, text=True)
        return (pkg, proc.returncode == 0)
    except Exception:
        return (pkg, False)

def main():
    print("🚀 Startuję generowanie pliku decman_config.py...")

    print("📦 Pobieram listę zainstalowanych pakietów...")
    installed = get_installed_packages()
    print(f"  - Zainstalowanych pakietów: {len(installed)}")

    aur_packages = get_aur_packages()

    aur_selected = []
    official_selected = []

    print("🔍 Sprawdzam przynależność pakietów...")

    with ThreadPoolExecutor(max_workers=20) as executor:
        future_to_pkg = {executor.submit(is_in_official_repo, pkg): pkg for pkg in installed}

        checked = 0
        for future in as_completed(future_to_pkg):
            pkg, in_repo = future.result()
            if pkg in aur_packages:
                aur_selected.append(pkg)
            else:
                if in_repo:
                    official_selected.append(pkg)
                else:
                    print(f"⚠️ {pkg} nie znaleziono w AUR ani repozytorium")

            checked += 1
            if checked % 100 == 0 or checked == len(installed):
                print(f"  🧮 {checked}/{len(installed)} pakietów sprawdzonych...")

    # Generowanie pliku konfiguracyjnego
    with open("decman_config.py", "w") as f:
        f.write("import decman\n\n")
        f.write(f"decman.packages = {official_selected}\n")
        f.write(f"decman.aur_packages = {aur_selected}\n")
        f.write("decman.ignored_packages = []\n")

    print("✅ Gotowe! Plik decman_config.py wygenerowany.")

if __name__ == "__main__":
    main()
