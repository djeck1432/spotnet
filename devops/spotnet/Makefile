prod:
	@echo "Setting up production environment..."
	@docker compose -f devops/docker-compose.yaml up --build
	@echo "Production environment is ready."

dev:
	@echo "Setting up development environment..."
	@docker compose -f devops/docker-compose.spotnet.dev.yaml up --build

windows:
	@echo "Setting up for Windows..."
	@docker compose -f devops/docker-compose.spotnet.dev-windows.yaml up --build
	@echo "Windows setup completed."

back:
	@echo "Starting backend services..."
	@docker compose -f devops/docker-compose.spotnet.back.yaml up --build
	@echo "Backend services are running."

all:
	@echo "Please specify a target (prod, dev, windows, back)"