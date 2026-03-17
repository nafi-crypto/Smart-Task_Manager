# Use Maven + Java 17
FROM maven:3.9.9-eclipse-temurin-17

# Set working directory
WORKDIR /app

# Copy all backend files
COPY . .

# Build the application
RUN mvn clean package

# Run the app
CMD ["java", "-jar", "target/smart-task-manager-1.0.0.jar"]