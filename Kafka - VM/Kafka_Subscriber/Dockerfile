FROM golang:1.16
WORKDIR /Kafka_Subscriber
COPY . .
RUN  go mod download
EXPOSE 50051
CMD ["go","run","main.go"]