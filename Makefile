lint: check

check:
	pre-commit run --all-files

configure:
	brew bundle
	tfenv install
	tflint --init

init:
	cd ./infrastructure/environments/prod && terraform init

plan:
	cd ./infrastructure/environments/prod && terraform plan

apply:
	cd ./infrastructure/environments/prod && terraform apply
