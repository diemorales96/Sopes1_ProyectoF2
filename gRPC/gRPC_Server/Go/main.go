package main

import (
	"context"
	"log"
	"net"

	pb "./proto/juego.proto"

	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedJuegosServer
}
type GameResult struct {
	Players       int64  `json:"players"`
	Game_id       int64  `json:"game_id"`
	Game_name     string `json:"game_name"`
	Winner_number string `json:"winner_number"`
	Queue         string `json:"queue"`
}

func (s *server) Exec_Games(ctx context.Context, in *pb.JuegoRequest) (GameResult, error) {

	result := GameResult{}
	if in.GetGameId() == 1 {
		result = gameNumberOne(in)
	} else if in.GetGameId() == 2 {
		result = gameNumberTwo(in)
	} else if in.GetGameId() == 3 {
		result = gameNumberThree(in)
	} else if in.GetGameId() == 4 {
		result = gameNumberFour(in)
	} else if in.GetGameId() == 5 {
		result = gameNumberFive(in)
	}

	//log.Printf("Received: %v", in.GetOperacion())
	return result, nil
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterJuegosServer(s, &server{})
	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

func gameNumberOne(prueba *pb.JuegoRequest) GameResult {
	resultado := GameResult{}
	resultado.Game_id = prueba.GameId
	resultado.Players = prueba.Players
	resultado.Game_name = prueba.GameName
	resultado.Winner_number = "3"
	resultado.Queue = "Kafka"
	return resultado
}

func gameNumberTwo(prueba *pb.JuegoRequest) GameResult {
	resultado := GameResult{}
	resultado.Game_id = prueba.GameId
	resultado.Players = prueba.Players
	resultado.Game_name = prueba.GameName
	resultado.Winner_number = "8"
	resultado.Queue = "Kafka"
	return resultado
}

func gameNumberThree(prueba *pb.JuegoRequest) GameResult {
	resultado := GameResult{}
	resultado.Game_id = prueba.GameId
	resultado.Players = prueba.Players
	resultado.Game_name = prueba.GameName
	resultado.Winner_number = "13"
	resultado.Queue = "Kafka"
	return resultado
}

func gameNumberFour(prueba *pb.JuegoRequest) GameResult {
	resultado := GameResult{}
	resultado.Game_id = prueba.GameId
	resultado.Players = prueba.Players
	resultado.Game_name = prueba.GameName
	resultado.Winner_number = "43"
	resultado.Queue = "Kafka"
	return resultado
}
func gameNumberFive(prueba *pb.JuegoRequest) GameResult {
	resultado := GameResult{}
	resultado.Game_id = prueba.GameId
	resultado.Players = prueba.Players
	resultado.Game_name = prueba.GameName
	resultado.Winner_number = "23"
	resultado.Queue = "Kafka"
	return resultado
}
