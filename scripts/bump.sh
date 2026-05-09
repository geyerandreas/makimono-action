#!/usr/bin/env bash

set -Eeuo pipefail

version="${1:-}"

if [[ -z "$version" ]]; then
	echo "Usage: $0 <semver>" >&2
	exit 1
fi

if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z-]+([.][0-9A-Za-z-]+)*)?$ ]]; then
	echo "Invalid SemVer: $version" >&2
	exit 1
fi

root_dir="$(cd "$(dirname "$0")/.." && pwd)"
package_json="$root_dir/package.json"
readme="$root_dir/README.md"

current_version="$(node -p "require('$package_json').version")"

node <<NODE
const fs = require('fs');
const file = '$package_json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
data.version = '$version';
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
NODE

if [[ -f "$readme" ]]; then
    sed -i "" -e "s/$current_version/$version/g" "$readme"
fi
