package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

var MONGO = "mongodb://mongoadmin:hola123@34.66.127.53/Fase2Sopes1?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false"

func sendToMongo(game_info string) {
	client, _ := mongo.NewClient(options.Client().ApplyURI(MONGO))
	var logGame interface{}
	err := bson.UnmarshalExtJSON([]byte(game_info), true, &logGame)
	if err != nil {
		log.Fatal(err)
	}
	collection := client.Database("Fase2Sopes1").Collection("log")
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)
	res, insertErr := collection.InsertOne(ctx, logGame)
	if insertErr != nil {
		log.Fatal(insertErr)
	}
	fmt.Println(res)
}

func main() {
	conn, err := amqp.Dial("amqp://guest:guest@35.184.181.185")
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	err = ch.ExchangeDeclare(
		"logs",   // name
		"fanout", // type
		true,     // durable
		false,    // auto-deleted
		false,    // internal
		false,    // no-wait
		nil,      // arguments
	)
	failOnError(err, "Failed to declare an exchange")

	q, err := ch.QueueDeclare(
		"",    // name
		false, // durable
		false, // delete when unused
		true,  // exclusive
		false, // no-wait
		nil,   // arguments
	)
	failOnError(err, "Failed to declare a queue")

	err = ch.QueueBind(
		q.Name, // queue name
		"",     // routing key
		"logs", // exchange
		false,
		nil,
	)
	failOnError(err, "Failed to bind a queue")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	failOnError(err, "Failed to register a consumer")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			sendToMongo(string(d.Body[:]))
			log.Printf(" [x] %s", d.Body)
		}
	}()

	log.Printf(" [*] Waiting for logs. To exit press CTRL+C")
	<-forever
}
