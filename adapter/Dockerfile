#-------------------------------------------------------#
# First stage: image to build and test Java application #
#-------------------------------------------------------#
FROM adoptopenjdk/openjdk14-openj9:alpine-slim as builder

WORKDIR /builder

COPY *.gradle /builder/
COPY gradle /builder/gradle
COPY gradlew /builder/gradlew
COPY src/main/resources/application.properties /builder/src/main/resources/application.properties

# Metadata verification process also downloads the dependencies for caching
RUN ./gradlew --write-verification-metadata sha256 

# Build project and run unit tests
COPY src /builder/src
RUN ./gradlew assemble
RUN ./gradlew test

#-------------------------------------------------------#
# Second stage: image to run Java application           #
#-------------------------------------------------------#
FROM adoptopenjdk/openjdk14-openj9:alpine-slim

RUN mkdir /app
WORKDIR /app

ENV SPRING_PROFILES_ACTIVE prod

# Pull the dist files from the builder container
COPY --from=builder /builder/build/libs/* app.jar

# Run app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
