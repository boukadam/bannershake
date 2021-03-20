package main

import (
	"encoding/json"
	"fmt"
	"github.com/otiai10/copy"
	"io/ioutil"
	"os"
	"strings"
)

type BannerShakeLogos struct {
	Name      string `json:"name"`
	Shortname string `json:"shortname"`
	Url       string `json:"url"`
	Icon      string `json:"icon"`
}

type Logos struct {
	Name      string   `json:"name"`
	Shortname string   `json:"shortname"`
	Url       string   `json:"url"`
	Files     []string `json:"files"`
}

const providedLogosBase = "src/static/provided/"
const providedLogosDir = providedLogosBase + "logos/"
const providedLogosPrefix = "provided/logos/"
const logosRepo = "../logos"

var logosBlockedByAdblock = map[string]string{
	"admob.svg":          "_admob.svg",
	"adroll.svg":         "_adroll.svg",
	"google-ads.svg":     "google-ds.svg",
	"google-adwords.svg": "google-dwords.svg",
	"google-adsense.svg": "google-dsense.svg",
}

func main() {
	_ = os.RemoveAll(providedLogosBase)

	jsonFile, err := os.Open(logosRepo + "/logos.json")
	if err != nil {
		fmt.Println(err)
	}
	byteValue, _ := ioutil.ReadAll(jsonFile)

	var logos []Logos
	if err := json.Unmarshal(byteValue, &logos); err != nil {
		panic(err)
	}

	var bannerShakeLogos []BannerShakeLogos
	var logosToRemove []string
	var logosToRename []string
	for _, logo := range logos {
		var icon = logo.Files[0]
		if value, ok := logosBlockedByAdblock[icon]; ok {
			logosToRename = append(logosToRename, icon)
			icon = value
		}
		var logoName = logo.Name
		var logoNameIndexBracket = strings.Index(logoName, "(")
		if logoNameIndexBracket > -1 {
			logoName = strings.TrimSpace(logoName[:logoNameIndexBracket])
		}
		bannerShakeLogo := BannerShakeLogos{
			Name:      logoName,
			Shortname: logo.Shortname,
			Url:       logo.Url,
			Icon:      providedLogosPrefix + icon,
		}
		if len(logo.Files) > 1 {
			for _, logoToRemove := range logo.Files[1:] {
				logosToRemove = append(logosToRemove, logoToRemove)
			}
		}
		bannerShakeLogos = append(bannerShakeLogos, bannerShakeLogo)
	}

	jsonOutput, err := json.MarshalIndent(bannerShakeLogos, "", "  ")
	if err != nil {
		panic(err)
	}

	_ = os.Mkdir(providedLogosBase, 0755)
	_ = ioutil.WriteFile(providedLogosBase + "providedLogos.json", jsonOutput, 0644)
	_ = copy.Copy(logosRepo + "/logos", providedLogosDir)

	for _, logoToRemove := range logosToRemove {
		_ = os.Remove(providedLogosDir + logoToRemove)
	}

	for _, logoToRename := range logosToRename {
		_ = os.Rename(providedLogosDir + logoToRename, providedLogosDir + logosBlockedByAdblock[logoToRename])
	}

}
