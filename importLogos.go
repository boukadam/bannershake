package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path"
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
const logosRepo = "logos"

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
	_ = ioutil.WriteFile(providedLogosBase+"providedLogos.json", jsonOutput, 0644)
	_ = CopyDir(logosRepo+"/logos", providedLogosDir)

	for _, logoToRemove := range logosToRemove {
		_ = os.Remove(providedLogosDir + logoToRemove)
	}

	for _, logoToRename := range logosToRename {
		_ = os.Rename(providedLogosDir+logoToRename, providedLogosDir+logosBlockedByAdblock[logoToRename])
	}

}

func CopyDir(src string, dst string) error {
	var err error
	var fds []os.FileInfo
	var srcinfo os.FileInfo

	if srcinfo, err = os.Stat(src); err != nil {
		return err
	}

	if err = os.MkdirAll(dst, srcinfo.Mode()); err != nil {
		return err
	}

	if fds, err = ioutil.ReadDir(src); err != nil {
		return err
	}
	for _, fd := range fds {
		srcfp := path.Join(src, fd.Name())
		dstfp := path.Join(dst, fd.Name())

		if fd.IsDir() {
			if err = CopyDir(srcfp, dstfp); err != nil {
				fmt.Println(err)
			}
		} else {
			if err = CopyFile(srcfp, dstfp); err != nil {
				fmt.Println(err)
			}
		}
	}
	return nil
}

func CopyFile(src, dst string) error {
	var err error
	var srcfd *os.File
	var dstfd *os.File
	var srcinfo os.FileInfo

	if srcfd, err = os.Open(src); err != nil {
		return err
	}
	defer srcfd.Close()

	if dstfd, err = os.Create(dst); err != nil {
		return err
	}
	defer dstfd.Close()

	if _, err = io.Copy(dstfd, srcfd); err != nil {
		return err
	}
	if srcinfo, err = os.Stat(src); err != nil {
		return err
	}
	return os.Chmod(dst, srcinfo.Mode())
}
