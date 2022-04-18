package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Client is instance of module, the attribute is DB instance
type Client struct {
	DB *sqlx.DB
}

// NewClient is function to create new instance of Post module.
func NewClient(db *sqlx.DB) (c Client) {
	return Client{
		DB: db,
	}
}

// Post is object structure of real-world post model
type GameResult struct {
	Game_id       int64  `json:"game_id"`
	Game_name     string `json:"game_name"`
	Winner_number string `json:"winner_number"`
}

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

func sendToTiDB(game_info string) {
	// create the db instance using valid db connection string
	db, err := sqlx.Connect("mysql",
		"root:@tcp(34.122.236.108:4000)/Fase2Sopes1?parseTime=true")
	if err != nil {
		log.Fatalln(err.Error())
	}
	// create post instance module by passing db pool
	postClient := NewClient(db)
	// run the insert script to db
	fmt.Println("STRING: ", game_info)
	logGame := GameResult{}
	json.Unmarshal([]byte(game_info), &logGame)

	fmt.Println("LOG interface: ", logGame)
	result, err := postClient.DB.Exec(`
			INSERT INTO Resultado (game_id, game_name, winner)
			VALUES (?, ?, ?)
		`,
		logGame.Game_id, logGame.Game_name, logGame.Winner_number)
	if err != nil {
		log.Println(err)
		return
	}

	fmt.Println("Tidb Result: ", result)

	fmt.Println("po", postClient)
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
			sendToTiDB(string(d.Body[:]))
			log.Printf(" [x] %s", d.Body)
		}
	}()

	log.Printf(" [*] Waiting for logs. To exit press CTRL+C")
	<-forever
}
