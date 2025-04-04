import subprocess
import re
from typing import List, Dict

def get_latest_version(package: str) -> str:
    """Get the latest version of a package from PyPI."""
    try:
        result = subprocess.run(
            ['pip', 'index', 'versions', package],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            # Extract version from output like: "Available versions: 1.0.0, 1.0.1, 1.1.0"
            versions = result.stdout.split('Available versions:')[1].strip().split(',')
            return versions[0].strip()  # First version is the latest
    except Exception as e:
        print(f"Error getting version for {package}: {e}")
    return None

def update_requirements():
    """Update all packages and requirements.txt."""
    print("Updating pip...")
    subprocess.run(['pip', 'install', '--upgrade', 'pip'], check=True)
    
    print("\nUpdating all packages...")
    subprocess.run(['pip', 'install', '--upgrade', '--upgrade-strategy', 'eager', 'pip-tools'], check=True)
    
    # List of test packages to ensure they're included
    test_packages = [
        'coverage',
        'pytest',
        'pytest-django',
        'pytest-cov'
    ]
    
    # Install test packages
    print("\nInstalling/updating test packages...")
    for package in test_packages:
        subprocess.run(['pip', 'install', '--upgrade', package], check=True)
    
    # Generate new requirements.txt
    print("\nGenerating new requirements.txt...")
    with open('requirements.txt', 'w') as f:
        # Get all installed packages
        result = subprocess.run(['pip', 'freeze'], capture_output=True, text=True)
        packages = result.stdout.splitlines()
        
        # Write main packages
        f.write("# Main dependencies\n")
        for package in packages:
            if not any(p in package.lower() for p in ['pytest', 'coverage']):
                f.write(f"{package}\n")
        
        # Write test packages
        f.write("\n# Testing dependencies\n")
        for package in packages:
            if any(p in package.lower() for p in ['pytest', 'coverage']):
                f.write(f"{package}\n")
    
    print("\nDone! Updated requirements.txt with latest versions.")

if __name__ == "__main__":
    update_requirements() 