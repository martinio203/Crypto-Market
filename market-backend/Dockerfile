FROM openjdk:21-jdk-slim
RUN apt-get update && apt-get install -y maven
WORKDIR /usr/src/app
COPY market-backend/pom.xml .
RUN mvn dependency:go-offline
COPY market-backend/src /usr/src/app/src
RUN mvn clean package -DskipTests
EXPOSE 8080
CMD ["java", "-jar", "target/market-0.0.1-SNAPSHOT.jar"]