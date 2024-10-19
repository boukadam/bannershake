package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
)

type Item struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	ImageURL    string `json:"query"`
}

func main() {
	file, err := os.Open("data.json")
	if err != nil {
		log.Fatalf("Erreur lors de l'ouverture du fichier data.json: %v", err)
	}
	defer file.Close()

	byteValue, err := ioutil.ReadAll(file)
	if err != nil {
		log.Fatalf("Erreur lors de la lecture du fichier: %v", err)
	}

	var items []Item

	err = json.Unmarshal(byteValue, &items)
	if err != nil {
		log.Fatalf("Erreur lors du parsing du JSON: %v", err)
	}

	for _, item := range items {
		fmt.Printf("## %s\n\n", item.Title)
		fmt.Printf("%s\n\n", item.Description)
		fmt.Printf("![Image](https://bannershake.com/svg?%s)\n\n", item.ImageURL)
  }
}
