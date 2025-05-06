.PHONY: build run stop clean dev logs

# Application name
APP_NAME = passwordless-login

# Default target
all: build run

# Build the Docker image
build:
	docker build --no-cache -t $(APP_NAME) .

# Run the application with Docker Compose
run:
	docker-compose up -d

# Run in development mode (if you create a dev docker-compose file)
dev:
	docker-compose -f docker-compose.dev.yml up

# Stop containers
stop:
	docker-compose down

# Show logs
logs:
	docker-compose logs -f

# Clean up unused Docker resources
clean:
	docker-compose down --rmi local
	docker system prune -f

# Build and run without Docker Compose
build-run:
	docker build --no-cache -t $(APP_NAME) .
	docker run -d -p 5174:5174 --name $(APP_NAME) $(APP_NAME)

# Run npm commands inside the container
npm-install:
	docker-compose run --rm app npm install

npm-build:
	docker-compose run --rm app npm run build

npm-lint:
	docker-compose run --rm app npm run lint 